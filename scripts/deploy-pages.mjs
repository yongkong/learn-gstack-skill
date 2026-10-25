#!/usr/bin/env node
/**
 * 把 dist/ 发布到 gh-pages 分支（GitHub Pages）。
 *
 * 为什么需要它：Pages 服务的是仓库里的一个分支，不是本地 dist/。
 * 手工发布的成本一高，线上就会悄悄停在旧版本——所以把它收敛成一条命令。
 *
 * 用法：npm run deploy:pages
 */
import { execSync } from 'node:child_process';
import { cpSync, mkdtempSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');
const BRANCH = 'gh-pages';

const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'pipe' }).toString().trim();

function remoteUrl() {
  try {
    return run('git remote get-url origin', root);
  } catch {
    throw new Error('没有 origin 远程仓库，先执行 git remote add origin <url>');
  }
}

function build() {
  process.stdout.write('构建 ... ');
  execSync('npm run build', { cwd: root, stdio: 'pipe' });
  if (!existsSync(path.join(dist, 'index.html'))) {
    throw new Error('构建结束但 dist/index.html 不存在');
  }
  // GitHub Pages 默认跑 Jekyll，会忽略下划线开头的路径；关掉它。
  writeFileSync(path.join(dist, '.nojekyll'), '');
  console.log('ok');
}

function publish() {
  const work = mkdtempSync(path.join(tmpdir(), 'gh-pages-'));
  try {
    cpSync(dist, work, { recursive: true });
    const git = (cmd) => run(`git ${cmd}`, work);
    git('init -q -b ' + BRANCH);
    git('add -A');

    // 内容没变就不推送，避免每次刷新都产生一个只有时间戳的提交。
    // 比较 tree 哈希而不是 `diff --cached`：空仓库里没有 HEAD，diff 会一律算作有变化。
    const localTree = git('write-tree');
    let remoteTree = '';
    try {
      git(`fetch -q --depth 1 ${remoteUrl()} ${BRANCH}`);
      // 用 %T 取 tree 哈希，不要写 FETCH_HEAD^{tree}：Windows 下 execSync 走 cmd.exe，`^` 会被当转义符吃掉。
      remoteTree = git('show -s --format=%T FETCH_HEAD');
    } catch (err) {
      remoteTree = ''; // 远程还没有这个分支，照常推送
      console.log(`（读取远程分支失败，按首次发布处理：${String(err.stderr || err.message).trim().split('\n')[0]}）`);
    }
    if (localTree && localTree === remoteTree) {
      console.log('产物与线上一致，跳过推送');
      return;
    }
    console.log(`产物有变化（${localTree.slice(0, 8)} → ${remoteTree.slice(0, 8) || '无远程分支'}）`);

    git(`-c user.name="${run('git config user.name', root) || 'github-actions'}" -c user.email="${run('git config user.email', root) || 'actions@github.com'}" commit -q -m "build: 发布 ${new Date().toISOString().slice(0, 16).replace('T', ' ')}"`);
    git(`push -q --force ${remoteUrl()} ${BRANCH}`);
    console.log('已推送 gh-pages');
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

build();
publish();
console.log('完成。Pages 通常 30–60 秒后生效。');
