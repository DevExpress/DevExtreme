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

interface Place { file: string; line: number; literals: string[]; text: string }

const audit = (root?: string): { marked: number; unmarked: Place[] } => {
  const args = [tool, '--json', ...(root ? [`--root=${root}`] : [])];
  const parse = (json: string): { marked: number; unmarked: Place[] } => JSON.parse(json) as {
    marked: number; unmarked: Place[];
  };
  try {
    return parse(execFileSync(process.execPath, args, { encoding: 'utf8' }));
  } catch (error) {
    const { stdout, status } = error as { stdout?: string; status?: number };
    if (!stdout) throw error;
    expect(status).toBe(1);
    return parse(stdout);
  }
};

test('every fixed px size in fluent-next carries a classification marker', () => {
  const { unmarked } = audit();
  expect(unmarked.map((place) => `${place.file}:${place.line} (${place.literals.join(', ')}) `
    + `${place.text}\n    pick a marker: ${markers.join(', ')} — see tools/review/size-markers.json`))
    .toEqual([]);
});

test('the gate rejects a new unmarked literal', () => {
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
  const names = new Set(walk(themeRoot).flatMap((file) => [
    ...readFileSync(file, 'utf8').matchAll(/--(dx[a-z0-9-]*)/g),
  ].map(([, name]) => name)));
  const collisions = markers.flatMap((marker) => [...names]
    .filter((name) => name.includes(marker))
    .map((name) => `marker "${marker}" is contained in --${name}: rename the marker`));
  expect(collisions).toEqual([]);
});

test('glyph sizes read the spacing scale, not a typography one', () => {
  const TYPOGRAPHY = /ds\.\$(font-size|line-height|font-weight)-/;
  const GLYPH = /^\$[a-z0-9-]*(icon|glyph|chevron|arrow)[a-z0-9-]*\s*:/;
  const offenders = walk(themeRoot)
    .filter((file) => basename(file) === '_sizes.scss')
    .flatMap((file) => readFileSync(file, 'utf8').split('\n')
      .map((line, index) => ({ file, line, number: index + 1 }))
      .filter(({ line }) => GLYPH.test(line.trim()) && TYPOGRAPHY.test(line))
      .map(({ file: f, number }) => `${f.replace(`${packageRoot}/`, '')}:${number}`));
  expect(offenders).toEqual([]);
});
