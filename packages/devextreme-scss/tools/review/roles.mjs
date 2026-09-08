/*
 * The roles report: which semantic role every colour slot of the theme reads, and what the token
 * package's component tier says the same slot should read.
 *
 *   node tools/review/roles.mjs           # → scss/widgets/fluent-next/ROLES.md
 *   node tools/review/roles.mjs --md      # markdown to stdout
 *   node tools/review/roles.mjs --json    # machine-readable, for the gate
 *
 * Nothing else checks the CHOICE of role. The naming enforcer checks the name, the resolve diff
 * checks that a value did not move, the reachability audit checks delivery, the screenshots check
 * the cascade. A role that is wrong but plausible passes all five and surfaces only when the
 * palette is re-anchored or in dark mode, where two roles that share a primitive in light diverge.
 *
 * Two independent signals, because neither alone is enough:
 *
 *   1. family  — a `-bg` slot must read a color-bg-* role, `-content` a color-content-* one, and so
 *                on. Needs no package. This is the class that produced the danger/success/warning
 *                fix and the gallery nav-disc defect (bg-disabled on a content slot: white on white).
 *   2. package — `@devexpress/design-tokens-internal/tokens/components/{core,vnext,blazor,wpf}` IS
 *                the role assignment design made, for four products. The theme does not consume it
 *                (decision 06.08.2026), and that is exactly why it reads as a reference: measured on
 *                262.16.0 its colour leaves are ~99% plain references to the semantic roles, so it
 *                carries the mapping and no value of its own.
 *
 * The package comparison is deliberately slot-level, not path-level. Our anatomy and the package's
 * do not line up segment by segment - 86 folders against 44 components, different sub-element trees
 * - and a table that pretended they did would be wrong more often than the roles it checks. So for
 * each component we cross-tabulate role -> slots as the package uses them, and ask one question:
 * is our role one the package uses in our slot? A "no" is a question, not a verdict; the report
 * names the slots the package does use it for, which is usually the answer.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
// --theme= lets the gate run the same code over a synthetic tree, so a green gate means "nothing
// to find" rather than "the scan matched nothing".
const themeArg = process.argv.find((a) => a.startsWith('--theme='));
const themeDir = themeArg ? themeArg.slice('--theme='.length) : join(packageRoot, 'scss', 'widgets', 'fluent-next');
const registries = JSON.parse(readFileSync(join(packageRoot, 'tools', 'naming', 'registries.json'), 'utf8'));

const require = createRequire(import.meta.url);
const tokensRoot = dirname(require.resolve('@devexpress/design-tokens-internal/package.json'));
const tokensVersion = JSON.parse(readFileSync(join(tokensRoot, 'package.json'), 'utf8')).version;

const SETS = ['core', 'vnext', 'blazor', 'wpf'];
const MODES = ['light', 'dark'];

const leavesOf = (node, trail = []) => Object.entries(node ?? {}).flatMap(([key, value]) => {
  if (key.startsWith('$') || !value || typeof value !== 'object') return [];
  if ('$value' in value) return [[[...trail, key].join('.'), value.$value]];
  return leavesOf(value, [...trail, key]);
});

/*
 * Theme folder -> the package components that describe the same thing, most authoritative first.
 * A judgment call per line, so the list is explicit rather than derived: `chat` is the package's
 * `ai-chat`, all three grids are its single `grid`, and our chassis folders (textEditor, gridBase)
 * map to the component the package models, not to a widget name. A folder that is absent here has
 * no counterpart worth comparing - the report says so instead of guessing.
 */
const COMPONENT = {
  accordion: ['accordion'],
  badge: ['badge'],
  button: ['button', 'custom-button'],
  calendar: ['calendar'],
  card: ['container-card', 'popover-card'],
  chat: ['ai-chat'],
  checkBox: ['checkbox'],
  colorBox: ['color-palette'],
  colorView: ['color-palette'],
  common: ['focus-rect', 'backdrop', 'separator', 'skeleton', 'empty-item'],
  contextMenu: ['menu-list'],
  dataGrid: ['grid'],
  dateBox: ['text-input', 'button-edit'],
  drawer: ['drawer'],
  dropDownButton: ['split-button'],
  fieldset: ['field'],
  form: ['form'],
  gallery: ['gallery'],
  gridBase: ['grid'],
  informer: ['message-bar'],
  list: ['listbox'],
  loadIndicator: ['spinner', 'loading-indicator', 'waitIndicator'],
  loadPanel: ['loading-panel'],
  menu: ['menu'],
  menuBase: ['menu', 'menu-list'],
  numberBox: ['text-input'],
  pagination: ['pagination', 'pager'],
  popover: ['popover', 'popover-card', 'popover-arrow'],
  popup: ['popup', 'message-box'],
  progressBar: ['progress-bar'],
  radioButton: ['radio-button', 'radio'],
  radioGroup: ['radio-button', 'radio'],
  scrollable: ['scroll-bar'],
  scrollView: ['scroll-view', 'scroll-bar'],
  selectBox: ['text-input'],
  splitter: ['splitter'],
  switch: ['switch', 'switcher', 'toggle-switch'],
  tabPanel: ['tabs', 'tab-control'],
  tabs: ['tabs', 'tab-control'],
  tagBox: ['tagbox', 'tag'],
  textArea: ['text-area', 'memo'],
  textBox: ['text-input', 'text-edit'],
  textEditor: ['text-input', 'text-edit'],
  toast: ['toast'],
  toolbar: ['toolbar', 'ribbon', 'bars'],
  tooltip: ['tooltip'],
  treeList: ['grid'],
  treeView: ['treeview', 'tree-view'],
  typography: ['text-content', 'button-text'],
};

