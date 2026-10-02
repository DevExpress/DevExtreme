/*
 * The roles report: which semantic role every colour slot of the theme reads, and what the token
 * package's component tier says the same slot should read.
 *
 *   node tools/review/roles.mjs                        # → scss/widgets/fluent-next/ROLES.md
 *   node tools/review/roles.mjs --md                   # markdown to stdout
 *   node tools/review/roles.mjs --json                 # machine-readable, for the gate
 *   node tools/review/roles.mjs --theme=<dir> --json   # another theme folder; needs --json or --md
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
 *                fix and the gallery nav-disc defect (bg-disabled on a content slot: white on
 *                white).
 *   2. package — `@devexpress/design-tokens-internal/tokens/components/{core,vnext,blazor,wpf}` IS
 *                the role assignment design made, for four products. The theme does not consume it
 *                (decision 06.08.2026), and that is exactly why it reads as a reference. Remeasured
 *                on 262.25.0: of the colour leaves, 712/722 in core and 741/751 in vnext are plain
 *                `{color.<role>}` references, and not one leaf in core, vnext or wpf points at a
 *                palette primitive. The rest are references to other scales - focus, box-shadow,
 *                opacity - plus three literals: `#0f6cbd00` in core and vnext (the transparent
 *                edge of the progress bar's indeterminate gradient) and a malformed `#aN` twice
 *                on wpf's grid.cell.color.focused.bg. So the tier carries the mapping and no
 *                value of its own.
 *
 *                And the mapping is not fluent's: `theme/material.json` assigns the SAME role to
 *                the same path for 724 of its 726 leaves in core, and 753 of 755 in vnext. The two
 *                that differ are ai-chat.loading-text, where material holds a #ffffff literal where
 *                fluent holds a role. So what the package names is component anatomy rather than a
 *                palette artefact, and reading the fluent file is reading the design system itself.
 *
 * The package comparison is deliberately slot-level, not path-level. Our anatomy and the package's
 * do not line up segment by segment - 86 folders against 44 components, different sub-element trees
 * - and a table that pretended they did would be wrong more often than the roles it checks. So for
 * each component we cross-tabulate role -> slots as the package uses them, and ask one question:
 * is our role one the package uses in our slot? A "no" is a question, not a verdict; the report
 * names the slots the package does use it for, which is usually the answer.
 */

import {
  readFileSync, writeFileSync, readdirSync, statSync, existsSync,
} from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
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

