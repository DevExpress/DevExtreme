import {
  readFileSync,
  writeFileSync,
  readdirSync,
  existsSync,
} from 'fs';
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

const measure = (css: string): { calcOccurrences: number; declarationsWithDeepCalc: number } => {
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
