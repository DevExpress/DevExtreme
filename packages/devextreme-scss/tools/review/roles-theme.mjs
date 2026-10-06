/*
 * The theme half of the roles report: what every colour slot of the theme reads, collected from
 * the scss sources and the built bundle alone. No token package is loaded, so a package bump
 * cannot move anything this module reports; tools/review/roles.mjs adds the package's side on top.
 *
 *   node tools/review/roles-theme.mjs --json                 # machine-readable, for the gate
 *   node tools/review/roles-theme.mjs --theme=<dir> [--bundle=<css>] --json
 *                                                            # another theme folder; its bundle
 *                                                            # is never assumed, so without
 *                                                            # --bundle the paint checks are off
 *
 * The family signal lives here: a `-bg` slot must read a color-bg-* role, `-content` a
 * color-content-* one, and so on. So do the paint checks, read from the bundle (what the browser
 * gets, not what the name claims), and the groupings that need no value: state ladders and
 * concepts.
 */

import {
  readFileSync, readdirSync, statSync, existsSync,
} from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..', '..');
export const defaultThemeDir = join(packageRoot, 'scss', 'widgets', 'fluent-next');
export const defaultBundlePath = join(packageRoot, '..', 'devextreme', 'artifacts', 'css', 'dx.fluent-next.blue.light.css');
export const registries = JSON.parse(readFileSync(join(packageRoot, 'tools', 'naming', 'registries.json'), 'utf8'));

export const FAMILY = {
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

export const PARTS = [...registries.parts].sort((a, b) => b.length - a.length);
const STATES = [...registries.states].sort((a, b) => b.length - a.length);

export const familyOf = (role) => {
  if (/^(box-shadow|color-shadow)-/.test(role)) return 'shadow';
  if (role === 'color-none' || role === 'none') return 'none';
  return /^color-(bg|content|border)\b/.exec(role)?.[1] ?? 'other';
};

export const trailing = (name, vocabulary) => {
  for (const word of vocabulary) if (name === word || name.endsWith(`-${word}`)) return word;
  return null;
};

const styleFiles = (dir) => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  if (statSync(absolute).isDirectory()) return styleFiles(absolute);
  return entry.endsWith('.scss') ? [absolute] : [];
});

const collectDeclarations = (themeDir) => {
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
       * A tier name written straight as a custom property is a declaration too, and fourteen of
       * them sit on the theme root - `--dx-color-warning: #{ds.$color-content-warning}` and its
       * neighbours, the public aliases. Reading a role directly is the whole test: `--dx-toast-bg:
       * #{$toast-bg}` in a generated `_public.scss` only republishes a declaration already
       * audited under its Sass name, and counting it again would double the set.
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
  return declarations;
};

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
const coverageOf = (themeDir, declarations) => {
  const coverage = {
    lines: 0, collected: 0, dataUriStatic: 0, unexplained: [],
  };
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
  return coverage;
};

const MARKERS = /dx-(no-semantic-role|icon-glyph-size|offscale|relative|px-nudge|literal-required|fixed-size|line-width|shadow-geometry)/;

const sizeFiles = (dir) => readdirSync(dir).flatMap((entry) => {
  const absolute = join(dir, entry);
  if (statSync(absolute).isDirectory()) return sizeFiles(absolute);
  return entry === '_sizes.scss' ? [absolute] : [];
});

const typographyReads = (themeDir) => {
  const typography = [];
  for (const file of sizeFiles(themeDir)) {
    const folder = relative(themeDir, file).split('/')[0];
    readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, '')).split('\n').forEach((line, index) => {
      if (/^\s*\/\//.test(line)) return;
      const read = /ds\.\$(font-size|font-weight|line-height)-(\d+)/.exec(line);
      if (!read) return;
      const [, family, step] = read;
      typography.push({
        folder,
        where: `${relative(packageRoot, file)}:${index + 1}`,
        variable: /\$([a-z0-9-]+)\s*:/.exec(line)?.[1] ?? '(inline)',
        family,
        step: Number(step),
        marker: MARKERS.exec(line)?.[1] ?? null,
      });
    });
  }
  return typography;
};

const PROPERTY_FAMILY = [
  [/^(background|background-color|background-image)$/, 'bg'],
  [/^(color|fill|caret-color|-webkit-text-fill-color)$/, 'content'],
  [/(^|-)border(-|$)|^outline(-|$)|^stroke$|^border-color$/, 'border'],
  [/shadow$/, 'shadow'],
];
const familyOfProperty = (property) => PROPERTY_FAMILY
  .find(([re]) => re.test(property))?.[1] ?? null;

