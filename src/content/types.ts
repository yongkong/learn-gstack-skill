export type PhaseId = 'core' | 'architecture' | 'verification' | 'delegation' | 'closing';

/**
 * 课程正文的最小渲染单元。
 *
 * 大部分正文由 markdown-it 直接转成 HTML（kind: 'html'），
 * 只有需要交互或需要引用结构化数据的部分才是独立 block。
 */
export type Block =
  | { kind: 'html'; html: string }
  | { kind: 'callout'; tone: 'insight' | 'warn' | 'task'; title: string; text: string }
  | { kind: 'code'; label?: string; text: string }
  | { kind: 'quiz'; id: string; question: string; options: string[]; answer: number; explain: string }
  | { kind: 'principles'; ids: string[] }
  | { kind: 'playbooks'; ids: string[] }
  | { kind: 'source'; label: string; url: string; why: string };

/**
 * 一节课的完整内容。字段全部来自 md 的 frontmatter + 正文，
 * 仓库里没有第二处重复声明（标题、时长都只在 md 里写一次）。
 */
export interface Lesson {
  /** 文件名去掉 .md：0001-laziness-protocol */
  id: string;
  num: number;
  /** 原则的英文正式名，用作课程标题之上的 kicker */
  titleEn?: string;
  title: string;
  subtitle: string;
  minutes: number;
  phase: PhaseId;
  /** 开篇导语 */
  lede?: string;
  /** 学完能做到什么，一句话 */
  goal: string;
  /** 本课负责讲透的原则 id */
  principles: string[];
  blocks: Block[];
  /** 下一课的钩子 */
  nextUp?: string;
  /** md 源文件相对路径 */
  sourceFile: string;
}
