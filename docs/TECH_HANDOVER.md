# RMBTI 技术交接文档 — 研发接手指南

> **最后更新**：2026-04-24
> **仓库**：github.com/NingYuleKK/rmbti (Private)
> **当前分支**：main
> **总代码量**：约 1900 行（app.js 619 + data.js 339 + engine.js 159 + styles.css 769 + index.html 17）

---

## 一、TODO 清单与待修复 Bug

### Bug 清单

| ID | 描述 | 严重度 | 状态 | 复现条件 | 根因分析 |
|----|------|--------|------|---------|---------|
| BUG-1 | 分享卡片在 iOS Safari / 微信内置浏览器生成失败，弹出"分享卡生成失败"或"分享卡生成工具还没有加载完成" | P0 | 未修复 | 在 manus.space 域名下用 iPhone 访问，完成测试后点击"分享"按钮 | manus.space 通过 iframe/proxy 提供服务，iOS Safari 对 canvas 跨域操作安全策略极严，即使图片已转 base64 仍被 tainted canvas 拦截。**在真实部署环境（自有域名、非 iframe proxy）下大概率能正常工作**，需重新验证。 |
| BUG-2 | iOS Safari 不支持 `<a download>` 自动下载 | P2 | 已绕过 | iOS Safari 点击下载链接 | 已改为全屏展示图片 + "长按图片保存到相册"提示。非 bug，是 iOS 限制。 |

### TODO 清单

| ID | 需求 | 优先级 | 状态 | 详细 Spec |
|----|------|--------|------|-----------|
| P0-1 | 标题改为"RMBTI 老板出手人格测试"，副标题改为"测测你在场子里，是哪一张老板牌"，按钮改为"开始翻牌" | P0 | ✅ 已完成 | PHASE2_CODEX_SPEC.md §P0-1 |
| P0-2 | 封面到测试之间加入场翻牌过场页（2.5-4 秒动画） | P0 | ✅ 已完成 | PHASE2_CODEX_SPEC.md §P0-2 |
| P0-3 | 分享卡片在真实部署环境验证并修复 | P0 | 待验证 | PHASE2_CODEX_SPEC.md §P0-3 |
| P0-4 | 分享卡片内容优化（加挑逗性文案 + 用户结果动态插入） | P0 | ✅ 已完成 | PHASE2_CODEX_SPEC.md §P0-4 |
| P0-5 | 生产环境隐藏具体分数，改为显影度百分比 | P0 | ✅ 已完成 | PHASE2_CODEX_SPEC.md §P0-5 |
| P0-6 | 隐藏称号系统（32 个主牌×副签组合称号） | P0 | ✅ 已完成 | PHASE2_CODEX_SPEC.md §P0-6 |
| P1-1 | 题目页氛围化（牌面风格、金边卡片选项、不同题型视觉差异） | P1 | ✅ 已完成 | PHASE2_CODEX_SPEC.md §P1-1 |
| P1-2 | 选中答案反馈 + 轻音效 + 静音开关 | P1 | ✅ 已完成 | PHASE2_CODEX_SPEC.md §P1-2 |
| P1-3 | 金币进度条 + 阶段文案 | P1 | ✅ 已完成 | PHASE2_CODEX_SPEC.md §P1-3 |
| P1-4 | 结果页翻牌动画（1.5-2 秒显影效果） | P1 | 🔲 未实现（留给研发） | PHASE2_CODEX_SPEC.md §P1-4 |
| FUTURE-1 | 站内装扮推荐系统（测完推荐头像框/座驾） | Future | 待 PicoPico 研发 | OPS_DELIVERY_SPEC.md §一 |
| FUTURE-2 | 站外落地页引导（URL 参数传递分享者结果） | Future | 待 PicoPico 研发 | OPS_DELIVERY_SPEC.md §二 |
| FUTURE-3 | 数据埋点接入 | Future | 待 PicoPico 研发 | OPS_DELIVERY_SPEC.md §五 |
| FUTURE-4 | 后端 API 接入（用户身份、结果存储、奖励发放） | Future | 待 PicoPico 研发 | 本文档 §五 |

---

## 二、完整实现描述

### 2.1 入口与加载顺序

`src/index.html` 按以下顺序加载脚本：

```
qrcode.min.js  →  data.js  →  engine.js  →  app.js
```

