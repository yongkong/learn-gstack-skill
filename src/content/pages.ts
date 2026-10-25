import type { PageDoc } from './types';

/**
 * 普通页面的 md 来源。和课程一样走 glob，新增一个页面 = 放一个 md 文件。
 * 与 content/lessons 的区别只有一个：页面不进路线图，也没有时长和目标。
 */
const modules = import.meta.glob<PageDoc>('/content/pages/*.md', {
  eager: true,
  import: 'default',
});

export const PAGES: PageDoc[] = Object.values(modules);

export const PAGE_BY_ID = new Map(PAGES.map((page) => [page.id, page]));
