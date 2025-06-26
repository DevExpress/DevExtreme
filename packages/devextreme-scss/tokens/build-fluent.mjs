import StyleDictionary from 'style-dictionary';
import { registerTransforms } from './transforms.mjs';
import fs from 'fs';
import path from 'path';
import * as url from 'url';
import './console-interceptor.cjs';
import { expandTypesMap } from '@tokens-studio/sd-transforms';

registerTransforms(StyleDictionary);

const __dirname = import.meta.dirname || url.fileURLToPath(new URL('.', import.meta.url));

const THEME_NAME = 'fluent';

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
]

const FLUENT_MODES = [
  'dark',
  'light'
]

const getThemeCommonFiles = () => {
  return [
    `base/palettes/${THEME_NAME}-utility`,
    `base/shadows/${THEME_NAME}-shadows`,
    `base/typography/${THEME_NAME}-typography`,
    `base/core`,
    `semantic/${THEME_NAME}/theme-builder`,
  ]
};

const getThemeModes = () => {
  return FLUENT_MODES.map(mode => ({
    name: mode,
    files: [
      ...getThemeCommonFiles(),
      `semantic/${THEME_NAME}/${mode}`,
      `base/palettes/${THEME_NAME}-blue`
    ]
  }));
}

const getThemePalettes = () => {
  return FLUENT_PALETTES.map(palette => ({
    name: palette,
    files: [
      `base/palettes/${THEME_NAME}-${palette}`,
    ]
  }));
}

const getComponents = () => {
  return ['Button', 'Button Group' /*'Text Box'*/].map(component => {
    const name = component.toLowerCase();
    console.log(`tokens/components/${component}/Fluent.json`);
    return {
      name,
      files: [
        ...getThemeCommonFiles(),
        `semantic/${THEME_NAME}/light`, 
        `base/palettes/${THEME_NAME}-blue`,
        `base/shadows/${THEME_NAME}-blue`,
        `components/${component}/Fluent`,
      ]
    };
  });
}

StyleDictionary.registerFormat({
  name: `scssToCss`,
  format: function ({ dictionary }) {
    return dictionary.allTokens
    .map((token) => `$${token.name.replace('DS-', '')}: var(--${token.name});`)
    .join(`\n`);
  },
});

StyleDictionary.registerFormat({
  name: 'css/variables-with-size-alias',
  format({ dictionary, options }) {
    const sizes = [
      { name: 'medium', selector: '.dx-button-md, .dx-size-medium, [data-size="medium"]' },
      { name: 'small',  selector: '.dx-button-sm, .dx-size-small, [data-size="small"]'  },
      { name: 'large',  selector: '.dx-button-lg, .dx-size-large, [data-size="large"]'  }
    ];

       return sizes.map(({ name: size, selector }) => {

      const lines = dictionary.allTokens
        .filter(token => new RegExp(`-${size}\\b`).test(token.name))
        .map(token => {
          const aliasName = token.name.replace(new RegExp(`-${size}\\b`), '');
          return `  --${aliasName}: var(--${token.name});`;
        });

      return `${selector} {\n${lines.join('\n')}\n}`;
    }).join('\n\n');
  }
});

StyleDictionary.registerFormat({
  name: 'css/variables-with-size-alias-skip-one',
  format({ dictionary, options }) {
    const sizes = [
      { name: 'medium', selector: options.selector || ':root, .dx-size-medium, [data-size="medium"]' },
      { name: 'small',  selector: '.dx-size-small, [data-size="small"]'  },
      { name: 'large',  selector: '.dx-size-large, [data-size="large"]'  }
    ];

    return sizes.map(({ name: size, selector }) => {
      const tokensForSize = dictionary.allTokens.filter(token =>
        new RegExp(`-${size}\\b`).test(token.name)
      );

      const lines = tokensForSize.map(token => {
        const aliasName = token.name.replace(new RegExp(`-${size}\\b`), '');
        const raw = token.original.value;

        let refTokenName;
        if (typeof raw === 'string' && raw.startsWith('{') && raw.endsWith('}')) {
          refTokenName = raw.slice(1, -1).replace(/\./g, '-');
        } else {
          refTokenName = token.name;
        }

        return `  --${aliasName}: var(--${refTokenName});`;
      });

      return `${selector} {\n${lines.join('\n')}\n}`;
    }).join('\n\n');
  }
});

