import type { Lesson } from '../types';

export const lesson0011: Lesson = {
  id: '0011-verifiable-units',
  goal: '把工作切成"每段都以一个可验证状态收尾"的小单元；写测试时断言行为，让重构不会误伤测试。',
  blocks: [
    {
      kind: 'lead',
      text: '一个 800 行的 diff 没法验证。不是评审不够认真，是它没有提供任何可以停下来检查的地方。',
    },
    {
      kind: 'p',
      text: '切分的标准不是"改动的逻辑分组"，而是"这一段结束时，我能验证什么"。验证不了的步骤，说明它还要再切。',
    },
    { kind: 'h', text: '切法：让顺序自己证明自己' },
    {
      kind: 'code',
      label: '一个迁移的 commit 序列',
      text: `1. 加新类型，旧代码照常跑        验证：CI 绿，行为无变化
2. 边界改成写新类型              验证：跑一遍真实入口，数据形状对
3. 读路径迁到新类型              验证：列表页数据一致
4. 删掉旧类型和旧路径            验证：搜索无残留 + CI 绿`,
    },
    {
      kind: 'p',
      text: '注意第 4 步不是"以后再说"。它属于同一个任务——留在那里，前功尽弃（第 8 课讲过这件事）。',
    },
    {
      kind: 'list',
      items: [
        '每一步先写"做完怎么验证"，写不出来就再切。',
        '一个 commit 一个可验证单元，别把两件事混在一起。',
        '顺序安排成：前面的 commit 是后面 commit 的前提。',
      ],
    },
    { kind: 'h', text: '第二部分：测行为，不测实现' },
    {
      kind: 'p',
      text: '判据特别干净：行为坏了，测试要红；只改内部实现，测试要绿。如果你的重构必须同时改一堆测试，说明这些测试测的是实现。',
    },
    {
      kind: 'code',
      label: '同一段代码，两种测试',
      text: `// 测实现：重构时必挂
expect(repo.save).toHaveBeenCalledTimes(1);
expect(component.state.isOpen).toBe(true);

// 测行为：重构后照样绿
expect(await screen.findByText('已保存')).toBeInTheDocument();
expect(await listRuns()).toContainEqual(expect.objectContaining({ id }));`,
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: '关键点',
      text: '断言"调用了几次"是把实现钉进测试。它保护的不是用户看到的东西，而是你此刻的写法——而写法是会变的。',
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: '一个反直觉的推论',
      text: '一个从没红过的测试，可能根本没在断言任何行为。写完测试，先把实现故意改坏一处，确认它真的会红——这是最便宜的"测试有效性检查"。',
    },
    {
      kind: 'callout',
      tone: 'task',
      title: '今天做一次（10 分钟）',
      text: '挑一个你手上的任务，把它拆成 3 个 commit，每个 commit 后面写一句"这里怎么验证"。如果某一段写不出验证方式，那一段就是该再切的地方。',
    },
    { kind: 'h', text: '检验一下（合上笔记再答）' },
    {
      kind: 'quiz',
      id: 'q1',
      question: '切分工作单元的正确标准是？',
      options: ['按改动的文件分组', '按逻辑模块来分组', '每段都能被验证', '每段行数大致相等'],
      answer: 2,
      explain: '文件、模块、行数都是形式。真正的要求是这一段结束时，有一个可以停下来检查的状态。',
    },
    {
      kind: 'quiz',
      id: 'q2',
      question: '什么情况说明测试测的是实现？',
      options: ['重构后测试需要一起改', '测试断言用户能看到的东西', '测试用真实入口驱动', '测试跑得比较慢'],
      answer: 0,
      explain: '重构不改行为。测试跟着改，说明它钉住的是内部写法，不是外部可观察的后果。',
    },
    {
      kind: 'quiz',
      id: 'q3',
      question: '怎么确认一个新写的测试真的有效？',
      options: ['看它的覆盖率报告', '故意改坏实现看它红', '让另一个模型审查它', '跑够十次看是否稳定'],
      answer: 1,
      explain: '一个没红过的测试可能什么都没断言。把实现改坏，它该红——这一步最便宜也最容易被跳过。',
    },
    { kind: 'h', text: '这两条原则在 pstack 里长什么样' },
    { kind: 'principles', ids: ['sequence-verifiable-units', 'test-behavior-not-implementation'] },
    {
      kind: 'source',
      label: 'principle-sequence-verifiable-units/SKILL.md',
      url: 'https://github.com/cursor/plugins/blob/main/pstack/skills/principle-sequence-verifiable-units/SKILL.md',
      why: '原文明确把"提交与 PR 的堆叠方式"也算进这条原则——切分不只是做事方法，也是交付形态。',
    },
  ],
  nextUp: '第 12 课：你说"快了 10 倍"的时候，先解释这个数字。',
};