- `qrcode.min.js`：二维码生成库（本地化，不依赖 CDN），挂载 `window.QRCode`
- `data.js`：IIFE，执行后将配置对象挂载到 `window.RMBTI_CONFIG`
- `engine.js`：IIFE，执行后将计分引擎挂载到 `window.RMBTI_ENGINE`（同时兼容 CommonJS `module.exports`）
- `app.js`：IIFE，读取 `window.RMBTI_CONFIG` 和 `window.RMBTI_ENGINE`，启动应用

### 2.2 data.js — 配置数据层

**职责**：定义所有业务数据，不包含任何逻辑。

**数据结构**：

```javascript
window.RMBTI_CONFIG = {
  title: String,           // 首页标题
  subtitle: String,        // 首页副标题
  helper: [String],        // 首页提示信息（时长、题数、结果结构）
  homeCardIds: [String],   // 首页展示的卡牌 ID 列表
  primaryOrder: [String],  // 8 个主牌 ID 的排序（用于 tiebreaker）
  secondaryOrder: [String],// 4 个副签 ID 的排序
  primary: {               // 主牌定义 Map
    [id]: {
      id: String,          // 唯一标识，如 "deep"
      name: String,        // 中文名，如 "深情"
      code: String,        // 英文代码，如 "DEEP"
      sentence: String,    // 一句话描述
      desire: String,      // 核心欲望
      keywords: [String],  // 关键词列表
      color: String,       // 主色（CSS hex）
      accent: String,      // 强调色（CSS hex）
      imageSrc: String,    // 卡牌图片路径（相对路径）
      long: String,        // 长描述
      highlight: String,   // 高光时刻
      turnoff: String      // 逆鳞文案
    }
  },
  secondary: {             // 副签定义 Map
    [id]: {
      id: String,
      name: String,
      sentence: String,
      keywords: [String],
      short: String,       // 短解读
      turnoff: String      // 逆鳞文案
    }
  },
  combinationTemplates: {  // 组合句模板 Map（key = 副签 ID）
    [secondaryId]: String  // 模板中 {primaryName} 和 {desire} 会被替换
  },
  mirrorTagTone: {         // 镜面标签 → 解读句 Map
    [tag]: String
  },
  questions: [             // 题目数组（按顺序）
    {
      id: Number,          // 题号（1-indexed）
      type: String,        // 题型：primary_regular | primary_discriminator | primary_turnoff | secondary_regular | mirror
      prompt: String,      // 题干文案
      options: [
        {
          label: String,   // 选项标签："A" / "B" / "C" / "D"
          text: String,    // 选项文案
          scores: [        // 计分规则（mirror 题为空数组）
            { target: String, points: Number }
          ],
          tag: String|undefined  // mirror 题的标签
        }
      ]
    }
  ],
  tiebreakers: {
    primaryDiscriminatorQuestionIds: [Number],  // discriminator 题的 ID 列表
    primaryTurnoffQuestionIds: [Number],        // turnoff 题的 ID 列表
    secondaryTurnoffQuestionIds: [Number]       // 副签 turnoff 题的 ID 列表（当前为空）
  }
}
```

### 2.3 engine.js — 计分引擎

**职责**：纯函数，接收配置和用户答案，返回计分结果。不依赖 DOM，可在 Node.js 中独立运行。

**核心函数**：

```javascript
engine.scoreAnswers(config, answers) → ResultObject
```

**输入**：
- `config`：`window.RMBTI_CONFIG`
- `answers`：长度 18 的数组，每项为选项 label（"A"/"B"/"C"/"D"）或 null

**输出 ResultObject**：

```javascript
{
  primaryId: String,              // 主牌 ID，如 "king"
  secondaryId: String,            // 副签 ID，如 "timing"
  primaryScores: {[id]: Number},  // 8 个主牌的原始分数
  secondaryScores: {[id]: Number},// 4 个副签的原始分数
  primaryDiscriminatorScores: {}, // discriminator 题单独计分
  primaryTurnoffScores: {},       // turnoff 题单独计分
  secondaryTurnoffScores: {},     // 副签 turnoff 题单独计分
  primaryRanking: [String],       // 主牌按分数降序排列
  secondaryRanking: [String],     // 副签按分数降序排列
  mirrorTags: [String],           // 用户选择的镜面标签列表
  mirrorDetails: [{tag, tone}],   // 标签 + 解读句
  combinationName: String,        // 如 "君临·卡点"
  combinationSentence: String,    // 组合描述句
  mirrorSentence: String          // 镜面标签综合描述
}
```

