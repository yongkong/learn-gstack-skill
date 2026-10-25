export type PhaseId = 'core' | 'architecture' | 'verification' | 'delegation' | 'closing';

export const PHASES: { id: PhaseId; zh: string; goal: string }[] = [
  { id: 'core', zh: '阶段一 · 核心判断', goal: '拿到需求先算减法，而不是先算加法。' },
  { id: 'architecture', zh: '阶段二 · 架构', goal: '让错的结构写不出来，而不是写出来再拦。' },
  { id: 'verification', zh: '阶段三 · 验证', goal: '把"做完了"变成别人能重跑的证明。' },
  { id: 'delegation', zh: '阶段四 · 委托与路由', goal: '一个人怎么安全地放大成多个 agent。' },
  { id: 'closing', zh: '阶段五 · 收尾', goal: '让这次的教训不用下次再学一遍。' },
];

export interface CurriculumItem {
  no: number;
  title: string;
  subtitle: string;
  minutes: number;
  phase: PhaseId;
  /** 这节课负责讲透的原则 */
  principles: string[];
  /** 已上线的课才有 id */
  lessonId?: string;
}

export const CURRICULUM: CurriculumItem[] = [
  {
    no: 1,
    title: '先删，再写',
    subtitle: '懒惰协议：删 / 复用 / 最小新增，三道闸按顺序过',
    minutes: 7,
    phase: 'core',
    principles: ['laziness-protocol'],
    lessonId: '0001-laziness-protocol',
  },
  {
    no: 2,
    title: '删之前先证明',
    subtitle: '先减后加：怎么用搜索而不是感觉，证明一段代码真的没人用',
    minutes: 8,
    phase: 'core',
    principles: ['subtract-before-you-add'],
    lessonId: '0002-prove-before-deleting',
  },
  {
    no: 3,
    title: '先定形状',
    subtitle: '基础性思考：类型和数据结构定对了，业务代码会自己顺下来',
    minutes: 9,
    phase: 'core',
    principles: ['foundational-thinking'],
    lessonId: '0003-shape-first',
  },
  {
    no: 4,
    title: '换个前提再试',
    subtitle: '攻击前提：同一个坑改了两版还没过，问题多半不在修法',
    minutes: 8,
    phase: 'core',
    principles: ['attack-the-premise'],
    lessonId: '0004-attack-the-premise',
  },
  {
    no: 5,
    title: '先比，然后让工具去干',
    subtitle: '穷尽设计空间 + 造杠杆：两个原型定方向，一个脚本代替手工',
    minutes: 9,
    phase: 'core',
    principles: ['exhaust-the-design-space', 'build-the-lever'],
    lessonId: '0005-compare-then-build-the-lever',
  },
  {
    no: 6,
    title: '让错的状态写不出来',
    subtitle: '领域建模 + 类型系统纪律：把条件判断换成结构，把字符串换成 brand',
    minutes: 10,
    phase: 'architecture',
    principles: ['model-the-domain', 'type-system-discipline'],
    lessonId: '0006-make-illegal-states-unrepresentable',
  },
  {
    no: 7,
    title: '防御只放在门口',
    subtitle: '边界纪律：边界解析一次，内部信任类型，逻辑写成纯函数',
    minutes: 8,
    phase: 'architecture',
    principles: ['boundary-discipline'],
    lessonId: '0007-guards-at-the-boundary',
  },
  {
    no: 8,
    title: '重跑一次会怎样',
    subtitle: '幂等、迁移调用者、共享状态先分离——三条让"再来一遍"安全的规则',
    minutes: 10,
    phase: 'architecture',
    principles: ['make-operations-idempotent', 'migrate-callers-then-delete-legacy-apis', 'separate-before-serializing-shared-state'],
    lessonId: '0008-safe-to-rerun',
  },
  {
    no: 9,
    title: '假装它一开始就在',
    subtitle: '从第一性原理重设计 + 最小化读者负担：别再往老结构上焊补丁',
    minutes: 9,
    phase: 'architecture',
    principles: ['redesign-from-first-principles', 'minimize-reader-load'],
    lessonId: '0009-as-if-it-was-always-there',
  },
  {
    no: 10,
    title: '别用"编译过了"交差',
    subtitle: '证明它有效 + 修根因：回到第一次出错的地方，而不是会崩的地方',
    minutes: 9,
    phase: 'verification',
    principles: ['prove-it-works', 'fix-root-causes'],
    lessonId: '0010-prove-it-works',
  },
  {
    no: 11,
    title: '一个单元，一个可验证态',
    subtitle: '切成可验证单元 + 测行为不测实现：让重构不会误伤测试',
    minutes: 9,
    phase: 'verification',
    principles: ['sequence-verifiable-units', 'test-behavior-not-implementation'],
    lessonId: '0011-verifiable-units',
  },
  {
    no: 12,
    title: '解释这个数字',
    subtitle: '基准、加速比、覆盖率：先找出是什么限制了它，再决定信不信',
    minutes: 8,
    phase: 'verification',
    principles: ['explain-the-number'],
    lessonId: '0012-explain-the-number',
  },
  {
    no: 13,
    title: '主线程只留结论',
    subtitle: '守住上下文窗口 + 不要阻塞在人身上：派活、留摘要、事后纠偏',
    minutes: 8,
    phase: 'delegation',
    principles: ['guard-the-context-window', 'never-block-on-the-human'],
    lessonId: '0013-main-thread-keeps-conclusions',
  },
  {
    no: 14,
    title: '一分钟选对流程',
    subtitle: 'playbook 路由：从任务形状反推该走哪条流程、哪一步必须停',
    minutes: 10,
    phase: 'delegation',
    principles: [],
    lessonId: '0014-pick-the-playbook',
  },
  {
    no: 15,
    title: '直线奔向目标架构',
    subtitle: '结果导向执行 + 体验优先：不为过渡期写兼容层，也不为省事牺牲观感',
    minutes: 8,
    phase: 'delegation',
    principles: ['outcome-oriented-execution', 'experience-first'],
    lessonId: '0015-straight-to-target-architecture',
  },
  {
    no: 16,
    title: '让规则自己执行',
    subtitle: '把经验编码进结构：架构 > 类型 > lint > CI > 测试 > 文档',
    minutes: 7,
    phase: 'closing',
    principles: ['encode-lessons-in-structure'],
    lessonId: '0016-let-the-rule-enforce-itself',
  },
];

export const PUBLISHED_COUNT = CURRICULUM.filter((item) => item.lessonId).length;

/** 课程内容的元信息都从这里取，课程文件不重复写标题和时长。 */
export function curriculumFor(lessonId: string): CurriculumItem | undefined {
  return CURRICULUM.find((item) => item.lessonId === lessonId);
}

/** 每节课覆盖的原则数合计 = 24，一条不漏、一条不重复。 */
export const COVERED_PRINCIPLE_IDS = new Set(CURRICULUM.flatMap((item) => item.principles));
