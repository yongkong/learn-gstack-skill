---
num: "0008"
titleEn: "Make Operations Idempotent"
title: "重跑一次会怎样"
subtitle: "幂等、迁移调用者、共享状态先分离——三条让\"再来一遍\"安全的规则"
minutes: 10
phase: "architecture"
goal: "写脚本、做迁移、处理并发时，能主动问\"第二次执行会怎样\"\"第二个执行者会怎样\"，并在结构上给出答案。"
lede: "这三条原则看着不相关，其实都在回答同一个问题：当这件事被执行第二次、或者执行者不止一个，会发生什么。"
principles: ["make-operations-idempotent", "migrate-callers-then-delete-legacy-apis", "separate-before-serializing-shared-state"]
nextUp: "第 9 课：需求变了，是焊补丁还是重画？以及怎么减少读者要同时装在脑子里的东西。"
---

默认编写的代码有一个隐含假设：这段逻辑只跑一次，而且只有一个线程在跑。脚本中途 Ctrl-C、CI 重试、部署跑了两份、用户点了两次按钮——这些都不是意外，是常态。

## 一、幂等：跑第二遍的结果和第一遍一样

:::code 同一件事的两种写法
// 会叠加：跑两次，两行配置
append(config, 'feature_x = on');

// 幂等：跑几次都是"确保等于 on"
set(config, 'feature_x', 'on');

// 会叠加：每次 +1
stats.count += 1;

// 幂等：目标是"这一天计数为 42"，不是一个相对动作
stats.setCount(day, 42);
:::

判据只有一个：每一步都问"跑第二遍会发生什么"。如果答案是"会不一样"，那就还没写完——把它改成"确保存在"或"确保等于"，而不是"创建"或"追加"。

## 二、同一轮里把调用者迁完，并删掉旧 API

保留旧接口"以防万一"，实际结果是两套实现同时活着，新代码继续往旧的写，你在维护一个自己也不确定谁在用的分支。@deprecated 不是计划，是债务凭证——"以后再删"几乎从不发生。

1. 列出全部调用点，一批迁完。
2. 同一轮删掉旧实现，让 CI 做安全网。
3. 不给自己"以后再删"这个选项。

## 三、共享状态：先分离，再考虑加锁

:::code 默认动作 vs 先问一句
// 默认动作：两个写者，一把锁
mutex.run(() => { shared.total = compute(); });

// 先问：这两个写者真的需要同一份数据吗？
// 拆开各自持有 → 冲突根本不存在
const a = { total: computeA() };
const b = { total: computeB() };
:::

只有当"只能有一个写者"是真实不变量时（比如余额、库存），才应该把串行化写进结构。锁是最贵的那种正确答案：它把并发问题变成了时序问题，而时序问题更难复现。

:::callout insight 三条的共同点
它们都在处理"时序"。幂等消除重复执行的影响，迁移消除新旧并存的窗口，分离消除同时写入的可能。共同思路是：与其在时序上打补丁，不如让时序不再是变量。
:::

:::callout task 今天做一次（10 分钟）
打开你项目里任意一个脚本或迁移文件，只回答两个问题：中途杀掉再跑一次，会留下什么？跑两次，有没有东西翻倍？把答案写成两行注释贴在文件开头——写不出来的话，说明它自己也不知道。
:::

## 检验一下（合上笔记再答）

:::quiz q1
判断一段脚本是否幂等，该问的问题是？

- [ ] 它跑得够不够快
- [x] 跑第二遍会怎样
- [ ] 它的日志够不够全
- [ ] 它有没有错误处理

> 幂等的定义就是"重跑收敛到同一终态"。问第二遍，比读一遍代码更快得到答案。
:::

:::quiz q2
为什么不该保留旧 API 一段时间？

- [ ] 因为旧代码占内存
- [x] 因为两套实现会同时活着
- [ ] 因为注释会污染代码库
- [ ] 因为 CI 不支持旧接口

> 兼容层的代价不是那几行代码，是新代码继续写进旧路径，而你不再确定谁在用它。
:::

:::quiz q3
遇到并发写冲突，第一个动作应该是？

- [ ] 先加一把互斥锁
- [ ] 先加重试与回滚
- [x] 先问能否不共享
- [ ] 先写一个复现测试

> 能拆开就拆开，冲突从源头消失。锁只在"单一写者"是真实不变量时才值得付。
:::

## 这三条原则在 pstack 里长什么样

:::principles
make-operations-idempotent
migrate-callers-then-delete-legacy-apis
separate-before-serializing-shared-state
:::

:::source principle-separate-before-serializing-shared-state/SKILL.md
url: https://github.com/cursor/plugins/blob/main/pstack/skills/principle-separate-before-serializing-shared-state/SKILL.md
why: 这条最容易读错成"永远不要加锁"。原文的限定是"只有当共享写者是真实不变量时才序列化"，重点在"先试分离"。
:::
