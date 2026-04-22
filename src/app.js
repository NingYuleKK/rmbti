(function startApp() {
  const config = window.RMBTI_CONFIG;
  const engine = window.RMBTI_ENGINE;
  const app = document.querySelector("#app");

  const state = {
    view: "home",
    currentQuestionIndex: 0,
    answers: Array(config.questions.length).fill(null),
    result: null
  };

  const pad = (value) => String(value).padStart(2, "0");
  const answeredCount = () => state.answers.filter((answer) => answer !== null).length;

  const setView = (view) => {
    state.view = view;
    render();
  };

  const reset = () => {
    state.currentQuestionIndex = 0;
    state.answers = Array(config.questions.length).fill(null);
    state.result = null;
    setView("home");
  };

  const start = () => {
    state.currentQuestionIndex = 0;
    state.answers = Array(config.questions.length).fill(null);
    state.result = null;
    setView("question");
  };

  const choose = (optionIndex) => {
    state.answers[state.currentQuestionIndex] = optionIndex;
    if (state.currentQuestionIndex < config.questions.length - 1) {
      state.currentQuestionIndex += 1;
      render();
      return;
    }
    state.result = engine.scoreAnswers(config, state.answers);
    setView("loading");
    window.setTimeout(() => setView("result"), 1700);
  };

  const back = () => {
    if (state.currentQuestionIndex > 0) {
      state.currentQuestionIndex -= 1;
      render();
      return;
    }
    setView("home");
  };

  const renderHome = () => {
    app.innerHTML = `
      <section class="screen home-screen">
        <div class="ambient-card" aria-hidden="true">
          <div class="mini-card king-card"><span>KING</span></div>
          <div class="mini-card deep-card"><span>DEEP</span></div>
          <div class="mini-card myth-card"><span>MYTH</span></div>
        </div>
        <div class="home-copy">
          <p class="eyebrow">RMBTI ORACLE</p>
          <h1>${config.title}</h1>
          <p class="subtitle">${config.subtitle}</p>
          <div class="helper-row">
            ${config.helper.map((item) => `<span>${item}</span>`).join("")}
          </div>
          <button class="primary-button" type="button" data-action="start">开始测试</button>
        </div>
      </section>
    `;
  };

  const renderQuestion = () => {
    const question = config.questions[state.currentQuestionIndex];
    const progress = ((state.currentQuestionIndex + 1) / config.questions.length) * 100;
    const selectedAnswer = state.answers[state.currentQuestionIndex];

    app.innerHTML = `
      <section class="screen question-screen">
        <header class="question-header">
          <button class="ghost-button" type="button" data-action="back">返回</button>
          <div class="question-count">${pad(state.currentQuestionIndex + 1)}/${pad(config.questions.length)}</div>
        </header>
        <div class="progress-track" aria-label="答题进度">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <article class="question-panel">
          <p class="eyebrow">${question.type === "mirror" ? "镜面题" : question.type.includes("secondary") ? "副签题" : "主牌题"}</p>
          <h2>${question.prompt}</h2>
          <div class="options">
            ${question.options
              .map(
                (item, index) => `
                  <button class="option-button ${selectedAnswer === index ? "selected" : ""}" type="button" data-option="${index}">
                    <span class="option-label">${item.label}</span>
                    <span class="option-text">${item.text}</span>
                  </button>
                `
              )
              .join("")}
          </div>
        </article>
        <p class="answer-hint">已完成 ${answeredCount()} 题，点击选项会自动进入下一题。</p>
      </section>
    `;
  };

  const renderLoading = () => {
    app.innerHTML = `
      <section class="screen loading-screen">
        <div class="loader-card">
          <div class="card-orbit" aria-hidden="true"></div>
          <p class="eyebrow">DRAWING YOUR CARD</p>
          <h2>正在为你翻牌……</h2>
          <p>读取你出手时最像自己的那一面。</p>
        </div>
      </section>
    `;
  };

  const scoreRows = (defs, ranking, scores) =>
    ranking
      .slice(0, 4)
      .map((id) => `<li><span>${defs[id].name}</span><strong>${scores[id]}</strong></li>`)
      .join("");

  const renderResult = () => {
    const result = state.result || engine.scoreAnswers(config, state.answers);
    const primary = config.primary[result.primaryId];
    const secondary = config.secondary[result.secondaryId];

    app.innerHTML = `
      <section class="screen result-screen" style="--card-color: ${primary.color}; --card-accent: ${primary.accent};">
        <article class="result-card">
          <div class="oracle-card">
            <div class="card-frame">
              <div class="card-sigil">${primary.name}</div>
              <div class="card-code">${primary.code}</div>
            </div>
          </div>
          <div class="result-copy">
            <p class="eyebrow">你的老板人格是</p>
            <h1>${result.combinationName}</h1>
            <p class="verdict">${result.combinationSentence}</p>
            <section class="reading-block">
              <h2>${primary.name} ${primary.code}</h2>
              <p>${primary.sentence}</p>
              <dl>
                <div><dt>核心欲望</dt><dd>${primary.desire}</dd></div>
                <div><dt>高光时刻</dt><dd>${primary.highlight}</dd></div>
                <div><dt>下头瞬间</dt><dd>${primary.turnoff}</dd></div>
              </dl>
            </section>
            <section class="reading-block secondary-block">
              <h2>${secondary.name}</h2>
              <p>${secondary.sentence}</p>
              <dl>
                <div><dt>短解读</dt><dd>${secondary.short}</dd></div>
                <div><dt>下头点</dt><dd>${secondary.turnoff}</dd></div>
              </dl>
            </section>
            <section class="mirror-block">
              <h2>镜面标签</h2>
              <p>${result.mirrorSentence}</p>
            </section>
            <div class="score-grid">
              <div>
                <h3>主牌分数</h3>
                <ol>${scoreRows(config.primary, result.primaryRanking, result.primaryScores)}</ol>
              </div>
              <div>
                <h3>副签分数</h3>
                <ol>${scoreRows(config.secondary, result.secondaryRanking, result.secondaryScores)}</ol>
              </div>
            </div>
            <button class="primary-button" type="button" data-action="reset">再测一次</button>
          </div>
        </article>
      </section>
    `;
  };

  const render = () => {
    if (state.view === "home") renderHome();
    if (state.view === "question") renderQuestion();
    if (state.view === "loading") renderLoading();
    if (state.view === "result") renderResult();
  };

  app.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-action]");
    const optionTarget = event.target.closest("[data-option]");

    if (actionTarget?.dataset.action === "start") start();
    if (actionTarget?.dataset.action === "back") back();
    if (actionTarget?.dataset.action === "reset") reset();
    if (optionTarget) choose(Number(optionTarget.dataset.option));
  });

  render();
})();