**计分流程**：

1. 遍历 18 道题，根据用户选择的选项，将 `scores` 中的分数累加到对应的主牌/副签分数池
2. mirror 题不计分，只收集标签
3. discriminator 题和 turnoff 题的分数额外记录，用于 tiebreaker
4. 主牌选择：最高分者胜出；平分时先比 discriminator 分 → 再比 turnoff 分 → 再按 primaryOrder 顺序
5. 副签选择：最高分者胜出；平分时先比 turnoff 分 → 再比高权重命中次数 → 再按 secondaryOrder 顺序

**单元测试**：

```bash
node src/engine.test.js
```

测试覆盖：基础计分、tiebreaker、组合名称生成、镜面标签。

### 2.4 app.js — 应用逻辑层

**职责**：状态管理、DOM 渲染、用户交互、分享卡片生成。

**全局状态**：

```javascript
const state = {
  view: "home" | "quiz" | "loading" | "result",  // 当前视图
  currentQuestionIndex: 0,    // 当前题目索引（0-indexed）
  answers: Array(18).fill(null),  // 用户答案
  result: null,               // 计分结果（ResultObject）
  isSharing: false            // 是否正在生成分享卡片
}
```

**视图渲染函数**：

| 函数 | 视图 | 说明 |
|------|------|------|
| `renderHome()` | home | 首页：标题、副标题、卡牌预览、开始按钮 |
| `renderQuestion()` | quiz | 答题页：进度条、题干、4 个选项、返回按钮 |
| `renderLoading()` | loading | 加载页：计分中过渡动画（1.7 秒） |
| `renderResult()` | result | 结果页：卡牌图、人格名称、解读、逆鳞、镜面标签、分数、分享/重测按钮 |

**用户交互流程**：

```
首页 → 点击"开始测试" → 答题页（Q1-Q18）
  ↓ 每题选择后 0.8s 自动进入下一题
  ↓ 支持"返回上一题"
  ↓ Q18 答完后
加载页（1.7s）→ 结果页
  ↓ 点击"分享" → 生成 Canvas 分享卡片
  ↓ 点击"再测一次" → 重置状态 → 回到首页
```

**分享卡片生成**：

`drawShareCard(result, primary)` 函数用纯 Canvas 2D API 手工绘制 750×动态高度的分享图片：

1. 绘制渐变背景
2. 绘制品牌标题
3. 加载并绘制卡牌图片（fetch → blob → objectURL → Image，绕过 CORS）
4. 绘制人格组合名称
5. 绘制短解读文案
6. 绘制逆鳞文案
7. 绘制镜面标签（圆角矩形 + 金色描边）
8. 绘制 PicoPico 广告模块（Logo + 动态文案）
9. 生成并绘制二维码
10. 绘制扫码提示文案

**辅助函数**：

| 函数 | 说明 |
|------|------|
| `loadImage(src)` | 加载图片，先尝试 fetch→blob 方式，失败后降级为直接 img.src |
| `generateQRCanvas()` | 用 QRCode 库生成二维码 canvas |
| `wrapText(ctx, text, x, y, maxW, lineH)` | Canvas 文字自动换行 |
| `roundRect(ctx, x, y, w, h, r)` | Canvas 圆角矩形路径 |
| `showFullscreenPreview(dataUrl)` | iOS 全屏展示图片 + 长按保存提示 |

### 2.5 styles.css — 样式层

**设计系统**：

| 变量 | 值 | 用途 |
|------|-----|------|
| 背景色 | #0f0f1a ~ #1a1a2e | 深色渐变背景 |
| 金色强调 | #d4a843 / #d6b15d | 标题、边框、按钮、标签 |
| 文字色 | #ffffff / rgba(255,255,255,0.7) | 正文 / 次要文字 |
| 卡牌色 | 每个主牌有独立 color + accent（通过 CSS 变量 --card-color / --card-accent 传入） |

**响应式**：移动端优先，基准宽度 375px，最大宽度 480px 居中。

**关键 CSS 类**：

| 类名 | 用途 |
|------|------|
| `.app` | 根容器 |
| `.screen` | 每个视图的容器 |
| `.home-screen` | 首页 |
| `.quiz-screen` | 答题页 |
| `.result-screen` | 结果页 |
| `.oracle-card` | 卡牌图片容器 |
| `.card-frame` | 卡牌边框 |
| `.option-button` | 选项按钮 |
| `.option-button.selected` | 选中状态 |
| `.progress-bar` | 进度条 |
| `.reading-block` | 解读区块 |
| `.mirror-block` | 镜面标签区块 |
| `.score-grid` | 分数网格 |
| `.share-overlay` | 分享卡片全屏预览遮罩 |

