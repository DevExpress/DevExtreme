/*
 * Enforces the fluent-next SCSS naming standard — scss/widgets/fluent-next/NAMING.md.
 *
 * The standard is being rolled out wave by wave, so most checks are RATCHETS: the current set of
 * violations is compared against tests/fluent-next-naming.baseline.json, which must only ever shrink.
 * Regenerate it deliberately, as part of a wave, with:
 *
 *   UPDATE_NAMING_BASELINE=1 pnpm test
 *
 * Two checks are hard failures from day one: the grammar invariants of the registries, and grammar
 * conformance for components already listed as `migrated`.
 *
 * Exceptions are COMPUTED from structural properties (a mixin-only import, a base module configured
 * through `with()`, an exempt folder recorded in the registries) and never listed by name. If an
 * exception has to be spelled out as a name, the rule is wrong.
 */

import {
  readFileSync, writeFileSync, readdirSync, statSync, existsSync,
} from 'fs';
import { join, resolve, sep } from 'path';

import {
  collectCustomPropertyReferences,
  collectTokenReferences,
  stripScssComments,
} from '../build/tokens/consumed-tokens';

const packageRoot = process.cwd();
const widgetsRoot = join(packageRoot, 'scss', 'widgets');
const themeRoot = join(widgetsRoot, 'fluent-next');

// Labels a stylesheet for error messages: `fluent-next/common/_mixins.scss`.
const sourceLabel = (file: string): string => file.slice(widgetsRoot.length + 1);

// The hand-maintained wave-F component tier (see the "wave F" test block and NAMING.md).
const isPublicTierFile = (file: string): boolean => file.endsWith('_public.scss')
  || file.endsWith('_public-tier.scss');
const registries = JSON.parse(
  readFileSync(join(packageRoot, 'tools', 'naming', 'registries.json'), 'utf8'),
);
const baselinePath = join(__dirname, 'fluent-next-naming.baseline.json');
const updatingBaseline = process.env.UPDATE_NAMING_BASELINE === '1';

