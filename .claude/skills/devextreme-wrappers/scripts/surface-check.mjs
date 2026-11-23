#!/usr/bin/env node
// Compares the top-level option/event surface of a component's public .d.ts with its
// Angular, React and Vue wrappers. Nested option components are not checked.
//
// Usage (from the repo root):
//   node .claude/skills/devextreme-wrappers/scripts/surface-check.mjs button select-box
//   node .claude/skills/devextreme-wrappers/scripts/surface-check.mjs --all
//   node .claude/skills/devextreme-wrappers/scripts/surface-check.mjs --changed [<base-ref>]
// Exit code 1 when any component has a mismatch.

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const root = execSync('git rev-parse --show-toplevel').toString().trim();
const pkgs = path.join(root, 'packages');
const jsRoot = path.join(pkgs, 'devextreme/js');
// TypeScript from the checked-out repo; a fresh git worktree has no node_modules, so fall
// back to the checkout this script lives in.
const ts = (() => {
  for (const from of [path.join(pkgs, 'devextreme/package.json'), import.meta.url]) {
    try { return createRequire(from)('typescript'); } catch { /* try next */ }
  }
  throw new Error('typescript not found: run `pnpm install --frozen-lockfile`');
})();

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);
const vueSrc = path.join(pkgs, 'devextreme-vue/src');
const allComponents = fs.readdirSync(vueSrc)
  .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
  .map((f) => f.slice(0, -3));

// ---------- hidden overrides from `@name Iface.option` JSDoc blocks ----------
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '__internal' || e.name === 'node_modules') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(js|d\.ts)$/.test(e.name)) out.push(p);
  }
  return out;
}
// "dxTabsOptions.activeStateEnabled" -> hidden? Built from every `@name X.opt` / `@docid X.opt`
// block in public .js/.d.ts files. A block with an explicit `@hidden [true|false]` beats one
// without (which just documents the option as visible).
const hiddenByName = new Map();
const explicit = new Set();
for (const file of walk(jsRoot)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const block of text.match(/\/\*\*[\s\S]*?\*\//g) ?? []) {
    const name = block.match(/@(?:name|docid)\s+([\w$]+\.[\w$]+)\s/)?.[1];
    if (!name) continue;
    const hidden = block.match(/@hidden(\s+(true|false))?\b/);
    if (hidden) { hiddenByName.set(name, hidden[2] !== 'false'); explicit.add(name); }
    else if (!explicit.has(name)) hiddenByName.set(name, false);
  }
}

