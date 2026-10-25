export interface Playbook {
  id: string;
  en: string;
  zh: string;
  /** 这个 playbook 干什么 */
  purpose: string;
  /** 什么情况下会被 poteto-mode 选中 */
  when: string;
}

/** 按"任务的形状"分组，而不是按字母序 —— 复习时你是从任务出发找路的。 */
export const PLAYBOOK_GROUPS: { zh: string; note: string; ids: string[] }[] = [
  {
    zh: '搞清楚状况（只读）',
    note: '不产生改动，只产生认知。',
    ids: ['investigation', 'runtime-forensics', 'trace-forensics'],
  },
  {
    zh: '修好它（有证据）',
    note: '共同点：先复现，再定位，最后才动手。',
    ids: ['bug-fix', 'perf', 'hillclimb'],
  },
  {
    zh: '造东西',
    note: '从数据形状出发，而不是从界面出发。',
    ids: ['feature', 'refactoring', 'prototype', 'visual-parity', 'multi-phase-plan'],
  },
  {
    zh: '验证与学习',
    note: '让"完成"这件事可被检查。',
    ids: ['eval', 'authoring-a-skill'],
  },
  {
    zh: '交付与编排',
    note: '一个人 + 多个 agent 的规模化作业。',
    ids: ['opening-a-pr', 'babysit', 'shipping', 'autonomous-run', 'orchestrate', 'autopilot-full', 'autopilot-stack'],
  },
  {
    zh: '长任务的进退',
    note: 'Agent 会跑很久，所以要会交接、会暂停、会收尾。',
    ids: ['session-pickup', 'pause-safely', 'worktree-cleanup'],
  },
];