const THEMES = ['generic', 'material', 'fluent', 'fluent-next'];
const DECLARATION_FILES = ['_colors.scss', '_sizes.scss', '_variables.scss'];
const CONTROL_DIRECTIVES = /@(if|else|each|for|while)\b[^{]*$/;

type Use = { spec: string; star: boolean; alias: string | null };
type NamespacedReference = { namespace: string; name: string };
type Parsed = {
  file: string;
  folder: string;
  declarations: string[];
  references: string[];
  /*
   * `references` intentionally contains both `$name` and the `name` half of `alias.$name`, because
   * the dead-variable check must see either form. Ownership checks must not: counting a namespaced
   * read as a bare one reports the same read twice the moment the variable's name becomes canonical.
   */
  bareReferences: string[];
  namespacedReferences: NamespacedReference[];
  uses: Use[];
};

const walk = (dir: string, extension: string): string[] => {
  const result: string[] = [];
  readdirSync(dir).forEach((entry) => {
    const absolute = join(dir, entry);
    if (statSync(absolute).isDirectory()) {
      result.push(...walk(absolute, extension));
    } else if (entry.endsWith(extension)) {
      result.push(absolute);
    }
  });
  return result;
};

/**
 * Ranges of `@use … with ( … )` argument lists. Their left-hand sides are the *base module's*
 * parameter names, not declarations of this file, and must never be treated as either a declaration
 * or a foreign read (443 of them exist on purpose — NAMING.md, "Исключения").
 */
const findWithRanges = (content: string): [number, number][] => {
  const ranges: [number, number][] = [];
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

const inRanges = (position: number, ranges: [number, number][]): boolean => ranges
  .some(([from, to]) => position >= from && position < to);

/**
 * Parameter lists of `@mixin` / `@function`. A parameter with a default (`$button-selected-bg: $x`)
 * looks exactly like a declaration and is not inside a `{}` block, so brace tracking alone counts it
 * as one — same trap as `with()` keys.
 */
const findSignatureRanges = (content: string): [number, number][] => {
  const ranges: [number, number][] = [];
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

/**
 * Argument lists of `@include`. A named argument (`$checkbox-border-color-focused: $x`) binds the
 * base mixin's parameter by its own name: the key is base's spelling, exactly like a `with()` key,
 * and must not read as a declaration of this file (NAMING.md, "Исключения").
 */
const findIncludeRanges = (content: string): [number, number][] => {
  const ranges: [number, number][] = [];
  const opener = /@include\s+[\w.-]+\s*\(/g;
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

/**
 * A declaration is module-level when every enclosing block is a control directive: Sass `@if`/`@each`
 * do not create scope, but a mixin, a function or a style rule do. That is what separates the theme's
 * variables from the 14 function locals in color.scss and button/_mixins.scss.
 */
const parseFile = (file: string): Parsed => {
  const content = stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file));
  const withRanges = [
    ...findWithRanges(content),
    ...findSignatureRanges(content),
    ...findIncludeRanges(content),
  ];
  const declarations: string[] = [];
  const references: string[] = [];
  const bareReferences: string[] = [];
  const namespacedReferences: NamespacedReference[] = [];
  const uses: Use[] = [];

  const blockStack: boolean[] = [];
  let index = 0;
  while (index < content.length) {
    const char = content[index];

    if (char === '{') {
      blockStack.push(CONTROL_DIRECTIVES.test(content.slice(Math.max(0, index - 200), index)));
      index += 1;
    } else if (char === '}') {
      blockStack.pop();
      index += 1;
    } else if (char === '$') {
      const name = /^\$[a-z0-9_-]+/i.exec(content.slice(index))?.[0];
      if (!name) { index += 1; continue; }
      const namespaced = index > 0 && content[index - 1] === '.';
      const after = content.slice(index + name.length);
      const isAssignment = /^\s*:/.test(after);
      const moduleLevel = blockStack.every((isControl) => isControl);

      if (isAssignment && !namespaced && moduleLevel && !inRanges(index, withRanges)) {
        declarations.push(name);
      } else if (!isAssignment && !namespaced) {
        references.push(name);
        bareReferences.push(name);
      } else if (!isAssignment && namespaced) {
        // `alias.$name` — an explicit foreign read. After wave A these are the readable form of what
        // used to hide behind `as *`, and they still count as references for the dead-variable check.
        const namespace = /([a-zA-Z][a-zA-Z0-9_-]*)\.$/.exec(content.slice(0, index))?.[1];
        if (namespace) namespacedReferences.push({ namespace, name });
        references.push(name);
      }
      index += name.length;
    } else if (char === '@' && content.startsWith('@use', index)) {
      const statement = /^@use\s+["']([^"']+)["']/.exec(content.slice(index));
      if (statement) {
        // Only the module spec is consumed here. Scanning must continue into the `with (…)` block:
        // its right-hand sides are ordinary references, and skipping them would make every variable
        // that is used solely as a `with()` value look dead.
        const tail = content.slice(index + statement[0].length, index + statement[0].length + 200);
        const beforeArguments = tail.split(/;|\bwith\s*\(/)[0];
        uses.push({
          spec: statement[1],
          star: /\bas\s+\*/.test(beforeArguments),
          alias: /\bas\s+([a-zA-Z][a-zA-Z0-9_-]*)/.exec(beforeArguments)?.[1] ?? null,
        });
        index += statement[0].length;
      } else {
        index += 4;
      }
    } else {
      index += 1;
    }
  }

  const relativePath = resolve(file).slice(resolve(themeRoot).length + 1);
  const segments = relativePath.split(sep);
  return {
    file: relativePath,
    folder: segments.length > 1 ? segments[0] : '',
    declarations,
    references,
    bareReferences,
    namespacedReferences,
    uses,
  };
};

const parsedFiles: Parsed[] = walk(themeRoot, '.scss').map(parseFile);

/*
 * `base/**` parameter names, and the precise question of whether a given theme declaration is one of
 * them: the file has to pull that very base module in with `as *`. That star import IS the wiring —
 * the top-level `$x: … !default` in the theme sets base's variable — so such a name is base's
 * spelling and neither the grammar nor the ownership rule applies to it (NAMING.md, O8). The wide
 * form of the question ("does base declare this name anywhere") would wave through any legacy name.
 */
const baseNames = new Set(
  walk(join(packageRoot, 'scss', 'widgets', 'base'), '.scss')
    .flatMap((file) => parseFile(file).declarations),
);

const starredBaseParameters = (file: string): Set<string> => {
  const names = new Set<string>();
  const parsed = parsedFiles.find((candidate) => candidate.file === file);
  parsed?.uses.forEach(({ spec, star }) => {
    if (!star || !spec.includes('base/')) return;
    const directory = resolve(join(themeRoot, file), '..', spec, '..');
    const stem = spec.split('/').pop() as string;
    [join(directory, `_${stem}.scss`), join(directory, stem, '_index.scss')]
      .filter((candidate) => existsSync(candidate))
      .forEach((candidate) => parseFile(candidate).declarations.forEach((name) => names.add(name)));
  });
  return names;
};

// ---------------------------------------------------------------------------------------------
// component resolution
// ---------------------------------------------------------------------------------------------

const components: Record<string, string> = registries.components;
const exemptFolders = Object.keys(registries.exemptFolders);
const componentNames = [...new Set(Object.values(components))]
  .sort((a, b) => b.length - a.length); // longest first, so `data-grid` wins over `grid`

/** The component whose namespace a variable name belongs to, matched at hyphen boundaries. */
const componentOf = (variable: string): string | null => {
  const name = variable.slice(1);
  return componentNames.find((component) => name === component || name.startsWith(`${component}-`))
    ?? null;
};

const isSystemName = (variable: string): boolean => registries.systemConcerns
  .some((concern: string) => variable.slice(1).startsWith(`${concern}-`));

const isThemeIdentity = (variable: string): boolean => registries.themeIdentity.includes(variable);

const relevantFolders = Object.keys(components).filter((folder) => !exemptFolders.includes(folder));

const readsAllowedFor = (folder: string): Set<string> => {
  const allowed = new Set<string>();
  if (components[folder]) allowed.add(components[folder]);
  Object.values(registries.chassis).forEach((chassis: any) => {
    if (chassis.dependents.includes(folder)) allowed.add(chassis.component);
  });
  /*
   * A composite widget may read the metrics of a widget it RENDERS: the toolbar's overflow menu is a
   * real List, a grid cell in edit mode is a real editor. Duplicating those values instead would
   * guarantee drift, which is the opposite of what O4 is for — O4 forbids borrowing a value because it
   * looks right, not matching a widget you actually contain. Each entry in `embeds` names the element
   * that justifies it and is reviewed as code, exactly like the chassis list.
   */
  (registries.embeds?.[folder] ?? []).forEach((component: string) => allowed.add(component));
  return allowed;
};

/*
 * Six `--dx-*` names are NOT part of the public tier: the runtime sets them with `style.setProperty`
 * (card_view/content_view/content/content.tsx, scheduler/appointment_popup/form.ts) and `base/**`
 * reads them. Four of the six deliberately have no fallback — if JS gave no value (a card cover has no
 * `ratio`, say), the declaration must disappear rather than invent one. They are a JS -> CSS contract
 * and are excluded from the public-surface checks, not from the codebase.
 */
const RUNTIME_CONTRACT = new Set([
  '--dx-cardview-cardsperrow',
  '--dx-cardview-card-min-width',
  '--dx-cardview-card-max-width',
  '--dx-cardview-card-cover-ratio',
  '--dx-cardview-card-cover-max-height',
  '--dx-scheduler-animation-top',
]);

/** Every `--dx-*` read anywhere outside the theme sources, or null when the monorepo is unavailable. */
const publicNameConsumers = (): Set<string> | null => {
  const roots = [
    join(packageRoot, '..', '..', 'apps', 'demos', 'Demos'),
    join(packageRoot, '..', 'devextreme', 'js'),
    join(packageRoot, 'scss', 'widgets', 'base'),
  ].filter((root) => existsSync(root));
  if (!roots.length) return null;

  const names = new Set<string>();
  const extensions = ['.scss', '.css', '.html', '.vue', '.tsx', '.ts', '.js', '.jsx'];
  roots.forEach((root) => extensions
    .flatMap((extension) => walk(root, extension))
    .forEach((file) => [...readFileSync(file, 'utf8').matchAll(/(--dx-[a-z0-9-]+)/g)]
      .forEach((match) => names.add(match[1]))));
  return names;
};

// ---------------------------------------------------------------------------------------------
// findings
// ---------------------------------------------------------------------------------------------

const perFolder = <T>(compute: (files: Parsed[], folder: string) => T): Record<string, T> => {
  const result: Record<string, T> = {};
  relevantFolders.forEach((folder) => {
    const files = parsedFiles.filter((parsed) => parsed.folder === folder);
    const value = compute(files, folder);
    if (Array.isArray(value) ? value.length : value) result[folder] = value;
  });
  return result;
};

/*
 * Base wiring is configuration, not ownership. Two shapes, both structural:
 *   - star: the file star-imports the very base module that declares the name, and the top-level
 *     `$x: … !default` SETS base's variable (the load-bearing mechanism O8 documents). The spelling
 *     is base's, so neither grammar nor ownership applies.
 *   - feeder: `$fluent-<baseName>` passed as a `with()` value for base's `-2` key. Base holds PAIRS
 *     of parameters for these spots (an old key and a `-2` redesign key) and the theme feeds both;
 *     the grammar name is already taken by the OLD key's feeder, so renaming the `-2` feeder would
 *     invent a distinction that does not exist. The knot is base's duplicated parameters — see the
 *     `-2`-pairs entry in DIVERGENCES.md; until base deduplicates, the feeder keeps the mirror name.
 * Every wiring declaration is listed exactly in the `baseWiring` finding: a new one is a conscious
 * baseline edit, not a silent pass.
 */
const baseWiringKind = (variable: string, file: string): 'star' | 'feeder' | null => {
  if (starredBaseParameters(file).has(variable)) return 'star';
  if (variable.startsWith('$fluent-') && baseNames.has(`$${variable.slice('$fluent-'.length)}`)) {
    return 'feeder';
  }
  return null;
};

const findings = {
  // O1: a folder may only declare its own component's variables.
  ownershipOfDeclarations: perFolder((files, folder) => {
    const own = components[folder];
    const counts = { themePrefixed: 0, unclassified: 0 };
    const foreignComponent: string[] = [];

    files.forEach(({ file, declarations }) => declarations.forEach((variable) => {
      if (isThemeIdentity(variable) || isSystemName(variable)) return;
      if (baseWiringKind(variable, file)) return; // counted exactly, in baseWiring below
      const component = componentOf(variable);
      if (component === own) return;
      if (component) foreignComponent.push(`${variable} (${component})`);
      else if (variable.startsWith('$fluent-')) counts.themePrefixed += 1;
      else counts.unclassified += 1;
    }));

    return {
      ...counts,
      ...(foreignComponent.length ? { foreignComponent: [...new Set(foreignComponent)].sort() } : {}),
    };
  }),

  // The exact wiring inventory excluded from O1 above. Exact-match by design: adding a wiring
  // declaration must show up as a baseline diff.
  baseWiring: parsedFiles
    .flatMap(({ file, folder, declarations }) => declarations
      .map((variable) => ({ variable, kind: baseWiringKind(variable, file), folder }))
      .filter((entry) => entry.kind && !exemptFolders.includes(entry.folder))
      .map(({ folder, variable, kind }) => `${folder}: ${variable} (${kind})`))
    .sort(),

  /*
   * The system tier: the theme root and `common/` hold no component, so the per-component ownership
   * check above never looked at them — they were the one place where any name at all was accepted.
   * A declaration there must be a registered system concern (NAMING.md §"Системные concern'ы"),
   * theme identity, or a base-parameter mirror whose name base itself owns.
   */
  systemTierNames: (() => {
    const offenders = new Set<string>();

    parsedFiles
      .filter(({ folder }) => folder === '' || registries.systemFolders.includes(folder))
      .forEach(({ declarations }) => declarations.forEach((variable) => {
        if (isThemeIdentity(variable) || isSystemName(variable)) return;
        if (baseNames.has(variable)) return; // mirror of a base parameter, spelled as base spells it
        offenders.add(variable);
      }));

    return [...offenders].sort();
  })(),

  // O2: exactly one folder is the declaration home of a component.
  multipleDeclarationHomes: (() => {
    const homes: Record<string, Set<string>> = {};
    parsedFiles.forEach(({ folder, declarations }) => {
      if (!folder || exemptFolders.includes(folder)) return;
      declarations.forEach((variable) => {
        const component = componentOf(variable);
        if (!component) return;
        homes[component] = homes[component] ?? new Set();
        homes[component].add(folder);
      });
    });
    return Object.entries(homes)
      .filter(([, folders]) => folders.size > 1)
      .map(([component, folders]) => `${component}: ${[...folders].sort().join(', ')}`)
      .sort();
  })(),

  // O3/O5: a folder may only read its own component's variables (plus chassis it depends on).
  // Note this ratchet is deliberately weak until the rename lands: a read can only be classified as
  // foreign once the name sits in a canonical component namespace, so legacy spellings
  // ($datagrid-*, $fluent-*) are invisible here and show up under ownershipOfDeclarations instead.
  // The check therefore gets STRICTER as waves land, which is the intended direction.
  foreignReads: perFolder((files, folder) => {
    const allowed = readsAllowedFor(folder);
    const declaredHere = new Set(files.flatMap(({ declarations }) => declarations));
    /*
     * Mixin and function parameters are local names, not reads of anything: `@mixin grid-base(
     * $widget-name)` used to be reported as gridBase reading the `widget` component, because the
     * parameter's first segment happens to be a component name.
     */
    const parameters = new Set(files.flatMap(({ file }) => {
      const content = stripScssComments(readFileSync(join(themeRoot, file), 'utf8'), sourceLabel(join(themeRoot, file)));
      return findSignatureRanges(content)
        .flatMap(([from, to]) => [...content.slice(from, to).matchAll(/\$[a-z0-9_-]+/gi)]
          .map((match) => match[0]));
    }));
    const foreign = new Set<string>();

    files.forEach(({ bareReferences }) => bareReferences.forEach((variable) => {
      if (parameters.has(variable)) return;
      if (declaredHere.has(variable) || isThemeIdentity(variable) || isSystemName(variable)) return;
      const component = componentOf(variable);
      if (component && !allowed.has(component)) foreign.add(variable);
    }));

    // Explicit form: `alias.$name`, where the alias resolves to another widget folder. This is what
    // wave A made visible, and it does not depend on the variable name being canonical yet.
    files.forEach(({ file, uses, namespacedReferences }) => {
      const aliasToFolder = new Map<string, string>();
      uses.forEach(({ spec, alias }) => {
        if (!alias) return;
        const modulePath = resolve(join(themeRoot, file), '..', spec);
        if (!modulePath.startsWith(`${resolve(themeRoot)}${sep}`)) return;
        const target = modulePath.slice(resolve(themeRoot).length + 1).split(sep)[0];
        if (target.startsWith('_')) return; // theme-level module, not a widget folder
        aliasToFolder.set(alias, target);
      });

      namespacedReferences.forEach(({ namespace, name }) => {
        const target = aliasToFolder.get(namespace);
        if (!target || target === folder) return;
        if (registries.systemFolders.includes(target)) return;
        const component = components[target];
        if (component && !allowed.has(component)) foreign.add(`${namespace}.${name}`);
      });
    });

    return [...foreign].sort();
  }),

  // O7: variables are declared only in _colors/_sizes/_variables.
  declarationsOutsideVariableFiles: parsedFiles
    .filter(({ file, folder, declarations }) => folder
      && !exemptFolders.includes(folder)
      && !exemptFolders.includes(folder)
      && declarations.length > 0
      && !DECLARATION_FILES.some((name) => file.endsWith(name)))
    .map(({ file, declarations }) => `${file}: ${declarations.length}`)
    .sort(),

  // O8: a configurable base module must not be imported `as *`. Mixin-only modules are exempt,
  // which is decided by the module path, not by a list of names.
  starImportsOfBase: parsedFiles
    .filter(({ folder }) => !exemptFolders.includes(folder))
    .flatMap(({ file, uses }) => uses
      .filter(({ spec, star }) => star
        && spec.includes('base/')
        && !spec.endsWith('/mixins')
        && !spec.endsWith('icon_fonts'))
      .map(({ spec }) => `${file}: ${spec}`))
    .sort(),

  // Cross-widget `as *` imports: what makes ownership lexically invisible and O3/O4 unsafe.
  // Resolved against the importing file, because widgets like tabs/ have nested folders — counting
  // path segments would call tabs/layout/… → ../variables/sizes a cross-widget import.
  // Excluded on purpose: the theme-level layer (a module sitting in the theme root), the sanctioned
  // system folder, and mixin-only modules, which expose no variables.
  crossWidgetStarImports: parsedFiles
    .filter(({ folder }) => folder && !exemptFolders.includes(folder))
    .flatMap(({ file, folder, uses }) => uses
      .filter(({ spec, star }) => {
        // `/index` is style reuse, not a variable import: an index module emits CSS rules, and one
        // widget including another's rules (htmlEditor reusing textEditor's) is not what O3 governs.
        if (!star || spec.endsWith('/mixins') || spec.endsWith('/index')) return false;
        if (!spec.startsWith('..')) return false;
        const modulePath = resolve(join(themeRoot, file), '..', spec);
        if (!modulePath.startsWith(`${resolve(themeRoot)}${sep}`)) return false;
        const [target, ...rest] = modulePath.slice(resolve(themeRoot).length + 1).split(sep);
        if (!rest.length) return false; // theme-level module
        return target !== folder && !registries.systemFolders.includes(target);
      })
      .map(({ spec }) => `${folder}: ${spec}`))
    .filter((entry, index, all) => all.indexOf(entry) === index)
    .sort(),

  // Declared but never referenced anywhere in the theme or base. Counts declarations and references
  // separately, so a variable declared three times through `@if $size` no longer hides.
  deadVariables: (() => {
    const baseFiles = walk(join(packageRoot, 'scss', 'widgets', 'base'), '.scss').map(parseFile);
    const referenced = new Set([...parsedFiles, ...baseFiles]
      .flatMap(({ references }) => references));
    const dead = new Set<string>();
    parsedFiles.forEach(({ folder, declarations }) => {
      if (exemptFolders.includes(folder)) return;
      declarations.forEach((variable) => {
        if (!referenced.has(variable)) dead.add(variable);
      });
    });
    return [...dead].sort();
  })(),

  // The public tier must expose the same names in every theme, or app CSS breaks on theme switch.
  /*
   * The other half of the public-surface contract. Comparing the four themes' name sets is necessary
   * but not sufficient: it sees neither a name the theme publishes that nobody reads, nor a consumer
   * reading a name no theme declares. Both defects existed and both were invisible — `--dx-line-height`
   * (published, read by nobody) and `--dx-texteditor-label-color` (read by five demo files, declared by
   * no theme, no fallback, so the declaration silently dies).
   *
   * The consumer side lives outside this package, so the check degrades instead of failing when the
   * monorepo is not there: an absent `apps/demos` simply means that half is not measured.
   */
  /*
   * A signal for curating the public set, not proof of deadness: customer code is invisible to us, so
   * this measures only "not referenced anywhere in this repository". 18 of 38 names are in that state,
   * and one of them — `--dx-line-height` — is not referenced even by the themes themselves.
   */
  /*
   * All three publicSurface* checks below cover the LEGACY tier only: the emitted wave-F component
   * tier (_public.scss / _public-tier.scss) is write-only by design until the consumption wave, it
   * exists in fluent-next alone by the tier contract (NAMING.md, 06.08), and it has its own hard
   * invariants in the "wave F" block further down — mixing it in here would drown the legacy
   * ratchets in 769 by-design entries.
   */
  publicSurfaceUnused: (() => {
    const declared = new Set<string>();
    THEMES.forEach((theme) => walk(join(packageRoot, 'scss', 'widgets', theme), '.scss')
      .filter((file) => !isPublicTierFile(file))
      .forEach((file) => [...stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file))
        .matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
        .forEach((match) => declared.add(match[1]))));
    const consumers = publicNameConsumers();
    if (consumers === null) return [];
    return [...declared].filter((name) => !consumers.has(name)).sort();
  })(),

  publicSurfaceUndeclared: (() => {
    const declared = new Set<string>();
    THEMES.forEach((theme) => walk(join(packageRoot, 'scss', 'widgets', theme), '.scss')
      .filter((file) => !isPublicTierFile(file))
      .forEach((file) => [...stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file))
        .matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
        .forEach((match) => declared.add(match[1]))));
    const consumers = publicNameConsumers();
    if (consumers === null) return [];
    return [...consumers]
      .filter((name) => !declared.has(name) && !RUNTIME_CONTRACT.has(name))
      .sort();
  })(),

  publicSurfaceDifferences: (() => {
    const perTheme = THEMES.map((theme) => {
      const names = new Set<string>();
      walk(join(packageRoot, 'scss', 'widgets', theme), '.scss')
        .filter((file) => !isPublicTierFile(file))
        .forEach((file) => {
          [...stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file)).matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
            .forEach((match) => names.add(match[1]));
        });
      return { theme, names };
    });
    const union = new Set(perTheme.flatMap(({ names }) => [...names]));
    return [...union].sort()
      .filter((name) => perTheme.some(({ names }) => !names.has(name)))
      .map((name) => `${name}: only in ${perTheme
        .filter(({ names }) => names.has(name)).map(({ theme }) => theme).join(', ')}`);
  })(),

  /*
   * Wave F guard: hand-written `--dx-…:` declarations. The component tier is emitted ONLY from the
   * generated _public.scss files; everything else declaring a --dx name is the frozen legacy
   * surface (the pre-standard public tier, typography's scale publication, gridBase's runtime
   * bits). Exact list by design: a new manual emission is a conscious baseline edit.
   */
  publicTierManualDeclarations: walk(themeRoot, '.scss')
    .filter((file) => !isPublicTierFile(file))
    .flatMap((file) => [...stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file))
      .matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
      .map((match) => `${sourceLabel(file)}: ${match[1]}`))
    .sort(),

  /*
   * Wave F9, the lock on consumption: a read of a TIER variable in a rule file is a place the
   * --dx-* tier is bypassed — the pixel is right, but a per-instance override silently does
   * nothing there. Everything convertible was converted by waves F3–F9 (declarations,
   * calc-interpolations, allowlisted mixin arguments, with() wiring values); this exact list is
   * the irreducible remainder — Sass math (math.div, `2 *`), unguarded-math mixin arguments and
   * Sass-local derivations — plus the declaration files and with() keys, which are excluded by
   * construction. A new entry means a new bypass: consume it or justify it here. The tier name
   * set comes from the hand-maintained _public.scss files (their own sync gate lives in the
   * "wave F" block below).
   */
  unconsumedManifestReads: (() => {
    const manifestNames = new Set(walk(themeRoot, '.scss')
      .filter((file) => file.endsWith('_public.scss'))
      .flatMap((file) => [...stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file))
        .matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
        .map((match) => `$${match[1].slice('--dx-'.length)}`)));
    return walk(themeRoot, '.scss')
      .filter((file) => !DECLARATION_FILES.some((name) => file.endsWith(name))
        && !isPublicTierFile(file))
      .flatMap((file) => {
        const source = stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file));
        return source.split('\n').flatMap((line) => [
          /*
           * A with() KEY is base's spelling and is skipped by the leading-token check below even
           * when it coincides with a manifest name; the VALUE on the same line is a read like any
           * other — an unconverted `$base-key: $manifest-var,` is a tier bypass and must count.
           */
          ...line.matchAll(/(^|[^\w.$-])(\$[a-z0-9-]+)/g),
        ]
          .map((match) => match[2])
          .filter((token) => manifestNames.has(token)
            && !new RegExp(`^\\s*\\${token}\\s*:`).test(line))
          .map((token) => `${sourceLabel(file)}: ${token}`));
      })
      .sort();
  })(),
};

