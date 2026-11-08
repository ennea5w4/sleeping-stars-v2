const { test, before, after, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { positions, words, tieLabels } = require('./ja-fixtures.cjs');
const { startServer } = require('./server.cjs');

// Keep all installed packages and browser artifacts outside the checkout.
const runtimePath = process.env.SS_E2E_RUNTIME;
assert.ok(runtimePath && path.isAbsolute(runtimePath), 'Set SS_E2E_RUNTIME to an external absolute path');
const root = path.resolve(__dirname, '../..');
const relative = path.relative(root, runtimePath);
assert.ok(relative.startsWith(`..${path.sep}`) || relative === '..',
  'SS_E2E_RUNTIME must be outside the checkout');
const { chromium } = require(path.join(runtimePath, 'node_modules/playwright-core'));
let browser, server, context, page;
let pageErrors, failedResources;

before(async () => {
  server = await startServer();
  try {
    browser = await chromium.launch({
      executablePath: process.env.SS_E2E_BROWSER || '/usr/bin/chromium', headless: true
    });
  } catch (error) {
    await server.close();
    throw error; // Never turn an unavailable browser into a passing or skipped run.
  }
  console.log(`E2E browser: Chromium ${browser.version()}`);
  console.log(`Playwright core: ${require(path.join(runtimePath, 'node_modules/playwright-core/package.json')).version}`);
});

after(async () => {
  try { if (browser) await browser.close(); }
  finally { if (server) await server.close(); }
});

beforeEach(async () => {
  pageErrors = [];
  failedResources = [];
  context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'ja-JP' });
  // External Google Fonts are outside the scoring-flow scope. No app response is mocked.
  await context.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    if (url.origin === server.url) return route.continue();
    if (['fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname)) return route.abort();
    failedResources.push(`Unexpected external request: ${url.origin}${url.pathname}`);
    return route.abort();
  });
  page = await context.newPage();
  page.setDefaultTimeout(5000);
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('response', (response) => {
    if (response.url().startsWith(server.url) && response.status() >= 400) {
      failedResources.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on('requestfailed', (request) => {
    if (request.url().startsWith(server.url)) failedResources.push(request.url());
  });
  const response = await page.goto(server.url, { waitUntil: 'load' });
  assert.equal(response.status(), 200);
  assert.equal(await page.locator('html').getAttribute('lang'), 'ja');
  await page.locator('#start').click();
  await assertScreen('quiz');
});

afterEach(async () => {
  try {
    assert.deepEqual(pageErrors, [], 'No browser JavaScript errors');
    assert.deepEqual(failedResources, [], 'All requested local application resources load');
  } finally { if (context) await context.close(); }
});

async function assertScreen(screen) {
  await page.locator(`#${screen}.active`).waitFor({ state: 'visible' });
  assert.equal(await page.locator('body').getAttribute('data-screen'), screen);
}
function word(round, type) {
  return page.locator('#words button').nth(positions[round].indexOf(type));
}
async function choose(round, type) {
  const button = word(round, type);
  assert.equal(await button.textContent(), words[round][type - 1]);
  await button.click();
}
async function assertQuestion(round) {
  assert.equal(await page.locator('#step').textContent(), `STAR FIELD ${round + 1} / 8`);
  assert.equal(await page.locator('#words button').count(), 9);
  assert.deepEqual(await page.locator('#words button').allTextContents(),
    positions[round].map((type) => words[round][type - 1]));
}
async function next() { await page.locator('#next').click(); }
async function finishUniform(type, fromRound = 0) {
  for (let round = fromRound; round < 8; round++) {
    await assertQuestion(round);
    await choose(round, type);
    await next();
  }
}
async function assertResult(type, picked) {
  await assertScreen('result');
  assert.equal(await page.locator('#resultType').textContent(), `Type ${type}`);
  assert.deepEqual(await page.locator('#picked span').allTextContents(), picked);
  const image = page.locator('#familyDuoImage');
  await image.waitFor({ state: 'visible' });
  assert.equal(await image.evaluate((node) => node.complete && node.naturalWidth > 0), true);
}

test('E00: the local server serves unchanged app code and rejects test/runtime paths', async () => {
  const response = await fetch(`${server.url}/js/app.js`);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), await fs.readFile(path.join(root, 'js/app.js'), 'utf8'));
  for (const pathname of ['/tests/e2e/ja.test.cjs', '/.git/HEAD', '/node_modules/playwright-core/package.json']) {
    const denied = await fetch(server.url + pathname);
    assert.equal(denied.status, 404);
    await denied.arrayBuffer();
  }
});

