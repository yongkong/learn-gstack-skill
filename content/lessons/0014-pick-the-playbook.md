---
num: "0014"
titleEn: "Playbook Routing"
title: "一分钟选对流程"
subtitle: "playbook 路由：从任务形状反推该走哪条流程、哪一步必须停"
minutes: 10
phase: "delegation"
goal: "拿到一个任务，一分钟内判断它的形状，选出该走哪条 playbook，并知道那条流程在哪一步必须停。"
lede: "poteto-mode 每天做的就是这件事：先认形状，再选流程。这一步你也可以手动做——而且做熟了，你会发现很多\"AI 做得很差\"的情况，其实是流程选错了。"
principles: []
nextUp: "第 15 课：两种取舍——不为过渡期写兼容层，也不为省事牺牲观感。"
---

playbook 不是功能清单，是一组已经内置了验证步骤的路径。选对流程，验证步骤就自动带上；选错流程，你会跳过本该停下来的地方——而那里通常就是 bug 待着的地方。

## 一分钟判断树

:::code 按"我现在知道什么"往下走
我只想搞明白，不改代码          → investigation
有个错，但我说不出为什么        → bug fix（先复现）
有个被测出来的慢                → perf
要长期逼近一个目标指标          → hillclimb
跑着跑着自己出问题（泄漏/空转）  → runtime forensics
手上有 profile 但看不出结论      → trace forensics
要加或改行为                    → feature（从数据形状出发）
行为对了，结构该还债            → refactoring
两条路都通、分不出来            → prototype
要对齐一张已知正确的参考图      → visual parity
一串 PR 要推到能合并            → babysit，然后 shipping
长任务、不想中途被打断          → autonomous run
:::

:::callout insight 最常见的误判
把 bug 当成 feature 来做。需求写"取消后列表不刷新"，于是直接实现"取消后刷新列表"——没复现、没找根因，改完看着好了，因为刷新的地方盖住了真正的问题。
:::

## 形状只看三个维度

1. 有没有一个明确的"错"？有 → 修（bug / perf / forensics）；没有 → 造（feature / refactor）。
2. 能不能量？能 → 用测量驱动（perf / hillclimb）；不能 → 用复现驱动（bug fix）。
3. 要不要改行为？要 → feature；不要 → refactoring / prototype。

三个问题答完，路径基本就只剩一两条了。剩下的是取舍：同样的任务，走 investigation 还是走 bug fix，取决于你现在有没有一个可复现的错——有，就走 bug fix，因为它的流程会强制你留下证据。

## 最容易混的三条

:::playbooks
bug-fix
perf
feature
:::

- bug fix 的入口是复现。做不出复现就不要往下走——后面全是猜。
- perf 的入口是基线。没有"改进前"的数字，改完你无法证明变快了（第 12 课）。
- feature 的入口是数据形状。从界面开始写的功能，通常会长出一堆状态判断（第 3 课）。

:::callout task 今天做一次（5 分钟）
把你这周做过的三件事各写一行：任务描述 + 你实际走的流程 + 判断树给出的流程。不一样的那一条，往往就是你当时最费劲的那一条。
:::

## 检验一下（合上笔记再答）

:::quiz q1
"列表滚着滚着自己抖一下"，先走哪条？

- [ ] feature：改滚动逻辑
- [ ] refactoring：重构列表
- [x] bug fix：先复现
- [ ] perf：先做基准

> 你说不出原因，但有一个明确的错。先复现再定位——没有复现，后面全是猜。
:::

:::quiz q2
"大列表要一两秒才出来"，先走哪条？

- [x] perf：先测基线
- [ ] bug fix：先复现
- [ ] feature：加骨架屏
- [ ] prototype：做两个版本

> 有可量的慢，就该用测量驱动。没有基线数字，改完无法证明变快。
:::

:::quiz q3
把 bug 当成 feature 来做，最大的损失是？

- [ ] 代码写得比较慢
- [x] 跳过了复现这一步
- [ ] 提交的消息不准确
- [ ] PR 的体量变大了

> 复现是 bug fix 的核心步骤。跳过它，你修的可能是被遮盖的症状，而不是根因。
:::

## 完整索引

23 个 playbook 的完整清单在速查页里（左侧栏 Playbook）。这一课只要记住判断树的前三层——剩下的，用到时再查。

:::source poteto-mode/SKILL.md
url: https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/SKILL.md
why: 路由规则本体。看它怎么把一个自然语言任务映射到 playbook，以及每个 playbook 的第一步是什么。
:::