// ---------------------------------------------------------------------------------------------
// hard invariants
// ---------------------------------------------------------------------------------------------

test('registries: the grammar stays decidable', () => {
  // Only overlaps between vocabularies competing for the SAME position are fatal. The trailing state
  // is matched first, so a part or a sub-element that is also a state word would be eaten as the
  // state and leave the mandatory slot missing. Everything else is resolved positionally: `content`
  // is deliberately both a part (text colour) and a sub-element (.dx-toast-content), and `text` is
  // both a part and the `stylingMode: 'text'` modifier.
  expect(registries.states.filter((state: string) => registries.parts.includes(state))).toEqual([]);

  Object.entries(registries.subElements).forEach(([component, names]) => {
    expect({
      component,
      clashes: (names as string[]).filter((name) => registries.states.includes(name)),
    }).toEqual({ component, clashes: [] });
  });

  // every component maps to exactly one declaration home
  Object.values(registries.components).forEach((component) => {
    expect(typeof registries.declarationHome[component as string]).toBe('string');
  });
});

test('registries are in sync with the design token package', () => {
  /*
   * Guards against editing registries.json by hand or letting it drift from the package. Counted
   * from the package's flat index, the same source derive-registries.mjs reads — the component tier
   * is no longer emitted as SCSS, so there is no generated file left to count.
   */
  const flatTokens = JSON.parse(readFileSync(
    require.resolve('@devexpress/design-tokens-internal/tokens.flat.json'),
    'utf8',
  ));
  const tokenCount = Object.keys(flatTokens.tokens)
    .filter((key) => key.startsWith('components/core/theme/fluent:')).length;

  expect(tokenCount).toBe(registries.derivedFrom.componentTokenCount);
});