// slot -> the --dxds- colour family it has to read. null = the slot is genuinely two-sided (a thumb
// can be filled or outlined), so the family signal says nothing and only the package can answer.
/*
 * Cross-cutting nodes: the package models a separator, a focus rect, a backdrop and a skeleton as
 * components of their own, the way our system tier publishes them on :root rather than inside a
 * widget. Every component is compared against these too, after its own, so `$menu-separator-bg`
 * finds `separator.color` instead of reading as a menu background that borrowed a border role.
 */
const SHARED = ['separator', 'focus-rect', 'backdrop', 'skeleton', 'empty-item', 'text-content', 'link'];

const FAMILY = {
  backdrop: 'bg', bg: 'bg', highlight: 'bg', scrim: 'bg', veil: 'bg',
  caption: 'content', chevron: 'content', content: 'content', 'end-icon': 'content',
  icon: 'content', placeholder: 'content', shortcut: 'content', 'start-icon': 'content',
  subtitle: 'content', text: 'content', title: 'content',
  border: 'border', line: 'border', outline: 'border', separator: 'border',
  shadow: 'shadow', 'shadow-ambient': 'shadow', 'shadow-key': 'shadow',
  grip: null, indicator: null, opacity: null, selector: null, thumb: null, track: null, trigger: null,
};

/*
 * Slot kinship. The package splits what we deliberately keep together: `content` is our umbrella
 * slot and `text` is reserved for elements that tokenise text and icon separately (NAMING.md), so
 * the package painting our `content` as `text` is the documented naming divergence, not a finding.
 * Comparison therefore runs twice - exact slot first, then kin - and only a role that crosses a
 * family boundary is reported. `ambiguous` matches anything: a thumb or a track is legitimately
 * either filled or outlined, so its family carries no claim.
 */
const KIN = {
  bg: 'bg', backdrop: 'bg', scrim: 'bg', veil: 'bg', highlight: 'bg',
  content: 'content', text: 'content', icon: 'content', 'start-icon': 'content',
  'end-icon': 'content', title: 'content', subtitle: 'content', caption: 'content',
  placeholder: 'content', chevron: 'content', shortcut: 'content', trigger: 'content',
  border: 'border', outline: 'border', separator: 'border', line: 'border',
  shadow: 'shadow', 'shadow-ambient': 'shadow', 'shadow-key': 'shadow',
  grip: 'ambiguous', indicator: 'ambiguous', opacity: 'ambiguous',
  selector: 'ambiguous', thumb: 'ambiguous', track: 'ambiguous',
};
const kinOf = (slot) => KIN[slot] ?? 'ambiguous';
const kindred = (a, b) => a === b || kinOf(a) === 'ambiguous' || kinOf(b) === 'ambiguous'
  || kinOf(a) === kinOf(b);

const PARTS = [...registries.parts].sort((a, b) => b.length - a.length);
const STATES = [...registries.states].sort((a, b) => b.length - a.length);
// `rest` is absence of a suffix in the theme and an explicit segment in the package; `disable` is a
// vendor typo that ships in switch.color.checked.bg.disable.
const PACKAGE_STATES = new Set([...registries.states, 'rest', 'disable']);

const familyOf = (role) => {
  if (/^(box-shadow|color-shadow)-/.test(role)) return 'shadow';
  if (role === 'color-none' || role === 'none') return 'none';
  return /^color-(bg|content|border)\b/.exec(role)?.[1] ?? 'other';
};

const trailing = (name, vocabulary) => {
  for (const word of vocabulary) if (name === word || name.endsWith(`-${word}`)) return word;
  return null;
};

/*
 * Resolved values, per mode, read from the package rather than from a built bundle: the report has
 * to answer "would this swap move a pixel" without waiting for a theme build, and the answer lives
 * in the tokens. A swap that resolves identically in BOTH modes is free - a declaration fix with no
 * etalon to re-shoot. One that moves only in dark is the case this whole report exists for: every
 * screenshot etalon is .light, so nothing in CI can see it.
 */
