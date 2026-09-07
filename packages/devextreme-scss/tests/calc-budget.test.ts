/*
 * Budget gate for runtime calc() in the compiled fluent-next bundles — the enforcement half of the
 * theme's runtime-calc() policy (scss/widgets/fluent-next/README.md §13). The theme docs live
 * outside git by decision, so the digest below is the policy's only versioned form:
 *
 *   - calc() is legitimate for percentage layout and for values derived from overridable tokens —
 *     runtime derivation is what the custom properties exist for;
 *   - a constant multiple of a token is not: when the token scale has the step, use it directly;
 *   - an expression repeated across rules is declared once and read back through its --dx-* variable
 *     (component tier in <widget>/_public.scss, system tier in common/_public.scss);
 *   - degenerate terms (`x + 0`, `x - y - 0`) are guarded away at build time in the base mixins;
 *   - pixel adjustments (± 1-2px) are frozen debt pending a design review — neither converted nor
 *     multiplied.
 *
 * Two numbers per bundle are pinned: total `calc(` occurrences and declarations whose value nests
 * `calc(` four or more times (the tier's twin definitions are the only legitimate carriers of deep
 * nesting — one per published derived value). The comparison is exact equality, like the naming
 * baseline: a drop is banked by regenerating, growth is a policy decision and must arrive as a
 * reviewed edit of tests/calc-budget.json. Regenerate deliberately with:
 *
 *   UPDATE_CALC_BUDGET=1 pnpm test
 *
 * The bundles come from packages/devextreme/artifacts/css — the `test` target depends on
 * `build:themes`, so they are fresh here; a missing bundle fails the suite loudly instead of
 * passing silently. Exact equality also pins the bundle set itself: a theme mode appearing or
 * disappearing shows up as a budget diff.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const packageRoot = process.cwd();
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');
const budgetPath = join(__dirname, 'calc-budget.json');
const updatingBudget = process.env.UPDATE_CALC_BUDGET === '1';

const DEEP_NESTING = 4;

const bundleNames = existsSync(artifactsCss)
  ? readdirSync(artifactsCss).filter((name) => /^dx\.fluent-next\.[a-z0-9.]+\.css$/.test(name)).sort()
  : [];

if (!bundleNames.length) {
  throw new Error(`no dx.fluent-next.*.css bundles found in ${artifactsCss} — the gate needs the `
    + 'built theme; run `pnpm nx run devextreme-scss:build:themes` (the `test` target normally '
    + 'builds it as a dependency)');
}

const measure = (css: string) => {
  // A declaration is one `property: value` slice of the minified bundle; calc( occurrences inside
  // one value count its nesting depth (operands between the calc( tokens do not matter here).
  const declarations = css.match(/[a-z-][a-z0-9-]*\s*:[^;{}]*calc\([^;{}]*/g) ?? [];
  return {
    calcOccurrences: (css.match(/calc\(/g) ?? []).length,
    declarationsWithDeepCalc: declarations
      .filter((declaration) => (declaration.match(/calc\(/g) ?? []).length >= DEEP_NESTING).length,
  };
};

const findings = Object.fromEntries(bundleNames.map((name) => [
  name,
  measure(readFileSync(join(artifactsCss, name), 'utf8')),
]));

if (updatingBudget) {
  test('calc budget regenerated', () => {
    writeFileSync(budgetPath, `${JSON.stringify(findings, null, 2)}\n`);
    expect(true).toBe(true);
  });
} else {
  test('runtime calc() in the fluent-next bundles stays within the pinned budget', () => {
    const budget = JSON.parse(readFileSync(budgetPath, 'utf8'));
    expect(findings).toEqual(budget);
  });
}
