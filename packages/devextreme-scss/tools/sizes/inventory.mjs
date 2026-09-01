/*
 * The inventory of fixed sizes in the SHARED layer scss/widgets/base/**.
 *
 *   node tools/sizes/inventory.mjs            # write the lists, print the summary
 *   node tools/sizes/inventory.mjs --check    # read-only; exit 1 if a list on disk is stale
 *   node tools/sizes/inventory.mjs --json     # read-only; the summary, machine-readable (jest uses this)
 *
 * The layer is compiled once per bundle, so a value written into it reaches generic, material,
 * fluent and fluent-next at the same time. That is why the sizes are split in two, and the split is
 * not a matter of taste:
 *
 *   theme-settable — the literal is the default of a `$x: … !default` declaration. The knob already
 *                    exists: a theme passes its own value through `@use "…/base/x" with ($x: …)` and
 *                    the other themes keep the default, byte for byte. Nothing in base has to change.
 *   base-owned     — the literal is written where it applies: in a rule, a mixin body, a local
 *                    variable with no `!default`, a calc(), a @media condition. There is no knob, so
 *                    opening one means editing the shared layer, which is the base owners' call.
 *
 * The scan is tools/review/px-audit.mjs — the same module the gate and SCALES.md are built from, so
 * the inventory cannot claim a different set of places than the gate enforces.
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

import { scanPxLiterals } from '../review/px-audit.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const baseDir = join(packageRoot, 'scss', 'widgets', 'base');
const themeDir = join(packageRoot, 'scss', 'widgets', 'fluent-next');
const listsDir = join(here, 'lists');

/* --------------------------------------------------------------- classifying */

/*
 * A category answers "why is there no knob here", because that decides the cost of making one:
 *   local-var  — a `$x: 25px` with no `!default`; adding `!default` is the whole job.
 *   mixin-arg  — inside a @mixin body or its call; module variables cannot reach it, a parameter can.
 *   media      — a @media/@container condition; var() is invalid there, so no knob can ever exist.
 *   structural — an off-screen parking coordinate, not a size anyone designs.
 *   geometry   — box-shadow / outline / border / clip-path numbers, judged as a shape, not a step.
 *   calc       — already inside a calc(); a knob has to keep the arithmetic valid for both forms.
 *   inline     — a plain declaration, the ordinary case.
 */
/* A parking coordinate, not a size: nothing anyone designs is a thousand pixels across. */
const OFF_SCREEN_PX = 1000;
const isOffScreen = (code) => (code.match(/-?\d*\.?\d+px\b/g) ?? [])
  .some((literal) => Math.abs(parseFloat(literal)) >= OFF_SCREEN_PX);
const GEOMETRY = /^(?:box-shadow|outline|outline-offset|outline-width|border|border-\w+|border-\w+-\w+|clip|clip-path)\s*:/;

const codeOf = (text) => {
  const at = text.indexOf('//');
  return (at === -1 ? text : text.slice(0, at)).trim();
};

const categoryOf = (code) => {
  if (/^\$[\w-]+\s*:/.test(code)) return 'local-var';
  if (code.includes('@media') || code.includes('@container')) return 'media';
  if (code.startsWith('@include') || code.startsWith('@mixin')) return 'mixin-arg';
  if (isOffScreen(code)) return 'structural';
  if (GEOMETRY.test(code)) return 'geometry';
  if (code.includes('calc(')) return 'calc';
  return 'inline';
};

/*
 * Lines inside a `@mixin name(…)` parameter list. A literal there is a knob too, even though it is
 * not a `$x: … !default` declaration: the theme sets it by passing an argument, and the default is
 * what every other theme keeps. An `@include` argument list is the opposite — a call site, not a
 * knob — so only `@mixin` opens a signature here.
 */
