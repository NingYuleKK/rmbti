# RMBTI 老板出手人格测试 — 项目交接文档 (HANDOVER)

> **最后更新**：2026-04-24
> **仓库**：github.com/NingYuleKK/rmbti (Private)
> **永久预览**：https://rmbti-test-9bcmtdkn.manus.space/src/index.html
> **当前分支**：main（commit d0dcbb2）

---

## 一、项目定位

RMBTI 是一个面向语音直播平台 **PicoPico** 老板用户（高消费用户）的人格测试 H5 页面。

**不是心理学量表**，而是一个**社交消费人格剧场**。测试核心是：**你花钱时最想买到什么感觉，以及你通常怎么出手。**

最终结果以 **主牌人格 + 副签出手方式** 呈现，如"君临·卡点""深情·常陪"。

**五一期间**将在 PicoPico 站内外投放，用于老板测试 + 分享拉新 + 短信召回。

---

## 二、技术架构

### 技术栈

纯前端 HTML/CSS/JavaScript，**无框架、无构建工具**。直接用浏览器打开 `src/index.html` 即可运行。

### 设计原则

**配置驱动**：人格定义、题目、选项、计分规则、结果文案全部在 `data.js` 中配置，修改内容不需要改逻辑代码。

### 文件结构

```
rmbti/
├── README.md                    # 项目简介
├── assets/
│   ├── cards/                   # 8 张主牌卡牌图（webp 格式）
│   │   ├── card_clutch.webp
│   │   ├── card_ctrl.webp
│   │   ├── card_deep.webp
│   │   ├── card_king.webp
│   │   ├── card_loyal.webp
│   │   ├── card_myth.webp
│   │   ├── card_rare.webp
│   │   └── card_saver.webp
│   └── picopico_logo.png        # PicoPico Logo（分享卡片用）
├── docs/
│   ├── ACCEPTANCE_CARD.md       # 验收口径卡
│   ├── DESIGN_SPEC.md           # 美术设计规范
│   ├── OPS_DELIVERY_SPEC.md     # 运营交付 Spec（五一投放用）
│   ├── PHASE2_CODEX_SPEC.md     # Phase 2 开发 Spec（P0+P1 需求）
│   └── PRD_V1.md                # 初版 PRD
└── src/
    ├── index.html               # 入口页
    ├── app.js                   # 主应用逻辑（渲染、状态管理、分享卡片）
    ├── data.js                  # 题目、人格定义、组合模板、配置（核心数据文件）
    ├── engine.js                # 计分引擎（纯函数，不依赖 DOM）
    ├── engine.test.js           # 引擎单元测试（Node.js 可直接运行）
    ├── styles.css               # 全部样式
    └── qrcode.min.js            # 二维码生成库（本地化，不依赖 CDN）
```

---

## 三、人格体系

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

### 镜面标签

4 道 mirror 题不计分，只记录用户选择的标签（如"排面欢迎""CP 截图""潜伏位""河"），用于润色结果页。

### 组合名称

主牌中文名 + "·" + 副签中文名，如"君临·卡点"。共 8×4=32 种组合。

---

## 四、计分引擎

引擎代码在 `src/engine.js`，是纯函数，不依赖 DOM，可用 Node.js 直接测试。

### 题目类型

| 类型 | 说明 | 计分目标 |
|------|------|---------|
| `primary_regular` | 主牌常规题 | 主牌 +3（主分）+1（副分） |
| `primary_discriminator` | 主牌决胜题 | 主牌 +5（主分）+1（副分），平分时作为 tiebreaker |
| `primary_turnoff` | 主牌逆鳞题 | 主牌 +4，平分时作为第二 tiebreaker |
| `secondary_regular` | 副签常规题 | 副签 +2 或 +3 |
| `mirror` | 镜面题 | 不计分，只记录标签 |

### 当前 18 题分布

| 题号 | 类型 | 题目简述 |
|------|------|---------|
| Q1 | primary_regular | 刷了一波大的，最想看到啥？ |
| Q2 | secondary_regular | 喜欢什么风格的座驾？ |
| Q3 | mirror | 进房间最想要哪种待遇？ |
| Q4 | secondary_regular | 花钱的节奏是哪一种？ |
| Q5 | secondary_regular | 最下头的主播行为？ |
| Q6 | secondary_regular | 最喜欢什么样的主播？ |
| Q7 | primary_regular | 房间里突然冷场了，你会？ |
| Q8 | primary_regular | 主播给你专属待遇，你最想要啥？ |
| Q9 | secondary_regular | 喜欢什么风格的房间？ |
| Q10 | mirror | 今晚只能截一张图，你截哪个？ |
| Q11 | primary_turnoff | 哪种情况让你直接不玩了？ |
| Q12 | primary_discriminator | 哪种爽感最对你胃口？ |
| Q13 | secondary_regular | 你的昵称是哪种风格？ |
| Q14 | mirror | 在房间里喜欢待在什么地方？ |
| Q15 | secondary_regular | 对各种榜单、活动的态度？ |
| Q16 | mirror | 你在语音房的风格更像哪个？ |
| Q17 | secondary_regular | 直播在你生活里扮演什么角色？ |
| Q18 | primary_regular | 主播 PK 要输了，你会？ |

