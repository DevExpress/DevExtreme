#!/usr/bin/env node
// Compares the top-level option/event surface of a component's public .d.ts with its
// Angular, React and Vue wrappers. Nested option components are not checked.
//
// Usage (from the repo root; Node 24 runs .mts directly):
//   node .claude/skills/devextreme-wrappers/scripts/surface-check.mts button select-box
//   node .claude/skills/devextreme-wrappers/scripts/surface-check.mts --all
//   node .claude/skills/devextreme-wrappers/scripts/surface-check.mts --changed [<base-ref>]
// Exit code 1 when any component has a mismatch.

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import type * as TS from 'typescript';

interface DtsSurface { visible: Set<string>; templates: Set<string>; chain: string[] }
type DtsResult = DtsSurface | { error: string };
interface VueSurface { accessible: Set<string>; props: Set<string>; emits: Set<string> }
interface AngularSurface {
  inputs: Set<string>;
  events: Set<string>;
  changes: Set<string>;
  emitOnly: Set<string>;
  subscribed: Set<string>;
  hasOnBlur: boolean;
}
interface ReactSurface { independent: Set<string>; templates: Set<string> }

const root = execFileSync('git', ['rev-parse', '--show-toplevel']).toString().trim();
const pkgs = path.join(root, 'packages');
const jsRoot = path.join(pkgs, 'devextreme/js');
// TypeScript from the checked-out repo; a fresh git worktree has no node_modules, so fall
// back to the checkout this script lives in.
const ts = ((): typeof TS => {
  for (const from of [path.join(pkgs, 'devextreme/package.json'), import.meta.url]) {
    try { return createRequire(from)('typescript') as typeof TS; } catch { /* try next */ }
  }
  throw new Error('typescript not found: run `pnpm install --frozen-lockfile`');
})();

const read = (p: string): string | null => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null);
const vueSrc = path.join(pkgs, 'devextreme-vue/src');
const reactSrc = path.join(pkgs, 'devextreme-react/src');
const angularUi = path.join(pkgs, 'devextreme-angular/src/ui');
const tsFiles = (dir: string): string[] => fs.readdirSync(dir)
  .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
  .map((f) => f.slice(0, -3));
const allComponents = [...new Set([
  ...tsFiles(vueSrc),
  ...tsFiles(reactSrc),
  ...fs.readdirSync(angularUi, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name !== 'nested')
    .map((e) => e.name),
])].sort();

