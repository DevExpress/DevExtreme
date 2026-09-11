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
 *   3) GATE (fails): a name declared and never read. Questions 1 and 2 both ask "the read happens,
 *      does it land" — neither notices a name nothing reads at all. Such a name is still API: it
 *      ships in the bundle, a user sets it and nothing moves. Before publication that is free to
 *      fix, after publication the name cannot be withdrawn, which is why this one is pinned rather
 *      than reported. _public.scss is generated from the Sass declarations regardless of whether
 *      the resulting property is consumed, so build-time helpers leak out as dead API:
 *      $tree-view-checkbox-offset only composes $tree-view-select-all-item-padding and is folded
 *      away at build time, $scheduler-left-column-width has to stay a number because the base layer
 *      multiplies it. Liveness is transitive — a name read only by another dead name is dead too —
 *      so it is computed as a fixpoint from the reads in ordinary properties.
 *
 * Known gap, deliberately not gated here: a name that IS read, by a declaration that never wins.
 * --dx-time-view-field-number-box-spin-touch-friendly-width is overwritten by the next declaration
 * of the same property in the same rule; --dx-scheduler-timeline-date-table-cell-height loses
 * `height` to a three-class selector. Deciding that needs the cascade, not the text, and a wrong
 * verdict would be worse than none.
 *
 * Run: node tools/review/reachability.mjs [--report] [--update-scopes] [--update-unread]
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

/*
 * A scope that names another widget's overlay (the toolbar's dx-dropdownmenu-popup, a popover or
 * tooltip wrapper) is a portal by construction: JS mounts it in the overlay container, under no root
 * of THIS component, so the tier never reaches it and "reviewed" cannot be true. The branch has to
 * read the Sass twin (or a :root role) instead - that is how the diagram's overflow menu lost its
 * icon margins for a month while the whitelist kept the gate quiet.
 */
const SHARED_OVERLAY = /-(popup|popup-wrapper|overlay|overlay-wrapper|overlay-content|popover|popover-wrapper|tooltip|tooltip-wrapper)$/;
const ownClassOf = (component, scope) => {
  const own = [
    `dx-${component.replace(/-/g, '')}`,
    ...(registries.rootSelectors[component] ?? []).flatMap((sel) => [...classesOf(sel)]),
  ];
  return own.some((cls) => scope === cls || scope.startsWith(`${cls}-`));
};
const isForeignPortal = (component, scope) => SHARED_OVERLAY.test(scope) && !ownClassOf(component, scope);

const reviewed = JSON.parse(readFileSync(scopesPath, 'utf8'));
const listedPortals = Object.entries(reviewed)
  .flatMap(([component, scopes]) => scopes.filter((scope) => isForeignPortal(component, scope))
    .map((scope) => `${component} :: ${scope}`));
if (process.argv.includes('--update-scopes')) {
  const next = {};
  [...seenScopes.keys()].sort().forEach((key) => {
    const [component, scope] = key.split(' :: ');
    if (isForeignPortal(component, scope)) return;
    next[component] = [...(next[component] ?? []), scope];
  });
  writeFileSync(scopesPath, `${JSON.stringify(next, null, 2)}\n`);
  process.stdout.write(`nested-scopes.json rewritten: ${seenScopes.size} scope(s)\n`);
}

const unreviewed = [...seenScopes.entries()]
  .filter(([key]) => {
    const [component, scope] = key.split(' :: ');
    return !(reviewed[component] ?? []).includes(scope) || isForeignPortal(component, scope);
  });

const portals = [...new Set([
  ...listedPortals,
  ...[...seenScopes.keys()].filter((key) => isForeignPortal(...key.split(' :: '))),
])];
portals.forEach((key) => {
  const [component, scope] = key.split(' :: ');
  process.stdout.write(`✘ portal: .${scope} is another widget's overlay and cannot be a nested scope of ${component}\n`);
  process.stdout.write('     cure: read the Sass twin (or a :root role) in that branch, or mount the overlay inside the root;\n');
  process.stdout.write(`     "${scope}" must not be listed in nested-scopes.json["${component}"]\n`);
});

unreviewed.forEach(([key, example]) => {
  const [component, scope] = key.split(' :: ');
  process.stdout.write(`✘ scope outside the roots of ${component}: .${scope}\n`);
  process.stdout.write(`     example: ${example}\n`);
  process.stdout.write('     cure: either add the root to OVERRIDES.rootSelectors (derive-registries.mjs),\n');
  process.stdout.write(`     or, having proven nesting with the runtime audit, add "${scope}" to nested-scopes.json["${component}"]\n`);
});

