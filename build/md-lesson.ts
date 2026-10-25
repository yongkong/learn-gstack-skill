/**
 * md → Lesson 解析器。构建期运行（vite plugin），产物是普通 JS 模块，
 * 所以 markdown-it / gray-matter 不会进客户端 bundle。
 *
 * 课程 md 的格式约定见 README「课程 md 格式」一节。核心只有两条：
 *   1. 元信息放 frontmatter，正文是标准 Markdown；
 *   2. 需要变成 React 组件的块用 `:::name arg` 容器包裹，其余交给 markdown-it。
 */
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import type { Block, Lesson, PageDoc, PhaseId } from '../src/content/types';

export type { Block, Lesson, PageDoc };

const md = new MarkdownIt({ html: false, linkify: true, typographer: false });

class LessonParseError extends Error {
  constructor(file: string, message: string) {
    super(`${file}: ${message}`);
    this.name = 'LessonParseError';
  }
}

const REQUIRED = ['num', 'title', 'subtitle', 'minutes', 'phase', 'goal'] as const;

const PHASE_IDS: PhaseId[] = ['core', 'architecture', 'verification', 'delegation', 'closing'];

/** phase 写错是内容错误，不该静默落进产物。 */
function parsePhase(value: string, file: string): PhaseId {
  if (!PHASE_IDS.includes(value as PhaseId)) {
    throw new LessonParseError(file, `phase 只能是 ${PHASE_IDS.join(' / ')}，收到「${value}」`);
  }
  return value as PhaseId;
}


/** `:::name arg` 开、`:::` 闭。arg 为空时返回空串。 */
const OPEN = /^:::([a-z]+)\s*(.*)$/;
const CLOSE = /^:::\s*$/;

function splitInline(line: string): { kind: string; arg: string } | null {
  const m = OPEN.exec(line);
  if (!m) return null;
  return { kind: m[1], arg: m[2].trim() };
}

/** 把一段连续的非容器文本交给 markdown-it，产出单个 html block。 */
function flushText(buffer: string[], blocks: Block[]) {
  const text = buffer.join('\n').trim();
  if (!text) return;
  const html = md.render(text).trim();
  if (html) blocks.push({ kind: 'html', html });
  buffer.length = 0;
}

function parseQuizBody(file: string, id: string, body: string[]): Block {
  const questionLines: string[] = [];
  const options: string[] = [];
  const answerIndex: number[] = [];
  const explainLines: string[] = [];
  let seenOption = false;
  let seenExplain = false;

  for (const raw of body) {
    const line = raw.trimEnd();
    const option = /^\s*[-*]\s+\[( |x|X)\]\s+(.*)$/.exec(line);
    if (option) {
      seenOption = true;
      options.push(option[2].trim());
      if (option[1].toLowerCase() === 'x') answerIndex.push(options.length - 1);
      continue;
    }
    const quote = /^\s*>\s?(.*)$/.exec(line);
    if (quote) {
      seenExplain = true;
      explainLines.push(quote[1]);
      continue;
    }
    if (!seenOption && !seenExplain && line.trim()) questionLines.push(line.trim());
  }

  if (!questionLines.length) throw new LessonParseError(file, `quiz ${id} 缺题干`);
  if (options.length < 2) throw new LessonParseError(file, `quiz ${id} 至少需要 2 个选项（用 - [ ] / - [x]）`);
  if (answerIndex.length !== 1) {
    throw new LessonParseError(file, `quiz ${id} 必须且只能有一个 [x]，当前 ${answerIndex.length} 个`);
  }
  if (!explainLines.length) throw new LessonParseError(file, `quiz ${id} 缺解释（用 > 开头）`);

  return {
    kind: 'quiz',
    id,
    question: questionLines.join(' '),
    options,
    answer: answerIndex[0],
    explain: explainLines.join(' ').trim(),
  };
}

function parseSourceBody(file: string, label: string, body: string[]): Block {
  const fields = new Map<string, string>();
  for (const line of body) {
    const m = /^(url|why)\s*:\s*(.+)$/.exec(line.trim());
    if (m) fields.set(m[1], m[2].trim());
  }
  const url = fields.get('url');
  const why = fields.get('why');
  if (!url) throw new LessonParseError(file, `source「${label}」缺 url:`);
  if (!why) throw new LessonParseError(file, `source「${label}」缺 why:`);
  return { kind: 'source', label, url, why };
}

