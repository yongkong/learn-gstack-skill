import type { Lesson } from '../types';

export const lesson0006: Lesson = {
  id: '0006-make-illegal-states-unrepresentable',
  goal: '把"不该出现的状态"从类型层面排除掉，让错误的组合根本编译不过，而不是靠运行时判断兜住。',
  blocks: [
    {
      kind: 'lead',
      text: '第 3 课把形状定下来。这一课把形状变成约束：不只是"数据长这样"，而是"数据不可能长成别的样子"。',
    },
    {
      kind: 'p',
      text: '代码里最贵的东西不是逻辑，是"这个组合到底会不会出现"这类问题。它没有答案，只能靠每个人各自的记忆。领域建模要做的，是让这个问题从代码里消失。',
    },
    { kind: 'h', text: '信号：第三个 if (type === ...)' },
    {
      kind: 'code',
      label: '散落的判断 → 结构',
      text: `// 建模前：每个新变体都要回来改这里的 if
function label(node: Node) {
  if (node.type === 'file') return node.name;
  if (node.type === 'dir')  return node.name + '/';
  if (node.type === 'link') return '→ ' + node.target;
  return '?';                       // 上一层"兜底"，其实是把漏处理藏起来
}

// 建模后：新增变体，编译器替你列出所有要改的地方
type Node =
  | { type: 'file'; name: string }
  | { type: 'dir';  name: string }
  | { type: 'link'; name: string; target: string };

function label(node: Node): string {
  switch (node.type) {
    case 'file': return node.name;
    case 'dir':  return node.name + '/';
    case 'link': return '→ ' + node.target;
    default: {
      const never: never = node;     // 新增变体时，这里立刻报错
      return never;
    }
  }
}`,
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: '判据',
      text: '新增一个变体之后，如果编译器没有报错，说明结构没建好——你还得靠记忆去找那 7 个 if。',
    },
    { kind: 'h', text: '第二个动作：给语义打标签' },
    {
      kind: 'p',
      text: '有一类错误类型系统默认拦不住：两个都是 string，长得一模一样，但含义不同。userId 传给 orderId、原始金额传给折扣价——都能编译通过，都要到线上才发现。',
    },
    {
      kind: 'code',
      label: 'brand 类型（把"同构但不同义"分开）',
      text: `type Brand<T, B> = T & { readonly __brand: B };
type UserId  = Brand<string, 'UserId'>;
type OrderId = Brand<string, 'OrderId'>;

declare function refund(orderId: OrderId, userId: UserId): void;

const uid = 'u_1' as UserId;
refund(uid, uid);   // 编译不过：两处位置都错了，一处都不能靠"小心"避免`,
    },
    { kind: 'h', text: '类型纪律的四个动作' },
    {
      kind: 'list',
      ordered: true,
      items: [
        '让非法状态无法表达：用联合类型排除不可能的字段组合。',
        '打 brand：把语义不同的同构原始值分开。',
        '在边界解析外部数据，解析之后内部不再校验（下一课展开）。',
        '从权威 schema 推导类型，而不是手抄第二份。',
      ],
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: '别把类型当注释',
      text: '如果类型写错了代码还能跑，说明它没有在工作。类型不是给人读的说明，是能被编译器执行的那部分规则。',
    },
    {
      kind: 'callout',
      tone: 'task',
      title: '今天做一次（10 分钟）',
      text: '找一个你写过最多的 if (status === ...) 的地方，把它换成联合类型 + 穷尽检查。换完之后，故意新增一个变体，看编译器能不能把所有需要改的地方都指出来。指不出来，就继续改结构。',
    },
    { kind: 'h', text: '检验一下（合上笔记再答）' },
    {
      kind: 'quiz',
      id: 'q1',
      question: '怎么判断自己的领域结构建好了？',
      options: ['新增变体时编译报错', '类型定义文件足够短', '团队都能看懂这些类型', '每个字段都有注释'],
      answer: 0,
      explain: '结构建好的标志是"编译器替你记住所有需要改的地方"。靠人记住，就不算结构。',
    },
    {
      kind: 'quiz',
      id: 'q2',
      question: 'brand 类型主要解决哪类问题？',
      options: ['字符串拼接的性能损耗', '同构原始值的语义混淆', '可选字段的运行时缺失', '类型定义的循环依赖'],
      answer: 1,
      explain: '两个都是 string，含义不同却可以互换——对这种错，brand 是成本最低的解法。',
    },
    {
      kind: 'quiz',
      id: 'q3',
      question: 'switch 里写 default: { const never: never = x } 的作用是？',
      options: ['处理运行时的意外值', '提高分支执行的速度', '让新增变体立刻报错', '给日志留下兜底信息'],
      answer: 2,
      explain: '穷尽检查。变体没处理完，never 这一步就编译不过——它把"漏了哪个分支"从记忆问题变成编译问题。',
    },
    { kind: 'h', text: '这两条原则在 pstack 里长什么样' },
    { kind: 'principles', ids: ['model-the-domain', 'type-system-discipline'] },
    {
      kind: 'source',
      label: 'principle-type-system-discipline/SKILL.md',
      url: 'https://github.com/cursor/plugins/blob/main/pstack/skills/principle-type-system-discipline/SKILL.md',
      why: '五个动作（非法状态、brand、边界解析、穷尽变体、从 schema 推导）都在这里。配合 /typescript-best-practices 一起看更具体。',
    },
  ],
  nextUp: '第 7 课：防御只放在门口——内部信任类型，逻辑写成纯函数。',
};
