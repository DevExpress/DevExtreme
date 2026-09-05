/*
 * Every fixed pixel size in fluent-next must be classified.
 *
 * A px literal with no marker is invisible: it never reaches SCALES.md, so design never sees it and
 * no decision about it exists (design#1555). The markers are the only channel, so a new unmarked
 * literal fails here rather than silently joining the backlog.
 *
 * The scan itself lives in tools/review/px-audit.mjs — the same module the report is built from, so
 * the gate and SCALES.md can never disagree about what counts as marked. This test drives it as a
 * child process because the tool is ESM and jest transforms TypeScript only.
 */

import { execFileSync } from 'child_process';
import {
  mkdtempSync, readdirSync, readFileSync, writeFileSync,
} from 'fs';
import { tmpdir } from 'os';
import { basename, join } from 'path';

const packageRoot = process.cwd();
const themeRoot = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const tool = join(packageRoot, 'tools', 'review', 'px-audit.mjs');

const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.scss') ? [full] : [];
  });
const vocabulary = JSON.parse(
  readFileSync(join(packageRoot, 'tools', 'review', 'size-markers.json'), 'utf8'),
);
const markers: string[] = vocabulary.categories
  .map((category: { marker: string | null }) => category.marker)
  .filter(Boolean);

type Place = { file: string; line: number; literals: string[]; text: string };

const audit = (root?: string): { marked: number; unmarked: Place[] } => {
  const args = [tool, '--json', ...(root ? [`--root=${root}`] : [])];
  try {
    return JSON.parse(execFileSync(process.execPath, args, { encoding: 'utf8' }));
  } catch (error) {
    // a non-empty scan exits 1 by design — the payload is still on stdout
    const { stdout, status } = error as { stdout?: string; status?: number };
    if (!stdout) throw error;
    expect(status).toBe(1);
    return JSON.parse(stdout);
  }
};

test('every fixed px size in fluent-next carries a classification marker', () => {
  const { unmarked } = audit();
  expect(unmarked.map((place) => `${place.file}:${place.line} (${place.literals.join(', ')}) `
    + `${place.text}\n    pick a marker: ${markers.join(', ')} — see tools/review/size-markers.json`))
    .toEqual([]);
});

test('the gate rejects a new unmarked literal', () => {
  // negative self-check: a green gate must mean "nothing to find", not "the scan stopped working"
  const fixture = mkdtempSync(join(tmpdir(), 'fluent-next-px-audit-'));
  writeFileSync(join(fixture, '_marked.scss'), [
    '.dx-widget {',
    '  padding: 3px; // dx-fixed-size: 3px',
    '  /* 7px inside a block comment is not code */',
    '  margin: 4px; // a note that says 5px is not a marker either',
    '}',
    '',
  ].join('\n'));
  writeFileSync(join(fixture, '_unmarked.scss'), '.dx-widget {\n  border-width: 6px;\n}\n');

  const { marked, unmarked } = audit(fixture);
  expect({
    marked,
    unmarked: unmarked.map((place) => `${basename(place.file)}:${place.line} ${place.text}`).sort(),
  }).toEqual({
    marked: 1,
    unmarked: [
      '_marked.scss:4 margin: 4px; // a note that says 5px is not a marker either',
      '_unmarked.scss:2 border-width: 6px;',
    ],
  });
});

test('no marker name is a substring of a custom property name used in the theme', () => {
  /*
   * The scan looks for the marker as a substring of the line's comment, so a marker that reads like
   * a custom property would match prose about that property. `dx-border-width` was rejected for
   * exactly this reason: the theme declares `--dx-border-width`, and a comment mentioning it would
   * have filed that line under "border thickness".
   */
  const names = new Set(walk(themeRoot).flatMap((file) => [
    ...readFileSync(file, 'utf8').matchAll(/--(dx[a-z0-9-]*)/g),
  ].map(([, name]) => name)));
  const collisions = markers.flatMap((marker) => [...names]
    .filter((name) => name.includes(marker))
    .map((name) => `marker "${marker}" is contained in --${name}: rename the marker`));
  expect(collisions).toEqual([]);
});
