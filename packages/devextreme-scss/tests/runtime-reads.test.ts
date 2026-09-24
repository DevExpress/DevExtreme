/*
 * The CSS -> JS contract (tools/naming/runtime-reads.json): --dx-* names the tier declares only
 * for the runtime to read back. Nothing in a stylesheet reads them, so a rename, a removal or a
 * value the reader cannot parse is silent - the runtime just falls back to its legacy literal and
 * fluent-next renders the old geometry. This file is where that would show.
 */

import {
  readFileSync,
  readdirSync,
  statSync,
  existsSync,
} from 'fs';
import { join, sep } from 'path';

import accent from '../tools/naming/accent-contract.json';
/* JS writes these, so they are the other direction and are governed by their own file. */
import written from '../tools/naming/runtime-contract.json';
import contract from '../tools/naming/runtime-reads.json';
/* The viz widgets paint with these, so they are the other direction as well. */
import painted from '../tools/naming/viz-contract.json';

const packageRoot = process.cwd();
const repoRoot = join(packageRoot, '..', '..');
const themeRoot = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');
const runtimeRoot = join(repoRoot, 'packages', 'devextreme', 'js', '__internal');

const walk = (dir: string, extensions: string[]): string[] => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  if (statSync(absolute).isDirectory()) return walk(absolute, extensions);
  return extensions.some((extension) => entry.endsWith(extension)) ? [absolute] : [];
});

/*
 * Every name the theme declares, wherever it declares it: the sizes come from the generated
 * component tier (`gridBase/_public.scss` and friends), the mode from a hand-written rule in
 * `_design-system.scss`. Reading the sources rather than the built bundle keeps this half of the
 * contract checkable without a build.
 */
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

/*
 * The whole runtime is scanned, not just the files the contract already names: a reader that
 * forgets to register here is exactly the silent failure above, and it would be invisible to a
 * scan of the registered files. The scan is by literal, so a name built from pieces would slip
 * through - do not build these names from pieces.
 */
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

/*
 * themeLength parses `<number>` with an optional px or rem and nothing else, so a value the
 * browser hands back as `calc(…)`, `2em` or a keyword reads as "the theme declares nothing" and
 * the runtime silently keeps its legacy literal. Everything the theme can reach through the
 * --dxds-* chain is resolved here, so such a value fails the build instead.
 */
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
