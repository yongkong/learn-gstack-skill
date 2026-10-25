import type { Lesson } from '../types';

export const lesson0007: Lesson = {
  id: '0007-guards-at-the-boundary',
  goal: '把防御集中在系统边界，内部信任类型；能分清"这是修 bug"还是"这是把 bug 藏起来"。',
  blocks: [
    {
      kind: 'lead',
      text: '"防御性编程"被误用成了"到处加 if"。加上判断的那一刻感觉安全了，实际只是把错误挪到了更难发现的地方。',
    },
    {
      kind: 'p',
      text: '一个值可能是错的，这件事通常只在少数几个地方成立：数据刚进系统的地方。一旦它进来过了关，内部就不该再有"它可能不对"的假设——否则每个函数都要自己防一遍，而每个函数防得都不一样。',
    },
    { kind: 'h', text: '先认出边界在哪' },
    {
      kind: 'list',
      items: [
        '命令行参数、环境变量',
        '配置文件、feature flag',
        '网络响应、第三方 SDK 的返回值',
        '数据库 / localStorage 里读回来的旧数据',
        'URL、query string、表单输入',
      ],
    },
    {
      kind: 'p',
      text: '这些位置有一个共同点：数据不是你的程序生成的，你无法保证它的形状。所以这里是唯一该解析、该校验、该拒绝的地方——而且只做一次。',
    },
    {
      kind: 'code',
      label: '边界解析一次，内部纯函数',
      text: `// 边界：只在这里面对 unknown
const RawRun = z.object({
  id: z.string(),
  state: z.enum(['queued', 'running', 'done', 'failed']),
  startedAt: z.number().optional(),
});

function loadRun(raw: unknown): Run {
  return toRun(RawRun.parse(raw));   // 不合法就在这里炸，炸在正确的位置
}

// 内部：签名就是承诺，不再判空
function formatDuration(run: Extract<Run, { state: 'done' }>): string {
  return ms(run.endedAt - run.startedAt);
}`,
    },
    {
      kind: 'callout',
      tone: 'insight',
      title: '判据',
      text: '内部函数里出现 if (!user) return null，等于宣判调用方不用为"user 从哪来"负责。防御一旦内移，责任就消失了。',
    },
    {
      kind: 'callout',
      tone: 'warn',
      title: '防御不等于修',
      text: '只有当被处理的状态是合法状态时，加防御才算修——比如"用户确实可能取消，所以取消分支要处理"。如果那个状态本来不该存在，你在做的只是把 bug 挪到一个更安静的地方（第 10 课会展开讲这条）。',
    },
    { kind: 'h', text: '一个常见误解：防御越多越安全' },
    {
      kind: 'p',
      text: '防御有成本，而且成本不在写它的时候。散落的默认值会让真正的 bug 变成"稍微不对的数据"，在系统里继续流几层，最后在一个跟原因无关的地方显形。你多写的那三行判断，把一次失败推迟成了一次难以复现的失败。',
    },
    {
      kind: 'p',
      text: '所以边界纪律和纯函数是一对：边界负责"要么对，要么拒绝"，纯函数负责"给我对的东西，我就给你对的结果"。中间不再有"可能不对"的地带。',
    },
    {
      kind: 'callout',
      tone: 'task',
      title: '今天做一次（8 分钟）',
      text: '找一个业务函数里的 if (!x) return null，往上追 x 是从哪进来的。如果它来自边界，就把判断移回边界；如果它来自内部，那说明上游已经错了——去上游修。',
    },
    { kind: 'h', text: '检验一下（合上笔记再答）' },
    {
      kind: 'quiz',
      id: 'q1',
      question: '防御性判断应该集中在哪里？',
      options: ['每个公开函数的入口', '系统边界解析处', '每个 if 之后分支', '统一的错误处理层'],
      answer: 1,
      explain: '边界是唯一"数据形状不可知"的地方。解析一次之后，内部就该信任类型。',
    },
    {
      kind: 'quiz',
      id: 'q2',
      question: '业务函数里出现 if (!user) return null，说明什么？',
      options: ['代码防御做得很周全', '调用方可以不负责来源', '该函数应该改成异步', '需要补充更多日志'],
      answer: 1,
      explain: '防御内移，责任消失。user 从哪来、为什么可能是空，这个问题没人再负责回答。',
    },
    {
      kind: 'quiz',
      id: 'q3',
      question: '加防御什么时候才算"修"而不是"藏"？',
      options: ['只要加在报错点之前', '只要配上足够的日志', '被处理的状态是合法的', '只要测试能覆盖到它'],
      answer: 2,
      explain: '状态合法，防御是处理需求；状态本不该存在，防御就是把 bug 挪到一个更安静的地方。',
    },
    { kind: 'h', text: '这条原则在 pstack 里长什么样' },
    { kind: 'principles', ids: ['boundary-discipline'] },
    {
      kind: 'source',
      label: 'principle-boundary-discipline/SKILL.md',
      url: 'https://github.com/cursor/plugins/blob/main/pstack/skills/principle-boundary-discipline/SKILL.md',
      why: '原文很短：守边界、信内部、逻辑写成纯函数。三个动作缺一个，另外两个就白做。',
    },
  ],
  nextUp: '第 8 课：让"再来一遍"变安全——幂等、迁移调用者、共享状态。',
};
