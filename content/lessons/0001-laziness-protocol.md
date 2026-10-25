---
num: "0001"
titleEn: "Laziness Protocol"
title: "先删，再写"
subtitle: "偏向删除，偏向解决问题的最小改动——不是写得少，是只写该写的"
minutes: 7
phase: "core"
goal: "拿到一个需求，先判断能不能靠删除或复用解决，再决定要新增什么。"
lede: "pstack 有 24 条原则，Laziness Protocol 排在最前面，因为它在第一行代码之前就生效。"
principles: ["laziness-protocol"]
nextUp: "第 2 课：删除之前怎么证明真的没人用——把「能不能删」从感觉变成可验证的动作。"
---

AI 编程助手的默认策略是对需求做加法。一个「给列表加个筛选」的需求，常见产出是这样的：

- 一个筛选组件
- 一套独立的状态管理
- 与 URL 的同步逻辑
- 空态、加载态、结果缓存

单看每一项都合理，合起来就是一次 review 不动的提交。

这类产出在 pstack 里叫 `slop`。它不是写得差，是写得多。三个可识别的特征：

1. 同一个判断在多个位置各写了一遍。
2. 为了「将来可能扩展」多出一层包装。
3. 没人敢删——因为不确定还有没有调用点。

第三点影响最大。代码一旦进入「不确定能不能删」的状态，它就从资产变成负债，而且这个不确定性会一直向下传递。

## 原则原文

`Laziness Protocol` 的规则只有一句：

:::quote pstack/skills/principle-laziness-protocol/SKILL.md
Bias toward deletion and the smallest change that solves the problem.
:::

:::principles
laziness-protocol
:::

## 落到操作上是三步

顺序不能换。每一步都可能让整件事在第 0 步结束，这是允许的——省下来的维护成本会在之后每次改动里体现出来。

1. **能删吗**：这个需求能不能靠删掉现有东西满足。删一个配置项、一个开关、一段几乎没人走的分支，通常比新增更快。
2. **能复用吗**：现有的类型、函数、组件里有没有已经做完这件事的。有就接上去，不新建。
3. **最小新增**：只写当前调用方需要的部分，不为想象中的第二个调用方预留接口。

## 同一句需求的两种回应

需要注意：这三步不是「想一想」，结论要写下来，落在需求旁边。

:::code ADD（默认行为）
给列表加个筛选。
→ 新建 FilterState context
→ 新建 FilterBar / FilterChip / EmptyState
→ 加 URL 同步 hook
→ 加 useFilteredList，内部缓存结果
:::

:::code SUBTRACT（Laziness Protocol）
给列表加个筛选。
删：页面里已有一份筛选逻辑，先把重复的那份删掉。
复用：列表本身已从 URL 读 query，直接接上。
新增：只加一个 <select>，受控于 query 里已有的 key。
不做：空态（现有空态已覆盖）、缓存（数据量 200 行）。
:::

两份回应的差别不在技术，在于新增之前有没有先算减法。第一份大约 400 行，第二份 20 行，用户看到的效果相同。

:::callout insight 关键点
`slop` 不是代码风格问题，是数量问题。治它不是换一种写法，是减少要写的东西。
:::

:::callout task 今天做一次（5 分钟）
选一个过去一周里「越改越大」的需求。不写代码，只写三行：能删什么、能复用什么、最小改动是什么。写完再决定是否按原计划执行。
:::

## 检验一下（合上笔记再答）

:::quiz q1
按 Laziness Protocol，拿到需求后第一步要做的是什么？

- [ ] 提升测试的覆盖率
- [ ] 重构现有的抽象层
- [x] 确认能不能靠删除解决
- [ ] 复用已有的实现

> 第一步是减法。先确认「能不能删」，再谈复用，最后才轮到新增。
:::

:::quiz q2
下面哪种回应最符合 Laziness Protocol？

- [ ] 为筛选功能新增一个状态管理库
- [x] 用现成的 URL 参数承接筛选状态
- [ ] 为筛选预先设计一套插件接口
- [ ] 为筛选补三个空态和一个加载态

> 状态已经存在于 URL，接上去就是最小改动。其余三项都是为「可能的需要」提前付成本。
:::

:::quiz q3
判断「这段代码能不能删」，正确的依据是什么？

- [ ] 感觉它已经没人用了
- [ ] 注释掉它观察一周
- [ ] 看它有没有写测试
- [x] 搜到并逐个处理所有调用点

> 删除是修剪，不是猜谜。先搜出全部调用点，确认它们都不需要这段代码，再动手——只有这一条是可验证的。
:::

## 这条原则的下游

`Laziness Protocol` 有两个直接下游：`Subtract Before You Add` 处理「删之前怎么证明没人用」，`Minimize Reader Load` 处理「删干净之后读者需要装进脑子多少东西」。两条都会在后面单独讲。

:::principles
subtract-before-you-add
minimize-reader-load
:::

:::source pstack README：24 条原则总表
url: https://github.com/cursor/plugins/blob/main/pstack/README.md
why: primary source。第一遍读原则总表建立索引，第二遍再回来看这一课。
:::
