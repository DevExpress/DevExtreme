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

const packageRoot = process.cwd();
const themeRoot = join(packageRoot, 'scss', 'widgets', 'fluent-next');
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

const stripComments = (content: string): string => content
  .replace(/\/\/[^\n\r]*/g, '')
  .split(/\/\*|\*\//)
  .filter((_, index) => index % 2 === 0)
  .join('');

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
 * A declaration is module-level when every enclosing block is a control directive: Sass `@if`/`@each`
 * do not create scope, but a mixin, a function or a style rule do. That is what separates the theme's
 * variables from the 14 function locals in color.scss and button/_mixins.scss.
 */
const parseFile = (file: string): Parsed => {
  const content = stripComments(readFileSync(file, 'utf8'));
  const withRanges = [...findWithRanges(content), ...findSignatureRanges(content)];
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

const findings = {
  // O1: a folder may only declare its own component's variables.
  ownershipOfDeclarations: perFolder((files, folder) => {
    const own = components[folder];
    const counts = { themePrefixed: 0, unclassified: 0 };
    const foreignComponent: string[] = [];

    files.forEach(({ declarations }) => declarations.forEach((variable) => {
      if (isThemeIdentity(variable) || isSystemName(variable)) return;
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
      const content = stripComments(readFileSync(join(themeRoot, file), 'utf8'));
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
  publicSurfaceUnused: (() => {
    const declared = new Set<string>();
    THEMES.forEach((theme) => walk(join(packageRoot, 'scss', 'widgets', theme), '.scss')
      .forEach((file) => [...stripComments(readFileSync(file, 'utf8'))
        .matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
        .forEach((match) => declared.add(match[1]))));
    const consumers = publicNameConsumers();
    if (consumers === null) return [];
    return [...declared].filter((name) => !consumers.has(name)).sort();
  })(),

  publicSurfaceUndeclared: (() => {
    const declared = new Set<string>();
    THEMES.forEach((theme) => walk(join(packageRoot, 'scss', 'widgets', theme), '.scss')
      .forEach((file) => [...stripComments(readFileSync(file, 'utf8'))
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
      walk(join(packageRoot, 'scss', 'widgets', theme), '.scss').forEach((file) => {
        [...stripComments(readFileSync(file, 'utf8')).matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
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

test('registries are in sync with the generated design tokens', () => {
  // Guards against editing registries.json by hand or letting it drift from the token package.
  const generatedComponentTokens = readFileSync(
    join(packageRoot, 'scss', '_design-system', 'fluent', 'components', 'theme.scss'),
    'utf8',
  );
  const tokenCount = [...generatedComponentTokens.matchAll(/--dxds-[a-z0-9-]+:/g)].length;
  expect(tokenCount).toBe(registries.derivedFrom.componentTokenCount);
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
  if (isColors && !state) return 'no state segment (rest is mandatory in _colors.scss)';
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
