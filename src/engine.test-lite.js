const assert = require("assert/strict");
const fs = require("fs");
const path = require("path");
const fullConfig = require("./data");
const liteConfig = require("./data-lite");
const engine = require("./engine");

const liteHtml = fs.readFileSync(path.resolve(__dirname, "index-lite.html"), "utf8");
const liteAppSource = fs.readFileSync(path.resolve(__dirname, "app-lite.js"), "utf8");

assert.match(liteHtml, /<title>RMBTI 老板出手人格测试 · 快速版<\/title>/);
assert.match(liteHtml, /<script src="\.\/data-lite\.js"><\/script>/);
assert.match(liteHtml, /<script src="\.\/engine\.js"><\/script>/);
assert.match(liteHtml, /<script src="\.\/app-lite\.js"><\/script>/);

assert.match(liteAppSource, /RMBTI_LITE_CONFIG/);
assert.doesNotMatch(liteAppSource, /RMBTI_CONFIG/);
assert.match(liteAppSource, /window\.location\.href\.split\("\?"\)\[0\]/);
assert.doesNotMatch(liteAppSource, /rmbti-test-9bcmtdkn\.manus\.space/);
assert.match(liteAppSource, /\[3, 7, 11\]\.includes\(index\)/);
assert.doesNotMatch(liteAppSource, /\[4, 9, 14, 17\]\.includes\(index\)/);
assert.doesNotMatch(liteAppSource, /isDebugMode/);
assert.doesNotMatch(liteAppSource, /主牌分数/);

assert.equal(liteConfig.title, "RMBTI 老板出手人格测试 · 快速版");
assert.equal(liteConfig.subtitle, "测测你在场子里，是哪一张老板牌");
assert.deepEqual(liteConfig.helper, ["1-2 分钟", "12 题", "主牌 + 副签"]);
assert.deepEqual(liteConfig.progressStages, [
  { threshold: 0.33, text: "牌桌已就位……" },
  { threshold: 0.66, text: "气场正在聚拢……" },
  { threshold: 1, text: "主牌即将显影……" }
]);
assert.equal(liteConfig.questions.length, 12, "Lite should have exactly 12 questions");
assert.deepEqual(liteConfig.tiebreakers.primaryDiscriminatorQuestionIds, [10]);
assert.deepEqual(liteConfig.tiebreakers.primaryTurnoffQuestionIds, [9]);
assert.deepEqual(liteConfig.tiebreakers.secondaryTurnoffQuestionIds, []);

const originalQuestionIds = [1, 4, 3, 7, 6, 8, 15, 16, 11, 12, 17, 18];
const normalizeQuestion = (question) => ({
  type: question.type,
  prompt: question.prompt,
  options: JSON.parse(JSON.stringify(question.options))
});

liteConfig.questions.forEach((question, index) => {
  assert.equal(question.id, index + 1, "Lite question IDs should be sequential");
  const original = fullConfig.questions.find((item) => item.id === originalQuestionIds[index]);
  assert.deepEqual(
    normalizeQuestion(question),
    normalizeQuestion(original),
    `Lite L${index + 1} should match original Q${originalQuestionIds[index]}`
  );
});

const maxScores = engine.getMaxScores(liteConfig);
assert.deepEqual(maxScores.primary, {
  deep: 16,
  saver: 9,
  ctrl: 10,
  loyal: 12,
  myth: 10,
  rare: 8,
  king: 19,
  clutch: 9
});
assert.deepEqual(maxScores.secondary, {
  burst: 9,
  steady: 9,
  heroic: 9,
  timing: 9
});

const allA = Array(liteConfig.questions.length).fill(0);
const allAResult = engine.scoreAnswers(liteConfig, allA);
assert.equal(allAResult.primaryId, "deep");
assert.equal(allAResult.secondaryId, "timing");
assert.equal(allAResult.hiddenTitle, "等灯偏爱者");
assert.equal(allAResult.mirrorTags.length, 2);

const allBResult = engine.scoreAnswers(liteConfig, Array(liteConfig.questions.length).fill(1));
assert.ok(["clutch", "saver"].includes(allBResult.primaryId));
assert.equal(allBResult.secondaryId, "steady");

const allCResult = engine.scoreAnswers(liteConfig, Array(liteConfig.questions.length).fill(2));
assert.equal(allCResult.primaryId, "ctrl");
assert.ok(["steady", "heroic"].includes(allCResult.secondaryId));

const allDResult = engine.scoreAnswers(liteConfig, Array(liteConfig.questions.length).fill(3));
assert.equal(allDResult.primaryId, "king");
assert.ok(["burst", "heroic"].includes(allDResult.secondaryId));

const answerPath = (letters) => letters.split("").map((letter) => "ABCD".indexOf(letter));

const saverPath = answerPath("BAABAAAAAAAA");
assert.equal(engine.scoreAnswers(liteConfig, saverPath).primaryId, "saver");

const clutchPath = answerPath("BAABAAAAABAC");
assert.equal(engine.scoreAnswers(liteConfig, clutchPath).primaryId, "clutch");

[allAResult, allBResult, allCResult, allDResult].forEach((result) => {
  assert.ok(result.hiddenTitle.length > 0, "hiddenTitle should be present");
  assert.equal(result.mirrorTags.length, 2, "Lite should collect 2 mirror tags");
  const primaryPercent = engine.toScorePercent(
    result.primaryScores[result.primaryId],
    maxScores.primary[result.primaryId]
  );
  const secondaryPercent = engine.toScorePercent(
    result.secondaryScores[result.secondaryId],
    maxScores.secondary[result.secondaryId]
  );
  assert.ok(Number.isFinite(primaryPercent));
  assert.ok(Number.isFinite(secondaryPercent));
  assert.ok(primaryPercent >= 0 && primaryPercent <= 100);
  assert.ok(secondaryPercent >= 0 && secondaryPercent <= 100);
});

console.log("RMBTI Lite scoring tests passed. (" + liteConfig.questions.length + " questions verified)");
