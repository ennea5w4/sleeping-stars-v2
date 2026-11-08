const test = require('node:test');
const assert = require('node:assert/strict');
const { createHarness } = require('./helpers/scoring-harness.cjs');
const { cases: fixtures } = require('./e2e/locales-cases.cjs');
const snapshots = require('./e2e/locales-snapshot.json');

for (const locale of ['ja', 'en', 'ko']) {
  for (const [name, fixture] of Object.entries(fixtures)) {
    test(`T4 Unit ${locale}/${name}: fixed score, solo, focus, ranking and tied candidates`, () => {
      const h = createHarness(locale);
      assert.equal(h.document.documentElement.lang, locale);
      h.answer(fixture.answers);
      const actual = h.metrics();
      assert.deepEqual(Array.from({ length: 9 }, (_, i) => {
        const metric = actual.m[i + 1];
        return [metric.score, metric.solo, metric.focus];
      }), fixture.rows);
      assert.deepEqual(actual.ranked.map((item) => item.type), fixture.ranked);
      assert.deepEqual(actual.tied.map((item) => item.type), fixture.tied);
      h.api.beginResults();
      if (fixture.tied.length > 1) {
        assert.deepEqual(h.elements.get('tieChoices').children.map((button) => button.textContent),
          fixture.tied.map((type) => snapshots[locale].types[type][5]));
      }
      assert.deepEqual(h.state().lastMetrics, actual);
    });
  }
}
