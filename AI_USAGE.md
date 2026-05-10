# AI 使用说明

## 用到的 AI 工具

- **Claude Code（Opus 4.7，VSCode 内置插件）** — 主要用于代码生成、重构、调试。
- **Kimi 2.6** — 主要用于 UI / 交互 / 视觉设计方面的构思讨论（配色方案、信息密度、动效节奏、竞品对比分析等）。

两个工具的分工大致是：Kimi 帮我把"想做成什么样"的模糊感受落成具体方案（比如确定暖灰底 + 明黄 accent 的色系、`/quiz/analyzing` 是否要做成全屏 loading），Claude Code 把方案落成代码。

## 协作流程

我没有让 AI "一句话生成整个项目"。整个开发分成 6 个阶段，每个阶段都先自己想清楚再开始：

1. **整体框架** — Next.js App Router、路由策略（每个 step 独立路由）、状态管理（Zustand + localStorage 持久化）、Tailwind v4 语义 token 色板。
2. **首页 + 背景** — 落地页节奏、暖灰底 + radial 黄光晕、CTA 大按钮。
3. **问卷各个 step** — Step 1 性别、Step 2 目标、Step 3 身体数据（含公/英制切换 + 校验）、Step 4 频率。
4. **过场 loading 页** — `/quiz/analyzing`，不计入进度条，全屏沉浸。
5. **报告页 + 价格弹窗** — BMI / 预计达标日期 / 趋势图 / PriceModal。
6. **打磨与适配** — 暗色模式、中英文切换、移动端适配（iOS Safari `100dvh`）、卡片配色调整、loading 样式从圆环改 checklist。

每个阶段的常规节奏：

- **我先想好**：UI 草图、交互、需要的字段、边界情况。
- **跟 AI 讨论方案**：尤其是有多个实现路径时，让 AI 把利弊摆出来，我做选择。
- **AI 生成代码**：要求它列出新增/修改的文件清单。
- **我人工审阅**：重点看有没有明显违反我要求的地方、嵌套地狱、不必要的抽象。
- **跑起来 + 反馈**：浏览器里走一遍，记下 UX 问题。
- **下一轮迭代**：CSS 与文案我自己改；功能性问题再回来跟 AI 讨论方案 → 修改。

## 哪些是 AI 写的，哪些是我手动改的

**AI 主导**：组件骨架（OptionCard / NumberField / UnitToggle / QuizShell / AnalyzeLoader / WeightTrendChart / PriceModal）、Zustand store schema、单位换算工具（`src/lib/units.ts`）、i18n 字典脚手架、动画时序、SVG 趋势图的坐标计算。

**我手动改**：视觉细节（间距、字号、token 配色微调）、中英文文案、移动端适配的关键决策、暗色模式色板、卡片背景从纯白改成浅暖灰、AnalyzeLoader 从圆环改成 checklist 式。

CSS 和文案这种"看一眼就知道哪不对"的东西，我直接手调比让 AI 改一轮一轮反馈更快。功能性问题（涉及类型、状态流转、跨组件影响）才回来跟 AI 讨论。

## 几个我推翻 AI 第一版方案的例子

这部分比"我会审阅"更能说明实际取舍 —— 都是过程中 AI 给的方案我没直接接受、或测试后改掉的：

### 1. 页面切换动画：从 AnimatePresence 改成 template.tsx

AI 一开始把 `<AnimatePresence mode="wait">` 放在 `QuizShell` 里包 `<motion.div key={pathname}>`。跑起来肉眼能捕捉到"闪一下" —— 新页面会在 framer-motion 应用 `initial={{ opacity: 0 }}` 之前先以默认状态渲染一帧，这是 Next.js App Router 路由切换的渲染时序竞争。

改用 `src/app/quiz/template.tsx`：Next.js 的 template 每次导航都会重新挂载，新页面是全新的 `motion.div` 从 `initial` 干净开始，没有时序问题。代价是失去旧页面的 exit 动画（BetterMe / Linear / Stripe 这类参考产品也是单向"新页面进入"，可接受）。

### 2. lb → kg 精度丢失

Step 3 体重原本写法是 `Math.round(lbToKg(v))` 强存整数 kg。测试时发现输入 3 lb 显示成 2 lb —— 因为多个 lb 值会被压到同一个整数 kg。改成体重以浮点 kg 存储，显示前两端各自 `Math.round`，问题消失。身高的 ft+in 与 cm 整数粒度大致匹配，沿用 `Math.round` 不丢精度。

### 3. AnalyzeLoader：从圆环改成 checklist

第一版是 quiz funnel 行业默认的"圆环 + 百分比数字 + 文案轮播"。和 AI 讨论后判断这套在 BetterMe / Noom / Cal AI / Lensa 等同类产品里被严重复用，没有辨识度（Lottie 库 + Framer 模板里都有现成的）。

改成 checklist 式：4 个步骤垂直排列，每步 ~875ms，状态从 pending（描边圆点）→ active（实心黄点 + 向外脉动光圈）→ done（黄底白勾），步骤间竖线随完成进度灌色。保留 3.5s 总时长，视觉母题从"圆环"换成"任务列表"，跟竞品拉开差距。

### 4. iOS Safari 视口居中偏下

移动端测试时首页内容垂直居中明显偏下。原因是 `min-h-screen`（100vh）按 URL 栏隐藏后的最大视口算，但页面刚打开时 URL 栏 + 底部工具栏都在，真实可视区域更小，居中点对不上。换成 `min-h-dvh`（dynamic viewport height）解决。同时把 QuizShell、body 全局都换成 dvh 保持一致。

## 工程结构

让 AI 从一开始就按清晰结构组织代码，不允许中途把组件、工具、状态混堆：

```
src/
  app/             # Next.js App Router 路由
    quiz/
      step-1..4/
      analyzing/
      step-5/
      template.tsx # 页面切换动画
  components/
    quiz/          # 业务组件
  lib/
    i18n/          # 中英文字典
    units.ts       # 公英制换算
    quiz-config.ts
  store/
    quiz.ts        # Zustand + persist
```

这是我自己其它项目的习惯。带来的好处：

- `pnpm install && pnpm dev` 即可在本地跑起来。
- 新增一个 step 只需要复制一个路由文件并对接 store，组件可直接复用。
- 设计令牌全部走 Tailwind v4 `@theme` 变量（`--color-background` / `--color-surface` 等），换皮一键生效（实际开发中已经利用这点把卡片从纯白调成浅暖灰）。
- 工程笔记沉淀在 `CLAUDE.md` 里，AI 进入下次会话时不会重复同样的错误（比如不会再尝试用 AnimatePresence 做页面切换）。