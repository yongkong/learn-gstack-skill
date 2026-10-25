import type { Lesson } from '../types';

export const lesson0016: Lesson = {
  id: '0016-let-the-rule-enforce-itself',
  goal: '把一条教训升级成能自动执行的约束（结构 > 类型 > lint > CI > 测试 > 文档），而不是再写一段笔记。',
  blocks: [
    {
      kind: 'lead',
      text: '最后一课不教新原则。它解决一个更实际的问题：三个月后，前面 15 课你大概会忘掉一半。那时候能救你的不是更长的笔记，是当时留下的东西。',
    },
    {
      kind: 'p',
      text: '你会第二次遇到同一类错误。这不是记性问题——文档不执行，而代码库每天有几百次机会重犯它。所以真正的问题不是"怎么记住"，而是"怎么让它在写错的那一刻就过不去"。',
    },
    { kind: 'h', text: '优先级链' },
    {
      kind: 'code',
      label: '从最强到最弱',
      text: `架构约束   写不出来（结构上不可能）
类型       编译不过
lint       提交不了
CI 检查    PR 红了
测试       回归被抓住
文档       靠人记得读`,
    },
    {
      kind: 'p',
      text: '越靠上越省事：上面的拦住了，下面的就不用写。反过来，只在文档里写规则，等于把执行成本转移给每个人的记忆——而记忆是最不可靠的那一层。',
    },
    { kind: 'h', text: '升级路径：同一个错犯第二次时' },
    {
      kind: 'list',
      ordered: true,
      items: [
        '这个错能用结构消灭吗？用联合类型排除的状态、用 brand 分开的值、禁止某个目录 import 某个包——做这个。',
        '结构拦不住的，能不能用一个 lint 规则或 CI 脚本抓？',
        '都不能，才写测试；测试也覆盖不到，才写文档。',
      ],
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: '一个简单的判据',
      text: '你第二次因为同一个原因犯错，说明上次你只写了文档。这不是批评记性，是指出层次选错了。',
    },
    {
      kind: 'p',
      text: '这条原则也是 pstack 里唯一一条关于"学习本身"的原则。你这 24 条原则要真的长在身上，最终形态大概也是这样——不是记住 24 句话，而是项目里多出几条规则、几种类型、几个检查。',
    },
    { kind: 'h', text: '结课自测（合上页面再答）' },
    {
      kind: 'list',
      ordered: true,
      items: [
        '拿到需求，先跑哪三道闸？',
        '想删一段代码，需要什么级别的证据？',
        '同一个坑改了两版还没好，该怀疑什么？',
        '防御该放哪？什么时候加防御算藏 bug？',
        '什么算"做完了"？',
        '报了"快了 10 倍"，要先问哪四个问题？',
      ],
    },
    {
      kind: 'callout',
      tone: 'task',
      title: '结课动作（15 分钟）',
      text: '把这六句话的答案写在一张纸上，不要翻站。答不出来的那一条，回去重读对应那一课——那一条就是你的短板。下周再答一次，只答这一条。',
    },
    { kind: 'h', text: '检验一下（合上笔记再答）' },
    {
      kind: 'quiz',
      id: 'q1',
      question: '同一条规则，最该落在哪一层？',
      options: ['架构与类型约束', '团队文档首页', 'PR 模板清单', '代码注释顶部'],
      answer: 0,
      explain: '越靠上的层次越不依赖人的记忆。结构上写不出来，比文档里写十遍都可靠。',
    },
    {
      kind: 'quiz',
      id: 'q2',
      question: '什么时候说明上次的教训没有真正落地？',
      options: ['第一次遇到这个问题', '第二次犯同样的错', '文档写得不够长', '测试覆盖率不足'],
      answer: 1,
      explain: '第二次犯，说明上次只留下了文字，没有留下约束。这是升级层次的信号，不是记性问题。',
    },
    {
      kind: 'quiz',
      id: 'q3',
      question: '优先级链里，文档为什么排最后？',
      options: ['文档最不好维护', '文档不参与执行', '文档检索不方便', '文档总会被写错'],
      answer: 1,
      explain: '文档需要有人记得读、记得照做。它把执行成本交给记忆，而记忆不是约束。',
    },
    { kind: 'h', text: '这条原则在 pstack 里长什么样' },
    { kind: 'principles', ids: ['encode-lessons-in-structure'] },
    {
      kind: 'source',
      label: 'principle-encode-lessons-in-structure/SKILL.md',
      url: 'https://github.com/cursor/plugins/blob/main/pstack/skills/principle-encode-lessons-in-structure/SKILL.md',
      why: '原文一句话：把规则变成 lint、元数据、运行时检查或脚本，而不是更多文字。配套的 /correct 技能就是这条原则的完整流程。',
    },
  ],
};
