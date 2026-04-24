# RMBTI Phase 2 Review 反馈 — Codex 修复清单

> **基于 commit**: `e67d06c feat: implement phase 2 experience upgrades`
> **Reviewer**: 子敬（架构层）
> **状态**: 2 个 Must-Fix + 若干 Should-Fix

---

## Must-Fix（合并前必须修复）

### MF-1：显影度改为按维度精确计算

**问题**：当前 `getMaxScores` 返回的是所有 primary/secondary 题的"单选项最高分之和"，是所有维度共享的理论上界。导致显影度百分比偏低（全选 A 的 deep 只有 62%），用户认同感不足。

**修复方案**：改为按维度精确计算每个维度的理论最高分。

具体实现：
```javascript
// engine.js 中新增
const getDimensionMaxScores = (questions) => {
  const maxByDimension = {};
  questions.forEach((question) => {
    // 对每道题，找出每个维度能拿到的最高分
    const dimensionMax = {};
    question.options.forEach((option) => {
      option.scores.forEach((entry) => {
        dimensionMax[entry.id] = Math.max(dimensionMax[entry.id] || 0, entry.points);
      });
    });
    // 累加到总 max
    Object.entries(dimensionMax).forEach(([id, points]) => {
      maxByDimension[id] = (maxByDimension[id] || 0) + points;
    });
  });
  return maxByDimension;
};
```

然后 `toScorePercent` 改为接受维度 ID，从 `getDimensionMaxScores` 的结果中取对应维度的 max。

app.js 中调用处也需要相应调整，把 `SCORE_MAX.primary` 替换为 `dimensionMax[dimensionId]`。

**验收标准**：全选 A 的 deep 显影度应该在 80-90% 范围，而不是 62%。

### MF-2：intro 过场页加跳过能力

**问题**：intro 页面 3.4 秒自动跳转，但用户无法点击跳过。重复测试时每次都要等 3.4 秒。

**修复方案**：
- 在 intro 页面加一个"跳过"文字按钮（底部，低调样式）
- 或者点击 intro 页面任意位置即可跳过
- 跳过时清除 introTimer，直接 `setView("question")`

---

## Should-Fix（建议修复，不阻塞合并）

### SF-1：补 P1-4 结果翻牌动画

Spec 要求结果页有 1.5-2s 的翻牌显影效果（牌背 → 翻转 → 正面显现），当前是 loading 页 1.7s 后直接切换到 result 页。建议在 result-card 上加一个 CSS 3D 翻转入场动画。

### SF-2：progressStage 最后一题文案

当 number=18 时显示"等待翻牌"，建议改为"即将翻牌"或"最后一张牌"。

### SF-3：showShareFallback overlay 点击背景关闭

当前只有 × 按钮能关闭，建议加上点击 overlay 背景区域也能关闭。

---

## Nit（可选）

- `engine.test.js` 中检查 html2canvas CDN URL 为 undefined 的断言可以删除
- question kicker 建议改为数据驱动（question 对象加可选 `kicker` 字段），方便未来扩展

---

## 完整 Review 报告

详见仓库或找子敬要 `rmbti_phase2_review_v2.md`。
