import {
  readFileSync, writeFileSync, readdirSync, statSync, existsSync,
} from 'fs';
import { join, resolve, sep } from 'path';

import {
  collectCustomPropertyReferences,
  collectTokenReferences,
  stripScssComments,
} from '../build/tokens/consumed-tokens';
import {
  type Parsed,
  type Registries,
  type SourceFile,
  baseIndex,
  findSignatureRanges,
  parseSourceFile,
  starredBaseParameters as starredParametersOf,
  baseWiringKind as wiringKindOf,
  tierRecords as computeTierRecords,
  planPublication,
  stalePaths,
} from '../tools/naming/tier';
import accentContract from '../tools/naming/accent-contract.json';
import runtimeContract from '../tools/naming/runtime-contract.json';
import { required } from './required';

const packageRoot = process.cwd();
const widgetsRoot = join(packageRoot, 'scss', 'widgets');
const themeRoot = join(widgetsRoot, 'fluent-next');

const sourceLabel = (file: string): string => file.slice(widgetsRoot.length + 1);

/*
 * A style query names a custom property in its condition (`@container style(--dx-theme-mode:
 * dark)`) and looks exactly like a declaration to a `--dx-…:` match. Preludes hold none, so
 * dropping them is safe; the reads themselves are covered by the resolve case below.
 */
