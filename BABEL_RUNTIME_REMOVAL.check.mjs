#!/usr/bin/env node
// Compares two snapshots of devextreme transpile outputs (before / after removing
// @babel/plugin-transform-runtime + @babel/runtime) and checks the acceptance criteria
// described in BABEL_RUNTIME_REMOVAL.md.
//
// Snapshot layout (what `pnpm nx build:transpile devextreme` + `build:npm:root-package-json` produce):
//   <snap>/transpiled/                  CJS (artifacts/transpiled)
//   <snap>/transpiled-renovation-npm/   CJS, production (input of dx.all.js & other bundles)
//   <snap>/transpiled-esm-npm/          npm package sources: esm/, cjs/, bundles/, dual-mode package.json files
//   <snap>/npm-package.json             artifacts/npm/devextreme/package.json
//
// Usage: node BABEL_RUNTIME_REMOVAL.check.mjs <beforeSnap> <afterSnap> [runtimeHelpersEsmDir]
// Exit code 0 = all criteria pass.

import fs from 'node:fs';
import path from 'node:path';
import { builtinModules } from 'node:module';

const [beforeDir, afterDir, runtimeHelpersDirArg] = process.argv.slice(2);
if (!beforeDir || !afterDir) {
  console.error('Usage: node BABEL_RUNTIME_REMOVAL.check.mjs <beforeSnap> <afterSnap> [runtimeHelpersEsmDir]');
  process.exit(2);
}

const TREES = ['transpiled', 'transpiled-renovation-npm', 'transpiled-esm-npm'];
const ESM_PREFIX = 'transpiled-esm-npm/esm/';
const RUNTIME_IMPORT_RE = /^import (\w+) from "@babel\/runtime\/helpers\/esm\/(\w+)";$/;

const results = [];
const check = (id, title, ok, details = []) => results.push({ id, title, ok, details });