const COMPONENT = {
  accordion: ['accordion'],
  actionSheet: ['popup', 'menu-list'],
  buttonGroup: ['button-group', 'button'],
  cardView: ['grid', 'container-card'],
  lookup: ['listbox', 'text-input'],
  speedDialAction: ['button'],
  validation: ['field', 'message-bar'],
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
  dateRangeBox: ['text-input', 'button-edit'],
  dateBox: ['text-input', 'button-edit'],
  drawer: ['drawer'],
  dropDownEditor: ['text-input', 'button-edit'],
  dropDownButton: ['split-button'],
  fileUploader: ['listbox', 'progress-bar'],
  fieldset: ['field'],
  form: ['form'],
  gallery: ['gallery'],
  gantt: ['grid'],
  gridBase: ['grid'],
  informer: ['message-bar'],
  list: ['listbox'],
  loadIndicator: ['spinner', 'loading-indicator', 'waitIndicator'],
  loadPanel: ['loading-panel'],
  menu: ['menu'],
  menuBase: ['menu', 'menu-list'],
  numberBox: ['text-input'],
  pagination: ['pagination', 'pager'],
  pivotGrid: ['grid'],
  popover: ['popover', 'popover-card', 'popover-arrow'],
  popup: ['popup', 'message-box'],
  progressBar: ['progress-bar'],
  radioButton: ['radio-button', 'radio'],
  radioGroup: ['radio-button', 'radio'],
  scrollable: ['scroll-bar'],
  slider: ['progress-bar', 'scroll-bar'],
  scrollView: ['scroll-view', 'scroll-bar'],
  selectBox: ['text-input'],
  splitter: ['splitter'],
  splitterBar: ['splitter'],
  switch: ['switch', 'switcher', 'toggle-switch'],
  tabPanel: ['tabs', 'tab-control'],
  tabs: ['tabs', 'tab-control'],
  tagBox: ['tagbox', 'tag'],
  tileView: ['listbox'],
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

const COMPONENT_AS_SLOT = { 'focus-rect': 'outline', skeleton: 'bg', 'empty-item': 'content' };

const SHARED = ['separator', 'focus-rect', 'backdrop', 'skeleton', 'empty-item', 'text-content', 'link'];

const FAMILY = {
  backdrop: 'bg',
  bg: 'bg',
  highlight: 'bg',
  scrim: 'bg',
  veil: 'bg',
  caption: 'content',
  chevron: 'content',
  content: 'content',
  'end-icon': 'content',
  icon: 'content',
  placeholder: 'content',
  shortcut: 'content',
  'start-icon': 'content',
  subtitle: 'content',
  text: 'content',
  title: 'content',
  border: 'border',
  line: 'border',
  outline: 'border',
  separator: 'border',
  shadow: 'shadow',
  'shadow-ambient': 'shadow',
  'shadow-key': 'shadow',
  grip: null,
  indicator: null,
  opacity: null,
  selector: null,
  thumb: null,
  track: null,
  trigger: null,
};

const KIN = {
  bg: 'bg',
  backdrop: 'bg',
  scrim: 'bg',
  veil: 'bg',
  highlight: 'bg',
  content: 'content',
  text: 'content',
  icon: 'content',
  'start-icon': 'content',
  'end-icon': 'content',
  title: 'content',
  subtitle: 'content',
  caption: 'content',
  placeholder: 'content',
  chevron: 'content',
  shortcut: 'content',
  trigger: 'content',
  border: 'border',
  outline: 'border',
  separator: 'border',
  line: 'border',
  shadow: 'shadow',
  'shadow-ambient': 'shadow',
  'shadow-key': 'shadow',
  grip: 'ambiguous',
  indicator: 'ambiguous',
  opacity: 'ambiguous',
  selector: 'ambiguous',
  thumb: 'ambiguous',
  track: 'ambiguous',
};
const kinOf = (slot) => KIN[slot] ?? 'ambiguous';
const kindred = (a, b) => a === b || kinOf(a) === 'ambiguous' || kinOf(b) === 'ambiguous'
  || kinOf(a) === kinOf(b);

const PARTS = [...registries.parts].sort((a, b) => b.length - a.length);
const STATES = [...registries.states].sort((a, b) => b.length - a.length);
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

const valueIndex = {};
for (const mode of MODES) {
  const map = new Map();
  const collect = (dir) => {
    readdirSync(dir).forEach((entry) => {
      const absolute = join(dir, entry);
      if (statSync(absolute).isDirectory()) { collect(absolute); return; }
      if (!entry.endsWith('.json')) return;
      if (/material/.test(absolute)) return;
      if (/[\\/]colors[\\/]/.test(absolute) && /^(light|dark)\.json$/.test(entry) && entry !== `${mode}.json`) return;
      leavesOf(JSON.parse(readFileSync(absolute, 'utf8'))).forEach(([name, value]) => {
        if (!map.has(name)) map.set(name, value);
      });
    });
  };
  for (const sub of ['base', 'global', 'semantic']) collect(join(tokensRoot, 'tokens', sub));
  valueIndex[mode] = map;
}
const resolveRole = (role, mode, depth = 0) => {
  const key = role.replace(/^color-/, 'color.');
  const raw = valueIndex[mode].get(key) ?? valueIndex[mode].get(role);
  if (raw === undefined) return null;
  if (typeof raw !== 'string' || !raw.startsWith('{') || depth > 12) return String(raw).toLowerCase();
  const alpha = /^\{([^}]+)\}([0-9a-f]{2})$/i.exec(raw);
  if (alpha) {
    const base = resolveRole(alpha[1], mode, depth + 1);
    return base && /^#[0-9a-f]{6}$/i.test(base) ? `${base}${alpha[2]}`.toLowerCase() : base;
  }
  return resolveRole(raw.replace(/[{}]/g, ''), mode, depth + 1);
};
const sameValue = (a, b) => MODES.every((mode) => {
  const va = resolveRole(a, mode);
  const vb = resolveRole(b, mode);
  return va !== null && vb !== null && va === vb;
});

const styleFiles = (dir) => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  if (statSync(absolute).isDirectory()) return styleFiles(absolute);
  return entry.endsWith('.scss') ? [absolute] : [];
});

const rawDeclarations = [];
for (const file of styleFiles(themeDir)) {
  const folder = relative(themeDir, file).split('/')[0];
  const colourFile = file.endsWith('_colors.scss');
  const source = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ''));
  source.split('\n').forEach((line, index) => {
    if (/^\s*\/\//.test(line)) return;
    const sass = /^\s*\$([a-z0-9-]+)\s*:\s*(.+?)(?:\s*!default)?\s*;/.exec(line);
    if (sass) {
      rawDeclarations.push({
        file, folder, colourFile, index, name: sass[1], value: sass[2], sass: true,
      });
      return;
    }
    /*
     * A tier name written straight as a custom property is a declaration too, and fourteen of them
     * sit on the theme root - `--dx-color-warning: #{ds.$color-content-warning}` and its
     * neighbours, the public aliases. Reading a role directly is the whole test: `--dx-toast-bg:
     * #{$toast-bg}` in a generated `_public.scss` only republishes a declaration already audited
     * under its Sass name, and counting it again would double the set.
     */
    const custom = /^\s*--(dx-[a-z0-9-]+)\s*:\s*(.+?)\s*;/.exec(line);
    if (!custom || !/ds\.\$/.test(custom[2])) return;
    rawDeclarations.push({
      file, folder, colourFile, index, name: custom[1].replace(/^dx-/, ''), value: custom[2],
    });
  });
}

const valueOf = new Map(rawDeclarations.filter((d) => d.sass).map((d) => [d.name, d.value]));
const rolesOf = (value, seen = new Set(), depth = 0) => {
  if (depth > 8) return [];
  const direct = [...value.matchAll(/ds\.\$([a-z0-9-]+)/g)].map((r) => r[1]);
  const refs = [...value.matchAll(/(?:[A-Za-z][\w-]*\.)?\$([a-z0-9-]+)/g)]
    .map((r) => r[1])
    .filter((n) => valueOf.has(n) && !seen.has(n));
  const borrowed = refs.flatMap((n) => {
    seen.add(n);
    return rolesOf(valueOf.get(n), seen, depth + 1);
  });
  return [...direct, ...borrowed];
};
const borrowsOf = (value) => [...new Set([...value.matchAll(/(?:[A-Za-z][\w-]*\.)?\$([a-z0-9-]+)/g)]
  .map((r) => r[1]).filter((n) => valueOf.has(n)))];

