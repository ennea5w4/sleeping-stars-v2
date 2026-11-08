const test = require('node:test');
const assert = require('node:assert/strict');
const fixtures = require('./fixtures/scoring.cjs');
const { createHarness, instrument, originalSource } = require('./helpers/scoring-harness.cjs');

const ids = [1,2,3,4,5,6,7,8,9];
const zero = () => ids.map(() => [0,0,0]);
function rows(metrics) {
  return ids.map((type) => {
    const item = metrics.m[type];
    assert.equal(item.type, type);
    return [item.score, item.solo, item.focus];
  });
}
function checkFixture(h, fixture) {
  const metrics = h.metrics();
  assert.deepEqual(rows(metrics), fixture.rows);
  assert.deepEqual(metrics.ranked.map((x) => x.type), fixture.ranked);
  assert.deepEqual(metrics.tied.map((x) => x.type), fixture.tied);
  // Also check that the ranked/tied records contain the original full metrics.
  for (const item of [...metrics.ranked, ...metrics.tied]) {
    assert.deepEqual(item, metrics.m[item.type]);
  }
  return metrics;
}
function resultTypes(h) {
  return [...h.elements.get('blend').textContent.matchAll(/Type (\d+)「/g)]
    .map((match) => Number(match[1]));
}
function permutations(items) {
  if (items.length === 0) return [[]];
  return items.flatMap((item, index) => permutations(items.filter((_, i) => i !== index))
    .map((rest) => [item, ...rest]));
}

test('Harness fails closed when the observation hook cannot be inserted', () => {
  assert.throws(() => instrument(originalSource.replace('\n})();', '')), /Exactly one/);
  assert.throws(() => instrument(originalSource + '\n})();'), /Exactly one/);
  assert.throws(() => instrument(originalSource + '\nthrow 1;'), /must end/);
  // Removing only the observation text reconstructs the complete original source.
  const instrumented = instrument(originalSource);
  const added = instrumented.slice(originalSource.lastIndexOf('\n})();'),
    instrumented.lastIndexOf('\n})();'));
  assert.equal(instrumented.replace(added, ''), originalSource);
});

for (const type of ids) {
  test(`S01: Type ${type}, one selection gives 6 points and one solo`, () => {
    const h = createHarness();
    h.answer([[type]]);
    const expected = zero();
    expected[type - 1] = [6,1,0];
    assert.deepEqual(rows(h.metrics()), expected);
  });
}

test('S02: two selections give 3 points each, without a solo', () => {
  const h = createHarness();
  h.answer([[1,9]]);
  assert.deepEqual(rows(h.metrics()), [[3,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],
    [0,0,0],[0,0,0],[0,0,0],[3,0,0]]);
});

test('S03: three selections give 2 points each, without a solo', () => {
  const h = createHarness();
  h.answer([[1,5,9]]);
  assert.deepEqual(rows(h.metrics()), [[2,0,0],[0,0,0],[0,0,0],[0,0,0],[2,0,0],
    [0,0,0],[0,0,0],[0,0,0],[2,0,0]]);
});

test('S04: all eight answers for one type give (48,8,12)', () => {
  const h = createHarness();
  h.answer(fixtures.single.answers);
  checkFixture(h, fixtures.single);
});

test('S05: all 6,561 selection-count combinations total 48 (not all answer patterns)', () => {
  const h = createHarness();
  let checked = 0;
  for (let code = 0; code < 6561; code++) {
    let rest = code;
    const answers = Array.from({ length: 8 }, (_, round) => {
      const count = rest % 3 + 1;
      rest = Math.floor(rest / 3);
      return Array.from({ length: count }, (_, index) => (round + index) % 9 + 1);
    });
    h.answer(answers);
    const m = h.metrics();
    assert.equal(Object.values(m.m).reduce((sum, item) => sum + item.score, 0), 48,
      `selection-count combination ${code}`);
    checked++;
  }
  assert.equal(checked, 6561);
});

test('S06: score beats both solo count and Field 7/8 points', () => {
  const h = createHarness();
  h.answer(fixtures.score.answers);
  checkFixture(h, fixtures.score);
});

test('S07/S09: at equal score, more solos win even with fewer focus points', () => {
  const h = createHarness();
  h.answer(fixtures.solo.answers);
  checkFixture(h, fixtures.solo);
  // Type 3 (12,2,0) must beat Type 2 (12,1,6).
});

test('S08: focus breaks a tie only after score and solo are equal', () => {
  const h = createHarness();
  h.answer(fixtures.focus.answers);
  checkFixture(h, fixtures.focus);
  // Type 5 (9,1,3) must beat Type 1 (9,1,0).
});

