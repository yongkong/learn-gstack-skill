import { CURRICULUM, PHASES, type CurriculumItem } from '../content/curriculum';
import { LESSON_BY_ID } from '../content/lessons';
import { Link } from '../lib/router';
import { useProgress } from '../lib/progress';

function quizIdsOf(lessonId: string): string[] {
  const lesson = LESSON_BY_ID.get(lessonId);
  if (!lesson) return [];
  // 与 Quiz 组件里的作用域规则保持一致：lessonId:quizId
  return lesson.blocks.flatMap((block) => (block.kind === 'quiz' ? [`${lessonId}:${block.id}`] : []));
}

function stateOf(item: CurriculumItem, progress: ReturnType<typeof useProgress>): string {
  if (!item.lessonId) return '计划中';
  const quizIds = quizIdsOf(item.lessonId);
  if (quizIds.length > 0 && quizIds.every((id) => progress.quizzes[id]?.correct)) return '已通过';
  return progress.visited[item.lessonId] ? '在读' : '开始';
}

function Row({ item }: { item: CurriculumItem }) {
  const progress = useProgress();
  const state = stateOf(item, progress);
  const done = state === '已通过';

  const inner = (
    <>
      <span className="lesson-card-no">{String(item.no).padStart(2, '0')}</span>
      <span>
        <span className="lesson-card-title">{item.title}</span>
        {item.titleEn && <span className="lesson-card-en">{item.titleEn}</span>}
        <span className="lesson-card-sub">{item.subtitle}</span>
      </span>
      <span className={`lesson-card-state ${done ? 'done' : ''}`}>
        {state} · {item.minutes} 分钟
      </span>
    </>
  );

  if (!item.lessonId) {
    return <div className="lesson-card is-planned">{inner}</div>;
  }

  return (
    <Link to={`/lesson/${item.lessonId}`} className="lesson-card">
      {inner}
    </Link>
  );
}

export function Curriculum() {
  return (
    <>
      {PHASES.map((phase) => {
        const items = CURRICULUM.filter((item) => item.phase === phase.id);
        return (
          <section key={phase.id}>
            <div className="group-head">
              <h2>{phase.zh}</h2>
              <p className="group-note">{phase.goal}</p>
            </div>
            <div className="lesson-grid">
              {items.map((item) => (
                <Row item={item} key={item.no} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
