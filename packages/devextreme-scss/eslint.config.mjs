import { changeRulesToStylistic } from 'eslint-migration-utils';
import javascriptConfig from 'eslint-config-devextreme/javascript';
import typescriptConfig from 'eslint-config-devextreme/typescript';
import jestConfig from 'eslint-config-devextreme/jest';

const configDir = import.meta.dirname;

const restrictedSyntax = javascriptConfig
  .map(({ rules }) => rules?.['no-restricted-syntax'])
  .findLast(Boolean)
  .filter(({ selector }) => selector !== 'ForOfStatement');

const toStylistic = (config, files) => {
  const newConfig = { ...config, files };

  if (config.rules) {
    newConfig.rules = changeRulesToStylistic(config.rules);
  }

  return newConfig;
};

const typescriptFor = (files, project) => [
  ...typescriptConfig.map((config) => toStylistic(config, files)),
  {
    files,
    languageOptions: {
      parserOptions: {
        project,
        tsconfigRootDir: configDir,
      },
    },
  },
];

export default [
  {
    ignores: ['node_modules/**', 'scss/**'],
  },

  ...javascriptConfig.map((config) => ({ ...config, files: ['**/*.mjs'] })),
  {
    files: ['**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
    },
  },

  ...typescriptFor(['build/**/*.ts', 'tools/**/*.ts'], './tsconfig.json'),

  ...typescriptFor(['tests/**/*.ts'], './tests/tsconfig.json'),
  ...jestConfig.map((config) => ({ ...config, files: ['tests/**/*.ts'] })),

  {
    files: ['**/*.{mjs,ts}'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },

  {
    files: ['**/*.mjs'],
    rules: {
      'import/extensions': ['error', 'ignorePackages', { mjs: 'always' }],
      'import/no-unresolved': ['error', {
        ignore: ['^style-dictionary(/|$)', '^@tokens-studio/sd-transforms$'],
      }],
      'no-restricted-syntax': restrictedSyntax,
    },
  },

  {
    files: ['tools/**/*.mjs', 'build/**/*.mjs'],
    rules: {
      'no-console': 'off',
    },
  },

  {
    files: [
      'tools/stylelint/*.mjs',
      'build/tokens/transforms.mjs',
      'build/tokens/build-tokens.mjs',
    ],
    rules: {
      'no-param-reassign': ['error', {
        props: true,
        ignorePropertyModificationsFor: ['decl', 'branch', 'token', 'node'],
      }],
    },
  },
];
