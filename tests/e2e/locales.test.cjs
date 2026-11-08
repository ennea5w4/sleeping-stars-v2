const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { startServer } = require('./server.cjs');
const { positions } = require('./ja-fixtures.cjs');
const snapshots = require('./locales-snapshot.json');
const { browserCases } = require('./locales-cases.cjs');

const runtime = process.env.SS_E2E_RUNTIME;
const root = path.resolve(__dirname, '../..');
assert.ok(runtime && path.isAbsolute(runtime), 'SS_E2E_RUNTIME must be an external absolute path');
assert.ok(path.relative(root, runtime).startsWith(`..${path.sep}`), 'Keep runtime outside checkout');
const { chromium } = require(path.join(runtime, 'node_modules/playwright-core'));
const results = { ja: {}, en: {}, ko: {} };
let server, browser;

before(async () => {
  server = await startServer();
  browser = await chromium.launch({ executablePath: process.env.SS_E2E_BROWSER || '/usr/bin/chromium', headless: true });
  console.log(`T4 Chromium ${browser.version()}, Playwright ${require(path.join(runtime, 'node_modules/playwright-core/package.json')).version}`);
});
after(async () => {
  try { if (browser) await browser.close(); }
  finally { if (server) await server.close(); }
});

async function text(page, selector, expected) {
  const locator = page.locator(selector);
  assert.equal(await locator.isVisible(), true, `${selector} visible`);
  // innerText reflects the existing CSS text-transform on .brand.
  const transform = await locator.evaluate((node) => getComputedStyle(node).textTransform);
  const rendered = transform === 'uppercase' ? expected.toUpperCase() : expected;
  assert.equal((await locator.innerText()).trim(), rendered.trim(), selector);
  assert.ok(expected.trim().length, `${selector} nonempty`);
  const box = await locator.boundingBox();
  assert.ok(box && box.width > 0 && box.height > 0, `${selector} nonzero box`);
}
async function screen(page, id) {
  await page.locator(`#${id}.active`).waitFor({ state: 'visible' });
  assert.equal(await page.locator('body').getAttribute('data-screen'), id);
}
async function noJapanese(page, locale) {
  if (locale === 'ja') return;
  const visible = await page.locator('main').evaluate((main) => {
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) {
      const parent = walker.currentNode.parentElement;
      if (parent && !parent.closest('nav.lang-switch') && parent.getClientRects().length) {
        texts.push(walker.currentNode.textContent);
      }
    }
    return texts.join(' ');
  });
  assert.doesNotMatch(visible, /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}]/u,
    `${locale}: no Japanese scripts in visible main text, excluding language navigation`);
  assert.doesNotMatch(visible, /undefined|null|\{(?:first|second|value|type)/u);
}
async function imageLoaded(page, selector) {
  await page.waitForFunction((selector) => {
    const image = document.querySelector(selector);
    return image && image.complete && image.naturalWidth > 0;
  }, selector);
}

test('T4 infrastructure: all three HTML pages are unmodified; test/runtime paths are excluded', async () => {
  for (const [pathname, filename] of [['/', 'index.html'], ['/en/', 'en/index.html'], ['/ko/', 'ko/index.html']]) {
    const response = await fetch(server.url + pathname);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), await fs.readFile(path.join(root, filename), 'utf8'));
  }
  for (const pathname of ['/tests/e2e/locales.test.cjs', '/.git/HEAD', '/node_modules/playwright-core/package.json']) {
    const response = await fetch(server.url + pathname);
    assert.equal(response.status, 404);
    await response.arrayBuffer();
  }
});

