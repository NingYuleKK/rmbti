const assert = require("assert/strict");
const config = require("./data");
const engine = require("./engine");

const allA = Array(config.questions.length).fill(0);
const allAResult = engine.scoreAnswers(config, allA);

assert.equal(allAResult.primaryId, "deep");
assert.equal(allAResult.secondaryId, "burst");
assert.deepEqual(allAResult.primaryScores, {
  deep: 22,
  saver: 9,
  ctrl: 0,
  loyal: 13,
  myth: 0,
  rare: 3,
  king: 6,
  clutch: 1
});
assert.deepEqual(allAResult.secondaryScores, {
  burst: 13,
  steady: 0,
  heroic: 0,
  timing: 3
});
assert.deepEqual(allAResult.mirrorTags, ["公屏欢迎", "排面截图", "控局位", "灯"]);

const withoutMirror = config.questions.map((question) => (question.type === "mirror" ? 1 : 0));
const withMirrorChanged = config.questions.map((question) => (question.type === "mirror" ? 3 : 0));
const withoutMirrorScores = engine.scoreAnswers(config, withoutMirror);
const withMirrorChangedScores = engine.scoreAnswers(config, withMirrorChanged);

assert.deepEqual(withMirrorChangedScores.primaryScores, withoutMirrorScores.primaryScores);
assert.deepEqual(withMirrorChangedScores.secondaryScores, withoutMirrorScores.secondaryScores);

const primaryTieConfig = {
  ...config,
  questions: [
    {
      id: 1,
      type: "primary_regular",
      prompt: "primary tie base",
      options: [{ label: "A", text: "tie", scores: [{ target: "deep", points: 5 }, { target: "saver", points: 5 }] }]
    },
    {
      id: 6,
      type: "primary_discriminator",
      prompt: "deep discriminator",
      options: [{ label: "A", text: "deep", scores: [{ target: "deep", points: 5 }] }]
    },
    {
      id: 9,
      type: "primary_turnoff",
      prompt: "saver turnoff",
      options: [{ label: "A", text: "saver", scores: [{ target: "saver", points: 5 }] }]
    }
  ]
};
const primaryTieResult = engine.scoreAnswers(primaryTieConfig, [0, 0, 0]);

assert.equal(primaryTieResult.primaryScores.deep, primaryTieResult.primaryScores.saver);
assert.equal(primaryTieResult.primaryId, "deep");
assert.ok(
  primaryTieResult.primaryDiscriminatorScores.deep >
    primaryTieResult.primaryDiscriminatorScores.saver
);

const secondaryTieConfig = {
  ...config,
  questions: [
    {
      id: 5,
      type: "secondary_regular",
      prompt: "secondary tie base",
      options: [{ label: "A", text: "tie", scores: [{ target: "burst", points: 5 }, { target: "steady", points: 5 }] }]
    },
    {
      id: 10,
      type: "secondary_regular",
      prompt: "burst equalizer",
      options: [{ label: "A", text: "burst", scores: [{ target: "burst", points: 4 }] }]
    },
    {
      id: 17,
      type: "secondary_turnoff",
      prompt: "steady q17",
      options: [{ label: "A", text: "steady", scores: [{ target: "steady", points: 4 }] }]
    }
  ]
};
const secondaryTieResult = engine.scoreAnswers(secondaryTieConfig, [0, 0, 0]);

assert.equal(secondaryTieResult.secondaryScores.burst, secondaryTieResult.secondaryScores.steady);
assert.equal(secondaryTieResult.secondaryId, "steady");
assert.ok(
  secondaryTieResult.secondaryTurnoffScores.steady >
    secondaryTieResult.secondaryTurnoffScores.burst
);

console.log("RMBTI scoring tests passed.");
