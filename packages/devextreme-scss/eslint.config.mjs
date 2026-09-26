import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { changeRulesToStylistic } from 'eslint-migration-utils';
import javascriptConfig from 'eslint-config-devextreme/javascript';
import typescriptConfig from 'eslint-config-devextreme/typescript';
import jestConfig from 'eslint-config-devextreme/jest';

const configDir = import.meta.dirname;

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
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      parser: tsParser,
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
      globals: globals.node,
    },
  },

  ...javascriptConfig.map((config) => ({ ...config, files: ['**/*.cjs'] })),
  {
    files: ['**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'commonjs',
      globals: globals.node,
    },
    rules: {
      strict: ['error', 'safe'],
    },
  },

  ...typescriptFor(['build/**/*.ts', 'tools/**/*.ts'], './tsconfig.json'),

  ...typescriptFor(['tests/**/*.ts'], './tsconfig.json'),
  ...jestConfig.map((config) => ({ ...config, files: ['tests/**/*.ts'] })),

  {
    files: ['**/*.{mjs,cjs,ts}'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },

  {
    files: ['**/*.mjs'],
    rules: {
      'import/extensions': ['error', 'ignorePackages', { mjs: 'always' }],
      'import/no-unresolved': ['error', {
        ignore: ['^style-dictionary(/|$)', '^safe-ts-transforms-fork$', '^@typescript-eslint/'],
      }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],
    },
  },

  {
    files: ['tools/**/*.mjs', 'build/**/*.{mjs,cjs}'],
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
