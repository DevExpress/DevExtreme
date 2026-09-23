import path from 'node:path';
import url from 'node:url';
import { createRequire } from 'node:module';
import {
  readdir, readFile, rm, writeFile,
} from 'node:fs/promises';
import StyleDictionary from 'style-dictionary';
import { fileHeader, formattedVariables } from 'style-dictionary/utils';
import { registerTransforms } from './transforms.mjs';
import {
  THEME_NAME, THEME_FOLDER, getBridgeFiles, getModeFiles,
} from './sources.mjs';
import {
  buildAvailableNames,
  collectCustomPropertyReferences,
  collectTokenReferences,
} from './consumed-tokens.ts';

// Suppress ONE known noisy sd-transforms warning about unresolvable
// {font-weight…} references inside math expressions. Scoped to console.warn
// so legitimate errors/logs containing the substring are never swallowed.
// Remove when https://github.com/tokens-studio/sd-transforms/issues/218 is
// fixed in the (forked) sd-transforms we consume.
{
  const originalWarn = console.warn.bind(console);
  console.warn = (message, ...args) => {
    if (typeof message === 'string' && message.includes('Warning: could not resolve reference {font-weight')) {
      return;
    }
    originalWarn(message, ...args);
  };
}

registerTransforms(StyleDictionary);

// The Figma export occasionally emits size-suffixed cross-component references
// (e.g. {text-content.typography.font-weight.small} in the *_small file) while
// only the unsuffixed token exists in that file. Rewrite such dangling
// references to the unsuffixed token, which carries the size-specific value.
const SIZE_SUFFIX_RE = /\.(small|medium|large)$/;

const getTokenAtPath = (tokens, refPath) => {
  let node = tokens;

  for (const part of refPath.split('.')) {
    if (typeof node !== 'object' || node === null || !(part in node)) {
      return undefined;
    }
    node = node[part];
  }

  return typeof node === 'object' && node !== null && '$value' in node ? node : undefined;
};

const hasTokenAtPath = (tokens, refPath) => getTokenAtPath(tokens, refPath) !== undefined;

StyleDictionary.registerPreprocessor({
  name: 'dx/fix-dangling-size-references',
  preprocessor: (tokens) => {
    const visit = (node) => {
      if (typeof node !== 'object' || node === null) {
        return;
      }

      if (typeof node.$value === 'string') {
        node.$value = node.$value.replace(/\{([\w.-]+)\}/g, (match, refPath) => {
          if (!SIZE_SUFFIX_RE.test(refPath) || hasTokenAtPath(tokens, refPath)) {
            return match;
          }

          const unsuffixed = refPath.replace(SIZE_SUFFIX_RE, '');

          if (hasTokenAtPath(tokens, unsuffixed)) {
            console.warn(`[design-tokens] Rewriting dangling reference {${refPath}} -> {${unsuffixed}}`);

            return `{${unsuffixed}}`;
          }

          return match;
        });

        return;
      }

      Object.values(node).forEach(visit);
    };

    visit(tokens);

    return tokens;
  },
});

// Composite shadow aliases are exported as $type "text" with a pure reference
// value (e.g. popup.box-shadow.composite = "{box-shadow.lg}"). Without a
// shadow type they get expanded into per-property sub-tokens; retyping keeps
// them as a single var() reference to the composite shadow variable.
const PURE_REFERENCE_RE = /^\{([\w.-]+)\}$/;

StyleDictionary.registerPreprocessor({
  name: 'dx/fix-composite-shadow-references',
  preprocessor: (tokens) => {
    const visit = (node) => {
      if (typeof node !== 'object' || node === null) {
        return;
      }

      if (typeof node.$value === 'string') {
        const refPath = node.$value.match(PURE_REFERENCE_RE)?.[1];

        if (node.$type === 'text' && refPath) {
          const target = getTokenAtPath(tokens, refPath);

          if (target?.$type === 'boxShadow' || target?.$type === 'shadow') {
            node.$type = 'shadow';
          }
        }

        return;
      }

      Object.values(node).forEach(visit);
    };

    visit(tokens);

    return tokens;
  },
});

/*
 * WORKAROUND for a bug in @devexpress/design-tokens-internal, present since 262.13.0: that release
 * dropped `color.shadow-none` from semantic/colors/*, but
 * semantic/box-shadow/{fluent,material}.json still reference it from every layer of
 * `box-shadow.none`, so Style Dictionary fails the whole build on three unresolvable references.
 * The value the token carried up to 262.12.0 is substituted here, which keeps the output identical
 * to that release: `box-shadow.none` is all-zero geometry in a fully transparent colour.
 *
 * Remove this once the package defines the token again or stops referencing it. The other two
 * preprocessors above patch the same class of export defect.
 */
