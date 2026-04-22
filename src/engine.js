(function attachEngine(root) {
  const zeroScores = (ids) =>
    ids.reduce((scores, id) => {
      scores[id] = 0;
      return scores;
    }, {});

  const sortByScore = (ids, scores) => [...ids].sort((a, b) => scores[b] - scores[a]);

  const selectedOptionFor = (question, answerIndex) => {
    if (!question || answerIndex === undefined || answerIndex === null) {
      return null;
    }
    return question.options[answerIndex] || null;
  };

  const applyScores = (bucket, option) => {
    option.scores.forEach(({ target, points }) => {
      bucket[target] += points;
    });
  };

  const countHighWeightHit = (hits, option) => {
    if (!option.scores.length) return;
    const maxPoints = Math.max(...option.scores.map((entry) => entry.points));
    option.scores
      .filter((entry) => entry.points === maxPoints && entry.points > 1)
      .forEach((entry) => {
        hits[entry.target] += 1;
      });
  };

  const pickPrimary = (ids, scores, discriminatorScores, turnoffScores) => {
    const topScore = Math.max(...ids.map((id) => scores[id]));
    let tied = ids.filter((id) => scores[id] === topScore);
    if (tied.length === 1) return tied[0];

    const bestDiscriminator = Math.max(...tied.map((id) => discriminatorScores[id]));
    tied = tied.filter((id) => discriminatorScores[id] === bestDiscriminator);
    if (tied.length === 1) return tied[0];

    const bestTurnoff = Math.max(...tied.map((id) => turnoffScores[id]));
    tied = tied.filter((id) => turnoffScores[id] === bestTurnoff);

    return ids.find((id) => tied.includes(id));
  };

  const pickSecondary = (ids, scores, q17Scores, highWeightHits) => {
    const topScore = Math.max(...ids.map((id) => scores[id]));
    let tied = ids.filter((id) => scores[id] === topScore);
    if (tied.length === 1) return tied[0];

    const bestQ17 = Math.max(...tied.map((id) => q17Scores[id]));
    tied = tied.filter((id) => q17Scores[id] === bestQ17);
    if (tied.length === 1) return tied[0];

    const bestHighWeightHits = Math.max(...tied.map((id) => highWeightHits[id]));
    tied = tied.filter((id) => highWeightHits[id] === bestHighWeightHits);

    return ids.find((id) => tied.includes(id));
  };

  const buildCombinationSentence = (config, primaryId, secondaryId) => {
    const primary = config.primary[primaryId];
    const template = config.combinationTemplates[secondaryId];
    return template
      .replaceAll("{primaryName}", primary.name)
      .replaceAll("{desire}", primary.desire);
  };

  const buildMirrorSentence = (config, tags) => {
    const tones = tags.map((tag) => config.mirrorTagTone[tag]).filter(Boolean);
    if (!tones.length) {
      return "你这次更像是把出手藏在场子细节里的人，动静不一定大，但每一步都有自己的理由。";
    }
    return tones.join("；") + "。";
  };

  const buildMirrorDetails = (config, tags) =>
    tags.map((tag) => ({
      tag,
      tone: config.mirrorTagTone[tag] || "这是你在场子里留下的一种细节信号"
    }));

  const scoreAnswers = (config, answers) => {
    const primaryScores = zeroScores(config.primaryOrder);
    const secondaryScores = zeroScores(config.secondaryOrder);
    const primaryDiscriminatorScores = zeroScores(config.primaryOrder);
    const primaryTurnoffScores = zeroScores(config.primaryOrder);
    const secondaryTurnoffScores = zeroScores(config.secondaryOrder);
    const primaryHighWeightHits = zeroScores(config.primaryOrder);
    const secondaryHighWeightHits = zeroScores(config.secondaryOrder);
    const mirrorTags = [];

    config.questions.forEach((question, questionIndex) => {
      const option = selectedOptionFor(question, answers[questionIndex]);
      if (!option) return;

      if (question.type === "mirror") {
        if (option.tag) mirrorTags.push(option.tag);
        return;
      }

      const isPrimary = question.type.startsWith("primary");
      const scores = isPrimary ? primaryScores : secondaryScores;
      const highWeightHits = isPrimary ? primaryHighWeightHits : secondaryHighWeightHits;

      applyScores(scores, option);
      countHighWeightHit(highWeightHits, option);

      if (question.type === "primary_discriminator") {
        applyScores(primaryDiscriminatorScores, option);
      }
      if (question.type === "primary_turnoff") {
        applyScores(primaryTurnoffScores, option);
      }
      if (question.type === "secondary_turnoff") {
        applyScores(secondaryTurnoffScores, option);
      }
    });

    const primaryId = pickPrimary(
      config.primaryOrder,
      primaryScores,
      primaryDiscriminatorScores,
      primaryTurnoffScores
    );
    const secondaryId = pickSecondary(
      config.secondaryOrder,
      secondaryScores,
      secondaryTurnoffScores,
      secondaryHighWeightHits
    );

    return {
      primaryId,
      secondaryId,
      primaryScores,
      secondaryScores,
      primaryDiscriminatorScores,
      primaryTurnoffScores,
      secondaryTurnoffScores,
      primaryRanking: sortByScore(config.primaryOrder, primaryScores),
      secondaryRanking: sortByScore(config.secondaryOrder, secondaryScores),
      mirrorTags,
      mirrorDetails: buildMirrorDetails(config, mirrorTags),
      combinationName: `${config.primary[primaryId].name}·${config.secondary[secondaryId].name}`,
      combinationSentence: buildCombinationSentence(config, primaryId, secondaryId),
      mirrorSentence: buildMirrorSentence(config, mirrorTags)
    };
  };

  const engine = { scoreAnswers, buildCombinationSentence, buildMirrorSentence };
  root.RMBTI_ENGINE = engine;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = engine;
  }
})(typeof window !== "undefined" ? window : globalThis);
