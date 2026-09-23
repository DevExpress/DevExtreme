import {
  readFileSync,
  readdirSync,
  statSync,
  existsSync,
} from 'fs';
import { join, sep } from 'path';

import { stripScssComments } from '../build/tokens/consumed-tokens';
import contract from '../tools/naming/runtime-contract.json';

const packageRoot = process.cwd();
const widgetsRoot = join(packageRoot, 'scss', 'widgets');
const label = (file: string): string => file.slice(widgetsRoot.length + 1).split(sep).join('/');

const walk = (dir: string): string[] => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  if (statSync(absolute).isDirectory()) return walk(absolute);
  return entry.endsWith('.scss') ? [absolute] : [];
});

const stripped = (file: string): string => stripScssComments(readFileSync(file, 'utf8'), label(file));

const themeFiles = walk(join(widgetsRoot, 'fluent-next'));
const baseFiles = walk(join(widgetsRoot, 'base'));

test('the theme never writes a fallback into a var(--dx…) or var(--dxds…) read', () => {
  const offenders = themeFiles.flatMap((file) => stripped(file).split('\n').flatMap((line, index) => [
    ...line.matchAll(/var\(\s*(--dx(?:ds)?-[a-z0-9-]+)\s*,/g),
  ].map((match) => `${label(file)}:${index + 1}: ${match[1]} is read with a fallback — the tier `
    + 'declares it on the component root, a fallback hides a broken emission')));
  expect(offenders).toEqual([]);
});

test('base reads exactly the runtime-contract names and nothing else of --dx-*', () => {
  const read = new Set(baseFiles.flatMap((file) => [
    ...stripped(file).matchAll(/var\(\s*(--dx-[a-z0-9-]+)/g),
  ].map((match) => match[1])));
  const listed = new Set(contract.variables.map(({ name }) => name));
  expect({
    readButNotListed: [...read].filter((name) => !listed.has(name)).sort(),
    listedButNotRead: [...listed].filter((name) => !read.has(name)).sort(),
  }).toEqual({ readButNotListed: [], listedButNotRead: [] });
});

test('every runtime-contract read has the form its policy fixes', () => {
  const offenders: string[] = [];
  contract.variables.forEach((variable) => {
    const reads = baseFiles.flatMap((file) => [
      ...stripped(file).matchAll(new RegExp(`var\\(\\s*${variable.name}\\s*(,\\s*([^)]*))?\\)`, 'g')),
    ].map((match) => ({ file: label(file), fallback: match[2]?.trim() ?? null })));

    if (!reads.some((read) => read.file === variable.readIn)) {
      offenders.push(`${variable.name}: not read in ${variable.readIn} — update readIn in runtime-contract.json`);
    }
    reads.forEach((read) => {
      if (read.fallback !== variable.fallback) {
        offenders.push(`${read.file}: ${variable.name} is read with fallback ${JSON.stringify(read.fallback)}, `
          + `the contract fixes ${JSON.stringify(variable.fallback)} (${variable.whenUnset})`);
      }
    });
    if (variable.defaultDeclaredIn) {
      const declared = baseFiles.some((file) => label(file) === variable.defaultDeclaredIn
        && new RegExp(`${variable.name}\\s*:`).test(stripped(file)));
      if (!declared) {
        offenders.push(`${variable.name}: ${variable.defaultDeclaredIn} no longer declares the default the `
          + 'contract relies on');
      }
    }
  });
  expect(offenders).toEqual([]);
});

test('the runtime still sets every contract variable where the contract says', () => {
  const monorepo = join(packageRoot, '..', '..');
  const missing = contract.variables
    .filter(({ setBy }) => existsSync(join(monorepo, setBy)))
    .filter(({ name, setBy }) => !readFileSync(join(monorepo, setBy), 'utf8').includes(`'${name}'`))
    .map(({ name, setBy }) => `${name} is not set in ${setBy}`);
  expect(missing).toEqual([]);
});