---

## 三、数据存储方式

### 3.1 当前方案（纯前端）

当前版本**不持久化任何数据**。所有状态存在内存中的 `state` 对象里，页面刷新即丢失。

- 用户答案：`state.answers`（内存）
- 计分结果：`state.result`（内存）
- 分享卡片：生成后直接下载或展示，不存储

**localStorage 使用**：当前未使用。Phase 2 中静音开关状态建议存 localStorage。

### 3.2 后端接入建议（Future）

当 PicoPico 研发接手后，建议接入后端 API 实现以下能力：

**API 端点设计**：

```
POST /api/rmbti/submit        # 提交测试结果
GET  /api/rmbti/result/:id    # 获取测试结果（分享链接用）
GET  /api/rmbti/stats          # 人格分布统计（运营看板）
POST /api/rmbti/share          # 记录分享事件
GET  /api/rmbti/recommend/:primaryId  # 获取装扮推荐
```

**请求/响应示例**：

```javascript
// POST /api/rmbti/submit
// Request
{
  userId: "pico_12345",        // PicoPico 用户 ID
  answers: ["A","B","C",...],  // 18 个选项
  primaryId: "king",
  secondaryId: "timing",
  mirrorTags: ["排面欢迎","CP 截图","专属位","灯"],
  combinationName: "君临·卡点",
  source: "in_app" | "sms_recall" | "share_link",
  shareFrom: "result_abc123"   // 如果是从别人分享链接进来的
}

// Response
{
  resultId: "result_abc123",   // 用于生成分享链接
  shareUrl: "https://picopico.com/rmbti/result_abc123",
  rewards: {                   // 奖励信息
    avatarFrame: { id: "frame_king_01", name: "金冠框", unlocked: true },
    vehicle: { id: "vehicle_king_01", name: "黄金战车", unlocked: false, unlockCondition: "分享结果" }
  }
}
```

---

## 四、建表结构

### 4.1 用户测试记录表 `rmbti_test_records`

```sql
CREATE TABLE rmbti_test_records (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  result_id       VARCHAR(32) NOT NULL UNIQUE COMMENT '结果唯一标识，用于分享链接',
  user_id         VARCHAR(64) NOT NULL COMMENT 'PicoPico 用户 ID',
  
  -- 答题数据
  answers         JSON NOT NULL COMMENT '18 个选项的数组，如 ["A","B","C",...]',
  
  -- 计分结果
  primary_id      VARCHAR(16) NOT NULL COMMENT '主牌 ID：deep/saver/ctrl/loyal/myth/rare/king/clutch',
  secondary_id    VARCHAR(16) NOT NULL COMMENT '副签 ID：burst/steady/heroic/timing',
  combination_name VARCHAR(32) NOT NULL COMMENT '组合名称，如 "君临·卡点"',
  hidden_title    VARCHAR(32) DEFAULT NULL COMMENT '隐藏称号，如 "等灯君王"',
  
  -- 详细分数（JSON 存储，便于扩展）
  primary_scores  JSON NOT NULL COMMENT '8 个主牌分数，如 {"deep":5,"king":15,...}',
  secondary_scores JSON NOT NULL COMMENT '4 个副签分数，如 {"burst":4,"timing":7,...}',
  mirror_tags     JSON NOT NULL COMMENT '镜面标签数组，如 ["排面欢迎","CP 截图","专属位","灯"]',
  
  -- 来源追踪
  source          VARCHAR(32) DEFAULT 'direct' COMMENT '来源：direct/in_app/sms_recall/share_link',
  share_from_id   VARCHAR(32) DEFAULT NULL COMMENT '如果从分享链接进入，记录来源 result_id',
  
  -- 时间
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_primary_id (primary_id),
  INDEX idx_source (source),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='RMBTI 测试记录';
```

### 4.2 分享事件表 `rmbti_share_events`

