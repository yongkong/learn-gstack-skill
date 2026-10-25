import { Blocks } from '../components/Blocks';
import { PAGE_BY_ID } from '../content/pages';
import { Link } from '../lib/router';

/** 图解页。内容在 content/pages/visuals.md，形状定义在 content/visuals.ts。 */
export function VisualsPage({ id = 'visuals' }: { id?: string }) {
  const page = PAGE_BY_ID.get(id);

  if (!page) {
    return (
      <div className="page">
        <p className="eyebrow">404</p>
        <h1>这一页还没写</h1>
        <Link to="/">回到课程地图</Link>
      </div>
    );
  }

  return (
    <article className="page page-wide">
      <p className="eyebrow">视觉索引</p>
      <h1>{page.title}</h1>
      {page.subtitle && <p className="lead">{page.subtitle}</p>}

      <Blocks blocks={page.blocks} scope={`page:${page.id}`} />
    </article>
  );
}
