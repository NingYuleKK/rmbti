(function startApp() {
  const config = window.RMBTI_CONFIG;
  const engine = window.RMBTI_ENGINE;
  const app = document.querySelector("#app");

  const PICOPICO_LOGO = "../assets/picopico_logo.png";
  const QR_URL = "https://rmbti-test-9bcmtdkn.manus.space/src/index.html";

  const state = {
    view: "home",
    currentQuestionIndex: 0,
    answers: Array(config.questions.length).fill(null),
    result: null,
    isTransitioning: false,
    isSharing: false
  };

  const pad = (value) => String(value).padStart(2, "0");
  const answeredCount = () => state.answers.filter((answer) => answer !== null).length;

  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMobile = () => /Android|iPhone|iPad|iPod|webOS|BlackBerry/i.test(navigator.userAgent);

  const setView = (view) => {
    state.view = view;
    render();
  };

  const reset = () => {
    state.currentQuestionIndex = 0;
    state.answers = Array(config.questions.length).fill(null);
    state.result = null;
    state.isTransitioning = false;
    state.isSharing = false;
    setView("home");
  };

  const start = () => {
    state.currentQuestionIndex = 0;
    state.answers = Array(config.questions.length).fill(null);
    state.result = null;
    state.isTransitioning = false;
    state.isSharing = false;
    setView("question");
  };

  const choose = (optionIndex, optionButton) => {
    if (state.isTransitioning) return;
    state.isTransitioning = true;
    state.answers[state.currentQuestionIndex] = optionIndex;
    optionButton?.classList.add("is-picked");
    optionButton?.closest(".question-panel")?.classList.add("is-exiting");

    window.setTimeout(() => {
      state.isTransitioning = false;
      if (state.currentQuestionIndex < config.questions.length - 1) {
        state.currentQuestionIndex += 1;
        render();
        return;
      }
      state.result = engine.scoreAnswers(config, state.answers);
      setView("loading");
      window.setTimeout(() => setView("result"), 1700);
    }, 180);
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
          ${config.homeCardIds
            .map((id) => {
              const item = config.primary[id];
              return `
                <div class="mini-card ${id}-card" style="--card-bg: ${item.color};">
                  <img src="${item.imageSrc}" alt="" loading="eager" />
                  <span>${item.code}</span>
                </div>
              `;
            })
            .join("")}
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
    const isFirstQuestion = state.currentQuestionIndex === 0;

    app.innerHTML = `
      <section class="screen question-screen">
        <header class="question-header">
          ${isFirstQuestion ? '<span></span>' : '<button class="ghost-button" type="button" data-action="back">上一题</button>'}
          <div class="question-count">${pad(state.currentQuestionIndex + 1)}/${pad(config.questions.length)}</div>
        </header>
        <div class="progress-track" aria-label="答题进度">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <article class="question-panel">
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
          <div class="flip-loader" aria-hidden="true">
            <div class="flip-loader-card">
              <span>RMBTI</span>
            </div>
          </div>
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

  const mirrorMarkup = (result) => `
    <div class="mirror-pills">
      ${result.mirrorDetails.map((item) => `<span>${item.tag}</span>`).join("")}
    </div>
    <p>${result.mirrorSentence}</p>
  `;

  // Helper: convert hex to rgba for html2canvas compatibility (no color-mix support)
  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const shareCardMarkup = (result, primary, secondary) => {
    const glowColor = hexToRgba(primary.accent, 0.28);
    const borderColor = hexToRgba(primary.accent, 0.7);
    return `
    <section id="share-card" class="share-card" style="--card-color: ${primary.color}; --card-accent: ${primary.accent}; --share-accent-glow: ${glowColor}; --share-border-color: ${borderColor};">
      <div class="share-card-inner">
        <p class="share-brand">直播老板 RMBTI 人格测试</p>
        <img class="share-card-image" src="${primary.imageSrc}" alt="${primary.name} ${primary.code} 卡牌" crossorigin="anonymous" />
        <div class="share-persona">
          <span class="share-persona-label">你的老板人格是</span>
          <span class="share-persona-name">${result.combinationName}</span>
        </div>
        <p class="share-sentence">${result.combinationSentence}</p>
        <div class="share-turnoff">
          <span class="share-turnoff-label">逆鳞</span>
          <span class="share-turnoff-text">${primary.turnoff}</span>
        </div>
        <div class="share-mirror-pills">
          ${result.mirrorDetails.map((item) => `<span>${item.tag}</span>`).join("")}
        </div>
        <div class="share-ad">
          <img class="share-ad-logo" src="${PICOPICO_LOGO}" alt="PicoPico" crossorigin="anonymous" />
          <span class="share-ad-text">下载 PicoPico，即可激活你的【${primary.name}】版老板座驾</span>
        </div>
        <div class="share-qr-section">
          <div class="share-qr-box" id="share-qr-container"></div>
          <p class="share-qr-hint">扫码测测你是哪种老板</p>
        </div>
      </div>
    </section>
  `;
  };

  const renderResult = () => {
    const result = state.result || engine.scoreAnswers(config, state.answers);
    const primary = config.primary[result.primaryId];
    const secondary = config.secondary[result.secondaryId];

    app.innerHTML = `
      <section class="screen result-screen" style="--card-color: ${primary.color}; --card-accent: ${primary.accent};">
        <article class="result-card">
          <div class="oracle-card">
            <div class="card-frame">
              <img src="${primary.imageSrc}" alt="${primary.name} ${primary.code} 卡牌" />
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
                <div><dt>逆鳞</dt><dd>${primary.turnoff}</dd></div>
              </dl>
            </section>
            <section class="reading-block secondary-block">
              <h2>${secondary.name}</h2>
              <p>${secondary.sentence}</p>
              <dl>
                <div><dt>短解读</dt><dd>${secondary.short}</dd></div>
                <div><dt>逆鳞</dt><dd>${secondary.turnoff}</dd></div>
              </dl>
            </section>
            <section class="mirror-block">
              <h2>镜面标签</h2>
              ${mirrorMarkup(result)}
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
            <div class="result-actions">
              <button class="primary-button" type="button" data-action="share" ${state.isSharing ? "disabled" : ""}>${state.isSharing ? "正在生成分享卡片..." : "分享"}</button>
              <button class="ghost-button" type="button" data-action="reset">再测一次</button>
            </div>
          </div>
          ${shareCardMarkup(result, primary, secondary)}
        </article>
      </section>
    `;

    // Generate real QR code in the share card
    generateQRCode();
  };

  const generateQRCode = () => {
    const container = document.getElementById("share-qr-container");
    if (!container || !window.QRCode) return;
    container.innerHTML = "";
    new window.QRCode(container, {
      text: QR_URL,
      width: 124,
      height: 124,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: window.QRCode.CorrectLevel.M
    });
  };

  // Convert an image URL to base64 data URL via canvas to avoid CORS issues with html2canvas
  const imgToBase64 = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const cvs = document.createElement("canvas");
          cvs.width = img.naturalWidth;
          cvs.height = img.naturalHeight;
          cvs.getContext("2d").drawImage(img, 0, 0);
          resolve(cvs.toDataURL("image/png"));
        } catch (e) {
          resolve(src); // fallback to original
        }
      };
      img.onerror = () => resolve(src); // fallback to original
      img.src = src;
    });
  };

  // Convert all images in the share card to inline base64 data URLs
  const inlineShareImages = async (shareCard) => {
    const images = [...shareCard.querySelectorAll("img")];
    await Promise.all(
      images.map(async (image) => {
        // Wait for image to load first
        if (!image.complete) {
          await new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          });
        }
        // Convert to base64 data URL
        if (image.src && !image.src.startsWith("data:")) {
          const base64 = await imgToBase64(image.src);
          image.src = base64;
        }
      })
    );
  };

  const showFullscreenPreview = (dataUrl) => {
    const overlay = document.createElement("div");
    overlay.className = "share-overlay";
    overlay.innerHTML = `
      <button class="share-overlay-close" type="button">&times;</button>
      <img src="${dataUrl}" alt="分享卡片" />
      <p class="share-overlay-hint">长按图片保存到相册</p>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector(".share-overlay-close").addEventListener("click", () => {
      overlay.remove();
    });
  };

  const downloadShareCard = async () => {
    const shareCard = document.querySelector("#share-card");
    if (!shareCard || state.isSharing) return;
    if (!window.html2canvas) {
      window.alert("分享卡生成工具还没有加载完成，请稍后再试。");
      return;
    }

    state.isSharing = true;
    render();

    try {
      // Re-generate QR code after re-render
      generateQRCode();

      // Wait for QR code canvas to render
      await new Promise((resolve) => setTimeout(resolve, 300));

      const activeShareCard = document.querySelector("#share-card");
      // Convert all images to inline base64 to avoid CORS/taint issues on iOS Safari & WeChat
      await inlineShareImages(activeShareCard);

      const canvas = await window.html2canvas(activeShareCard, {
        backgroundColor: null,
        scale: 2,
        useCORS: false,
        allowTaint: true,
        width: 750,
        height: 1500,
        logging: false
      });

      const dataUrl = canvas.toDataURL("image/png");

      if (isMobile()) {
        // Mobile: show fullscreen preview for long-press save
        showFullscreenPreview(dataUrl);
      } else {
        // Desktop: auto download
        const link = document.createElement("a");
        link.download = `rmbti-${state.result.primaryId}-${state.result.secondaryId}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error("[RMBTI] Share card generation failed:", error?.message || error, error?.stack || "");
      window.alert("分享卡生成失败：" + (error?.message || "未知错误") + "\n请刷新后重试。");
    } finally {
      state.isSharing = false;
      render();
    }
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
    if (actionTarget?.dataset.action === "share") downloadShareCard();
    if (optionTarget) choose(Number(optionTarget.dataset.option), optionTarget);
  });

  render();
})();
