const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const originalSource = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const anchor = '\n})();';
const hook = `
  globalThis.__scoringTest = {
    selected, calculate, beginResults, finishResults,
    state: () => ({lastMetrics, resultPrimary})
  };
`;

function instrument(source) {
  // Add observation only at the IIFE exit; keep every original statement intact.
  assert.equal(source.split(anchor).length - 1, 1, 'Exactly one IIFE exit is required');
  assert.ok(source.trimEnd().endsWith(anchor), 'IIFE exit must end the script');
  return source.replace(anchor, hook + anchor);
}

function element(id = '') {
  return {
    id, children: [], style: {}, dataset: {}, attributes: {}, textContent: '',
    classList: { toggle() {} },
    set innerHTML(value) { this.html = value; this.children = []; },
    get innerHTML() { return this.html || ''; },
    setAttribute(name, value) { this.attributes[name] = value; },
    appendChild(child) { this.children.push(child); return child; },
    closest() { return element(); }
  };
}

function createHarness(locale = 'ja') {
  assert.ok(['ja', 'en', 'ko'].includes(locale), 'Supported test locale is required');
  const pathname = locale === 'ja' ? '/' : `/${locale}/`;
  const html = fs.readFileSync(path.join(root, locale === 'ja' ? 'index.html' : `${locale}/index.html`), 'utf8');
  const elements = new Map([...html.matchAll(/\bid="([^"]+)"/g)]
    .map((match) => [match[1], element(match[1])]));
  const screens = ['intro', 'quiz', 'tie', 'result'].map((id) => elements.get(id));
  const document = {
    body: element(), documentElement: element(),
    getElementById: (id) => elements.get(id) || null,
    createElement: () => element(),
    querySelector(selector) {
      assert.equal(selector, 'meta[name="description"]', 'Unexpected DOM selector');
      return element();
    },
    querySelectorAll(selector) {
      if (selector === '.screen') return screens;
      assert.equal(selector, '[data-lang]', 'Unexpected DOM selector');
      return [];
    }
  };
  const context = vm.createContext({ window: {}, location: { pathname }, document,
    scrollTo() {} });
  vm.runInContext(fs.readFileSync(path.join(root, 'js/data.js'), 'utf8'), context,
    { filename: 'js/data.js', timeout: 1000 });
  vm.runInContext(instrument(originalSource), context,
    { filename: 'js/app.js (observation hook only)', timeout: 1000 });
  assert.ok(context.__scoringTest, 'Observation hook did not execute');
  const api = context.__scoringTest;
  return {
    api, document, elements,
    answer(answers) {
      api.selected.clear();
      answers.forEach((types, round) => types.forEach((type) => {
        api.selected.set(`${round}-${type}`, { round, type, text: `Type ${type}` });
      }));
    },
    metrics() { return JSON.parse(JSON.stringify(api.calculate())); },
    state() { return JSON.parse(JSON.stringify(api.state())); }
  };
}

module.exports = { createHarness, instrument, originalSource };
