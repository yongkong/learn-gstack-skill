import type { Lesson } from '../types';

export const lesson0003: Lesson = {
  id: '0003-shape-first',
  goal: '写业务逻辑之前，先把类型和数据形状定下来，让后面的代码"顺着结构写"而不是靠 if 兜。',
  blocks: [
    {
      kind: 'lead',
      text: 'AI 最自然的起点是界面：先写组件，类型等会再补。结果类型被界面逼成了 any——形状没定，逻辑就只能靠判断堆出来。',
    },
    {
      kind: 'p',
      text: '反过来做：先决定"这块数据长什么样"。形状定对了，业务代码会自己顺下来；形状定错了，后面每加一个功能都要多一层转换。',
    },
    { kind: 'h', text: '写第一个 if 之前，先答完三个问题' },
    {
      kind: 'list',
      ordered: true,
      items: [
        '核心实体是什么？它的身份靠哪个字段，这个字段的类型够不够严格？',
        '它有几种状态？状态之间允许怎么迁移？',
        '谁和谁共享同一个可变对象？',
      ],
    },
    {
      kind: 'code',
      label: '先把形状写出来（TypeScript）',
      text: `type Run =
  | { state: 'queued';  id: RunId }
  | { state: 'running'; id: RunId; startedAt: Time }
  | { state: 'done';    id: RunId; startedAt: Time; endedAt: Time }
  | { state: 'failed';  id: RunId; error: RunError };`,
    },
    {
      kind: 'p',
      text: '这个形状一旦定下，"running 一定有 startedAt"就不需要运行时判断，也不需要注释提醒。编译器替你记着，而你不用在脑子里同时装四件事。',
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: '关键点',
      text: '数据结构定对之后，大部分业务代码不是"写"出来的，是"读"出来的——你只是照着结构，把每种情况的处理写满。',
    },
    { kind: 'h', text: '形状没定的反例' },
    {
      kind: 'code',
      label: '同一份数据，两种下场',
      text: `// 形状没定：每个调用点都要自己判断一次
type Run = { id: string; status: string; startedAt?: string; error?: string };
if (run.status === 'running' && run.startedAt) { ... }
if (run.status === 'done' && run.startedAt && run.endedAt) { ... }

// 形状定了：判断只发生一次，就在类型定义里
switch (run.state) {
  case 'running': use(run.startedAt); break;   // 不需要判空，类型保证了
  case 'done':    use(run.endedAt);   break;
}`,
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: '信号',
      text: '你写下的第三个 if (x != null) 就是形状没定好的信号。不是这次判断写错了，是它本不该存在。',
    },
    {
      kind: 'callout',
      tone: 'task',
      title: '今天做一次（8 分钟）',
      text: '打开你手上最乱的那个模块，只做一件事：把它的核心实体写成联合类型，把"不可能同时存在的字段组合"从类型里排除掉。先不修实现，看看编译器报了多少错——报的错就是你要还的债。',
    },
    { kind: 'h', text: '检验一下（合上笔记再答）' },
    {
      kind: 'quiz',
      id: 'q1',
      question: '按基础性思考，写业务逻辑之前要先定的是？',
      options: ['组件的层级结构', '数据的形状与类型', '接口的请求格式', '文件的目录划分'],
      answer: 1,
      explain: '组件、目录、接口格式都可以后调；数据形状后调的代价最大，它决定了后面所有代码的样子。',
    },
    {
      kind: 'quiz',
      id: 'q2',
      question: '下面哪个是"形状没定好"的信号？',
      options: ['同一字段在每个调用点判空', '类型定义集中在一个文件', '状态用联合类型来表达', '外部数据在边界处解析'],
      answer: 0,
      explain: '"值可能不存在"这件事没有被结构表达出来，于是每个使用点都要自己防一次。',
    },
    {
      kind: 'quiz',
      id: 'q3',
      question: '状态只允许 queued → running → done，最好怎么表达？',
      options: ['在文档里写清楚规则', '用注释标在字段旁边', '用联合类型穷尽状态', '用枚举加运行时校验'],
      answer: 2,
      explain: '联合类型让非法组合写不出来；文档和注释不会拦你，运行时校验已经是事后补救。',
    },
    { kind: 'h', text: '这条原则在 pstack 里长什么样' },
    { kind: 'principles', ids: ['foundational-thinking'] },
    {
      kind: 'source',
      label: 'principle-foundational-thinking/SKILL.md',
      url: 'https://github.com/cursor/plugins/blob/main/pstack/skills/principle-foundational-thinking/SKILL.md',
      why: '原文把三个前置问题写得很细（核心类型、脚手架与功能的先后、并发共享）。第三问尤其容易被跳过。',
    },
  ],
  nextUp: '第 4 课：同一个坑改了两版还没好，该怀疑的不是修法，是前提。',
};
