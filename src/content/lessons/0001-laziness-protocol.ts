import type { Lesson } from '../types';

export const lesson0001: Lesson = {
  id: '0001-laziness-protocol',
  goal: '拿到任何一个需求，能先跑完"删 / 复用 / 新增"三道闸，而不是直接开始写。',
  blocks: [
    {
      kind: 'lead',
      text: 'pstack 的目标不是让 AI 写更多代码，而是让它写更少、更对的代码。作者的原话是：想快，先深入。',
    },
    {
      kind: 'p',
      text: '这句话之所以成立，是因为 AI 的默认行为是"对需求做加法"。你说"给列表加个筛选"，它会给你筛选组件、状态管理、URL 同步、空态、加载态、结果缓存——每一项单独看都合理，加起来就是你 review 不动的那个 PR。',
    },
    { kind: 'h', text: 'slop 的三个特征' },
    {
      kind: 'list',
      ordered: true,
      items: [
        '分支变多：同一个意图在三个地方各判断了一次。',
        '层次变多：多了一层"为了将来好扩展"的包装。',
        '删不掉：你不敢动它，因为不确定谁在依赖它。',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: '关键点',
      text: 'slop 不是"写得差"，是"写得多"。所以治它的不是更好的代码风格，是更少的代码。',
    },
    { kind: 'h', text: '懒惰协议：三道闸，按顺序过' },
    {
      kind: 'p',
      text: '这是 24 条原则里最靠前的一条，因为它在你写第一行代码之前就生效。它的完整规则只有一句话：',
    },
    {
      kind: 'quote',
      text: 'Bias toward deletion and the smallest change that solves the problem.',
      source: 'principle-laziness-protocol/SKILL.md',
    },
    { kind: 'principles', ids: ['laziness-protocol'] },
    {
      kind: 'p',
      text: '把它变成能执行的顺序，就是三道闸。每一道闸都可能让工作在第 0 步就结束——那是好事，不是偷懒。',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '闸一 · 能删吗：这个需求，能不能靠删掉一些东西满足？比如删掉一个配置项、一个开关、一个几乎没人用的分支。',
        '闸二 · 能复用吗：现成的类型、函数、组件里，有没有已经做完这件事的？有就接上去，不新建。',
        '闸三 · 最小新增：只写刚够用的那部分。不为想象中的第二个调用方预留接口。',
      ],
    },
    { kind: 'h', text: '同一句需求，两种回应' },
    {
      kind: 'p',
      text: '这是最容易被忽略的地方：三道闸不是"想一想"，是要你把结论写在需求旁边。看差别——',
    },
    {
      kind: 'code',
      label: 'ADD 版（默认行为）',
      text: `给列表加个筛选。
→ 新建 FilterState context
→ 新建 FilterBar / FilterChip / EmptyState
→ 加 URL 同步 hook
→ 加 useFilteredList，内部缓存结果`,
    },
    {
      kind: 'code',
      label: 'SUBTRACT 版（懒惰协议）',
      text: `给列表加个筛选。
删：页面里已有一份筛选逻辑，先把重复的那份删掉。
复用：列表本身已从 URL 读 query，直接接上。
新增：只加一个 <select>，受控于 query 里已有的 key。
不做：空态（现有空态已覆盖）、缓存（数据量 200 行）。`,
    },
    {
      kind: 'p',
      text: '两份回应的差别不在技术，在于"新增之前有没有先算减法"。第一份大概 400 行，第二份 20 行，而用户看到的完全一样。',
    },
    {
      kind: 'callout',
      tone: 'task',
      title: '今天就做一次（5 分钟）',
      text: '挑一个你手上"改了很久、越改越大"的需求。先不写代码，只写三行：能删什么、能复用什么、最小改动是什么。写完再决定要不要按原计划做。',
    },
    { kind: 'h', text: '检验一下（合上笔记再答）' },
    {
      kind: 'quiz',
      id: 'q1',
      question: '按懒惰协议，拿到需求后第一件要做的事是？',
      options: ['提升测试的覆盖率', '重构现有的抽象层', '删掉不必要的东西', '复用已有的实现'],
      answer: 2,
      explain: '第一道闸是减法。先确认"能不能靠删东西解决"，再谈复用，最后才是新增。',
    },
    {
      kind: 'quiz',
      id: 'q2',
      question: '下面哪种回应最符合懒惰协议？',
      options: [
        '为筛选功能新增一个状态管理库',
        '用现成的 URL 参数承接筛选状态',
        '为筛选预先设计一套插件接口',
        '为筛选补三个空态和一个加载态',
      ],
      answer: 1,
      explain: '状态已经存在于 URL，接上去就是最小改动。其余三个选项都是为"可能的需要"提前付成本。',
    },
    {
      kind: 'quiz',
      id: 'q3',
      question: '判断"这段代码能不能删"的正确依据是？',
      options: ['感觉它已经没人用了', '注释掉它观察一周', '看它有没有写测试', '搜到并删掉所有调用点'],
      answer: 3,
      explain: '删除是一棵树的修剪，不是猜谜。先搜出全部调用点，确认它们都不需要，再动手删——这是可验证的，其余三条都是感觉。',
    },
    { kind: 'h', text: '这条原则的下游' },
    {
      kind: 'p',
      text: '懒惰协议不是孤立的。它有两个直接的下游：先减后加（删干净再建），最小化读者负担（删得越干净，读者要装的东西越少）。',
    },
    { kind: 'principles', ids: ['subtract-before-you-add', 'minimize-reader-load'] },
    {
      kind: 'source',
      label: 'pstack README：24 条原则总表',
      url: 'https://github.com/cursor/plugins/blob/main/pstack/README.md',
      why: 'primary source。第一遍读原则表，第二遍再回来读这一课。',
    },
  ],
  nextUp: '第 2 课：把"能删吗"变成可验证的动作——先减后加，以及删除前怎么证明没人用。',
};