const declarations = [];
rawDeclarations.forEach(({
  file, folder, colourFile, index, name, value,
}) => {
  const roles = [...new Set(rolesOf(value))];
  const borrows = borrowsOf(value);
  if (!roles.length) return;
  if (!colourFile && !roles.some((role) => /^(color|box-shadow)-/.test(role))) return;
  const state = trailing(name, STATES);
  const bare = state ? name.slice(0, -state.length - 1) : name;
  const slot = trailing(bare, PARTS);
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
    ...(borrows.length ? { borrows } : {}),
  });
});

/*
 * Does the collector see every line that reads a role?
 *
 * Three times now a pass has narrowed its own input and then reported completeness over what was
 * left: declarations that borrow their value, declarations outside `_colors.scss`, tier names
 * written as custom properties. Each was found by hand, and each was invisible to `every colour
 * declaration reaches a verdict`, because that test counts the set the collector already built.
 *
 * So this counts from the file instead. Every line that mentions a colour or shadow role has to end
 * up as a declaration - or carry `dx-data-uri-static`, which means the role is named in a comment
 * beside a literal because the value is baked into an SVG and never reaches CSS. Anything else is a
 * blind spot, and the gate names the line.
 */
const coverage = {
  lines: 0, collected: 0, dataUriStatic: 0, unexplained: [],
};
{
  const collected = new Set(declarations.map((d) => d.where));
  for (const file of styleFiles(themeDir)) {
    const source = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ''));
    source.split('\n').forEach((line, index) => {
      if (/^\s*\/\//.test(line) || !/ds\.\$(color|box-shadow)-/.test(line)) return;
      coverage.lines += 1;
      const where = `${relative(packageRoot, file)}:${index + 1}`;
      if (collected.has(where)) coverage.collected += 1;
      else if (/dx-data-uri-static/.test(line)) coverage.dataUriStatic += 1;
      else coverage.unexplained.push(where);
    });
  }
}

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
  const asSlot = COMPONENT_AS_SLOT[segments[0]] ?? trailing(segments[0], PARTS);
  if (asSlot) return { slot: asSlot, state, variant: tail.join('.') };
  return { slot: null, state, variant: tail.join('.') };
};

const WPF_EXTRA = ['accordion', 'button-group', 'docking', 'groupbox', 'listbox-edit', 'pagercontrol', 'progress-bar', 'text-content'];
const setFiles = (set) => {
  const files = [join(tokensRoot, 'tokens', 'components', set, 'theme', 'fluent.json')];
  if (set === 'wpf') {
    for (const extra of WPF_EXTRA) {
      const file = join(tokensRoot, 'tokens', 'components', set, extra, 'fluent.json');
      if (existsSync(file)) files.push(file);
    }
  }
  return files;
};
const componentsOf = (set) => Object.assign({}, ...setFiles(set).map((f) => JSON.parse(readFileSync(f, 'utf8'))));