const signatureCache = new Map();
const mixinParameterLines = (file) => {
  if (signatureCache.has(file)) return signatureCache.get(file);
  const inside = new Set();
  let depth = 0;
  blankBlockComments(readFileSync(join(packageRoot, file), 'utf8')).split('\n').forEach((line, index) => {
    const code = codeOf(line);
    const opening = depth === 0 && /@mixin\b/.test(code);
    if (!opening && depth === 0) return;
    if (depth > 0) inside.add(index + 1);
    depth += (code.match(/\(/g)?.length ?? 0) - (code.match(/\)/g)?.length ?? 0);
    if (depth < 0) depth = 0;
  });
  signatureCache.set(file, inside);
  return inside;
};

/** The widget a file belongs to: `_toast.scss` -> toast, `scheduler/views/_index.scss` -> scheduler. */
const widgetOf = (file) => {
  const [head, ...rest] = relative('scss/widgets/base', file).split('/');
  return rest.length ? head : head.replace(/^_/, '').replace(/\.scss$/, '');
};

/* ------------------------------------------------- what the theme already sets */

const scssFiles = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = join(dir, entry.name);
  if (entry.isDirectory()) return scssFiles(full);
  return entry.name.endsWith('.scss') ? [full] : [];
});

const blankBlockComments = (content) => content
  .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '));

/*
 * `@use "…/base/x" with (…)` is the only channel into the layer, and the block spans many lines with
 * nested parens (`var(--dx-a, 4px)`), so it is read by balancing brackets. A one-line regex here
 * silently under-reports: it finds a few dozen of the 300-odd names that are actually configured.
 */
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

const readThemeConfiguration = () => {
  const setBy = new Map();
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
        if (!name) return;
        const value = part.slice(part.indexOf(':') + 1).trim().replace(/\s+/g, ' ');
        setBy.set(name[1], {
          file: relative(packageRoot, file),
          value,
        });
      });
    });
  });
  return setBy;
};

/* ------------------------------------------------------------------ the lists */

const build = () => {
  const { marked, unmarked } = scanPxLiterals(baseDir);
  const places = [...marked, ...unmarked]
    .sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
  const setBy = readThemeConfiguration();

  const settable = [];
  const owned = [];

  places.forEach((place) => {
    const code = codeOf(place.text);
    const declaration = /^\$([\w-]+)\s*:/.exec(code);
    const parameter = Boolean(declaration) && mixinParameterLines(place.file).has(place.line);
    const isKnob = Boolean(declaration) && (code.includes('!default') || parameter);
    const common = {
      file: place.file,
      line: place.line,
      widget: widgetOf(place.file),
      literals: place.literals,
      occurrences: place.occurrences,
      marker: place.marker,
      text: place.text,
    };

    if (isKnob) {
      const configured = setBy.get(declaration[1]);
      settable.push({
        ...common,
        variable: declaration[1],
        kind: parameter ? 'mixin-parameter' : 'module-variable',
        status: parameter ? 'parameter' : (configured ? 'injected' : 'open'),
        ...(configured && !parameter ? { setBy: configured.file, setTo: configured.value } : {}),
      });
      return;
    }
    owned.push({ ...common, category: categoryOf(code) });
  });

  return { settable, owned };
};

const tally = (rows, key) => rows.reduce((totals, row) => {
  totals[row[key]] = (totals[row[key]] ?? 0) + row.occurrences;
  return totals;
}, {});

const descending = (totals) => Object.fromEntries(
  Object.entries(totals).sort(([, a], [, b]) => b - a),
);

const sum = (rows) => rows.reduce((total, row) => total + row.occurrences, 0);

/* ------------------------------------------------------------------- reports */

const GENERATED = 'GENERATED by tools/sizes/inventory.mjs — do not edit by hand. '
  + 'Judgment calls belong in that script, not in this file.';