// ---------- d.ts surface via the TypeScript checker ----------
let program;
let classMap;
function classDecls() {
  if (classMap) return classMap;
  classMap = new Map();
  for (const sf of program.getSourceFiles()) {
    if (!sf.fileName.startsWith(jsRoot)) continue;
    for (const st of sf.statements) if (ts.isClassDeclaration(st) && st.name) classMap.set(st.name.text, st);
  }
  return classMap;
}
function dtsSurface(moduleSpec) {
  const file = path.join(jsRoot, `${moduleSpec.replace(/^devextreme\//, '')}.d.ts`);
  if (!fs.existsSync(file)) return { error: `no ${path.relative(root, file)}` };
  program ??= ts.createProgram(
    allComponents.map((c) => {
      const spec = vueModule(c);
      return spec && path.join(jsRoot, `${spec.replace(/^devextreme\//, '')}.d.ts`);
    }).filter((f) => f && fs.existsSync(f)),
    { noEmit: true, skipLibCheck: true, types: [], lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] },
  );
  const checker = program.getTypeChecker();
  const sf = program.getSourceFile(file);
  const modSym = checker.getSymbolAtLocation(sf);
  const propsSym = checker.getExportsOfModule(modSym).find((s) => s.name === 'Properties');
  if (!propsSym) return { error: 'no exported Properties' };
  const propsType = checker.getDeclaredTypeOfSymbol(
    propsSym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(propsSym) : propsSym,
  );

  // Interface chain, most derived first, walked syntactically (heritage clauses, aliases,
  // intersections, Omit/Pick/Partial). The documented name `dx<Widget>Options` goes first:
  // `@name` blocks use it even when `Properties` aliases a differently named base.
  const chain = [];
  const members = new Map(); // iface -> Map(option -> hidden)
  const resolve = (sym) => (sym && sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym);
  const inRepo = (d) => d.getSourceFile().fileName.startsWith(jsRoot);
  const isHidden = (node) => ts.getJSDocTags(node).some((t) => t.tagName.text === 'hidden'
    && String(t.comment ?? '').trim() !== 'false');
  const seen = new Set();
  const visitSym = (sym) => {
    sym = resolve(sym);
    if (!sym || seen.has(sym)) return;
    seen.add(sym);
    for (const d of sym.declarations ?? []) {
      if (!inRepo(d)) continue;
      if (ts.isInterfaceDeclaration(d)) {
        const name = d.name.text;
        if (!chain.includes(name)) chain.push(name);
        const m = members.get(name) ?? new Map();
        for (const mem of d.members) if (mem.name && ts.isIdentifier(mem.name)) m.set(mem.name.text, isHidden(mem));
        members.set(name, m);
        for (const h of d.heritageClauses ?? []) for (const t of h.types) {
          visitSym(checker.getSymbolAtLocation(t.expression));
          for (const a of t.typeArguments ?? []) visitNode(a);
        }
      } else if (ts.isTypeAliasDeclaration(d)) visitNode(d.type);
    }
  };
  const visitNode = (n) => {
    if (ts.isParenthesizedTypeNode(n)) return visitNode(n.type);
    if (ts.isIntersectionTypeNode(n) || ts.isUnionTypeNode(n)) return n.types.forEach(visitNode);
    if (ts.isTypeReferenceNode(n)) {
      const sym = resolve(checker.getSymbolAtLocation(n.typeName));
      if (sym?.declarations?.some(inRepo)) return visitSym(sym);
      if (['Omit', 'Pick', 'Partial', 'Required'].includes(n.typeName.getText()) && n.typeArguments?.[0]) {
        return visitNode(n.typeArguments[0]);
      }
    }
    return undefined;
  };
  visitSym(propsSym);
  const tsIfaces = chain.splice(0);

  // The documentation model decides visibility, level by level along the widget's class
  // chain (the class's `@inherits X` tag, else its `extends`): dxTabPanel > dxMultiView >
  // CollectionWidget > Widget > ... Level C holds the documented `COptions` name (used by
  // `@name` blocks) and the TS interfaces `COptions` / `CBaseOptions`. Interfaces that match
  // no class level (mixins) are checked last.
  const classes = classDecls();
  let decl = resolve(checker.getExportsOfModule(modSym).find((s) => s.name === 'default'))
    ?.declarations?.find((d) => ts.isClassDeclaration(d) && inRepo(d));
  const visitedClasses = new Set();
  while (decl?.name && !visitedClasses.has(decl.name.text)) {
    const c = decl.name.text;
    visitedClasses.add(c);
    chain.push(`${c}Options`);
    for (const i of tsIfaces) if (i !== `${c}Options` && i.replace(/(Base)?Options$/, '') === c) chain.push(i);
    const inherits = ts.getJSDocTags(decl).find((t) => t.tagName.text === 'inherits');
    const parent = String(inherits?.comment ?? '').split(',')[0].trim();
    const ext = decl.heritageClauses?.find((h) => h.token === ts.SyntaxKind.ExtendsKeyword)?.types[0];
    decl = (parent && classes.get(parent))
      ?? (ext && resolve(checker.getSymbolAtLocation(ext.expression))?.declarations?.find(ts.isClassDeclaration));
  }
  for (const i of tsIfaces) if (!chain.includes(i)) chain.push(i);

  const visible = new Set();
  const templates = new Set();
  for (const prop of checker.getPropertiesOfType(propsType)) {
    let hidden = false;
    for (const iface of chain) {
      const v = hiddenByName.get(`${iface}.${prop.name}`) ?? members.get(iface)?.get(prop.name);
      if (v !== undefined) { hidden = v; break; }
    }
    if (hidden) continue;
    visible.add(prop.name);
    const typeText = prop.declarations?.[0]?.type?.getText() ?? '';
    if ((prop.name === 'template' || prop.name.endsWith('Template')) && /\btemplate\b/.test(typeText)) {
      templates.add(prop.name);
    }
  }
  if (process.env.DEBUG_CHAIN) console.log(moduleSpec, chain.join(' > '));
  return { visible, templates, chain };
}

// ---------- wrapper parsers ----------
function vueModule(name) {
  const src = read(path.join(vueSrc, `${name}.ts`));
  return src?.match(/import\s+\w+\s*,\s*\{\s*Properties\s*\}\s*from\s*"([^"]+)"/)?.[1];
}

function block(src, startRe) {
  const m = startRe.exec(src);
  if (!m) return '';
  let i = src.indexOf('{', m.index + m[0].length - 1);
  let depth = 0;
  const start = i;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) break;
  }
  return src.slice(start + 1, i);
}
const topKeys = (body) => {
  const keys = [];
  let depth = 0;
  for (const line of body.split('\n')) {
    if (depth === 0) {
      const k = line.match(/^\s*"?([\w:$]+)"?\s*:/);
      if (k) keys.push(k[1]);
    }
    for (const ch of line) { if ('{[('.includes(ch)) depth++; else if ('}])'.includes(ch)) depth--; }
  }
  return keys;
};

