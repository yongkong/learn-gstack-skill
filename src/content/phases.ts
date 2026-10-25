import type { PhaseId } from './types';

/** 5 个阶段是课程的组织方式，不是课程内容，所以留在 TS 里（只有 5 条，几乎不漂移）。 */
export const PHASES: { id: PhaseId; zh: string; en: string; goal: string }[] = [
  { id: 'core', zh: '阶段一 · 核心判断', en: 'Core judgment', goal: '拿到需求先算减法，而不是先算加法。' },
  { id: 'architecture', zh: '阶段二 · 架构', en: 'Architecture', goal: '让错的结构写不出来，而不是写出来再拦。' },
  { id: 'verification', zh: '阶段三 · 验证', en: 'Verification', goal: '把"做完了"变成别人能重跑的证明。' },
  { id: 'delegation', zh: '阶段四 · 委托与路由', en: 'Delegation & routing', goal: '一个人怎么安全地放大成多个 agent。' },
  { id: 'closing', zh: '阶段五 · 收尾', en: 'Closing the loop', goal: '让这次的教训不用下次再学一遍。' },
];
