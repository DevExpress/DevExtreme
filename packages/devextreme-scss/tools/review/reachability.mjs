/*
 * Reachability of the --dx-* component tier, measured on the BUILT fluent-next bundle.
 *
 * Three questions, each with its own strictness:
 *
 *   1) GATE (fails): a cross-scope duplicate. The same selector and property are declared more than
 *      once and the copies read variables of DIFFERENT components. The last copy wins; inside the
 *      other widget its variable is empty, the whole declaration is invalid and the property simply
 *      disappears. In the legacy themes such duplicates are harmless (the literals match), the tier
 *      splits them across roots. Found by the screenshots of PR #34774: base/dataGrid and
 *      base/treeList draw the same UNSCOPED `.dx-command-ai-header-button
 *      .dx-button.dx-state-focused`, and the focus ring of the AI column button vanished in
 *      DataGrid. The cure is a shared gridBase name ($grid-outline-focused).
 *
 *   2) REPORT (never fails): reads outside the root. A rule reads var(--dx-<component>-…), but its
 *      selector text contains no root of that component. Most such places are harmless — the
 *      element IS nested in the root (`.dx-editor-cell` inside the grid) and the selector text just
 *      does not say so. The dangerous ones are portals: elements JS creates outside the root (the
 *      dragged column preview, the sortable clone, a popup wrapper). The two cannot be told apart
 *      statically — that is knowledge about the DOM — so the verdict comes from the runtime audit
 *      playground/tier-reachability-audit.html, and this list is the material for its gallery:
 *      every new name here must be either proven nested or added as a root to
 *      registries.rootSelectors.
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
const readsOf = (value) => [...new Set([...value.matchAll(TIER_READ)].map(([, name]) => name))]
  .filter(isTierName);

const declaredAt = new Map();
root.walkDecls((decl) => {
  if (!isTierName(decl.prop)) return;
  const known = declaredAt.get(decl.prop) ?? new Set();
  (decl.parent.selectors ?? []).forEach((sel) => known.add(sel.trim()));
  declaredAt.set(decl.prop, known);
});

const SET_ELSEWHERE = new Set([
  '--dx-cardview-card-max-width',
  '--dx-cardview-card-min-width',
  '--dx-cardview-card-cover-ratio',
  '--dx-cardview-cardsperrow',
  '--dx-scheduler-animation-top',
  '--dx-accent-color',
]);
const undeclared = new Map();
root.walkRules((rule) => {
  if (!rule.selectors) return;
  rule.walkDecls((decl) => {
    readsOf(decl.value)
      .filter((name) => !declaredAt.has(name) && !SET_ELSEWHERE.has(name))
      .forEach((name) => {
        if (!undeclared.has(name)) undeclared.set(name, new Set());
        rule.selectors.forEach((sel) => undeclared.get(name).add(sel.trim()));
      });
  });
});
undeclared.forEach((where, name) => {
  process.stdout.write(`\u2718 read and never declared: ${name}\n`);
  process.stdout.write(`     read at ${[...where].sort().slice(0, 3).join(', ')}\n`);
  process.stdout.write('     cure: publish the name on the scope that reads it, or read the name that scope does have.\n');
  process.stdout.write('     If another layer sets it at runtime, add it to SET_ELSEWHERE with the file that does.\n');
});

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

const SHARED_OVERLAY = /-(popup|popup-wrapper|overlay|overlay-wrapper|overlay-content|popover|popover-wrapper|tooltip|tooltip-wrapper)$/;
const ownClassOf = (component, scope) => {
  const own = [
    `dx-${component.replace(/-/g, '')}`,
    ...(registries.rootSelectors[component] ?? []).flatMap((sel) => [...classesOf(sel)]),
  ];
  return own.some((cls) => scope === cls || scope.startsWith(`${cls}-`));
};
const isForeignPortal = (component, scope) => SHARED_OVERLAY.test(scope)
  && !ownClassOf(component, scope);

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

const declaredValues = new Map();
root.walkDecls((decl) => {
  if (!isTierName(decl.prop)) return;
  declaredValues.set(decl.prop, [...(declaredValues.get(decl.prop) ?? []), decl.value]);
});

/*
 * A style query reads the name without a var(): `@container style(--dx-theme-mode: dark)` is what
 * resolves an inverted scope against its NEAREST ancestor, and core/utils/theme_mode.ts asks the
 * browser for the same property. Counting only var() would call the name that carries the whole
 * mode mechanism dead API and ask for it to be withdrawn.
 */
const STYLE_QUERY_READ = /style\(\s*(--dx-[a-z0-9-]+)/g;

/*
 * The other reader outside the stylesheet: the runtime asks getComputedStyle for the sizes it has
 * to know before it can position anything (the speed dial's action buttons, a dialog's width, the
 * scheduler's smallest appointment). tools/naming/runtime-reads.json names them and the file that
 * reads each one; tests/runtime-reads.test.ts keeps the file honest.
 */
const runtimeReads = JSON.parse(readFileSync(join(packageRoot, 'tools', 'naming', 'runtime-reads.json'), 'utf8'))
  .variables.map(({ name }) => name);

const live = new Set();
const frontier = [];
const wake = (name) => {
  if (live.has(name)) return;
  live.add(name);
  frontier.push(name);
};
root.walkDecls((decl) => {
  if (isTierName(decl.prop)) return;
  readsOf(decl.value).forEach(wake);
});
root.walkAtRules('container', (rule) => {
  [...rule.params.matchAll(STYLE_QUERY_READ)]
    .map(([, name]) => name).filter(isTierName).forEach(wake);
});
runtimeReads.forEach(wake);
while (frontier.length) {
  (declaredValues.get(frontier.pop()) ?? []).forEach((value) => readsOf(value).forEach(wake));
}

const unread = [...declaredAt.keys()].filter((name) => !live.has(name)).sort();
const unreadPath = join(here, 'unread-tier.json');
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
  + `${unread.length} name(s) declared and never read (${appeared.length} new), `
  + `${undeclared.size} read and never declared\n`);
process.exit(crossScope.length || unreviewed.length || portals.length
  || appeared.length || revived.length || undeclared.size ? 1 : 0);