const declarationBody = (content: string, label: string): string => stripScssComments(
  content,
  label,
)
  .replace(/@[a-z-]+[^;{]*\{/g, '{');

const isPublicManifestFile = (file: string): boolean => file.endsWith('_public.scss')
  || file.endsWith('_public-links.scss');
const isPublicTierFile = (file: string): boolean => isPublicManifestFile(file)
  || file.endsWith('_public-tier.scss');
interface NamingRegistries extends Registries {
  chassis: Record<string, { component: string; dependents: string[] }>;
  derivedFrom: Record<string, string | number>;
  embeds?: Record<string, string[]>;
  modifiers: Record<string, string[]>;
  parts: string[];
  sizeSlots: string[];
  states: string[];
  subElements: Record<string, string[]>;
  systemConcerns: string[];
  systemFolders: string[];
  themeIdentity: string[];
}
const registries: NamingRegistries = JSON.parse(
  readFileSync(join(packageRoot, 'tools', 'naming', 'registries.json'), 'utf8'),
);
const baselinePath = join(__dirname, 'fluent-next-naming.baseline.json');
const updatingBaseline = process.env.UPDATE_NAMING_BASELINE === '1';

const THEMES = ['generic', 'material', 'fluent', 'fluent-next'];
const DECLARATION_FILES = ['_colors.scss', '_sizes.scss', '_variables.scss'];
type ParsedFile = Parsed & { file: string };

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

const sourceFileOf = (file: string): SourceFile => {
  const path = sourceLabel(file).split(sep).join('/');
  const segments = path.split('/');
  const raw = readFileSync(file, 'utf8');
  return {
    path,
    folder: segments.length > 2 ? segments[1] : '',
    raw,
    stripped: stripScssComments(raw, path),
  };
};

const themeFiles = walk(themeRoot, '.scss');
const themeSources: SourceFile[] = themeFiles.map(sourceFileOf);

const parseFile = (file: string): ParsedFile => ({
  ...parseSourceFile(sourceFileOf(file)),
  file: resolve(file).slice(resolve(themeRoot).length + 1),
});

const parsedFiles: ParsedFile[] = themeFiles.map((file, index) => ({
  ...parseSourceFile(themeSources[index]),
  file: resolve(file).slice(resolve(themeRoot).length + 1),
}));

const base = baseIndex(walk(join(widgetsRoot, 'base'), '.scss').map(sourceFileOf));
const baseNames = base.names;

const parsedByFile = (file: string): ParsedFile => {
  const parsed = parsedFiles.find((candidate) => candidate.file === file);
  if (!parsed) throw new Error(`${file} is not a theme file`);
  return parsed;
};

const starredBaseParameters = (file: string): Set<string> => starredParametersOf(
  parsedByFile(file),
  base,
);

const { components }: { components: Record<string, string> } = registries;
const exemptFolders = Object.keys(registries.exemptFolders);
const componentNames = [...new Set(Object.values(components))]
  .sort((a, b) => b.length - a.length);

const componentOf = (variable: string): string | null => {
  const name = variable.slice(1);
  return componentNames.find((component) => name === component || name.startsWith(`${component}-`))
    ?? null;
};

const isSystemName = (variable: string): boolean => registries.systemConcerns
  .some((concern) => variable.slice(1).startsWith(`${concern}-`));

const isThemeIdentity = (variable: string): boolean => registries.themeIdentity.includes(variable);

const relevantFolders = Object.keys(components).filter((folder) => !exemptFolders.includes(folder));

const readsAllowedFor = (folder: string): Set<string> => {
  const allowed = new Set<string>();
  if (components[folder]) allowed.add(components[folder]);
  Object.values(registries.chassis).forEach((chassis) => {
    if (chassis.dependents.includes(folder)) allowed.add(chassis.component);
  });
  (registries.embeds?.[folder] ?? []).forEach((component) => allowed.add(component));
  return allowed;
};

const RUNTIME_CONTRACT = new Set<string>(runtimeContract.variables.map(({ name }) => name));

const isAccentContractFile = (file: string): boolean => file.endsWith(
  join(...accentContract.declaredIn.split('/')),
);
const ACCENT_CONTRACT = new Set([
  accentContract.input.name,
  accentContract.source.name,
  ...accentContract.settings.map(({ name }) => name),
  ...accentContract.steps.values.map((step) => `${accentContract.steps.prefix}${step}`),
]);

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

const perFolder = <T>(compute: (files: ParsedFile[], folder: string) => T): Record<string, T> => {
  const result: Record<string, T> = {};
  relevantFolders.forEach((folder) => {
    const files = parsedFiles.filter((parsed) => parsed.folder === folder);
    const value = compute(files, folder);
    if (Array.isArray(value) ? value.length : value) result[folder] = value;
  });
  return result;
};

const baseWiringKind = (variable: string, file: string): 'star' | 'feeder' | null => wiringKindOf(
  variable,
  parsedByFile(file),
  base,
);

const findings = {
  ownershipOfDeclarations: perFolder((files, folder) => {
    const own = components[folder];
    const counts = { themePrefixed: 0, unclassified: 0 };
    const foreignComponent: string[] = [];

    files.forEach(({ file, declarations }) => declarations.forEach((variable) => {
      if (isThemeIdentity(variable) || isSystemName(variable)) return;
      if (baseWiringKind(variable, file)) return;
      const component = componentOf(variable);
      if (component === own) return;
      if (component) foreignComponent.push(`${variable} (${component})`);
      else if (variable.startsWith('$fluent-')) counts.themePrefixed += 1;
      else counts.unclassified += 1;
    }));

    return {
      ...counts,
      ...(foreignComponent.length
        ? { foreignComponent: [...new Set(foreignComponent)].sort() }
        : {}),
    };
  }),

  baseWiring: parsedFiles
    .flatMap(({ file, folder, declarations }) => declarations
      .map((variable) => ({ variable, kind: baseWiringKind(variable, file), folder }))
      .filter((entry) => entry.kind && !exemptFolders.includes(entry.folder))
      .map((entry) => `${entry.folder}: ${entry.variable} (${entry.kind})`))
    .sort(),

  systemTierNames: ((): string[] => {
    const offenders = new Set<string>();

    parsedFiles
      .filter(({ folder }) => folder === '' || registries.systemFolders.includes(folder))
      .forEach(({ declarations }) => declarations.forEach((variable) => {
        if (isThemeIdentity(variable) || isSystemName(variable)) return;
        if (baseNames.has(variable)) return;
        offenders.add(variable);
      }));

    return [...offenders].sort();
  })(),

  multipleDeclarationHomes: ((): string[] => {
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

  foreignReads: perFolder((files, folder) => {
    const allowed = readsAllowedFor(folder);
    const declaredHere = new Set(files.flatMap(({ declarations }) => declarations));
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

    files.forEach(({ file, uses, namespacedReferences }) => {
      const aliasToFolder = new Map<string, string>();
      uses.forEach(({ spec, alias }) => {
        if (!alias) return;
        const modulePath = resolve(join(themeRoot, file), '..', spec);
        if (!modulePath.startsWith(`${resolve(themeRoot)}${sep}`)) return;
        const target = modulePath.slice(resolve(themeRoot).length + 1).split(sep)[0];
        if (target.startsWith('_')) return;
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

  declarationsOutsideVariableFiles: parsedFiles
    .filter(({ file, folder, declarations }) => folder
      && !exemptFolders.includes(folder)
      && !exemptFolders.includes(folder)
      && declarations.length > 0
      && !DECLARATION_FILES.some((name) => file.endsWith(name)))
    .map(({ file, declarations }) => `${file}: ${declarations.length}`)
    .sort(),

  starImportsOfBase: parsedFiles
    .filter(({ folder }) => !exemptFolders.includes(folder))
    .flatMap(({ file, uses }) => uses
      .filter(({ spec, star }) => star
        && spec.includes('base/')
        && !spec.endsWith('/mixins')
        && !spec.endsWith('icon_fonts'))
      .map(({ spec }) => `${file}: ${spec}`))
    .sort(),

  crossWidgetStarImports: parsedFiles
    .filter(({ folder }) => folder && !exemptFolders.includes(folder))
    .flatMap(({ file, folder, uses }) => uses
      .filter(({ spec, star }) => {
        if (!star || spec.endsWith('/mixins') || spec.endsWith('/index')) return false;
        if (!spec.startsWith('..')) return false;
        const modulePath = resolve(join(themeRoot, file), '..', spec);
        if (!modulePath.startsWith(`${resolve(themeRoot)}${sep}`)) return false;
        const [target, ...rest] = modulePath.slice(resolve(themeRoot).length + 1).split(sep);
        if (!rest.length) return false;
        return target !== folder && !registries.systemFolders.includes(target);
      })
      .map(({ spec }) => `${folder}: ${spec}`))
    .filter((entry, index, all) => all.indexOf(entry) === index)
    .sort(),

  deadVariables: ((): string[] => {
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

  publicSurfaceUnused: ((): string[] => {
    const declared = new Set<string>();
    THEMES.forEach((theme) => walk(join(packageRoot, 'scss', 'widgets', theme), '.scss')
      .filter((file) => !isPublicTierFile(file) && !isAccentContractFile(file))
      .forEach((file) => [...stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file))
        .matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
        .forEach((match) => declared.add(match[1]))));
    const consumers = publicNameConsumers();
    if (consumers === null) return [];
    return [...declared].filter((name) => !consumers.has(name)).sort();
  })(),

  publicSurfaceUndeclared: ((): string[] => {
    const declared = new Set<string>();
    THEMES.forEach((theme) => walk(join(packageRoot, 'scss', 'widgets', theme), '.scss')
      .filter((file) => !isPublicTierFile(file) && !isAccentContractFile(file))
      .forEach((file) => [...stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file))
        .matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
        .forEach((match) => declared.add(match[1]))));
    const consumers = publicNameConsumers();
    if (consumers === null) return [];
    return [...consumers]
      .filter((name) => !declared.has(name) && !RUNTIME_CONTRACT.has(name)
        && !ACCENT_CONTRACT.has(name))
      .sort();
  })(),

  publicSurfaceDifferences: ((): string[] => {
    const perTheme = THEMES.map((theme) => {
      const names = new Set<string>();
      walk(join(packageRoot, 'scss', 'widgets', theme), '.scss')
        .filter((file) => !isPublicTierFile(file) && !isAccentContractFile(file))
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

  publicTierManualDeclarations: walk(themeRoot, '.scss')
    .filter((file) => !isPublicTierFile(file) && !isAccentContractFile(file))
    .flatMap((file) => [...declarationBody(readFileSync(file, 'utf8'), sourceLabel(file))
      .matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
      .map((match) => `${sourceLabel(file)}: ${match[1]}`))
    .sort(),

  unconsumedManifestReads: ((): string[] => {
    const manifestNames = new Set(walk(themeRoot, '.scss')
      .filter(isPublicManifestFile)
      .flatMap((file) => [...stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file))
        .matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
        .map((match) => `$${match[1].slice('--dx-'.length)}`)));
    return walk(themeRoot, '.scss')
      .filter((file) => !DECLARATION_FILES.some((name) => file.endsWith(name))
        && !isPublicTierFile(file))
      .flatMap((file) => {
        const source = stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file));
        return source.split('\n').flatMap((line) => [
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

test('registries: the grammar stays decidable', () => {
  expect(registries.states.filter((state) => registries.parts.includes(state))).toEqual([]);

  Object.entries(registries.subElements).forEach(([component, names]) => {
    expect({
      component,
      clashes: names.filter((name) => registries.states.includes(name)),
    }).toEqual({ component, clashes: [] });
  });

  Object.values(registries.components).forEach((component) => {
    expect(typeof registries.declarationHome[component]).toBe('string');
  });
});

test('registries are in sync with the design token package', () => {
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

const grammarViolation = (
  variable: string,
  component: string,
  isColors: boolean,
): string | null => {
  const allowedSlots: string[] = isColors ? registries.parts : registries.sizeSlots;
  const middleWords: string[] = [
    ...(registries.subElements[component] ?? []),
    ...Object.values(registries.modifiers).flat(),
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

  const ordered = [...middleWords].sort((a, b) => b.length - a.length);
  let middle = rest;
  while (middle) {
    const head = middle;
    const word = ordered.find((candidate) => head === candidate
      || head.startsWith(`${candidate}-`));
    if (!word) {
      return `"${head}" is neither a sub-element of ${component} nor a modifier`;
    }
    middle = head.slice(word.length).replace(/^-/, '');
  }
  return null;
};

test('migrated components follow the grammar strictly', () => {
  const { migrated } = registries;
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
  const offenders = walk(themeRoot, '.scss')
    .filter((file) => !DECLARATION_FILES.some((name) => file.endsWith(name)))
    .flatMap((file) => collectTokenReferences(readFileSync(file, 'utf8'), sourceLabel(file))
      .map((token) => `${sourceLabel(file)}: ds.$${token}`))
    .sort();

  expect(offenders).toEqual([]);
});

test('design tokens are never read as a raw custom property', () => {
  const offenders = walk(themeRoot, '.scss')
    .flatMap((file) => collectCustomPropertyReferences(readFileSync(file, 'utf8'), sourceLabel(file))
      .map((token) => `${sourceLabel(file)}: var(--dxds-${token})`))
    .sort();

  expect(offenders).toEqual([]);
});

test('the rename mapping stays collision-free and fully applied', () => {
  const mapping = JSON.parse(
    readFileSync(join(packageRoot, 'tools', 'naming', 'mapping.json'), 'utf8'),
  );
  const pairs: [string, string][] = Object.values(mapping.batches)
    .flatMap((names) => Object.entries(names as Record<string, string>));

  const targets = pairs.map(([, to]) => to);
  expect(targets.filter((to, index) => targets.indexOf(to) !== index)).toEqual([]);

  const declaredEverywhere = new Set(parsedFiles.flatMap(({ declarations }) => declarations));
  const referencedEverywhere = new Set(parsedFiles.flatMap(({ references }) => references));
  const survivors = pairs
    .filter(([from, to]) => from !== to)
    .map(([from]) => from)
    .filter((from) => declaredEverywhere.has(from) || referencedEverywhere.has(from));
  expect(survivors).toEqual([]);
});

/*
 * The tier contract (decided 06.08): --dxds-* roles/scales are the stable public API; --dx-* is
 * the product's own component tier, declared in <folder>/_public.scss onto registries.rootSelectors
 * and free to evolve between releases. The projections are GENERATED by tools/naming/publish.mjs
 * and committed; the relations are handwritten in <folder>/_public-links.scss. Both the emitter
 * and these checks read the same rules from tools/naming/tier.ts, so the checks hold whatever wrote
 * the files:
 *   - composition: every eligible variable of a migrated component has its --dx twin, and nothing
 *     else is declared (eligibility knowledge lives in tierRecords: data-uri exclusion is
 *     transitive through references, CSS-wide keywords cannot ride a custom property, base wiring
 *     is base's spelling, null has nothing to publish);
 *   - the LINK form for a reference the referrer can resolve — same component, or a target
 *     published on `:root`: `--dx-a: var(--dx-b);` with no SCSS twin, so the relation is stated
 *     once, in one place, and stays live when the target moves;
 *   - collector ↔ registries.rootSelectors consistency.
 */

const systemTier: string[] = registries.systemTier ?? [];

const tierRecords = computeTierRecords(
  themeSources,
  registries,
  new Set(findings.baseWiring
    .map((entry) => required(/(\$[a-z0-9-]+)/.exec(entry), `a variable in "${entry}"`)[1])),
);
const publicTierFiles = themeFiles.filter(isPublicManifestFile);
const folderOf = (file: string): string => sourceLabel(file).split('/')[1];
const tierDeclared = new Map<string, string>();
publicTierFiles.forEach((file) => {
  [...stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file))
    .matchAll(/(--dx-[a-z0-9-]+)\s*:/g)]
    .forEach((match) => tierDeclared.set(`$${match[1].slice('--dx-'.length)}`, file));
});

const publishesOnRoot = (file: string): boolean => {
  const folder = folderOf(file);
  const component = systemTier.includes(folder) ? folder : components[folder];
  return (registries.rootSelectors[component] ?? []).includes(':root');
};
const linkableFrom = (target: string, referrer: string): boolean => {
  const home = tierDeclared.get(`$${target.slice('--dx-'.length)}`);
  return !!home && (folderOf(home) === folderOf(referrer) || publishesOnRoot(home));
};

const tierLinks = new Map<string, { target: string; file: string }>();
publicTierFiles.forEach((file) => {
  stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file)).split('\n').forEach((line) => {
    const link = /^\s*(--dx-[a-z0-9-]+)\s*:\s*var\((--dx-[a-z0-9-]+)\);\s*$/.exec(line);
    if (link) tierLinks.set(link[1], { target: link[2], file });
  });
});

const tierAliases: { property: string; target: string; source: string }[] = [];
const tierCopies: { property: string; target: string; source: string }[] = [];
walk(themeRoot, '.scss')
  .filter((file) => /(^|\/)_(colors|sizes|variables)\.scss$/.test(file))
  .forEach((file) => {
    stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file)).split('\n').forEach((line, index) => {
      const alias = /^\s*\$([a-z0-9-]+)\s*:\s*(?:[A-Za-z]\w*\.)?\$([a-z0-9-]+)\s*(?:!default)?\s*;\s*$/.exec(line);
      if (!alias) return;
      const home = tierDeclared.get(`$${alias[1]}`);
      if (!home || !tierDeclared.has(`$${alias[2]}`)) return;
      const record = {
        property: `--dx-${alias[1]}`,
        target: `--dx-${alias[2]}`,
        source: `${sourceLabel(file)}:${index + 1}`,
      };
      (linkableFrom(record.target, home) ? tierAliases : tierCopies).push(record);
    });
  });

test('component tier: _public.scss declarations equal the eligible variables exactly', () => {
  const eligible = new Map([...tierRecords].filter(([, { reason }]) => !reason));
  const missing = [...eligible.keys()].filter((variable) => !tierDeclared.has(variable)).sort()
    .map((variable) => `${variable} (${required(eligible.get(variable), variable).component}): not published — `
      + 'run pnpm naming:publish');
  const extra = [...tierDeclared.keys()]
    .filter((variable) => !eligible.has(variable) && !tierLinks.has(`--dx-${variable.slice(1)}`)).sort()
    .map((variable) => {
      const reason = tierRecords.get(variable)?.reason;
      const declaredIn = required(tierDeclared.get(variable), `${variable} declaration`);
      return `--dx-${variable.slice(1)} (${sourceLabel(declaredIn)}): ${reason
        ? `the variable is excluded from the tier (${reason})`
        : 'no such variable in the component\'s declaration files'} — run pnpm naming:publish`;
    });
  expect({ missing, extra }).toEqual({ missing: [], extra: [] });
});

test('component tier: references are written as links to a resolvable target', () => {
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
      const link = tierLinks.get(property);
      if (!link || `var(${link.target})` !== value.trim()) {
        offenders.push(`${sourceLabel(file)}: ${property} — a reference must be the WHOLE value and `
          + 'written as var(--dx-target); a comparison or a formula freezes the relation at build '
          + 'time');
        return;
      }
      if (link.target === property) {
        offenders.push(`${sourceLabel(file)}: ${property} links to itself`);
        return;
      }
      if (!linkableFrom(link.target, file)) {
        offenders.push(`${sourceLabel(file)}: ${property} links to ${link.target}, which is neither `
          + 'declared by this component nor published on :root — outside the target\'s root the '
          + 'link resolves to nothing and the declaration disappears; publish the value instead');
      }
    });
  });
  expect(offenders).toEqual([]);
});

test('component tier: an alias is published as a link, not as a copy of the value', () => {
  const offenders = tierAliases
    .filter((alias) => tierLinks.get(alias.property)?.target !== alias.target)
    .map((alias) => `${alias.source}: the declaration is a reference to `
      + `${alias.target.slice('--dx-'.length)}, so the tier must publish `
      + `\`${alias.property}: var(${alias.target});\` and the declaration itself must go — `
      + 'publishing a copy of the value freezes the relation');
  expect(offenders).toEqual([]);
});

test('component tier: an alias whose target sits on another root stays a copy', () => {
  const offenders = tierCopies
    .filter((copy) => tierLinks.has(copy.property))
    .map((copy) => `${copy.source}: ${copy.property} is published as a link to ${copy.target}, `
      + 'which lives on another component\'s root — the value must be published instead');
  expect(offenders).toEqual([]);
});

test('component tier: a link between two states must keep the state', () => {
  const states = [...registries.states].sort((a, b) => b.length - a.length);
  const stateOf = (property: string): string | undefined => states
    .find((state) => property.endsWith(`-${state}`));

  const offenders: string[] = [];
  tierLinks.forEach(({ target, file }, property) => {
    const state = stateOf(property);
    const targetState = stateOf(target);
    if (state && targetState && state !== targetState) {
      offenders.push(`${sourceLabel(file)}: ${property} links to ${target} — the ${state} state `
        + `points at ${targetState}`);
    }
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
  const rulesSource = collector.split('\n').filter((line) => !line.startsWith('@use ')).join('\n');
  [...rulesSource.matchAll(/([^{}]+)\{([^{}]*)\}/g)].forEach(([, selectorText, body]) => {
    const namespaces = [...body.matchAll(/@include (\w+)\.publish\(\);/g)].map((match) => match[1]);
    if (!namespaces.length) return;
    const folders = namespaces.map((namespace) => namespaceToFolder.get(namespace) ?? `?${namespace}`);
    includedFolders.push(...folders);
    const ruleComponents = new Set(folders
      .map((folder) => (systemTier.includes(folder) ? folder : components[folder])));
    const actual = selectorText.split(',').map((selector) => selector.trim()).filter(Boolean).sort();
    [...ruleComponents].forEach((component) => {
      const expected = [...(registries.rootSelectors[component] ?? [])].sort();
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        offenders.push(`collector rule for "${component}": selectors [${actual.join(', ')}] != `
          + `registries.rootSelectors [${expected.join(', ')}]`);
      }
    });
  });

  const publicFolders = [...new Set(publicTierFiles.map(folderOf))];
  const sortedIncludes = [...includedFolders].sort();
  expect({
    offenders,
    includedTwice: sortedIncludes.filter((folder, index) => sortedIncludes[index - 1] === folder),
    notIncluded: publicFolders.filter((folder) => !includedFolders.includes(folder)).sort(),
    unknownNamespace: includedFolders.filter((folder) => folder.startsWith('?')),
  }).toEqual({
    offenders: [],
    includedTwice: [],
    notIncluded: [],
    unknownNamespace: [],
  });
});

test('component tier: every --dx-… read in the theme resolves to a declared name', () => {
  /*
   * stylelint does not ban the FORM (the tier is consumed through it) — this is the check that
   * took over: a read anywhere in fluent-next must hit the tier, the legacy surface, or the JS
   * runtime contract. A typo'd custom property compiles and dies silently at computed-value time;
   * this fails the build instead.
   *
   * `var()` is not the only way to read one: a style query names the property in its condition
   * (`@container style(--dx-theme-mode: dark)`), and a typo there is even quieter — the block
   * simply never matches, so the rules inside it go missing rather than losing one value.
   */
  const declared = new Set([
    ...[...tierDeclared.keys()].map((variable) => `--dx-${variable.slice(1)}`),
    ...RUNTIME_CONTRACT,
    ...ACCENT_CONTRACT,
    ...findings.publicTierManualDeclarations.map((entry) => entry.slice(entry.indexOf(': ') + 2)),
  ]);
  const READS = [
    { pattern: /var\(\s*(--dx-[a-z0-9-]+)/g, form: (name: string): string => `var(${name})` },
    { pattern: /style\(\s*(--dx-[a-z0-9-]+)/g, form: (name: string): string => `style(${name}: …)` },
  ];
  const offenders = walk(themeRoot, '.scss').flatMap((file) => {
    const content = stripScssComments(readFileSync(file, 'utf8'), sourceLabel(file));

    return READS.flatMap(({ pattern, form }) => [...content.matchAll(pattern)]
      .map((match) => match[1])
      .filter((name) => !declared.has(name))
      .map((name) => `${sourceLabel(file)}: ${form(name)} resolves to no declared --dx name`));
  });
  expect(offenders).toEqual([]);
});

test('component tier: every publishing component appears in the runtime-audit gallery', () => {
  const gallery = join(packageRoot, '..', 'devextreme', 'playground', 'tier-reachability-audit.html');
  if (!existsSync(gallery)) throw new Error(`the runtime-audit gallery is missing at ${gallery}`);
  const source = readFileSync(gallery, 'utf8').toLowerCase();
  const missing = publicTierFiles
    .map((file) => sourceLabel(file).split('/')[1])
    .filter((folder) => !systemTier.includes(folder))
    .filter((folder) => {
      if (source.includes(`dx${folder.toLowerCase()}`)) return false;
      const component = components[folder];
      const roots: string[] = registries.rootSelectors[component] ?? [];
      return !roots.some((selector) => selector !== ':root' && source.includes(selector.slice(1)));
    })
    .map((folder) => `${folder} publishes the tier but the gallery never builds it — add `
      + `widget('dx${folder}') or markup carrying one of its classes to buildGallery/addPortals`);
  expect([...new Set(missing)].sort()).toEqual([]);
});

test('component tier: the committed files are what tools/naming/publish.mjs writes', () => {
  const existing = new Map(themeSources
    .filter(({ path }) => isPublicTierFile(path))
    .map(({ path, raw }) => [path, raw]));
  const baseSources = walk(join(widgetsRoot, 'base'), '.scss').map(sourceFileOf);
  const plan = planPublication(themeSources, baseSources, registries, existing);
  expect(plan.problems).toEqual([]);
  expect(stalePaths(plan, existing).map((path) => `${path} is stale — run pnpm naming:publish`)).toEqual([]);
});

test('component tier: every declaring component has bundle-gated root selectors', () => {
  const declaring = [...new Set(publicTierFiles
    .map((file) => sourceLabel(file).split('/')[1])
    .map((folder) => (systemTier.includes(folder) ? folder : components[folder])))];
  expect(declaring.filter((component) => !registries.rootSelectors?.[component]?.length))
    .toEqual([]);
});

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
