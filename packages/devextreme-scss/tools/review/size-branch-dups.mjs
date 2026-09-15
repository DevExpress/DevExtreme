// Usage (from packages/devextreme-scss): node tools/review/size-branch-dups.mjs [--md]
// Finds `@if $size` variables whose compact value duplicates the default one - candidates to hoist
// out of the branches. Reads the compiled fluent-next bundle to resolve ds.$tokens to px.
import fs from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const SCSS = path.resolve(HERE, '../../scss');
const CSS = path.resolve(HERE, '../../../devextreme/artifacts/css/dx.fluent-next.blue.light.css');
const MD = process.argv.includes('--md');
const THEMES = ['fluent-next', 'fluent', 'material', 'generic'];

// ---- design-system token resolution (fluent-next only) ----
const dsMap = {}; // $name -> dxds name
for (const l of fs.readFileSync(path.join(SCSS, '_design-system/variables/_ds.scss'), 'utf8').split('\n')) {
  const m = /^\$([\w-]+):\s*var\(--dxds-([\w-]+)\)/.exec(l.trim());
  if (m) dsMap[m[1]] = m[2];
}
const dxds = {};
{
  const c = fs.readFileSync(CSS, 'utf8');
  const re = /--dxds-([a-z0-9-]+)\s*:\s*([^;}]+)/g; let x;
  while ((x = re.exec(c))) if (!(x[1] in dxds)) dxds[x[1]] = x[2].trim();
}
function resolveDxds(name, depth = 0) {
  let v = dxds[name];
  if (v === undefined || depth > 8) return `<${name}?>`;
  const m = /^var\(--dxds-([\w-]+)\)$/.exec(v);
  if (m) return resolveDxds(m[1], depth + 1);
  const r = /^(-?[\d.]+)rem$/.exec(v);
  if (r) return `${Math.round(parseFloat(r[1]) * 16 * 1000) / 1000}px`;
  return v;
}
function resolveValue(text) {
  return text.replace(/ds\.\$([\w-]+)/g, (_, n) => (n in dsMap ? resolveDxds(dsMap[n]) : `<ds.${n}?>`));
}

// ---- scss parsing ----
function stripComments(src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
}
function balanced(src, openIdx) {
  let d = 0;
  for (let j = openIdx; j < src.length; j++) {
    if (src[j] === '{') d++;
    else if (src[j] === '}') { d--; if (!d) return { start: openIdx, end: j + 1 }; }
  }
  return null;
}
function lineOf(src, idx) { return src.slice(0, idx).split('\n').length; }
function parseDecls(block, baseIdx, src) {
  // top-level `$name: value [!default];` statements inside the block body
  const decls = [];
  let i = 0, depthP = 0, depthB = 0, start = 0;
  const body = block;
  for (i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === '(') depthP++;
    else if (ch === ')') depthP--;
    else if (ch === '{') depthB++;
    else if (ch === '}') depthB--;
    else if (ch === ';' && depthP === 0 && depthB === 0) {
      const stmt = body.slice(start, i).trim();
      const m = /^\$([\w-]+)\s*:\s*([\s\S]+)$/.exec(stmt);
      if (m) {
        let val = m[2].replace(/!default/g, '').replace(/\s+/g, ' ').trim();
        decls.push({ name: m[1], value: val, line: lineOf(src, baseIdx + start + (stmt ? body.slice(start).indexOf(stmt[0]) : 0)) });
      }
      start = i + 1;
    }
  }
  return decls;
}
function parseFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const src = stripComments(raw);
  const branches = { default: [], compact: [], large: [] };
  const re = /@(?:else\s+)?if\s+\$size\s*==\s*"(default|compact|large)"\s*\{/g; let m;
  while ((m = re.exec(src))) {
    const openIdx = m.index + m[0].length - 1;
    const b = balanced(src, openIdx); if (!b) continue;
    const inner = src.slice(b.start + 1, b.end - 1);
    branches[m[1]].push(...parseDecls(inner, b.start + 1, src));
    re.lastIndex = b.end;
  }
  return { file, raw, branches };
}
const bareRefs = (v) => [...v.matchAll(/(^|[^\w.-])\$([\w-]+)/g)].map((x) => x[2]);
const moduleRefs = (v) => [...v.matchAll(/([\w-]+)\.\$([\w-]+)/g)].map((x) => x[1]).filter((n) => n !== 'ds');

