# RMBTI 老板出手人格测试 — 项目交接文档 (HANDOVER)

> **最后更新**：2026-04-24
> **仓库**：github.com/NingYuleKK/rmbti (Private)
> **永久线上地址**：https://rmbtitest-hhnnvwew.manus.space
> **直接访问**：https://rmbtitest-hhnnvwew.manus.space/app/index.html
> **当前分支**：main（commit 5926b89）
> **总代码量**：约 2878 行（app.js 837 + data.js 393 + engine.js 204 + styles.css 1234 + engine.test.js 193 + index.html 17）

---

## 一、项目定位

RMBTI 是一个面向语音直播平台 **PicoPico** 老板用户（高消费用户）的人格测试 H5 页面。

**不是心理学量表**，而是一个**社交消费人格剧场**。测试核心是：**你花钱时最想买到什么感觉，以及你通常怎么出手。**

最终结果以 **主牌人格 + 副签出手方式 + 隐藏称号** 呈现，如"君临·卡点"+"等灯君王"。

**五一期间**将在 PicoPico 站内外投放，用于老板测试 + 分享拉新 + 短信召回。

---

## 二、当前功能完成状态

### 已完成（Phase 1 + Phase 2 全部）

| 功能 | 状态 | 说明 |
|------|------|------|
| 18 道场景题测试 | ✅ 已完成 | 主牌题 + 副签题 + 镜面题，场景化文案不漏底 |
| 8 种主牌人格 + 4 种副签 | ✅ 已完成 | 32 种组合，每种有独立文案和隐藏称号 |
| 入场翻牌过场页 | ✅ 已完成 | 3.4 秒动画，支持跳过（按钮 + 点击空白） |
| 题目页氛围化 | ✅ 已完成 | 牌面风格、金边卡片选项、不同题型视觉差异 |
| 选中反馈 + 音效 | ✅ 已完成 | Web Audio API 合成音效，零网络开销，静音开关 |
| 金币进度条 + 阶段文案 | ✅ 已完成 | 蹦金币特效，4 阶段文案 |
| 显影度（替代原始分数） | ✅ 已完成 | 按维度精确计算百分比，debug 模式保留原始分数 |
| 隐藏称号系统 | ✅ 已完成 | 32 个主牌×副签组合称号 |
| 逆鳞文案 | ✅ 已完成 | 8 主牌 + 4 副签，江湖气老板口吻 |
| 镜面标签 | ✅ 已完成 | 4 道 mirror 题，不计分，润色结果页 |
| 返回上一题 | ✅ 已完成 | 选项高亮正确 |
| 分享卡片（Canvas 手绘） | ✅ 已完成 | 品牌标题/卡牌图/人格名称/逆鳞/镜面标签/PicoPico 广告/二维码 |
| PicoPico 广告模块 | ✅ 已完成 | Logo + 动态文案"下载 PicoPico，即可激活你的【{主牌}】版老板座驾" |
| 永久部署 | ✅ 已完成 | rmbtitest-hhnnvwew.manus.space |

### 已知问题（需研发验证）

| 编号 | 问题 | 严重度 | 状态 | 说明 |
|------|------|--------|------|------|
| BUG-1 | 分享卡片在 manus.space 的 iframe 环境下 iOS Safari 生成失败 | P0 | 待验证 | manus.space 通过 iframe/proxy 提供服务导致 canvas tainted。**在真实部署环境（自有域名、非 iframe proxy）下大概率能正常工作**，研发接手后需在真实环境重新验证。代码已有降级方案（截图提示）。 |
| BUG-2 | iOS Safari 不支持 `<a download>` 自动下载 | P2 | 已绕过 | 改为全屏展示 + 长按保存提示 |

### 未实现（留给研发）

| 功能 | 说明 | 参考文档 |
|------|------|---------|
| 结果页翻牌动画 | 1.5-2 秒显影效果 | PHASE2_CODEX_SPEC.md §P1-4 |
| 站内装扮推荐 | 测完推荐头像框/座驾 | OPS_DELIVERY_SPEC.md §一 |
| 站外落地页引导 | URL 参数传递分享者结果 | OPS_DELIVERY_SPEC.md §二 |
| 数据埋点接入 | 关键节点埋点 | TECH_HANDOVER.md §5.5 |
| 后端 API 接入 | 用户身份、结果存储、奖励发放 | TECH_HANDOVER.md §三/四 |
| 短信召回文案 | "你的老板牌还没翻" | OPS_DELIVERY_SPEC.md §三 |

---

## 三、技术架构

### 技术栈