function parseContainer(file: string, kind: string, arg: string, body: string[]): Block | null {
  switch (kind) {
    case 'callout': {
      const [tone, ...rest] = arg.split(/\s+/);
      const title = rest.join(' ').trim();
      if (!['insight', 'warn', 'task'].includes(tone)) {
        throw new LessonParseError(file, `callout 的 tone 只能是 insight / warn / task，收到「${tone}」`);
      }
      if (!title) throw new LessonParseError(file, 'callout 缺标题：:::callout insight 标题');
      const text = body.join('\n').trim();
      if (!text) throw new LessonParseError(file, `callout「${title}」内容为空`);
      return { kind: 'callout', tone: tone as 'insight' | 'warn' | 'task', title, text };
    }
    case 'code': {
      const lines = [...body];
      while (lines.length && !lines[0].trim()) lines.shift();
      while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
      if (!lines.length) throw new LessonParseError(file, `code 块「${arg}」内容为空`);
      return { kind: 'code', label: arg || undefined, text: lines.join('\n') };
    }
    case 'quote': {
      const text = body.join('\n').trim();
      if (!text) throw new LessonParseError(file, 'quote 块内容为空');
      // quote 在 mv 后并入 html 渲染，这里保留独立 block 以便保留引用样式
      return { kind: 'html', html: `<blockquote>“${escapeHtml(text)}”${arg ? `<cite>${escapeHtml(arg)}</cite>` : ''}</blockquote>` };
    }
    case 'principles':
    case 'playbooks': {
      const ids = body
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#'));
      if (!ids.length) throw new LessonParseError(file, `${kind} 块至少要写一个 id`);
      return { kind, ids } as Block;
    }
    case 'quiz':
      if (!arg) throw new LessonParseError(file, 'quiz 需要一个 id：:::quiz q1');
      return parseQuizBody(file, arg, body);
    case 'source':
      if (!arg) throw new LessonParseError(file, 'source 需要一个标题：:::source 标题');
      return parseSourceBody(file, arg, body);
    case 'visual':
      if (!arg) throw new LessonParseError(file, 'visual 需要一个图解 id：:::visual three-gates');
      // 正文里不能塞内容：图解的形状由 src/content/visuals.ts 定义。
      if (body.some((line) => line.trim())) {
        throw new LessonParseError(file, `visual「${arg}」容器内应为空，图解内容写进 visuals.ts`);
      }
      return { kind: 'visual', id: arg };
    default:
      return null;
  }
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function parseBody(source: string, file = 'lesson.md'): Block[] {
  const blocks: Block[] = [];
  const text: string[] = [];
  const lines = source.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const open = splitInline(line);

    if (open) {
      flushText(text, blocks);
      const body: string[] = [];
      let closed = false;
      for (i += 1; i < lines.length; i += 1) {
        if (CLOSE.test(lines[i])) {
          closed = true;
          break;
        }
        body.push(lines[i]);
      }
      if (!closed) throw new LessonParseError(file, `:::${open.kind} 容器没有闭合（缺单独的 ::: 行）`);
      const block = parseContainer(file, open.kind, open.arg, body);
      if (!block) throw new LessonParseError(file, `不认识的容器类型 :::${open.kind}`);
      blocks.push(block);
      continue;
    }

    text.push(line);
  }

  flushText(text, blocks);
  return blocks;
}

/** 从文件名取 id 与 num：0001-laziness-protocol.md → 0001-laziness-protocol / 1 */
export function identityFromFile(basename: string): { id: string; num: string } {
  const id = basename.replace(/\.md$/, '');
  const m = /^(\d{4})-/.exec(id);
  if (!m) {
    throw new Error(`${basename}: 文件名必须是 NNNN-slug.md 的形式`);
  }
  return { id, num: m[1] };
}

export function parseLesson(source: string, basename: string, sourceFile = basename): Lesson {
  const { data, content } = matter(source);
  const { id, num } = identityFromFile(basename);

  const missing = REQUIRED.filter((key) => data[key] === undefined || data[key] === '');
  if (missing.length) throw new LessonParseError(sourceFile, `frontmatter 缺字段：${missing.join('、')}`);

  const frontNum = String(data.num);
  if (frontNum !== num) {
    throw new LessonParseError(sourceFile, `frontmatter num(${frontNum}) 与文件名(${num}) 不一致`);
  }

  const minutes = Number(data.minutes);
  if (!Number.isFinite(minutes) || minutes <= 0) {
    throw new LessonParseError(sourceFile, `minutes 必须是正数，收到「${data.minutes}」`);
  }

  // 正文里出现 `---` 分隔线以外的一级标题没有意义，全部内容从 ## 起。
  if (/^#\s/m.test(content)) {
    throw new LessonParseError(sourceFile, '正文不要写一级标题 #，页面标题由 frontmatter title 提供');
  }

  const principles = Array.isArray(data.principles) ? data.principles.map(String) : [];

  return {
    id,
    num: Number(num),
    titleEn: data.titleEn === undefined ? undefined : String(data.titleEn),
    title: String(data.title),
    subtitle: String(data.subtitle),
    minutes,
    phase: parsePhase(String(data.phase), sourceFile),
    lede: data.lede === undefined ? undefined : String(data.lede),
    goal: String(data.goal),
    principles,
    blocks: parseBody(content, sourceFile),
    nextUp: data.nextUp === undefined ? undefined : String(data.nextUp),
    sourceFile,
  };
}

/**
 * 普通页面：不是课程，不进路线图，所以不要求 num / minutes / phase / goal。
 * 只要求一个标题，正文规则和课程完全一样（同样的容器、同样的 md）。
 */
export function parseDoc(source: string, basename: string, sourceFile = basename): PageDoc {
  const { data, content } = matter(source);
  const id = basename.replace(/\.md$/, '');

  if (!data.title) throw new LessonParseError(sourceFile, 'frontmatter 缺 title');

  if (/^#\s/m.test(content)) {
    throw new LessonParseError(sourceFile, '正文不要写一级标题 #，页面标题由 frontmatter title 提供');
  }

  return {
    id,
    title: String(data.title),
    subtitle: data.subtitle === undefined ? '' : String(data.subtitle),
    blocks: parseBody(content, sourceFile),
    sourceFile,
  };
}
