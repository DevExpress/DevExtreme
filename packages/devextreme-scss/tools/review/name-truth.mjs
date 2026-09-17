/*
 * Does the last word of a published name describe the CSS property it feeds?
 *
 *   node tools/review/name-truth.mjs          # report
 *   node tools/review/name-truth.mjs --json   # for the gate
 *
 * The colour pass already asks a narrow version of this: `slotLies` fires when a name's slot word
 * and the property it paints belong to different families. It fires only when NO property matches,
 * so a name that feeds two properties of different families - `--dx-grid-drop-highlight-bg` on
 * `background-color` AND on `color` - passes it, and the half the name does not describe is
 * invisible. It also covers colours alone: nothing has ever checked that `-height` feeds a height,
 * `-padding` a padding or `-gap` a gap, and those are two thirds of the tier.
 *
 * Read from the built bundle, because the name's truth is what the browser does with it, not what
 * the SCSS looks like. Three outcomes per name:
 *
 *   agrees   every property it feeds is one the name's last word names
 *   mixed    it feeds properties of several families and the name can only name one
 *   wrong    every property it feeds disagrees with the name
 *
 * `mixed` is not automatically a defect - NAMING rule 5 allows one value in two properties, named
 * for the dominant one - but until now that set was never enumerated, so no one could tell a
 * deliberate pair from an accident.
 */

import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
const bundle = join(packageRoot, '..', 'devextreme', 'artifacts', 'css', 'dx.fluent-next.blue.light.css');
if (!existsSync(bundle)) {
  console.error(`no bundle at ${bundle} - run: pnpm nx build:themes devextreme-scss`);
  process.exit(2);
}

const css = readFileSync(bundle, 'utf8');
/*
 * Two ways a name reaches a property, and only one of them is a claim about it.
 *
 *   direct   `padding: var(--dx-x)` - the name IS the padding, and it had better say so
 *   derived  `padding: calc((var(--dx-x) - 16px) / 2)` - the name is a quantity the padding is
 *            computed FROM, and naming it after the padding would be the lie
 *
 * A grid header's height centres a menu with `margin-top: calc((height - 32px) / 2)`. Reading that
 * as "height paints a margin" is how a pass turns arithmetic into a finding.
 */