/* --- 4. gate: declared and never read --------------------------------------------------------
 * Liveness spreads backwards from the ordinary properties: a tier name is live when a normal
 * declaration reads it, or when a live tier name reads it. Everything the fixpoint does not reach
 * is declared for nobody. The known list is pinned in unread-tier.json by exact set equality, the
 * way the calc budget and the naming baseline are pinned: a name that becomes live is banked by
 * regenerating, a name that goes dead is a review, not a rerun. Bank a drop with:
 *
 *   node tools/review/reachability.mjs --update-unread
 */
const declaredValues = new Map();
root.walkDecls((decl) => {
  if (!isTierName(decl.prop)) return;
  declaredValues.set(decl.prop, [...(declaredValues.get(decl.prop) ?? []), decl.value]);
});

const live = new Set();
const frontier = [];
root.walkDecls((decl) => {
  if (isTierName(decl.prop)) return;
  readsOf(decl.value).forEach((name) => {
    if (live.has(name)) return;
    live.add(name);
    frontier.push(name);
  });
});
while (frontier.length) {
  (declaredValues.get(frontier.pop()) ?? []).forEach((value) => readsOf(value).forEach((name) => {
    if (live.has(name)) return;
    live.add(name);
    frontier.push(name);
  }));
}

const unread = [...declaredAt.keys()].filter((name) => !live.has(name)).sort();
const unreadPath = join(here, 'unread-tier.json');
/*
 * The pin is a committed file, not something the tool can rebuild on the fly: without it there is
 * nothing to compare against, and passing would mean the gate quietly stopped working. So fail —
 * but say what is wrong, rather than throwing ENOENT from readFileSync. This happened on CI once:
 * reachability.mjs was committed and its pin was left untracked.
 */
let pinned;
try {
  pinned = JSON.parse(readFileSync(unreadPath, 'utf8'));
} catch (error) {
  process.stdout.write(`✘ the unread-name pin is missing or unreadable: ${unreadPath}\n`);
  process.stdout.write(`     ${error.message}\n`);
  process.stdout.write('     cure: the file is committed alongside this tool — check it is not left untracked.\n');
  process.stdout.write('     To create it from scratch: write {"names": []} there and run --update-unread.\n');
  process.exit(1);
}

if (process.argv.includes('--update-unread')) {
  writeFileSync(unreadPath, `${JSON.stringify({ ...pinned, names: unread }, null, 2)}\n`);
  process.stdout.write(`unread-tier.json rewritten: ${unread.length} name(s)\n`);
}

const appeared = unread.filter((name) => !pinned.names.includes(name));
const revived = pinned.names.filter((name) => !unread.includes(name));

appeared.forEach((name) => {
  process.stdout.write(`✘ declared and never read: ${name}\n`);
  process.stdout.write(`     declared on ${[...declaredAt.get(name)].sort().join(', ')}\n`);
  process.stdout.write('     cure: read it where it belongs, or stop publishing it — a name that moves nothing\n');
  process.stdout.write('     is still API once the theme ships, and then it cannot be withdrawn\n');
});

if (revived.length) {
  process.stdout.write(`✘ ${revived.length} pinned name(s) are read now: ${revived.join(', ')}\n`);
  process.stdout.write('     cure: bank the drop — node tools/review/reachability.mjs --update-unread\n');
}

crossScope.forEach(([key, list]) => {
  const [sel, prop] = key.split('§');
  process.stdout.write(`✘ cross-scope duplicate: ${prop}  @  ${sel}\n`);
  list.forEach((copy, index) => {
    process.stdout.write(`     copy ${index + 1}: ${copy.reads.join(' ')} → declared on ${copy.scope.replace(/,/g, ', ')}\n`);
  });
  process.stdout.write('     cure: the value must resolve under any of these roots — take a shared-layer name (gridBase/menuBase), not the name of a single widget\n');
});

process.stdout.write(`${orphans.size} read(s) outside the root text in ${seenScopes.size} scope(s) `
  + `(${unreviewed.length} unreviewed), ${crossScope.length} cross-scope duplicate(s), `
  + `${unread.length} name(s) declared and never read (${appeared.length} new)\n`);
process.exit(crossScope.length || unreviewed.length || portals.length
  || appeared.length || revived.length ? 1 : 0);