const REMOVED_REFERENCES = new Map([
  ['color.shadow-none', 'rgba(0,0,0,0)'],
]);

StyleDictionary.registerPreprocessor({
  name: 'dx/substitute-removed-references',
  preprocessor: (tokens) => {
    const visit = (node) => {
      if (typeof node !== 'object' || node === null) {
        return;
      }

      Object.entries(node).forEach(([key, value]) => {
        if (typeof value === 'string') {
          REMOVED_REFERENCES.forEach((replacement, refPath) => {
            if (value.includes(`{${refPath}}`) && !hasTokenAtPath(tokens, refPath)) {
              console.warn(`[design-tokens] Substituting removed reference {${refPath}} -> ${replacement}`);
              node[key] = value.replaceAll(`{${refPath}}`, replacement);
            }
          });

          return;
        }

        visit(value);
      });
    };

    visit(tokens);

    return tokens;
  },
});

const dirname = import.meta.dirname || path.dirname(url.fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const tokensDir = path.dirname(require.resolve('@devexpress/design-tokens-internal/package.json'));
const buildPath = `${path.resolve(dirname, '../../scss/_design-system')}/`;

// Kept in step with the @includes in widgets/fluent-next/_design-system.scss.
const MODE_ROLES_MIXIN = 'roles';
const MODE_ALIASES_MIXIN = 'aliases';
const MODE_ALIASES_FILE = 'mode-aliases';
const MODE_SHARED_FILE = 'mode-shared';

const themePath = path.resolve(dirname, `../../scss/widgets/${THEME_FOLDER}`);

const FLUENT_PALETTES = [
  'blue',
  'cool-blue',
  'desert',
  'mint',
  'moss',
  'orchid',
  'purple',
  'rose',
  'rust',
  'steel',
  'storm',
];

const FLUENT_MODES = [
  'dark',
  'light',
];

const headerFormatting = ({ prefix, ...formatting } = {}) => formatting;

StyleDictionary.registerFormat({
  name: 'dx/mode-scoped-mixin',
  format: async ({ dictionary, file, options }) => {
    const {
      outputReferences, outputReferenceFallbacks, usesDtcg, formatting, sort, mixin,
    } = options;
    const header = await fileHeader({ file, formatting: headerFormatting(formatting), options });
    const variables = formattedVariables({
      format: 'css',
      dictionary,
      outputReferences,
      outputReferenceFallbacks,
      formatting: { ...formatting, indentation: '  ' },
      usesDtcg,
      sort,
    });

    return `${header}@mixin ${mixin}() {\n${variables}\n}\n`;
  },
});

StyleDictionary.registerFormat({
  name: 'scssToCss',
  format: ({ dictionary }) => dictionary.allTokens
    .map((token) => `$${token.name.replace('dxds-', '')}: var(--${token.name});`)
    .join('\n'),
});

const ACCENT_PROPERTY = '--dx-accent-color';
const PRIMARY_STEP_DECLARATION = /^(\s*)--dxds-primary-(\d+):\s*([^;]+);$/gm;
const PRIMARY_STEP_TOKEN = /^dxds-primary-\d+$/;

StyleDictionary.registerFormat({
  name: 'dx/accent-palette',
  format: async (args) => {
    const palette = await StyleDictionary.hooks.formats['css/variables'](args);
    const stepsInDictionary = args.dictionary.allTokens
      .filter(({ name }) => PRIMARY_STEP_TOKEN.test(name)).length;
    let wrapped = 0;
    const withAccentFallback = palette.replace(
      PRIMARY_STEP_DECLARATION,
      (line, indent, step, value) => {
        wrapped += 1;

        return `${indent}--dxds-primary-${step}: var(${ACCENT_PROPERTY}-${step}, ${value});`;
      },
    );

    if (!stepsInDictionary || wrapped !== stepsInDictionary) {
      throw new Error(`An accent palette with ${stepsInDictionary} --dxds-primary-* steps, `
        + `${wrapped} of them wrapped into ${ACCENT_PROPERTY}-*`);
    }

    return withAccentFallback;
  },
});

const FILE_OPTIONS = {
  outputReferences: true,
  themeable: true,
  formatting: { commentStyle: 'none' },
};

const customExpand = {
  exclude: ['shadow', 'text'],
};

const normalizeFilePath = (token) => token.filePath.split(path.sep).join('/');

const getPlatformSettings = (files) => ({
  'scss/category': {
    transformGroup: 'css',
    buildPath,
    transforms: [
      'attribute/cti',
      'color/css',
      'name/kebab',
      'typography/css/shorthand',
      'border/css/shorthand',
      'shadow/css/shorthand',
      'dx/ds-name',
      'dx/fix-transparent-color',
      'dx/fix-drop-shadow',
    ],
    files,
  },
});

const createConfig = (name, files, platformFiles) => ({
  theme: THEME_NAME,
  name,
  source: files.map((src) => path.resolve(tokensDir, `tokens/${src}.json`)),
  preprocessors: [
    'dx/fix-dangling-size-references',
    'dx/fix-composite-shadow-references',
    'dx/substitute-removed-references',
    'tokens-studio',
  ],
  expand: customExpand,
  platforms: getPlatformSettings(platformFiles),
});

const createPaletteConfig = (palette) => createConfig(palette, [`base/colors/palettes/${THEME_NAME}/${palette}`], [
  {
    destination: `${THEME_NAME}/accents/${palette}.scss`,
    format: 'dx/accent-palette',
    filter: (token) => normalizeFilePath(token).includes(`${THEME_NAME}/${palette}.json`),
    options: FILE_OPTIONS,
  },
]);

const createModeConfig = (mode) => createConfig(mode, getModeFiles(mode), [
  {
    destination: 'base.scss',
    format: 'css/variables',
    filter: (token) => {
      const filePath = normalizeFilePath(token);

      return filePath.includes('base/borders.json')
        || filePath.includes('base/opacity.json')
        || filePath.includes('base/spacing.json')
        || filePath.includes('base/typography/');
    },
    options: FILE_OPTIONS,
  },
  {
    destination: `${THEME_NAME}/base.scss`,
    format: 'css/variables',
    filter: (token) => {
      const filePath = normalizeFilePath(token);

      return filePath.includes(`base/colors/utility/${THEME_NAME}.json`)
        || filePath.includes(`figma-utils/icon/set/${THEME_NAME}.json`);
    },
    options: FILE_OPTIONS,
  },
  {
    destination: `${THEME_NAME}/semantic/typography.scss`,
    format: 'css/variables',
    filter: (token) => normalizeFilePath(token).includes(`semantic/typography/${THEME_NAME}`),
    options: FILE_OPTIONS,
  },
  {
    destination: `${THEME_NAME}/semantic/colors/${mode}.scss`,
    format: 'dx/mode-scoped-mixin',
    filter: (token) => {
      const filePath = normalizeFilePath(token);

      return filePath.includes(`semantic/colors/${THEME_NAME}/${mode}.json`)
        || filePath.includes(`icons/${THEME_NAME}/${mode}.json`);
    },
    options: { ...FILE_OPTIONS, mixin: MODE_ROLES_MIXIN },
  },
  {
    destination: `${THEME_NAME}/${MODE_ALIASES_FILE}.scss`,
    format: 'dx/mode-scoped-mixin',
    filter: (token) => {
      const filePath = normalizeFilePath(token);

      return filePath.includes(`semantic/box-shadow/${THEME_NAME}.json`)
        || filePath.includes(`global/${THEME_NAME}.json`)
        || filePath.includes(`figma-utils/box-shadow/semantic/${THEME_NAME}.json`);
    },
    options: { ...FILE_OPTIONS, mixin: MODE_ALIASES_MIXIN },
  },
]);

const createDsConfig = () => createConfig('ds', getBridgeFiles(), [
  {
    destination: 'variables/_ds.scss',
    format: 'scssToCss',
  },
]);

const configs = [
  ...FLUENT_PALETTES.map(createPaletteConfig),
  ...FLUENT_MODES.map(createModeConfig),
  createDsConfig(),
];

async function collectGeneratedFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(entry.parentPath, entry.name));
}

