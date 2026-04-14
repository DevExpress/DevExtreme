/* eslint-disable spellcheck/spell-checker */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import babelParser from '@babel/eslint-parser';
import tsParser from '@typescript-eslint/parser';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import { changeRulesToStylistic } from 'eslint-migration-utils';
import spellCheckConfig from 'eslint-config-devextreme/spell-check';
import javascriptConfig from 'eslint-config-devextreme/javascript';
import typescriptConfig from 'eslint-config-devextreme/typescript';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
  baseDirectory: dirname,
});

export default [
  {
    ignores: [
      'src/index.ts',
      'src/common',
      'src/ui',
      'tests/src/server/component-names.ts',
      '**/node_modules',
      '**/dist'],
  },
  {
    plugins: {
      '@stylistic': stylistic,
      import: importPlugin,
    },
  },
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: dirname,
        requireConfigFile: false,
        ecmaVersion: 6,
        sourceType: 'module',
      },
    },
  },
  ...spellCheckConfig,
  ...javascriptConfig.map((config) => ({
    ...config,
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      parser: babelParser,
    },
  })),
  ...typescriptConfig.map((config) => ({
    ...config,
    rules: config.rules
      ? changeRulesToStylistic(config.rules)
      : {},
    files: ['**/*.ts'],
  })),
  {
    rules: {
      'import/no-cycle': 'warn',
      'no-param-reassign': 'warn',
      'no-underscore-dangle': 'warn',
      'spellcheck/spell-checker': [1, {
        lang: 'en_US',
        comments: false,
        strings: false,
        identifiers: true,
        templates: false,
        skipIfMatch: ['^\\$?..$'],
        skipWords: [
          'unschedule',
          'subscribable',
          'renderer',
          'rerender',
          'dx',
          'descr',
          'params',
          'typings',
          'wildcard',
          'metadata',
          'namespace',
          'namespaces',
        ],
      }],
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      parser: babelParser,
    },
    rules: {
      'global-require': 'off',
      'import/no-unresolved': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-dynamic-require': 'warn',
      'new-cap': 'off',
      'no-undef': 'off',
      'no-unused-expressions': 'warn',
      'no-useless-escape': 'warn',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@stylistic/max-len': ['error', {
        code: 150,
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-extraneous-class': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/restrict-plus-operands': 'warn',
      '@typescript-eslint/no-this-alias': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/init-declarations': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/no-use-before-define': 'warn',
      '@typescript-eslint/member-ordering': 'warn',
      '@typescript-eslint/no-dynamic-delete': 'warn',
      '@typescript-eslint/naming-convention': 'warn',
      '@typescript-eslint/no-invalid-this': 'warn',
      '@typescript-eslint/no-unsafe-function-type': 'warn',
      '@typescript-eslint/no-wrapper-object-types': 'warn',
      // NOTE: this rule requires "strictNullChecks": true in tsconfig
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
      'class-methods-use-this': 'warn',
      'consistent-return': 'warn',
      'guard-for-in': 'warn',
      'import/extensions': 'warn',
      'import/no-extraneous-dependencies': 'warn',
      'max-classes-per-file': 'warn',
      'no-plusplus': 'warn',
      'no-restricted-syntax': 'warn',
      'prefer-spread': 'warn',
      'no-empty-pattern': 'warn',
      'no-empty': 'warn',
      'no-prototype-builtins': 'warn',
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/class-literal-property-style': 'warn',
      '@typescript-eslint/no-useless-constructor': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      'import/order': 'warn',
      'no-restricted-globals': 'warn',
      'no-self-assign': 'warn',
      'no-new': 'warn',
      'no-return-assign': 'warn',
    },
  },
];