function vueSurface(name) {
  const src = read(path.join(vueSrc, `${name}.ts`));
  const cfg = src.slice(src.indexOf('const componentConfig'));
  const pick = src.match(/type AccessibleOptions = Pick<Properties,([\s\S]*?)>;/)?.[1] ?? '';
  return {
    accessible: new Set([...pick.matchAll(/"(\w+)"/g)].map((m) => m[1])),
    props: new Set(topKeys(block(cfg, /props:\s*\{/))),
    emits: new Set(topKeys(block(cfg, /emits:\s*\{/)).map((k) => k.replace(/^update:/, ''))
      .filter((k) => k !== 'isActive' && k !== 'hoveredElement')),
  };
}

function angularSurface(name) {
  const dir = path.join(pkgs, 'devextreme-angular/src/ui', name);
  // popup keeps the component in component.ts (index.ts re-exports it plus the service)
  const src = read(path.join(dir, 'component.ts')) ?? read(path.join(dir, 'index.ts'));
  if (!src) return null;
  const cls = src.slice(0, src.indexOf('@NgModule'));
  // EDITOR components (have onValueChanged) get an extra `onBlur` output for forms
  const outputs = [...cls.matchAll(/@Output\(\)\s+(\w+)/g)].map((m) => m[1]).filter((o) => o !== 'onBlur');
  const emitterText = cls.match(/_createEventEmitters\(\[([\s\S]*?)\]\);/)?.[1] ?? '';
  const events = outputs.filter((o) => /^on[A-Z]/.test(o));
  return {
    inputs: new Set([...cls.matchAll(/@Input\(\)\s*\n\s*get\s+(\w+)/g)].map((m) => m[1])),
    events: new Set(events),
    changes: new Set(outputs.filter((o) => !events.includes(o) && o.endsWith('Change')).map((o) => o.slice(0, -6))),
    emitOnly: new Set([...emitterText.matchAll(/\{\s*emit:\s*'(\w+)Change'\s*\}/g)].map((m) => m[1])),
    subscribed: new Set([...emitterText.matchAll(/subscribe:\s*'\w+',\s*emit:\s*'(\w+)'/g)].map((m) => m[1])),
    hasOnBlur: /@Output\(\)\s+onBlur\b/.test(cls),
  };
}

function reactSurface(name) {
  const src = read(path.join(pkgs, 'devextreme-react/src', `${name}.ts`));
  if (!src) return null;
  // only the main component (the memo(forwardRef(...)) block), not nested config components
  const main = src.slice(src.indexOf('forwardRef('), src.indexOf('React.createElement(BaseComponent'));
  const ind = main.match(/const independentEvents = useMemo\(\(\) => \(\[([^\]]*)\]/)?.[1] ?? '';
  const tpl = main.match(/const templateProps = useMemo\(\(\) => \(\[([\s\S]*?)\]\), \[\]\)/)?.[1] ?? '';
  return {
    independent: new Set([...ind.matchAll(/"(\w+)"/g)].map((m) => m[1])),
    templates: new Set([...tpl.matchAll(/tmplOption:\s*"(\w+)"/g)].map((m) => m[1])),
  };
}

// ---------- comparison ----------
const diff = (a, b) => [...a].filter((x) => !b.has(x)).sort();
const isEvent = (n) => /^on[A-Z]/.test(n);
const isIndependent = (n) => !(n.includes('Changed') && !n.includes('Value'));
const isTemplate = (n) => n === 'template' || n.endsWith('Template');

function check(name) {
  const problems = [];
  const add = (where, what, list) => list.length && problems.push(`${where}: ${what}: ${list.join(', ')}`);
  const spec = vueModule(name);
  if (!spec) return [`vue: cannot find Properties import in devextreme-vue/src/${name}.ts`];

  const vue = vueSurface(name);
  add('vue', 'in AccessibleOptions but not in props', diff(vue.accessible, vue.props));
  add('vue', 'in props but not in AccessibleOptions', diff(vue.props, vue.accessible));
  add('vue', 'in props but no "update:" emit', diff(vue.props, vue.emits));
  add('vue', '"update:" emit without a prop', diff(vue.emits, vue.props));

  const dts = dtsSurface(spec);
  if (dts.error) problems.push(`d.ts: ${dts.error}`);
  else {
    add('d.ts→wrappers', 'visible in d.ts, missing from Vue AccessibleOptions', diff(dts.visible, vue.accessible));
    add('d.ts→wrappers', 'in Vue AccessibleOptions, hidden or absent in d.ts', diff(vue.accessible, dts.visible));
  }

  const ng = angularSurface(name);
  if (!ng) problems.push(`angular: no devextreme-angular/src/ui/${name}/index.ts`);
  else {
    const ngAll = new Set([...ng.inputs, ...ng.events]);
    add('angular', 'missing vs Vue', diff(vue.accessible, ngAll));
    add('angular', 'extra vs Vue', diff(ngAll, vue.accessible));
    add('angular', '@Input without <opt>Change output', diff(ng.inputs, ng.changes));
    add('angular', '<opt>Change output without @Input', diff(ng.changes, ng.inputs));
    add('angular', '@Input without { emit: \'<opt>Change\' } entry', diff(ng.inputs, ng.emitOnly));
    add('angular', 'event output without { subscribe, emit } entry', diff(ng.events, ng.subscribed));
    const editor = vue.accessible.has('onValueChanged');
    if (editor !== ng.hasOnBlur) {
      problems.push(`angular: ${editor ? 'EDITOR (has onValueChanged) but no' : 'not an EDITOR but has an'} onBlur output`);
    }
  }

  const react = reactSurface(name);
  if (!react) problems.push(`react: no devextreme-react/src/${name}.ts`);
  else {
    const expectedInd = new Set([...vue.accessible].filter((n) => isEvent(n) && isIndependent(n)));
    add('react', 'independentEvents missing', diff(expectedInd, react.independent));
    add('react', 'independentEvents extra', diff(react.independent, expectedInd));
    // template options: named `template`/`…Template` AND typed with `template` (README §5)
    const expectedTpl = dts.templates ?? new Set([...vue.accessible].filter(isTemplate));
    add('react', 'templateProps missing', diff(expectedTpl, react.templates));
    add('react', 'templateProps extra', diff(react.templates, expectedTpl));
  }
  return problems;
}

// ---------- CLI ----------
const args = process.argv.slice(2);
let names;
if (args[0] === '--all') names = allComponents;
else if (args[0] === '--changed') {
  const git = (cmd) => execSync(`git ${cmd}`, { cwd: root, maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] })
    .toString().trim();
  // default base: the branch's upstream; without one, only uncommitted changes are checked
  let base = args[1];
  if (!base) {
    try { git('rev-parse --verify -q "@{upstream}"'); base = '@{upstream}'; } catch {
      base = 'HEAD';
      console.log('No upstream branch: checking uncommitted changes only (pass a base ref to compare a branch).');
    }
  }
  const paths = "'packages/devextreme/js' 'packages/devextreme-angular/src' 'packages/devextreme-react/src' 'packages/devextreme-vue/src'";
  const changed = [
    ...git(`diff --name-only "${base}"...HEAD -- ${paths}`).split('\n'),
    ...git(`diff --name-only HEAD -- ${paths}`).split('\n'),
  ].filter(Boolean);
  console.log(`Changes since ${base}: ${changed.length} file(s) under devextreme/js and wrapper src.`);
  const set = new Set();
  const shared = [];
  for (const f of changed) {
    let m;
    if ((m = f.match(/^packages\/devextreme-(?:react|vue)\/src\/([\w-]+)\.ts$/))) set.add(m[1]);
    if ((m = f.match(/^packages\/devextreme-angular\/src\/ui\/([\w-]+)\//))) set.add(m[1]);
    if ((m = f.match(/^packages\/devextreme\/js\/((?:ui|viz)\/[^/]+?)(?:_types)?\.(?:d\.ts|js)$/))) {
      let hit = false;
      for (const c of allComponents) if (vueModule(c) === `devextreme/${m[1]}`) { set.add(c); hit = true; }
      if (!hit) shared.push(f);
    } else if (/^packages\/devextreme\/js\/(?!__internal\/).+\.(d\.ts|js)$/.test(f)) shared.push(f);
  }
  if (shared.length) {
    const list = shared.slice(0, 10).join('\n  ') + (shared.length > 10 ? `\n  … and ${shared.length - 10} more` : '');
    console.log(`Shared/base public files changed — run with --all to see every inheriting widget:\n  ${list}`);
  }
  names = [...set].filter((n) => allComponents.includes(n));
  if (!names.length) { console.log('No wrapped component touched directly.'); process.exit(0); }
} else names = args;

if (!names.length && args[0] !== '--changed') {
  console.error('Usage: surface-check.mjs <component...> | --all | --changed [<base-ref>]');
  process.exit(2);
}

let failed = 0;
for (const n of names) {
  if (!allComponents.includes(n)) { console.log(`✗ ${n}: unknown component (use the wrapper file name, e.g. select-box)`); failed++; continue; }
  const problems = check(n);
  if (problems.length) {
    failed++;
    console.log(`✗ ${n}`);
    for (const p of problems) console.log(`    ${p}`);
  } else if (names.length <= 10) console.log(`✓ ${n}`);
}
console.log(`\n${names.length - failed}/${names.length} components consistent.`);
process.exit(failed ? 1 : 0);