async function validateReferences() {
  const files = await collectGeneratedFiles(buildPath);
  const defined = new Set();
  const used = new Map();

  const contents = await Promise.all(files.map((file) => readFile(file, 'utf-8')));

  for (const [index, file] of files.entries()) {
    const content = contents[index];

    for (const [, name] of content.matchAll(/--(dxds-[\w-]+)\s*:/g)) {
      defined.add(name);
    }

    for (const [, name] of content.matchAll(/var\(--(dxds-[\w-]+)/g)) {
      if (!used.has(name)) {
        used.set(name, file);
      }
    }
  }

  const missing = [...used].filter(([name]) => !defined.has(name));

  if (missing.length > 0) {
    const details = missing
      .map(([name, file]) => `  --${name} (first used in ${path.relative(buildPath, file)})`)
      .join('\n');

    throw new Error(`Design token references without a definition in the generated output:\n${details}`);
  }

  return files.length;
}

async function collectThemeStyleSheets() {
  const entries = await readdir(themePath, { withFileTypes: true, recursive: true });

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith('.scss'))
    .map((entry) => path.join(entry.parentPath, entry.name));
}

const DECLARATION = /^(\s*)(--[\w-]+)\s*:\s*([^;]+);\s*$/;

const parseDeclarations = (content) => content.split('\n').reduce((declarations, line) => {
  const match = DECLARATION.exec(line);

  return match ? declarations.set(match[2], match[3].trim()) : declarations;
}, new Map());