const FILE_OPTIONS = {
  outputReferences: true,
  themeable: true
};

const tokenDirRewrite = path.resolve(__dirname, 'fluent-tokens/');

if (!fs.existsSync(tokenDirRewrite))
  throw new Error('copy "tokens" folder from https://github.com/DevExpress/design-tokens to "fluent-builder/fluent-tokens/"')

const tokensDir = tokenDirRewrite;

const createPalettesConfig = (palette, files) => {
  return {
    theme: THEME_NAME,
    name: palette,
    source: files.map(src => path.resolve(tokensDir, `tokens/${src}.json`)),
    preprocessors: ['tokens-studio'],
    expand: {
      typesMap: expandTypesMap,
      exclude: ['shadow']
    },
    platforms: {
      'scss/category': {
        transformGroup: 'css',
        buildPath: path.resolve(__dirname, `../scss/widgets/_design-system/${THEME_NAME}`) + '/',
        transforms: [
          "attribute/cti",
          "color/css",
          "name/kebab",
          'ts/opacity',
          'dxblazor/size/lineheight',
          'ts/typography/fontWeight',
          'ts/resolveMath',
          'ts/size/css/letterspacing',
          'typography/css/shorthand',
          'border/css/shorthand',
          'shadow/css/shorthand',
          'ts/color/modifiers',
          'dxblazor/ds-name',
          'dxblazor/fix-transparent-color',
          'dxblazor/fix-drop-shadow',
          'dxblazor/accent-color',
        ],
        files: [
          {
            destination: `accents/${palette}.scss`,
            format: "css/variables",
            filter: token => {
              return token.filePath.includes(`${THEME_NAME}-${palette}.json`);
            },
            options: FILE_OPTIONS
          }
        ]
      },
    },
  }
}

const createModeConfig = (mode, files) => {
  return {
    theme: THEME_NAME,
    name: mode,
    source: files.map(src => path.resolve(tokensDir, `tokens/${src}.json`)),
    preprocessors: ['tokens-studio'],
    expand: {
      typesMap: expandTypesMap,
      exclude: ['shadow']
    },
    platforms: {
      'scss/category': {
        transformGroup: 'css',
        buildPath: path.resolve(__dirname, `../scss/_design-system/${THEME_NAME}`) + '/',
        transforms: [
          "attribute/cti",
          "color/css",
          "name/kebab",
          'ts/opacity',
          'dxblazor/size/lineheight',
          'ts/typography/fontWeight',
          'ts/resolveMath',
          'ts/size/css/letterspacing',
          'typography/css/shorthand',
          'border/css/shorthand',
          'shadow/css/shorthand',
          'ts/color/modifiers',
          'dxblazor/ds-name',
          'dxblazor/fix-transparent-color',
          'dxblazor/fix-drop-shadow',
          'dxblazor/accent-color',
        ],
        files: [
          {
            destination: `../variables/_ds.scss`,
            format: "scssToCss",
          },
          {
            destination: `../core.scss`,
            format: "css/variables",
            filter: token => {
              return token.filePath.includes(`core.json`);
            },
            options: FILE_OPTIONS
          },
          {
            destination: `utility.scss`,
            format: "css/variables",
            filter: token => {
              return token.filePath.includes(`${THEME_NAME}-utility.json`);
            },
            options: FILE_OPTIONS
          },
          {
            destination: `typography.scss`,
            format: "css/variables",
            filter: token => {
              return token.filePath.includes(`${THEME_NAME}-typography.json`);
            },
            options: FILE_OPTIONS
          },
          {
            destination: `shadows.scss`,
            format: "css/variables",
            filter: token => {
              return token.filePath.includes(`${THEME_NAME}-shadows.json`);
            },
            options: FILE_OPTIONS
          },
          {
            destination: `theme-builder.scss`,
            format: "css/variables",
            filter: token => {
              return token.filePath.includes(`theme-builder.json`);
            },
            options: FILE_OPTIONS
          },
          {
            destination: `modes/${mode}.scss`,
            format: "css/variables",
            filter: token => {
              return token.filePath.includes(`${mode}.json`);
            },
            options: FILE_OPTIONS
          },
        ]
      },
    },
  }
}

