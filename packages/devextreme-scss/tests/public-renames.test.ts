/*
 * The component tier is the theme's public surface: `--dx-*` custom properties a user overrides
 * from their own stylesheet without rebuilding anything. Their names are derived mechanically from
 * the SCSS variables (tools/naming/publish.mjs), so an ordinary internal rename retires a public
 * name and the diff looks like plain regeneration.
 *
 * tools/naming/public-renames.json is the record of every such retirement, and this gate is what
 * gives the record teeth: a retired name must not come back. That forbids the tempting fix — an
 * alias in _public-links.scss that keeps the old name alive next to the new one, leaving two names
 * for one role and no way to tell which is real.
 *
 * The fluent-next bundles are the whole scope, as in public-surface.test.ts. The older themes
 * declare a small core vocabulary of their own that overlaps this surface by inheritance —
 * dx.light.css keeps declaring --dx-color-primary whatever fluent-next does with the name — so
 * reading them here would say nothing about fluent-next's tier and would make a retirement
 * unshippable: public-surface.test.ts demands a journal entry for the removal, and that entry is
 * what the cross-theme scan would then fail on.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

type Entry = {
  name: string;
  replacement: string | null;
  release: string;
  pr: number;
  note: string;
};

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

/*
 * A name is a prefix of longer ones (--dx-button-bg vs --dx-button-bg-hovered), so the boundary has
 * to exclude the name characters `\b` happily matches. Declarations and `var()` reads both count: a
 * retired name left behind in either place is the same mistake.
 */
const occurrences = (
  where: { name: string; css: string }[],
  variable: string,
): string[] => {
  const pattern = new RegExp(`${variable}(?![\\w-])`);
  return where.filter(({ css }) => pattern.test(css)).map(({ name }) => name);
};

/*
 * With an empty journal every scan below returns nothing, which is also what a broken scan returns.
 * This pins a name that does ship, so "no retired name found" means the bundles were read.
 */
test('the bundle scan finds a name that ships', () => {
  expect(occurrences(bundles, '--dx-button-border-radius'))
    .toEqual(bundles.map(({ name }) => name));
});

test('every journal entry is complete', () => {
  const malformed = retired.filter((entry) => !NAME.test(entry.name)
    || (entry.replacement !== null && !NAME.test(entry.replacement))
    || !entry.release
    || !Number.isInteger(entry.pr)
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

/*
 * A replacement that does not ship makes the entry useless to the person reading the release note.
 * If the replacement was itself retired later, point the older entry at the current name.
 */
test('every replacement ships', () => {
  const missing = retired
    .flatMap(({ name, replacement }) => (replacement === null ? [] : [{ name, replacement }]))
    .filter(({ replacement }) => occurrences(bundles, replacement).length === 0)
    .map(({ name, replacement }) => `${name} -> ${replacement}`);

  expect(missing).toEqual([]);
});
