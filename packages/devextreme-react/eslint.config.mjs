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

const defaultJsOptions = {
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
    parser: babelParser,
    parserOptions: {
      requireConfigFile: false,
    },
  },
}

export default [
  {
    ignores: [
      'node_modules/**',
      '**/__tests__/**',
    ],
  },
  ...compat.extends('devextreme/spell-check').map(config => {

    const newConfig = {
      ...config
    }

    if (config.rules) {
      newConfig.rules = {
        ...changeRulesToStylistic(config.rules),
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
    ...defaultJsOptions,
  },
  {
    ...importPlugin.flatConfigs.recommended,
    ...defaultJsOptions,
    plugins: {
      'import': importPlugin,
    }
  },
  {
    ...defaultJsOptions,
     plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'i18n/no-russian-character': ['error', {
        includeIdentifier: true,
      }],
      'block-spacing': 'error',
      'comma-spacing': 'error',
      'computed-property-spacing': 'error',
      'comma-style': ['error', 'last'],
      'eqeqeq': ['error', 'allow-null'],
      'strict': 'error',
      'func-call-spacing': 'error',
      'key-spacing': 'error',
      'keyword-spacing': ['error', {
        overrides: {
          catch: {
            after: false,
          },

          for: {
            after: false,
          },

          if: {
            after: false,
          },

          switch: {
            after: false,
          },

          while: {
            after: false,
          },
        },
      }],
      'no-multiple-empty-lines': ['error', {
        max: 2,
      }],
      'no-multi-spaces': 'error',
      'no-trailing-spaces': 'error',
      'no-empty': ['error', {
        allowEmptyCatch: true,
      }],
      'no-new-func': 'error',
      'no-eval': 'error',
      'no-undef-init': 'error',
      'no-unused-vars': ['error', {
        args: 'none',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
      }],
      'no-extend-native': 'error',
      'no-alert': 'error',
      'no-console': 'error',
      'no-restricted-syntax': ['error', 'ForOfStatement'],
      'no-var': 'error',
      'no-whitespace-before-property': 'error',
      'object-curly-spacing': ['error', 'always'],
      'one-var': ['error', 'never'],
      'prefer-const': 'error',
      'semi-spacing': 'error',
      'semi': 'error',
      'space-before-blocks': 'error',
      'space-before-function-paren': ['error', 'never'],
      'space-in-parens': 'error',
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',
      '@stylistic/space-infix-ops': 'error',
      'space-unary-ops': 'error',
      'spaced-comment': ['error', 'always', {
        exceptions: ['#DEBUG', '#ENDDEBUG'],
        markers: ['/'],
      }],
      '@stylistic/brace-style': ['error', '1tbs', {
        allowSingleLine: true,
      }],
      'curly': ['error', 'multi-line', 'consistent'],
      'unicode-bom': ['error', 'never'],
      'eol-last': ['error', 'always'],
      '@stylistic/indent': ['error', 4, {
        SwitchCase: 1,
        MemberExpression: 1,

        CallExpression: {
          arguments: 1,
        },
      }],
      'quotes': ['error', 'single'],
      'import/named': 2,
      'import/default': 2,
      'import/no-duplicates': 2,
      "import/extensions": "warn",
      "max-len": ["error", { "code": 150 }],
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
      '@typescript-eslint/switch-exhaustiveness-check': ['error', {
        considerDefaultExhaustiveForUnions: true,
      }],
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      'import/extensions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      'no-underscore-dangle': 'off',
      '@typescript-eslint/naming-convention': 'off',
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
];