const getThemeModesConfig = () => getThemeModes().map(({ name, files }) => createModeConfig(name, files));

const getThemePalettesConfig = () => getThemePalettes().map(({ name, files }) => createPalettesConfig(name, files));

const getComponentsConfig = () => getComponents().map(({ name, files }) => createComponentConfig(name, files));

const createComponentConfig = (component, files) => {
  return {
    theme: THEME_NAME,
    name: component,
    source: files.map(src => path.resolve(tokensDir, `tokens/${src}.json`)),
    preprocessors: ['tokens-studio'],
    expand: {
      typesMap: expandTypesMap,
    },
    platforms: {
      'scss/category': {
        transformGroup: 'css',
        buildPath: path.resolve(__dirname, `../scss/_design-system/${THEME_NAME}`) + '/',
        transforms: [
          "attribute/cti",
          "color/css",
          "name/kebab",
          "ts/opacity",
          "dxblazor/size/lineheight",
          "ts/typography/fontWeight",
          "ts/resolveMath",
          "ts/size/css/letterspacing",
          "typography/css/shorthand",
          "border/css/shorthand",
          "shadow/css/shorthand",
          "ts/color/modifiers",
          "dxblazor/ds-name",
          "dxblazor/fix-transparent-color",
          "dxblazor/fix-drop-shadow",
          "dxblazor/accent-color",
        ],
        files: [
          {
            destination: `components/${component}.scss`,
            format: "css/variables",
            filter: token => {
              if(token.filePath.includes('Fluent.json')) {
                return true;
              }

              return false;
            },
            options: FILE_OPTIONS
          },
          {
            destination: `components/${component}-colors.scss`,
            format: "css/variables",
            filter: token => {
              const hasSizeSuffix = /-(?:small|medium|large)\b/.test(token.name);
              return token.filePath.includes('Fluent.json') && !hasSizeSuffix;
            },
            options: FILE_OPTIONS
          },
          {
            destination: `components/${component}-sizes.scss`,
            format: "css/variables-with-size-alias",
            options: { 
              ...FILE_OPTIONS,
              selector: '.dx-size-medium',
            },
            filter: token => {
              if(token.filePath.includes('Fluent.json')) {
                return true;
              }

              return false;
            },
          },
          {
            destination: `components/${component}-sizes-skip-one.scss`,
            format: "css/variables-with-size-alias-skip-one",
            options: { 
              ...FILE_OPTIONS,
              selector: '.dx-size-medium',
            },
            filter: token => {
              if(token.filePath.includes('Fluent.json')) {
                return true;
              }

              return false;
            },
          }
        ]
      }
    }
  };
};

const configs = [
  ...getThemePalettesConfig(),
  ...getThemeModesConfig(),
  ...getComponentsConfig(),
];

async function build() {
  for (const config of configs) {
    
    console.log(`Generating for theme "${THEME_NAME}-${config.name}"`);
    const sd = new StyleDictionary(config);
    
    await sd.hasInitialized;
    
    sd.cleanAllPlatforms();
    sd.buildAllPlatforms();
    
    console.log(`theme "${THEME_NAME}-${config.name}" generated`)
  }
}

build();
