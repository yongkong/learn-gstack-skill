import type { Visual } from './types';

/**
 * 图解数据。形式按「要说的判断是什么形状」来选，不是套模板：
 * 判断题→闸；改动→diff；状态→网格；边界→分层；重跑→时序。
 *
 * 每个 visual 都指回它讲的课，图不是装饰，是那一课的入口。
 */
export const VISUALS: Visual[] = [
  {
    kind: 'gates',
    id: 'three-gates',
    title: '拿到需求，先过三道闸',
    note: '命中任何一闸就停，不往下走。多数需求在第二闸就结束了。',
    lessonId: '0001-laziness-protocol',
    gates: [
      { question: '能靠删除满足吗', onHit: '直接删。不写新代码，改配置或改调用方' },
      { question: '现成的东西能复用吗', onHit: '复用已有类型 / 函数 / 组件，改一行' },
      { question: '只写刚够用的那点', onHit: '不为想象中的第二个调用方留接口' },
    ],
    outcome: [
      { label: '默认加法', value: '约 400 行' },
      { label: '过完三道闸', value: '约 20 行' },
    ],
  },
  {
    kind: 'diff',
    id: 'same-requirement',
    title: '同一句需求，两种改动形状',
    note: '用户看到的完全一样。差别不在技术，在于动手前有没有先算减法。',
    lessonId: '0001-laziness-protocol',
    requirement: '「给列表加个筛选」',
    panels: [
      {
        label: '默认做法：需求 → 新功能',
        tone: 'bad',
        net: '+400 行',
        lines: [
          { sign: '+', text: 'features/list-filter/FilterState.ts      18 行' },
          { sign: '+', text: 'features/list-filter/useFilterParams.ts   64 行' },
          { sign: '+', text: 'features/list-filter/FilterBar.tsx       112 行' },
          { sign: '+', text: 'features/list-filter/EmptyState.tsx       46 行' },
          { sign: '+', text: 'lib/useDebounce.ts                       40 行' },
          { sign: '~', text: 'routes/list.tsx                         +120 行' },
        ],
      },
      {
        label: '过完三道闸：需求 → 最小改动',
        tone: 'good',
        net: '+14 行',
        lines: [
          { sign: ' ', text: "const [q, setQ] = useState('')" },
          { sign: '+', text: 'const visible = q ? items.filter(match(q)) : items' },
          { sign: '+', text: '<Select value={q} onChange={setQ} />' },
          { sign: ' ', text: '（Select 是现成的，不新增组件）' },
        ],
      },
    ],
  },
  {
    kind: 'grid',
    id: 'illegal-states',
    title: '状态空间里，哪些组合本来就不该存在',
    note: '类型允许你把红格子写出来。写不出来，才叫防住了。',
    lessonId: '0006-make-illegal-states-unrepresentable',
    cols: ['payload 为空', 'payload 有值'],
    rows: ['status: loading', 'status: ready', 'status: error'],
    cells: ['legal', 'illegal', 'illegal', 'legal', 'legal', 'illegal'],
    after: {
      label: '改成一个判别联合',
      states: ['loading（无 payload）', 'ready（必有 payload）', 'error（无 payload）'],
    },
  },
  {
    kind: 'layers',
    id: 'boundary',
    title: '校验放哪：散在各处，还是只放门口',
    note: '同一套校验，换一个位置，内部函数就少掉一层防御。',
    lessonId: '0007-guards-at-the-boundary',
    panels: [
      {
        label: '散着校验',
        tone: 'bad',
        layers: [
          { name: '外部输入', detail: 'HTTP body / query，形状未知', guards: 0 },
          { name: 'service', detail: '先判空，再判长度，再兜底', guards: 2 },
          { name: 'dao', detail: '怕上游漏判，再判一次', guards: 2 },
          { name: 'model', detail: '构造时又判一次', guards: 2 },
          { name: 'response', detail: '序列化前再兜一次 null', guards: 1 },
        ],
        verdict: '7 处 if，漏一处就漏',
      },
      {
        label: '只放门口',
        tone: 'good',
        layers: [
          { name: '外部输入', detail: 'HTTP body / query，形状未知', guards: 0 },
          { name: '边界 parse()', detail: '校验一次，产出确定类型', guards: 1 },
          { name: 'service / dao / model', detail: '只接受已校验的类型，没有 if', guards: 0 },
        ],
        verdict: '1 处 if，内部读起来是直的',
      },
    ],
  },
  {
    kind: 'timeline',
    id: 'rerun',
    title: '同一个动作执行两次，结果会不会变',
    note: '幂等不是"重试更安全"，是让重跑等于无操作。',
    lessonId: '0008-safe-to-rerun',
    rows: [
      {
        label: 'insert(x)',
        tone: 'bad',
        steps: [
          { act: '第一次', count: '1 条' },
          { act: '重跑', count: '2 条' },
          { act: '再重跑', count: '3 条' },
        ],
        verdict: '每次重跑都在改数据，重试变成一种写操作',
      },
      {
        label: 'upsert(x)',
        tone: 'good',
        steps: [
          { act: '第一次', count: '1 条' },
          { act: '重跑', count: '1 条' },
          { act: '再重跑', count: '1 条' },
        ],
        verdict: '重跑 = 无操作，可以放心重试和回放',
      },
    ],
  },
];

export const VISUAL_BY_ID = new Map(VISUALS.map((visual) => [visual.id, visual]));
