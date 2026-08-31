/*
 * Every fixed pixel size in the shared layer scss/widgets/base/** must end up in one of two states:
 * set from a theme, or classified with a marker saying why it stays.
 *
 * The layer is compiled once per bundle, so a number written into it reaches generic, material,
 * fluent and fluent-next at the same time. That makes it the opposite of the theme, where the bar is
 * zero unmarked (tests/fluent-next-size-markers.test.ts): 444 places cannot be classified in one
 * commit, and the layer belongs to the base owners, so this is a RATCHET. The counts are compared
 * against tests/base-size-markers.baseline.json and must only ever shrink. Regenerate it
 * deliberately, as part of a batch, with:
 *
 *   UPDATE_BASE_SIZE_BASELINE=1 pnpm test
 *
 * The scan is tools/sizes/inventory.mjs, which reads the places from tools/review/px-audit.mjs — the
 * same module the theme gate and SCALES.md are built from, so the three cannot disagree about what
 * counts as a place. It is driven as a child process because the tool is ESM and jest transforms
 * TypeScript only.
 */

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

type Summary = {
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
};

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
  /*
   * An independent count, so a scanner that quietly stops seeing a file cannot pass the ratchet by
   * reporting fewer places. Every literal is either in code (settable or base-owned) or in a
   * comment; nothing may fall between the buckets.
   */
  const raw = walk(baseRoot).reduce(
    (total, file) => total + (readFileSync(file, 'utf8').match(/-?\d*\.?\d+px\b/g)?.length ?? 0),
    0,
  );
  expect(summary.settable.occurrences + summary.owned.occurrences + summary.comments).toBe(raw);
});

test('no marker name is a substring of a custom property name used in the layer', () => {
  /*
   * Same trap as in the theme: the scan looks for the marker as a substring of the line's comment, so
   * a marker that reads like a custom property would match prose about that property. The layer reads
   * a handful of --dx-* names (cardView's grid columns, the scheduler animation offset), so it has to
   * be checked here too and not only against the theme.
   */
  const names = new Set(walk(baseRoot).flatMap((file) => [
    ...readFileSync(file, 'utf8').matchAll(/--(dx[a-z0-9-]*)/g),
  ].map(([, name]) => name)));
  const collisions = markers.flatMap((marker) => [...names]
    .filter((name) => name.includes(marker))
    .map((name) => `marker "${marker}" is contained in --${name}: rename the marker`));
  expect(collisions).toEqual([]);
});

// ---------------------------------------------------------------------------------------------
// ratchets
// ---------------------------------------------------------------------------------------------

const findings = {
  // Knobs the layer already offers that no theme turns: theme-side work, base stays untouched.
  openKnobs: summary.settable.open,
  // Places with no knob and no marker: the backlog this task works through, batch by batch.
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