const valueIndex = {};
for (const mode of MODES) {
  const map = new Map();
  const collect = (dir) => {
    for (const entry of readdirSync(dir)) {
      const absolute = join(dir, entry);
      if (statSync(absolute).isDirectory()) { collect(absolute); continue; }
      if (!entry.endsWith('.json')) continue;
      if (/material/.test(absolute)) continue;
      // the mode files sit at semantic/colors/<theme>/<mode>.json - keep only this mode's
      if (/[\\/]colors[\\/]/.test(absolute) && /^(light|dark)\.json$/.test(entry) && entry !== `${mode}.json`) continue;
      for (const [name, value] of leavesOf(JSON.parse(readFileSync(absolute, 'utf8')))) {
        if (!map.has(name)) map.set(name, value);
      }
    }
  };
  for (const sub of ['base', 'global', 'semantic']) collect(join(tokensRoot, 'tokens', sub));
  valueIndex[mode] = map;
}
const resolveRole = (role, mode, depth = 0) => {
  const key = role.replace(/^color-/, 'color.');
  const raw = valueIndex[mode].get(key) ?? valueIndex[mode].get(role);
  if (raw === undefined) return null;
  if (typeof raw !== 'string' || !raw.startsWith('{') || depth > 12) return String(raw).toLowerCase();
  return resolveRole(raw.replace(/[{}]/g, ''), mode, depth + 1);
};
const sameValue = (a, b) => MODES.every((mode) => {
  const va = resolveRole(a, mode);
  const vb = resolveRole(b, mode);
  return va !== null && vb !== null && va === vb;
});

// --- the theme side -----------------------------------------------------------------------------

const colourFiles = (dir) => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  if (statSync(absolute).isDirectory()) return colourFiles(absolute);
  return entry === '_colors.scss' ? [absolute] : [];
});