function walk(root, rel = '') {
  const out = [];
  for (const entry of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
    const p = rel ? `${rel}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out.push(...walk(root, p));
    else out.push(p);
  }
  return out;
}

function listFiles(snap) {
  return TREES.flatMap((t) => walk(snap, t)).sort();
}

const read = (snap, rel) => fs.readFileSync(path.join(snap, rel), 'utf8');
const stripWs = (s) => s.replace(/\s+/g, '');

// ---------- C1: same file set ----------
const beforeFiles = listFiles(beforeDir);
const afterFiles = listFiles(afterDir);
const beforeSet = new Set(beforeFiles);
const afterSet = new Set(afterFiles);
const onlyBefore = beforeFiles.filter((f) => !afterSet.has(f));
const onlyAfter = afterFiles.filter((f) => !beforeSet.has(f));
check('C1', `Same file set (${beforeFiles.length} files)`, !onlyBefore.length && !onlyAfter.length,
  [...onlyBefore.map((f) => `only before: ${f}`), ...onlyAfter.map((f) => `only after: ${f}`)]);

const common = beforeFiles.filter((f) => afterSet.has(f));

// ---------- C2: everything outside esm/ is byte-identical ----------
const nonEsmDiffs = common
  .filter((f) => !f.startsWith(ESM_PREFIX))
  .filter((f) => !fs.readFileSync(path.join(beforeDir, f)).equals(fs.readFileSync(path.join(afterDir, f))));
check('C2', `Non-ESM output byte-identical (CJS, production CJS, npm cjs/, bundles/, dual-mode manifests: ${common.filter((f) => !f.startsWith(ESM_PREFIX)).length} files)`,
  nonEsmDiffs.length === 0, nonEsmDiffs.map((f) => `differs: ${f}`));

// ---------- C3/C4: ESM differs only by "runtime import" -> "inlined helper" ----------
const esmFiles = common.filter((f) => f.startsWith(ESM_PREFIX));
const c3Problems = [];
const helperTexts = new Map(); // helper name -> Set(text)
let affected = 0;
let identical = 0;
let bytesBefore = 0;
let bytesAfter = 0;

for (const f of esmFiles) {
  const b = read(beforeDir, f);
  const a = read(afterDir, f);
  bytesBefore += Buffer.byteLength(b);
  bytesAfter += Buffer.byteLength(a);

  const bLines = b.split('\n');
  const imports = bLines.map((l) => l.match(RUNTIME_IMPORT_RE)).filter(Boolean);
  if (!imports.length) {
    if (a === b) identical += 1;
    else c3Problems.push(`no runtime import before, but file changed: ${f}`);
    continue;
  }
  affected += 1;

  const bRest = bLines.filter((l) => !RUNTIME_IMPORT_RE.test(l));
  let aLines = a.split('\n');
  for (const [, local, helper] of imports) {
    const idx = aLines.findIndex((l) => l.startsWith(`function ${local}(`));
    if (idx === -1) {
      c3Problems.push(`helper ${local} not inlined in: ${f}`);
      continue;
    }
    const text = aLines[idx];
    if (!helperTexts.has(helper)) helperTexts.set(helper, new Set());
    helperTexts.get(helper).add(text);

    // The CJS build of the same module (same tree) already inlines this helper: must be the same text.
    const cjsRel = f.replace(ESM_PREFIX, 'transpiled-esm-npm/cjs/');
    if (afterSet.has(cjsRel) && !read(afterDir, cjsRel).split('\n').includes(text)) {
      c3Problems.push(`inlined ${local} differs from the CJS build of the same module: ${f}`);
    }
    aLines = aLines.filter((_, i) => i !== idx);
  }
  if (aLines.join('\n') !== bRest.join('\n')) {
    c3Problems.push(`differs beyond import->helper swap: ${f}`);
  }
}
check('C3', `ESM: ${identical} files byte-identical, ${affected} files differ only by "import helper from @babel/runtime" -> inlined helper (same text as in their CJS build)`,
  c3Problems.length === 0, c3Problems);

const c4Details = [];
let c4Ok = true;
const runtimeHelpersDir = runtimeHelpersDirArg;
for (const [helper, texts] of helperTexts) {
  if (texts.size !== 1) {
    c4Ok = false;
    c4Details.push(`${helper}: ${texts.size} different inlined variants`);
  }
  const [text] = texts;
  c4Details.push(`${helper}: ${text}`);
  if (runtimeHelpersDir) {
    const runtimeSrc = fs.readFileSync(path.join(runtimeHelpersDir, `${helper}.js`), 'utf8')
      .replace(/export \{ \w+ as default \};?/, '');
    const same = stripWs(runtimeSrc) === stripWs(text);
    if (!same) c4Ok = false;
    c4Details.push(`${helper}: ${same ? 'equal' : 'NOT equal'} (whitespace-insensitive) to ${path.join(runtimeHelpersDir, `${helper}.js`)}`);
  }
}
check('C4', `Inlined helpers: one variant per helper${runtimeHelpersDir ? ', identical to the @babel/runtime helper consumers get today' : ''}`,
  c4Ok && helperTexts.size > 0, c4Details);

// ---------- C5: no @babel/runtime anywhere in "after" ----------
const leftovers = afterFiles.filter((f) => read(afterDir, f).includes('@babel/runtime'));
const npmAfterRaw = fs.readFileSync(path.join(afterDir, 'npm-package.json'), 'utf8');
if (npmAfterRaw.includes('@babel/runtime')) leftovers.push('npm-package.json');
check('C5', 'No "@babel/runtime" string left in any output file or the published package.json', leftovers.length === 0,
  leftovers.map((f) => `still references @babel/runtime: ${f}`));

// ---------- C6: published package.json differs only by the removed dependency ----------
const npmBefore = JSON.parse(fs.readFileSync(path.join(beforeDir, 'npm-package.json'), 'utf8'));
const npmAfter = JSON.parse(npmAfterRaw);
const expected = structuredClone(npmBefore);
delete expected.dependencies['@babel/runtime'];
const c6Ok = JSON.stringify(expected) === JSON.stringify(npmAfter);
check('C6', 'Published package.json: only "dependencies.@babel/runtime" removed', c6Ok,
  c6Ok ? [] : ['package.json differs beyond the removed dependency']);

// ---------- C7: bare-specifier closure of the published sources ----------
const SPEC_RES = [
  /(?:^|[\s;}])import\s+(?:[\w$*{}\s,]+\s+from\s+)?["']([^"'./][^"']*)["']/g,
  /(?:^|[\s;}])export\s+[\w$*{}\s,]+\s+from\s+["']([^"'./][^"']*)["']/g,
  /\brequire\(\s*["']([^"'./][^"']*)["']\s*\)/g,
  /(?<![.\w$])import\(\s*["']([^"'./][^"']*)["']\s*\)/g, // not `Quill.import('formats/…')`
];
const builtins = new Set(builtinModules.flatMap((m) => [m, `node:${m}`]));
const pkgName = (spec) => (spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0]);

function usedPackages(snap, files) {
  const used = new Map(); // pkg -> count of files
  for (const f of files) {
    if (!f.endsWith('.js') || !(f.startsWith(ESM_PREFIX) || f.startsWith('transpiled-esm-npm/cjs/'))) continue;
    const src = read(snap, f);
    const pkgs = new Set();
    for (const re of SPEC_RES) for (const m of src.matchAll(re)) pkgs.add(pkgName(m[1]));
    for (const p of pkgs) if (!builtins.has(p)) used.set(p, (used.get(p) ?? 0) + 1);
  }
  return used;
}
const declared = (pkg) => new Set([...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})]);
const usedBefore = usedPackages(beforeDir, beforeFiles);
const usedAfter = usedPackages(afterDir, afterFiles);
const undeclaredBefore = [...usedBefore.keys()].filter((p) => !declared(npmBefore).has(p)).sort();
const undeclaredAfter = [...usedAfter.keys()].filter((p) => !declared(npmAfter).has(p)).sort();
const expectedUsed = [...usedBefore.keys()].filter((p) => p !== '@babel/runtime').sort();
const c7Ok = JSON.stringify([...usedAfter.keys()].sort()) === JSON.stringify(expectedUsed)
  && JSON.stringify(undeclaredAfter) === JSON.stringify(undeclaredBefore);
check('C7', 'Imported packages (esm/ + cjs/): same set minus @babel/runtime; no new undeclared imports', c7Ok, [
  `used before: ${[...usedBefore].map(([p, n]) => `${p}(${n})`).sort().join(', ')}`,
  `used after:  ${[...usedAfter].map(([p, n]) => `${p}(${n})`).sort().join(', ')}`,
  `not in dependencies/peerDependencies (before): ${undeclaredBefore.join(', ') || '-'}`,
  `not in dependencies/peerDependencies (after):  ${undeclaredAfter.join(', ') || '-'}`,
]);

// ---------- report ----------
for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.id} ${r.title}`);
  for (const d of r.details.slice(0, 25)) console.log(`       ${d}`);
  if (r.details.length > 25) console.log(`       ... ${r.details.length - 25} more`);
}
console.log(`INFO ESM size: ${bytesBefore} -> ${bytesAfter} bytes (${bytesAfter - bytesBefore >= 0 ? '+' : ''}${bytesAfter - bytesBefore}) over ${affected} affected files`);
process.exit(results.every((r) => r.ok) ? 0 : 1);
