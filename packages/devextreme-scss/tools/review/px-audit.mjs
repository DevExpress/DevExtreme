/*
 * The fixed-px gate for fluent-next: a px literal carrying none of the markers listed in
 * tools/review/size-markers.json does not pass.
 *
 *   node tools/review/px-audit.mjs                   # unmarked places; exits 1 when it finds any
 *   node tools/review/px-audit.mjs --json            # the same, machine-readable (jest uses this)
 *   node tools/review/px-audit.mjs --root=<dir>      # scan another tree; the test points this at a
 *                                                    # fixture to prove the gate still bites
 *
 * An unmarked value never reaches SCALES.md, so design never sees it and no decision about it
 * exists. The marker is the only channel to the scales card, not decoration.
 *
 * The shared layer scss/widgets/base/** goes through tools/sizes/inventory.mjs instead: it calls
 * scanPxLiterals directly and splits the places into theme-settable knobs and base-owned
 * literals, and tests/base-size-markers.test.ts holds the second set against a baseline — 444
 * places could not be classified in one commit, so there the count ratchets down instead of
 * having to be zero. The ratchet has since reached zero. Pointing --root at that tree does no
 * such split, so it still reports the `!default` knobs. The default run stays the theme.
 *
 * Deliberately out of scope: em/% values — those carry the dx-relative marker but have no gate of
 * their own.
 */

import { readFileSync, readdirSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const themeDir = join(packageRoot, 'scss', 'widgets', 'fluent-next');

const vocabulary = JSON.parse(readFileSync(join(here, 'size-markers.json'), 'utf8'));
export const MARKERS = vocabulary.categories.map((entry) => entry.marker).filter(Boolean);

const PX_LITERAL = /-?\d*\.?\d+px\b/g;

const scssFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = join(dir, entry.name);
  if (entry.isDirectory()) return scssFiles(full);
  return entry.name.endsWith('.scss') ? [full] : [];
});

const blankBlockComments = (content) => content
  .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '));

const split = (line) => {
  const at = line.indexOf('//');
  return at === -1 ? { code: line, comment: '' } : { code: line.slice(0, at), comment: line.slice(at) };
};

const ENDS_STATEMENT = /[;{}]$/;
const endsStatement = (line) => ENDS_STATEMENT.test(split(line).code.trim());
const nonBlankAbove = (lines, index) => {
  for (let at = index - 1; at >= 0; at -= 1) if (lines[at].trim() !== '') return at;
  return -1;
};

const inheritedComment = (raw, index) => {
  const above = nonBlankAbove(raw, index);
  if (above === -1 || endsStatement(raw[above])) return '';

  let start = index;
  while (start > 0) {
    const previous = nonBlankAbove(raw, start);
    if (previous === -1 || endsStatement(raw[previous])) break;
    start = previous;
  }

  const isComment = (text) => text.startsWith('//') || text.startsWith('/*')
    || text.startsWith('*') || text.endsWith('*/');
  const parts = raw.slice(start, index)
    .map((line) => (isComment(line.trim()) ? line : split(line).comment));
  for (let at = start - 1; at >= 0; at -= 1) {
    const text = raw[at].trim();
    if (text === '' || !isComment(text)) break;
    parts.push(text);
    if (text.startsWith('/*')) break;
  }
  return parts.join('\n');
};

export const scanPxLiterals = (root = themeDir) => {
  const marked = [];
  const unmarked = [];
  scssFiles(root).forEach((file) => {
    const raw = readFileSync(file, 'utf8').split('\n');
    blankBlockComments(raw.join('\n')).split('\n').forEach((line, index) => {
      const { code, comment } = split(line);
      const literals = code.match(PX_LITERAL);
      if (!literals) return;
      const scope = comment || inheritedComment(raw, index);
      const marker = MARKERS.find((entry) => scope.includes(entry)) ?? null;
      const place = {
        file: relative(packageRoot, file),
        line: index + 1,
        literals: [...new Set(literals)],
        occurrences: literals.length,
        marker,
        text: line.trim(),
      };
      (marker ? marked : unmarked).push(place);
    });
  });
  return { marked, unmarked };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rootArgument = process.argv.find((argument) => argument.startsWith('--root='));
  const { marked, unmarked } = scanPxLiterals(rootArgument ? rootArgument.slice('--root='.length) : undefined);

  if (process.argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify({ marked: marked.length, unmarked }, null, 2)}\n`);
  } else {
    const byMarker = MARKERS
      .map((marker) => `${marker} ${marked.filter((place) => place.marker === marker).length}`)
      .join(', ');
    process.stdout.write(`px literals in the theme: ${marked.length + unmarked.length} — ${byMarker}\n`);
    unmarked.forEach((place) => process.stdout.write(`UNMARKED ${place.file}:${place.line}  ${place.text}\n`));
    if (unmarked.length) {
      process.stdout.write(`\n${unmarked.length} place(s) with no marker. Append `
        + '`// <marker>: what the value is` to the line, picking a marker from tools/review/size-markers.json:\n'
        + `${vocabulary.categories.filter((entry) => entry.marker)
          .map((entry) => `  ${entry.marker.padEnd(20)}${entry.title} — ${entry.question}`).join('\n')}\n`);
    }
  }
  process.exit(unmarked.length ? 1 : 0);
}
