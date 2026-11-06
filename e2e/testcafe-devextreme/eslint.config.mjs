/* eslint-disable spellcheck/spell-checker */
import noOnlyTests from 'eslint-plugin-no-only-tests';
import i18N from 'eslint-plugin-i18n';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import spellCheckConfig from 'eslint-config-devextreme/spell-check';
import typescriptConfig from 'eslint-config-devextreme/typescript';
import testcafeConfig from 'eslint-config-devextreme/testcafe';
import jsStyleRules from '../../tools/eslint/js-style-rules.mjs';

import noIsReadyWithoutExpect from './eslint-rules/no-is-ready-without-expect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: [
      'node_modules/**',
    ],
  },
  ...spellCheckConfig,
  ...testcafeConfig,
  {
    plugins: {
      'no-only-tests': noOnlyTests,
      i18n: i18N,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
        },
      },
    },
  },
  {
    ...js.configs.recommended,
    files: ['**/*.js'],
  },
  {
    ...importPlugin.flatConfigs.recommended,
    files: ['**/*.js'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        setInterval: true,
        setTimeout: true,
        clearInterval: true,
        clearTimeout: true,
        require: true,
        module: true,
        exports: true,
      },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      ...jsStyleRules,
      '@stylistic/keyword-spacing': ['error', {
        overrides: {
          catch: {
            after: false,
          },

          for: {
            after: false,
          },

          if: {
          },

          switch: {
            after: false,
          },

          while: {
            after: false,
          },
        },
      }],
    }
  },
  ...typescriptConfig.map(config => ({
    ...config,
    files: ['**/*.ts?(x)'],
    ignores: ['**/*.d.ts'],
  })),
  {
    files: ['**/*.ts?(x)'],
    ignores: ['**/*.d.ts'],
    plugins: {
      '@stylistic': stylistic,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 6,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
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
      '@typescript-eslint/switch-exhaustiveness-check': ['error', {
        considerDefaultExhaustiveForUnions: true,
      }],
      'no-only-tests/no-only-tests': 'error',
      /*  
        TODO: Consider these rules comment before these rules, 
        because these rules were disabled during the migration 
        and may need consideration in the future
      */
      'no-param-reassign': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-restricted-globals': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-await-in-loop': 'off',
      '@stylistic/no-extra-parens': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      'require-await': 'off',
    },
  },
  ...typescriptConfig.map(config => ({
    ...config,
    files: ['**/*.d.ts'],
  })),
  {
    files: ['**/*.d.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 6,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          globalReturn: true,
          jsx: true,
        },
      },
    },
    rules: {
      'i18n/no-russian-character': ['error', {
        includeIdentifier: true,
      }],
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
    }
  },
  {
    files: [
      'tests/dataGrid/**/*.ts',
      'tests/cardView/**/*.ts',
      'tests/common/treeList/**/*.ts',
      'tests/common/filterBuilder/**/*.ts',
    ],
    plugins: {
      'local': {
        rules: {
          'no-is-ready-without-expect': noIsReadyWithoutExpect,
        },
      },
    },
    rules: {
      'local/no-is-ready-without-expect': 'error',
    },
  },
];
