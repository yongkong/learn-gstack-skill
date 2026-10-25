# pstack 学习站

用来长期复习 pstack（[cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack)）的 24 条原则和 23 个 playbook。

**在线访问 → [yongkong.github.io/learn-gstack-skill](https://yongkong.github.io/learn-gstack-skill/)**

备用地址：[pstack-study.app.workbuddy.host/?sharecode=BUJJTI3CNJ](https://pstack-study.app.workbuddy.host/?sharecode=BUJJTI3CNJ)（这个域有访问保护，必须带 `?sharecode`，只开域名会看到「链接不完整」）

16 课 / 5 个阶段 / 48 道检索题，覆盖全部 24 条原则，不漏不重。课程是**纯 Markdown 文件**（`content/lessons/*.md`），站点是它们的渲染器。改内容不用碰任何 TS/JSX——md 既是网站的内容源，也是直接在 GitHub 上可读的讲义。

## 内容

16 课，合计约 2.3 小时净内容，每课 3 道检索题（共 48 道）。

| # | Lesson | 中文 | 分钟 | 覆盖原则 |
|---|---|---|---|---|
| 01 | Laziness Protocol | 先删，再写 | 7 | laziness-protocol |
| 02 | Subtract Before You Add | 删之前先证明 | 8 | subtract-before-you-add |
| 03 | Foundational Thinking | 先定形状 | 9 | foundational-thinking |
| 04 | Attack the Premise | 换个前提再试 | 8 | attack-the-premise |
| 05 | Exhaust the Design Space, Then Build the Lever | 先比，然后让工具去干 | 9 | exhaust-the-design-space · build-the-lever |
| 06 | Model the Domain, Then Enforce It in Types | 让错的状态写不出来 | 10 | model-the-domain · type-system-discipline |
| 07 | Boundary Discipline | 防御只放在门口 | 8 | boundary-discipline |
| 08 | Make Operations Idempotent | 重跑一次会怎样 | 10 | make-operations-idempotent · migrate-callers · separate-shared-state |
| 09 | Redesign From First Principles | 假装它一开始就在 | 9 | redesign-from-first-principles · minimize-reader-load |
| 10 | Prove It Works | 别用「编译过了」交差 | 9 | prove-it-works · fix-root-causes |
| 11 | Sequence Verifiable Units | 一个单元，一个可验证态 | 9 | sequence-verifiable-units · test-behavior-not-implementation |
| 12 | Explain the Number | 解释这个数字 | 8 | explain-the-number |
| 13 | Guard the Context Window | 主线程只留结论 | 8 | guard-the-context-window · never-block-on-the-human |
| 14 | Playbook Routing | 一分钟选对流程 | 10 | （用 23 个 playbook 做路由练习） |
| 15 | Outcome Oriented Execution | 直线奔向目标架构 | 8 | outcome-oriented-execution · experience-first |
| 16 | Encode Lessons in Structure | 让规则自己执行 | 7 | encode-lessons-in-structure |

24 条原则一条不漏、一条不重复；这个声明由 `npm run smoke` 断言，不是文案。

## 跑起来

```bash
npm install
npm run dev      # http://localhost:5273
```

## 验证

```bash
npm run build    # 类型检查 + 生产构建
npm run smoke    # 逐课 SSR 渲染 + 覆盖一致性 + 双语完整性，共 114 项断言
```

坏掉的 frontmatter 会让构建失败并指到具体文件（缺字段、`num` 与文件名不一致、题没有唯一正确答案等），不会悄悄进产物。

## 发布

线上有两个地址，跑的是同一份 `dist/`。产物用**相对路径**（`base: './'`），所以同一份文件既能挂在域名根路径，也能挂在 Pages 的子路径 `/learn-gstack-skill/` 下。

**GitHub Pages（主地址，无参数）**

```bash
npm run deploy:pages    # 构建 → 推到 gh-pages 分支
```

产物内容没变时会自动跳过，不会因重复执行产生只改时间戳的提交。首推后 Pages 约 30–60 秒生效。

**WorkBuddy 托管（备用地址）**

```bash
npm run build           # 产出 dist/
```

然后在对话里说「发布」，由发布能力上传 `dist/` 覆盖同一地址。这个域名带 sharecode 访问保护，链接里必须保留 `?sharecode=...`。

两边都**不会自动发布**：改完代码别人看到的页面不会自己变，这是有意的——避免你还在本机编辑时线上已经变了。

## 课程 md 格式

### frontmatter

```yaml
---
num: "0001"                     # 4 位，必须与文件名前缀一致
titleEn: "Laziness Protocol"    # 原则的英文正式名，展示为标题上方的 kicker
title: "先删，再写"              # 中文标题
subtitle: "偏向删除，偏向解决问题的最小改动"
minutes: 7
phase: "core"                   # core / architecture / verification / delegation / closing
goal: "学完能做到什么，一句话"
lede: "开篇导语（可选）"
principles: ["laziness-protocol"]   # 本课负责讲透的原则 id
nextUp: "第 2 课：……（可选）"
---
```

除 `num / title / subtitle / minutes / phase / goal` 外都可省略。正文不要写一级标题 `#`，页面标题由 `title` 提供。

### 正文

普通 Markdown 直接写：段落、`##` 二级标题、有序/无序列表、`**粗体**`、行内 `code`、链接，全部交给 markdown-it 渲染，样式由 `.prose` 统一控制。

需要变成 React 组件的部分用 `:::name arg` 容器（`:::` 必须单独一行，闭合也是）：

| 容器 | 写法 | 渲染成 |
|---|---|---|
| callout | `:::callout insight 关键点` | 带色调的提示框，tone 可选 `insight` / `warn` / `task` |
| code | `:::code ADD 版` | 带标签的代码/终端块，内容原样保留 |
| quote | `:::quote 来源` | 引用块 + 出处 |
| quiz | `:::quiz q1` | 检索练习，见下 |
| principles | `:::principles` | 原则卡片，每行一个原则 id |
| playbooks | `:::playbooks` | playbook 卡片，每行一个 id |
| source | `:::source 标题` | primary source 卡片，需 `url:` 和 `why:` 两行 |

测验用 GFM 任务列表表示选项，`[x]` 是正确答案，`>` 开头的是解释：

```md
:::quiz q1
按 Laziness Protocol，拿到需求后第一步要做的是什么？

- [ ] 提升测试的覆盖率
- [x] 确认能不能靠删除解决

> 第一步是减法。先确认「能不能删」，再谈复用。
:::
```

## 结构

```
content/lessons/*.md   课程正文（唯一内容来源）
build/
  md-lesson.ts         md → Lesson 解析器，构建期运行
  vite-plugin-lessons.ts  把 md 编译成模块，dev 下改 md 自动刷新
src/
  content/
    principles.ts      24 条原则：英文正式名 / 中文释义 / 触发时机 / 落地动作
    playbooks.ts       23 个 playbook，按任务形状分组
    phases.ts          5 个阶段
    lessons.ts         glob 汇总所有 md
    curriculum.ts      由 frontmatter 派生路线图，不手写
    types.ts           Block 与 Lesson 的类型
  components/          渲染层，跨课程复用
  pages/               首页 / 课程页 / 原则速查 / playbook 索引
  lib/                 hash 路由与进度存储
```

`markdown-it` 和 `gray-matter` 只在构建期跑，客户端 bundle 不含解析器。

## 新增一节课

1. 在 `content/lessons/` 放一个 `NNNN-slug.md`，写好 frontmatter 和正文。

完。不需要注册、不需要改路线图、不需要动组件——`lessons.ts` 的 glob 会自动收进来，`curriculum.ts` 会从 frontmatter 派生出卡片，smoke 会把它纳入断言。

## 设计取舍

- **md 是唯一来源**：标题、时长、阶段只写在 frontmatter 里。以前这些在 `curriculum.ts` 和课程文件里各写一遍，16 课就有 64 处可以漂移。
- **解析在构建期**：运行时零新增依赖，`dist/` 依旧能直接双击打开。
- **术语规范独立成文**：见 `GLOSSARY.md`。原则名用英文原文，中文只作解释——否则同一个概念会在 16 课里长出 5 个中文名，且无法在上游资料里检索。

## 其他文件

- `MISSION.md` — 为什么学这个，学成什么样算成功。
- `GLOSSARY.md` — 术语规范：哪些词用英文、哪些双语、中文怎么写。
- `RESOURCES.md` — 可信来源清单（含缺口说明）。
- `learning-records/` — 已经掌握什么、前提被如何修正。
- `NOTES.md` — 教学偏好与工程约定。