const settableJson = (settable) => ({
  $comment: [
    GENERATED,
    'Sizes the theme can set from outside without touching the shared layer: the literal is the '
    + 'default of a `$x: … !default` declaration, so `@use "…/base/x" with ($x: …)` replaces it for '
    + 'one theme and leaves the default — and every other theme — untouched.',
    'kind "module-variable" — a `$x: … !default` declaration; "mixin-parameter" — a default in a '
    + '`@mixin name(…)` signature, which a theme replaces by passing an argument.',
    'status "injected" — fluent-next already passes a value; "open" — the knob exists and nobody '
    + 'turns it; "parameter" — a mixin parameter, where the signature itself is the channel and there '
    + 'is nothing to cross-check by name. An "open" row is theme-side work only.',
    'The match is by variable name. A name declared in a nested module is only reachable once the '
    + 'parent forwards it (see base/chat/_index.scss), which is why an "open" row can sit next to '
    + 'injected ones from the same widget.',
  ],
  summary: {
    occurrences: sum(settable),
    variables: new Set(settable.map((row) => row.variable)).size,
    injected: sum(settable.filter((row) => row.status === 'injected')),
    open: sum(settable.filter((row) => row.status === 'open')),
    parameters: sum(settable.filter((row) => row.status === 'parameter')),
  },
  places: settable,
});

const ownedJson = (owned) => ({
  $comment: [
    GENERATED,
    'Sizes nailed into the shared layer: no `!default` declaration holds them, so opening one means '
    + 'editing scss/widgets/base/** — which every theme compiles. Each place needs either a knob '
    + '(and proof the other themes did not move) or a marker saying why it stays.',
    'category — why there is no knob today: local-var (a $x with no !default), mixin-arg (inside a '
    + '@mixin body or call), media (a @media condition, where var() is invalid), structural (an '
    + 'off-screen parking coordinate, not a designed size), geometry (box-shadow / outline / border '
    + '/ clip-path numbers), calc (already inside a calc()), inline (a plain declaration).',
    'marker — the classification comment already on the line, from tools/review/size-markers.json.',
  ],
  summary: {
    occurrences: sum(owned),
    byCategory: descending(tally(owned, 'category')),
    byWidget: descending(tally(owned, 'widget')),
    unmarked: sum(owned.filter((row) => !row.marker)),
    // The backlog proper: what still has neither a knob nor a marker. `byWidget` above counts the
    // classified places too, so the two differ wherever a batch has already been through.
    unmarkedByWidget: descending(tally(owned.filter((row) => !row.marker), 'widget')),
  },
  places: owned,
});

const agenda = (settable, owned, comments) => {
  // The agenda is a to-do list: a place that already carries a marker is a decision, not an item.
  const backlog = owned.filter((row) => !row.marker);
  const byWidget = descending(tally(backlog, 'widget'));
  const categories = Object.keys(descending(tally(backlog, 'category')));
  const lines = [
    '# Fixed sizes in the shared layer',
    '',
    `_${GENERATED}_`,
    '',
    'The layer `scss/widgets/base/**` is compiled once per bundle, so a size written into it reaches',
    'generic, material, fluent and fluent-next at the same time. This is the agenda for the base',
    'owners: for every number below, either the theme gets a knob, or the number is agreed to stay',
    'and carries a marker saying why.',
    '',
    '## Totals',
    '',
    '| | occurrences |',
    '|---|---|',
    `| a raw grep of the layer | ${sum(settable) + sum(owned) + comments} |`,
    `| …of those, inside comments (commented-out code, prose) | ${comments} |`,
    `| **in code** | **${sum(settable) + sum(owned)}** |`,
    `| — the theme can already set from outside | ${sum(settable)} |`,
    `| — nailed into the shared layer | ${sum(owned)} |`,
    '',
    '## What the theme can already set',
    '',
    `${sum(settable)} occurrences in ${new Set(settable.map((row) => row.variable)).size} \`!default\` variables. `
    + `fluent-next already passes ${sum(settable.filter((row) => row.status === 'injected'))}; `
    + `${sum(settable.filter((row) => row.status === 'open'))} are open knobs nobody turns.`,
    '',
    ...(settable.some((row) => row.status === 'open') ? [
      'Open knobs — theme-side work, the shared layer stays untouched:',
      '',
      ...settable.filter((row) => row.status === 'open')
        .map((row) => `- \`$${row.variable}\` — ${row.file}:${row.line}`),
      '',
    ] : []),
    '## What is nailed into the layer',
    '',
    `| widget | ${categories.join(' | ')} | total |`,
    `|---|${categories.map(() => '---').join('|')}|---|`,
    ...Object.keys(byWidget).map((widget) => {
  const rows = backlog.filter((row) => row.widget === widget);
      const counts = categories.map((category) => sum(rows.filter((row) => row.category === category)) || '');
      return `| ${widget} | ${counts.join(' | ')} | **${byWidget[widget]}** |`;
    }),
    '',
    '## Places, by widget',
    '',
  ];

  Object.keys(byWidget).forEach((widget) => {
    lines.push(`### ${widget} — ${byWidget[widget]}`, '');
    backlog.filter((row) => row.widget === widget).forEach((row) => {
      lines.push(`- \`${row.file}:${row.line}\` · ${row.category}`, `  \`${row.text}\``);
    });
    lines.push('');
  });

  return `${lines.join('\n')}`;
};

