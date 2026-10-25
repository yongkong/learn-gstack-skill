import { readFileSync } from 'node:fs';
import {
  render,
  renderLesson,
  renderPage,
  lessonStats,
  coverage,
  quizKeys,
  visualAudit,
} from '../.ssr/entry-server.js';

const CSS = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf-8');

/** DOM 里的类名必须在 styles.css 里有一条规则：拼错的类名不会报错，只会静默没有样式。 */
function unstyledClasses(html) {
  const used = new Set();
  for (const match of html.matchAll(/class="([^"]+)"/g)) {
    match[1].split(/\s+/).filter(Boolean).forEach((name) => used.add(name));
  }
  return [...used].filter((name) => !new RegExp(`\\.${name}[\\s,{:.]`).test(CSS));
}

/** React 会在相邻文本节点之间插注释，并把引号转义成实体，检查前先还原。 */
const clean = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

let failed = 0;
function assert(label, ok, detail) {
  if (!ok) failed += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}  (${detail})`);
}
function check(label, html, needle) {
  assert(label, clean(html).includes(needle), needle);
}

const home = render();
check('首页标题', home, '学会 pstack 的那套判断');
check('原则数量', home, '24 条');
check('课程路线总数', home, '共 16 课');
check('playbook 入口', home, 'Playbook 索引');
check('侧栏复习提示', home, '复习法');

const stats = lessonStats();
assert('已发布课程数 = 16', stats.length === 16, String(stats.length));

const missingEn = stats.filter((item) => !item.titleEn.trim()).map((item) => item.id);
assert('每节课都有英文正式名', missingEn.length === 0, missingEn.join(',') || `${stats.length}/${stats.length}`);

for (const item of stats) {
  const page = clean(renderLesson(item.id));
  assert(`课 ${item.id} 标题`, page.includes(item.title), item.title);
  assert(`课 ${item.id} 目标`, page.includes('学完能做到'), `${item.minutes} 分钟`);
  assert(`课 ${item.id} 练习`, item.quizzes >= 2, `${item.quizzes} 题`);
  assert(
    `课 ${item.id} 挂载原则或 playbook`,
    item.principleIds.length + item.playbookIds.length > 0,
    [...item.principleIds, ...item.playbookIds].join(',') || '无',
  );
  for (const name of item.playbookNames) {
    assert(`课 ${item.id} playbook 渲染`, page.includes(name), name);
  }
  // 双语：英文正式名必须真的渲染出来，而不是只躺在 frontmatter 里
  check(`课 ${item.id} 英文正式名`, page, item.titleEn);
  // md 解析的正确性：容器标记和 ## 记号不该原样漏进 DOM
  assert(
    `课 ${item.id} md 已解析`,
    !page.includes(':::') && !page.includes('## '),
    page.includes(':::') ? '残留 ::: 容器' : page.includes('## ') ? '残留 ## 记号' : '无残留',
  );
}

const cov = coverage();
assert('原则全部被课程覆盖', cov.missing.length === 0, cov.missing.join(',') || '无遗漏');
assert('原则没有被重复安排', cov.duplicated.length === 0, cov.duplicated.join(',') || '无重复');
assert('课程引用的原则 id 都存在', cov.unknown.length === 0, cov.unknown.join(',') || '无未知 id');
assert('原则总数一致', cov.total === cov.assigned, `${cov.assigned}/${cov.total}`);
assert('路线图与课程页讲的原则一致', cov.mismatched.length === 0, cov.mismatched.join(',') || '全部一致');
assert('所有课都已发布', cov.unpublished.length === 0, cov.unpublished.join(',') || '无待写');

// 测验键必须全局唯一，否则答一课会把另一课的题标成答过
const keys = quizKeys();
assert('测验键跨课程唯一', new Set(keys).size === keys.length, `${keys.length} 题 / ${new Set(keys).size} 唯一`);
assert('题量与课程数匹配', keys.length === stats.length * 3, `${keys.length} = ${stats.length} × 3`);

// 图解页：id 必须能解析，指回的课必须存在，图必须真的渲染出来
const viz = visualAudit();
assert('图解页存在', viz.pages.length > 0, viz.pages.map((page) => page.id).join(','));
assert('md 引用的图解都已定义', viz.missing.length === 0, viz.missing.join(',') || '无缺失');
assert('定义的图解都被用到', viz.unused.length === 0, viz.unused.join(',') || '无死代码');
assert('图解指向的课程都存在', viz.badLesson.length === 0, viz.badLesson.join(',') || '全部有效');
assert(
  '图解形式不止一种',
  Object.keys(viz.kinds).length >= 4,
  Object.entries(viz.kinds).map(([kind, n]) => `${kind}×${n}`).join(' '),
);

for (const page of viz.pages) {
  const html = clean(renderPage(page.id));
  assert(`页面 ${page.id} 标题`, html.includes(page.title), page.title);
  assert(`页面 ${page.id} 无破损图解`, !html.includes('没有定义'), `${page.visuals.length} 张图`);
  for (const id of page.visuals) {
    const visual = viz.visuals.find((item) => item.id === id);
    check(`页面 ${page.id} 图 ${id}`, html, visual.title);
    if (visual.lessonId) {
      // 图解卡片自带「第 N 课」回链，链不上就说明 lessonId 写错了
      assert(`图 ${id} 有课程回链`, /第 \d{2} 课/.test(html), visual.lessonId);
    }
  }
  const gaps = unstyledClasses(html);
  assert(`页面 ${page.id} 类名都有样式`, gaps.length === 0, gaps.join(',') || '无未定义');
}

const homeGaps = unstyledClasses(clean(home));
assert('首页类名都有样式', homeGaps.length === 0, homeGaps.join(',') || '无未定义');

console.log(`\n${failed === 0 ? '全部通过' : `${failed} 项失败`}`);
process.exit(failed === 0 ? 0 : 1);
