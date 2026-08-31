/*
 * Reachability of the --dx-* component tier, measured on the BUILT fluent-next bundle.
 *
 * Two questions, each with its own strictness:
 *
 *   1) GATE (fails): a cross-scope duplicate. The same selector and property are declared more than
 *      once and the copies read variables of DIFFERENT components. The last copy wins; inside the
 *      other widget its variable is empty, the whole declaration is invalid and the property simply
 *      disappears. In the legacy themes such duplicates are harmless (the literals match), the tier
 *      splits them across roots. Found by the screenshots of PR #34774: base/dataGrid and
 *      base/treeList draw the same UNSCOPED
 *      `.dx-command-ai-header-button .dx-button.dx-state-focused`, and the focus ring of the AI
 *      column button vanished in DataGrid. The cure is a shared gridBase name ($grid-outline-focused).
 *
 *   2) REPORT (never fails): reads outside the root. A rule reads var(--dx-<component>-…), but its
 *      selector text contains no root of that component. Most such places are harmless — the element
 *      IS nested in the root (`.dx-editor-cell` inside the grid) and the selector text just does not
 *      say so. The dangerous ones are portals: elements JS creates outside the root (the dragged
 *      column preview, the sortable clone, a popup wrapper). The two cannot be told apart statically
 *      — that is knowledge about the DOM — so the verdict comes from the runtime audit
 *      playground/tier-reachability-audit.html, and this list is the material for its gallery: every
 *      new name here must be either proven nested or added as a root to registries.rootSelectors.
 *
 * Run: node tools/review/reachability.mjs [--report]
 * With no built bundle it exits quietly with zero (the gate cannot judge what does not exist).
 */

