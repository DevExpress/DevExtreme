import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import spellcheckDevextreme from 'eslint-config-devextreme/spell-check.js';
import spellcheckPlugin from 'eslint-plugin-spellcheck';
import noOnlyTests from 'eslint-plugin-no-only-tests';
import deprecation from 'eslint-plugin-deprecation';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactPerf from 'eslint-plugin-react-perf';
import jest from 'eslint-plugin-jest';
import vueParser from 'vue-eslint-parser';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';
import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { changeRulesToStylistic } from 'eslint-migration-utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

const spellcheckRule = spellcheckDevextreme.rules['spellcheck/spell-checker'];

export default [
  {
    ignores: [
      'node_modules',
      'bundles',
      'coverage',
      'publish-demos',
      'Demos/**/testcafe-test-code.js',
      'shared/empty-file.ts',
      'Demos/**/config.js',
      'Demos/**/Vue/**/*.html',
      'templates/Vue/*.ts',
      'utils', // TODO unignore this

      '**/*.{png,json,mjs,css,html,md}',
    ],
  },

  // Plugins and parser
  {
    plugins: {
      spellcheck: spellcheckPlugin,
      'no-only-tests': noOnlyTests,
      '@stylistic': stylistic,
      jest,
      '@typescript-eslint': tsPlugin,
      'deprecation': fixupPluginRules(deprecation),
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es6,
      },
      parser: babelParser,
      ecmaVersion: 2018,
      sourceType: 'module',
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
      },
    },
  },

  ...compat.extends('eslint:recommended', 'devextreme/spell-check'),

  ...compat.extends('devextreme/javascript').map(config => ({
    ...config,
    rules: changeRulesToStylistic(config.rules || {}),
  })),
  ...compat.extends('devextreme/typescript').map(config => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
    rules: changeRulesToStylistic(config.rules || {}),
  })),

  // General rules
  {
    rules: {
      'spellcheck/spell-checker': (() => {
        spellcheckRule[1].skipWords = [
          ...spellcheckRule[1].skipWords,
          'axe',
          'canvg',
          'devextreme',
          'dxo',
          'jsx',
          'luxon',
          'sanitizer',
          'rehype',
          'timestamps',
          'urls',
          'whitespace',
          'yargs',
        ];

        return spellcheckRule;
      })(),
      'func-names': 0, // TODO warn (was warn) >500

      'no-shadow': 0,
      'default-case': 0,
      'new-cap': 0,
      'prefer-exponentiation-operator': 0,
      'no-bitwise': 0,
      'array-callback-return': 0,
      'camelcase': 0,
      'no-use-before-define': 0,
      'prefer-destructuring': 0,
      'no-irregular-whitespace': 'error',
      'no-new-func': 'error',
      'no-eval': 'error',
      'no-undef': 'error',
      'no-unused-expressions': 0,
      'no-extend-native': 'error',
      'no-alert': 'error',
      'no-param-reassign': ['error', {
        'props': false,
      }],
      'prefer-template': 'error',
      'curly': ['error', 'multi-line', 'consistent'],
      'class-methods-use-this': 0,
      'no-unsafe-optional-chaining': 0,
      'no-promise-executor-return': 0,

      'no-only-tests/no-only-tests': 'error',

      'import/extensions': 0,
      'import/order': 0,
      'import/no-webpack-loader-syntax': 0,

      '@stylistic/max-len': 0, // TODO enable this rule (was 100)
      '@stylistic/indent': ['error', 2, {
        SwitchCase: 1,
        MemberExpression: 1,
        CallExpression: {
          arguments: 1,
        },
      }],
      
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      }],
      '@stylistic/semi-spacing': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/operator-linebreak': 0,
      '@stylistic/no-mixed-operators': 0,
      '@stylistic/no-extra-parens': 0,
      '@stylistic/function-paren-newline': 0,
      '@stylistic/object-curly-newline': ['error', { consistent: true }],
      '@stylistic/no-confusing-arrow': 0,
      '@stylistic/implicit-arrow-linebreak': 0,
      '@stylistic/member-delimiter-style': 0,
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/computed-property-spacing': 'error',
      '@stylistic/comma-style': ['error', 'last'],
    },
  },

  // .js and .jsx files
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      'no-unused-vars': 'error',
    }
  },

  // .ts and .tsx files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 6,
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
          './tsconfig.eslint.json', 
        ],
        createDefaultProgram: true,
      }
    },
    rules: {
      // TODO consider this rules
      'max-classes-per-file': 0,
      'no-restricted-properties': 0,
      'no-restricted-globals': 0,
      'no-self-assign': 0,
      'no-multi-assign': 0,
      'no-restricted-syntax': 0,
      'prefer-rest-params': 0,
      'radix': 0,
      'no-underscore-dangle': 0,
      'operator-assignment': 0,

      'deprecation/deprecation': 'error',

      '@typescript-eslint/naming-convention': 0,
      '@typescript-eslint/no-throw-literal': 0,
      '@typescript-eslint/no-use-before-define': 0,
      '@typescript-eslint/no-shadow': 0,
      '@typescript-eslint/no-loop-func': 0,
      '@typescript-eslint/ban-types': 0,
      '@typescript-eslint/no-this-alias': 0,
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-unused-expressions': 0,
      '@typescript-eslint/no-useless-constructor': 0,
      '@typescript-eslint/explicit-module-boundary-types': 0, // was warn

      // TODO: consider these rules
      '@typescript-eslint/init-declarations': 0,
      '@typescript-eslint/prefer-readonly': 0,
      '@typescript-eslint/no-unsafe-return': 0,
      '@typescript-eslint/prefer-for-of': 0,
      '@typescript-eslint/require-await': 0,
      '@typescript-eslint/no-misused-promises': 0,
      '@typescript-eslint/member-ordering': 0,
      '@typescript-eslint/no-base-to-string': 0,
      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/no-invalid-this': 0,
      '@typescript-eslint/no-unsafe-function-type': 0,
      '@typescript-eslint/no-wrapper-object-types': 0,
      '@typescript-eslint/prefer-regexp-exec': 0,
      '@typescript-eslint/restrict-plus-operands': 0,
      '@typescript-eslint/no-inferrable-types': 0,
      '@typescript-eslint/prefer-reduce-type-parameter': 0,
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 0,
      '@typescript-eslint/consistent-type-definitions': 0,
      '@typescript-eslint/prefer-nullish-coalescing': 0,
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/prefer-ts-expect-error': 0,
      '@typescript-eslint/prefer-includes': 0,
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-extraneous-class': 0,
      '@typescript-eslint/no-floating-promises': 0,
    },
  },

  // ./configs directory
  {
    files: ['configs/**/*.js'],
    languageOptions: {
      globals: {
        System: true,
      },
    },
    rules: {
      'no-dupe-keys': 0,
      '@stylistic/quote-props': ['error', 'consistent'],
    },
  },

  // jQuery demos
  {
    files: ['Demos/**/jQuery/*.*', 'utils/templates/jQuery/**/*.*'],
    languageOptions: {
      globals: {
        ...globals.jquery,
        DevExpress: true,
      },
    },
  },
  {
    files: ['Demos/**/jQuery/**/index.js', 'utils/templates/jQuery/**/index.js'],
    languageOptions: {
      globals: {
        ...globals.jquery,
        DevExpress: true,
      },
    },
    rules: {
      'no-undef': 0,
    },
  },

  // React demos
  {
    files: [
      'Demos/**/React/*.*', 
      'Demos/**/ReactJs/*.*', 
      'utils/templates/React/*.*'
    ],
    plugins: {
      'react-perf': reactPerf,
      'react-hooks': reactHooks,
      react: reactPlugin
    },
    languageOptions: {
      globals: {
        System: false,
      },
    },
    settings: {
      react: {
        createClass: 'createReactClass',
        pragma: 'React',
        version: '17.0.2',
        flowVersion: '0.53',
      },
      propWrapperFunctions: ['forbidExtraProps'],
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'func-style': ['error', 'declaration', { 'allowArrowFunctions': true }],

      'react/display-name': 0,
      'react/prop-types': 0,
      'react/no-unescaped-entities': 0,
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
        },
      ],
      'react/jsx-fragments': ['error', 'element'],
      'react/jsx-no-bind': [
        'error',
        {
          allowBind: true, // TODO false (was false)
          allowArrowFunctions: true, // TODO false (was false)
          allowFunctions: true, // TODO false
          ignoreRefs: true,
        },
      ],
      'react/jsx-tag-spacing': ['error', { beforeClosing: 'never' }],
      'react/jsx-no-undef': ['error', { allowGlobals: true }],
      'react/jsx-no-target-blank': ['error', { enforceDynamicLinks: 'never' }],

      'react-perf/jsx-no-new-object-as-prop': ['error', { nativeAllowList: 'all' }],
      'react-perf/jsx-no-new-array-as-prop': ['error', { nativeAllowList: 'all' }],
      'react-perf/jsx-no-new-array-as-prop': 0,
      'react-perf/jsx-no-new-object-as-prop': 0,

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // Vue demos
  ...compat.extends('plugin:vue/vue3-recommended').map(config => ({
    ...config,
    files: [
      'Demos/**/Vue/*.vue',
      'utils/templates/Vue/*.vue',
    ],
  })),
  {
    files: [
      'Demos/**/Vue/*.vue',
      'utils/templates/Vue/*.vue',
    ],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        sourceType: 'module',
      },
      globals: {
        System: false,
      },
    },
    rules: {
      // TODO: enable 'no-unused-vars', see these rules to configure it:
      // 'no-unused-vars', 'vue/script-setup-uses-vars', '@typescript-eslint/no-unused-vars'
      'no-unused-vars': 0,

      // TODO: enable this rule, when imports in Vue are fixed
      'import/no-unresolved': 0,

      'vue/camelcase': 'error',
      'vue/component-name-in-template-casing': 'error',
      'vue/singleline-html-element-content-newline': 0,
      'vue/multiline-html-element-content-newline': 0,
      'vue/attributes-order': 0,
      'vue/no-unused-vars': 'error',
      'vue/no-unused-components': 0,
      'vue/no-template-shadow': 0,
      'vue/no-v-html': 0,
      'vue/no-v-model-argument': 0,
      'vue/v-on-event-hyphenation': 0,
      'vue/valid-v-model': 0,
      'vue/valid-v-for': 0,
      'vue/attribute-hyphenation': 0,
      'vue/multi-word-component-names': 0,
      'vue/return-in-computed-property': 0,
      'vue/max-len': ['error', {
        code: 100,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      }],
      'vue/html-closing-bracket-spacing': ['error', {
        startTag: 'never',
        endTag: 'never',
        selfClosingTag: 'never',
      }],
      'vue/html-closing-bracket-newline': ['error', {
        singleline: 'never',
        multiline: 'always',
      }],
    },
  },

  // Demos data files
  {
    files: ['Demos/**/data.js', 'Demos/**/data.ts', 'Demos/**/app.service.ts'],
    rules: {
      'no-useless-escape': 0,
      'no-unused-vars': 0,

      '@stylistic/quotes': 0,
      '@stylistic/quote-props': 0,
      '@stylistic/max-len': 0,

      '@typescript-eslint/no-unused-vars': 0,
    }
  },
  {
    files: ['Demos/**/ReactJs/*.js'],
    rules: {
      // Our data files are inconsistent: some files use double quotes, others use single quotes.
      // We need this rule, so that linter will not complain a lot about it.
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/object-curly-newline': ['error', { 
        "multiline": true, 
        "consistent": true, 
        "minProperties": 4 
      }],
      'no-unused-vars': 0,
    }
  },

  // testcafe tests
  ...compat.extends('devextreme/testcafe').map(config => ({
    ...config,
    rules: changeRulesToStylistic(config.rules || {}),
    files: ['testing/**/*.js', 'utils/visual-tests/**/*.*'],
  })),

  {
    files: ['testing/**/*.js'],
    languageOptions: {
      globals: {
        testUtils: true,
      },
    },
  },

  {
    files: ['**/test-code.js', '**/client-script.js'],
    languageOptions: {
      globals: {
        DevExpress: true,
        testUtils: true,
        MockDate: true,
      },
    },
  },

  // jest tests
  ...compat.extends('plugin:jest/recommended', 'plugin:jest/style').map(config => ({
    ...config,
    files: ['utils/tests/**/*.*'],
  })),
];