const report = {};
for (const theme of THEMES) {
  const root = path.join(SCSS, 'widgets', theme);
  const files = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p); else if (e.name === '_sizes.scss') files.push(p);
    }
  })(root);
  files.sort();
  const parsed = files.map(parseFile);
  // which vars are branched with DIFFERENT values anywhere in the theme (root + component files)
  const differing = new Set();
  const identicalNames = new Set();
  for (const p of parsed) {
    const d = Object.fromEntries(p.branches.default.map((x) => [x.name, x]));
    for (const c of p.branches.compact) {
      if (d[c.name]) (d[c.name].value === c.value ? identicalNames : differing).add(c.name);
    }
  }
  const out = { files: [], totals: { both: 0, identical: 0, identicalButDepends: 0, sameResolved: 0, different: 0, defaultOnly: 0, compactOnly: 0, allIdenticalFiles: 0, branchedFiles: 0 } };
  for (const p of parsed) {
    const d = Object.fromEntries(p.branches.default.map((x) => [x.name, x]));
    const c = Object.fromEntries(p.branches.compact.map((x) => [x.name, x]));
    if (!Object.keys(d).length && !Object.keys(c).length) continue;
    out.totals.branchedFiles++;
    const rows = [];
    for (const name of Object.keys(d)) {
      if (!(name in c)) { rows.push({ name, kind: 'defaultOnly', def: d[name].value, line: d[name].line }); continue; }
      const dv = d[name].value, cv = c[name].value;
      let kind;
      if (dv === cv) {
        const refs = bareRefs(dv);
        const mods = moduleRefs(dv);
        const dependsDiff = refs.some((r) => differing.has(r)) || mods.length > 0;
        kind = dependsDiff ? 'identicalButDepends' : 'identical';
      } else if (theme === 'fluent-next' && resolveValue(dv) === resolveValue(cv)) {
        kind = 'sameResolved';
      } else kind = 'different';
      rows.push({ name, kind, def: dv, comp: cv, resolvedDef: theme === 'fluent-next' ? resolveValue(dv) : undefined, line: d[name].line, compactLine: c[name].line });
    }
    for (const name of Object.keys(c)) if (!(name in d)) rows.push({ name, kind: 'compactOnly', comp: c[name].value, line: c[name].line });
    const both = rows.filter((r) => ['identical', 'identicalButDepends', 'sameResolved', 'different'].includes(r.kind));
    for (const r of rows) out.totals[r.kind]++;
    out.totals.both += both.length;
    const dupCount = both.filter((r) => r.kind === 'identical' || r.kind === 'sameResolved').length;
    if (both.length && dupCount === both.length) out.totals.allIdenticalFiles++;
    out.files.push({ file: path.relative(SCSS, p.file), rows, both: both.length, dup: dupCount });
  }
  report[theme] = out;
}
if (MD) {
  console.log('| Тема | Файлов с ветками | Переменных в обеих ветках | compact = default | то же выражение, зависит от размерной переменной | разное | только default | только compact |');
  console.log('|---|---|---|---|---|---|---|---|');
  for (const theme of THEMES) {
    const t = report[theme].totals;
    console.log(`| ${theme} | ${t.branchedFiles} | ${t.both} | **${t.identical}** | ${t.identicalButDepends} | ${t.different} | ${t.defaultOnly} | ${t.compactOnly} |`);
  }
  console.log('');
  console.log('| Файл | Переменная | Значение в обеих ветках | Разрешается в | Строки default / compact |');
  console.log('|---|---|---|---|---|');
  for (const theme of THEMES) for (const f of report[theme].files) for (const r of f.rows) {
    if (r.kind !== 'identical' && r.kind !== 'identicalButDepends') continue;
    const res = r.resolvedDef && r.resolvedDef !== r.def ? r.resolvedDef : (r.kind === 'identicalButDepends' ? 'зависит от размерной переменной' : '-');
    console.log(`| \`${f.file}\` | \`$${r.name}\` | \`${r.def}\` | ${res} | ${r.line} / ${r.compactLine} |`);
  }
} else {
  for (const theme of THEMES) {
    const t = report[theme].totals;
    console.log(`${theme.padEnd(12)} files:${String(t.branchedFiles).padStart(3)}  vars-in-both:${String(t.both).padStart(4)}  identical:${String(t.identical).padStart(3)}  identical-but-depends:${String(t.identicalButDepends).padStart(3)}  same-resolved:${String(t.sameResolved).padStart(3)}  different:${String(t.different).padStart(4)}  default-only:${String(t.defaultOnly).padStart(3)}  compact-only:${String(t.compactOnly).padStart(3)}`);
  }
  for (const theme of THEMES) for (const f of report[theme].files) for (const r of f.rows) {
    if (r.kind === 'identical' || r.kind === 'identicalButDepends') console.log(`  ${f.file}  $${r.name}  ${r.def}  [L${r.line}/${r.compactLine}]`);
  }
}