test('no name carries the theme prefix', () => {
  const offenders = walk(themeRoot, '.scss').flatMap((file) => {
    const found = [
      ...stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file)).matchAll(/\$fluent-[\w-]+/g),
    ];
    return [...new Set(found.map((match) => match[0]))]
      .map((name) => `${resolve(file).slice(resolve(themeRoot).length + 1)}: ${name}`);
  });

  expect(offenders).toEqual([]);
});

/**
 * Parses a name against the grammar, right-to-left with longest match:
 *
 *   $<component>(-<sub-element>)*(-<modifier>)*-<slot>(-<state>)
 *
 * Returns the reason it does not fit, or null when it does. Longest-match matters in both the state
 * and the slot position: `selected-hovered` must win over `selected`, and `padding-block` over
 * `block`.
 */
const grammarViolation = (variable: string, component: string, isColors: boolean): string | null => {
  const allowedSlots: string[] = isColors ? registries.parts : registries.sizeSlots;
  const middleWords: string[] = [
    ...(registries.subElements[component] ?? []),
    ...Object.values(registries.modifiers).flat() as string[],
  ];

  const name = variable.slice(1);
  if (name !== component && !name.startsWith(`${component}-`)) {
    return `does not start with the component "${component}"`;
  }

  let rest = name.slice(component.length).replace(/^-/, '');

  const state = [...registries.states]
    .sort((a: string, b: string) => b.length - a.length)
    .find((candidate: string) => rest === candidate || rest.endsWith(`-${candidate}`));
  if (state) rest = rest.slice(0, -state.length).replace(/-$/, '');

  const slot = [...allowedSlots]
    .sort((a, b) => b.length - a.length)
    .find((candidate) => rest === candidate || rest.endsWith(`-${candidate}`));
  if (!slot) {
    return `no ${isColors ? 'part' : 'size slot'} found in "${rest || '(empty)'}"`;
  }
  rest = rest.slice(0, -slot.length).replace(/-$/, '');

  /*
   * The middle is consumed greedily, longest match first, because sub-elements and modifiers are
   * hyphenated words themselves: `clear-button`, `icon-container`, `with-label`. Validating segment
   * by segment would reject every one of them ("clear" is not a sub-element — but `clear-button` is).
   */
  const ordered = [...middleWords].sort((a, b) => b.length - a.length);
  let middle = rest;
  while (middle) {
    const word = ordered.find((candidate) => middle === candidate
      || middle.startsWith(`${candidate}-`));
    if (!word) {
      return `"${middle}" is neither a sub-element of ${component} nor a modifier`;
    }
    middle = middle.slice(word.length).replace(/^-/, '');
  }
  return null;
};

