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
 * The shared layer scss/widgets/base/** is scanned by tests/base-size-markers.test.ts, which points
 * --root at it and compares against a baseline: 444 places cannot be classified in one commit, and
 * the layer belongs to the base owners, so there the count ratchets down instead of having to be
 * zero. The default run stays the theme, where the bar is zero unmarked.
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

// Block comments are blanked, not removed: line numbers must survive, or the gate points at the
// wrong line.
const blankBlockComments = (content) => content
  .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '));

/** Line -> { code, comment }: the marker is looked up in the comment, the literal in the code. */
const split = (line) => {
  const at = line.indexOf('//');
  return at === -1 ? { code: line, comment: '' } : { code: line.slice(0, at), comment: line.slice(at) };
};

const ENDS_STATEMENT = /[;{}]$/;
const nonBlankAbove = (lines, index) => {
  for (let at = index - 1; at >= 0; at -= 1) if (lines[at].trim() !== '') return at;
  return -1;
};

/*
 * A marker is written next to the declaration it explains, but a px literal inside a multi-line
 * declaration lands on a continuation line, where there is no comment to find — the two-layer
 * box-shadow of cardView's dragged item and the clip-path of textEditor's label both carry a
 * reviewed marker that the line-by-line lookup could not see. So for a continuation line the
 * marker is inherited from the declaration: the trailing comments of its earlier lines plus the
 * comment attached above its first line, block comments included (those are blanked in `code`,
 * which is why the raw text is passed in separately).
 *
 * A line counts as a continuation only when the statement above it is unfinished, so a plain
 * `min-height: 1px;` never inherits anything from its neighbours.
 */
const inheritedComment = (raw, index) => {
  const above = nonBlankAbove(raw, index);
  if (above === -1 || ENDS_STATEMENT.test(raw[above].trim())) return '';

  let start = index;
  while (start > 0) {
    const previous = nonBlankAbove(raw, start);
    if (previous === -1 || ENDS_STATEMENT.test(raw[previous].trim())) break;
    start = previous;
  }

  // a comment line contributes its whole text (a block comment carries no `//` to split on);
  // a code line contributes only its trailing comment, so a marker can never be read out of code
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
        // distinct values drive the report; the raw count is what an inventory of the layer adds up
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