for (const locale of ['ja', 'en', 'ko']) {
  for (const scenario of browserCases) {
    test(`T4 browser ${locale}/${scenario.key}`, async () => {
      const context = await browser.newContext({
        locale: { ja: 'ja-JP', en: 'en-US', ko: 'ko-KR' }[locale],
        viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce'
      });
      const errors = [], resources = [];
      try {
        await context.route('**/*', (route) => {
          const url = new URL(route.request().url());
          if (url.origin === server.url) return route.continue();
          if (['fonts.googleapis.com', 'fonts.gstatic.com'].includes(url.hostname)) return route.abort();
          resources.push(`Unexpected external request: ${url.origin}${url.pathname}`);
          return route.abort();
        });
        const page = await context.newPage();
        page.setDefaultTimeout(5000);
        page.on('pageerror', (error) => errors.push(error.message));
        page.on('response', (response) => {
          if (response.url().startsWith(server.url) && response.status() >= 400) resources.push(`${response.status()} ${response.url()}`);
        });
        page.on('requestfailed', (request) => {
          if (request.url().startsWith(server.url)) resources.push(request.url());
        });
        const local = snapshots[locale], ui = local.ui;
        const response = await page.goto(server.url + (locale === 'ja' ? '/' : `/${locale}/`), { waitUntil: 'load' });
        assert.equal(response.status(), 200);
        assert.equal(await page.locator('html').getAttribute('lang'), locale);
        assert.equal(await page.title(), local.meta.title);
        assert.equal(await page.locator('meta[name="description"]').getAttribute('content'), local.meta.description);
        await screen(page, 'intro');
        for (const id of ['subhead', 'lead', 'detail', 'start', 'notice']) await text(page, `#${id}`, ui[id]);
        assert.deepEqual(await page.locator('#meta span').allTextContents(), ui.meta);
        await imageLoaded(page, '#introArt');
        assert.equal(await page.locator('#introArt').getAttribute('alt'), ui.introAlt);
        await noJapanese(page, locale);
        await page.locator('#start').click();

        for (let round = 0; round < 8; round++) {
          await screen(page, 'quiz');
          await text(page, '#step', `STAR FIELD ${round + 1} / 8`);
          await text(page, '#fieldTitle', local.fields[round][0]);
          await text(page, '#choiceGuide', ui.choiceGuide);
          await text(page, '#next', round === 7 ? ui.see : ui.next);
          if (round > 0) await text(page, '#back', ui.back);
          const buttons = page.locator('#words button');
          assert.equal(await buttons.count(), 9);
          assert.deepEqual(await buttons.allTextContents(), positions[round].map((type) => local.fields[round][1][type - 1]));
          for (let index = 0; index < 9; index++) assert.equal(await buttons.nth(index).isVisible(), true);
          assert.equal(await page.locator('#next').isDisabled(), true);
          for (const type of scenario.fixture.answers[round]) {
            await buttons.nth(positions[round].indexOf(type)).click();
          }
          assert.equal(await page.locator('#words [aria-pressed="true"]').count(), scenario.fixture.answers[round].length);
          await noJapanese(page, locale);
          await page.locator('#next').click();
        }

        const candidates = scenario.fixture.tied;
        let observedCandidates;
        if (candidates.length > 1) {
          await screen(page, 'tie');
          await text(page, '#tieTitle', ui.tieTitle);
          await text(page, '#tieLead', ui.tieLead);
          const labels = await page.locator('#tieChoices button').allTextContents();
          assert.deepEqual(labels, candidates.map((type) => local.types[type][5]));
          observedCandidates = labels.map((label) => Number(Object.keys(local.types)
            .find((type) => local.types[type][5] === label)));
          for (let index = 0; index < candidates.length; index++) {
            await text(page, `#tieChoices button:nth-child(${index + 1})`, local.types[candidates[index]][5]);
          }
          await noJapanese(page, locale);
          await page.locator('#tieChoices button').nth(candidates.indexOf(scenario.primary)).click();
        }
        await screen(page, 'result');
        await text(page, '#resultType', `Type ${scenario.primary}`);
        const typeText = local.types[scenario.primary];
        for (const [id, index] of [['resultName',0],['attract',1],['value',2],['tired',3],['hintText',4]]) {
          await text(page, `#${id}`, typeText[index]);
        }
        for (let index = 0; index < 4; index++) await text(page, `#insight${index}`, ui.insights[index]);
        for (const [id, key] of [['resultBrand','resultBrand'],['pickedTitle','picked'],['overlapTitle','overlap'],
          ['familyLead','familyLead'],['familyCaption','familyCaption'],['saveTitle','saveTitle'],['saveLead','saveLead'],
          ['saveWallpaper','wallpaper'],['saveShare','share'],['storyLead','storyLead'],['storyLink','story'],
          ['storySource','storySource'],['restart','restart']]) await text(page, `#${id}`, ui[key]);
        const expectedBlend = local.blend.replace('{first}', scenario.primary)
          .replace('{firstName}', typeText[0]).replace('{second}', scenario.secondary)
          .replace('{secondName}', local.types[scenario.secondary][0]);
        await text(page, '#blend', expectedBlend);
        assert.deepEqual(await page.locator('#picked span').allTextContents(), scenario.fixture.answers
          .flatMap((types, round) => types.map((type) => local.fields[round][1][type - 1])));
        assert.equal(await page.locator('#paidLink').isVisible(), locale === 'ja');
        if (locale === 'ja') await text(page, '#paidLink', ui.paid);
        else assert.equal(await page.locator('#familyReading').isVisible(), false);
        await imageLoaded(page, '#familyDuoImage');
        await noJapanese(page, locale);
        const displayed = [...(await page.locator('#blend').innerText()).matchAll(/Type (\d+)/g)].map((match) => Number(match[1]));
        assert.deepEqual(displayed, [scenario.primary, scenario.secondary]);
        results[locale][scenario.key] = {
          primary: displayed[0], secondary: displayed[1],
          candidates: observedCandidates || [displayed[0]]
        };
      } finally {
        await context.close();
        assert.deepEqual(errors, [], `${locale}: browser JavaScript errors`);
        assert.deepEqual(resources, [], `${locale}: local resource or unexpected external errors`);
      }
    });
  }
}

test('T4 comparison: all 17 completed response cases agree across ja/en/ko', () => {
  assert.equal(Object.keys(results.ja).length, 17);
  assert.equal(Object.keys(results.en).length, 17);
  assert.equal(Object.keys(results.ko).length, 17);
  assert.deepEqual(results.en, results.ja);
  assert.deepEqual(results.ko, results.ja);
});
