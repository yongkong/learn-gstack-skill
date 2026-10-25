import type { Lesson } from './types';

/**
 * 课程 md 是唯一内容来源。这里不做任何手写注册：
 * 新增一节课 = 在 content/lessons/ 放一个 NNNN-slug.md，别的什么都不用改。
 *
 * glob 在构建期展开，每个 md 由 build/vite-plugin-lessons.ts 编译成 Lesson 对象。
 */
const modules = import.meta.glob<Lesson>('/content/lessons/*.md', {
  eager: true,
  import: 'default',
});

export const LESSONS: Lesson[] = Object.values(modules).sort((a, b) => a.num - b.num);

export const LESSON_BY_ID = new Map(LESSONS.map((lesson) => [lesson.id, lesson]));
