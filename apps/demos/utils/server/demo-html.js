// Carries a demo's own <head>/<body> markup across into the generated index.html.
const path = require('path');
const fs = require('fs');

const TEMPLATE_TAGS = [
  /\/css\/dx\.[^"']+\.css/,
  /(?:href|src)=["']\.?\/?bundle\.(?:js|css)["']/i,
];

const LOCAL_SRC_RE = /src=["'](?!https?:|\/|\.\.\/)[\w.-]+\.js["']/i;

const HEAD_TAG_RE = /<link\b[^>]*?>|<script\b[\s\S]*?<\/script\b[^>]*>/gi;

const COMMENT_RE = /<!--[\s\S]*?-->/g;

const SCRIPT_TAG_RE = /<\/?script\b[^>]*>/gi;

const SCRIPT_BLOCK_RE = /<script\b[\s\S]*?<\/script\b[^>]*>/gi;

function stripUntilStable(value, pattern) {
  let current = value;
  let previous;
  do {
    previous = current;
    current = current.replace(pattern, '');
  } while (current !== previous);
  return current;
}

function normalizeTag(tag) {
  const collapsed = tag.replace(/\s+/g, ' ').trim();
  if (!/^<link\b/i.test(collapsed)) return collapsed;
  return collapsed.replace(/\s*\/?>$/, ' />');
}

// A bundled demo has no reason to run code from <head> — its entry point is the bundle.
function warnDroppedInline(tag, context) {
  const body = stripUntilStable(tag, SCRIPT_TAG_RE).trim();
  if (!body) return;
  const where = context ? ` in ${context}` : '';
  console.warn(`demo-html: dropping inline <head> script${where} — move it into the demo's entry point so esbuild bundles it:\n  ${body.split('\n')[0].trim()}`);
}

function extractHeadExtras(html, context) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return [];

  // Commented-out tags must not come back to life.
  const tags = stripUntilStable(headMatch[1], COMMENT_RE).match(HEAD_TAG_RE) || [];
  const extras = [];
  const seen = new Set();

  for (const tag of tags) {
    const url = (tag.match(/(?:href|src)=["']([^"']+)["']/i) || [])[1];
    if (!url) {
      warnDroppedInline(tag, context);
    } else if (!seen.has(url)
      && !LOCAL_SRC_RE.test(tag)
      && !TEMPLATE_TAGS.some((re) => re.test(tag))) {
      seen.add(url);
      extras.push(normalizeTag(tag));
    }
  }

  return extras;
}

function extractBodyInner(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return null;
  const withoutScripts = stripUntilStable(bodyMatch[1], SCRIPT_BLOCK_RE);
  return withoutScripts.trim() || null;
}

function readDemoHtml(srcDir) {
  try {
    return fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');
  } catch {
    return null;
  }
}

function extractDemoHeadExtras(srcDir) {
  const html = srcDir && readDemoHtml(srcDir);
  return html ? extractHeadExtras(html, path.relative(process.cwd(), srcDir)) : [];
}

function extractDemoBodyInner(srcDir) {
  const html = srcDir && readDemoHtml(srcDir);
  return html ? extractBodyInner(html) : null;
}

module.exports = {
  extractHeadExtras, extractBodyInner, extractDemoHeadExtras, extractDemoBodyInner,
};
