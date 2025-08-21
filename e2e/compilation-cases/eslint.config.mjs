import noOnlyTests from 'eslint-plugin-no-only-tests';
import i18N from 'eslint-plugin-i18n';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
// eslint-disable-next-line spellcheck/spell-checker
import { FlatCompat as FlatCompatibility } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';
import { changeRulesToStylistic } from 'eslint-migration-utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compatibility = new FlatCompatibility({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: [
      'node_modules/**',
    ],
  },
  ...compatibility.extends('devextreme/spell-check'),
  {
    plugins: {
      'no-only-tests': noOnlyTests,
      i18n: i18N,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.ts'],
        },
      },
    },
  },
  ...compatibility.extends('devextreme/typescript').map(config => {
    const newConfig = {
      ...config,
      files: ['**/*.ts?(x)'],
      ignores: ['**/*.d.ts'],
    }

    if (config.rules) {
      newConfig.rules = changeRulesToStylistic(config.rules);
    }

    return newConfig;
  }),
  {
    files: ['**/*.ts?(x)'],
    ignores: ['**/*.d.ts'],
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      parser: tsParser,
      // eslint-disable-next-line spellcheck/spell-checker
      ecmaVersion: 6,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        // eslint-disable-next-line spellcheck/spell-checker
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'prefer-regex-literals': 'off',
      'i18n/no-russian-character': ['error', {
        includeIdentifier: true,
      }],
      '@typescript-eslint/no-unused-vars': ['error', {
        "ignoreRestSiblings": true,
        "caughtErrors": 'none',
      }],
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': ['error', {
        considerDefaultExhaustiveForUnions: true,
      }],
      'import/no-relative-packages': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'import/no-extraneous-dependencies': 'off'
    },
  },
];
