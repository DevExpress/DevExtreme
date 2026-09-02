/*
 * Gate for the fluent-next theme-mode invariant: an element carrying `dx-theme-mode-light`,
 * `-dark` or `-inverted` repaints itself and its subtree.
 *
 * The invariant is easy to break silently, because a custom property is substituted where it is
 * DECLARED, not where it is read. `:root { --dx-color-text: var(--dxds-color-content) }` computes
 * on <html>, freezes at the bundle's mode, and every element below inherits that frozen value no
 * matter which mode class sits between - the declaration is still valid, the colour is simply the
 * wrong one, so nothing fails and only a screenshot would notice. That is what happened to 39
 * properties (the legacy `--dx-color-*` surface, the box-shadow composites and their Figma layer
 * colours, the global focus aliases) before this gate existed.
 *
 * Two things are checked, both derived from the built bundle rather than from a list here:
 *
 *   1. the three mode scopes declare exactly the same names, so none of them can go missing;
 *   2. nothing whose value reads a mode-scoped name is declared where a mode class cannot reach
 *      it - i.e. on the document element.
 *
 * A declaration on a component root (`.dx-button { --dx-button-bg: var(--dxds-color-bg) }`) is
 * fine and deliberately not flagged: that element may sit inside a mode scope, and then the read
 * resolves there.
 *
 * The bundles come from packages/devextreme/artifacts/css - the `test` target depends on
 * `build:themes`, so they are fresh here; a missing bundle fails the suite loudly instead of
 * passing silently.
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import postcss from 'postcss';

const packageRoot = process.cwd();
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');

const MODE_PROPERTY = '--dx-theme-mode';
const MODE_SCOPES = ['light', 'dark', 'inverted'];
const MODE_CLASS_PREFIX = '.dx-theme-mode-';

const bundleNames = existsSync(artifactsCss)
  ? readdirSync(artifactsCss).filter((name) => /^dx\.fluent-next\.[a-z0-9.]+\.css$/.test(name)).sort()
  : [];

if (!bundleNames.length) {
  throw new Error(`no dx.fluent-next.*.css bundles found in ${artifactsCss} — the gate needs the `
    + 'built theme; run `pnpm nx run devextreme-scss:build:themes` (the `test` target normally '
    + 'does it for you)');
}

/** The compound a selector actually targets: `:where(.a) .b` -> `.b`, `:root` -> `:root`. */
const subjectOf = (selector: string): string => selector.trim().split(/[\s>+~]+/).filter(Boolean).pop() ?? '';

const modeScopesOf = (selector: string): string[] => MODE_SCOPES
  .filter((scope) => subjectOf(selector) === `${MODE_CLASS_PREFIX}${scope}`);

// A rule lands on the document element - the one place a mode class below it cannot reach.
const isDocumentRoot = (selector: string): boolean => [':root', 'html'].includes(subjectOf(selector));

interface BundleFacts {
  scopeNames: Record<string, Set<string>>;
  rootDeclarations: { property: string; reads: string[]; selector: string }[];
  modeScopedNames: Set<string>;
}

const readBundle = (name: string): BundleFacts => {
  const root = postcss.parse(readFileSync(join(artifactsCss, name), 'utf8'), { from: name });
  const scopeNames: Record<string, Set<string>> = Object.fromEntries(
    MODE_SCOPES.map((scope) => [scope, new Set<string>()]),
  );
  const rootDeclarations: BundleFacts['rootDeclarations'] = [];
  const modeScopedNames = new Set<string>();

  root.walkRules((rule) => {
    const scopes = new Set(rule.selectors.flatMap(modeScopesOf));
    const onDocumentRoot = rule.selectors.every(isDocumentRoot);

    rule.each((node) => {
      if (node.type !== 'decl' || !node.prop.startsWith('--')) {
        return;
      }

      scopes.forEach((scope) => scopeNames[scope].add(node.prop));

      if (scopes.size) {
        modeScopedNames.add(node.prop);
      }

      if (onDocumentRoot) {
        rootDeclarations.push({
          property: node.prop,
          reads: [...node.value.matchAll(/var\(\s*(--[\w-]+)/g)].map((match) => match[1]),
          selector: rule.selector,
        });
      }
    });
  });

  return { scopeNames, rootDeclarations, modeScopedNames };
};

/*
 * Frozen = declared on the document element and reading, directly or through another such
 * declaration, something a mode class redefines. `--dxds-box-shadow-md` reads
 * `--dxds-color-shadow-key` (mode-scoped) and is itself read by every popup, so the chain has to
 * be followed rather than only the first hop.
 */
const frozenProperties = ({ rootDeclarations, modeScopedNames }: BundleFacts): string[] => {
  const frozen = new Map<string, string>();
  const tainted = new Set(modeScopedNames);

  for (;;) {
    const found = rootDeclarations.filter(({ property, reads }) => !tainted.has(property)
      && reads.some((name) => tainted.has(name)));

    if (!found.length) {
      return [...frozen.keys()].sort();
    }

    found.forEach(({ property, selector, reads }) => {
      tainted.add(property);
      frozen.set(property, `${selector} { ${property}: … ${reads.find((name) => tainted.has(name)) ?? ''} … }`);
    });
  }
};

describe.each(bundleNames)('%s', (name) => {
  const facts = readBundle(name);

  test('the three mode scopes declare the same names', () => {
    const [light, dark, inverted] = MODE_SCOPES.map((scope) => [...facts.scopeNames[scope]].sort());

    expect(light.length).toBeGreaterThan(0);
    expect(dark).toEqual(light);
    expect(inverted).toEqual(light);
  });

  test(`every mode scope names its mode in ${MODE_PROPERTY}`, () => {
    expect(MODE_SCOPES.filter((scope) => !facts.scopeNames[scope].has(MODE_PROPERTY))).toEqual([]);
  });

  test('nothing reading a mode-scoped value is declared on the document element', () => {
    expect(frozenProperties(facts)).toEqual([]);
  });
});