const readsOf = (value) => [...value.matchAll(/var\(\s*(--[\w-]+)/g)].map(([, name]) => name);

const modeDependentNames = (light, dark, aliases) => {
  const tainted = new Set([...light.keys(), ...dark.keys()]
    .filter((name) => light.get(name) !== dark.get(name)));

  for (let grew = true; grew;) {
    grew = false;

    for (const source of [light, aliases]) {
      for (const [name, value] of source) {
        if (!tainted.has(name) && readsOf(value).some((read) => tainted.has(read))) {
          tainted.add(name);
          grew = true;
        }
      }
    }
  }

  return tainted;
};

const withBody = (content, keep) => content.replace(
  /(\{\n)([\s\S]*)(\n\})/,
  (whole, open, body, close) => {
    const lines = body.split('\n').filter((line) => {
      const match = DECLARATION.exec(line);

      return !match || keep(match[2]);
    });

    return `${open}${lines.join('\n')}${close}`;
  },
);

async function splitModeScopedLayers() {
  const modeFile = (mode) => path.join(buildPath, THEME_NAME, 'semantic', 'colors', `${mode}.scss`);
  const aliasesFile = path.join(buildPath, THEME_NAME, `${MODE_ALIASES_FILE}.scss`);
  const sharedFile = path.join(buildPath, THEME_NAME, `${MODE_SHARED_FILE}.scss`);

  const sources = Object.fromEntries(await Promise.all(
    [['light', modeFile('light')], ['dark', modeFile('dark')], ['aliases', aliasesFile]]
      .map(async ([key, file]) => [key, { file, content: await readFile(file, 'utf-8') }]),
  ));
  const parsed = Object.fromEntries(
    Object.entries(sources).map(([key, { content }]) => [key, parseDeclarations(content)]),
  );
  const dependent = modeDependentNames(parsed.light, parsed.dark, parsed.aliases);

  await Promise.all(Object.values(sources).map(({ file, content }) => writeFile(
    file,
    withBody(content, (name) => dependent.has(name)),
    'utf-8',
  )));

  const shared = [...parsed.light, ...parsed.aliases].filter(([name]) => !dependent.has(name));
  const header = sources.light.content.slice(0, sources.light.content.indexOf('@mixin'));
  const body = shared.map(([name, value]) => `  ${name}: ${value};`).join('\n');

  await writeFile(sharedFile, `${header}:root {\n${body}\n}\n`, 'utf-8');

  return { dependent: dependent.size, shared: shared.length };
}

async function validateConsumedTokens() {
  const { version, tokens } = JSON.parse(
    await readFile(path.join(tokensDir, 'tokens.flat.json'), 'utf-8'),
  );
  const availableNames = buildAvailableNames(
    Object.keys(tokens),
    new Set(getBridgeFiles()),
  );

  const referenced = new Map();

  const styleSheets = await collectThemeStyleSheets();
  const styleSheetContents = await Promise.all(styleSheets.map((file) => readFile(file, 'utf-8')));

  for (const [index, file] of styleSheets.entries()) {
    const content = styleSheetContents[index];
    const source = path.relative(themePath, file);
    const found = [
      ...collectTokenReferences(content, source).map((name) => [name, `ds.$${name}`]),
      ...collectCustomPropertyReferences(content, source).map((name) => [name, `var(--dxds-${name})`]),
    ];

    for (const [name, reference] of found) {
      if (!referenced.has(name)) {
        referenced.set(name, { file, reference });
      }
    }
  }

  const missing = [...referenced].filter(([name]) => !availableNames.has(name));

  if (missing.length > 0) {
    const details = missing
      .map(([, { file, reference }]) => `  ${reference} (first used in ${path.relative(themePath, file)})`)
      .join('\n');

    throw new Error(
      `Tokens used by ${THEME_FOLDER} but absent from @devexpress/design-tokens-internal ${version}:\n${details}`,
    );
  }

  return referenced.size;
}

async function build() {
  await rm(buildPath, { recursive: true, force: true });

  for (const config of configs) {
    console.log(`Generating design tokens "${THEME_NAME}-${config.name}"`);

    const sd = new StyleDictionary(config);

    // eslint-disable-next-line no-await-in-loop
    await sd.hasInitialized;
    // eslint-disable-next-line no-await-in-loop
    await sd.buildAllPlatforms();
  }

  const split = await splitModeScopedLayers();
  const fileCount = await validateReferences();
  const consumedCount = await validateConsumedTokens();

  console.log(`Design tokens generated: ${fileCount} files in ${buildPath}`);
  console.log(`Mode-scoped declarations: ${split.dependent} depend on the mode, ${split.shared} moved to :root`);
  console.log(`Design tokens consumed by ${THEME_FOLDER}: ${consumedCount} verified against the package`);
}

await build();