test('migrated components follow the grammar strictly', () => {
  const migrated: string[] = registries.migrated;
  const offenders: string[] = [];

  parsedFiles.forEach(({ file, folder, declarations }) => {
    const component = components[folder];
    if (!component || !migrated.includes(component)) return;
    const isColors = file.endsWith('_colors.scss');
    const mirrors = starredBaseParameters(file);

    declarations.forEach((variable) => {
      if (isThemeIdentity(variable)) return;
      if (mirrors.has(variable)) return;
      const violation = grammarViolation(variable, component, isColors);
      if (violation) offenders.push(`${file} ${variable}: ${violation}`);
    });
  });

  expect(offenders).toEqual([]);
});

test('design tokens are read only where variables are declared', () => {
  // Covers `@use … with ()` arguments too, which stylelint cannot reach — it lints declarations.
  const offenders = walk(themeRoot, '.scss')
    .filter((file) => !DECLARATION_FILES.some((name) => file.endsWith(name)))
    .flatMap((file) => collectTokenReferences(readFileSync(file, 'utf8'), sourceLabel(file))
      .map((token) => `${sourceLabel(file)}: ds.$${token}`))
    .sort();

  expect(offenders).toEqual([]);
});

test('design tokens are never read as a raw custom property', () => {
  // Banned everywhere, declaration files included: `var(--dxds-…)` compiles even when the name is
  // wrong, while the bridge fails the build. stylelint covers declaration values, not at-rule
  // parameters, and that is where these would appear.
  const offenders = walk(themeRoot, '.scss')
    .flatMap((file) => collectCustomPropertyReferences(readFileSync(file, 'utf8'), sourceLabel(file))
      .map((token) => `${sourceLabel(file)}: var(--dxds-${token})`))
    .sort();

  expect(offenders).toEqual([]);
});

