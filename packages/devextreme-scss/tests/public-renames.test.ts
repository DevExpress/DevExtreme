import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

interface Entry {
  name: string;
  replacement: string | null;
  release: string;
  note: string;
}

const packageRoot = process.cwd();
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');
const journalPath = join(packageRoot, 'tools', 'naming', 'public-renames.json');

const bundleNames = existsSync(artifactsCss)
  ? readdirSync(artifactsCss).filter((name) => /^dx\.fluent-next\..*\.css$/.test(name)).sort()
  : [];

if (!bundleNames.length) {
  throw new Error(`no dx.fluent-next.*.css bundles found in ${artifactsCss} — the gate needs the `
    + 'built themes; run `pnpm nx run devextreme-scss:build:themes`');
}

const bundles = bundleNames.map((name) => ({
  name,
  css: readFileSync(join(artifactsCss, name), 'utf8'),
}));

const journal: { retired: Entry[] } = JSON.parse(readFileSync(journalPath, 'utf8'));
const { retired } = journal;

const NAME = /^--dx-[a-z0-9]+(-[a-z0-9]+)*$/;

const occurrences = (
  where: { name: string; css: string }[],
  variable: string,
): string[] => {
  const pattern = new RegExp(`${variable}(?![\\w-])`);
  return where.filter(({ css }) => pattern.test(css)).map(({ name }) => name);
};

test('the bundle scan finds a name that ships', () => {
  expect(occurrences(bundles, '--dx-button-border-radius'))
    .toEqual(bundles.map(({ name }) => name));
});

test('every journal entry is complete', () => {
  const malformed = retired.filter((entry) => !NAME.test(entry.name)
    || (entry.replacement !== null && !NAME.test(entry.replacement))
    || !entry.release
    || !entry.note);

  expect(malformed.map(({ name }) => name)).toEqual([]);
});

test('the journal lists each name once', () => {
  const names = retired.map(({ name }) => name);

  expect(names.filter((name, index) => names.indexOf(name) !== index)).toEqual([]);
});

test('no retired name ships in any fluent-next bundle', () => {
  const found = retired.flatMap(({ name }) => occurrences(bundles, name)
    .map((bundle) => `${bundle}: ${name}`));

  expect(found).toEqual([]);
});

test('every replacement ships', () => {
  const missing = retired
    .flatMap(({ name, replacement }) => (replacement === null ? [] : [{ name, replacement }]))
    .filter(({ replacement }) => occurrences(bundles, replacement).length === 0)
    .map(({ name, replacement }) => `${name} -> ${replacement}`);

  expect(missing).toEqual([]);
});
