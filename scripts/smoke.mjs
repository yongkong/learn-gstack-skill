import { render, renderLesson, lessonStats, coverage, quizKeys } from '../.ssr/entry-server.js';

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

console.log(`\n${failed === 0 ? '全部通过' : `${failed} 项失败`}`);
process.exit(failed === 0 ? 0 : 1);