test('the rename mapping stays collision-free and fully applied', () => {
  // Mirrors `node tools/naming/rename.mjs --check --residue` so CI enforces it too: a batch that is
  // half-applied, or two batches mapping onto one name, must not survive a green test run.
  const mapping = JSON.parse(
    readFileSync(join(packageRoot, 'tools', 'naming', 'mapping.json'), 'utf8'),
  );
  const pairs: [string, string][] = Object.values(mapping.batches)
    .flatMap((names) => Object.entries(names as Record<string, string>)) as [string, string][];

  const targets = pairs.map(([, to]) => to);
  expect(targets.filter((to, index) => targets.indexOf(to) !== index)).toEqual([]);

  const declaredEverywhere = new Set(parsedFiles.flatMap(({ declarations }) => declarations));
  const referencedEverywhere = new Set(parsedFiles.flatMap(({ references }) => references));
  const survivors = pairs
    // An identity entry (already correct, recorded for the record) can never disappear.
    .filter(([from, to]) => from !== to)
    .map(([from]) => from)
    .filter((from) => declaredEverywhere.has(from) || referencedEverywhere.has(from));
  expect(survivors).toEqual([]);
});

// ---------------------------------------------------------------------------------------------
// wave F: the hand-maintained --dx-* component tier
// ---------------------------------------------------------------------------------------------

