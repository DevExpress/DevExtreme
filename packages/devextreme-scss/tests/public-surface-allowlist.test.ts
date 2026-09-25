import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

interface KeptEntry {
  name: string;
  reason: string;
  since: string;
}

interface Registry {
  kept: KeptEntry[];
  pending: string[];
}

interface RenameEntry {
  name: string;
  replacement: string | null;
}

const packageRoot = process.cwd();
const artifactsCss = join(packageRoot, '..', 'devextreme', 'artifacts', 'css');
const allowlistPath = join(packageRoot, 'tools', 'review', 'public-surface-allowlist.json');
const renamesPath = join(packageRoot, 'tools', 'naming', 'public-renames.json');
const unreadTierPath = join(packageRoot, 'tools', 'review', 'unread-tier.json');
const baselinePath = join(packageRoot, 'tests', 'fluent-next-naming.baseline.json');

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

const registry: Registry = JSON.parse(readFileSync(allowlistPath, 'utf8'));
const { kept, pending } = registry;
const renames: { retired: RenameEntry[] } = JSON.parse(readFileSync(renamesPath, 'utf8'));
const retiredNames = new Set(renames.retired.map(({ name }) => name));

const NAME = /^--dx-[a-z0-9]+(-[a-z0-9]+)*$/;

const occurrences = (
  where: { name: string; css: string }[],
  variable: string,
): string[] => {
  const pattern = new RegExp(`${variable}(?![\\w-])`);
  return where.filter(({ css }) => pattern.test(css)).map(({ name }) => name);
};

test('every kept entry is complete', () => {
  const malformed = kept.filter((entry) => !NAME.test(entry.name) || !entry.reason || !entry.since);

  expect(malformed.map(({ name }) => name)).toEqual([]);
});

test('the allowlist lists each kept name once', () => {
  const names = kept.map(({ name }) => name);

  expect(names.filter((name, index) => names.indexOf(name) !== index)).toEqual([]);
});

test('the pending list has no duplicates and no malformed names', () => {
  expect(pending.filter((name) => !NAME.test(name))).toEqual([]);
  expect(pending.filter((name, index) => pending.indexOf(name) !== index)).toEqual([]);
});

test('kept and pending do not overlap', () => {
  const keptNames = new Set(kept.map(({ name }) => name));
  const overlap = pending.filter((name) => keptNames.has(name));

  expect(overlap).toEqual([]);
});

test('kept and retired are mutually exclusive', () => {
  const overlap = kept.map(({ name }) => name).filter((name) => retiredNames.has(name));

  expect(overlap).toEqual([]);
});

test('every kept name still ships in some fluent-next bundle', () => {
  const missing = kept
    .map(({ name }) => name)
    .filter((name) => occurrences(bundles, name).length === 0);

  expect(missing).toEqual([]);
});

test('every name either gate flags is decided — kept, pending, or retired', () => {
  const unreadTier: { names: string[] } = JSON.parse(readFileSync(unreadTierPath, 'utf8'));
  const baseline: { publicSurfaceUnused: string[] } = JSON.parse(readFileSync(baselinePath, 'utf8'));
  const flagged = new Set([...unreadTier.names, ...baseline.publicSurfaceUnused]);

  const keptNames = new Set(kept.map(({ name }) => name));
  const pendingNames = new Set(pending);

  const undecided = [...flagged]
    .filter((name) => !keptNames.has(name) && !pendingNames.has(name) && !retiredNames.has(name));

  expect(undecided.sort()).toEqual([]);
});
