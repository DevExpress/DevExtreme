import {
  readFileSync,
  existsSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';
import { getThemes, Theme } from '../build/theme-options.cjs';

const packageRoot = join(__dirname, '..');
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');
const baselinePath = join(__dirname, 'public-surface.baseline.json');

const bundleName = ([theme, size, color, mode]: Theme): string => (
  `dx${theme === 'generic' ? '' : `.${theme}`}.${color}${mode ? `.${mode}` : ''}${size === 'default' ? '' : '.compact'}.css`
);

const bundles = getThemes().map((theme) => ({ theme: theme[0], name: bundleName(theme) }));
const built = bundles.filter(({ name }) => existsSync(join(artifactsCss, name)));

if (!built.length) {
  throw new Error(`no theme bundles found in ${artifactsCss} - the gate needs the `
    + 'built themes; run `pnpm nx run devextreme-scss:build:themes`');
}

const declarations = (css: string): string[] => [
  ...new Set([...css.matchAll(/(--dx-[a-z0-9-]+)\s*:/g)].map((match) => match[1])),
].sort();

const surfaces = built.map(({ theme, name }) => ({
  theme,
  name,
  names: declarations(readFileSync(join(artifactsCss, name), 'utf8')),
}));

const themes = [...new Set(bundles.map(({ theme }) => theme))];
const current: Record<string, string[]> = Object.fromEntries(themes.map((theme) => [
  theme,
  surfaces.find((surface) => surface.theme === theme)?.names ?? [],
]));

const baseline: Record<string, string[]> = JSON.parse(readFileSync(baselinePath, 'utf8'));

const outside = (
  names: Record<string, string[]>,
  reference: Record<string, string[]>,
): string[] => Object.entries(names).flatMap(([theme, list]) => list
  .filter((name) => !(reference[theme] ?? []).includes(name))
  .map((name) => `${theme}: ${name}`));

test('every declared theme has a built bundle', () => {
  expect(bundles.filter((bundle) => !built.includes(bundle)).map(({ name }) => name)).toEqual([]);
});

test('every bundle of a theme publishes the same names', () => {
  const differing = surfaces
    .filter(({ theme, names }) => names.join('\n') !== current[theme].join('\n'))
    .map(({ name }) => name);

  expect(differing).toEqual([]);
});

if (process.env.UPDATE_NAMING_BASELINE === '1') {
  test('baseline regenerated', () => {
    writeFileSync(baselinePath, `${JSON.stringify(current, null, 2)}\n`);

    expect(Object.values(current).flat().length).toBeGreaterThan(0);
  });
} else {
  test('no name is published without being in the baseline', () => {
    expect(outside(current, baseline)).toEqual([]);
  });

  test('every name in the baseline still ships', () => {
    expect(outside(baseline, current)).toEqual([]);
  });
}