/*
 * The tier contract (NAMING.md, 06.08): --dxds-* roles/scales are the stable public API; --dx-* is
 * the product's own component tier, declared in <folder>/_public.scss onto
 * registries.rootSelectors and free to evolve between releases. Since 14.08.2026 the tier files
 * are ORDINARY HAND-MAINTAINED SCSS (the generator was dismantled by decision — a projection this
 * mechanical did not deserve a writer, only a guard). Everything the generator used to guarantee
 * is enforced here instead:
 *   - composition: every eligible variable of a migrated component has its --dx twin, and nothing
 *     else is declared (eligibility knowledge lives in tierExpectation below: data-uri exclusion
 *     is transitive through references, CSS-wide keywords cannot ride a custom property, base
 *     wiring is base's spelling, null has nothing to publish);
 *   - the conditional-chain FORM for same-component references (an unconditional chain silently
 *     ignores with() reconfiguration and starves the dead-variable gates — GOTCHAS §18.3);
 *   - collector ↔ registries.rootSelectors consistency.
 */
const CSS_WIDE_KEYWORDS = new Set(['inherit', 'initial', 'unset', 'revert', 'revert-layer']);

const tierFoldersOf = (component: string): string[] => {
  const folders = Object.entries(components)
    .filter(([, owner]) => owner === component)
    .map(([folder]) => folder);
  const home = registries.declarationHome[component];
  if (home && !folders.includes(home)) folders.push(home);
  return folders.filter((folder) => !exemptFolders.includes(folder));
};

/** Which variables the tier MUST declare, and why the rest are excluded. */
const tierExpectation = (): Map<string, { component: string; reason: string | null }> => {
  const wiring = new Set(findings.baseWiring.map((entry) => /(\$[a-z0-9-]+)/.exec(entry)![1]));
  const records = new Map<string, { component: string; value: string; reason: string | null }>();

  (registries.migrated as string[]).forEach((component) => {
    const declared = new Map<string, { value: string; marker: boolean }>();
    const feeders = new Set<string>();
    tierFoldersOf(component).forEach((folder) => {
      const dir = join(themeRoot, folder);
      if (!existsSync(dir)) return;
      walk(dir, '.scss').forEach((file) => {
        if (/(^|\/)_(colors|sizes|variables)\.scss$/.test(file)) {
          stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file)).split('\n')
            .forEach((line) => {
              const match = /^\s*(\$[a-z0-9-]+)\s*:\s*([^;]*);(.*)$/.exec(line);
              if (!match) return;
              const previous = declared.get(match[1]);
              declared.set(match[1], {
                value: match[2].trim().replace(/\s*!default$/, ''),
                marker: (previous?.marker ?? false) || /dx-data-uri-static/.test(match[3] + match[2]),
              });
            });
        }
        [...readFileSync(file, 'utf8').matchAll(/(?:icons?-mixin|icon-colored|data-uri)\s*\(([^)]*)\)/g)]
          .forEach((call) => [...call[1].matchAll(/\$[a-z0-9-]+/g)]
            .forEach(([variable]) => feeders.add(variable)));
      });
    });
    declared.forEach(({ value, marker }, variable) => {
      const reason = marker || feeders.has(variable) || /(^|[^\w-])data-uri\(/.test(value)
        ? 'data-uri'
        : wiring.has(variable) ? 'base-wiring'
          : CSS_WIDE_KEYWORDS.has(value) ? 'css-wide-keyword'
            : value.includes('!important') ? 'important'
              : value === 'null' ? 'null' : null;
      records.set(variable, { component, value, reason });
    });
  });

  // a reference (namespaced or not — grammar names are globally unique) to a data-uri-excluded
  // name carries the same baked image, so the referrer is excluded too
  for (let changed = true; changed;) {
    changed = false;
    records.forEach((record) => {
      if (record.reason) return;
      if ([...record.value.matchAll(/\$[a-z0-9-]+/g)]
        .some(([token]) => records.get(token)?.reason === 'data-uri')) {
        record.reason = 'data-uri';
        changed = true;
      }
    });
  }
  return new Map([...records].map(([variable, { component, reason }]) => [variable, { component, reason }]));
};

const tierRecords = tierExpectation();
const publicTierFiles = walk(themeRoot, '.scss').filter((file) => file.endsWith('_public.scss'));
const tierDeclared = new Map<string, string>(); // $variable -> declaring _public file
publicTierFiles.forEach((file) => {
  [...stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file))
    .matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
    .forEach((match) => tierDeclared.set(`$${match[1].slice('--dx-'.length)}`, file));
});

test('component tier: _public.scss declarations equal the eligible variables exactly', () => {
  const eligible = new Map([...tierRecords].filter(([, { reason }]) => !reason));
  const missing = [...eligible.keys()].filter((variable) => !tierDeclared.has(variable)).sort()
    .map((variable) => `${variable} (${eligible.get(variable)!.component}): add `
      + `\`--dx-${variable.slice(1)}: #{${variable}};\` to the component's _public.scss`);
  const extra = [...tierDeclared.keys()].filter((variable) => !eligible.has(variable)).sort()
    .map((variable) => {
      const reason = tierRecords.get(variable)?.reason;
      return `--dx-${variable.slice(1)} (${sourceLabel(tierDeclared.get(variable)!)}): ${reason
        ? `the variable is excluded from the tier (${reason}) — remove the declaration`
        : 'no such variable in the component\'s declaration files — remove or fix the declaration'}`;
    });
  expect({ missing, extra }).toEqual({ missing: [], extra: [] });
});