const declarations = [];
for (const file of colourFiles(themeDir)) {
  const folder = relative(themeDir, file).split('/')[0];
  const source = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  source.split('\n').forEach((line, index) => {
    if (/^\s*\/\//.test(line)) return;
    const match = /^\s*\$([a-z0-9-]+)\s*:\s*(.+?)(?:\s*!default)?\s*;/.exec(line);
    if (!match) return;
    const [, name, value] = match;
    const roles = [...value.matchAll(/ds\.\$([a-z0-9-]+)/g)].map((r) => r[1]);
    if (!roles.length) return;
    const state = trailing(name, STATES);
    const bare = state ? name.slice(0, -state.length - 1) : name;
    const slot = trailing(bare, PARTS);
    /*
     * A part word can also sit in the middle as a sub-element: `$menu-separator-bg` is slot `bg` on
     * sub-element `separator`, and the package models exactly that as its own `separator` slot. So
     * the comparison looks for the package's word among ours, not only at our last position -
     * otherwise every `<part>-bg` reads as a bg that borrowed a border role.
     */
    const middle = slot ? bare.slice(0, -slot.length).replace(/-$/, '') : bare;
    const subElementSlots = PARTS.filter((part) => middle === part || middle.endsWith(`-${part}`)
      || middle.startsWith(`${part}-`) || middle.includes(`-${part}-`));
    declarations.push({
      folder,
      where: `${relative(packageRoot, file)}:${index + 1}`,
      name,
      slot,
      subElementSlots,
      state: state ?? 'rest',
      roles,
      bridged: /rgb\(\s*from/.test(value),
      value: value.trim(),
    });
  });
}

// --- the package side ---------------------------------------------------------------------------

const leaves = leavesOf;
const _unusedLeaves = (node, trail = []) => Object.entries(node ?? {}).flatMap(([key, value]) => {
  if (key.startsWith('$') || !value || typeof value !== 'object') return [];
  if ('$value' in value) return [[[...trail, key].join('.'), value.$value]];
  return leaves(value, [...trail, key]);
});

/* A package path is `<component>.<sub-elements>.color.<variants>.<slot>.<state>`, and only the part
 * after `color.` describes the paint - `progress-bar.progress-line.color.indicator.…` would
 * otherwise match `line` in the sub-element. The slot is the rightmost segment that is one of our
 * parts, so a package slot we have no word for is reported rather than silently mapped. */
const dissect = (path) => {
  const segments = path.split('.');
  const colourAt = segments.indexOf('color');
  if (colourAt === -1) return null;
  const tail = segments.slice(colourAt + 1);
  const state = PACKAGE_STATES.has(tail.at(-1)) ? tail.pop() : 'rest';
  for (let i = tail.length - 1; i >= 0; i -= 1) {
    const slot = trailing(tail[i], PARTS);
    if (slot) return { slot, state, variant: tail.slice(0, i).join('.') };
  }
  /* `separator.color` and `backdrop.color` carry no slot segment because the component IS the slot:
   * the package models them the way our system tier publishes them, as a thing rather than a part
   * of a thing. Without this they fall out of the comparison entirely, and every `-separator-border`
   * in the theme reads as a border nobody named. */
  const asSlot = trailing(segments[0], PARTS);
  if (asSlot) return { slot: asSlot, state, variant: tail.join('.') };
  return { slot: null, state, variant: tail.join('.') };
};

const packageTier = {};   // set -> component -> { bySlot, byRole, unknownSlots }
for (const set of SETS) {
  const file = join(tokensRoot, 'tokens', 'components', set, 'theme', 'fluent.json');
  const components = JSON.parse(readFileSync(file, 'utf8'));
  packageTier[set] = {};
  for (const [component, tree] of Object.entries(components)) {
    const bySlot = new Map();
    const byState = new Map();   // slot -> state -> Set(role)
    const byRole = new Map();
    const unknownSlots = new Set();
    for (const [path, raw] of leaves(tree)) {
      if (typeof raw !== 'string' || !raw.startsWith('{')) continue;
      const role = raw.replace(/[{}]/g, '').replace(/^(color|global\.color)\./, 'color-');
      if (!role.startsWith('color-')) continue;
      const anatomy = dissect(`${component}.${path}`);
      if (!anatomy) continue;
      if (!anatomy.slot) { unknownSlots.add(path); continue; }
      if (!bySlot.has(anatomy.slot)) bySlot.set(anatomy.slot, new Set());
      bySlot.get(anatomy.slot).add(role);
      if (!byState.has(anatomy.slot)) byState.set(anatomy.slot, new Map());
      const states = byState.get(anatomy.slot);
      if (!states.has(anatomy.state)) states.set(anatomy.state, new Set());
      states.get(anatomy.state).add(role);
      if (!byRole.has(role)) byRole.set(role, new Set());
      byRole.get(role).add(anatomy.slot);
    }
    packageTier[set][component] = { bySlot, byState, byRole, unknownSlots };
  }
}

/*
 * Typography: the same question, asked of the size files.
 *
 * The colour layer reads roles everywhere (0 direct palette reads). Typography does not: most of
 * its step reads go straight to a base scale, because the value came from legacy fluent and the
 * role grid has no step with that value - font-weight 500, font-size 110/180/220/260/360,
 * line-height 120/180. Most carry `dx-no-semantic-role`; the rest carry no marker at all, because
 * the px gate only looks at literals and a step read is not a literal.
 *
 * None of the four neighbours has this: their component sets reference the typography ROLES and a
 * bare step three times in total. So a place here is not "the package is missing a role" by
 * default - it is a choice between the legacy value and the design system's grid, and the report
 * has to put both in front of whoever decides.
 */
const TYPOGRAPHY = ['font-size', 'font-weight', 'line-height'];

const typographyGrid = {};   // family -> [{ role, step }], the steps the role grid actually names
for (const family of TYPOGRAPHY) {
  const roles = [];
  for (const [name, raw] of valueIndex.light) {
    if (!name.startsWith(`${family}.`)) continue;
    const step = /^\{?([a-z-]+)\.(\d+)\}?$/.exec(String(raw));
    if (!step) continue;               // a role points at a step; a step points at a number
    roles.push({ role: name.split('.')[1], step: Number(step[2]) });
  }
  typographyGrid[family] = roles.sort((a, b) => a.step - b.step);
}

const MARKERS = /dx-(no-semantic-role|icon-glyph-size|offscale|relative|px-nudge|literal-required|fixed-size|line-width|shadow-geometry)/;

const typography = [];
const sizeFiles = (dir) => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  if (statSync(absolute).isDirectory()) return sizeFiles(absolute);
  return entry === '_sizes.scss' ? [absolute] : [];
});
for (const file of sizeFiles(themeDir)) {
  const folder = relative(themeDir, file).split('/')[0];
  readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').split('\n').forEach((line, index) => {
    if (/^\s*\/\//.test(line)) return;
    const read = /ds\.\$(font-size|font-weight|line-height)-(\d+)/.exec(line);
    if (!read) return;
    const [, family, step] = read;
    const grid = typographyGrid[family] ?? [];
    const onGrid = grid.filter((r) => r.step === Number(step));
    const nearest = [...grid]
      .sort((a, b) => Math.abs(a.step - Number(step)) - Math.abs(b.step - Number(step)))
      .slice(0, 3);
    typography.push({
      folder,
      where: `${relative(packageRoot, file)}:${index + 1}`,
      variable: /\$([a-z0-9-]+)\s*:/.exec(line)?.[1] ?? '(inline)',
      family,
      step: Number(step),
      marker: MARKERS.exec(line)?.[1] ?? null,
      roles: onGrid.map((r) => r.role),
      nearest: onGrid.length ? [] : nearest.map((r) => ({ role: r.role, step: r.step })),
    });
  });
}

/*
 * What each tier name actually paints, read out of the built bundle.
 *
 * The slot is supposed to encode the CSS property (NAMING.md: assigned in `color:` -> content, in
 * `background-color` -> bg, in `border-color` -> border), and that is the one claim in the whole
 * name that can be checked against ground truth instead of read. filterBuilder is why it is worth
 * checking: fourteen `-content` variables reach base as `button-color($color, ...)`, which sets
 * `background-color` - the roles were right all along and the names were not.
 *
 * Needs a built bundle; without one this half of the report is simply absent, the way the calc
 * inventory in SCALES.md is.
 */