```sql
CREATE TABLE rmbti_share_events (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  result_id       VARCHAR(32) NOT NULL COMMENT '关联的测试结果 ID',
  user_id         VARCHAR(64) NOT NULL COMMENT '分享者的用户 ID',
  share_channel   VARCHAR(32) DEFAULT 'unknown' COMMENT '分享渠道：wechat/weibo/qq/save_image/copy_link',
  
  -- 分享效果追踪
  click_count     INT DEFAULT 0 COMMENT '分享链接被点击次数',
  convert_count   INT DEFAULT 0 COMMENT '通过此分享完成测试的人数',
  
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_result_id (result_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='RMBTI 分享事件';
```

### 4.3 奖励发放表 `rmbti_rewards`

```sql
CREATE TABLE rmbti_rewards (
  id              BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id         VARCHAR(64) NOT NULL COMMENT '用户 ID',
  result_id       VARCHAR(32) NOT NULL COMMENT '关联的测试结果 ID',
  reward_type     VARCHAR(32) NOT NULL COMMENT '奖励类型：avatar_frame/vehicle/badge/title',
  reward_id       VARCHAR(64) NOT NULL COMMENT '奖励物品 ID（对应 PicoPico 装扮系统）',
  reward_name     VARCHAR(64) NOT NULL COMMENT '奖励名称',
  unlock_method   VARCHAR(32) NOT NULL COMMENT '解锁方式：test_complete/share/invite',
  status          VARCHAR(16) DEFAULT 'locked' COMMENT '状态：locked/unlocked/expired',
  
  unlocked_at     DATETIME DEFAULT NULL,
  expired_at      DATETIME DEFAULT NULL COMMENT '试用期到期时间（如座驾试用 3 天）',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE KEY uk_user_reward (user_id, reward_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='RMBTI 奖励发放';
```

### 4.4 人格配置表 `rmbti_personality_config`

```sql
CREATE TABLE rmbti_personality_config (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  personality_id  VARCHAR(16) NOT NULL UNIQUE COMMENT '人格 ID：deep/saver/ctrl/...',
  personality_type VARCHAR(16) NOT NULL COMMENT '类型：primary/secondary',
  name_cn         VARCHAR(16) NOT NULL COMMENT '中文名',
  code            VARCHAR(16) DEFAULT NULL COMMENT '英文代码',
  sentence        TEXT NOT NULL COMMENT '一句话描述',
  desire          VARCHAR(32) DEFAULT NULL COMMENT '核心欲望（仅主牌）',
  turnoff         TEXT NOT NULL COMMENT '逆鳞文案',
  color           VARCHAR(7) DEFAULT NULL COMMENT '主色 hex',
  accent          VARCHAR(7) DEFAULT NULL COMMENT '强调色 hex',
  image_url       VARCHAR(256) DEFAULT NULL COMMENT '卡牌图片 URL',
  sort_order      INT DEFAULT 0 COMMENT '排序权重',
  is_active       TINYINT DEFAULT 1 COMMENT '是否启用',
  
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='RMBTI 人格配置（可后台管理）';
```

### 4.5 题目配置表 `rmbti_questions`

```sql
CREATE TABLE rmbti_questions (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  question_id     INT NOT NULL UNIQUE COMMENT '题号',
  question_type   VARCHAR(32) NOT NULL COMMENT '题型：primary_regular/primary_discriminator/primary_turnoff/secondary_regular/mirror',
  prompt          TEXT NOT NULL COMMENT '题干文案',
  options         JSON NOT NULL COMMENT '选项数组 [{label, text, scores:[{target,points}], tag}]',
  sort_order      INT DEFAULT 0 COMMENT '排序',
  is_active       TINYINT DEFAULT 1 COMMENT '是否启用',
  
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='RMBTI 题目配置（可后台管理）';
```

---

## 五、扩展能力

### 5.1 配置驱动的扩展点

当前架构的核心设计原则是**配置驱动**，以下内容可以通过修改 `data.js`（或未来从后端 API 获取）实现，不需要改逻辑代码：

| 扩展点 | 修改位置 | 说明 |
|--------|---------|------|
| 增删题目 | `config.questions` 数组 | 增删数组元素即可，引擎自动适配 |
| 修改题目文案 | `config.questions[n].prompt` / `.options[n].text` | 纯文案修改 |
| 调整计分权重 | `config.questions[n].options[n].scores[n].points` | 修改分值 |
| 增删人格类型 | `config.primary` / `config.secondary` + `config.primaryOrder` / `config.secondaryOrder` | 需要同步更新排序数组 |
| 修改结果文案 | `config.primary[id].sentence` / `.turnoff` / `.highlight` 等 | 纯文案修改 |
| 修改组合模板 | `config.combinationTemplates[secondaryId]` | 支持 `{primaryName}` 和 `{desire}` 占位符 |
| 修改镜面标签解读 | `config.mirrorTagTone[tag]` | 纯文案修改 |
| 替换卡牌图片 | `config.primary[id].imageSrc` | 修改路径即可 |
| 修改配色 | `config.primary[id].color` / `.accent` | 影响结果页背景色 |