export const PLAYBOOKS: Playbook[] = [
  {
    id: 'investigation',
    en: 'investigation',
    zh: '调查',
    purpose: '回答一个只读的问题：X 是怎么工作的？Y 为什么这样建？我们确定吗？',
    when: '你只想搞明白，不想改代码。',
  },
  {
    id: 'bug-fix',
    en: 'bug fix',
    zh: '修 bug',
    purpose: '复现缺陷 → 定位根因 → 用运行时证据验证修复。',
    when: '有个明确可描述的错，但不知道为什么。',
  },
  {
    id: 'perf',
    en: 'perf',
    zh: '性能',
    purpose: '针对一个被测出来的慢，做基于基线的改进。',
    when: '已有一个可量的慢，而不是"感觉慢"。',
  },
  {
    id: 'hillclimb',
    en: 'hillclimb',
    zh: '爬坡',
    purpose: '围绕单一指标做持续的科学式改进：假设 → 前后测量 → 每个被接受的改进一个 commit。',
    when: '有一个长期要逼近的目标指标（覆盖率、包体积、p95）。',
  },
  {
    id: 'runtime-forensics',
    en: 'runtime forensics',
    zh: '运行时取证',
    purpose: '从埋点和运行时观测诊断活体症状：泄漏、空闲 CPU 空转、偶发闪烁。',
    when: '问题是"跑着跑着自己出问题"，静态读代码看不出来。',
  },
  {
    id: 'trace-forensics',
    en: 'trace forensics',
    zh: '轨迹取证',
    purpose: '诊断已捕获的剖析产物：cpuprofile、trace、spindump、堆快照。',
    when: '你手上有一个 profile 文件，但看不出结论。',
  },
  {
    id: 'feature',
    en: 'feature',
    zh: '功能开发',
    purpose: '新增或改变行为，从一个被命名的数据形状出发。',
    when: '要加东西了。注意入口是"数据形状"，不是"页面长什么样"。',
  },
  {
    id: 'refactoring',
    en: 'refactoring',
    zh: '重构',
    purpose: '保持行为不变，只改结构或形状。',
    when: '行为已经对了，但代码该还债了。',
  },
  {
    id: 'prototype',
    en: 'prototype',
    zh: '原型',
    purpose: '做一个用完就扔的草稿，用来廉价地定一个设计决策，或用一个实验判定岔路口。',
    when: '两条路都说得通，靠讨论定不了。',
  },
  {
    id: 'visual-parity',
    en: 'visual parity',
    zh: '视觉对齐',
    purpose: '两套实现之间做到像素级一致。',
    when: '有一个已知正确的参考图，要对齐到它。',
  },
  {
    id: 'authoring-a-skill',
    en: 'authoring a skill',
    zh: '写 skill',
    purpose: '写或改一个 SKILL.md。',
    when: '你想把一套做法固化下来给 agent 反复执行。',
  },
  {
    id: 'eval',
    en: 'eval',
    zh: '评测',
    purpose: '盲测一次 skill 或 prompt 改动对 agent 行为的影响。',
    when: '你改了提示词，想知道它到底变好还是变坏。',
  },
  {
    id: 'babysit',
    en: 'babysit',
    zh: '看护 PR',
    purpose: '把 PR 或一串 PR 推到可合并：解冲突、回评论、修 CI。',
    when: '代码写完了，但 PR 还挂在那。',
  },
  {
    id: 'shipping',
    en: 'shipping',
    zh: '发布',
    purpose: '独立验证一整串全绿的 PR，然后从底往上合并。',
    when: '一串 PR 都绿了，准备落地。',
  },
  {
    id: 'autonomous-run',
    en: 'autonomous run',
    zh: '自主运行',
    purpose: '一个长任务，不停下来地问，直接推到完成。',
    when: '你不想中途被叫醒。',
  },
  {
    id: 'orchestrate',
    en: 'orchestrate',
    zh: '编排',
    purpose: '一个常驻项目交给一个协调对话：跨天、多串 PR、成群的子 agent。',
    when: '工作量已经超过"一个任务"的量级。',
  },
  {
    id: 'autopilot-full',
    en: 'autopilot-full',
    zh: '全自动驾驶',
    purpose: '多个互不依赖的 PR 并行推到合并，每个 PR 一个负责人，swarm 验证每个代码就绪的头，之后每次改动重新验。',
    when: '有大量互不相干的小 PR 要清。',
  },
  {
    id: 'autopilot-stack',
    en: 'autopilot-stack',
    zh: '栈式自动驾驶',
    purpose: '构建并验证一条线性的、基于同一分支的 PR 栈，交给操作者审阅和落地。',
    when: '改动之间有先后依赖，必须串成一条栈。',
  },
  {
    id: 'session-pickup',
    en: 'session pickup',
    zh: '接手会话',
    purpose: '恢复或接管之前 agent 正在进行的工作。',
    when: '上一个会话断了，或者换了个 agent 接着干。',
  },
  {
    id: 'pause-safely',
    en: 'pause safely',
    zh: '安全暂停',
    purpose: '干净地挂起进行中的工作，以便之后恢复。',
    when: '要关机、要下班、要切任务。',
  },
  {
    id: 'multi-phase-plan',
    en: 'multi-phase plan',
    zh: '多阶段计划',
    purpose: '覆盖多个阶段或一串 PR 的工作。',
    when: '一个任务天然分成几波，每一波都要能独立验证。',
  },
  {
    id: 'worktree-cleanup',
    en: 'worktree cleanup',
    zh: '工作树清理',
    purpose: '回收磁盘：清理已合并或废弃的 worktree 和僵死的模拟器，带安全闸。',
    when: '磁盘满了，或者 worktree 堆成山。',
  },
  {
    id: 'opening-a-pr',
    en: 'opening a pr',
    zh: '开 PR',
    purpose: '从小的有序 commit 出发开一个可合并的 PR：约定式提交标题 + 简报式正文。',
    when: '每个其他 playbook 的收尾动作。',
  },
];

export const PLAYBOOK_BY_ID = new Map(PLAYBOOKS.map((p) => [p.id, p]));
