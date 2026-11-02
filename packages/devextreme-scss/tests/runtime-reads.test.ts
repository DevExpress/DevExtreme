import {
  readFileSync,
  readdirSync,
  statSync,
  existsSync,
} from 'fs';
import { join, sep } from 'path';

import accent from '../tools/naming/accent-contract.json';
import written from '../tools/naming/runtime-contract.json';
import contract from '../tools/naming/runtime-reads.json';
import painted from '../tools/naming/viz-contract.json';

const packageRoot = join(__dirname, '..');
const repoRoot = join(packageRoot, '..', '..');
const themeRoot = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');
const runtimeRoot = join(repoRoot, 'packages', 'devextreme', 'js', '__internal');

const walk = (dir: string, extensions: string[]): string[] => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  if (statSync(absolute).isDirectory()) return walk(absolute, extensions);
  return extensions.some((extension) => entry.endsWith(extension)) ? [absolute] : [];
});

const declaredNames = (): Set<string> => new Set(walk(themeRoot, ['.scss']).flatMap((file) => [
  ...readFileSync(file, 'utf8').matchAll(/^\s*(--dx-[a-z0-9-]+)\s*:/gm),
].map(([, name]) => name)));

test('every runtime-read name is still declared by the theme', () => {
  const declared = declaredNames();
  expect(contract.variables.map(({ name }) => name).filter((name) => !declared.has(name)))
    .toEqual([]);
});

test('every runtime-read name is still read by the file the contract names', () => {
  const offenders = contract.variables.flatMap(({ name, readBy }) => {
    const file = join(repoRoot, readBy);
    if (!existsSync(file)) return [`${name}: ${readBy} does not exist`];
    return readFileSync(file, 'utf8').includes(`'${name}'`) ? [] : [`${name}: not read in ${readBy}`];
  });
  expect(offenders).toEqual([]);
});

test('no other place in the runtime reads a --dx-* name', () => {
  const known = new Set([
    ...contract.variables.map(({ name }) => name),
    ...written.variables.map(({ name }) => name),
    ...painted.variables.map(({ name }) => name),
    accent.input.name,
    accent.source.name,
    ...accent.settings.map(({ name }) => name),
    ...accent.steps.values.map((step) => `${accent.steps.prefix}${step}`),
  ]);
  const unlisted = walk(runtimeRoot, ['.ts', '.tsx'])
    .filter((file) => !file.includes(`${sep}__tests__${sep}`) && !file.endsWith('.test.ts'))
    .flatMap((file) => [...readFileSync(file, 'utf8').matchAll(/'(--dx-(?!ds-)[a-z0-9-]+)'/g)]
      .map(([, name]) => name)
      .filter((name) => !known.has(name))
      .map((name) => `${name} in ${file.slice(repoRoot.length + 1)}`));
  expect([...new Set(unlisted)]).toEqual([]);
});

const bundles = existsSync(artifactsCss)
  ? readdirSync(artifactsCss).filter((name) => /^dx\.fluent-next\..*[^n]\.css$/.test(name)).sort()
  : [];

const resolve = (css: string, name: string): string | undefined => {
  const declared = [...css.matchAll(new RegExp(`${name}\\s*:\\s*([^;}]+)`, 'g'))].pop()?.[1].trim();
  const reference = declared && /^var\(\s*(--dx(?:ds)?-[a-z0-9-]+)\s*\)$/.exec(declared);
  return reference ? resolve(css, reference[1]) : declared;
};

(bundles.length ? describe : describe.skip)('values the runtime can actually parse', () => {
  test.each(bundles)('%s declares every length as a plain length', (bundle) => {
    const css = readFileSync(join(artifactsCss, bundle), 'utf8');
    const offenders = contract.variables
      .filter(({ kind }) => kind === 'length')
      .map(({ name }) => ({ name, value: resolve(css, name) }))
      .filter(({ value }) => !value || !/^-?\d*\.?\d+(px|rem)?$/.test(value))
      .map(({ name, value }) => `${name}: ${value ?? 'not declared'} - themeLength reads px and rem only`);
    expect(offenders).toEqual([]);
  });
});