// ---------- hidden overrides from `@name Iface.option` JSDoc blocks ----------
function walk(dir: string, out: string[] = []): string[] {
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
const hiddenByName = new Map<string, boolean>();
const explicit = new Set<string>();
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
let program: TS.Program | undefined;
let classMap: Map<string, TS.ClassDeclaration> | undefined;
function classDecls(prog: TS.Program): Map<string, TS.ClassDeclaration> {
  if (classMap) return classMap;
  classMap = new Map();
  for (const sf of prog.getSourceFiles()) {
    if (!sf.fileName.startsWith(jsRoot)) continue;
    for (const st of sf.statements) if (ts.isClassDeclaration(st) && st.name) classMap.set(st.name.text, st);
  }
  return classMap;
}
const dtsFile = (moduleSpec: string): string => path.join(jsRoot, `${moduleSpec.replace(/^devextreme\//, '')}.d.ts`);

function dtsSurface(moduleSpec: string): DtsResult {
  const file = dtsFile(moduleSpec);
  if (!fs.existsSync(file)) return { error: `no ${path.relative(root, file)}` };
  program ??= ts.createProgram(
    allComponents
      .map((c) => vueModule(c))
      .filter((spec): spec is string => !!spec)
      .map(dtsFile)
      .filter((f) => fs.existsSync(f)),
    { noEmit: true, skipLibCheck: true, types: [], lib: ['lib.es2020.d.ts', 'lib.dom.d.ts'] },
  );
  const checker = program.getTypeChecker();
  const sf = program.getSourceFile(file);
  const modSym = sf && checker.getSymbolAtLocation(sf);
  if (!modSym) return { error: `cannot load ${path.relative(root, file)}` };
  const exports = checker.getExportsOfModule(modSym);
  const propsSym = exports.find((s) => s.name === 'Properties');
  if (!propsSym) return { error: 'no exported Properties' };
  const propsType = checker.getDeclaredTypeOfSymbol(
    propsSym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(propsSym) : propsSym,
  );

  // Interface chain, most derived first, walked syntactically (heritage clauses, aliases,
  // intersections, Omit/Pick/Partial). The documented name `dx<Widget>Options` goes first:
  // `@name` blocks use it even when `Properties` aliases a differently named base.
  const chain: string[] = [];
  const members = new Map<string, Map<string, boolean>>(); // iface -> option -> hidden
  const resolve = (sym: TS.Symbol | undefined): TS.Symbol | undefined => (
    sym && sym.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(sym) : sym
  );
  const inRepo = (d: TS.Node): boolean => d.getSourceFile().fileName.startsWith(jsRoot);
  const isHidden = (node: TS.Node): boolean => ts.getJSDocTags(node).some((t) => t.tagName.text === 'hidden'
    && String(t.comment ?? '').trim() !== 'false');
  const seen = new Set<TS.Symbol>();
  const addMembers = (name: string, list: readonly TS.TypeElement[]): void => {
    const m = members.get(name) ?? new Map<string, boolean>();
    for (const mem of list) if (mem.name && ts.isIdentifier(mem.name)) m.set(mem.name.text, isHidden(mem));
    members.set(name, m);
  };
  const ownLiterals = (n: TS.TypeNode): TS.TypeLiteralNode[] => {
    if (ts.isParenthesizedTypeNode(n)) return ownLiterals(n.type);
    if (ts.isIntersectionTypeNode(n)) return n.types.flatMap(ownLiterals);
    return ts.isTypeLiteralNode(n) ? [n] : [];
  };
  const visitSym = (s: TS.Symbol | undefined): void => {
    const sym = resolve(s);
    if (!sym || seen.has(sym)) return;
    seen.add(sym);
    for (const d of sym.declarations ?? []) {
      if (!inRepo(d)) continue;
      if (ts.isInterfaceDeclaration(d)) {
        const name = d.name.text;
        if (!chain.includes(name)) chain.push(name);
        addMembers(name, d.members);
        for (const h of d.heritageClauses ?? []) {
          for (const t of h.types) {
            visitSym(checker.getSymbolAtLocation(t.expression));
            for (const a of t.typeArguments ?? []) visitNode(a);
          }
        }
      } else if (ts.isTypeAliasDeclaration(d)) {
        const literals = ownLiterals(d.type);
        if (literals.length) {
          const name = d.name.text;
          if (!chain.includes(name)) chain.push(name);
          addMembers(name, literals.flatMap((l) => [...l.members]));
        }
        visitNode(d.type);
      }
    }
  };
  const visitNode = (n: TS.TypeNode): void => {
    if (ts.isParenthesizedTypeNode(n)) { visitNode(n.type); return; }
    if (ts.isIntersectionTypeNode(n) || ts.isUnionTypeNode(n)) { n.types.forEach(visitNode); return; }
    if (ts.isTypeReferenceNode(n)) {
      const sym = resolve(checker.getSymbolAtLocation(n.typeName));
      if (sym?.declarations?.some(inRepo)) { visitSym(sym); return; }
      const first = n.typeArguments?.[0];
      if (['Omit', 'Pick', 'Partial', 'Required'].includes(n.typeName.getText()) && first) visitNode(first);
    }
  };
  visitSym(propsSym);
  const tsIfaces = chain.splice(0);

  // The documentation model decides visibility, level by level along the widget's class
  // chain (the class's `@inherits X` tag, else its `extends`): dxTabPanel > dxMultiView >
  // CollectionWidget > Widget > ... Level C holds the documented `COptions` name (used by
  // `@name` blocks) and the TS interfaces `COptions` / `CBaseOptions`. Interfaces that match
  // no class level (mixins) are checked last.
  const classes = classDecls(program);
  const isClass = (d: TS.Declaration): d is TS.ClassDeclaration => ts.isClassDeclaration(d);
  let decl = resolve(exports.find((s) => s.name === 'default'))
    ?.declarations?.find((d): d is TS.ClassDeclaration => isClass(d) && inRepo(d));
  const visitedClasses = new Set<string>();
  while (decl?.name && !visitedClasses.has(decl.name.text)) {
    const c = decl.name.text;
    visitedClasses.add(c);
    chain.push(`${c}Options`);
    for (const i of tsIfaces) if (i !== `${c}Options` && i.replace(/(Base)?Options$/, '') === c) chain.push(i);
    const inherits = ts.getJSDocTags(decl).find((t) => t.tagName.text === 'inherits');
    const parent = String(inherits?.comment ?? '').split(',')[0].trim();
    const ext = decl.heritageClauses?.find((h) => h.token === ts.SyntaxKind.ExtendsKeyword)?.types[0];
    decl = (parent ? classes.get(parent) : undefined)
      ?? (ext ? resolve(checker.getSymbolAtLocation(ext.expression))?.declarations?.find(isClass) : undefined);
  }
  // An unplaced name goes right before the first base it derives from (the next already
  // placed name in walk order), so it keeps precedence over what it inherits.
  tsIfaces.forEach((i, idx) => {
    if (chain.includes(i)) return;
    const next = tsIfaces.slice(idx + 1).find((x) => chain.includes(x));
    chain.splice(next ? chain.indexOf(next) : chain.length, 0, i);
  });

  const visible = new Set<string>();
  const templates = new Set<string>();
  for (const prop of checker.getPropertiesOfType(propsType)) {
    let hidden = false;
    for (const iface of chain) {
      const key = `${iface}.${prop.name}`;
      const v = explicit.has(key)
        ? hiddenByName.get(key)
        : members.get(iface)?.get(prop.name) ?? hiddenByName.get(key);
      if (v !== undefined) { hidden = v; break; }
    }
    if (hidden) continue;
    visible.add(prop.name);
    const d = prop.declarations?.[0];
    const typeText = (d && ts.isPropertySignature(d) && d.type?.getText()) || '';
    if ((prop.name === 'template' || prop.name.endsWith('Template')) && /\btemplate\b/.test(typeText)) {
      templates.add(prop.name);
    }
  }
  if (process.env.DEBUG_CHAIN) console.log(moduleSpec, chain.join(' > '));
  return { visible, templates, chain };
}

// ---------- wrapper parsers ----------
function vueModule(name: string): string | undefined {
  const src = read(path.join(vueSrc, `${name}.ts`));
  return src?.match(/import\s+\w+\s*,\s*\{\s*Properties\s*\}\s*from\s*"([^"]+)"/)?.[1];
}