import { readFileSync, writeFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const postcss = require('postcss');
const packageRoot = join(here, '..', '..');
const bundlePath = join(packageRoot, '..', 'devextreme', 'artifacts', 'css', 'dx.fluent-next.blue.light.css');

try {
  statSync(bundlePath);
} catch {
  process.stderr.write('note: the fluent-next bundle is not built — the reachability check is skipped\n');
  process.exit(0);
}

const registries = JSON.parse(readFileSync(join(packageRoot, 'tools', 'naming', 'registries.json'), 'utf8'));
const css = readFileSync(bundlePath, 'utf8');
const root = postcss.parse(css);

const TIER_READ = /var\(\s*(--dx-[a-z0-9-]+)/g;
const isTierName = (name) => name.startsWith('--dx-') && !name.startsWith('--dxds-');
const readsOf = (value) => [...new Set([...value.matchAll(TIER_READ)].map(([, name]) => name))].filter(isTierName);

/* where each tier name is declared */
const declaredAt = new Map();
root.walkDecls((decl) => {
  if (!isTierName(decl.prop)) return;
  const known = declaredAt.get(decl.prop) ?? new Set();
  (decl.parent.selectors ?? []).forEach((sel) => known.add(sel.trim()));
  declaredAt.set(decl.prop, known);
});

/* --- 1. gate: cross-scope duplicate ---------------------------------------------------------- */
const copies = new Map();
root.walkRules((rule) => {
  if (!rule.selectors) return;
  rule.walkDecls((decl) => {
    const reads = readsOf(decl.value).filter((name) => declaredAt.has(name));
    if (!reads.length) return;
    rule.selectors.forEach((sel) => {
      const key = `${sel.trim()}§${decl.prop}`;
      const scope = [...new Set(reads.flatMap((name) => [...declaredAt.get(name)]))].sort().join(',');
      copies.set(key, [...(copies.get(key) ?? []), { reads, scope }]);
    });
  });
});

const crossScope = [...copies.entries()]
  .filter(([, list]) => list.length > 1 && new Set(list.map((c) => c.scope)).size > 1);

/* --- 2. report: reads outside the root ------------------------------------------------------- */
const classesOf = (selector) => new Set([...selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map(([, cls]) => cls));
const coveredBy = (selector, declRoots) => {
  const classes = classesOf(selector);
  return [...declRoots].some((declRoot) => declRoot.split(/[\s>+~]+/)
    .every((part) => part === ':root' || [...classesOf(part)].every((cls) => classes.has(cls))));
};

const orphans = new Map();
root.walkRules((rule) => {
  if (!rule.selectors) return;
  readsOf(rule.toString()).forEach((name) => {
    const declRoots = declaredAt.get(name);
    if (!declRoots) return;
    rule.selectors.forEach((sel) => {
      if (coveredBy(sel.trim(), declRoots)) return;
      orphans.set(`${name}  @  ${sel.trim()}`, true);
    });
  });
});

if (process.argv.includes('--report')) {
  [...orphans.keys()].sort().forEach((line) => process.stdout.write(`  ${line}\n`));
}

/* --- 3. gate: a scope outside the root must be a REVIEWED one --------------------------------
 * What it catches: a rule paints an element the component's root does not reach. "Nested or not"
 * cannot be decided statically — that is knowledge about the DOM — so the decision is made once and
 * recorded here, and the gate makes sure NEW such places cannot appear silently.
 *
 * That is how 208 screenshots moved in CI: a grid's pager carries dx-pager (never dx-pagination),
 * cardView's column chooser and the htmlEditor/fileManager dialogs are popups, and the clone of a
 * dragged pivotGrid field is created in the viewport. Every such place is either a new root in
 * registries.rootSelectors, or a line here backed by the runtime audit
 * (playground/tier-reachability-audit.html).
 *
 * The key is the component plus the first class of the selector, skipping cross-cutting modifiers
 * (dx-rtl, dx-state-*, ...): that class is the one answering "which element is this".
 */
const GENERIC = /^dx-(rtl|state-|theme-|device-|color-scheme-|widget$|swatch)/;
const scopesPath = join(here, 'nested-scopes.json');
const componentOf = (name) => {
  const bare = name.slice('--dx-'.length);
  return Object.keys(registries.rootSelectors)
    .filter((component) => bare === component || bare.startsWith(`${component}-`))
    .sort((a, b) => b.length - a.length)[0] ?? null;
};
const scopeKeyOf = (selector) => {
  for (const compound of selector.split(/[\s>+~]+/)) {
    const cls = [...classesOf(compound)].find((one) => !GENERIC.test(one));
    if (cls) return cls;
  }
  return null;
};

const seenScopes = new Map();
[...orphans.keys()].forEach((line) => {
  const [name, selector] = line.split('  @  ');
  const component = componentOf(name);
  const scope = scopeKeyOf(selector);
  if (!component || !scope) return;
  const key = `${component} :: ${scope}`;
  if (!seenScopes.has(key)) seenScopes.set(key, `${name}  @  ${selector}`);
});

const reviewed = JSON.parse(readFileSync(scopesPath, 'utf8'));
if (process.argv.includes('--update-scopes')) {
  const next = {};
  [...seenScopes.keys()].sort().forEach((key) => {
    const [component, scope] = key.split(' :: ');
    next[component] = [...(next[component] ?? []), scope];
  });
  writeFileSync(scopesPath, `${JSON.stringify(next, null, 2)}\n`);
  process.stdout.write(`nested-scopes.json rewritten: ${seenScopes.size} scope(s)\n`);
}

const unreviewed = [...seenScopes.entries()]
  .filter(([key]) => {
    const [component, scope] = key.split(' :: ');
    return !(reviewed[component] ?? []).includes(scope);
  });

unreviewed.forEach(([key, example]) => {
  const [component, scope] = key.split(' :: ');
  process.stdout.write(`✘ scope outside the roots of ${component}: .${scope}\n`);
  process.stdout.write(`     example: ${example}\n`);
  process.stdout.write('     cure: either add the root to OVERRIDES.rootSelectors (derive-registries.mjs),\n');
  process.stdout.write(`     or, having proven nesting with the runtime audit, add "${scope}" to nested-scopes.json["${component}"]\n`);
});

crossScope.forEach(([key, list]) => {
  const [sel, prop] = key.split('§');
  process.stdout.write(`✘ cross-scope duplicate: ${prop}  @  ${sel}\n`);
  list.forEach((copy, index) => {
    process.stdout.write(`     copy ${index + 1}: ${copy.reads.join(' ')} → declared on ${copy.scope.replace(/,/g, ', ')}\n`);
  });
  process.stdout.write('     cure: the value must resolve under any of these roots — take a shared-layer name (gridBase/menuBase), not the name of a single widget\n');
});

process.stdout.write(`${orphans.size} read(s) outside the root text in ${seenScopes.size} scope(s) `
  + `(${unreviewed.length} unreviewed), ${crossScope.length} cross-scope duplicate(s)\n`);
process.exit(crossScope.length || unreviewed.length ? 1 : 0);