### Tiebreaker 机制

主牌平分时：先比 discriminator 题（Q12）得分 → 再比 turnoff 题（Q11）得分 → 再按 primaryOrder 顺序取第一个。

副签平分时：先比 turnoff 题得分 → 再比高权重命中次数 → 再按 secondaryOrder 顺序取第一个。

### 运行测试

```bash
node src/engine.test.js
```

---

## 五、应用逻辑（app.js）

### 状态管理

全局 `state` 对象：

```javascript
state = {
  view: "home" | "quiz" | "result",  // 当前页面
  currentQuestion: 0,                 // 当前题号（0-indexed）
  answers: [],                        // 用户选择（每题一个 label: "A"/"B"/"C"/"D"）
  result: null,                       // 计分结果对象
  isSharing: false                    // 是否正在生成分享卡片
}
```

### 渲染流程

`render()` 函数根据 `state.view` 调用对应渲染函数：
- `renderHome()` → 首页
- `renderQuiz()` → 答题页（含返回上一题功能）
- `renderResult()` → 结果页

### 分享卡片

`drawShareCard()` 函数用纯 Canvas 2D API 手工绘制分享卡片（不依赖 html2canvas）。包含：品牌标题、卡牌图、人格名称、短解读、逆鳞、镜面标签、PicoPico 广告（Logo + 动态文案）、二维码。

---

## 六、样式（styles.css）

- 整体风格：黑金暗色主题
- 配色：深色背景（#0f0f1a ~ #1a1a2e）+ 金色强调（#d4a843）+ 白色文字
- 卡牌图：Art Deco 金线牌框风格
- 响应式：移动端优先，375px 基准

---

## 七、逆鳞文案

每个主牌和副签都有一条"逆鳞"文案，江湖气、老板口吻、俯瞰判决感：

**主牌逆鳞**：
- deep：辜负深情的人，一文不值。
- saver：该翻盘的局翻不了，是你们不争气。
- ctrl：不听调度的场子，不值得我费心。
- loyal：不值得我久留的地方，我转身就走。
- myth：没有故事的夜晚，不配有我在场。
- rare：满大街都有的东西，配不上我的眼光。
- king：我的光环，汝等竟敢视而不见。
- clutch：最后一击没人能收，是这局不配有结尾。

**副签逆鳞**：
- burst：我这一把梭出去，场子接不住，是你们的问题。
- steady：我天天在的地方，居然不记得我？那是你们不配。
- heroic：我把气氛托到这份上了，你们还冷着？不识抬举。
- timing：我看准的时机从不浪费，浪费的是你们不懂配合。

---

## 八、已知问题

| 编号 | 问题 | 严重度 | 状态 |
|------|------|--------|------|
| BUG-1 | 分享卡片在 iOS Safari/微信浏览器生成失败 | P0 | 未修复。manus.space iframe 环境导致 canvas tainted。真实部署环境（非 iframe proxy）下需重新验证，大概率能跑。 |
| BUG-2 | iOS Safari 不支持 `<a download>` | P2 | 已绕过。改为全屏展示 + 长按保存提示。 |

---

## 九、版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| v1 | 2026-04-22 | 初版 20 题，基础 UI，分享卡片 |
| v2 | 2026-04-23 | 题目重设计为 19 题，缓存 bug 修复，去掉分类标签，返回上一题 |
| v3 | 2026-04-23 | 18 题全量更新，新增 Q6 正面题，删除原 Q14/Q18，逆鳞文案替换 |
| v3.1 | 2026-04-23 | 分享卡片功能：品牌标题/卡牌图/人格名称/逆鳞/镜面标签/PicoPico 广告/二维码 |
| v3.2 | 2026-04-24 | 分享卡片改用纯 Canvas API，QRCode 本地化 |
| v3.3 | 2026-04-24 | Phase 2 Spec 文档推送（PHASE2_CODEX_SPEC.md + OPS_DELIVERY_SPEC.md） |

---

## 十、下一步（Phase 2）

详见 `docs/PHASE2_CODEX_SPEC.md`，核心需求：

**P0（最高优先级）**：
1. 标题改为"RMBTI 老板出手人格测试"
2. 封面到测试之间加入场翻牌过场页
3. 分享卡片修复（在真实部署环境验证）
4. 分享卡片内容优化（加挑逗性文案）
5. 生产环境隐藏分数，改为显影度
6. 隐藏称号系统（32 个组合称号）

**P1（第二优先级）**：
7. 题目页氛围化（牌面风格、金边卡片选项）
8. 选中反馈 + 轻音效 + 静音开关
9. 金币进度条 + 阶段文案
10. 结果页翻牌动画

---

## 十一、关键联系人

| 角色 | 代号 | 职责 |
|------|------|------|
| Litch | CEO / 产品 Owner | 需求定义、最终验收 |
| 子敬 | 架构师 / 中枢管理 | PRD、任务拆分、Code Review |
| Codex | 开发执行 | 根据 Spec 写代码 |
| Root (GPT Pro) | 外部评审 | 风险扫描、架构建议 |