const paints = new Map();     // name -> Set(property) assigned directly
const derived = new Map();    // name -> Set(property) computed from it
for (const [, property, value] of css.matchAll(/([a-z-]+)\s*:\s*([^;{}]*var\(--dx-[^;{}]*)/g)) {
  /* A custom property on the left is an alias declaration, not paint: it says this name stands for
   * that one, which is a different relationship and has its own check in publish.mjs. */
  if (property.startsWith('--')) continue;
  for (const [, name] of value.matchAll(/var\(\s*(--dx-[a-z0-9-]+)/g)) {
    if (name.startsWith('--dxds-')) continue;
    const direct = value.trim().replace(/\s+/g, '') === `var(${name})`;
    const bucket = direct ? paints : derived;
    if (!bucket.has(name)) bucket.set(name, new Set());
    bucket.get(name).add(property);
  }
}

/*
 * The vocabulary, longest word first so `-border-width` is read before `-width` and
 * `-text-transform` before `-transform`. Each entry: the word, and what it is allowed to feed.
 * Shorthands count - `border: <width> solid <colour>` carries the width, so a `-border-width` name
 * on `border` is telling the truth. So does the SVG spelling of a fill and a stroke.
 */
const RULES = [
  ['text-transform', /^text-transform$/],
  ['border-radius', /border[a-z-]*radius/],
  ['border-width', /^(border|outline)([a-z-]*(width|inline-start|inline-end|block-start|block-end))?$|^border-(top|right|bottom|left)$/],
  ['outline-width', /^outline([a-z-]*width)?$/],
  ['outline-offset', /^outline-offset$/],
  ['font-size', /^font-size$/],
  ['font-weight', /^font-weight$/],
  ['line-height', /^line-height$/],
  ['letter-spacing', /^letter-spacing$/],
  ['padding-block-start', /^padding(-block-start|-top)?$/],
  ['padding-block-end', /^padding(-block-end|-bottom)?$/],
  ['padding-inline-start', /^padding(-inline-start|-left)?$/],
  ['padding-inline-end', /^padding(-inline-end|-right)?$/],
  ['padding-block', /^padding(-block(-start|-end)?|-top|-bottom)?$/],
  ['padding-inline', /^padding(-inline(-start|-end)?|-left|-right)?$/],
  ['padding', /^padding/],
  ['margin-block-start', /^margin(-block-start|-top)?$/],
  ['margin-block-end', /^margin(-block-end|-bottom)?$/],
  ['margin-inline-start', /^margin(-inline-start|-left)?$/],
  ['margin-inline-end', /^margin(-inline-end|-right)?$/],
  ['margin-block', /^margin(-block(-start|-end)?|-top|-bottom)?$/],
  ['margin-inline', /^margin(-inline(-start|-end)?|-left|-right)?$/],
  ['margin', /^margin/],
  ['gap', /gap$/],
  ['z-index', /^z-index$/],
  ['opacity', /^opacity$/],
  ['box-shadow', /shadow/],
  ['shadow', /shadow/],
  ['bg', /^background/],
  ['background', /^background/],
  ['fill', /^(fill|background(-color)?)$/],
  ['width', /(^|-)(width|flex-basis|grid-template-columns)$/],
  ['height', /(^|-)height$/],
  ['size', /(width|height|font-size|flex-basis)$/],
  ['duration', /^(transition|animation)-duration$/],
  ['delay', /^(transition|animation)-delay$/],
  ['transform', /^transform$/],
  ['content', /^(color|fill|stroke|-webkit-text-fill-color|caret-color)$/],
  ['text', /^(color|fill|stroke)$/],
  ['title', /^(color|fill)$/],
  ['caption', /^(color|fill)$/],
  ['placeholder', /^color$/],
  ['label', /^color$/],
  ['icon', /^(color|fill|stroke)$/],
  ['glyph', /^(color|fill|stroke)$/],
  ['border', /^(border|outline)[a-z-]*(color)?$|^stroke$/],
  ['outline', /^outline[a-z-]*$/],
  ['separator', /^(border[a-z-]*color|background-color)$/],
  ['divider', /^(border[a-z-]*color|background-color)$/],
  ['line', /^(border[a-z-]*color|background-color|text-decoration-color)$/],
  ['selector', /^(border[a-z-]*color|background-color)$/],
];
const FAMILY_OF_PROPERTY = [
  [/^background/, 'bg'], [/^(color|fill|stroke|caret-color|-webkit-text-fill-color)$/, 'content'],
  [/(border|outline)[a-z-]*color$/, 'border'], [/shadow/, 'shadow'],
  [/^(padding|margin|gap|column-gap|row-gap|inset|top|right|bottom|left)/, 'box'],
  [/(width|height|flex-basis|size)$/, 'metric'],
  [/^(font|line-height|letter-spacing|text-)/, 'type'],
];
const familyOf = (property) => FAMILY_OF_PROPERTY.find(([re]) => re.test(property))?.[1] ?? 'other';

/*
 * A state suffix is not a word about a property: `-bg-hovered` is still a bg. Stripped before the
 * word is read, or four hundred names fall out of the pass for saying "hovered".
 */
const STATES = JSON.parse(readFileSync(join(packageRoot, 'tools', 'naming', 'registries.json'), 'utf8'))
  .states.slice().sort((a, b) => b.length - a.length);
const bareOf = (name) => {
  const n = name.replace(/^--dx-/, '');
  const state = STATES.find((st) => n.endsWith(`-${st}`));
  return state ? n.slice(0, -state.length - 1) : n;
};

const rows = [];
let agrees = 0;
const noRule = [];
for (const [name, set] of [...paints].sort()) {
  const bare = bareOf(name);
  let rule = RULES.find(([word]) => bare === word || bare.endsWith(`-${word}`));
  /*
   * Two spellings the flat list cannot see.
   *
   * A width that belongs to a border names its side first: `-border-inline-start-width` ends in
   * `-width` and is not a width of the box. And an RTL name is physical on purpose - the theme
   * publishes `-rtl-margin-inline-start` for the rule that writes `margin-right`, because that IS
   * what inline-start means when the page is mirrored.
   */
  if (/(border|outline)[a-z-]*-width$/.test(bare)) rule = RULES.find(([word]) => word === 'border-width');
  const mirrored = /-rtl-/.test(bare);
  if (!rule) { noRule.push({ name, paints: [...set].sort() }); continue; }
  const props = [...set].sort();
  const MIRROR = {
    'inline-start': /^[a-z-]*(right|inline-start)$/, 'inline-end': /^[a-z-]*(left|inline-end)$/,
  };
  const axis = Object.keys(MIRROR).find((a) => bare.endsWith(a));
  const bad = props.filter((p) => !rule[1].test(p) && !(mirrored && axis && MIRROR[axis].test(p)));
  if (!bad.length) { agrees += 1; continue; }
  rows.push({
    name, says: rule[0], paints: props, bad, families: [...new Set(props.map(familyOf))].sort(),
    verdict: bad.length === props.length ? 'wrong' : 'mixed',
  });
}

const result = {
  summary: {
    names: paints.size,
    derivedOnly: [...derived.keys()].filter((n) => !paints.has(n)).length,
    checked: paints.size - noRule.length,
    agrees,
    mixed: rows.filter((r) => r.verdict === 'mixed').length,
    wrong: rows.filter((r) => r.verdict === 'wrong').length,
    noRule: noRule.length,
  },
  rows,
  noRule,
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else {
  const s = result.summary;
  console.log(`names assigned to a property directly: ${s.names}; carrying a word this pass knows: ${s.checked}`);
  console.log(`names that only ever feed a calc, judged on nothing: ${s.derivedOnly}`);
  console.log(`  agrees ${s.agrees}   mixed ${s.mixed}   wrong ${s.wrong}   no rule for the word ${s.noRule}\n`);
  for (const verdict of ['wrong', 'mixed']) {
    const list = rows.filter((r) => r.verdict === verdict);
    console.log(`## ${verdict} - ${list.length}\n`);
    for (const r of list) {
      console.log(`  ${r.name.padEnd(56)} says "${r.says}", paints ${r.bad.join(', ')}`
        + (r.verdict === 'mixed' ? `  (also ${r.paints.filter((p) => !r.bad.includes(p)).join(', ')})` : ''));
    }
    console.log('');
  }
  const words = new Map();
  for (const n of noRule) {
    const w = bareOf(n.name).split('-').slice(-1)[0];
    words.set(w, (words.get(w) ?? 0) + 1);
  }
  console.log(`## words with no rule - ${[...words].length}\n`);
  console.log([...words].sort((a, b) => b[1] - a[1]).map(([w, c]) => `${w} (${c})`).join(', '));
}
