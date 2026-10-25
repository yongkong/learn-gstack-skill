import type { Lesson } from '../types';

export const lesson0009: Lesson = {
  id: '0009-as-if-it-was-always-there',
  goal: '需求变更时先问"如果它一开始就存在会怎么设计"，而不是直接往老结构上焊补丁；能数出读者要背的负担并砍掉它。',
  blocks: [
    {
      kind: 'lead',
      text: '需求变更时的第一反应决定后面要走多远。焊补丁的人今天最快，重画的人一周后最快。',
    },
    {
      kind: 'p',
      text: '焊补丁的典型形态：加一个 flag、加一个可选参数、加一层适配。每一处都不大，但组合起来是一个"只有原作者能改"的结构。重画则是先假装需求一开始就在，把它当成基础假设重新设计一遍。',
    },
    { kind: 'h', text: '重画三问' },
    {
      kind: 'list',
      ordered: true,
      items: [
        '如果这个需求第一天就存在，数据会长什么样？',
        '按那个样子重画一遍，再和现实对比，看差在哪一步？',
        '差异通常集中在少数几个类型上——只改那几个，而不是到处加判断。',
      ],
    },
    {
      kind: 'code',
      label: '同一个需求：单选变多选',
      text: `// 补丁派：单选结构不动，外面套多选
type Selection = { id: string; extraIds?: string[] };
// 于是每个用到 selection.id 的地方都要问一句：那 extraIds 呢？

// 重画派：一开始就是集合
type Selection = { ids: ReadonlySet<string> };
// 单选 = 集合里恰好一个元素。没有第二种形状，也没有"两个字段要保持同步"。`,
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: '关键点',
      text: '重画的成本不是"重写一遍"，是"想清楚一次"。多数情况下你会发现，需要动的只有类型定义和两三处边界，而不是整个模块。',
    },
    { kind: 'h', text: '第二部分：最小化读者负担' },
    {
      kind: 'p',
      text: '代码是写给人读的，而读者的工作记忆很小。读者负担有两个可数的来源：从问题到答案隔了几层，以及脑子里同时要装多少隐藏状态。',
    },
    {
      kind: 'list',
      items: [
        '只有一个调用方的包装层：通常可以直接内联，层数 -1，读者少跳一次。',
        '可变作用域太大：把变量声明挪到真正需要它的那一行，读者不用记"它前面改过吗"。',
        '必须"先知道 A 才知道 B 在干什么"：这是隐式前置知识，能合就合。',
      ],
    },
    {
      kind: 'code',
      label: '数层数',
      text: `// 三层：页面 → hook → 仓储 → fetch
useUsers() → repo.listUsers() → http.get('/users')
// 仓储只做转发，没有自己的逻辑 → 内联，两层足够

// 但注意：如果仓储负责了缓存、重试、字段映射，
// 它不是一层包装，是一个真实的边界，别碰。`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: '别为了"整洁"增加层',
      text: '层数不是抽象能力，是读者的成本。抽象只有在"它隐藏了真实的复杂度"时才值得——转发式包装藏起来的只有调用栈。',
    },
    {
      kind: 'callout',
      tone: 'task',
      title: '今天做一次（10 分钟）',
      text: '挑一个"加过三次补丁"的功能，写一句话：如果它一开始就长现在这样，类型会怎么写？然后把这句话和现有类型并排放，看差几个字段。差三个以内，今天就改；差十个，说明该单独排期。',
    },
    { kind: 'h', text: '检验一下（合上笔记再答）' },
    {
      kind: 'quiz',
      id: 'q1',
      question: '"从第一性原理重设计"的第一步是？',
      options: ['先写一版新实现', '假设需求本来就在', '先补上缺失的测试', '先做一次性能剖析'],
      answer: 1,
      explain: '先假设需求从第一天就存在，才能看出理想结构是什么样。有了对照，才知道补丁差在哪。',
    },
    {
      kind: 'quiz',
      id: 'q2',
      question: '什么样的包装层应该内联掉？',
      options: ['只有一个调用方的转发', '带缓存的仓储层', '做字段映射的适配层', '处理重试的网络层'],
      answer: 0,
      explain: '纯粹转发的包装只藏了调用栈。带缓存、映射、重试的层藏着真实复杂度，不能动。',
    },
    {
      kind: 'quiz',
      id: 'q3',
      question: '"读者负担"最直接的两个可数来源是？',
      options: ['文件数量与总行数', '层数与隐藏状态', '注释密度与命名', '依赖数量与打包体积'],
      answer: 1,
      explain: '层数决定读者要跳几次，隐藏状态决定他脑子里要同时装几件事。这两个都能数出来。',
    },
    { kind: 'h', text: '这两条原则在 pstack 里长什么样' },
    { kind: 'principles', ids: ['redesign-from-first-principles', 'minimize-reader-load'] },
    {
      kind: 'source',
      label: 'principle-minimize-reader-load/SKILL.md',
      url: 'https://github.com/cursor/plugins/blob/main/pstack/skills/principle-minimize-reader-load/SKILL.md',
      why: '原文很具体：数层数、数隐藏状态、压平单调用方包装、收窄可变作用域。四个动作都能当天做。',
    },
  ],
  nextUp: '第 10 课：进入验证层——别用"编译过了"交差。',
};