test('E01: zero selections block Next on every one of the eight fields', async () => {
  for (let round = 0; round < 8; round++) {
    await assertQuestion(round);
    assert.equal(await page.locator('#next').isDisabled(), true);
    // Native browser interaction on disabled Next cannot advance the field.
    await page.locator('#next').focus();
    await page.keyboard.press('Enter');
    await assertQuestion(round);
    await choose(round, 5);
    assert.equal(await page.locator('#next').isEnabled(), true);
    await next();
  }
  await assertResult(5, words.map((row) => row[4]));
});

test('E02: every field accepts 1–3 words and ignores the fourth selection', async () => {
  for (let round = 0; round < 8; round++) {
    for (let type = 1; type <= 3; type++) {
      await choose(round, type);
      assert.equal(await page.locator('#words [aria-pressed="true"]').count(), type);
      assert.equal(await page.locator('#count').textContent(), String(round * 3 + type));
      assert.equal(await page.locator('#next').isEnabled(), true);
    }
    await choose(round, 4);
    assert.equal(await word(round, 4).getAttribute('aria-pressed'), 'false');
    assert.equal(await page.locator('#words [aria-pressed="true"]').count(), 3);
    assert.equal(await page.locator('#count').textContent(), String((round + 1) * 3));
    await next();
  }
  await assertScreen('tie');
  assert.deepEqual(await page.locator('#tieChoices button').allTextContents(), tieLabels);
  await page.locator('#tieChoices button').nth(2).click();
  await assertResult(3, words.flatMap((row) => row.slice(0, 3)));
});

for (let type = 1; type <= 9; type++) {
  test(`E03/E09: all eight displayed positions for Type ${type} lead to its normal result`, async () => {
    await finishUniform(type);
    await assertResult(type, words.map((row) => row[type - 1]));
  });
}

test('E04: deselection clears the button and affects the final score', async () => {
  for (let round = 0; round < 8; round++) {
    await choose(round, 1);
    await choose(round, 2);
    await choose(round, 1);
    assert.equal(await word(round, 1).getAttribute('aria-pressed'), 'false');
    assert.equal(await word(round, 2).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#words [aria-pressed="true"]').count(), 1);
    assert.equal(await page.locator('#count').textContent(), String(round + 1));
    await next();
  }
  // Retaining the removed choices would produce a two-way tie, not this result.
  await assertResult(2, words.map((row) => row[1]));
});

test('E05: Back retains answers; changing an earlier answer changes the result', async () => {
  // Before editing, Type 1 would win: both score 24, but Type 1 has focus 12.
  const answers = [1,1,2,2,2,2,1,1];
  for (let round = 0; round < 7; round++) {
    await choose(round, answers[round]);
    await next();
  }
  await page.locator('#back').click();
  await assertQuestion(6);
  assert.equal(await word(6, 1).getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('#count').textContent(), '7');
  await choose(6, 1);
  assert.equal(await page.locator('#next').isDisabled(), true);
  await choose(6, 2);
  await next();
  await assertQuestion(7);
  await choose(7, 1);
  await next();
  await assertResult(2, words.map((row, round) => row[(round === 6 ? 2 : answers[round]) - 1]));
});

test('E06: starting again resets all eight fields and the old scoring state', async () => {
  await finishUniform(1);
  await assertResult(1, words.map((row) => row[0]));
  await page.locator('#restart').click();
  await assertScreen('intro');
  await page.locator('#start').click();
  for (let round = 0; round < 8; round++) {
    await assertQuestion(round);
    assert.equal(await page.locator('#words [aria-pressed="true"]').count(), 0);
    assert.equal(await page.locator('#count').textContent(), String(round));
    assert.equal(await page.locator('#next').isDisabled(), true);
    await choose(round, 9);
    await next();
  }
  await assertResult(9, words.map((row) => row[8]));
});

for (const count of [2,3]) {
  for (let chosen = 1; chosen <= count; chosen++) {
    test(`E07/E08: ${count}-way Final Star displays exact candidates; choose Type ${chosen}`, async () => {
      for (let round = 0; round < 8; round++) {
        for (let type = 1; type <= count; type++) await choose(round, type);
        await next();
      }
      await assertScreen('tie');
      assert.equal(await page.locator('#tieTitle').textContent(), '最後の一星');
      assert.deepEqual(await page.locator('#tieChoices button').allTextContents(), tieLabels.slice(0, count));
      await page.locator('#tieChoices button').nth(chosen - 1).click();
      await assertResult(chosen, words.flatMap((row) => row.slice(0, count)));
    });
  }
}
