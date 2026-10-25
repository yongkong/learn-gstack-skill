import { renderToString } from 'react-dom/server';
import App from './App';
import { LessonPage } from './pages/LessonPage';
import { LESSONS } from './content/lessons';
import { CURRICULUM, curriculumFor } from './content/curriculum';
import { PRINCIPLES } from './content/principles';
import { PLAYBOOK_BY_ID } from './content/playbooks';

/** 只用于烟雾测试：证明整棵 React 树能无错渲染，且内容真的出现在输出里。 */
export function render(): string {
  return renderToString(<App />);
}

export function renderLesson(id: string): string {
  return renderToString(<LessonPage id={id} />);
}

export function lessonIds(): string[] {
  return LESSONS.map((lesson) => lesson.id);
}

/** 每节课的元信息，供烟雾测试逐条断言。 */
export function lessonStats() {
  return LESSONS.map((lesson) => {
    const meta = curriculumFor(lesson.id);
    return {
      id: lesson.id,
      title: meta?.title ?? lesson.id,
      titleEn: lesson.titleEn ?? '',
      minutes: meta?.minutes ?? 0,
      quizzes: lesson.blocks.filter((block) => block.kind === 'quiz').length,
      principleIds: lesson.blocks.flatMap((block) => (block.kind === 'principles' ? block.ids : [])),
      playbookIds: lesson.blocks.flatMap((block) => (block.kind === 'playbooks' ? block.ids : [])),
      playbookNames: lesson.blocks
        .flatMap((block) => (block.kind === 'playbooks' ? block.ids : []))
        .map((id) => PLAYBOOK_BY_ID.get(id)?.zh ?? id),
    };
  });
}

/** 进度里用的测验键（lessonId:quizId），必须全局唯一，否则会串课。 */
export function quizKeys(): string[] {
  return LESSONS.flatMap((lesson) =>
    lesson.blocks.flatMap((block) => (block.kind === 'quiz' ? [`${lesson.id}:${block.id}`] : [])),
  );
}

/** 验证"课程覆盖全部原则、不漏不重"这句文案是否属实。 */
export function coverage() {
  const assigned = CURRICULUM.flatMap((item) => item.principles);
  const known = new Set(PRINCIPLES.map((principle) => principle.id));
  const counts = new Map<string, number>();
  assigned.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
  return {
    total: PRINCIPLES.length,
    assigned: assigned.length,
    missing: [...known].filter((id) => !counts.has(id)),
    duplicated: [...counts].filter(([, n]) => n > 1).map(([id]) => id),
    unknown: assigned.filter((id) => !known.has(id)),
    /** 路线图声明的原则必须都在课程页里出现（课程页可以额外预告下游原则，但不能少讲） */
    mismatched: CURRICULUM.filter((item) => {
      if (!item.lessonId) return false;
      const lesson = LESSONS.find((entry) => entry.id === item.lessonId);
      if (!lesson) return true;
      const declared = new Set(
        lesson.blocks.flatMap((block) => (block.kind === 'principles' ? block.ids : [])),
      );
      return item.principles.some((id) => !declared.has(id));
    }).map((item) => `L${item.no}`),
    unpublished: CURRICULUM.filter((item) => !item.lessonId).map((item) => `L${item.no}`),
  };
}
