/*
 * Proposes mapping entries for one folder, so a batch is reviewed as a diff instead of typed by hand.
 *
 *   node tools/naming/propose.mjs --folder=treeView            # report
 *   node tools/naming/propose.mjs --folder=treeView --json     # paste-ready mapping fragment
 *   node tools/naming/propose.mjs --all                        # how much of the rest is mechanical
 *
 * A proposal is only ever a starting point: it rewrites the spellings the standard has already
 * rejected (`hover` -> `hovered`, `padding-left` -> `padding-inline-start`, …), drops the theme
 * prefix and the legacy component spelling, moves a trailing state to the end and adds `rest` where
 * `_colors.scss` requires it. What it CANNOT do is decide anatomy: whether `filter-icon` is a
 * sub-element of this component or a lie about the selector is a question only reading the CSS
 * answers, and that is exactly what the per-batch review is for.
 *
 * So the output is split in two: names whose proposal already satisfies the grammar (mechanical, and
 * still to be eyeballed for meaning), and names the grammar rejects, each with the reason — those
 * need a human and a look at the selector.
 *
 * Deliberately not proposed: theme identity, base-parameter mirrors (their spelling belongs to base)
 * and anything already inside its component's namespace.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const themeRoot = join(packageRoot, 'scss', 'widgets', 'dxdsfluent');
const baseRoot = join(packageRoot, 'scss', 'widgets', 'base');
const registries = JSON.parse(readFileSync(join(here, 'registries.json'), 'utf8'));
const mapping = JSON.parse(readFileSync(join(here, 'mapping.json'), 'utf8'));

const walk = (dir) => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  return statSync(absolute).isDirectory() ? walk(absolute) : [absolute];
}).filter((file) => file.endsWith('.scss'));

const stripComments = (content) => content
  .replace(/\/\/[^\n\r]*/g, '')
  .split(/\/\*|\*\//)
  .filter((_, index) => index % 2 === 0)
  .join('');

const withRanges = (content) => {
  const ranges = [];
  const opener = /\bwith\s*\(/g;
  let match = opener.exec(content);
  while (match !== null) {
    let depth = 1;
    let index = match.index + match[0].length;
    while (index < content.length && depth > 0) {
      if (content[index] === '(') depth += 1;
      if (content[index] === ')') depth -= 1;
      index += 1;
    }
    ranges.push([match.index, index]);
    match = opener.exec(content);
  }
  return ranges;
};

/** `@mixin x(…)` / `@function x(…)` argument lists: `$a: $b` there is a parameter, not a variable. */
const signatureRanges = (content) => {
  const ranges = [];
  const opener = /@(?:mixin|function)\s+[\w-]+\s*\(/g;
  let match = opener.exec(content);
  while (match !== null) {
    let depth = 1;
    let index = match.index + match[0].length;
    while (index < content.length && depth > 0) {
      if (content[index] === '(') depth += 1;
      if (content[index] === ')') depth -= 1;
      index += 1;
    }
    ranges.push([match.index, index]);
    match = opener.exec(content);
  }
  return ranges;
};

const declaredIn = (file) => {
  const content = stripComments(readFileSync(file, 'utf8'));
  const ranges = [...withRanges(content), ...signatureRanges(content)];
  const names = new Set();
  [...content.matchAll(/(^|[\s{;])\$([a-z0-9_-]+)\s*:/gi)].forEach((match) => {
    const position = match.index + match[1].length;
    if (ranges.some(([from, to]) => position >= from && position < to)) return;
    names.add(`$${match[2]}`);
  });
  return names;
};

// ---------------------------------------------------------------------------------------------
// grammar (a conservative twin of tests/dxdsfluent-naming.test.ts — see the header)
// ---------------------------------------------------------------------------------------------

const modifiers = Object.values(registries.modifiers).flat();
const longestFirst = (words) => [...words].sort((a, b) => b.length - a.length);

const grammarViolation = (name, component, isColors) => {
  const bare = name.slice(1);
  if (bare !== component && !bare.startsWith(`${component}-`)) {
    return new Error(`does not start with the component "${component}"`);
  }
  let rest = bare.slice(component.length).replace(/^-/, '');

  const state = longestFirst(registries.states)
    .find((candidate) => rest === candidate || rest.endsWith(`-${candidate}`));
  if (isColors && !state) return new Error('a name in _colors.scss must end with a state');
  if (state) rest = rest.slice(0, -state.length).replace(/-$/, '');

  const slots = isColors ? registries.parts : registries.sizeSlots;
  const slot = longestFirst(slots)
    .find((candidate) => rest === candidate || rest.endsWith(`-${candidate}`));
  if (!slot) {
    // The reason travels as an Error so --anatomy can group by the unresolved fragment, not by prose.
    const problem = new Error(`no ${isColors ? 'part' : 'size slot'} found in "${rest || '(empty)'}"`);
    problem.slot = rest;
    return problem;
  }
  rest = rest.slice(0, -slot.length).replace(/-$/, '');

  const middleWords = longestFirst([...(registries.subElements[component] ?? []), ...modifiers]);
  let middle = rest;
  while (middle) {
    const word = middleWords.find((candidate) => middle === candidate
      || middle.startsWith(`${candidate}-`));
    if (!word) {
      const problem = new Error(`"${middle}" is neither a sub-element of ${component} nor a modifier`);
      problem.middle = middle;
      return problem;
    }
    middle = middle.slice(word.length).replace(/^-/, '');
  }
  return null;
};

// ---------------------------------------------------------------------------------------------
// which part a bare `-color` is
// ---------------------------------------------------------------------------------------------

/*
 * The standard's rule for the 491 legacy `-color` names is "the CSS property decides, not the old
 * name" (NAMING.md, PARTS). That is mechanical as long as the variable is read by exactly one family
 * of properties, so the reads are collected once and the answer looked up per name. A variable read
 * by two families is a two-role variable — the dominant role wins, and that is a judgment call the
 * review has to make, so it is reported instead of guessed.
 */
const PROPERTY_PARTS = [
  [/^background(-color)?$/, 'bg'],
  [/^fill$/, 'bg'],
  [/^color$/, 'content'],
  [/^caret-color$/, 'content'],
  [/^-webkit-text-fill-color$/, 'content'],
  [/^border(-(top|right|bottom|left|block|inline)(-(start|end))?)?-color$/, 'border'],
  [/^outline-color$/, 'outline'],
  [/^box-shadow$/, 'shadow'],
  [/^stroke$/, 'border'],
  [/^text-decoration-color$/, 'content'],
];

const partsByVariable = (() => {
  const found = new Map();
  walk(themeRoot).forEach((file) => {
    const content = stripComments(readFileSync(file, 'utf8'));
    [...content.matchAll(/(^|[\s{;])([-a-z]+)\s*:([^;{}]*)/g)].forEach(([, , property, value]) => {
      const part = PROPERTY_PARTS.find(([pattern]) => pattern.test(property))?.[1];
      if (!part) return;
      [...value.matchAll(/(?<!\.)\$([a-z0-9_-]+)/g)].forEach(([, name]) => {
        const key = `$${name}`;
        found.set(key, (found.get(key) ?? new Set()).add(part));
      });
    });
  });
  return found;
})();

const partOf = (name) => {
  const parts = partsByVariable.get(name);
  return parts && parts.size === 1 ? [...parts][0] : null;
};

// ---------------------------------------------------------------------------------------------
// proposal
// ---------------------------------------------------------------------------------------------

/** Legacy spellings of a component: `treelist` for `tree-list`, `grouppanel` for `group-panel`. */
const squashed = (component) => component.replace(/-/g, '');

const replaceSegments = (name, table) => {
  let result = name;
  Object.entries(table)
    .sort(([a], [b]) => b.length - a.length)
    .forEach(([from, to]) => {
      // `radius` -> `border-radius` must not fire inside an already-correct `border-radius`, or the
      // proposal comes out as `border-border-radius`.
      const already = to.endsWith(from) && to !== from ? `${to.slice(0, -from.length)}` : null;
      result = result.replace(new RegExp(`(^|-)${from}(-|$)`, 'g'), (whole, before, after, offset) => {
        if (already && result.slice(0, offset + before.length).endsWith(already)) return whole;
        return `${before}${to}${after}`;
      });
    });
  return result;
};

const propose = (name, component, isColors) => {
  let bare = name.slice(1);

  // 0. squashed compounds -> their canonical hyphenated form (`treeview-item` -> `tree-view-item`)
  bare = replaceSegments(bare, registries.rejectedSpellings ?? {});

  // 0b. segments that name nothing (`root`, `state`, `common`, `renovation`) are dropped
  (registries.droppedSegments ?? []).forEach((word) => {
    bare = bare.replace(new RegExp(`(^|-)${word}(-|$)`, 'g'), (_, before, after) => (before && after ? '-' : ''));
  });

  // 1. theme prefix, wherever it sits: $fluent-x-y, $x-fluent-y
  bare = bare.replace(/(^|-)fluent(-|$)/g, (_, before, after) => (before && after ? '-' : ''));

  // 2. legacy component spelling at the front, so the canonical one can be put back
  [component, squashed(component), `${squashed(component)}s`].forEach((spelling) => {
    if (bare === spelling) bare = '';
    else if (bare.startsWith(`${spelling}-`)) bare = bare.slice(spelling.length + 1);
  });

  /*
   * 3. a bare `color` segment names no part; the property it is assigned to does. Qualified forms
   * (`background-color`, `border-color`, …) are already in `rejected.parts` and are left to step 4 —
   * touching them here would produce `bg-bg`.
   */
  if (isColors) {
    /*
     * When the reads do not settle it — because the variable is only ever handed to a base mixin,
     * which renames it — the legacy convention decides: in these themes a bare `-color` on a widget
     * or a sub-element IS the text colour, and the background has always been spelled `-bg`. Verified
     * on the mixins that consume them: $calendar-color arrives as $cell-text-color and lands in
     * `color:`, $speed-dial-action-color likewise. Qualified forms never reach this branch.
     */
    const part = partOf(name) ?? 'content';
    const QUALIFIED = /(background|border|outline|text|icon|glyph|shadow|caret|fill|stroke)$/;
    if (part) {
      bare = bare.replace(/(^|-)colors?(-|$)/g, (whole, before, after, offset) => (
        QUALIFIED.test(bare.slice(0, offset + before.length).replace(/-$/, ''))
          ? whole
          : `${before}${part}${after}`));
    }
  }

  /*
   * 4a. a physical word in the SLOT position is the CSS property; the same word earlier in the name is
   * a variant, so only the tail is rewritten. Longest match first, so `border-top-left-radius` wins
   * over `border-top`.
   */
  let canonicalTail = null;
  Object.entries(registries.rejectedTrailing ?? {})
    .sort(([a], [b]) => b.length - a.length)
    .some(([from, to]) => {
      if (bare !== from && !bare.endsWith(`-${from}`)) return false;
      bare = `${bare.slice(0, bare.length - from.length)}${to}`;
      canonicalTail = to;
      return true;
    });

  /*
   * 4b. rejected spellings: modifiers, parts, states and physical axes. A tail that step 4a already
   * made canonical is held out of this pass — otherwise `radius` -> `border-radius` fires a second
   * time inside `border-start-end-radius` and produces `border-start-end-border-radius`.
   */
  const tail = canonicalTail && bare.endsWith(canonicalTail)
    ? canonicalTail
    : null;
  let head = tail ? bare.slice(0, bare.length - tail.length).replace(/-$/, '') : bare;
  head = replaceSegments(head, registries.rejected.modifiers ?? {});
  head = replaceSegments(head, registries.rejected.states);
  head = replaceSegments(head, isColors ? registries.rejected.parts : registries.rejected.properties);
  bare = tail ? `${head}${head ? '-' : ''}${tail}` : head;
  // a squashed sub-element (`grouppanel`) only reads as one once it is hyphenated
  (registries.subElements[component] ?? []).forEach((sub) => {
    if (!sub.includes('-')) return;
    bare = bare.replace(new RegExp(`(^|-)${squashed(sub)}(-|$)`, 'g'), (_, before, after) => `${before}${sub}${after}`);
  });

  /*
   * 6. a trailing `-rtl` is a modifier, and modifiers precede the slot: `…-padding-rtl` is the RTL
   * variant of a padding, not a property called `rtl`.
   */
  if (!isColors && bare.endsWith('-rtl')) {
    const withoutRtl = bare.slice(0, -'-rtl'.length);
    const slot = longestFirst(registries.sizeSlots)
      .find((candidate) => withoutRtl === candidate || withoutRtl.endsWith(`-${candidate}`));
    if (slot) {
      bare = `${withoutRtl.slice(0, withoutRtl.length - slot.length)}rtl-${slot}`;
    }
  }

  // 7. a state belongs at the end, after the slot
  const state = longestFirst(registries.states).find((candidate) => bare === candidate
    || bare.startsWith(`${candidate}-`) || bare.includes(`-${candidate}-`) || bare.endsWith(`-${candidate}`));
  if (state) {
    const without = bare
      .replace(new RegExp(`(^|-)${state}(-|$)`, 'g'), (_, before, after) => (before && after ? '-' : ''));
    bare = `${without}-${state}`.replace(/^-|-$/g, '');
  } else if (isColors) {
    bare = `${bare}-rest`.replace(/^-/, '');
  }

  return `$${component}${bare ? `-${bare}` : ''}`;
};

// ---------------------------------------------------------------------------------------------

const identity = new Set(registries.themeIdentity);
/*
 * A name that base also declares is only untouchable when the WIRING is a star import: there the
 * theme's top-level `$x: … !default` sets base's variable, so the spelling belongs to base. When the
 * wiring is `with($x: $value)`, the KEY belongs to base but the theme's own variable on the right is
 * free — and 45 colour names across pivotGrid, filterBuilder and scheduler sat unmigrated for months
 * because this exclusion did not make that distinction.
 */
const baseNames = new Set(walk(baseRoot).flatMap((file) => [...declaredIn(file)]));

const starredBaseNames = (folder) => {
  const names = new Set();
  walk(join(themeRoot, folder)).forEach((file) => {
    const content = stripComments(readFileSync(file, 'utf8'));
    [...content.matchAll(/@use\s+(["'])([^"']+)\1([^;{]*)/g)].forEach(([, , spec, tail]) => {
      if (!/\bas\s+\*/.test(tail) || !spec.includes('base/')) return;
      const target = join(dirname(file), spec);
      [`${target}.scss`, join(dirname(target), `_${basename(target)}.scss`),
        join(target, '_index.scss')]
        .filter((candidate) => existsSync(candidate))
        .forEach((candidate) => declaredIn(candidate).forEach((name) => names.add(name)));
    });
  });
  return names;
};
const alreadyMapped = new Set(Object.values(mapping.batches)
  .flatMap((names) => Object.keys(names).map((key) => key.split(':').pop())));

const folders = [...new Set(walk(themeRoot)
  .map((file) => file.slice(themeRoot.length + 1))
  .filter((relative) => relative.includes('/'))
  .map((relative) => relative.split('/')[0]))]
  .filter((folder) => !Object.keys(registries.exemptFolders).includes(folder))
  .filter((folder) => registries.components[folder]);

const report = (folder) => {
  const component = registries.components[folder];
  const wiredByStarImport = starredBaseNames(folder);
  const rows = [];

  walk(join(themeRoot, folder)).forEach((file) => {
    const isColors = file.endsWith('_colors.scss');
    [...declaredIn(file)].forEach((name) => {
      const bare = name.slice(1);
      if (identity.has(name) || alreadyMapped.has(name)) return;
      if (baseNames.has(name) && wiredByStarImport.has(name)) return;
      // Being inside the right namespace is not the same as being grammatical: `$accordion-title-bg-hover`
      // needs a rename too, and skipping it would leave the folder unable to enter `migrated`.
      const inNamespace = bare === component || bare.startsWith(`${component}-`);
      if (inNamespace && !grammarViolation(name, component, isColors)) return;
      const to = propose(name, component, isColors);
      if (to === name) return;
      rows.push({
        file: file.slice(themeRoot.length + 1), name, to, why: grammarViolation(to, component, isColors),
      });
    });
  });

  return { component, rows };
};

const target = process.argv.find((argument) => argument.startsWith('--folder='))
  ?.slice('--folder='.length);

if (process.argv.includes('--all')) {
  let mechanical = 0;
  let manual = 0;
  folders.forEach((folder) => {
    const { rows } = report(folder);
    if (!rows.length) return;
    const ok = rows.filter(({ why }) => !why).length;
    mechanical += ok;
    manual += rows.length - ok;
    process.stdout.write(`  ${folder.padEnd(18)} ${String(rows.length).padStart(4)}  механически ${String(ok).padStart(4)}  вручную ${rows.length - ok}\n`);
  });
  process.stdout.write(`\nвсего ${mechanical + manual}: механически ${mechanical}, вручную ${manual}\n`);
} else if (target) {
  const { component, rows } = report(target);
  if (process.argv.includes('--json')) {
    const entries = rows.filter(({ why }) => !why)
      .map(({ name, to }) => `    ${JSON.stringify(name)}: ${JSON.stringify(to)}`);
    process.stdout.write(`{\n${entries.join(',\n')}\n}\n`);
  } else {
    process.stdout.write(`${target} -> ${component}, ${rows.length} имя(ён)\n\n`);
    rows.filter(({ why }) => !why).forEach(({ name, to }) => process.stdout.write(`  OK      ${name}\n          -> ${to}\n`));
    rows.filter(({ why }) => why).forEach(({ file, name, to, why }) => process.stdout.write(`  ВРУЧНУЮ ${name}  (${file})\n          -> ${to}: ${why.message ?? why}\n`));
  }
} else if (process.argv.includes('--anatomy')) {
  /*
   * What actually blocks a folder is almost never spelling — it is that nobody has written down its
   * DOM anatomy yet. This prints the unresolved middles, most frequent first, so one review pass over
   * a folder produces its sub-element list, after which the whole folder becomes mechanical.
   */
  folders.forEach((folder) => {
    const { rows } = report(folder);
    const middles = new Map();
    rows.forEach(({ why, name }) => {
      const middle = why?.middle;
      if (!middle) return;
      middles.set(middle, [...(middles.get(middle) ?? []), name]);
    });
    const slotless = rows.filter(({ why }) => why?.slot !== undefined).length;
    if (!middles.size && !slotless) return;
    process.stdout.write(`${folder}: ${middles.size} неразобранных середин, ${slotless} без слота\n`);
    [...middles.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .forEach(([middle, names]) => process.stdout.write(`   ${String(names.length).padStart(3)}x ${middle}\n`));
  });
} else {
  process.stdout.write('usage: --folder=<name> [--json] | --all | --anatomy\n');
}
