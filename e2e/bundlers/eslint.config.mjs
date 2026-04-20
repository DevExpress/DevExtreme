import babelParser from '@babel/eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
// eslint-disable-next-line spellcheck/spell-checker
import { FlatCompat as FlatCompatibility } from '@eslint/eslintrc';
import spellCheckConfig from 'eslint-config-devextreme/spell-check';
import stylistic from '@stylistic/eslint-plugin';
import i18N from 'eslint-plugin-i18n';
import noOnlyTests from 'eslint-plugin-no-only-tests';

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
  ...spellCheckConfig,
  {
    plugins: {
      'no-only-tests': noOnlyTests,
      i18n: i18N,
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js'],
        },
      },
    },
  },
  ...compatibility.extends('eslint:recommended', 'plugin:import/recommended').map(config => ({
    ...config,
    files: ['**/*.js']
  })),
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
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
      },
    },
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
      /*  
        TODO: Consider these rules comment before these rules, 
        because these rules were disabled during the migration 
        and may need consideration in the future
      */
      'import/no-unresolved': 'off',
    },
  },
];
