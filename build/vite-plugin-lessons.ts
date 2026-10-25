/**
 * 把 content/lessons/*.md 编译成 Lesson 模块，content/pages/*.md 编译成 PageDoc 模块。
 *
 * 为什么用 plugin 而不是运行时解析：markdown-it / gray-matter 只在构建期跑，
 * 客户端 bundle 一行都不会多。md 改完刷新即生效（handleHotUpdate）。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';
import { parseDoc, parseLesson } from './md-lesson';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDir = (dir: string) => path.join(projectRoot, 'content', dir);
const lessonsDir = contentDir('lessons');
const pagesDir = contentDir('pages');

const normalize = (file: string) => file.split('?')[0].replace(/\\/g, '/');

export function lessonsPlugin(): Plugin {
  return {
    name: 'pstack:lessons-md',
    enforce: 'pre',

    load(id) {
      const file = normalize(id);
      if (!file.endsWith('.md')) return null;

      const isLesson = file.startsWith(lessonsDir.replace(/\\/g, '/'));
      const isPage = file.startsWith(pagesDir.replace(/\\/g, '/'));
      if (!isLesson && !isPage) return null;

      const source = fs.readFileSync(file, 'utf-8');
      const basename = path.basename(file);
      const relative = path.relative(projectRoot, file).replace(/\\/g, '/');

      try {
        const parsed = isLesson
          ? parseLesson(source, basename, relative)
          : parseDoc(source, basename, relative);
        return `export default ${JSON.stringify(parsed)};`;
      } catch (error) {
        // 让构建直接失败，并指到具体文件——坏的 frontmatter 不该悄悄进产物。
        const message = error instanceof Error ? error.message : String(error);
        this.error(message);
        return null;
      }
    },

    handleHotUpdate({ file, server }) {
      if (!file.endsWith('.md')) return;
      if (!file.startsWith(lessonsDir) && !file.startsWith(pagesDir)) return;
      server.ws.send({ type: 'full-reload' });
      return [];
    },
  };
}