const readBundle = (bundlePath) => {
  const paints = new Map();
  const declaredInBundle = new Set();
  if (bundlePath && existsSync(bundlePath)) {
    const css = readFileSync(bundlePath, 'utf8');
    for (const [, name] of css.matchAll(/(--dx-[a-z0-9-]+)\s*:/g)) declaredInBundle.add(name);
    for (const [, property, value] of css.matchAll(/([a-z-]+)\s*:\s*([^;{}]*var\(--dx-[^;{}]*)/g)) {
      for (const [, name] of value.matchAll(/var\(\s*(--dx-[a-z0-9-]+)/g)) {
        if (!paints.has(name)) paints.set(name, new Set());
        paints.get(name).add(property);
      }
    }
  }
  return { paints, declaredInBundle };
};

const findingOf = (declaration, paints) => {
  const { slot, roles } = declaration;
  const finding = { ...declaration, family: null };
  if (slot && FAMILY[slot]) {
    const want = FAMILY[slot];
    const got = [...new Set(roles.map(familyOf))].filter((f) => f !== 'none');
    if (got.length && !got.includes(want)) finding.family = { want, got, slot };
  }
  const painted = [...(paints.get(`--dx-${declaration.name}`) ?? [])].sort();
  if (painted.length) {
    const families = [...new Set(painted.map(familyOfProperty).filter(Boolean))];
    finding.paints = { properties: painted, families };
    if (FAMILY[slot] && families.length && !families.includes(FAMILY[slot])) {
      finding.slotLies = { slotSays: FAMILY[slot], propertySays: families };
    }
  }
  return finding;
};

const ACCEPTED_COLLAPSE = [['focused', 'hovered'], ['focused', 'active'], ['selected-focused', 'selected-hovered']];
const acceptedPair = (a, b) => ACCEPTED_COLLAPSE
  .some(([x, y]) => (a === x && b === y) || (a === y && b === x));

// `statesInOrder` keeps declaration order; the package report derives its rung list from it
const laddersOf = (declarations) => {
  const ladders = [];
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
      ladders.push({
        stem,
        folder: members[0].folder,
        where: members.find((m) => states.includes(m.state)).where,
        role: role.split('+'),
        statesInOrder: [...states],
        states: states.sort(),
      });
    });
  });
  return ladders.sort((a, b) => a.stem.localeCompare(b.stem));
};

const conceptsOf = (declarations) => {
  const MODIFIER_WORDS = new Set(Object.values(registries.modifiers).flat());
  const concepts = [];
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
    const seen = new Set();
    concepts.push({
      concept,
      families,
      roles,
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
  return concepts.sort((a, b) => b.families.length - a.families.length
    || b.roles.length - a.roles.length || a.concept.localeCompare(b.concept));
};

// another theme folder gets no bundle by default: the fluent-next one would describe other CSS
export const collectTheme = ({
  themeDir = defaultThemeDir,
  bundlePath = themeDir === defaultThemeDir ? defaultBundlePath : null,
} = {}) => {
  const declarations = collectDeclarations(themeDir);
  const { paints, declaredInBundle } = readBundle(bundlePath);
  const findings = declarations.map((declaration) => findingOf(declaration, paints));
  return {
    declarations,
    findings,
    coverage: coverageOf(themeDir, declarations),
    typography: typographyReads(themeDir),
    ladders: laddersOf(declarations),
    concepts: conceptsOf(declarations),
    declarationsMissingFromBundle: bundlePath
      ? findings.filter((f) => !declaredInBundle.has(`--dx-${f.name}`)).length
      : null,
  };
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const themeArg = process.argv.find((a) => a.startsWith('--theme='));
  const bundleArg = process.argv.find((a) => a.startsWith('--bundle='));
  if (!process.argv.includes('--json')) {
    console.error('roles-theme.mjs prints JSON only: pass --json (the readable report is roles.mjs --md)');
    process.exit(2);
  }
  const {
    declarations, ladders, ...rest
  } = collectTheme({
    ...(themeArg ? { themeDir: themeArg.slice('--theme='.length) } : {}),
    ...(bundleArg ? { bundlePath: bundleArg.slice('--bundle='.length) } : {}),
  });
  console.log(JSON.stringify({
    ...rest,
    ladders: ladders.map(({ statesInOrder, ...ladder }) => ladder),
  }, null, 2));
}