function block(src: string, startRe: RegExp): string {
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
const topKeys = (body: string): string[] => {
  const keys: string[] = [];
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
const quoted = (text: string, re: RegExp): Set<string> => new Set([...text.matchAll(re)].map((m) => m[1]));

function vueSurface(src: string): VueSurface {
  const cfg = src.slice(src.indexOf('const componentConfig'));
  const pick = src.match(/type AccessibleOptions = Pick<Properties,([\s\S]*?)>;/)?.[1] ?? '';
  return {
    accessible: quoted(pick, /"(\w+)"/g),
    props: new Set(topKeys(block(cfg, /props:\s*\{/))),
    emits: new Set(topKeys(block(cfg, /emits:\s*\{/)).map((k) => k.replace(/^update:/, ''))
      .filter((k) => k !== 'isActive' && k !== 'hoveredElement')),
  };
}

function angularSurface(name: string): AngularSurface | null {
  const dir = path.join(angularUi, name);
  // popup keeps the component in component.ts (index.ts re-exports it plus the service)
  const src = read(path.join(dir, 'component.ts')) ?? read(path.join(dir, 'index.ts'));
  if (!src) return null;
  const cls = src.slice(0, src.indexOf('@NgModule'));
  // EDITOR components (have onValueChanged) get an extra `onBlur` output for forms
  const outputs = [...cls.matchAll(/@Output\(\)\s+(\w+)/g)].map((m) => m[1]).filter((o) => o !== 'onBlur');
  const emitterText = cls.match(/_createEventEmitters\(\[([\s\S]*?)\]\);/)?.[1] ?? '';
  const events = outputs.filter((o) => /^on[A-Z]/.test(o));
  return {
    inputs: quoted(cls, /@Input\(\)\s*\n\s*get\s+(\w+)/g),
    events: new Set(events),
    changes: new Set(outputs.filter((o) => !events.includes(o) && o.endsWith('Change')).map((o) => o.slice(0, -6))),
    emitOnly: quoted(emitterText, /\{\s*emit:\s*'(\w+)Change'\s*\}/g),
    subscribed: quoted(emitterText, /subscribe:\s*'\w+',\s*emit:\s*'(\w+)'/g),
    hasOnBlur: /@Output\(\)\s+onBlur\b/.test(cls),
  };
}

function reactSurface(name: string): ReactSurface | null {
  const src = read(path.join(reactSrc, `${name}.ts`));
  if (!src) return null;
  // only the main component (the memo(forwardRef(...)) block), not nested config components
  const main = src.slice(src.indexOf('forwardRef('), src.indexOf('React.createElement(BaseComponent'));
  const ind = main.match(/const independentEvents = useMemo\(\(\) => \(\[([^\]]*)\]/)?.[1] ?? '';
  const tpl = main.match(/const templateProps = useMemo\(\(\) => \(\[([\s\S]*?)\]\), \[\]\)/)?.[1] ?? '';
  return {
    independent: quoted(ind, /"(\w+)"/g),
    templates: quoted(tpl, /tmplOption:\s*"(\w+)"/g),
  };
}

// ---------- comparison ----------
const diff = (a: Set<string>, b: Set<string>): string[] => [...a].filter((x) => !b.has(x)).sort();
const isEvent = (n: string): boolean => /^on[A-Z]/.test(n);
const isIndependent = (n: string): boolean => !(n.includes('Changed') && !n.includes('Value'));
const isTemplate = (n: string): boolean => n === 'template' || n.endsWith('Template');

function check(name: string): string[] {
  const problems: string[] = [];
  const add = (where: string, what: string, list: string[]): void => {
    if (list.length) problems.push(`${where}: ${what}: ${list.join(', ')}`);
  };
  const vueSrcText = read(path.join(vueSrc, `${name}.ts`));
  if (vueSrcText === null) {
    const has = [
      fs.existsSync(path.join(angularUi, name)) && 'angular',
      fs.existsSync(path.join(reactSrc, `${name}.ts`)) && 'react',
    ].filter(Boolean);
    return [`vue: no devextreme-vue/src/${name}.ts (wrapper exists in: ${has.join(', ') || 'none'})`];
  }
  const spec = vueModule(name);
  if (!spec) return [`vue: cannot find Properties import in devextreme-vue/src/${name}.ts`];

  const vue = vueSurface(vueSrcText);
  add('vue', 'in AccessibleOptions but not in props', diff(vue.accessible, vue.props));
  add('vue', 'in props but not in AccessibleOptions', diff(vue.props, vue.accessible));
  add('vue', 'in props but no "update:" emit', diff(vue.props, vue.emits));
  add('vue', '"update:" emit without a prop', diff(vue.emits, vue.props));

  const dts = dtsSurface(spec);
  if ('error' in dts) problems.push(`d.ts: ${dts.error}`);
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
    const expectedTpl = 'error' in dts ? new Set([...vue.accessible].filter(isTemplate)) : dts.templates;
    add('react', 'templateProps missing', diff(expectedTpl, react.templates));
    add('react', 'templateProps extra', diff(react.templates, expectedTpl));
  }
  return problems;
}

// ---------- CLI ----------
function changedComponents(baseArg: string | undefined): string[] {
  // argument array, no shell: a ref is never interpreted by a shell
  const git = (...gitArgs: string[]): string => execFileSync('git', gitArgs, {
    cwd: root, maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'],
  }).toString().trim();
  // default base: the branch's upstream; without one, only uncommitted changes are checked
  let base = baseArg;
  if (!base) {
    try { git('rev-parse', '--verify', '-q', '@{upstream}'); base = '@{upstream}'; } catch {
      base = 'HEAD';
      console.log('No upstream branch: checking uncommitted changes only (pass a base ref to compare a branch).');
    }
  }
  try { git('rev-parse', '--verify', '-q', `${base}^{commit}`); } catch {
    console.error(`Unknown base ref: ${base}`);
    process.exit(2);
  }
  const paths = ['packages/devextreme/js', 'packages/devextreme-angular/src', 'packages/devextreme-react/src', 'packages/devextreme-vue/src'];
  const changed = [...new Set([
    ...git('diff', '--name-only', `${base}...HEAD`, '--', ...paths).split('\n'),
    ...git('diff', '--name-only', 'HEAD', '--', ...paths).split('\n'),
    ...git('ls-files', '--others', '--exclude-standard', '--', ...paths).split('\n'),
  ])].filter(Boolean);
  console.log(`Changes since ${base}: ${changed.length} file(s) under devextreme/js and wrapper src.`);
  const set = new Set<string>();
  const shared: string[] = [];
  for (const f of changed) {
    const wrapper = f.match(/^packages\/devextreme-(?:react|vue)\/src\/([\w-]+)\.ts$/)
      ?? f.match(/^packages\/devextreme-angular\/src\/ui\/([\w-]+)\//);
    if (wrapper) set.add(wrapper[1]);
    const api = f.match(/^packages\/devextreme\/js\/((?:ui|viz)\/[^/]+?)(?:_types)?\.(?:d\.ts|js)$/);
    if (api) {
      const hits = allComponents.filter((c) => vueModule(c) === `devextreme/${api[1]}`);
      hits.forEach((c) => set.add(c));
      if (!hits.length) shared.push(f);
    } else if (/^packages\/devextreme\/js\/(?!__internal\/).+\.(d\.ts|js)$/.test(f)) shared.push(f);
  }
  if (shared.length) {
    const list = shared.slice(0, 10).join('\n  ') + (shared.length > 10 ? `\n  … and ${shared.length - 10} more` : '');
    console.log(`Shared/base public files changed — run with --all to see every inheriting widget:\n  ${list}`);
  }
  return [...set].filter((n) => allComponents.includes(n));
}

const args = process.argv.slice(2);
let names: string[];
if (args[0] === '--all') names = allComponents;
else if (args[0] === '--changed') {
  names = changedComponents(args[1]);
  if (!names.length) { console.log('No wrapped component touched directly.'); process.exit(0); }
} else names = args;

if (!names.length) {
  console.error('Usage: surface-check.mts <component...> | --all | --changed [<base-ref>]');
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
