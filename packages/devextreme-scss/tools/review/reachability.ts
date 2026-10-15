import { readFileSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';
import postcss from 'postcss';
import type { Node, Rule } from 'postcss';

interface Registries { rootSelectors: Record<string, string[]> }
interface Contract { variables: { name: string }[] }
interface Pinned { names: string[] }
interface Copy { reads: string[]; scope: string }

const here = import.meta.dirname;

const packageRoot = join(here, '..', '..');
const bundlePath = join(packageRoot, '..', 'devextreme', 'artifacts', 'css', 'dx.fluent-next.blue.light.css');

try {
  statSync(bundlePath);
} catch {
  process.stderr.write('note: the fluent-next bundle is not built — the reachability check is skipped\n');
  process.exit(0);
}

const registries: Registries = JSON.parse(readFileSync(join(packageRoot, 'tools', 'naming', 'registries.json'), 'utf8'));
const css = readFileSync(bundlePath, 'utf8');
const root = postcss.parse(css);

const isRule = (node: Node | undefined): node is Rule => node?.type === 'rule';

const TIER_READ = /var\(\s*(--dx-[a-z0-9-]+)/g;
const isTierName = (name: string): boolean => name.startsWith('--dx-') && !name.startsWith('--dxds-');
const readsOf = (value: string): string[] => [
  ...new Set([...value.matchAll(TIER_READ)].map(([, name]) => name)),
].filter(isTierName);

const declaredAt = new Map<string, Set<string>>();
root.walkDecls((decl) => {
  if (!isTierName(decl.prop)) return;
  const known = declaredAt.get(decl.prop) ?? new Set<string>();
  (isRule(decl.parent) ? decl.parent.selectors : []).forEach((sel) => known.add(sel.trim()));
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
const undeclared = new Map<string, Set<string>>();
root.walkRules((rule) => {
  rule.walkDecls((decl) => {
    readsOf(decl.value)
      .filter((name) => !declaredAt.has(name) && !SET_ELSEWHERE.has(name))
      .forEach((name) => {
        const where = undeclared.get(name) ?? new Set<string>();
        undeclared.set(name, where);
        rule.selectors.forEach((sel) => where.add(sel.trim()));
      });
  });
});
undeclared.forEach((where, name) => {
  process.stdout.write(`✘ read and never declared: ${name}\n`);
  process.stdout.write(`     read at ${[...where].sort().slice(0, 3).join(', ')}\n`);
  process.stdout.write('     cure: publish the name on the scope that reads it, or read the name that scope does have.\n');
  process.stdout.write('     If another layer sets it at runtime, add it to SET_ELSEWHERE with the file that does.\n');
});

const copies = new Map<string, Copy[]>();
root.walkRules((rule) => {
  rule.walkDecls((decl) => {
    const reads = readsOf(decl.value).filter((name) => declaredAt.has(name));
    if (!reads.length) return;
    rule.selectors.forEach((sel) => {
      const key = `${sel.trim()}§${decl.prop}`;
      const scope = [...new Set(reads.flatMap((name) => [...(declaredAt.get(name) ?? [])]))].sort().join(',');
      copies.set(key, [...(copies.get(key) ?? []), { reads, scope }]);
    });
  });
});

const crossScope = [...copies.entries()]
  .filter(([, list]) => list.length > 1 && new Set(list.map((c) => c.scope)).size > 1);

const classesOf = (selector: string): Set<string> => new Set([...selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map(([, cls]) => cls));
const coveredBy = (selector: string, declRoots: Set<string>): boolean => {
  const classes = classesOf(selector);
  return [...declRoots].some((declRoot) => declRoot.split(/[\s>+~]+/)
    .every((part) => part === ':root' || [...classesOf(part)].every((cls) => classes.has(cls))));
};

const orphans = new Map<string, boolean>();
root.walkRules((rule) => {
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
const componentOf = (name: string): string | null => {
  const bare = name.slice('--dx-'.length);
  return Object.keys(registries.rootSelectors)
    .filter((component) => bare === component || bare.startsWith(`${component}-`))
    .sort((a, b) => b.length - a.length)[0] ?? null;
};
const scopeKeyOf = (selector: string): string | null => {
  for (const compound of selector.split(/[\s>+~]+/)) {
    const cls = [...classesOf(compound)].find((one) => !GENERIC.test(one));
    if (cls) return cls;
  }
  return null;
};

const seenScopes = new Map<string, string>();
[...orphans.keys()].forEach((line) => {
  const [name, selector] = line.split('  @  ');
  const component = componentOf(name);
  const scope = scopeKeyOf(selector);
  if (!component || !scope) return;
  const key = `${component} :: ${scope}`;
  if (!seenScopes.has(key)) seenScopes.set(key, `${name}  @  ${selector}`);
});

const SHARED_OVERLAY = /-(popup|popup-wrapper|overlay|overlay-wrapper|overlay-content|popover|popover-wrapper|tooltip|tooltip-wrapper)$/;
const ownClassOf = (component: string, scope: string): boolean => {
  const own = [
    `dx-${component.replace(/-/g, '')}`,
    ...(registries.rootSelectors[component] ?? []).flatMap((sel) => [...classesOf(sel)]),
  ];
  return own.some((cls) => scope === cls || scope.startsWith(`${cls}-`));
};
const isForeignPortal = (component: string, scope: string): boolean => SHARED_OVERLAY.test(scope)
  && !ownClassOf(component, scope);
const isForeignPortalKey = (key: string): boolean => {
  const [component, scope] = key.split(' :: ');
  return isForeignPortal(component, scope);
};

const reviewed: Record<string, string[]> = JSON.parse(readFileSync(scopesPath, 'utf8'));
const listedPortals = Object.entries(reviewed)
  .flatMap(([component, scopes]) => scopes.filter((scope) => isForeignPortal(component, scope))
    .map((scope) => `${component} :: ${scope}`));
if (process.argv.includes('--update-scopes')) {
  const next: Record<string, string[]> = {};
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
  ...[...seenScopes.keys()].filter(isForeignPortalKey),
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
  process.stdout.write('     cure: either add the root to OVERRIDES.rootSelectors (derive-registries.ts),\n');
  process.stdout.write(`     or, having confirmed in the live widget that the element is nested in the root, add "${scope}" to nested-scopes.json["${component}"]\n`);
});

const declaredValues = new Map<string, string[]>();
root.walkDecls((decl) => {
  if (!isTierName(decl.prop)) return;
  declaredValues.set(decl.prop, [...(declaredValues.get(decl.prop) ?? []), decl.value]);
});

const STYLE_QUERY_READ = /style\(\s*(--dx-[a-z0-9-]+)/g;

const readContract = (file: string): string[] => {
  const contract: Contract = JSON.parse(readFileSync(join(packageRoot, 'tools', 'naming', file), 'utf8'));
  return contract.variables.map(({ name }) => name);
};
const runtimeReads = readContract('runtime-reads.json');
const vizReads = readContract('viz-contract.json');

const live = new Set<string>();
const frontier: string[] = [];
const wake = (name: string): void => {
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
[...runtimeReads, ...vizReads].forEach(wake);
for (let name = frontier.pop(); name !== undefined; name = frontier.pop()) {
  (declaredValues.get(name) ?? []).forEach((value) => readsOf(value).forEach(wake));
}

const unread = [...declaredAt.keys()].filter((name) => !live.has(name)).sort();
const unreadPath = join(here, 'unread-tier.json');
const readPinned = (): Pinned => {
  try {
    const parsed: Pinned = JSON.parse(readFileSync(unreadPath, 'utf8'));
    return parsed;
  } catch (error) {
    process.stdout.write(`✘ the unread-name pin is missing or unreadable: ${unreadPath}\n`);
    process.stdout.write(`     ${error instanceof Error ? error.message : String(error)}\n`);
    process.stdout.write('     cure: the file is committed alongside this tool — check it is not left untracked.\n');
    process.stdout.write('     To create it from scratch: write {"names": []} there and run --update-unread.\n');
    return process.exit(1);
  }
};
const pinned = readPinned();

if (process.argv.includes('--update-unread')) {
  writeFileSync(unreadPath, `${JSON.stringify({ ...pinned, names: unread }, null, 2)}\n`);
  process.stdout.write(`unread-tier.json rewritten: ${unread.length} name(s)\n`);
}

const appeared = unread.filter((name) => !pinned.names.includes(name));
const revived = pinned.names.filter((name) => !unread.includes(name));

appeared.forEach((name) => {
  process.stdout.write(`✘ declared and never read: ${name}\n`);
  process.stdout.write(`     declared on ${[...(declaredAt.get(name) ?? [])].sort().join(', ')}\n`);
  process.stdout.write('     cure: read it where it belongs, or stop publishing it — a name that moves nothing\n');
  process.stdout.write('     is still API once the theme ships, and then it cannot be withdrawn\n');
});

if (revived.length) {
  process.stdout.write(`✘ ${revived.length} pinned name(s) are read now: ${revived.join(', ')}\n`);
  process.stdout.write('     cure: bank the drop — node tools/review/reachability.ts --update-unread\n');
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
