const existing = require('../fixtures/scoring.cjs');
const rows = [
  [[48,8,12],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
  [[0,0,0],[48,8,12],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
  [[0,0,0],[0,0,0],[48,8,12],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
  [[0,0,0],[0,0,0],[0,0,0],[48,8,12],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
  [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[48,8,12],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
  [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[48,8,12],[0,0,0],[0,0,0],[0,0,0]],
  [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[48,8,12],[0,0,0],[0,0,0]],
  [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[48,8,12],[0,0,0]],
  [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[48,8,12]]
];
const rankings = [
  [1,2,3,4,5,6,7,8,9], [2,1,3,4,5,6,7,8,9], [3,1,2,4,5,6,7,8,9],
  [4,1,2,3,5,6,7,8,9], [5,1,2,3,4,6,7,8,9], [6,1,2,3,4,5,7,8,9],
  [7,1,2,3,4,5,6,8,9], [8,1,2,3,4,5,6,7,9], [9,1,2,3,4,5,6,7,8]
];
const cases = {};
for (let type = 1; type <= 9; type++) {
  cases[`uniform${type}`] = {
    answers: Array.from({ length: 8 }, () => [type]),
    rows: rows[type - 1], ranked: rankings[type - 1], tied: [type]
  };
}
for (const name of ['solo', 'focus', 'score', 'tie2', 'tie3']) cases[name] = existing[name];

// 14 answer sets; exercising all final choices produces 17 browser cases per locale.
const browserCases = Object.entries(cases).flatMap(([name, fixture]) => {
  const choices = name === 'score' ? [1] : fixture.tied;
  return choices.map((primary) => ({
    key: `${name}/choose${primary}`, name, fixture, primary,
    secondary: fixture.tied.length > 1
      ? fixture.seconds[fixture.tied.indexOf(primary)] : fixture.ranked[1]
  }));
});
module.exports = { cases, browserCases };