const packageTier = {};
for (const set of SETS) {
  const components = componentsOf(set);
  packageTier[set] = {};
  for (const [component, tree] of Object.entries(components)) {
    const bySlot = new Map();
    const byState = new Map();
    const byRole = new Map();
    const unknownSlots = new Set();
    leavesOf(tree).forEach(([path, raw]) => {
      if (typeof raw !== 'string' || !raw.startsWith('{')) return;
      const role = raw.replace(/[{}]/g, '').replace(/^(color|global\.color)\./, 'color-');
      if (!role.startsWith('color-')) return;
      const anatomy = dissect(`${component}.${path}`);
      if (!anatomy) return;
      if (!anatomy.slot) { unknownSlots.add(path); return; }
      if (!bySlot.has(anatomy.slot)) bySlot.set(anatomy.slot, new Set());
      bySlot.get(anatomy.slot).add(role);
      if (!byState.has(anatomy.slot)) byState.set(anatomy.slot, new Map());
      const states = byState.get(anatomy.slot);
      if (!states.has(anatomy.state)) states.set(anatomy.state, new Set());
      states.get(anatomy.state).add(role);
      if (!byRole.has(role)) byRole.set(role, new Set());
      byRole.get(role).add(anatomy.slot);
    });
    packageTier[set][component] = {
      bySlot, byState, byRole, unknownSlots,
    };
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
 * None of the four neighbors has this: their component sets reference the typography ROLES and a
 * bare step three times in total. So a place here is not "the package is missing a role" by
 * default - it is a choice between the legacy value and the design system's grid, and the report
 * has to put both in front of whoever decides.
 */
const TYPOGRAPHY = ['font-size', 'font-weight', 'line-height'];

const typographyGrid = {};
for (const family of TYPOGRAPHY) {
  const roles = [];
  valueIndex.light.forEach((raw, name) => {
    if (!name.startsWith(`${family}.`)) return;
    const step = /^\{?([a-z-]+)\.(\d+)\}?$/.exec(String(raw));
    if (!step) return;
    roles.push({ role: name.split('.')[1], step: Number(step[2]) });
  });
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
  readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, '')).split('\n').forEach((line, index) => {
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

const PROPERTY_FAMILY = [
  [/^(background|background-color|background-image)$/, 'bg'],
  [/^(color|fill|caret-color|-webkit-text-fill-color)$/, 'content'],
  [/(^|-)border(-|$)|^outline(-|$)|^stroke$|^border-color$/, 'border'],
  [/shadow$/, 'shadow'],
];
const bundlePath = join(packageRoot, '..', 'devextreme', 'artifacts', 'css', 'dx.fluent-next.blue.light.css');
const paints = new Map();
const declaredInBundle = new Set();
if (existsSync(bundlePath)) {
  const css = readFileSync(bundlePath, 'utf8');
  for (const [, name] of css.matchAll(/(--dx-[a-z0-9-]+)\s*:/g)) declaredInBundle.add(name);
  for (const [, property, value] of css.matchAll(/([a-z-]+)\s*:\s*([^;{}]*var\(--dx-[^;{}]*)/g)) {
    for (const [, name] of value.matchAll(/var\(\s*(--dx-[a-z0-9-]+)/g)) {
      if (!paints.has(name)) paints.set(name, new Set());
      paints.get(name).add(property);
    }
  }
}
const familyOfProperty = (property) => PROPERTY_FAMILY
  .find(([re]) => re.test(property))?.[1] ?? null;

const findings = [];
for (const declaration of declarations) {
  const {
    slot, subElementSlots, roles, folder, state,
  } = declaration;
  const ourSlots = [slot, ...subElementSlots].filter(Boolean);
  const record = { ...declaration, family: null, package: null };

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
      [...candidates, ...SHARED].forEach((candidate) => {
        const tier = packageTier[set][candidate];
        if (!tier) return;
        seen.push({
          set, component: candidate, tier, own: candidates.includes(candidate),
        });
      });
    }
    if (!seen.length) record.package = { verdict: 'no-counterpart' };
    else {
      const exact = [];
      const kin = [];
      const sameComponent = new Set();
      const crossFamily = new Map();
      const slotRoles = new Set();
      for (const {
        set, component, tier, own,
      } of seen) {
        tier.bySlot.forEach((pkgRoles, pkgSlot) => {
          if (kinOf(pkgSlot) !== kinOf(slot) || kinOf(slot) === 'ambiguous') return;
          pkgRoles.forEach((role) => slotRoles.add(role));
        });
        roles.forEach((role) => {
          const usedIn = [...(tier.byRole.get(role) ?? [])];
          if (!usedIn.length) return;
          if (usedIn.some((pkgSlot) => ourSlots.includes(pkgSlot))) exact.push(`${set}/${component}`);
          else if (usedIn.some((pkgSlot) => ourSlots.some((ours) => kindred(pkgSlot, ours)))) kin.push(`${set}/${component}:${usedIn.join(',')}`);
          else {
            const key = usedIn.sort().join('|');
            if (!crossFamily.has(key)) crossFamily.set(key, []);
            crossFamily.get(key).push(`${set}/${component}`);
            if (own) sameComponent.add(`${set}/${component}:${usedIn.join(',')}`);
          }
        });
      }
      const packageRolesHere = [...slotRoles].sort();
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
          packageUsesHere: packageRolesHere,
        };
      } else if (crossFamily.size) {
        record.package = { verdict: 'role-new', packageUsesHere: packageRolesHere };
      } else if (packageRolesHere.length) {
        const ourFamilies = new Set(roles.map(familyOf).filter((f) => f !== 'none'));
        const theirFamilies = new Set(packageRolesHere.map(familyOf).filter((f) => f !== 'none'));
        if (!theirFamilies.size) record.package = { verdict: 'slot-absent' };
        else {
          const shared = [...ourFamilies].some((f) => theirFamilies.has(f));
          record.package = { verdict: shared ? 'role-new' : 'family-conflict', packageUsesHere: packageRolesHere };
        }
      } else record.package = { verdict: 'slot-absent' };

      const rung = new Set();
      const usedAt = new Set();
      const rungWhere = [];
      seen.filter(({ own }) => own).forEach(({ set, component, tier }) => {
        tier.byState.forEach((states, pkgSlot) => {
          if (kinOf(pkgSlot) !== kinOf(slot) || kinOf(slot) === 'ambiguous') return;
          for (const [pkgState, named] of states) {
            if (pkgState === state || (state === 'disabled' && pkgState === 'disable')) {
              for (const role of named) rung.add(role);
              rungWhere.push(`${set}/${component}.${pkgSlot}.${pkgState}`);
            } else if (roles.some((role) => named.has(role))) usedAt.add(pkgState);
          }
        });
      });
      if (rung.size && usedAt.size && !roles.some((role) => rung.has(role))) {
        record.rung = {
          state,
          want: [...rung].sort(),
          oursAt: [...usedAt].sort(),
          where: [...new Set(rungWhere)].sort(),
        };
      }
    }
  }
  const painted = [...(paints.get(`--dx-${declaration.name}`) ?? [])].sort();
  if (painted.length) {
    const families = [...new Set(painted.map(familyOfProperty).filter(Boolean))];
    record.paints = { properties: painted, families };
    if (FAMILY[slot] && families.length && !families.includes(FAMILY[slot])) {
      record.slotLies = { slotSays: FAMILY[slot], propertySays: families };
    }
  }

  const packageUses = record.package?.packageUsesHere ?? [];
  if (packageUses.length && roles.length === 1) {
    const free = packageUses
      .filter((candidate) => candidate !== roles[0] && sameValue(candidate, roles[0]));
    const ours = Object.fromEntries(MODES.map((m) => [m, resolveRole(roles[0], m)]));
    record.swap = { free, ours };
    if (!free.length) {
      const wanted = FAMILY[record.slot];
      record.near = packageUses
        .filter((candidate) => !wanted || familyOf(candidate) === wanted)
        .map((candidate) => ({
          role: candidate,
          moves: MODES
            .filter((mode) => resolveRole(candidate, mode) !== resolveRole(roles[0], mode)),
        }))
        .filter((candidate) => candidate.moves.length)
        .sort((a, b) => a.moves.length - b.moves.length);
    }
  }
  findings.push(record);
}

const ACCEPTED_COLLAPSE = [['focused', 'hovered'], ['focused', 'active'], ['selected-focused', 'selected-hovered']];
const acceptedPair = (a, b) => ACCEPTED_COLLAPSE
  .some(([x, y]) => (a === x && b === y) || (a === y && b === x));

const ladders = [];
{
  const groups = new Map();
  declarations.filter((declaration) => declaration.slot).forEach((declaration) => {
    const stem = declaration.state === 'rest'
      ? declaration.name
      : declaration.name.slice(0, -declaration.state.length - 1);
    if (!groups.has(stem)) groups.set(stem, []);
    groups.get(stem).push(declaration);
  });
  groups.forEach((members, stem) => {
    if (members.length < 2) return;
    const byRole = new Map();
    members.forEach((member) => {
      const key = member.roles.join('+');
      if (!byRole.has(key)) byRole.set(key, []);
      byRole.get(key).push(member.state);
    });
    byRole.forEach((states, role) => {
      if (states.length < 2) return;
      const pairs = states.flatMap((a, i) => states.slice(i + 1).map((b) => [a, b]));
      if (pairs.every(([a, b]) => acceptedPair(a, b))) return;
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
    });
  });
  ladders.sort((a, b) => a.stem.localeCompare(b.stem));
}

const hexOf = (value) => {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(value).trim());
  if (!hex) return null;
  const body = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join('') : hex[1];
  return [0, 2, 4].map((i) => parseInt(body.slice(i, i + 2), 16));
};
const luminance = (rgb) => {
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

const roleOfTierName = new Map(declarations
  .filter((d) => !d.bridged && d.roles.length === 1)
  .map((d) => [`--dx-${d.name}`, d.roles[0]]));
const pairs = [];
if (existsSync(bundlePath)) {
  const css = readFileSync(bundlePath, 'utf8');
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].forEach(([, selector, body]) => {
    if (selector.trim().startsWith('@')) return;
    if (/dx-state-disabled|dx-state-readonly|dx-button-disable/.test(selector)) return;
    const grab = (property) => new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*var\\(\\s*(--dx-[a-z0-9-]+)`).exec(body)?.[1];
    const fg = grab('color');
    const bg = grab('background-color') ?? grab('background');
    if (!fg || !bg) return;
    const fgRole = roleOfTierName.get(fg);
    const bgRole = roleOfTierName.get(bg);
    if (!fgRole || !bgRole) return;
    const measured = {};
    MODES.forEach((mode) => {
      const a = hexOf(resolveRole(fgRole, mode));
      const b = hexOf(resolveRole(bgRole, mode));
      if (a && b) measured[mode] = Math.round(contrast(a, b) * 100) / 100;
    });
    if (!Object.keys(measured).length) return;
    pairs.push({
      selector: selector.trim().replace(/\s+/g, ' ').slice(0, 90), fg, bg, fgRole, bgRole, contrast: measured,
    });
  });
}
const AA = 4.5;
const lowContrast = pairs
  .filter((pair) => MODES
    .some((mode) => pair.contrast[mode] !== undefined && pair.contrast[mode] < AA))
  .filter((pair, index, all) => all
    .findIndex((other) => other.fg === pair.fg && other.bg === pair.bg) === index)
  .sort((a, b) => Math.min(...Object.values(a.contrast)) - Math.min(...Object.values(b.contrast)));

const STATE_CLASS = /\.dx-state-(?:hover|focused|active|selected)\b/g;
const elementKey = (selector) => selector
  .replace(STATE_CLASS, '')
  .replace(/:(?:hover|focus|focus-visible|active)\b/g, '')
  .trim()
  .replace(/\s+/g, ' ');

const foregroundOf = new Map();
const statePairs = [];
if (existsSync(bundlePath)) {
  const css = readFileSync(bundlePath, 'utf8');
  const rules = [];
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].forEach(([, selectorList, body]) => {
    if (selectorList.trim().startsWith('@')) return;
    if (/dx-state-disabled|dx-state-readonly|dx-button-disable/.test(selectorList)) return;
    const grab = (property) => new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*var\\(\\s*(--dx-[a-z0-9-]+)`).exec(body)?.[1];
    const fg = grab('color');
    const bg = grab('background-color') ?? grab('background');
    if (!fg && !bg) return;
    selectorList.split(',').forEach((one) => {
      const selector = one.trim().replace(/\s+/g, ' ');
      if (!selector) return;
      rules.push({
        selector, key: elementKey(selector), fg, bg, stated: STATE_CLASS.test(selector),
      });
      STATE_CLASS.lastIndex = 0;
    });
  });
  rules.forEach((rule) => {
    if (rule.fg && !rule.stated) foregroundOf.set(rule.key, rule);
  });
  const statedForegroundOf = new Map();
  const stateKey = (selector) => {
    STATE_CLASS.lastIndex = 0;
    return `${elementKey(selector)}\u0000${(selector.match(STATE_CLASS) ?? []).sort().join('')}`;
  };
  rules.forEach((rule) => {
    if (rule.fg && rule.stated) statedForegroundOf.set(stateKey(rule.selector), rule);
  });
  rules.forEach((rule) => {
    if (!rule.stated || !rule.bg || rule.fg) return;
    const rest = statedForegroundOf.get(stateKey(rule.selector)) ?? foregroundOf.get(rule.key);
    if (!rest) return;
    const fgRole = roleOfTierName.get(rest.fg);
    const bgRole = roleOfTierName.get(rule.bg);
    if (!fgRole || !bgRole) return;
    const measured = {};
    MODES.forEach((mode) => {
      const a = hexOf(resolveRole(fgRole, mode));
      const b = hexOf(resolveRole(bgRole, mode));
      if (a && b) measured[mode] = Math.round(contrast(a, b) * 100) / 100;
    });
    if (!Object.keys(measured).length) return;
    statePairs.push({
      selector: rule.selector.slice(0, 90),
      restSelector: rest.selector.slice(0, 90),
      fg: rest.fg,
      bg: rule.bg,
      fgRole,
      bgRole,
      contrast: measured,
    });
  });
}
const GRAPHIC = 3;
const lowStatePairs = statePairs
  .filter((pair) => MODES
    .some((mode) => pair.contrast[mode] !== undefined && pair.contrast[mode] < AA))
  .filter((pair, index, all) => all
    .findIndex((other) => other.fg === pair.fg && other.bg === pair.bg) === index)
  .sort((a, b) => Math.min(...Object.values(a.contrast)) - Math.min(...Object.values(b.contrast)));

