// Carries a demo's own <head>/<body> markup across into the generated index.html.
const path = require('path');
const fs = require('fs');

const HEAD_BOILERPLATE = [
  /systemjs\/dist\/system/,
  /core-js\/client\/shim/,
  /\bconfig\.js\b/,
  /devextreme-dist\/js\/dx\.all(\.debug)?\.js/,
  /zone\.js\/bundles\/zone\.umd\.js/,
  /reflect-metadata\/Reflect\.js/,
  /\/css\/dx\.[^"']+\.css/,
  /(?:href|src)=["']\.?\/?styles\.css["']/i,
  /(?:href|src)=["']\.?\/?bundle\.(?:js|css)["']/i,
];

const LOCAL_SRC_RE = /src=["'](?!https?:|\/|\.\.\/)[\w.-]+\.js["']/i;

const HEAD_TAG_RE = /<link\b[^>]*?>|<script\b[\s\S]*?<\/script\s*>/gi;

function normalizeTag(tag) {
  const collapsed = tag.replace(/\s+/g, ' ').trim();
  if (!/^<link\b/i.test(collapsed)) return collapsed;
  return collapsed.replace(/\s*\/?>$/, ' />');
}

function extractHeadExtras(html) {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (!headMatch) return [];
  return (headMatch[1].match(HEAD_TAG_RE) || [])
    .filter((tag) => /(?:href|src)=/i.test(tag))
    .filter((tag) => !LOCAL_SRC_RE.test(tag))
    .filter((tag) => !HEAD_BOILERPLATE.some((re) => re.test(tag)))
    .map(normalizeTag);
}

function extractBodyInner(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return null;
  let withoutScripts = bodyMatch[1];
  let previous;
  do {
    previous = withoutScripts;
    withoutScripts = withoutScripts.replace(/<script\b[\s\S]*?<\/script\b[^>]*>/gi, '');
  } while (withoutScripts !== previous);
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
  return html ? extractHeadExtras(html) : [];
}

function extractDemoBodyInner(srcDir) {
  const html = srcDir && readDemoHtml(srcDir);
  return html ? extractBodyInner(html) : null;
}

module.exports = {
  extractHeadExtras, extractBodyInner, extractDemoHeadExtras, extractDemoBodyInner,
};
