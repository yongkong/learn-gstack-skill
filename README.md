# pstack 学习站

用来长期复习 pstack（[cursor/plugins/pstack](https://github.com/cursor/plugins/tree/main/pstack)）的 24 条原则和 23 个 playbook。

课程是**纯 Markdown 文件**（`content/lessons/*.md`），站点是它们的渲染器。改内容不用碰任何 TS/JSX——md 既是网站的内容源，也是直接在 GitHub 上可读的讲义。

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