纯前端 HTML/CSS/JavaScript，**无框架、无构建工具**。直接用浏览器打开 `src/index.html` 即可运行。

### 设计原则

**配置驱动**：人格定义、题目、选项、计分规则、结果文案、隐藏称号全部在 `data.js` 中配置，修改内容不需要改逻辑代码。

### 文件结构

```
rmbti/
├── HANDOVER.md                    # 项目交接文档（本文档）
├── README.md                      # 项目简介
├── assets/
│   ├── cards/                     # 8 张主牌卡牌图（webp 格式）
│   └── picopico_logo.png          # PicoPico Logo（分享卡片用）
├── docs/
│   ├── ACCEPTANCE_CARD.md         # 验收口径卡
│   ├── DESIGN_SPEC.md             # 美术设计规范
│   ├── OPS_DELIVERY_SPEC.md       # 运营交付 Spec（五一投放用）
│   ├── PHASE2_CODEX_SPEC.md       # Phase 2 开发 Spec（P0+P1 需求，已完成）
│   ├── PHASE2_REVIEW.md           # Phase 2 架构层 Review 报告
│   ├── PHASE2_REVIEW_FEEDBACK.md  # Phase 2 Review 反馈（已修复）
│   ├── PRD_V1.md                  # 初版 PRD
│   └── TECH_HANDOVER.md           # 技术交接（实现细节/建表/扩展能力）
└── src/
    ├── index.html                 # 入口页
    ├── app.js                     # 主应用逻辑（渲染、状态管理、音效、分享卡片）
    ├── data.js                    # 题目、人格定义、组合模板、隐藏称号、配置
    ├── engine.js                  # 计分引擎（纯函数，含显影度计算）
    ├── engine.test.js             # 引擎单元测试
    ├── styles.css                 # 全部样式（含入场过场、金币进度条、牌面选项）
    └── qrcode.min.js              # 二维码生成库（本地化）
```

### 加载顺序

```
qrcode.min.js → data.js → engine.js → app.js
```

---

## 四、人格体系

### 主牌（8 种）— 花钱时最想买到什么感觉

| ID | 中文名 | 英文代码 | 核心欲望 | 一句话 |
|----|--------|----------|---------|--------|
| deep | 深情 | DEEP | 偏爱确认 | 你买的不是热闹，是 TA 只向你亮起的一盏灯。 |
| saver | 逆转 | SAVE-R | 改命扭转 | 你买的不是礼物，是局面因你改写的那一秒。 |
| ctrl | 掌盘 | CTRL | 介入与控制 | 你买的不是礼物，是今晚往哪走由你说了算。 |
| loyal | 长情 | LOYAL | 长期留痕 | 你买的不是一时上头，是时间站在你这边的证明。 |
| myth | 神话 | MYTH | 造景与传奇感 | 你买的不是礼物，是把一个普通夜晚点成传奇。 |
| rare | 典藏 | RARE | 稀缺占有 | 你买的不是贵，是别人没有而你拥有。 |
| king | 君临 | KING | 全场注目 | 你买的不是礼物，是全场因你而起立的那一秒。 |
| clutch | 绝杀 | CLUTCH | 精准致命 | 你买的不是量大，是最后一击由你钉死。 |

### 副签（4 种）— 通常怎么出手

| ID | 中文名 | 出手风格 |
|----|--------|---------|
| burst | 爆冲 | 平时不动，动了就一把梭 |
| steady | 常陪 | 天天在，细水长流 |
| heroic | 豪侠 | 出手带气氛，全场受益 |
| timing | 卡点 | 精准挑时机，一击到位 |

### 隐藏称号（32 种）

每个主牌×副签组合有一个隐藏称号，如：
- king × burst = "等灯君王"
- king × timing = "一击封神"
- deep × steady = "烈焰偏爱者"
- rare × timing = "孤品猎手"

完整 32 个称号定义在 `data.js` 的 `hiddenTitles` 字段中。

### 逆鳞文案

江湖气、老板口吻、俯瞰判决感：

**主牌逆鳞**：
- king：我的光环，汝等竟敢视而不见。
- deep：辜负深情的人，一文不值。
- rare：满大街都有的东西，配不上我的眼光。
- loyal：不值得我久留的地方，我转身就走。
- myth：没有故事的夜晚，不配有我在场。
- saver：该翻盘的局翻不了，是你们不争气。
- ctrl：不听调度的场子，不值得我费心。
- clutch：最后一击没人能收，是这局不配有结尾。

---

## 五、计分引擎

引擎代码在 `src/engine.js`，纯函数，不依赖 DOM，可用 Node.js 直接测试。

### 核心函数

