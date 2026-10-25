import { useEffect } from 'react';
import { useRoute, Link } from './lib/router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LessonPage } from './pages/LessonPage';
import { PrinciplesPage } from './pages/Principles';
import { PlaybooksPage } from './pages/Playbooks';
import { VisualsPage } from './pages/VisualsPage';

export default function App() {
  const route = useRoute();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [route]);

  const lessonMatch = /^\/lesson\/(.+)$/.exec(route);

  return (
    <Layout>
      {route === '/' ? (
        <Home />
      ) : lessonMatch ? (
        <LessonPage id={lessonMatch[1]} />
      ) : route === '/principles' ? (
        <PrinciplesPage />
      ) : route === '/playbooks' ? (
        <PlaybooksPage />
      ) : route === '/visuals' ? (
        <VisualsPage />
      ) : (
        <div className="page">
          <p className="eyebrow">404</p>
          <h1>这条路径没有内容</h1>
          <p className="lead">站内只有课程地图、图解、原则速查和 playbook 四个入口。</p>
          <Link to="/">回到课程地图</Link>
        </div>
      )}
    </Layout>
  );
}
