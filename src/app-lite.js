(function startApp() {
  const config = window.RMBTI_LITE_CONFIG;
  const engine = window.RMBTI_ENGINE;
  const app = document.querySelector("#app");

  const PICOPICO_LOGO = "../assets/picopico_logo.png";
  const QR_URL = "https://rmbti-test-9bcmtdkn.manus.space/src/index.html";
  const DIMENSION_MAX = engine.getMaxScores(config);
  const SOUND_STORAGE_KEY = "rmbti_sound_enabled";

  /* 主牌中文名映射（用于 PicoPico 广告文案） */
  const PRIMARY_CN = {
    deep: "深情", saver: "逆转", ctrl: "掌盘", loyal: "长情",
    myth: "神话", rare: "典藏", king: "君临", clutch: "绝杀"
  };

  const state = {
    view: "home",
    currentQuestionIndex: 0,
    answers: Array(config.questions.length).fill(null),
    result: null,
    introMessage: config.introMessages[0],
    isTransitioning: false,
    isSharing: false,
    soundEnabled: localStorage.getItem(SOUND_STORAGE_KEY) !== "0"
  };

  let introTimer = null;
  let audioContext = null;

  const answeredCount = () => state.answers.filter((answer) => answer !== null).length;
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isMobile = () => /Android|iPhone|iPad|iPod|webOS|BlackBerry/i.test(navigator.userAgent);

  const renderSoundToggle = () => `
    <button
      class="sound-toggle ${state.soundEnabled ? "" : "is-muted"}"
      type="button"
      data-action="toggle-sound"
      aria-label="${state.soundEnabled ? "关闭音效" : "开启音效"}"
    >
      <span class="sound-icon" aria-hidden="true"></span>
    </button>
  `;

  const getAudioContext = () => {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    if (!audioContext) audioContext = new AudioCtor();
    return audioContext;
  };

  const playSound = (type) => {
    if (!state.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const settings = {
      select: { frequency: 880, duration: 0.12, gain: 0.045 },
      flip: { frequency: 420, duration: 0.18, gain: 0.035 },
      complete: { frequency: 260, duration: 0.32, gain: 0.055 },
      reveal: { frequency: 180, duration: 0.44, gain: 0.065 }
    }[type];
    if (!settings) return;

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type === "reveal" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(settings.frequency, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(settings.frequency * 0.72, ctx.currentTime + settings.duration);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(settings.gain, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + settings.duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + settings.duration);
  };

  const vibrate = (pattern) => {
    if (navigator.vibrate) navigator.vibrate(pattern);
  };

  const toggleSound = () => {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem(SOUND_STORAGE_KEY, state.soundEnabled ? "1" : "0");
    render();
  };

  const setView = (view) => {
    state.view = view;
    render();
  };

  const reset = () => {
    if (introTimer) window.clearTimeout(introTimer);
    introTimer = null;
    state.currentQuestionIndex = 0;
    state.answers = Array(config.questions.length).fill(null);
    state.result = null;
    state.introMessage = config.introMessages[0];
    state.isTransitioning = false;
    state.isSharing = false;
    setView("home");
  };

  const start = () => {
    if (introTimer) window.clearTimeout(introTimer);
    state.currentQuestionIndex = 0;
    state.answers = Array(config.questions.length).fill(null);
    state.result = null;
    state.introMessage = config.introMessages[Math.floor(Math.random() * config.introMessages.length)];
    state.isTransitioning = false;
    state.isSharing = false;
    setView("intro");
    playSound("flip");
    introTimer = window.setTimeout(() => {
      introTimer = null;
      playSound("flip");
      setView("question");
    }, 3400);
  };

  const skipIntro = () => {
    if (state.view !== "intro") return;
    if (introTimer) window.clearTimeout(introTimer);
    introTimer = null;
    playSound("flip");
    setView("question");
  };

  const choose = (optionIndex, optionButton) => {
    if (state.isTransitioning) return;
    state.isTransitioning = true;
    state.answers[state.currentQuestionIndex] = optionIndex;
    playSound("select");
    vibrate(12);
    optionButton?.classList.add("is-picked");
    optionButton?.closest(".question-panel")?.classList.add("is-exiting");

    window.setTimeout(() => {
      state.isTransitioning = false;
      if (state.currentQuestionIndex < config.questions.length - 1) {
        state.currentQuestionIndex += 1;
        playSound("flip");
        render();
        return;
      }
      state.result = engine.scoreAnswers(config, state.answers);
      playSound("complete");
      vibrate([20, 30, 40]);
      setView("loading");
      window.setTimeout(() => {
        playSound("reveal");
        setView("result");
      }, 1700);
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
        ${renderSoundToggle()}
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
          <button class="primary-button" type="button" data-action="start">开始翻牌</button>
        </div>
      </section>
    `;
  };

  const renderIntro = () => {
    app.innerHTML = `
      <section class="screen intro-screen">
        ${renderSoundToggle()}
        <div class="intro-oracle" aria-hidden="true">
          <div class="intro-card intro-card-left"><span>R</span></div>
          <div class="intro-card intro-card-main"><span>MBTI</span></div>
          <div class="intro-card intro-card-right"><span>老板牌</span></div>
          <span class="coin-spark coin-spark-one"></span>
          <span class="coin-spark coin-spark-two"></span>
          <span class="coin-spark coin-spark-three"></span>
        </div>
        <div class="intro-copy">
          <p class="eyebrow">ENTER THE TABLE</p>
          <h2>${state.introMessage}</h2>
          <p>请坐稳，第一张老板牌马上翻开。</p>
        </div>
        <button class="intro-skip" type="button" data-action="skip-intro">跳过</button>
      </section>
    `;
  };

  const renderQuestion = () => {
    const question = config.questions[state.currentQuestionIndex];
    const selectedAnswer = state.answers[state.currentQuestionIndex];
    const isFirstQuestion = state.currentQuestionIndex === 0;

    app.innerHTML = `
      <section class="screen question-screen">
        ${renderSoundToggle()}
        <header class="question-header">
          ${isFirstQuestion ? '<span></span>' : '<button class="ghost-button" type="button" data-action="back">上一题</button>'}
          <div class="question-count">第 ${state.currentQuestionIndex + 1} / ${config.questions.length} 张牌</div>
        </header>
        ${renderCoinProgress()}
        <article class="question-panel question-type-${question.type}">
          ${isFirstQuestion ? '<p class="question-kicker">第一张牌：你出手后，最想看到什么？</p>' : ""}
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
        ${renderSoundToggle()}
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

  const progressStage = () => {
    const position = state.currentQuestionIndex / Math.max(config.questions.length - 1, 1);
    const stage = config.progressStages.find((item) => position <= item.threshold);
    return stage?.text || config.progressStages.at(-1)?.text || "";
  };

  const renderCoinProgress = () => {
    const completed = answeredCount();
    return `
      <div class="coin-progress" aria-label="金币进度条">
        ${config.questions
          .map((_, index) => {
            const classes = [
              "progress-node",
              index < completed ? "is-complete" : "",
              index === state.currentQuestionIndex ? "is-current" : "",
              [4, 9, 14, 17].includes(index) && index < completed ? "is-milestone" : ""
            ].filter(Boolean).join(" ");
            return `<span class="${classes}"></span>`;
          })
          .join("")}
      </div>
      <p class="progress-stage">${progressStage()}</p>
    `;
  };

  const scoreVisibilityMarkup = (result) => {
    const primary = config.primary[result.primaryId];
    const secondary = config.secondary[result.secondaryId];
    const primaryPercent = engine.toScorePercent(
      result.primaryScores[result.primaryId],
      DIMENSION_MAX.primary[result.primaryId]
    );
    const secondaryPercent = engine.toScorePercent(
      result.secondaryScores[result.secondaryId],
      DIMENSION_MAX.secondary[result.secondaryId]
    );

    return `
      <div class="score-grid visibility-grid">
        <div>
          <h3>主牌显影度</h3>
          <p><span>${primary.name}</span><strong>${primaryPercent}%</strong></p>
        </div>
        <div>
          <h3>副签显影度</h3>
          <p><span>${secondary.name}</span><strong>${secondaryPercent}%</strong></p>
        </div>
      </div>
    `;
  };

  const mirrorMarkup = (result) => `
    <div class="mirror-pills">
      ${result.mirrorDetails.map((item) => `<span>${item.tag}</span>`).join("")}
    </div>
    <p>${result.mirrorSentence}</p>
  `;

  const renderResult = () => {
    const result = state.result || engine.scoreAnswers(config, state.answers);
    const primary = config.primary[result.primaryId];
    const secondary = config.secondary[result.secondaryId];

    app.innerHTML = `
      <section class="screen result-screen" style="--card-color: ${primary.color}; --card-accent: ${primary.accent};">
        ${renderSoundToggle()}
        <article class="result-card">
          <div class="oracle-card">
            <div class="card-frame">
              <img src="${primary.imageSrc}" alt="${primary.name} ${primary.code} 卡牌" />
            </div>
          </div>
          <div class="result-copy">
            <p class="eyebrow">你的老板人格是</p>
            <h1>${result.combinationName}</h1>
            <p class="hidden-title">隐藏称号：${result.hiddenTitle}</p>
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
            ${scoreVisibilityMarkup(result)}
            <div class="result-actions">
              <button class="primary-button" type="button" data-action="share" ${state.isSharing ? "disabled" : ""}>${state.isSharing ? "正在生成分享卡片..." : "分享"}</button>
              <button class="ghost-button" type="button" data-action="reset">再测一次</button>
            </div>
          </div>
        </article>
      </section>
    `;
  };

  /* ══════════════════════════════════════════════════════════════
     纯 Canvas API 手绘分享卡片（完全不依赖 html2canvas / DOM 截图）
     ══════════════════════════════════════════════════════════════ */

  /** 加载图片，返回 Promise<HTMLImageElement>。优先用 fetch+blob 绕过跨域 */
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      if (typeof fetch !== "undefined") {
        fetch(src, { mode: "cors", credentials: "same-origin" })
          .then((r) => {
            if (!r.ok) throw new Error("fetch failed");
            return r.blob();
          })
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
            img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("blob img fail: " + src)); };
            img.src = url;
          })
          .catch(() => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("img load fail: " + src));
            img.src = src;
          });
      } else {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("img load fail: " + src));
        img.src = src;
      }
    });
  };

  /** 在 canvas 上绘制自动换行文字，返回实际绘制的总高度 */
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const chars = text.split("");
    let line = "";
    let curY = y;
    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line.length > 0) {
        ctx.fillText(line, x, curY);
        line = chars[i];
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    if (line) ctx.fillText(line, x, curY);
    return curY + lineHeight - y;
  };

  /** 绘制圆角矩形路径 */
  const roundRect = (ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  };

  /** 生成 QR 码 canvas 元素 */
  const generateQRCanvas = () => {
    return new Promise((resolve) => {
      if (!window.QRCode) { resolve(null); return; }
      const tempDiv = document.createElement("div");
      tempDiv.style.cssText = "position:fixed;left:-9999px;top:0;";
      document.body.appendChild(tempDiv);
      new window.QRCode(tempDiv, {
        text: QR_URL, width: 124, height: 124,
        colorDark: "#000000", colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.M
      });
      setTimeout(() => {
        const qrCanvas = tempDiv.querySelector("canvas");
        resolve(qrCanvas || null);
        tempDiv.remove();
      }, 100);
    });
  };

  /** 主函数：用纯 Canvas 2D API 手绘分享卡片 */
  const drawShareCard = async (result, primary) => {
    const W = 750;
    const H = 1500;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    // ── 1. 背景渐变 ──
    const bgGrad = ctx.createLinearGradient(0, 0, W * 0.4, H);
    bgGrad.addColorStop(0, "#1a1a2e");
    bgGrad.addColorStop(0.58, "#0f0f1a");
    bgGrad.addColorStop(1, "#0f0f1a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 径向渐变光晕（主牌 accent）
    const accent = primary.accent || "#d6b15d";
    const radGrad = ctx.createRadialGradient(W / 2, H * 0.08, 0, W / 2, H * 0.08, 340);
    radGrad.addColorStop(0, accent + "47");
    radGrad.addColorStop(1, "transparent");
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, W, H * 0.4);

    const GOLD = "#f4d78c";
    const TEXT = "#fbf7ec";
    const MUTED = "#b9ad95";
    const FONT = "'PingFang SC','Hiragino Sans GB','Microsoft YaHei','Noto Sans SC',sans-serif";
    let curY = 56;

    // ── 2. 品牌标题 ──
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = GOLD;
    ctx.font = "900 28px " + FONT;
    ctx.fillText("RMBTI 老板出手人格测试", W / 2, curY);
    curY += 28 + 28;

    // ── 3. 卡牌图片 ──
    const cardW = 340;
    const cardH = 510;
    const cardX = (W - cardW) / 2;
    const cardY = curY;

    try {
      const cardImg = await loadImage(primary.imageSrc);
      ctx.save();
      roundRect(ctx, cardX, cardY, cardW, cardH, 8);
      ctx.clip();
      ctx.drawImage(cardImg, cardX, cardY, cardW, cardH);
      ctx.restore();
      ctx.strokeStyle = accent + "b3";
      ctx.lineWidth = 2;
      roundRect(ctx, cardX, cardY, cardW, cardH, 8);
      ctx.stroke();
    } catch (e) {
      ctx.fillStyle = primary.color || "#1a1a2e";
      roundRect(ctx, cardX, cardY, cardW, cardH, 8);
      ctx.fill();
      ctx.strokeStyle = accent + "b3";
      ctx.lineWidth = 2;
      roundRect(ctx, cardX, cardY, cardW, cardH, 8);
      ctx.stroke();
      ctx.fillStyle = GOLD;
      ctx.font = "900 48px " + FONT;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(primary.code, W / 2, cardY + cardH / 2);
      ctx.textBaseline = "top";
    }
    curY = cardY + cardH + 28;

    // ── 4. "你的老板人格是" ──
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = MUTED;
    ctx.font = "400 24px " + FONT;
    ctx.fillText("你的老板人格是", W / 2, curY);
    curY += 24 + 10;

    // ── 5. 人格组合名称 ──
    ctx.fillStyle = GOLD;
    ctx.font = "900 56px " + FONT;
    ctx.fillText(result.combinationName, W / 2, curY);
    curY += 56 + 16;

    // ── 6. 隐藏称号 ──
    ctx.fillStyle = MUTED;
    ctx.font = "600 24px " + FONT;
    ctx.fillText("隐藏称号：" + result.hiddenTitle, W / 2, curY);
    curY += 24 + 14;

    // ── 7. 一句话解读 ──
    ctx.fillStyle = TEXT;
    ctx.font = "400 26px " + FONT;
    ctx.textAlign = "center";
    const sentenceMaxW = W - 108;
    const sentenceH = wrapText(ctx, result.combinationSentence, W / 2, curY, sentenceMaxW, 42);
    curY += sentenceH + 16;

    // ── 8. 逆鳞 ──
    ctx.fillStyle = GOLD;
    ctx.font = "700 22px " + FONT;
    ctx.textAlign = "center";
    ctx.fillText("逆鳞", W / 2, curY);
    curY += 22 + 8;

    ctx.fillStyle = TEXT;
    ctx.font = "400 24px " + FONT;
    const turnoffH = wrapText(ctx, primary.turnoff, W / 2, curY, sentenceMaxW, 38);
    curY += turnoffH + 20;

    // ── 9. 镜面标签（pill 样式） ──
    const pills = result.mirrorDetails.map((d) => d.tag);
    ctx.font = "600 22px " + FONT;
    const pillPadX = 20;
    const pillPadY = 8;
    const pillH = 22 + pillPadY * 2;
    const pillGap = 12;
    const pillWidths = pills.map((t) => ctx.measureText(t).width + pillPadX * 2);
    const pillRows = [];
    let currentRow = [];
    let currentRowW = 0;
    const maxPillRowW = W - 108;
    for (let i = 0; i < pills.length; i++) {
      const pw = pillWidths[i];
      if (currentRow.length > 0 && currentRowW + pillGap + pw > maxPillRowW) {
        pillRows.push(currentRow);
        currentRow = [{ text: pills[i], w: pw }];
        currentRowW = pw;
      } else {
        currentRow.push({ text: pills[i], w: pw });
        currentRowW += (currentRow.length > 1 ? pillGap : 0) + pw;
      }
    }
    if (currentRow.length > 0) pillRows.push(currentRow);

    for (const row of pillRows) {
      const totalW = row.reduce((s, p) => s + p.w, 0) + (row.length - 1) * pillGap;
      let px = (W - totalW) / 2;
      for (const pill of row) {
        const py = curY;
        ctx.fillStyle = "rgba(214, 177, 93, 0.08)";
        roundRect(ctx, px, py, pill.w, pillH, pillH / 2);
        ctx.fill();
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 1.5;
        roundRect(ctx, px, py, pill.w, pillH, pillH / 2);
        ctx.stroke();
        ctx.fillStyle = GOLD;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "600 22px " + FONT;
        ctx.fillText(pill.text, px + pill.w / 2, py + pillH / 2);
        px += pill.w + pillGap;
      }
      curY += pillH + pillGap;
    }
    ctx.textBaseline = "top";
    curY += 12;

    // ── 10. PicoPico 广告模块 ──
    const adX = 54;
    const adW = W - 108;
    const adH = 112;
    const adY = curY;
    ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
    roundRect(ctx, adX, adY, adW, adH, 14);
    ctx.fill();

    const logoSize = 72;
    const logoX = adX + 24;
    const logoY = adY + (adH - logoSize) / 2;
    try {
      const logoImg = await loadImage(PICOPICO_LOGO);
      ctx.save();
      roundRect(ctx, logoX, logoY, logoSize, logoSize, 16);
      ctx.clip();
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
      ctx.restore();
    } catch (e) {
      ctx.fillStyle = "#333";
      roundRect(ctx, logoX, logoY, logoSize, logoSize, 16);
      ctx.fill();
    }

    const adTextX = logoX + logoSize + 18;
    const adTextMaxW = adW - 24 - logoSize - 18 - 24;
    const primaryCN = PRIMARY_CN[result.primaryId] || primary.name;
    const adText = "下载 PicoPico，即可激活你的【" + primaryCN + "】版老板座驾";
    ctx.fillStyle = TEXT;
    ctx.font = "400 22px " + FONT;
    ctx.textAlign = "left";
    wrapText(ctx, adText, adTextX, adY + 28, adTextMaxW, 34);
    curY = adY + adH + 24;

    // ── 11. 分隔线 ──
    ctx.strokeStyle = "rgba(214, 177, 93, 0.32)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(54, curY);
    ctx.lineTo(W - 54, curY);
    ctx.stroke();
    curY += 24;

    // ── 12. 分享挑逗文案 ──
    ctx.fillStyle = TEXT;
    ctx.font = "500 24px " + FONT;
    ctx.textAlign = "center";
    const shareLines = [
      "我测出来是「" + result.combinationName + "」",
      primary.turnoff,
      "来测测你是哪张老板牌。"
    ];
    shareLines.forEach((line) => {
      const lineH = wrapText(ctx, line, W / 2, curY, W - 108, 36);
      curY += lineH;
    });
    curY += 12;

    // ── 13. 二维码 ──
    const qrBoxSize = 140;
    const qrBoxX = (W - qrBoxSize) / 2;
    const qrBoxY = curY;
    ctx.fillStyle = "#ffffff";
    roundRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 8);
    ctx.fill();

    try {
      const qrCanvas = await generateQRCanvas();
      if (qrCanvas) {
        ctx.drawImage(qrCanvas, qrBoxX + 8, qrBoxY + 8, 124, 124);
      }
    } catch (e) { /* QR 失败，白底即可 */ }
    curY = qrBoxY + qrBoxSize + 14;

    // ── 14. 扫码提示 ──
    ctx.fillStyle = GOLD;
    ctx.font = "600 22px " + FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("扫码测测你是哪张老板牌", W / 2, curY);

    return canvas;
  };

  /* ── 全屏展示（iOS 长按保存） ── */
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

  const showShareFallback = () => {
    const overlay = document.createElement("div");
    overlay.className = "share-overlay share-fallback";
    overlay.innerHTML = `
      <button class="share-overlay-close" type="button">&times;</button>
      <div class="share-fallback-panel">
        <p class="eyebrow">SAVE RESULT</p>
        <h2>截图保存当前结果页</h2>
        <p>当前浏览器拦截了分享图生成。请关闭弹窗后直接截屏结果页，或换用系统浏览器再试一次。</p>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.querySelector(".share-overlay-close").addEventListener("click", () => {
      overlay.remove();
    });
  };

  /* ── 下载/展示分享卡片（纯 Canvas API，不依赖 html2canvas） ── */
  const downloadShareCard = async () => {
    if (state.isSharing) return;
    const result = state.result;
    if (!result) return;
    const primary = config.primary[result.primaryId];

    state.isSharing = true;
    render();

    try {
      const canvas = await drawShareCard(result, primary);
      const dataUrl = canvas.toDataURL("image/png");

      if (isMobile()) {
        showFullscreenPreview(dataUrl);
      } else {
        const link = document.createElement("a");
        link.download = "rmbti-" + result.primaryId + "-" + result.secondaryId + ".png";
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (error) {
      console.error("[RMBTI] Share card generation failed:", error?.message || error, error?.stack || "");
      if (isIOS() || isMobile()) {
        showShareFallback();
      } else {
        window.alert("分享卡生成失败：" + (error?.message || "未知错误") + "\n请刷新后重试。");
      }
    } finally {
      state.isSharing = false;
      render();
    }
  };

  const render = () => {
    if (state.view === "home") renderHome();
    if (state.view === "intro") renderIntro();
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
    if (actionTarget?.dataset.action === "toggle-sound") toggleSound();
    if (actionTarget?.dataset.action === "skip-intro") skipIntro();
    if (!actionTarget && state.view === "intro" && event.target.closest(".intro-screen")) skipIntro();
    if (optionTarget) choose(Number(optionTarget.dataset.option), optionTarget);
  });

  render();
})();
