import { existsSync, readFileSync, readdirSync } from 'fs';
import { dirname, join } from 'path';

const contract = require('../tools/naming/accent-contract.json') as {
  declaredIn: string;
  input: { name: string };
  source: { name: string };
  settings: { name: string }[];
  steps: { prefix: string; values: number[] };
};

const packageRoot = process.cwd();
const accentStylesheet = join(packageRoot, 'scss', 'widgets', ...contract.declaredIn.split('/'));
const generatedPalettes = join(packageRoot, 'scss', '_design-system', 'fluent', 'accents');
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');
const tokensDir = dirname(require.resolve('@devexpress/design-tokens-internal/package.json'));
const designedPalettes = join(tokensDir, 'tokens', 'base', 'colors', 'palettes', 'fluent');

const contractSteps = contract.steps.values.map(String);
const stepName = (step: string | number): string => `${contract.steps.prefix}${step}`;

const paletteNames = readdirSync(designedPalettes)
  .filter((name) => name.endsWith('.json'))
  .map((name) => name.replace('.json', ''))
  .sort();

const designedSteps = (palette: string): [string, string][] => Object.entries(
  JSON.parse(readFileSync(join(designedPalettes, `${palette}.json`), 'utf8')).primary as
    Record<string, { $value: string }>,
).map(([step, token]) => [step, token.$value.toLowerCase()]);

const generatedPalette = (palette: string): string => readFileSync(
  join(generatedPalettes, `${palette}.scss`),
  'utf8',
);

const stylesheet = (): string => readFileSync(accentStylesheet, 'utf8');

const bundleNames = existsSync(artifactsCss)
  ? readdirSync(artifactsCss).filter((name) => /^dx\.fluent-next\.[a-z0-9.]+\.css$/.test(name)).sort()
  : [];

test('the stylesheet declares exactly what the contract names', () => {
  const declared = [...stylesheet().matchAll(/(--dx-accent[a-z0-9-]*):/g)].map((match) => match[1]);

  expect(declared).toEqual([
    contract.source.name,
    ...contract.settings.map(({ name }) => name),
    ...contractSteps.map(stepName),
  ]);
  expect(stylesheet()).toContain(`var(${contract.input.name})`);
});

test('the generator is wired to every designed palette', () => {
  expect(readdirSync(generatedPalettes).filter((name) => name.endsWith('.scss'))
    .map((name) => name.replace('.scss', '')).sort()).toEqual(paletteNames);
});

test('every generated palette hands each designed step to the accent, keeping the designed value', () => {
  const offenders = paletteNames.flatMap((palette) => {
    const generated = generatedPalette(palette);
    return designedSteps(palette)
      .filter(([step, value]) => !generated.includes(
        `--dxds-primary-${step}: var(${stepName(step)}, ${value});`,
      ))
      .map(([step]) => `${palette}: step ${step} is not wrapped into ${stepName(step)} with its `
        + `designed value — ${/--dxds-primary-\d+: .*/
          .exec(generated.slice(generated.indexOf(`--dxds-primary-${step}:`)))?.[0]
          ?? 'the step is missing'}`);
  });

  expect(offenders).toEqual([]);
});

test('the palettes read back exactly the steps the contract fixes', () => {
  const readBack = paletteNames.map((palette) => [
    palette,
    [...generatedPalette(palette).matchAll(new RegExp(`var\\(${contract.steps.prefix}(\\d+),`, 'g'))]
      .map((match) => match[1]),
  ]);

  expect(readBack).toEqual(paletteNames.map((palette) => [palette, contractSteps]));
});

test('no step multiplies and divides by the same number — Chrome 145 folds that term to zero', () => {
  const degenerateFactors = (expression: string): string[] => {
    const offenders: string[] = [];
    const multiplier = /(\d+) \* \(/g;
    let match = multiplier.exec(expression);
    while (match) {
      let depth = 1;
      let index = match.index + match[0].length;
      while (depth > 0 && index < expression.length) {
        if (expression[index] === '(') depth += 1;
        if (expression[index] === ')') depth -= 1;
        index += 1;
      }
      const divisor = /^ \/ (\d+)/.exec(expression.slice(index));
      if (divisor?.[1] === match[1]) offenders.push(`${match[1]} * (…) / ${divisor[1]}`);
      match = multiplier.exec(expression);
    }
    return offenders;
  };

  const offenders = [...stylesheet().matchAll(/--dx-accent-color-(\d+): (.+);/g)]
    .flatMap(([, step, value]) => degenerateFactors(value).map((shape) => `step ${step}: ${shape}`));

  expect(offenders).toEqual([]);
});

test('the built bundles carry both halves of the accent', () => {
  expect(bundleNames.length).toBeGreaterThan(0);

  const offenders = bundleNames.flatMap((name) => {
    const css = readFileSync(join(artifactsCss, name), 'utf8');
    const computed = [...css.matchAll(/--dx-accent-color-(\d+):/g)].map((match) => match[1]);
    const unwrapped = [...css.matchAll(/--dxds-primary-(\d+): ?(?!var\()/g)].map((match) => match[1]);
    return [
      ...(/@supports \(color: ?oklch\(from red l c h\)\)/.test(css)
        ? [] : [`${name}: the computed steps are not gated by @supports`]),
      ...(computed.join() === contractSteps.join()
        ? [] : [`${name}: computes steps [${computed.join(', ')}]`]),
      ...unwrapped.map((step) => `${name}: primary step ${step} bypasses ${stepName(step)}`),
    ];
  });

  expect(offenders).toEqual([]);
});
