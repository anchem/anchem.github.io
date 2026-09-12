/**
 * ============================================================================
 *  首页构建期数据
 *  ---------------------------------------------------------------------------
 *  在配置加载时（Node 环境）从仓库里算出前端不好算的东西，
 *  结果由 docusaurus.config.js 放进 customFields.homepageData。
 *
 *  目前两项：
 *    1. shelfStats   —— 知识书架：每个板块的文档篇数 + 最近更新时间
 *    2. postExcerpts —— 最新随笔：每篇的摘要（取正文第一段）
 *
 *  【为什么篇数和时间要在构建期算】
 *  篇数：docs 下 .md 文件数（跳过 `_` 和 `.` 开头的，与 Docusaurus 默认排除
 *        规则一致）—— 实测与站点实际发布篇数完全吻合，所以加文章不用改代码。
 *  时间：必须用 git 提交时间。文件 mtime 在 CI 上等于 checkout 时间，
 *        会让每个模块都显示"今天"。所以 CI 里 actions/checkout 需要
 *        fetch-depth: 0，否则取不到历史会退化成 mtime。
 *        详见 .github/workflows/deploy.yml。
 *
 *  【为什么摘要要在构建期算】
 *  Docusaurus 生成的博客列表 JSON（~blog/.../blog-post-list-prop-*.json）
 *  只有 title / permalink / date，没有摘要。要拿到摘要就得读 markdown，
 *  而 markdown 只有构建期读得到。
 *
 *  【降级策略】任何一项算不出来都返回 null/空对象，前端自动隐藏，
 *  不会渲染出空字符串或 Invalid Date。
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const {execFileSync} = require('child_process');

// 本文件位于 <root>/src/config/，所以仓库根目录在上两级
const ROOT_DIR = path.resolve(__dirname, '..', '..');

/** 书架 key → docs 下的相对目录 */
const SHELF_DIRS = {
  softwaremaster: 'docs/softwaremaster',
  selfdevelop: 'docs/selfdevelop',
  growthtree: 'docs/growthtree',
  lifeforfun: 'docs/lifeforfun',
};

const DOC_EXTENSIONS = ['.md', '.mdx'];

/** 摘要长度上限（按字符数，中文一字算一个） */
const EXCERPT_LIMIT = 64;

/* ==========================================================================
   通用工具
   ========================================================================== */

/** 把 git 输出的日期规整成 YYYY-MM-DD；拿不到就返回 null */
function parseDateString(raw) {
  const matched = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(raw || '').trim());
  return matched ? `${matched[1]}-${matched[2]}-${matched[3]}` : null;
}

/** 该目录最后一次提交的日期 */
function gitLastCommitDate(relativeDir) {
  try {
    const output = execFileSync(
      'git',
      // --date=short 兼容性比 %cs 好，老版本 git 也能用
      ['log', '-1', '--date=short', '--format=%cd', '--', relativeDir],
      {
        cwd: ROOT_DIR,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      },
    );
    return parseDateString(output);
  } catch {
    return null;
  }
}

/** 降级用：取文件里最新的修改时间 */
function latestMtime(files) {
  let latest = 0;
  for (const file of files) {
    try {
      const {mtimeMs} = fs.statSync(file);
      if (mtimeMs > latest) latest = mtimeMs;
    } catch {
      // 单个文件读不到就跳过，不影响整体
    }
  }
  if (!latest) return null;

  const d = new Date(latest);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * 递归收集目录下的文档文件。
 * 跳过 `_` 和 `.` 开头的文件/目录 —— 与 Docusaurus 默认的排除规则
 * （下划线开头的文件与下划线开头的目录都会被忽略）保持一致，
 * 这样统计出来的篇数和站点实际发布的篇数一致。
 */
function collectDocs(dir) {
  const found = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, {withFileTypes: true});
  } catch {
    return found;
  }

  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      found.push(...collectDocs(fullPath));
    } else if (entry.isFile() && DOC_EXTENSIONS.includes(path.extname(entry.name))) {
      found.push(fullPath);
    }
  }
  return found;
}

/* ==========================================================================
   一、知识书架统计
   ========================================================================== */

/** 生成 {书架key: {count, updated}} */
function buildShelfStats() {
  const stats = {};
  for (const [key, relativeDir] of Object.entries(SHELF_DIRS)) {
    const files = collectDocs(path.join(ROOT_DIR, relativeDir));
    stats[key] = {
      count: files.length,
      updated: gitLastCommitDate(relativeDir) || latestMtime(files),
    };
  }
  return stats;
}

