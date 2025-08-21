import noOnlyTests from 'eslint-plugin-no-only-tests';
import i18N from 'eslint-plugin-i18n';
import babelParser from '@babel/eslint-parser';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import { changeRulesToStylistic } from 'eslint-migration-utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: [
      'node_modules/**',
      'wrappers/**',
      'compilation-cases/wrappers/**',
      'compilation-cases/T1263537.ts',
      'compilation-cases/consts.ts',
      'compilation-cases/core.ts',
      'compilation-cases/data/*.ts',
    ],
  },
  ...compat.extends('devextreme/spell-check'),
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
  ...compat.extends('devextreme/typescript').map(config => {
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
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': ['error', {
        considerDefaultExhaustiveForUnions: true,
      }],
    },
  },
  ...compat.extends('devextreme/typescript').map(config => {
    const newConfig = {
      ...config,
      files: ['**/*.d.ts'],
    };

    if (config.rules) {
      newConfig.rules = changeRulesToStylistic(config.rules);
    }

    return newConfig;
  }),
  {
    files: ['**/*.d.ts'],
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
    files: ['bundlers/**/*.js'],
    rules: {
      'import/no-unresolved': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    }
  },
  {
    files: ['compilation-cases/**/*.ts'],
    ignores: [
      'T1263537.ts',
      'consts.ts',
      'core.ts',
      'core.ts',
      'data/*.ts',
    ],
    languageOptions: {
      parserOptions: {
        createDefaultProgram: true,
        project: 'tsconfig.json',
        tsconfigRootDir: `${__dirname}/compilation-cases`,
      }
    },
    rules: {
      'import/no-relative-packages': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off'
    }
  },
  {
    files: ['testcafe-devextreme/**/*.ts'],
    rules: {
      'no-only-tests/no-only-tests': 'error',
      'no-param-reassign': 'off',
      'import/no-extraneous-dependencies': 'off',
      'no-restricted-globals': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      'no-await-in-loop': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@stylistic/no-extra-parens': 'off',
      '@typescript-eslint/init-declarations': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      '@stylistic/object-curly-newline': 'off',
      '@typescript-eslint/require-await': 'off',
      '@stylistic/max-len': 'off',
      '@stylistic/indent': 'off'
    }
  }
];
