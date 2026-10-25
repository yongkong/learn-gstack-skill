import type { Lesson } from '../types';

export const lesson0010: Lesson = {
  id: '0010-prove-it-works',
  goal: '在说"好了"之前，能拿出真实工件的证据；出现错误时，能回到它第一次产生的地方去修。',
  blocks: [
    {
      kind: 'lead',
      text: '"好了"是一个需要证据的词。而且证据必须是别人能检查的那种。',
    },
    {
      kind: 'p',
      text: '有四样东西经常被当成"完成"：编译通过、单元测试绿、类型对、AI 说它做完了。它们都是代理指标——和"用户能用"相关，但不能替代它。中间那段路，恰恰是 bug 待着的地方。',
    },
    { kind: 'h', text: '什么算真实工件' },
    {
      kind: 'list',
      items: [
        '真的把功能跑起来：从用户会用的那个入口进，不是从测试入口进。',
        '真的读到那个值：日志里看到它，而不是推断它应该对。',
        '真的看 diff：改了什么，有没有顺手改坏别的地方。',
      ],
    },
    {
      kind: 'code',
      label: '验证记录（写给自己看，也可以贴进 PR）',
      text: `入口：/runs 页面 → 点某一行"取消"
输入：一个有 3 个子任务的 run
预期：行状态变 cancelled，3 秒内列表刷新，子任务都停
实际：（贴日志或截图）
结论：通过 / 失败在哪一步`,
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: '关键点',
      text: '验证的第一步不是跑，是写下"怎么算成功"。写不出来，说明这个任务还没定义清楚——那时候写的代码，多半也不是用户要的。',
    },
    { kind: 'h', text: '第二部分：修根因，而不是修症状' },
    {
      kind: 'p',
      text: '症状出现在哪里，不等于错误产生在哪里。React 里报"Cannot read property of undefined"的那一行，通常不是错的地方；错在五层之前，某个响应少了一个字段。',
    },
    {
      kind: 'code',
      label: '顺着错误值往回追',
      text: `崩在：RunRow.tsx:42  run.startedAt.getTime()
  ↑ startedAt 是 undefined
来自：formatDuration(run)
  ↑ 传进来的 run.state === 'running' 但没有 startedAt
来自：/api/runs 响应
  ↑ 服务端把 running 的 startedAt 写成了 null
根因：服务端在 queued → running 的迁移里漏了写 startedAt`,
    },
    {
      kind: 'p',
      text: '前三个位置都可以加防御——加判空、加默认值、加 try。每一个都能让这条线今天不崩，也让下一条同类问题更难查。根因只有一个，改它的成本通常比三处防御更低。',
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: '防御什么时候才算修',
      text: '只有当被处理的状态是合法状态时才成立。比如"用户可能中途取消"，那取消分支就该处理。如果那个状态本不该存在（running 却没有 startedAt），加防御就是把 bug 藏起来。',
    },
    {
      kind: 'callout',
      tone: 'task',
      title: '今天做一次（8 分钟）',
      text: '给手上这个任务写验证记录：入口、输入、预期、实际。只写前三行也行——很多人写到"预期"那一行就会发现，自己其实不确定成功长什么样。',
    },
    { kind: 'h', text: '检验一下（合上笔记再答）' },
    {
      kind: 'quiz',
      id: 'q1',
      question: '下面哪个属于"真实工件"式的验证？',
      options: ['单元测试全部通过', '类型检查没有报错', '从用户入口跑一遍', 'AI 报告任务完成'],
      answer: 2,
      explain: '其余三个都与"用户能用"相关但不等价。从用户入口跑一遍，才能看到真实路径上的问题。',
    },
    {
      kind: 'quiz',
      id: 'q2',
      question: '报错的那一行，通常是什么？',
      options: ['错误第一次产生的地方', '唯一值得修改的地方', '错误最终暴露的地方', '最先需要加日志的地方'],
      answer: 2,
      explain: '崩溃点是暴露点，不是产生点。错误值可能已经流了好几层，改暴露点只是让它不再喊。',
    },
    {
      kind: 'quiz',
      id: 'q3',
      question: '什么情况下加防御才算修根因？',
      options: ['防御加在最早的入口', '被处理状态是合法的', '防御带有完整日志', '防御由测试覆盖到'],
      answer: 1,
      explain: '合法状态需要被处理，这是需求；非法状态需要被消灭，加防御只是延后暴露。',
    },
    { kind: 'h', text: '这两条原则在 pstack 里长什么样' },
    { kind: 'principles', ids: ['prove-it-works', 'fix-root-causes'] },
    {
      kind: 'source',
      label: 'principle-prove-it-works/SKILL.md',
      url: 'https://github.com/cursor/plugins/blob/main/pstack/skills/principle-prove-it-works/SKILL.md',
      why: '原文列举了哪些不算验证（代理指标、自我报告、"编译过了"），这份否定清单比正面清单更有用。',
    },
  ],
  nextUp: '第 11 课：把工作切成一个个可验证的小单元，并让测试跟着行为走。',
};
