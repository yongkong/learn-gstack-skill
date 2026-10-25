export type Block =
  | { kind: 'lead'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'h'; text: string }
  | { kind: 'callout'; tone: 'insight' | 'warn' | 'task'; title: string; text: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'code'; label?: string; text: string }
  | { kind: 'quote'; text: string; source?: string }
  | { kind: 'principles'; ids: string[] }
  | { kind: 'playbooks'; ids: string[] }
  | { kind: 'quiz'; id: string; question: string; options: string[]; answer: number; explain: string }
  | { kind: 'source'; label: string; url: string; why: string };

/**
 * 一节课的内容本体。
 * 标题、副标题、编号、时长都在 `curriculum.ts`（单一来源），这里只管"教什么"。
 */
export interface Lesson {
  id: string;
  /** 学完能做到什么，一句话 */
  goal: string;
  blocks: Block[];
  /** 下一课的钩子 */
  nextUp?: string;
}

export const QUIZ_PREFIX = 'quiz:';