const PROPERTY_FAMILY = [
  [/^(background|background-color|background-image)$/, 'bg'],
  [/^(color|fill|caret-color|-webkit-text-fill-color)$/, 'content'],
  [/(^|-)border(-|$)|^outline(-|$)|^stroke$|^border-color$/, 'border'],
  [/shadow$/, 'shadow'],
];
const bundlePath = join(packageRoot, '..', 'devextreme', 'artifacts', 'css', 'dx.fluent-next.blue.light.css');
const paints = new Map();   // --dx-name -> Set(css property)
if (existsSync(bundlePath)) {
  const css = readFileSync(bundlePath, 'utf8');
  for (const [, property, value] of css.matchAll(/([a-z-]+)\s*:\s*([^;{}]*var\(--dx-[^;{}]*)/g)) {
    for (const [, name] of value.matchAll(/var\(\s*(--dx-[a-z0-9-]+)/g)) {
      if (!paints.has(name)) paints.set(name, new Set());
      paints.get(name).add(property);
    }
  }
}
const familyOfProperty = (property) => PROPERTY_FAMILY.find(([re]) => re.test(property))?.[1] ?? null;

// --- the comparison -------------------------------------------------------------------------------

const findings = [];
for (const declaration of declarations) {
  const { slot, subElementSlots, roles, folder } = declaration;
  const ourSlots = [slot, ...subElementSlots].filter(Boolean);
  const record = { ...declaration, family: null, package: null };

  // The family signal follows the CSS property, which is what the slot encodes (NAMING.md): a
  // separator drawn with background-color is still painted by `bg`. Sub-elements steer the package
  // comparison, not this one.
  if (slot && FAMILY[slot]) {
    const want = FAMILY[slot];
    const got = [...new Set(roles.map(familyOf))].filter((f) => f !== 'none');
    if (got.length && !got.includes(want)) record.family = { want, got, slot };
  }

  const candidates = COMPONENT[folder] ?? [];
  if (!candidates.length) record.package = { verdict: 'no-counterpart' };
  else if (!slot) record.package = { verdict: 'slot-unparsed' };
  else {
    const seen = [];
    for (const set of SETS) {
      for (const candidate of [...candidates, ...SHARED]) {
        const tier = packageTier[set][candidate];
        if (!tier) continue;
        seen.push({ set, component: candidate, tier, own: candidates.includes(candidate) });
      }
    }
    if (!seen.length) record.package = { verdict: 'no-counterpart' };
    else {
      const exact = [];
      const kin = [];
      /* Whether the package uses our role for another part OF THE SAME widget or only somewhere
       * else entirely. The first is a word disagreement - the package calls the switch knob a
       * `trigger` and paints it from a content role, exactly as we do, and only our slot says `bg`.
       * The second is the one worth a second look. */
      const sameComponent = new Set();
      const crossFamily = new Map();
      const slotRoles = new Set();   // roles the package uses for our slot, or a kin slot
      for (const { set, component, tier, own } of seen) {
        /*
         * What the package offers HERE is gathered strictly: same family as our own slot, no
         * sub-elements and no wildcard. `$popup-content-shadow-ambient` is a shadow that happens to
         * live on the content area, and a scroll bar's thumb is ambiguous by design - letting
         * either widen the candidate set turns a correct role into a conflict with roles that were
         * never on offer. The lenient reading stays where it belongs: deciding whether our role
         * already agrees with the package somewhere.
         */
        for (const [pkgSlot, pkgRoles] of tier.bySlot) {
          if (kinOf(pkgSlot) !== kinOf(slot) || kinOf(slot) === 'ambiguous') continue;
          for (const role of pkgRoles) slotRoles.add(role);
        }
        for (const role of roles) {
          const usedIn = [...(tier.byRole.get(role) ?? [])];
          if (!usedIn.length) continue;
          if (usedIn.some((pkgSlot) => ourSlots.includes(pkgSlot))) exact.push(`${set}/${component}`);
          else if (usedIn.some((pkgSlot) => ourSlots.some((ours) => kindred(pkgSlot, ours)))) kin.push(`${set}/${component}:${usedIn.join(',')}`);
          else {
            const key = usedIn.sort().join('|');
            if (!crossFamily.has(key)) crossFamily.set(key, []);
            crossFamily.get(key).push(`${set}/${component}`);
            if (own) sameComponent.add(`${set}/${component}:${usedIn.join(',')}`);
          }
        }
      }
      const here = [...slotRoles].sort();
      /* A role of the slot's own family used elsewhere for a different part is not a crossing - the
       * package simply has not needed it here. Reserve `cross-family` for the case the name
       * promises: the role belongs to another family than the slot paints with. */
      const crosses = FAMILY[slot] && roles.some((role) => {
        const family = familyOf(role);
        return family !== 'none' && family !== FAMILY[slot];
      });
      if (exact.length) record.package = { verdict: 'agrees', where: [...new Set(exact)] };
      else if (kin.length) record.package = { verdict: 'agrees-kin', where: [...new Set(kin)] };
      else if (crossFamily.size && crosses) {
        record.package = {
          verdict: 'cross-family',
          usedFor: [...crossFamily].map(([slots, where]) => ({ slots: slots.split('|'), where: [...new Set(where)] })),
          sameComponent: [...sameComponent],
          packageUsesHere: here,
        };
      } else if (crossFamily.size) {
        record.package = { verdict: 'role-new', packageUsesHere: here };
      } else if (here.length) {
        const ourFamilies = new Set(roles.map(familyOf).filter((f) => f !== 'none'));
        const theirFamilies = new Set(here.map(familyOf).filter((f) => f !== 'none'));
        // Only `color-none` on offer is not a family to conflict with - the package simply paints
        // nothing here, which says nothing about our role.
        if (!theirFamilies.size) record.package = { verdict: 'slot-absent' };
        else {
          const shared = [...ourFamilies].some((f) => theirFamilies.has(f));
          record.package = { verdict: shared ? 'role-new' : 'family-conflict', packageUsesHere: here };
        }
      } else record.package = { verdict: 'slot-absent' };
    }
  }
  const painted = [...(paints.get(`--dx-${declaration.name}`) ?? [])].sort();
  if (painted.length) {
    const families = [...new Set(painted.map(familyOfProperty).filter(Boolean))];
    record.paints = { properties: painted, families };
    // The slot claims a family; the bundle says which one the property actually belongs to.
    if (FAMILY[slot] && families.length && !families.includes(FAMILY[slot])) {
      record.slotLies = { slotSays: FAMILY[slot], propertySays: families };
    }
  }

  const here = record.package?.packageUsesHere ?? [];
  if (here.length && roles.length === 1) {
    const free = here.filter((candidate) => candidate !== roles[0] && sameValue(candidate, roles[0]));
    const drift = MODES.filter((mode) => {
      const ours = resolveRole(roles[0], mode);
      return here.some((candidate) => resolveRole(candidate, mode) !== ours);
    });
    record.swap = { free, ours: Object.fromEntries(MODES.map((m) => [m, resolveRole(roles[0], m)])), drift };
    if (!free.length) {
      /* The role the package would have us use is often one step away and differs in a single mode.
       * Naming it turns a diagnosis into a decision - and a candidate that moves dark only is the
       * signature case of this report: no etalon can see it. */
      const wanted = FAMILY[record.slot];
      record.near = here
        .filter((candidate) => !wanted || familyOf(candidate) === wanted)
        .map((candidate) => ({
          role: candidate,
          moves: MODES.filter((mode) => resolveRole(candidate, mode) !== resolveRole(roles[0], mode)),
        }))
        .filter((candidate) => candidate.moves.length)
        .sort((a, b) => a.moves.length - b.moves.length);
    }
  }
  findings.push(record);
}

/*
 * State ladders: does a state actually change the paint?
 *
 * Needs neither the package nor a bundle - it reads the theme against itself. A slot whose hovered
 * and active resolve to one role has a state in the name that the eye cannot find, and the ladder
 * the design system ships for that role is going unused. Two collapses are accepted convention and
 * are named here rather than discovered every run: `focused` reuses `hovered` because the
 * foundation has no focused state (DIVERGENCES), and a state that deliberately resets to the rest
 * value is a reset, not a gap.
 */
const ACCEPTED_COLLAPSE = [['focused', 'hovered'], ['focused', 'active'], ['selected-focused', 'selected-hovered']];
const acceptedPair = (a, b) => ACCEPTED_COLLAPSE.some(([x, y]) => (a === x && b === y) || (a === y && b === x));

const ladders = [];
{
  const groups = new Map();
  for (const declaration of declarations) {
    if (!declaration.slot) continue;
    const stem = declaration.state === 'rest'
      ? declaration.name
      : declaration.name.slice(0, -declaration.state.length - 1);
    if (!groups.has(stem)) groups.set(stem, []);
    groups.get(stem).push(declaration);
  }
  for (const [stem, members] of groups) {
    if (members.length < 2) continue;
    const byRole = new Map();
    for (const member of members) {
      const key = member.roles.join('+');
      if (!byRole.has(key)) byRole.set(key, []);
      byRole.get(key).push(member.state);
    }
    for (const [role, states] of byRole) {
      if (states.length < 2) continue;
      const pairs = states.flatMap((a, i) => states.slice(i + 1).map((b) => [a, b]));
      if (pairs.every(([a, b]) => acceptedPair(a, b))) continue;
      /* The precise question is about OUR role, not the package's anatomy: we paint two states
       * from role R, so does the design system ship R for the second state? `bg-alpha-hovered`
       * shared by hovered and active is a gap exactly when `bg-alpha-active` exists. This needs no
       * component mapping, so it answers for all 86 folders, including the 22 the package has
       * never heard of. */
      const unusedRungs = states
        .filter((state) => state !== 'rest')
        .flatMap((state) => role.split('+').map((r) => {
          const rung = `${r.replace(/-(hovered|active|selected|focused|disabled|read-only)$/, '')}-${state}`;
          return resolveRole(rung, 'light') !== null && rung !== r ? { state, rung } : null;
        }))
        .filter(Boolean);
      ladders.push({
        stem,
        folder: members[0].folder,
        where: members.find((m) => states.includes(m.state)).where,
        role: role.split('+'),
        states: states.sort(),
        unusedRungs,
      });
    }
  }
  ladders.sort((a, b) => a.stem.localeCompare(b.stem));
}

// --- output ---------------------------------------------------------------------------------------

const count = (predicate) => findings.filter(predicate).length;
const verdicts = ['agrees', 'agrees-kin', 'cross-family', 'family-conflict', 'role-new', 'slot-absent', 'no-counterpart', 'slot-unparsed'];
const summary = {
  tokensVersion,
  declarations: findings.length,
  typographyStepReads: typography.length,
  typographyOffGrid: typography.filter((t) => !t.roles.length).length,
  typographyUnmarked: typography.filter((t) => !t.marker).length,
  collapsedLadders: ladders.length,
  familyMismatch: count((f) => f.family),
  slotLies: count((f) => f.slotLies),
  familyMismatchExplainedByProperty: count((f) => f.family && f.slotLies
    && f.slotLies.propertySays.some((fam) => f.family.got.includes(fam))),
  byVerdict: Object.fromEntries(verdicts.map((v) => [v, count((f) => f.package?.verdict === v)])),
};

const roleList = (roles) => roles.map((r) => `ds.$${r}`).join(' + ');

const swapLine = (f) => {
  if (!f.swap) return null;
  const { free, ours, drift } = f.swap;
  const value = MODES.map((m) => `${m} ${ours[m] ?? '?'}`).join(' / ');
  if (free.length) {
    return `    - **free swap**: \`${free[0]}\` resolves identically in both modes (${value})`
      + (free.length > 1 ? `; also ${free.slice(1).map((r) => `\`${r}\``).join(', ')}` : '');
  }
  const near = (f.near ?? []).slice(0, 3)
    .map((n) => `\`${n.role}\` (moves ${n.moves.join(' and ')})`)
    .join(', ');
  return `    - ours resolves ${value}; no role of the right family shares it`
    + (near ? `. Nearest of the right family: ${near}` : '');
};

const md = () => {
  const out = [];
  out.push('<!-- Generated: node tools/review/roles.mjs. Do not edit by hand. -->');
  out.push('# Roles - what the theme assigns, what the package assigns\n');
  out.push(`Package \`@devexpress/design-tokens-internal@${tokensVersion}\`, sets: ${SETS.join(', ')}.\n`);
  out.push(`Colour declarations reading a role: **${summary.declarations}**.\n`);
  out.push('| Signal | Count |');
  out.push('|---|---|');
  out.push(`| family mismatch (slot wants another \`--dxds-\` family) | **${summary.familyMismatch}** |`);
  out.push(`| slot contradicts the painted property | **${summary.slotLies}** |`);
  out.push(`| states that resolve to one role | **${summary.collapsedLadders}** |`);
  for (const verdict of verdicts) out.push(`| package: ${verdict} | ${summary.byVerdict[verdict]} |`);
  out.push('');

  const section = (title, rows, render) => {
    if (!rows.length) return;
    out.push(`## ${title} - ${rows.length}\n`);
    for (const row of rows) out.push(render(row));
    out.push('');
  };

  section('Cross-family - the package uses this role, but only for a slot of another kind',
    findings.filter((f) => f.package?.verdict === 'cross-family'),
    (f) => [
      `- \`${f.name}\` = ${roleList(f.roles)}${f.bridged ? ' *(alpha bridge - see BRIDGES.md)*' : ''}  (${f.where})`,
      ...f.package.usedFor.map((u) => `    - package paints it as **${u.slots.join(', ')}** in ${u.where.join(', ')}`),
      f.package.sameComponent?.length
        ? '    - **same widget, different word**: the package uses this very role on another part of it'
        : null,
      f.package.packageUsesHere.length
        ? `    - for our slot \`${f.slot}\` the package uses: ${f.package.packageUsesHere.map((r) => `\`${r}\``).join(', ')}`
        : `    - the package names no role for slot \`${f.slot}\` here`,
      swapLine(f),
    ].filter(Boolean).join('\n'));

  section('Family conflict - the package paints this slot from another family entirely',
    findings.filter((f) => f.package?.verdict === 'family-conflict'),
    (f) => [
      `- \`${f.name}\` = ${roleList(f.roles)}  (${f.where})`,
      `    - for slot \`${f.slot}\` the package uses: ${f.package.packageUsesHere.map((r) => `\`${r}\``).join(', ')}`,
      swapLine(f),
    ].filter(Boolean).join('\n'));

  section('Family mismatch',
    findings.filter((f) => f.family),
    (f) => `- \`${f.name}\` = ${roleList(f.roles)}  (${f.where})\n`
      + `    - slot \`${f.family.slot}\` wants \`color-${f.family.want}-*\`, reads a \`${f.family.got.join('/')}\` role`
      + (f.package ? `; package verdict: ${f.package.verdict}` : ''));

  out.push(`## States that resolve to one role - ${ladders.length}\n`);
  out.push('A state in the name that the eye cannot find. `focused` reusing `hovered` is accepted -');
  out.push('the foundation has no focused state - and is not listed; everything below is a ladder the');
  out.push('design system ships and the theme does not climb.\n');
  out.push('| Where | Slot | Role | States sharing it | Rung the system ships and we skip |');
  out.push('|---|---|---|---|---|');
  for (const l of ladders) {
    const rungs = l.unusedRungs.length
      ? l.unusedRungs.map((r) => `\`${r.rung}\` (${r.state})`).join(', ')
      : 'none - the system has no role for the second state either';
    out.push(`| ${l.where} | \`${l.stem}\` | ${roleList(l.role)} | ${l.states.map((x) => `\`${x}\``).join(', ')} | ${rungs} |`);
  }
  out.push('');

  const lies = findings.filter((f) => f.slotLies);
  out.push(`## The slot does not match the property it paints - ${lies.length}\n`);
  out.push('Read out of the built bundle, so this is what the browser gets, not what the name claims.');
  out.push('Most are the name and not the role: fourteen filterBuilder `-content` variables reach base as');
  out.push('`button-color()`, which sets `background-color`, and the bg roles they carry were right all');
  out.push('along. Two idioms are deliberate and stay - a hairline drawn with `background-color` keeps its');
  out.push('border role, and a value that paints two properties is named after the dominant one (rule 5).\n');
  out.push('| Where | Variable | Reads | Slot says | Actually paints |');
  out.push('|---|---|---|---|---|');
  for (const f of lies) {
    out.push(`| ${f.where} | \`${f.name}\` | ${roleList(f.roles)} | \`${f.slot}\` (${f.slotLies.slotSays}) `
      + `| ${f.paints.properties.map((x) => `\`${x}\``).join(', ')} |`);
  }
  out.push('');

  const offGrid = typography.filter((t) => !t.roles.length);
  const onGridUnrouted = typography.filter((t) => t.roles.length);
  out.push(`## Typography off the role grid - ${offGrid.length} of ${typography.length} step reads\n`);
  out.push('The role grid names no step with this value, so the theme reads the base scale directly.');
  out.push('Each line is a choice: move onto the nearest role (the value changes, etalons follow), ask');
  out.push('the package for a role at this step, or record the value as a deliberate divergence.\n');
  out.push('| Where | Variable | Reads | Marker | Nearest roles |');
  out.push('|---|---|---|---|---|');
  for (const t of offGrid) {
    out.push(`| ${t.where} | \`${t.variable}\` | \`${t.family}-${t.step}\` | ${t.marker ? `\`${t.marker}\`` : '**none**'}`
      + ` | ${t.nearest.map((n) => `\`${n.role}\` (${n.step})`).join(', ')} |`);
  }
  out.push('');
  if (onGridUnrouted.length) {
    out.push(`### A role names this step and the theme reads the step anyway - ${onGridUnrouted.length}\n`);
    out.push('| Where | Variable | Reads | Marker | Role with this step |');
    out.push('|---|---|---|---|---|');
    for (const t of onGridUnrouted) {
      out.push(`| ${t.where} | \`${t.variable}\` | \`${t.family}-${t.step}\` | ${t.marker ? `\`${t.marker}\`` : '**none**'}`
        + ` | ${t.roles.map((r) => `\`${r}\``).join(', ')} |`);
    }
    out.push('');
  }

  const orphans = [...new Set(findings.filter((f) => f.package?.verdict === 'no-counterpart').map((f) => f.folder))].sort();
  out.push(`## No package counterpart - ${orphans.length} folders\n`);
  out.push(`${orphans.join(', ')}\n`);
  out.push('These are the manual layer: no set describes them, so the role can only be judged by eye');
  out.push('against the light/dark pair, and a gap goes to design as a card.\n');
  return out.join('\n');
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ summary, findings, typography, ladders }, null, 2));
} else if (process.argv.includes('--md')) {
  console.log(md());
} else if (themeArg) {
  console.error('--theme= is for the gate; pass --json with it');
  process.exit(2);
} else {
  writeFileSync(join(themeDir, 'ROLES.md'), `${md()}\n`);
  console.log(`declarations ${summary.declarations} | family mismatch ${summary.familyMismatch}`);
  for (const verdict of verdicts) console.log(`  ${verdict.padEnd(16)} ${summary.byVerdict[verdict]}`);
  console.log(`\n→ ${relative(process.cwd(), join(themeDir, 'ROLES.md'))}`);
}
