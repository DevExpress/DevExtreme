/*
 * The fixed-px gate for fluent-next: a px literal carrying none of the markers listed in
 * tools/review/size-markers.json does not pass.
 *
 *   node tools/review/px-audit.mjs                   # unmarked places; exits 1 when it finds any
 *   node tools/review/px-audit.mjs --json            # the same, machine-readable (jest uses this)
 *   node tools/review/px-audit.mjs --root=<dir>      # scan another tree; the test points this at a
 *                                                    # fixture to prove the gate still bites
 *   node tools/review/px-audit.mjs --layer=base [--json] [--root=<dir>]
 *                                                    # the shared layer, see below
 *
 * The marker records a decision about the value: an unmarked px literal is one nobody has
 * classified yet.
 *
 * The shared layer scss/widgets/base/** is compiled into every theme, so its px literals split in
 * two, and only one half needs a marker:
 *
 *   knob  — the literal is the default of a `$x: … !default` declaration or of a mixin parameter.
 *           A theme replaces it through `@use "…/base/x" with ($x: …)` (or an argument) and the
 *           other themes keep theirs. A module-variable knob fluent-next does not set is OPEN:
 *           the theme silently inherits a base size.
 *   owned — the literal is written where it applies (a rule, a mixin body, a local variable, a
 *           calc(), a @media condition). There is no knob, so it carries a marker like the theme.
 *
 * --layer=base fails on an owned place with no marker and on an open knob. A declaration is read
 * up to its `;`, so every line of a multi-line `!default` value counts as the knob.
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

const baseDir = join(packageRoot, 'scss', 'widgets', 'base');
const DECLARATION = /^\$([\w-]+)\s*:/;
const codeOf = (line) => split(line).code.trim();
const parensIn = (code) => (code.match(/\(/g)?.length ?? 0) - (code.match(/\)/g)?.length ?? 0);

const mixinParameterLines = (lines) => {
  const inside = new Set();
  let depth = 0;
  lines.forEach((line, index) => {
    const code = codeOf(line);
    if (depth === 0 && !/@mixin\b/.test(code)) return;
    if (depth > 0) inside.add(index + 1);
    depth = Math.max(0, depth + parensIn(code));
  });
  return inside;
};

// line -> the parameter list a `@mixin name(` line opens, up to its `)` if that is on the line
const signatureOpenings = (lines) => {
  const openings = new Map();
  lines.forEach((line, index) => {
    const code = codeOf(line);
    const at = /@mixin\s+[\w-]+\s*\(/.exec(code);
    if (!at) return;
    let depth = 0;
    let end = at.index + at[0].length - 1;
    for (; end < code.length; end += 1) {
      if (code[end] === '(') depth += 1;
      if (code[end] === ')') depth -= 1;
      if (depth === 0) break;
    }
    openings.set(index + 1, code.slice(at.index, end + 1));
  });
  return openings;
};

// line -> the module-level declaration it belongs to, read up to its `;` at paren depth 0
const declarationLines = (lines, parameters) => {
  const owner = new Map();
  let open = null;
  lines.forEach((line, index) => {
    const code = codeOf(line);
    if (!open) {
      const name = DECLARATION.exec(code);
      if (!name || parameters.has(index + 1)) return;
      open = {
        name: name[1], lines: [], code: '', depth: 0,
      };
    }
    open.lines.push(index + 1);
    open.code += ` ${code}`;
    open.depth += parensIn(code);
    if (open.depth < 0 || (open.depth === 0 && /[{}]/.test(code))) {
      open = null;
      return;
    }
    if (open.depth === 0 && code.endsWith(';')) {
      const declaration = { name: open.name, isDefault: open.code.includes('!default') };
      open.lines.forEach((at) => owner.set(at, declaration));
      open = null;
    }
  });
  return owner;
};

const splitTopLevel = (body) => {
  const parts = [];
  let depth = 0;
  let current = '';
  [...body].forEach((character) => {
    if (character === '(') depth += 1;
    if (character === ')') depth -= 1;
    if (character === ',' && depth === 0) {
      parts.push(current);
      current = '';
      return;
    }
    current += character;
  });
  parts.push(current);
  return parts;
};

// the base variables fluent-next passes through `@use "…base…" with (…)`
const configuredByTheme = () => {
  const names = new Set();
  scssFiles(themeDir).forEach((file) => {
    const content = blankBlockComments(readFileSync(file, 'utf8'));
    [...content.matchAll(/@use\s+"([^"]*base[^"]*)"[^(\n]*with\s*\(/g)].forEach((match) => {
      let depth = 1;
      let at = match.index + match[0].length;
      while (at < content.length && depth > 0) {
        if (content[at] === '(') depth += 1;
        if (content[at] === ')') depth -= 1;
        at += 1;
      }
      const body = content.slice(match.index + match[0].length, at - 1).replace(/\/\/[^\n]*/g, '');
      splitTopLevel(body).forEach((part) => {
        const name = /^\s*\$([\w-]+)\s*:/.exec(part);
        if (name) names.add(name[1]);
      });
    });
  });
  return names;
};

export const auditBase = (root = baseDir) => {
  const { marked, unmarked } = scanPxLiterals(root);
  const configured = configuredByTheme();
  const linesOf = new Map();
  const unmarkedOwned = [];
  const openKnobs = [];

  [...marked, ...unmarked]
    .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line)
    .forEach((place) => {
      if (!linesOf.has(place.file)) {
        const lines = blankBlockComments(readFileSync(join(packageRoot, place.file), 'utf8')).split('\n');
        const parameters = mixinParameterLines(lines);
        linesOf.set(place.file, {
          parameters,
          openings: signatureOpenings(lines),
          declarations: declarationLines(lines, parameters),
        });
      }
      const { parameters, openings, declarations } = linesOf.get(place.file);
      if (parameters.has(place.line) && DECLARATION.test(codeOf(place.text))) return;
      // a default in the signature line itself is a parameter too; a literal after it is the body's
      const signature = openings.get(place.line);
      if (signature && !codeOf(place.text).replace(signature, '').match(PX_LITERAL)) return;

      const declaration = declarations.get(place.line);
      if (declaration?.isDefault) {
        if (!configured.has(declaration.name)) {
          openKnobs.push({ ...place, variable: declaration.name });
        }
        return;
      }
      if (!place.marker) unmarkedOwned.push(place);
    });

  return { unmarkedOwned, openKnobs };
};

const runBase = (root) => {
  const { unmarkedOwned, openKnobs } = auditBase(root);
  if (process.argv.includes('--json')) {
    process.stdout.write(`${JSON.stringify({ unmarkedOwned, openKnobs }, null, 2)}\n`);
  } else {
    unmarkedOwned.forEach((place) => process.stdout.write(`UNMARKED ${place.file}:${place.line}  ${place.text}\n`));
    openKnobs.forEach((place) => process.stdout.write(`OPEN ${place.file}:${place.line}  $${place.variable} — `
      + 'fluent-next does not set this knob; pass it through `@use … with (…)`\n'));
    process.stdout.write(`shared layer: ${unmarkedOwned.length} unmarked owned place(s), ${openKnobs.length} open knob(s)\n`);
  }
  process.exit(unmarkedOwned.length || openKnobs.length ? 1 : 0);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rootArgument = process.argv.find((argument) => argument.startsWith('--root='));
  const root = rootArgument ? rootArgument.slice('--root='.length) : undefined;
  if (process.argv.includes('--layer=base')) runBase(root);
  const { marked, unmarked } = scanPxLiterals(root);

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
