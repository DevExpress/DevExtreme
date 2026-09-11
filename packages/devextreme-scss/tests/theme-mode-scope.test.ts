/*
 * Gate for the fluent-next theme-mode invariant: an element carrying `dx-theme-mode-light`,
 * `-dark` or `-inverted` repaints itself and its subtree.
 *
 * It breaks silently, because a custom property is substituted where it is DECLARED, not where it
 * is read: `:root { --dx-color-text: var(--dxds-color-content) }` computes on <html> and freezes
 * at the bundle's mode, whatever class sits below. The declaration stays valid and only the colour
 * is wrong, so nothing fails - 39 properties were in that state before this gate existed.
 *
 * Checked against the built bundle, not a list here: the three scopes declare the same names, and
 * nothing reading one of those names is declared where a mode class cannot reach it. A declaration
 * on a component root is fine and not flagged - that element may itself sit inside a scope.
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

// A rule can reach the root while also matching something else: `:root, .dx-button { … }` still
// declares on <html>. So the question is whether ANY selector is the root, with no mode scope in
// the same list to re-resolve it.
const freezesOnDocumentRoot = (selectors: string[]): boolean => selectors.some(isDocumentRoot)
  && !selectors.some((selector) => modeScopesOf(selector).length);

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
    const onDocumentRoot = freezesOnDocumentRoot(rule.selectors);

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

// Frozen = declared on the document element and reading something a mode class redefines, whether
// directly or through another such declaration - `box-shadow-md` over `color-shadow-key`.
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