### 5.2 后端 API 接入口径

当前 `data.js` 是静态配置文件。接入后端后，可以改为从 API 动态加载：

```javascript
// 替换 data.js 的静态配置为 API 调用
const response = await fetch('/api/rmbti/config');
const config = await response.json();
window.RMBTI_CONFIG = config;
```

**好处**：
- 运营可以通过后台管理系统修改题目和文案，无需发版
- 可以做 A/B 测试（不同用户看到不同题目）
- 可以按时间段切换题目（如五一特别版）

### 5.3 计分引擎扩展

引擎是纯函数，扩展方式：

| 扩展需求 | 实现方式 |
|---------|---------|
| 新增题型 | 在 `scoreAnswers()` 的 `forEach` 中增加 `question.type` 分支 |
| 新增 tiebreaker 规则 | 在 `pickPrimary()` / `pickSecondary()` 中增加比较层级 |
| 加权计分 | 在 `applyScores()` 中增加权重乘数 |
| 条件计分（如"选了 A 则下一题 B 选项加分"） | 需要改造 `scoreAnswers()` 支持上下文感知 |

### 5.4 分享能力扩展

| 扩展需求 | 实现方式 |
|---------|---------|
| 微信 JS-SDK 分享 | 引入 wx.jssdk，配置分享标题/描述/图片 |
| 分享链接带用户结果 | URL 参数 `?from=result_abc123`，首页读取并展示"你的朋友测出了 XXX" |
| 后端生成分享图片 | Node.js canvas 或 Puppeteer 截图，返回图片 URL |
| 小程序码替代二维码 | 调用微信小程序码 API 生成 |

### 5.5 埋点预留

当前代码中没有埋点。建议在以下位置插入埋点调用：

```javascript
// app.js 中的关键节点
start()           → track('test_start')
choose()          → track('answer', { questionId, optionLabel })
renderResult()    → track('test_complete', { primaryId, secondaryId })
downloadShareCard() → track('share_click')
// 分享成功后   → track('share_success')
reset()           → track('retest')
```

埋点函数可以是一个空壳，研发接手后替换为实际的数据上报：

```javascript
function track(event, data = {}) {
  // TODO: 替换为 PicoPico 埋点 SDK
  console.log('[RMBTI Track]', event, data);
}
```

---

## 六、本地开发指南

### 快速启动

```bash
# 克隆仓库
git clone git@github.com:NingYuleKK/rmbti.git
cd rmbti

# 直接用浏览器打开
open src/index.html
# 或用任意静态服务器
npx serve src -p 3000
```

### 运行测试

```bash
node src/engine.test.js
```

### 修改题目

编辑 `src/data.js` 中的 `questions` 数组，刷新浏览器即可看到效果。

### 修改样式

编辑 `src/styles.css`，刷新浏览器即可。

### 调试计分

在浏览器控制台中：

```javascript
// 查看当前状态
console.log(state);

// 手动计分
const result = RMBTI_ENGINE.scoreAnswers(RMBTI_CONFIG, state.answers);
console.log(result);
```

---

## 七、文档索引

| 文档 | 路径 | 说明 |
|------|------|------|
| 项目交接总览 | `HANDOVER.md` | 项目定位、架构、人格体系、版本历史 |
| 技术交接（本文档） | `docs/TECH_HANDOVER.md` | 实现细节、建表、扩展能力 |
| Phase 2 开发 Spec | `docs/PHASE2_CODEX_SPEC.md` | P0+P1 需求详细描述 |
| 运营交付 Spec | `docs/OPS_DELIVERY_SPEC.md` | 装扮映射、短信文案、埋点 |
| 美术设计规范 | `docs/DESIGN_SPEC.md` | 卡牌风格、配色、构图 |
| 初版 PRD | `docs/PRD_V1.md` | 产品定位、交互结构、结果模型 |
| 验收口径卡 | `docs/ACCEPTANCE_CARD.md` | 验收标准 |
