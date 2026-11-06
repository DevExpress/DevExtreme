import i18N from 'eslint-plugin-i18n';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import spellCheckConfig from 'eslint-config-devextreme/spell-check';
import typescriptConfig from 'eslint-config-devextreme/typescript';
import jsStyleRules from '../../tools/eslint/js-style-rules.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    ignores: [
      'node_modules/**',
      '**/__tests__/**',
    ],
  },
  ...spellCheckConfig.map(config => {

    const newConfig = {
      ...config
    }

    if (config.rules) {
      newConfig.rules = {
        ...config.rules,
        "spellcheck/spell-checker": [1, {
        "skipWords": [
          "unschedule",
          "subscribable",
          "renderer",
          "rerender",
          "dx",
          "descr",
          "params",
          "typings",
          "wildcard",
          "metadata",
          "namespace",
          "namespaces"
        ]
      }]
      };
    }

    return newConfig
  }),
  {
    plugins: {
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
      "import/extensions": "warn",
      "@stylistic/max-len": ["error", { "code": 150 }],
    },

  },
  ...typescriptConfig.map(config => ({
    ...config,
    files: ['**/*.ts?(x)'],
    ignores: ['**/*.d.ts'],
  })),
  {
    files: ['**/*.ts?(x)'],
    ignores: ['**/*.d.ts'],
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
      '@typescript-eslint/switch-exhaustiveness-check': ['error', {
        considerDefaultExhaustiveForUnions: true,
      }],
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'import/extensions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      'no-underscore-dangle': 'off',
      '@typescript-eslint/naming-convention': 'off',
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
];
