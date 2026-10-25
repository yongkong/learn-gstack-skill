export type PhaseId = 'core' | 'architecture' | 'verification' | 'delegation' | 'closing';

export type VisualTone = 'bad' | 'good';

/** 一张图解。形式跟着要说的判断走，不为统一而统一。 */
export type Visual =
  /** 判断题：一串有顺序的闸，命中即停 */
  | {
      kind: 'gates';
      id: string;
      title: string;
      note?: string;
      lessonId?: string;
      gates: { question: string; onHit: string }[];
      outcome: { label: string; value: string }[];
    }
  /** 改动形状：同一需求两份实现，用行数与增删看差异 */
  | {
      kind: 'diff';
      id: string;
      title: string;
      note?: string;
      lessonId?: string;
      requirement: string;
      panels: {
        label: string;
        tone: VisualTone;
        net: string;
        lines: { sign: ' ' | '+' | '-' | '~'; text: string }[];
      }[];
    }
  /** 状态空间：笛卡尔积里哪些组合本来就不该存在 */
  | {
      kind: 'grid';
      id: string;
      title: string;
      note?: string;
      lessonId?: string;
      cols: string[];
      rows: string[];
      cells: ('legal' | 'illegal')[];
      after: { label: string; states: string[] };
    }
  /** 边界：同一件事，校验散落各处 vs 收在一个门口 */
  | {
      kind: 'layers';
      id: string;
      title: string;
      note?: string;
      lessonId?: string;
      panels: {
        label: string;
        tone: VisualTone;
        layers: { name: string; detail: string; guards?: number }[];
        verdict: string;
      }[];
    }
  /** 时序：同一动作执行两次，结果会不会变 */
  | {
      kind: 'timeline';
      id: string;
      title: string;
      note?: string;
      lessonId?: string;
      rows: { label: string; tone: VisualTone; steps: { act: string; count: string }[]; verdict: string }[];
    };

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
  | { kind: 'visual'; id: string }
  | { kind: 'source'; label: string; url: string; why: string };

/** md 驱动的普通页面（不是课程，不进路线图）。 */
export interface PageDoc {
  id: string;
  title: string;
  subtitle: string;
  blocks: Block[];
  sourceFile: string;
}

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
