import { LESSONS } from './lessons';
import { PHASES } from './phases';
import type { PhaseId } from './types';

export { PHASES };
export type { PhaseId };

/**
 * 路线图不再手写：它由课程 md 的 frontmatter 派生。
 * 以前标题、时长、阶段在这里重复声明一遍，16 课就是 64 处可以漂移的地方。
 */
export interface CurriculumItem {
  no: number;
  /** 英文正式名，展示在中文标题上方 */
  titleEn?: string;
  title: string;
  subtitle: string;
  minutes: number;
  phase: PhaseId;
  /** 这节课负责讲透的原则 */
  principles: string[];
  lessonId: string;
}

export const CURRICULUM: CurriculumItem[] = LESSONS.map((lesson) => ({
  no: lesson.num,
  titleEn: lesson.titleEn,
  title: lesson.title,
  subtitle: lesson.subtitle,
  minutes: lesson.minutes,
  phase: lesson.phase,
  principles: lesson.principles,
  lessonId: lesson.id,
}));

export const PUBLISHED_COUNT = CURRICULUM.length;

export function curriculumFor(lessonId: string): CurriculumItem | undefined {
  return CURRICULUM.find((item) => item.lessonId === lessonId);
}

/** 每节课覆盖的原则数合计 = 24，一条不漏、一条不重复。 */
export const COVERED_PRINCIPLE_IDS = new Set(CURRICULUM.flatMap((item) => item.principles));