test('component tier: same-component references keep the conditional chain form', () => {
  const offenders: string[] = [];
  publicTierFiles.forEach((file) => {
    stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file)).split('\n').forEach((line) => {
      if (!line.includes('var(--dx-')) return;
      const declaration = /^\s*(--dx-[a-z0-9-]+)\s*:\s*(.*);\s*$/.exec(line);
      if (!declaration) {
        offenders.push(`${sourceLabel(file)}: "${line.trim()}" — var(--dx-…) outside a tier declaration`);
        return;
      }
      const [, property, value] = declaration;
      const own = `$${property.slice('--dx-'.length)}`;
      const chain = /^#\{if\((\$[a-z0-9-]+) == (\$[a-z0-9-]+), var\((--dx-[a-z0-9-]+)\), (\$[a-z0-9-]+)\)\}$/
        .exec(value.trim());
      if (!chain || chain[1] !== own || chain[4] !== own
        || `$${chain[3].slice('--dx-'.length)}` !== chain[2]) {
        offenders.push(`${sourceLabel(file)}: ${property} — a same-component reference must be `
          + `written as #{if(${own} == $target, var(--dx-target), ${own})}; an unconditional chain `
          + 'ignores with() reconfiguration and starves the dead-variable gates (GOTCHAS §18.3)');
        return;
      }
      if (!tierDeclared.has(chain[2])) {
        offenders.push(`${sourceLabel(file)}: ${property} chains to ${chain[2]}, which the tier does not declare`);
      }
    });
  });
  expect(offenders).toEqual([]);
});

test('component tier: the collector matches registries.rootSelectors exactly', () => {
  const collector = stripScssComments(
    readFileSync(join(themeRoot, '_public-tier.scss'), 'utf8'),
    'fluent-next/_public-tier.scss',
  );
  const namespaceToFolder = new Map<string, string>();
  [...collector.matchAll(/@use "([^"]+)\/public" as (\w+);/g)]
    .forEach((match) => namespaceToFolder.set(match[2], match[1]));

  const offenders: string[] = [];
  const includedFolders: string[] = [];
  // the @use header is not a selector — rules are matched on the body after it
  const rulesSource = collector.split('\n').filter((line) => !line.startsWith('@use ')).join('\n');
  [...rulesSource.matchAll(/([^{}]+)\{([^{}]*)\}/g)].forEach(([, selectorText, body]) => {
    const namespaces = [...body.matchAll(/@include (\w+)\.publish\(\);/g)].map((match) => match[1]);
    if (!namespaces.length) return;
    const folders = namespaces.map((namespace) => namespaceToFolder.get(namespace) ?? `?${namespace}`);
    includedFolders.push(...folders);
    const ruleComponents = new Set(folders.map((folder) => components[folder]));
    if (ruleComponents.size !== 1) {
      offenders.push(`collector rule mixes components: ${[...ruleComponents].join(', ')}`);
      return;
    }
    const [component] = [...ruleComponents];
    const actual = selectorText.split(',').map((selector) => selector.trim()).filter(Boolean).sort();
    const expected = [...(registries.rootSelectors[component] ?? [])].sort();
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      offenders.push(`collector rule for "${component}": selectors [${actual.join(', ')}] != `
        + `registries.rootSelectors [${expected.join(', ')}]`);
    }
  });

  const publicFolders = publicTierFiles.map((file) => sourceLabel(file).split('/')[1]);
  const sortedIncludes = [...includedFolders].sort();
  expect({
    offenders,
    includedTwice: sortedIncludes.filter((folder, index) => sortedIncludes[index - 1] === folder),
    notIncluded: publicFolders.filter((folder) => !includedFolders.includes(folder)).sort(),
    unknownNamespace: includedFolders.filter((folder) => folder.startsWith('?')),
  }).toEqual({ offenders: [], includedTwice: [], notIncluded: [], unknownNamespace: [] });
});

test('component tier: every var(--dx-…) read in the theme resolves to a declared name', () => {
  /*
   * stylelint does not ban the FORM (the tier is consumed through it) — this is the check that
   * took over: a read anywhere in fluent-next must hit the tier, the legacy surface, or the JS
   * runtime contract. A typo'd custom property compiles and dies silently at computed-value time;
   * this fails the build instead.
   */
  const declared = new Set([
    ...[...tierDeclared.keys()].map((variable) => `--dx-${variable.slice(1)}`),
    ...RUNTIME_CONTRACT,
    ...findings.publicTierManualDeclarations.map((entry) => entry.slice(entry.indexOf(': ') + 2)),
  ]);
  const offenders = walk(themeRoot, '.scss').flatMap((file) => [
    ...stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file)).matchAll(/var\(\s*(--dx-[a-z0-9-]+)/g),
  ].map((match) => match[1])
    .filter((name) => !declared.has(name))
    .map((name) => `${sourceLabel(file)}: var(${name}) resolves to no declared --dx name`));
  expect(offenders).toEqual([]);
});

test('component tier: every declaring component has bundle-gated root selectors', () => {
  // The selectors themselves are gated against the built bundle by derive-registries.mjs; this
  // holds the committed json coherent — a declaring component may not lack a scope.
  const declaring = [...new Set(publicTierFiles
    .map((file) => components[sourceLabel(file).split('/')[1]]))];
  expect(declaring.filter((component) => !registries.rootSelectors?.[component]?.length))
    .toEqual([]);
});

// ---------------------------------------------------------------------------------------------
// ratchets
// ---------------------------------------------------------------------------------------------

if (updatingBaseline) {
  test('baseline regenerated', () => {
    writeFileSync(baselinePath, `${JSON.stringify(findings, null, 2)}\n`);
    expect(true).toBe(true);
  });
} else {
  const baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));

  Object.keys(findings).forEach((check) => {
    test(`${check} does not regress`, () => {
      expect(findings[check as keyof typeof findings]).toEqual(baseline[check]);
    });
  });
}