/* ==========================================================================
   二、最新随笔摘要
   ========================================================================== */

/** 拆出 front matter 与正文 */
function splitFrontMatter(raw) {
  const matched = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);
  if (!matched) return {frontMatter: '', body: raw};
  return {frontMatter: matched[1], body: matched[2]};
}

/** 去掉行内 markdown 标记，只留可读的文字 */
function stripInlineMarkdown(text) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接留文字
    .replace(/<[^>]+>/g, '') // 内联 HTML
    .replace(/[*_`~]/g, '') // 强调、行内代码
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * 取正文第一段作为摘要。
 * 跳过：front matter、HTML 注释（如 <!--truncate-->）、标题、引用、
 *       列表、表格、代码块、图片行。
 */
function extractExcerpt(body) {
  const lines = body.split(/\r?\n/);
  let collected = '';
  let inFence = false;

  for (const line of lines) {
    const text = line.trim();

    if (text.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    if (text === '') {
      if (collected) break; // 空行 = 第一段结束
      continue;
    }
    if (text.startsWith('<!--') || text.startsWith(':::')) continue; // 注释、容器指令
    if (text.startsWith('#')) {
      if (collected) break;
      continue;
    }
    if (/^[>|]/.test(text) || /^[-*+]\s/.test(text) || /^\d+\.\s/.test(text)) {
      if (collected) break;
      continue; // 引用 / 列表 / 表格不作为摘要
    }
    if (/^!\[/.test(text)) continue;

    collected += (collected ? ' ' : '') + text;
  }

  const clean = stripInlineMarkdown(collected)
    // 正文开头的「【摘要】」在卡片里是多余的（上面就是标题），去掉
    .replace(/^【\s*摘\s*要\s*】\s*/, '');
  if (!clean) return null;
  if (clean.length <= EXCERPT_LIMIT) return clean;

  // 截断时优先在句末断开，其次在逗号，最后硬切
  const head = clean.slice(0, EXCERPT_LIMIT);
  const stop = Math.max(
    head.lastIndexOf('。'),
    head.lastIndexOf('！'),
    head.lastIndexOf('？'),
    head.lastIndexOf('；'),
  );
  if (stop >= EXCERPT_LIMIT * 0.55) {
    return head.slice(0, stop + 1);
  }
  const comma = Math.max(head.lastIndexOf('，'), head.lastIndexOf('、'));
  if (comma >= EXCERPT_LIMIT * 0.75) {
    return `${head.slice(0, comma)}…`;
  }
  return `${head}…`;
}

/** 从 front matter 里取一个字段的原值（只做简单匹配，不引 YAML 解析器） */
function readFrontMatterField(frontMatter, key) {
  const matched = new RegExp(`^${key}\\s*:\\s*(.+)$`, 'm').exec(frontMatter);
  if (!matched) return null;
  return matched[1].trim().replace(/^['"]|['"]$/g, '');
}

/** 文件名 `2026-09-11-jump-out-of-life-loop.md` → `jump-out-of-life-loop` */
function slugFromFilename(filename) {
  return filename
    .replace(/\.mdx?$/, '')
    .replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

/** 生成 {permalink: 摘要}，permalink 形如 `/blog/xxx` */
function buildPostExcerpts() {
  const excerpts = {};
  const blogDir = path.join(ROOT_DIR, 'blog');

  let entries;
  try {
    entries = fs.readdirSync(blogDir, {withFileTypes: true});
  } catch {
    return excerpts;
  }

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!DOC_EXTENSIONS.includes(path.extname(entry.name))) continue;
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;

    let raw;
    try {
      raw = fs.readFileSync(path.join(blogDir, entry.name), 'utf8');
    } catch {
      continue;
    }

    const {frontMatter, body} = splitFrontMatter(raw);
    const slug =
      readFrontMatterField(frontMatter, 'slug') || slugFromFilename(entry.name);
    const excerpt = extractExcerpt(body);
    if (excerpt) excerpts[`/blog/${slug}`] = excerpt;
  }

  return excerpts;
}

/** 一次性生成首页需要的全部构建期数据 */
function buildHomepageData() {
  return {
    shelfStats: buildShelfStats(),
    postExcerpts: buildPostExcerpts(),
  };
}

module.exports = {
  buildHomepageData,
  buildShelfStats,
  buildPostExcerpts,
  SHELF_DIRS,
};
