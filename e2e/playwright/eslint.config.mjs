/* eslint-disable spellcheck/spell-checker */
import noOnlyTests from 'eslint-plugin-no-only-tests';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import stylistic from '@stylistic/eslint-plugin';
import { changeRulesToStylistic } from 'eslint-migration-utils';
import spellCheckConfig from 'eslint-config-devextreme/spell-check';
import typescriptConfig from 'eslint-config-devextreme/typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: [
      'artifacts/**',
      'node_modules/**',
    ],
  },
  ...spellCheckConfig,
  {
    plugins: {
      'no-only-tests': noOnlyTests,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.mjs', '.ts'],
        },
      },
    },
  },
  ...typescriptConfig.map((config) => {
    const newConfig = {
      ...config,
      files: ['**/*.ts'],
    };

    if (config.rules) {
      newConfig.rules = changeRulesToStylistic(config.rules);
    }

    return newConfig;
  }),
  {
    files: ['**/*.ts'],
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', {
        ignoreRestSiblings: true,
        caughtErrors: 'none',
      }],
      'no-only-tests/no-only-tests': 'error',
      'no-await-in-loop': 'off',
      'no-restricted-globals': 'off',
      'no-restricted-syntax': 'off',
      'require-await': 'off',
      '@typescript-eslint/require-await': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/prefer-default-export': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@stylistic/no-extra-parens': 'off',
    },
  },
];
