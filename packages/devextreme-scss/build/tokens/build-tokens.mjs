import path from 'node:path';
import url from 'node:url';
import { createRequire } from 'node:module';
import { readdir, readFile, rm } from 'node:fs/promises';
import StyleDictionary from 'style-dictionary';
import { registerTransforms } from './transforms.mjs';
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

const dirname = import.meta.dirname || path.dirname(url.fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const tokensDir = path.dirname(require.resolve('@devexpress/design-tokens-internal/package.json'));
const buildPath = `${path.resolve(dirname, '../../scss/_design-system')}/`;

const THEME_NAME = 'fluent';
const THEME_FOLDER = 'fluent-next';

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

const getThemeCommonFiles = () => [
  'base/borders',
  'base/opacity',
  'base/spacing',
  'base/typography/font-family',
  'base/typography/font-weight',
  'base/typography/font-size',
  'base/typography/letter-spacing',
  'base/typography/line-height',
  'base/typography/text-case',
  'base/typography/text-decoration',
  `base/colors/utility/${THEME_NAME}`,
  `semantic/box-shadow/${THEME_NAME}`,
  `semantic/typography/${THEME_NAME}/font-family`,
  `semantic/typography/${THEME_NAME}/font-size`,
  `semantic/typography/${THEME_NAME}/font-weight`,
  `semantic/typography/${THEME_NAME}/letter-spacing`,
  `semantic/typography/${THEME_NAME}/line-height`,
  `global/${THEME_NAME}`,
  `figma-utils/box-shadow/semantic/${THEME_NAME}`,
  `figma-utils/icon/set/${THEME_NAME}`,
];

const getModeFiles = (mode) => [
  ...getThemeCommonFiles(),
  `base/colors/icons/${THEME_NAME}/${mode}`,
  `base/colors/palettes/${THEME_NAME}/blue`,
  `semantic/colors/${THEME_NAME}/${mode}`,
];

// Source files behind the SCSS bridge. The component tier is absent on purpose: its tokens only
// alias the semantic roles the theme already reads, so emitting them added unreferenced custom
// properties. Absent from the bridge, `ds.$button-color-bg-rest` is now a Sass error.
const getBridgeFiles = () => getModeFiles('light');

StyleDictionary.registerFormat({
  name: 'scssToCss',
  format: ({ dictionary }) => dictionary.allTokens
    .map((token) => `$${token.name.replace('dxds-', '')}: var(--${token.name});`)
    .join('\n'),
});

const FILE_OPTIONS = {
  outputReferences: true,
  themeable: true,
};

// 'text' covers reference-only tokens such as popup.box-shadow.composite
// ($type "text", $value "{box-shadow.lg}") — expanding them would inline the
// referenced composite shadow structure instead of keeping a var() reference.
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
  preprocessors: ['dx/fix-dangling-size-references', 'dx/fix-composite-shadow-references', 'tokens-studio'],
  expand: customExpand,
  platforms: getPlatformSettings(platformFiles),
});

const createPaletteConfig = (palette) => createConfig(palette, [`base/colors/palettes/${THEME_NAME}/${palette}`], [
  {
    destination: `${THEME_NAME}/accents/${palette}.scss`,
    format: 'css/variables',
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
        || filePath.includes(`global/${THEME_NAME}.json`)
        || filePath.includes(`figma-utils/box-shadow/semantic/${THEME_NAME}.json`)
        || filePath.includes(`figma-utils/icon/set/${THEME_NAME}.json`);
    },
    options: FILE_OPTIONS,
  },
  // The semantic tier is emitted under an explicit semantic/ folder mirroring the
  // package layout (tokens/semantic/{typography,box-shadow,colors}) so the middle
  // customization layer is discoverable in the generated output.
  {
    destination: `${THEME_NAME}/semantic/typography.scss`,
    format: 'css/variables',
    filter: (token) => normalizeFilePath(token).includes(`semantic/typography/${THEME_NAME}`),
    options: FILE_OPTIONS,
  },
  {
    destination: `${THEME_NAME}/semantic/box-shadow.scss`,
    format: 'css/variables',
    filter: (token) => normalizeFilePath(token).includes(`semantic/box-shadow/${THEME_NAME}.json`),
    options: FILE_OPTIONS,
  },
  {
    destination: `${THEME_NAME}/semantic/colors/${mode}.scss`,
    format: 'css/variables',
    filter: (token) => {
      const filePath = normalizeFilePath(token);

      return filePath.includes(`semantic/colors/${THEME_NAME}/${mode}.json`)
        || filePath.includes(`icons/${THEME_NAME}/${mode}.json`);
    },
    options: FILE_OPTIONS,
  },
]);

// Component *size* tokens are excluded for the same reason as the component theme: fluent-next
// maps sizes onto the base scales (spacing/font-size/border-radius/…), so no widget would read the
// `*-layout-*` names (see widgets/fluent-next/_design-system.scss).
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

  for (const file of files) {
    const content = await readFile(file, 'utf-8');

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

// Every token a widget reads must still exist in the package. Without this a deleted token surfaces
// much later as a Sass "Undefined variable", one name per rebuild, with no hint that a bump caused
// it. Read from the flat index, not the bridge: it carries the version for the message.
async function validateConsumedTokens() {
  const { version, tokens } = JSON.parse(
    await readFile(path.join(tokensDir, 'tokens.flat.json'), 'utf-8'),
  );
  const availableNames = buildAvailableNames(
    Object.keys(tokens),
    new Set(getBridgeFiles()),
  );

  const referenced = new Map();

  for (const file of await collectThemeStyleSheets()) {
    const content = await readFile(file, 'utf-8');
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

    await sd.hasInitialized;
    await sd.buildAllPlatforms();
  }

  const fileCount = await validateReferences();
  const consumedCount = await validateConsumedTokens();

  console.log(`Design tokens generated: ${fileCount} files in ${buildPath}`);
  console.log(`Design tokens consumed by ${THEME_FOLDER}: ${consumedCount} verified against the package`);
}

await build();
