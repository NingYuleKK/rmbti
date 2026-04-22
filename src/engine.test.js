const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");
const config = require("./data");
const engine = require("./engine");

const indexHtml = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf8");
const html2canvasUrl = indexHtml.match(/src="([^"]*html2canvas[^"]*)"/)?.[1];

assert.equal(html2canvasUrl, "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
assert.ok(!/\s/.test(html2canvasUrl), "html2canvas CDN URL must not contain whitespace");

// All-A scenario
const allA = Array(config.questions.length).fill(0);
const allAResult = engine.scoreAnswers(config, allA);

assert.equal(allAResult.primaryId, "deep");
assert.equal(allAResult.secondaryId, "burst");
assert.equal(allAResult.mirrorDetails.length, 4);
assert.equal(allAResult.mirrorDetails[0].tone, "你需要被明确看见、被列队欢迎");
assert.deepEqual(allAResult.primaryScores, {
  deep: 15,
  saver: 5,
  ctrl: 0,
  loyal: 6,
  myth: 1,
  rare: 2,
  king: 8,
  clutch: 1
});
assert.deepEqual(allAResult.secondaryScores, {
  burst: 9,
  steady: 4,
  heroic: 0,
  timing: 7
});
assert.deepEqual(allAResult.mirrorTags, ["排面欢迎", "排面截图", "控局位", "灯"]);

// Card images exist
config.primaryOrder.forEach((id) => {
  const imagePath = path.resolve(__dirname, config.primary[id].imageSrc);
  assert.ok(fs.existsSync(imagePath), `${id} card image should exist at ${config.primary[id].imageSrc}`);
});

// Mirror questions don't affect primary/secondary scores
const withoutMirror = config.questions.map((question) => (question.type === "mirror" ? 1 : 0));
const withMirrorChanged = config.questions.map((question) => (question.type === "mirror" ? 3 : 0));
const withoutMirrorScores = engine.scoreAnswers(config, withoutMirror);
const withMirrorChangedScores = engine.scoreAnswers(config, withMirrorChanged);

assert.deepEqual(withMirrorChangedScores.primaryScores, withoutMirrorScores.primaryScores);
assert.deepEqual(withMirrorChangedScores.secondaryScores, withoutMirrorScores.secondaryScores);

// Primary tiebreaker: discriminator wins
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
      id: 10,
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

// Secondary tiebreaker: turnoff wins
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
      id: 14,
      type: "secondary_turnoff",
      prompt: "steady turnoff",
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

// Question count
assert.equal(config.questions.length, 20, "Should have exactly 20 questions");

// All 8 primary personalities should be reachable (have scoring questions)
const scoredPrimaries = new Set();
config.questions.forEach((q) => {
  if (q.type.startsWith("primary")) {
    q.options.forEach((opt) => {
      opt.scores.forEach((s) => {
        if (config.primaryOrder.includes(s.target)) scoredPrimaries.add(s.target);
      });
    });
  }
});
assert.equal(scoredPrimaries.size, 8, "All 8 primary personalities should have scoring paths");

// All 4 secondary personalities should be reachable
const scoredSecondaries = new Set();
config.questions.forEach((q) => {
  if (q.type.startsWith("secondary")) {
    q.options.forEach((opt) => {
      opt.scores.forEach((s) => {
        if (config.secondaryOrder.includes(s.target)) scoredSecondaries.add(s.target);
      });
    });
  }
});
assert.equal(scoredSecondaries.size, 4, "All 4 secondary personalities should have scoring paths");

console.log("RMBTI scoring tests passed. (" + config.questions.length + " questions verified)");