const MODIFIER_WORDS = new Set(Object.values(registries.modifiers).flat());
const concepts = [];
{
  const groups = new Map();
  declarations
    .filter((declaration) => declaration.slot && declaration.roles.length === 1)
    .forEach((declaration) => {
      const bare = declaration.state === 'rest'
        ? declaration.name
        : declaration.name.slice(0, -declaration.state.length - 1);
      const middle = bare.slice(0, -declaration.slot.length).replace(/-$/, '').split('-');
      const modifiers = [...new Set(middle.filter((word) => MODIFIER_WORDS.has(word)))].sort();
      if (!modifiers.length) return;
      const key = `${modifiers.join('+')} ${declaration.slot} ${declaration.state}`;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(declaration);
    });
  groups.forEach((members, concept) => {
    const folders = [...new Set(members.map((m) => m.folder))];
    const roles = [...new Set(members.map((m) => m.roles[0]))];
    if (folders.length < 2 || roles.length < 2) return;
    const families = [...new Set(roles.map(familyOf).filter((f) => f !== 'none'))];
    const valueOfRole = (role) => MODES.map((mode) => resolveRole(role, mode)).join(' / ');
    const values = new Set(roles.map(valueOfRole));
    const oneColour = values.size === 1;
    const clusters = [...values].map((value) => ({
      value,
      roles: roles.filter((role) => valueOfRole(role) === value),
    })).filter((cluster) => cluster.roles.length > 1);
    const seen = new Set();
    concepts.push({
      concept,
      families,
      roles,
      oneColour,
      clusters,
      members: members.filter((m) => {
        const key = `${m.folder}|${m.roles[0]}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).map((m) => ({
        folder: m.folder, name: m.name, role: m.roles[0], where: m.where,
      })),
    });
  });
  concepts.sort((a, b) => b.families.length - a.families.length
    || b.roles.length - a.roles.length || a.concept.localeCompare(b.concept));
}

const declaredRoles = new Set();
for (const [name] of valueIndex.light) declaredRoles.add(name.replace(/^(color|global\.color)\./, 'color-'));

const offeredRoles = new Map();
SETS.forEach((set) => {
  leavesOf(componentsOf(set)).forEach(([, raw]) => {
    if (typeof raw !== 'string' || !raw.startsWith('{')) return;
    const role = raw.replace(/[{}]/g, '').replace(/^(color|global\.color)\./, 'color-');
    if (!role.startsWith('color-') || role === 'color-none') return;
    if (!offeredRoles.has(role)) offeredRoles.set(role, new Set());
    offeredRoles.get(role).add(set);
  });
});
const readRoles = new Set(declarations.flatMap((d) => d.roles));
const unusedRoles = { capability: [], stale: [] };
[...offeredRoles].sort()
  .filter(([role]) => !readRoles.has(role))
  .forEach(([role, sets]) => {
    unusedRoles[declaredRoles.has(role) ? 'capability' : 'stale']
      .push({ role, sets: [...sets].sort() });
  });

const count = (predicate) => findings.filter(predicate).length;
const verdicts = ['agrees', 'agrees-kin', 'cross-family', 'family-conflict', 'role-new',
  'slot-absent', 'no-counterpart', 'slot-unparsed'];
const summary = {
  tokensVersion,
  declarations: findings.length,
  typographyStepReads: typography.length,
  typographyOffGrid: typography.filter((t) => !t.roles.length).length,
  typographyUnmarked: typography.filter((t) => !t.marker).length,
  collapsedLadders: ladders.length,
  conceptsSplit: concepts.length,
  conceptsSplitAcrossFamilies: concepts.filter((c) => c.families.length > 1).length,
  conceptsSameColour: concepts.filter((c) => c.oneColour).length,
  conceptsWithSpellingClusters: concepts.filter((c) => c.clusters.length).length,
  rolesOffered: offeredRoles.size,
  rolesRead: offeredRoles.size - unusedRoles.capability.length - unusedRoles.stale.length,
  rolesUnusedCapability: unusedRoles.capability.length,
  rolesStaleInNeighbours: unusedRoles.stale.length,
  contrastPairsMeasured: pairs.length,
  contrastBelowAA: lowContrast.length,
  contrastDarkOnly: lowContrast
    .filter((p) => p.contrast.light >= AA && p.contrast.dark < AA).length,
  declarationsMissingFromBundle: findings.filter((f) => !declaredInBundle.has(`--dx-${f.name}`)).length,
  statePairsMeasured: statePairs.length,
  statePairsBelowGraphic: lowStatePairs.length,
  familyMismatch: count((f) => f.family),
  slotLies: count((f) => f.slotLies),
  rungMismatch: count((f) => f.rung),
  familyMismatchExplainedByProperty: count((f) => f.family && f.slotLies
    && f.slotLies.propertySays.some((fam) => f.family.got.includes(fam))),
  byVerdict: Object.fromEntries(verdicts.map((v) => [v, count((f) => f.package?.verdict === v)])),
};

const roleList = (roles) => roles.map((r) => `ds.$${r}`).join(' + ');

const swapLine = (f) => {
  if (!f.swap) return null;
  const { free, ours } = f.swap;
  const value = MODES.map((m) => `${m} ${ours[m] ?? '?'}`).join(' / ');
  if (free.length) {
    return `    - **free swap**: \`${free[0]}\` resolves identically in both modes (${value})${
      free.length > 1 ? `; also ${free.slice(1).map((r) => `\`${r}\``).join(', ')}` : ''}`;
  }
  const near = (f.near ?? []).slice(0, 3)
    .map((n) => `\`${n.role}\` (moves ${n.moves.join(' and ')})`)
    .join(', ');
  return `    - ours resolves ${value}; no role of the right family shares it${
    near ? `. Nearest of the right family: ${near}` : ''}`;
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
  out.push(`| our role is the package's role for another rung | **${summary.rungMismatch}** |`);
  out.push(`| states that resolve to one role | **${summary.collapsedLadders}** |`);
  out.push(`| one concept painted with several roles | **${summary.conceptsSplit}** (${summary.conceptsSplitAcrossFamilies} across families) |`);
  out.push(`| text/background pairs below AA | **${summary.contrastBelowAA}** of ${summary.contrastPairsMeasured} measured (${summary.contrastDarkOnly} dark only) |`);
  for (const verdict of verdicts) out.push(`| package: ${verdict} | ${summary.byVerdict[verdict]} |`);
  out.push('');

  const section = (title, rows, render) => {
    if (!rows.length) return;
    out.push(`## ${title} - ${rows.length}\n`);
    for (const row of rows) out.push(render(row));
    out.push('');
  };

  section(
    'Cross-family - the package uses this role, but only for a slot of another kind',
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
    ].filter(Boolean).join('\n'),
  );

  section(
    'Family conflict - the package paints this slot from another family entirely',
    findings.filter((f) => f.package?.verdict === 'family-conflict'),
    (f) => [
      `- \`${f.name}\` = ${roleList(f.roles)}  (${f.where})`,
      `    - for slot \`${f.slot}\` the package uses: ${f.package.packageUsesHere.map((r) => `\`${r}\``).join(', ')}`,
      swapLine(f),
    ].filter(Boolean).join('\n'),
  );

  section(
    'Family mismatch',
    findings.filter((f) => f.family),
    (f) => `- \`${f.name}\` = ${roleList(f.roles)}  (${f.where})\n`
      + `    - slot \`${f.family.slot}\` wants \`color-${f.family.want}-*\`, reads a \`${f.family.got.join('/')}\` role${
        f.package ? `; package verdict: ${f.package.verdict}` : ''}`,
  );

  section(
    'The rung - our role is the one the package names for another state of the same slot',
    findings.filter((f) => f.rung),
    (f) => `- \`${f.name}\` = ${roleList(f.roles)}  (${f.where})\n`
      + `    - our rung is \`${f.rung.state}\`; the package uses this role for the same slot at `
      + `${f.rung.oursAt.map((x) => `\`${x}\``).join(', ')}\n`
      + `    - and names for \`${f.rung.state}\`: ${f.rung.want.map((r) => `\`${r}\``).join(', ')}`,
  );

  out.push(`## Roles the package assigns and the theme never reads - ${unusedRoles.capability.length}\n`);
  out.push('Counted from the package inward rather than from our declarations outward, because a whole');
  out.push('family can be missing without any single declaration looking wrong.\n');
  out.push(`Of the ${offeredRoles.size} roles the four sets assign, the theme reads ${offeredRoles.size - unusedRoles.capability.length - unusedRoles.stale.length}.`);
  out.push(`${unusedRoles.capability.length} exist in the semantic layer and go unread; ${unusedRoles.stale.length} are names no layer declares -`);
  out.push('stale references inside the neighbours\' own sets.\n');
  out.push('| Role | Assigned by |', '|---|---|');
  for (const u of unusedRoles.capability) out.push(`| \`${u.role}\` | ${u.sets.join(', ')} |`);
  out.push('');

  out.push(`## One concept, several roles - ${concepts.length} (${summary.conceptsSplitAcrossFamilies} across families)\n`);
  out.push('Grouped by what the name says the thing is - modifiers, slot, state - with sub-elements');
  out.push('dropped. A shade apart is a difference two components can honestly have; a family apart is');
  out.push('one concept painted as a fill in one widget and as a border in the next. Listed first are');
  out.push('the ones where every role resolves to the SAME colour in both modes - the same paint under');
  out.push('several names, free to unify and, until then, repainted differently by the next redesign.\n');
  for (const c of concepts) {
    out.push(`- **${c.concept}** - ${c.roles.length} roles, ${c.families.length} famil${c.families.length > 1 ? 'ies' : 'y'}${
      c.oneColour ? ', **one colour under several names**' : ''}`);
    for (const cluster of c.clusters) {
      out.push(`    - **one colour, ${cluster.roles.length} names** (${cluster.value}): ${
        cluster.roles.map((r) => `\`${r}\``).join(', ')}`);
    }
    for (const m of c.members) out.push(`    - ${m.folder}: \`${m.role}\`  (${m.where})`);
  }
  out.push('');

  out.push(`## Text on its own background, below AA - ${lowContrast.length} of ${pairs.length} measured pairs\n`);
  out.push('Only pairs the bundle puts in one rule, so no assumption about which surface a text sits');
  out.push('on. A row that passes in light and fails in dark is the case nothing else can see: the');
  out.push('etalons are all .light and the axe rule reads text only.\n');
  out.push('Both thresholds matter and the report does not pick for you: 4.5:1 for text, 3:1 for a');
  out.push('glyph or a control boundary. A checkmark at 3.36 passes as a graphic; the same number under');
  out.push('a menu label does not.\n');
  out.push('| Selector | Text | On | Light | Dark |');
  out.push('|---|---|---|---|---|');
  for (const pair of lowContrast) {
    const mark = (value) => (value === undefined ? '-' : `${value}${value < AA ? ' ⚠' : ''}`);
    out.push(`| \`${pair.selector}\` | \`${pair.fgRole}\` | \`${pair.bgRole}\` `
      + `| ${mark(pair.contrast.light)} | ${mark(pair.contrast.dark)} |`);
  }
  out.push('');

  out.push(`## A glyph left behind by its own state - ${lowStatePairs.length} of ${statePairs.length} cross-state pairs\n`);
  out.push('The table above can only measure a foreground and a background written in one rule. A state');
  out.push('ladder never writes them together: the focused rule repaints the fill and leaves the glyph');
  out.push('to the rest rule. These rows pair the two by element, with the state classes stripped, so');
  out.push('the checked box is never matched against an unchecked one.\n');
  out.push('Two thresholds, as above: 4.5:1 if the foreground is a label, 3:1 if it is a glyph or a');
  out.push('boundary (WCAG 1.4.11, which no axe rule implements and no screenshot can see). A single');
  out.push('warning marks a row under 4.5, a double one a row under 3.\n');
  out.push('| Selector | Glyph | On the state fill | Light | Dark |');
  out.push('|---|---|---|---|---|');
  for (const pair of lowStatePairs) {
    const warn = (value) => {
      if (value < GRAPHIC) return ' \u26a0\u26a0';
      return value < AA ? ' \u26a0' : '';
    };
    const mark = (value) => (value === undefined ? '-' : `${value}${warn(value)}`);
    out.push(`| \`${pair.selector}\` | \`${pair.fgRole}\` | \`${pair.bgRole}\` `
      + `| ${mark(pair.contrast.light)} | ${mark(pair.contrast.dark)} |`);
  }
  out.push('');

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
  out.push('border role, and a value that paints two properties is named after the dominant one.\n');
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

const palette = {};
const roleNames = new Set([...declarations.flatMap((d) => d.roles), ...offeredRoles.keys()]);
for (const key of valueIndex.light.keys()) {
  if (key.startsWith('color.')) roleNames.add(key.replace(/^color\./, 'color-'));
}
for (const role of [...roleNames].sort()) {
  const entry = {};
  for (const mode of MODES) {
    const value = resolveRole(role, mode);
    if (value) entry[mode] = value;
  }
  if (Object.keys(entry).length) palette[role] = entry;
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({
    summary,
    findings,
    typography,
    ladders,
    lowContrast,
    lowStatePairs,
    concepts,
    unusedRoles,
    palette,
    coverage,
  }, null, 2));
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