| 函数 | 说明 |
|------|------|
| `scoreAnswers(config, answers)` | 主计分函数，返回完整结果对象 |
| `getMaxScores(config)` | 按维度精确计算每个人格的理论最高分 |
| `toScorePercent(score, maxScore)` | 计算显影度百分比 |
| `buildHiddenTitle(config, primaryId, secondaryId)` | 查找隐藏称号 |
| `buildCombinationSentence(config, primaryId, secondaryId)` | 生成组合描述句 |
| `buildMirrorSentence(config, mirrorTags)` | 生成镜面标签综合描述 |

### Tiebreaker 机制

主牌平分时：先比 discriminator 题（Q12）得分 → 再比 turnoff 题（Q11）得分 → 再按 primaryOrder 顺序取第一个。

### 运行测试

```bash
node src/engine.test.js
```

### Debug 模式

URL 加 `?debug=1` 可在结果页显示原始分数（生产环境只显示显影度百分比）。

---

## 六、版本历史

| 版本 | Commit | 日期 | 说明 |
|------|--------|------|------|
| v1 | — | 2026-04-22 | 初版 20 题，基础 UI，分享卡片 |
| v2 | — | 2026-04-23 | 题目重设计为 19 题，缓存 bug 修复，去掉分类标签，返回上一题 |
| v3 | — | 2026-04-23 | 18 题全量更新，新增 Q6 正面题，删除原 Q14/Q18，逆鳞文案替换 |
| v3.1 | — | 2026-04-23 | 分享卡片：品牌标题/卡牌图/人格名称/逆鳞/镜面标签/PicoPico 广告/二维码 |
| v3.2 | — | 2026-04-24 | 分享卡片改用纯 Canvas API，QRCode 本地化 |
| Phase 2 | e67d06c | 2026-04-24 | 入场过场页、题目牌化、音效、金币进度条、显影度、隐藏称号 |
| Phase 2 Fix | 5926b89 | 2026-04-24 | 显影度改为按维度精确计算，intro 加跳过能力 |

---

## 七、文档索引

| 文档 | 路径 | 说明 | 目标读者 |
|------|------|------|---------|
| 项目交接总览 | `HANDOVER.md` | 项目全貌（本文档） | 所有人 |
| 技术交接 | `docs/TECH_HANDOVER.md` | 实现细节、建表结构、扩展能力、API 设计 | 研发 |
| Phase 2 开发 Spec | `docs/PHASE2_CODEX_SPEC.md` | P0+P1 需求详细描述（已完成） | 研发 |
| Phase 2 Review | `docs/PHASE2_REVIEW.md` | 架构层 Review 报告 | 研发 |
| 运营交付 Spec | `docs/OPS_DELIVERY_SPEC.md` | 装扮映射、短信文案、站外引导、埋点 | 运营 + 研发 |
| 美术设计规范 | `docs/DESIGN_SPEC.md` | 卡牌风格、配色、构图 | 设计 |
| 初版 PRD | `docs/PRD_V1.md` | 产品定位、交互结构、结果模型 | 产品 |
| 验收口径卡 | `docs/ACCEPTANCE_CARD.md` | 验收标准 | 产品 + 研发 |

---

## 八、研发接手建议

### 优先级排序

1. **在真实环境验证分享卡片**（BUG-1）— 部署到自有域名后测试 iOS Safari
2. **接入数据埋点** — 测试开始/答题/完成/分享/重测
3. **结果页翻牌动画** — 1.5-2 秒显影效果
4. **后端 API 接入** — 用户身份、结果存储（建表结构见 TECH_HANDOVER.md §四）
5. **站内装扮推荐** — 测完推荐头像框/座驾（映射表见 OPS_DELIVERY_SPEC.md §一）
6. **站外落地页引导** — URL 参数传递分享者结果
7. **短信召回** — "你的老板牌还没翻"

### 本地开发

```bash
git clone git@github.com:NingYuleKK/rmbti.git
cd rmbti
open src/index.html
# 或
npx serve src -p 3000
```

### 调试计分

浏览器控制台：
```javascript
console.log(state);  // 当前状态
const result = RMBTI_ENGINE.scoreAnswers(RMBTI_CONFIG, state.answers);
console.log(result);  // 计分结果
```

---

## 九、关键联系人

| 角色 | 代号 | 职责 |
|------|------|------|
| Litch | CEO / 产品 Owner | 需求定义、最终验收 |
| 子敬 | 架构师 / 中枢管理 | PRD、任务拆分、Code Review |
| Codex | 开发执行 | Phase 2 代码实现 |
| Root (GPT Pro) | 外部评审 | 产品建议、运营策略 |
