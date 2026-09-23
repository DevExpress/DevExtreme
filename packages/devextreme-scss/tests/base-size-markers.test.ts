import { execFileSync } from 'child_process';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const packageRoot = process.cwd();
const baseRoot = join(packageRoot, 'scss', 'widgets', 'base');
const tool = join(packageRoot, 'tools', 'sizes', 'inventory.mjs');
const baselinePath = join(__dirname, 'base-size-markers.baseline.json');
const updatingBaseline = process.env.UPDATE_BASE_SIZE_BASELINE === '1';

const vocabulary = JSON.parse(
  readFileSync(join(packageRoot, 'tools', 'review', 'size-markers.json'), 'utf8'),
);
const markers: string[] = vocabulary.categories
  .map((category: { marker: string | null }) => category.marker)
  .filter(Boolean);

interface Summary {
  comments: number;
  settable: {
    occurrences: number; variables: number; injected: number; open: number;
  };
  owned: {
    occurrences: number;
    unmarked: number;
    byCategory: Record<string, number>;
    byWidget: Record<string, number>;
  };
}

const summary: Summary = JSON.parse(
  execFileSync(process.execPath, [tool, '--json'], { encoding: 'utf8', cwd: packageRoot }),
);

const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.scss') ? [full] : [];
  });

test('the inventory accounts for every px literal in the layer', () => {
  const raw = walk(baseRoot).reduce(
    (total, file) => total + (readFileSync(file, 'utf8').match(/-?\d*\.?\d+px\b/g)?.length ?? 0),
    0,
  );
  expect(summary.settable.occurrences + summary.owned.occurrences + summary.comments).toBe(raw);
});

test('the generated inventory lists are not stale', () => {
  let failure: string | null = null;

  try {
    execFileSync(process.execPath, [tool, '--check'], { encoding: 'utf8', cwd: packageRoot, stdio: 'pipe' });
  } catch {
    failure = 'tools/sizes/lists/* are out of date — run: node tools/sizes/inventory.mjs';
  }

  expect(failure).toBeNull();
});

test('no marker name is a substring of a custom property name used in the layer', () => {
  const names = new Set(walk(baseRoot).flatMap((file) => [
    ...readFileSync(file, 'utf8').matchAll(/--(dx[a-z0-9-]*)/g),
  ].map(([, name]) => name)));
  const collisions = markers.flatMap((marker) => [...names]
    .filter((name) => name.includes(marker))
    .map((name) => `marker "${marker}" is contained in --${name}: rename the marker`));
  expect(collisions).toEqual([]);
});

const findings = {
  openKnobs: summary.settable.open,
  unclassified: summary.owned.unmarked,
  unclassifiedByWidget: summary.owned.byWidget,
};

if (updatingBaseline) {
  test('baseline regenerated', () => {
    writeFileSync(baselinePath, `${JSON.stringify(findings, null, 2)}\n`);
    expect(true).toBe(true);
  });
} else {
  const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));

  Object.keys(findings).forEach((check) => {
    test(`${check} does not regress`, () => {
      expect(findings[check as keyof typeof findings]).toEqual(baseline[check]);
    });
  });
}
