import {
  readFileSync,
  readdirSync,
  existsSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';

interface Entry { name: string }

const packageRoot = process.cwd();
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');
const baselinePath = join(__dirname, 'public-surface.baseline.json');
const journalPath = join(packageRoot, 'tools', 'naming', 'public-renames.json');

const bundleNames = existsSync(artifactsCss)
  ? readdirSync(artifactsCss)
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

const THEME_IS_PUBLISHED = false;

const added = current.filter((name) => !baseline.includes(name));
const removed = baseline.filter((name) => !currentSet.has(name));

test('every fluent-next bundle publishes the same names', () => {
  const differing = surfaces
    .filter(({ names }) => names.join('\n') !== current.join('\n'))
    .map(({ name }) => name);

  expect(differing).toEqual([]);
});

const undocumented = (): string[] => (THEME_IS_PUBLISHED
  ? removed.filter((name) => !retired.has(name))
  : []);

test('no name leaves the published surface without a journal entry', () => {
  expect(undocumented()).toEqual([]);
});

if (process.env.UPDATE_NAMING_BASELINE === '1') {
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
