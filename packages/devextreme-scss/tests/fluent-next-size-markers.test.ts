import { execFileSync } from 'child_process';
import {
  mkdtempSync, readdirSync, readFileSync, writeFileSync,
} from 'fs';
import { tmpdir } from 'os';
import { basename, join } from 'path';

const packageRoot = join(__dirname, '..');
const themeRoot = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const baseRoot = join(packageRoot, 'scss', 'widgets', 'base');
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

interface Place {
  file: string; line: number; literals: string[]; text: string; variable?: string;
}

const run = <T>(args: string[]): T => {
  try {
    return JSON.parse(execFileSync(process.execPath, [tool, '--json', ...args], { encoding: 'utf8' })) as T;
  } catch (error) {
    const { stdout, status } = error as { stdout?: string; status?: number };
    if (!stdout) throw error;
    expect(status).toBe(1);
    return JSON.parse(stdout) as T;
  }
};

const audit = (root?: string): { marked: number; unmarked: Place[] } => run(root ? [`--root=${root}`] : []);
const auditBase = (root?: string): { unmarkedOwned: Place[]; openKnobs: Place[] } => run([
  '--layer=base', ...(root ? [`--root=${root}`] : []),
]);
const where = (place: Place): string => `${place.file}:${place.line} ${place.text}`;

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

test('every fixed px size in the shared layer is a knob or carries a marker', () => {
  expect(auditBase().unmarkedOwned.map(where)).toEqual([]);
});

test('fluent-next sets every px knob of the shared layer', () => {
  expect(auditBase().openKnobs.map((place) => `$${place.variable} at ${where(place)}`)).toEqual([]);
});

test('the shared-layer gate reads a declaration up to its semicolon', () => {
  const fixture = mkdtempSync(join(tmpdir(), 'fluent-next-px-audit-base-'));
  writeFileSync(join(fixture, '_knobs.scss'), [
    '$fixture-unset-shadow:',
    '  0 1px 2px red,',
    '  0 4px 8px blue !default;',
    '$fixture-local: 3px;',
    '@mixin fixture($size: 5px) {',
    '  margin: $size;',
    '}',
    '@mixin fixture-inline($gap: 1px) { margin: 2px; }',
    '@mixin fixture-wide(',
    '  $gap: 6px,',
    ') {',
    '  gap: $gap;',
    '}',
    '',
  ].join('\n'));

  const { unmarkedOwned, openKnobs } = auditBase(fixture);
  expect({
    unmarkedOwned: unmarkedOwned.map((place) => place.line),
    openKnobs: openKnobs.map((place) => `${place.line} ${place.variable}`),
  }).toEqual({
    unmarkedOwned: [4, 8],
    openKnobs: ['2 fixture-unset-shadow', '3 fixture-unset-shadow'],
  });
});

test('no marker name is a substring of a custom property name used in the theme or the shared layer', () => {
  const names = new Set([...walk(themeRoot), ...walk(baseRoot)].flatMap((file) => [
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