for (const [name, fixture] of Object.entries(fixtures)) {
  test(`S10: exchanging Field 7 and Field 8 preserves all metrics: ${name}`, () => {
    const h = createHarness();
    const answers = fixture.answers.map((picks) => [...picks]);
    [answers[6], answers[7]] = [answers[7], answers[6]];
    h.answer(answers);
    checkFixture(h, fixture);
    h.api.beginResults();
    if (fixture.tied.length > 1) {
      h.elements.get('tieChoices').children.at(-1).onclick();
      assert.deepEqual(resultTypes(h), [fixture.tied.at(-1), fixture.seconds.at(-1)]);
    } else {
      assert.deepEqual(resultTypes(h), [fixture.ranked[0], fixture.ranked[1]]);
    }
  });

  test(`S11: selection insertion order preserves all metrics: ${name}`, () => {
    const h = createHarness();
    // Change one field at a time, including all six orders of a triple.
    fixture.answers.forEach((picks, round) => {
      for (const order of permutations(picks)) {
        const answers = fixture.answers.map((types) => [...types]);
        answers[round] = order;
        h.answer(answers);
        checkFixture(h, fixture);
      }
    });
  });
}

for (const count of [2,3,4,5,6]) {
  const fixture = fixtures[`tie${count}`];
  test(`Final tie: exactly ${count} candidates, in the existing order`, () => {
    const h = createHarness();
    h.answer(fixture.answers);
    checkFixture(h, fixture);
    h.api.beginResults();
    assert.equal(h.document.body.dataset.screen, 'tie');
    assert.equal(h.elements.get('tieChoices').children.length, count);
  });

  fixture.tied.forEach((type, index) => {
    test(`Final tie ${count}: choosing Type ${type} preserves metrics and selects the existing secondary`, () => {
      const h = createHarness();
      h.answer(fixture.answers);
      const before = checkFixture(h, fixture);
      const selectedBefore = JSON.stringify([...h.api.selected]);
      h.api.beginResults();
      const candidate = h.elements.get('tieChoices').children[index];
      // Confirm candidate order/identity through the real localized tie text.
      assert.equal(typeof candidate.textContent, 'string');
      assert.ok(candidate.textContent.length > 0);
      candidate.onclick();
      assert.equal(h.document.body.dataset.screen, 'result');
      assert.equal(h.elements.get('resultType').textContent, `Type ${type}`);
      assert.equal(h.state().resultPrimary, type);
      assert.deepEqual(resultTypes(h), [type, fixture.seconds[index]]);
      assert.deepEqual(h.state().lastMetrics, before);
      assert.deepEqual(h.metrics(), before);
      assert.equal(JSON.stringify([...h.api.selected]), selectedBefore);
    });
  });
}

test('S12: one unanswered field gives 42, not 48, with no validation error', () => {
  const h = createHarness();
  h.answer([[1],[1],[1],[1],[1],[1],[1],[]]);
  assert.deepEqual(rows(h.metrics()), [[42,7,6], ...zero().slice(1)]);
});

test('S13: empty internal answers give nine zero-score tied types', () => {
  const h = createHarness();
  h.answer([]);
  const m = h.metrics();
  assert.deepEqual(rows(m), zero());
  assert.deepEqual(m.ranked.map((x) => x.type), ids);
  assert.deepEqual(m.tied.map((x) => x.type), ids);
  h.api.beginResults();
  assert.equal(h.document.body.dataset.screen, 'tie');
  assert.equal(h.elements.get('tieChoices').children.length, 9);
});

test('Invalid internal state: four selections split 6 into 1.5 each; no rejection', () => {
  const h = createHarness();
  h.answer([[1,2,3,4]]);
  assert.deepEqual(rows(h.metrics()), [[1.5,0,0],[1.5,0,0],[1.5,0,0],[1.5,0,0],
    [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]);
});

test('Invalid internal state: duplicate values under different Map keys count twice, without solo', () => {
  const h = createHarness();
  h.api.selected.set('first', { round: 6, type: 1 });
  h.api.selected.set('duplicate', { round: 6, type: 1 });
  assert.deepEqual(rows(h.metrics()), [[6,0,6], ...zero().slice(1)]);
});

test('Invalid internal state: out-of-range and string round numbers are ignored', () => {
  const h = createHarness();
  for (const [index, round] of [-1,8,'0',null].entries()) {
    h.api.selected.set(String(index), { round, type: 1 });
  }
  assert.deepEqual(rows(h.metrics()), zero());
});

for (const type of [0,10]) {
  test(`Invalid internal state: Type ${type} in a valid round throws TypeError`, () => {
    const h = createHarness();
    h.answer([[type]]);
    // VM exceptions have a different prototype from the test runner's errors.
    assert.throws(() => h.api.calculate(), { name: 'TypeError' });
  });
}

test('Existing secondary: unique scoring Type 5 still displays zero-score Type 1', () => {
  const h = createHarness();
  h.answer(fixtures.single.answers);
  const before = checkFixture(h, fixtures.single);
  h.api.beginResults();
  assert.equal(h.document.body.dataset.screen, 'result');
  assert.deepEqual(resultTypes(h), [5,1]);
  assert.deepEqual(h.state().lastMetrics, before);
});
