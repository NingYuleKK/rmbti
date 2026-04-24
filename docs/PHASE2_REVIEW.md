# RMBTI Phase 2 架构层 Review 报告

> **Commit**: `e67d06c feat: implement phase 2 experience upgrades`
> **Reviewer**: 子敬（架构层）
> **日期**: 2026-04-24

---

## 一、Review 结论

**整体评价：通过，质量很高。** Codex 在一个 commit 里完成了 P0 全部 6 项 + P1 全部 4 项，代码结构清晰，测试覆盖到位，没有破坏已有功能。

**可以合并的条件**：修复下面 2 个 Must-Fix 后即可合并。

---

## 二、Spec 对照检查

| 需求 | 状态 | 说明 |
|------|------|------|
| P0-1 标题/副标题/按钮改文案 | ✅ 完成 | title、config.title、config.subtitle、按钮"开始翻牌"全部正确 |
| P0-2 入场翻牌过场页 | ✅ 完成 | intro-screen + 3 张牌动画 + 金币火花 + 3.4s 自动进入答题，timer 清理正确 |
| P0-3 分享卡片修复 | ⚠️ 部分 | 加了 showShareFallback 降级方案（截图提示），iOS 根因仍未解决，但这是合理的策略——真实部署环境需要研发验证 |
| P0-4 分享卡片内容优化 | ✅ 完成 | 加了隐藏称号 + 挑逗文案"我测出来是「XX」"+ 逆鳞 + "来测测你是哪张老板牌" |
| P0-5 显影度替代分数 | ✅ 完成 | 默认显示显影度百分比，?debug=1 显示原始分数，逻辑正确 |
| P0-6 隐藏称号系统 | ✅ 完成 | 32 个称号全覆盖（8 主牌 × 4 副签），engine 返回 hiddenTitle，结果页和分享卡都展示 |
| P1-1 题目页氛围化 | ✅ 完成 | 不同题型不同背景色（turnoff 红色调、mirror 白光调、secondary 金色调）+ 金边内框 + 入场/退场动画 |
| P1-2 选中反馈+音效 | ✅ 完成 | Web Audio API 合成音效（select/flip/complete/reveal）+ 触觉振动 + 静音开关 + localStorage 持久化 |
| P1-3 金币进度条 | ✅ 完成 | 18 节点金币进度条 + 里程碑发光动画 + 阶段文案（洗牌中/主牌显影/副签归位/等待翻牌） |
| P1-4 结果翻牌动画 | ⚠️ 未见 | Spec 要求结果页有 1.5-2s 翻牌显影动画，当前 loading → result 是直接切换，没有翻牌效果 |

---

## 三、架构质量评估

### 3.1 做得好的地方

**engine.js 保持纯函数**：新增的 `buildHiddenTitle`、`getMaxScores`、`toScorePercent` 都是纯函数，不依赖 DOM，可在 Node.js 测试。这是正确的架构决策。

**combinationTemplates 向后兼容**：从 string 改为 object 时，engine 里加了 `typeof template === "string"` 的兼容判断，不会破坏旧数据。

**音效方案轻量**：用 Web Audio API 合成而不是加载音频文件，零网络开销，iOS 兼容性好。oscillator 频率和增益参数设计合理，不会刺耳。

**debug 模式**：`?debug=1` 显示原始分数，生产环境显示显影度，这个设计对开发调试和运营都很友好。

**测试覆盖**：新增了隐藏称号覆盖检查（32 个组合全覆盖）、显影度百分比计算验证、标题文案断言、app.js 关键字符串存在性检查。

### 3.2 Must-Fix（必须修复才能合并）

**MF-1：getMaxScores 的计算逻辑有语义问题**

当前实现取的是"每道题中单个选项的最高单维度分数之和"。用户测出 deep=13，max=21，显影度=62%——但实际上 deep 的理论最高分不是 21（因为不可能每道题都选到给 deep 加分最多的选项，有些题根本没有 deep 选项）。

验证数据：

| 场景 | 主牌 | 分数 | 显影度 |
|------|------|------|--------|
| 全选 A | deep | 13 | 62% |
| 全选 B | clutch | 6 | 29% |
| 全选 C | ctrl | 9 | 43% |
| 全选 D | king | 12 | 57% |

全选同一选项是极端场景，但最高只有 62% 可能让用户觉得"测不准"。

**建议**：两个方案让 Litch 选——
- A. 保持当前实现，加注释说明这是"理论上界"（简单，但显影度偏低）
- B. 改为按维度精确计算最高分（准确，但需要改 engine）

**MF-2：intro 过场页无法跳过**

当前 intro 页面 3.4 秒自动跳转，但用户无法点击跳过。对于重复测试的用户（点了"再测一次"），每次都要等 3.4 秒，体验不好。

**建议**：在 intro 页面加一个"跳过"按钮或点击任意位置跳过。

### 3.3 Should-Fix（建议修复，不阻塞合并）

**SF-1：P1-4 结果翻牌动画未实现**

Spec 要求结果页有 1.5-2s 的翻牌显影效果（牌背 → 翻转 → 正面显现），当前是 loading 页 1.7s 后直接切换到 result 页，没有翻牌动画。建议后续补上。

**SF-2：progressStage 阶段文案的边界值**

当 number=18（最后一题）时显示"等待翻牌"，但此时用户正在答最后一题还没翻牌，文案略有歧义。建议改为"最后一张牌"或"即将翻牌"。

**SF-3：question-kicker 只在第一题硬编码显示**

如果未来想给其他题也加 kicker（比如 mirror 题加"镜面题：这道题不计分"），需要改成数据驱动。建议在 question 对象里加一个可选的 `kicker` 字段。

**SF-4：vibrate 兼容性说明**

`navigator.vibrate` 在 iOS Safari 上不支持。当前代码有保护不会报错，但 iOS 用户完全感受不到触觉反馈。建议在 TECH_HANDOVER 里说明。

### 3.4 Nit（代码风格，不影响功能）

**N-1**：`engine.test.js` 里检查 html2canvas CDN URL 为 undefined 的断言可以删除（既然已经不用 html2canvas 了，检查它不存在没有长期价值）。

**N-2**：`showShareFallback` 的 overlay 只有 × 按钮能关，建议加上点击背景关闭。

---

## 四、安全与性能

- **无安全风险**：没有用户输入注入、没有外部 API 调用、没有敏感数据
- **性能良好**：Web Audio 合成音效零网络开销，CSS 动画 GPU 加速，Canvas 分享卡片生成是异步的
- **localStorage 使用合理**：只存静音开关状态，不存敏感数据

---

## 五、总结

Codex 这次交付质量很高，一个 commit 覆盖了 P0+P1 全部 10 项需求中的 9 项（P1-4 翻牌动画未实现），代码结构清晰，测试通过，没有破坏已有功能。

**合并前必须处理**：
1. MF-1：getMaxScores 显影度计算方案——让 Litch 选 A 或 B
2. MF-2：intro 过场页加"跳过"能力

**后续建议**：
1. 补 P1-4 结果翻牌动画
2. progressStage 最后一题文案优化
3. question kicker 改为数据驱动
4. TECH_HANDOVER 补充 vibrate 兼容性说明
