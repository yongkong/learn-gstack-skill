import type { ReactNode } from 'react';
import { Link, useRoute } from '../lib/router';
import { CURRICULUM, PUBLISHED_COUNT } from '../content/curriculum';
import { PRINCIPLES } from '../content/principles';
import { PLAYBOOKS } from '../content/playbooks';
import { useProgress } from '../lib/progress';

export function Layout({ children }: { children: ReactNode }) {
  const route = useRoute();
  const progress = useProgress();

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">pstack · 学习站</span>
          <div className="brand-title">写更少，更对</div>
          <span className="brand-sub">一个工程师的工作方式，拆成可复习的单元</span>
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link" ariaCurrent={route === '/'}>
            <span>课程地图</span>
            <span className="nav-count">
              {PUBLISHED_COUNT}/{CURRICULUM.length}
            </span>
          </Link>
          <Link to="/principles" className="nav-link" ariaCurrent={route === '/principles'}>
            <span>原则速查</span>
            <span className="nav-count">{PRINCIPLES.length}</span>
          </Link>
          <Link to="/playbooks" className="nav-link" ariaCurrent={route === '/playbooks'}>
            <span>Playbook</span>
            <span className="nav-count">{PLAYBOOKS.length}</span>
          </Link>
        </nav>

        <p className="side-label">课程路线</p>
        <div className="lesson-list">
          {CURRICULUM.map((item) => {
            const body = (
              <>
                <span className="lesson-no">{String(item.no).padStart(2, '0')}</span>
                <span>
                  {item.title}
                  {item.lessonId && progress.visited[item.lessonId] ? ' ·' : ''}
                </span>
              </>
            );

            if (!item.lessonId) {
              return (
                <span className="lesson-link is-planned" key={item.no} title="还没写">
                  {body}
                </span>
              );
            }

            return (
              <Link
                to={`/lesson/${item.lessonId}`}
                className="lesson-link"
                ariaCurrent={route === `/lesson/${item.lessonId}`}
                key={item.no}
              >
                {body}
              </Link>
            );
          })}
        </div>

        <div className="side-foot">
          复习法：先合上笔记，用自己的话说出这一条原则在拦什么，再翻回来对。读完不算学会，能默写三道闸才算。
        </div>
      </aside>

      <main className="main">{children}</main>
    </div>
  );
}
