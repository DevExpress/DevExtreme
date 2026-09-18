/*
 * The baseline of names the theme publishes. tests/public-renames.test.ts keeps a name that was
 * retired from coming back, but it only knows the names someone wrote into the journal — so on its
 * own the journal is a promise, not a gate. This file is the gate: the published set is pinned in
 * public-surface.baseline.json, and a name that leaves it has to be accounted for in
 * tools/naming/public-renames.json first.
 *
 *   pnpm run naming:baseline   # regenerate after a reviewed change
 *
 * Regenerating does not excuse a removal: the journal check below runs in update mode too, so a
 * disappearing name cannot be regenerated away.
 *
 * Only declarations count. The handful of names the theme reads but never declares — the accent and
 * runtime hooks a user sets from the outside — are governed by tools/naming/accent-contract.json
 * and runtime-contract.json, and tests/fluent-next-naming.test.ts holds them.
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';

type Entry = { name: string };

const packageRoot = process.cwd();
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');
const baselinePath = join(__dirname, 'public-surface.baseline.json');
const journalPath = join(packageRoot, 'tools', 'naming', 'public-renames.json');

const bundleNames = existsSync(artifactsCss)
  ? readdirSync(artifactsCss)
    // The minified twins carry the same names; comparing them adds nothing but a second spelling.
    .filter((name) => /^dx\.fluent-next\..*\.css$/.test(name) && !name.endsWith('.min.css'))
    .sort()
  : [];

if (!bundleNames.length) {
  throw new Error(`no dx.fluent-next.*.css bundles found in ${artifactsCss} — the gate needs the `
    + 'built themes; run `pnpm nx run devextreme-scss:build:themes`');
}

const declarations = (css: string): string[] => [
  ...new Set([...css.matchAll(/(--dx-[a-z0-9-]+)\s*:/g)].map((match) => match[1])),
].sort();

const surfaces = bundleNames.map((name) => ({
  name,
  names: declarations(readFileSync(join(artifactsCss, name), 'utf8')),
}));

const [reference] = surfaces;
const current = reference.names;
const currentSet = new Set(current);

const baseline: string[] = JSON.parse(readFileSync(baselinePath, 'utf8'));
const journal: { retired: Entry[] } = JSON.parse(readFileSync(journalPath, 'utf8'));
const retired = new Set(journal.retired.map(({ name }) => name));

/*
 * fluent-next has not shipped yet, so no published name can be relied on and no removal reaches a
 * user: a journal entry would have nobody to notify, and the journal would fill with names that
 * were never public, burying the ones that were. Until the theme ships, a removal only has to be
 * deliberate — which the baseline already enforces. Flip this when fluent-next is released.
 */
const THEME_IS_PUBLISHED = false;

const added = current.filter((name) => !baseline.includes(name));
const removed = baseline.filter((name) => !currentSet.has(name));

/*
 * A name that ships in one colour mode or density but not another is a mistake either way, and it
 * would also make "the published set" ambiguous for the checks below.
 */
test('every fluent-next bundle publishes the same names', () => {
  const differing = surfaces
    .filter(({ names }) => names.join('\n') !== current.join('\n'))
    .map(({ name }) => name);

  expect(differing).toEqual([]);
});

/*
 * Runs in update mode as well: regenerating the baseline is how a reviewed removal is recorded, not
 * how it is hidden.
 */
const undocumented = () => (THEME_IS_PUBLISHED
  ? removed.filter((name) => !retired.has(name))
  : []);

test('no name leaves the published surface without a journal entry', () => {
  expect(undocumented()).toEqual([]);
});

if (process.env.UPDATE_NAMING_BASELINE === '1') {
  // Guarded by the same rule, so a regeneration run cannot be the way an unrecorded removal lands.
  test('baseline regenerated', () => {
    expect(undocumented()).toEqual([]);

    writeFileSync(baselinePath, `${JSON.stringify(current, null, 2)}\n`);
  });
} else {
  test('no name is published without being in the baseline', () => {
    expect(added).toEqual([]);
  });

  test('every name in the baseline still ships', () => {
    expect(removed).toEqual([]);
  });
}
