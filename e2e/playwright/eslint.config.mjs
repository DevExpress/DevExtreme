/* eslint-disable spellcheck/spell-checker */
import noOnlyTests from 'eslint-plugin-no-only-tests';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import stylistic from '@stylistic/eslint-plugin';
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
  ...typescriptConfig.map((config) => ({
    ...config,
    files: ['**/*.ts'],
  })),
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
  {
    files: ['helpers/**/*.ts', 'models/**/*.ts', 'tests/editors/**/*.ts', 'tests/navigation/form/**/*.ts'],
    rules: {
      'no-restricted-syntax': ['error', {
        selector: "CallExpression[callee.property.name='waitForTimeout'], CallExpression[callee.name='setTimeout'], CallExpression[callee.object.name=/^(window|globalThis)$/][callee.property.name='setTimeout']",
        message: 'Wait for the state the next step needs, not for time.',
      }, {
        selector: "Property[key.name='force'][value.value=true]",
        message: 'A forced action skips the checks a user action would pass. Make the target reachable.',
      }, {
        selector: "CallExpression[callee.property.name='toPass']",
        message: 'Use a retrying assertion on the value itself (expect(locator), expect.poll).',
      }, {
        selector: "CallExpression[callee.object.name!=/^(window|globalThis)$/][callee.property.name=/^(setTimeout|setDefaultTimeout|setDefaultNavigationTimeout)$/], CallExpression[callee.object.name='test'][callee.property.name='slow']",
        message: 'Do not raise a timeout. Find what the test is waiting for.',
      }, {
        selector: "Property[key.name='timeout']",
        message: 'Do not raise a timeout. If this is a widget option, disable the rule on this line and say so.',
      }],
    },
  },
];