/* --------------------------------------------------------------------- output */

/* The raw grep counts px inside comments too; the scan does not. Report the gap instead of hiding it. */
const commentedOccurrences = () => {
  const px = /-?\d*\.?\d+px\b/g;
  return scssFiles(baseDir).reduce((total, file) => {
    const content = readFileSync(file, 'utf8');
    const inCode = blankBlockComments(content).split('\n')
      .reduce((count, line) => count + (codeOf(line).match(px)?.length ?? 0), 0);
    return total + ((content.match(px)?.length ?? 0) - inCode);
  }, 0);
};

export const inventory = () => {
  const { settable, owned } = build();
  const comments = commentedOccurrences();
  return {
    comments,
    settable: {
      occurrences: sum(settable),
      variables: new Set(settable.map((row) => row.variable)).size,
      injected: sum(settable.filter((row) => row.status === 'injected')),
      open: sum(settable.filter((row) => row.status === 'open')),
      parameters: sum(settable.filter((row) => row.status === 'parameter')),
    },
    owned: {
      occurrences: sum(owned),
      unmarked: sum(owned.filter((row) => !row.marker)),
      byCategory: descending(tally(owned, 'category')),
      byWidget: descending(tally(owned.filter((row) => !row.marker), 'widget')),
    },
    artefacts: [
      ['theme-settable.json', `${JSON.stringify(settableJson(settable), null, 2)}\n`],
      ['base-owned.json', `${JSON.stringify(ownedJson(owned), null, 2)}\n`],
      ['BASE-SIZES.md', agenda(settable, owned, comments)],
    ],
  };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const {
    comments, settable, owned, artefacts,
  } = inventory();
  const check = process.argv.includes('--check');
  const json = process.argv.includes('--json');

  const stale = artefacts.filter(([name, content]) => {
    try {
      return readFileSync(join(listsDir, name), 'utf8') !== content;
    } catch {
      return true;
    }
  });
  // --check and --json are read-only: the gate must not rewrite the tree it is judging.
  if (!check && !json) artefacts.forEach(([name, content]) => writeFileSync(join(listsDir, name), content));

  if (json) {
    process.stdout.write(`${JSON.stringify({ comments, settable, owned }, null, 2)}\n`);
  } else {
    process.stdout.write([
      `raw grep of scss/widgets/base: ${settable.occurrences + owned.occurrences + comments} px `
      + `occurrences (${comments} of them inside comments)`,
      `in code: ${settable.occurrences + owned.occurrences}`,
      `  theme-settable ${settable.occurrences}  (injected ${settable.injected}, open ${settable.open}, `
      + `mixin parameters ${settable.parameters})`,
      `  base-owned     ${owned.occurrences}  ${Object.entries(owned.byCategory)
        .map(([category, count]) => `${category} ${count}`).join(', ')}`,
      `  of those still unclassified: ${owned.unmarked}`,
      '',
    ].join('\n'));
  }

  if (check && stale.length) {
    process.stdout.write(`stale: ${stale.map(([name]) => name).join(', ')} — run node tools/sizes/inventory.mjs\n`);
    process.exit(1);
  }
}
