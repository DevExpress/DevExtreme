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
 * Deliberately out of scope: scss/widgets/base/** (the shared layer belongs to the base owners),
 * and em/% values — those carry the dx-relative marker but have no gate of their own.
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

export const scanPxLiterals = (root = themeDir) => {
  const marked = [];
  const unmarked = [];
  scssFiles(root).forEach((file) => {
    blankBlockComments(readFileSync(file, 'utf8')).split('\n').forEach((line, index) => {
      const { code, comment } = split(line);
      const literals = code.match(PX_LITERAL);
      if (!literals) return;
      const marker = MARKERS.find((entry) => comment.includes(entry)) ?? null;
      const place = {
        file: relative(packageRoot, file),
        line: index + 1,
        literals: [...new Set(literals)],
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
