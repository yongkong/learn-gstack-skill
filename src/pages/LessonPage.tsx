import { useEffect } from 'react';
import { Link } from '../lib/router';
import { LESSONS, LESSON_BY_ID } from '../content/lessons';
import { curriculumFor } from '../content/curriculum';
import { Blocks } from '../components/Blocks';
import { markVisited } from '../lib/progress';

export function LessonPage({ id }: { id: string }) {
  const lesson = LESSON_BY_ID.get(id);
  const meta = curriculumFor(id);

  useEffect(() => {
    if (lesson) markVisited(lesson.id);
  }, [lesson]);

  if (!lesson || !meta) {
    return (
      <div className="page">
        <p className="eyebrow">没找到</p>
        <h1>这节课还不存在</h1>
        <p className="lead">可能是链接写错了，也可能是还没写。</p>
        <Link to="/">回到课程地图</Link>
      </div>
    );
  }

  const index = LESSONS.findIndex((item) => item.id === lesson.id);
  const prev = index > 0 ? LESSONS[index - 1] : undefined;
  const next = index >= 0 && index < LESSONS.length - 1 ? LESSONS[index + 1] : undefined;
  const prevMeta = prev ? curriculumFor(prev.id) : undefined;
  const nextMeta = next ? curriculumFor(next.id) : undefined;

  return (
    <div className="page">
      <header className="lesson-head">
        <p className="eyebrow">
          Lesson {String(meta.no).padStart(2, '0')} · {meta.minutes} 分钟
        </p>
        <h1>{meta.title}</h1>
        <p className="lesson-sub">{meta.subtitle}</p>
      </header>

      <div className="goal">
        <span className="goal-label">学完能做到</span>
        {lesson.goal}
      </div>

      <Blocks blocks={lesson.blocks} scope={lesson.id} />

      <footer className="lesson-foot">
        {lesson.nextUp && (
          <div className="next-up">
            <b>下一课</b>
            {lesson.nextUp}
          </div>
        )}

        <p className="ask-teacher">
          有卡住的地方、或者想把它套到你自己的项目上，直接问教你的人。原则在这里是压缩过的，具体的判断需要对着你的代码说。
        </p>

        <div className="meta-row" style={{ borderBottom: 0, paddingBottom: 0, marginBottom: 0 }}>
          {prev && prevMeta && (
            <Link to={`/lesson/${prev.id}`}>
              ← {prevMeta.title}
            </Link>
          )}
          <Link to="/">课程地图</Link>
          {next && nextMeta && (
            <Link to={`/lesson/${next.id}`}>
              {nextMeta.title} →
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}
