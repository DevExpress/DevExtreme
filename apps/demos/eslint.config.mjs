import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import spellcheckDevextreme from 'eslint-config-devextreme/spell-check.js';
import spellcheckPlugin from 'eslint-plugin-spellcheck';
import noOnlyTests from 'eslint-plugin-no-only-tests';
import deprecation from 'eslint-plugin-deprecation';
import react from 'eslint-plugin-react';
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
      'utils', // TODO

      '**/*.{png,json,mjs,css,html,md}',
    ],
  },

  // Plugins and parser
  {
    plugins: {
      spellcheck: spellcheckPlugin,
      'no-only-tests': noOnlyTests,
      deprecation,
      '@stylistic': stylistic,
      jest,
      '@typescript-eslint': tsPlugin
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

  ...compat.extends('eslint:recommended', 'devextreme/javascript', 'devextreme/spell-check').map(config => ({
    ...config,
    rules: changeRulesToStylistic(config.rules || {}),
  })),
  ...compat.extends('devextreme/typescript').map(config => {
    const newConfig = {
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
    };

    if (config.rules) {
      newConfig.rules = changeRulesToStylistic(config.rules);
    }

    return newConfig;
  }),

  // General rules
  {
    rules: {
      'spellcheck/spell-checker': (() => {
        spellcheckRule[1].skipWords = [
          ...spellcheckRule[1].skipWords,
          'acc', // DXHotelsNetApi\Client\views\currentHotel.js ?
          'accessor',
          'adaptivity',
          'adrs',
          'africa',
          'ajax',
          'antialiasing',
          'api',
          'ar', // arabic
          'arabic',
          'arg',
          'argb', // ExcelJS
          'args',
          'asia',
          'assignee',
          'assignees',
          'async',
          'attr',
          'attrs',
          'aug',
          'autocomplete',
          'axe',
          'backorder',
          'backordered', // DevAV NetCore
          'bing',
          'bkg',
          'bool',
          'bg', // ExcelJS
          'br', // <br> tag in html
          'Cldr',
          'canada',
          'canvg', // canvg
          'ceil',
          'checkbox',
          'cityid',
          'cluster',
          'cnstl',
          'colorizer',
          'comparer',
          'concat',
          'coord',
          'coords',
          'cordova',
          'cpu',
          'crosshair',
          'ctrl',
          'datebox',
          'de',
          'ru',
          'democase',
          'democases',
          'desc',
          'dest', // gulp
          'dev', // DevAV
          'devexpress',
          'devextreme',
          'devextremeaddon',
          'dialogs',
          'docurl',
          'draggable',
          'dropzone',
          'dto',
          'dx',
          'dxkey', // for React templates
          'emp',
          'evt',
          'english',
          'etalon',
          'etalons',
          'eurasia',
          'europe',
          'european',
          'exe',
          'expr',
          'fav',
          'faved',
          'femalemiddle',
          'femaleolder',
          'femaleyoung',
          'filename', // DXHotelsNetApi\Client\views\booking.js from db
          'fitted',
          'fg', // ExcelJS
          'formatter',
          'func',
          'gantt',
          'gdp', // gross domestic product
          'geolocation',
          'getter',
          'getters',
          'globals',
          'mapGetters',
          'gif',
          'goto',
          'guid',
          'hotelid',
          'href',
          'html',
          'http',
          'https',
          'ie',
          'iframe',
          'img',
          'init',
          'inited',
          'ity', // DXHotelsNetApi\Client\views\home.js  CIty_Image from db
          'Fmt', // ExcelJS
          'jan',
          'js',
          'jspdf',
          'jszip',
          'jsonp',
          'jsserver',
          'jul',
          'july',
          'jun',
          'june',
          'jsx',
          'Kanban',
          'lang',
          'latinamerica',
          'len',
          'li',
          'lng',
          'loc',
          'lookups',
          'longtabs',
          'luxon',
          'malemiddle',
          'maleolder',
          'maleyoung',
          'maximumfractiondigits',
          'metadata',
          'mmp',
          'monday',
          'msg',
          'multiline',
          'mvc',
          'na', // NaN
          'namespace',
          'nav',
          'nbsp',
          'nd',
          'nighly', // DXHotelsNetApi\Client\views\booking.js from db
          'noop',
          'northamerica',
          'num',
          'objs',
          'occured',
          'oceania',
          'ok',
          'olympic',
          'onclick',
          'onhashchange',
          'onreadystatechange',
          'orderby',
          'pageview',
          'pangaea',
          'param',
          'params',
          'perc',
          'perf',
          'pdf',
          'pivotgrid',
          'png', // DataGrid CustomEditors for image format
          'popup',
          'popups',
          'pos',
          'postfix',
          'prec',
          'pregrouped',
          'prepend',
          'prev',
          'rangebar',
          'readdir', // node js
          'realtor',
          'rect',
          'rehype', // remark and rehype
          'req',
          'resellers',
          'resize',
          'resizing',
          'roomid',
          'rowspan',
          'rtl',
          'sankey',
          'sclass', // CSSClass
          'scrollable',
          'scrollbar',
          'setted',
          'skype',
          'smp',
          'sonee',
          'sortable',
          'sparkline',
          'splashscreen',
          'splinearea',
          'sqlite',
          'sqrt',
          'src',
          'stacktrace',
          'startswith',
          'steparea',
          'stepline',
          'str',
          'stringify',
          'strikethrough',
          'submenu',
          'substr',
          'substring',
          'subvalue',
          'subvalues',
          'svg',
          'swfobject',
          'tbody',
          'th',
          'td',
          'theatre',
          'timestamp',
          'timestamps',
          'tmp',
          'tooltip',
          'tooltips',
          'transpile',
          'transpiler',
          'treeview',
          'ui', // User Interface
          'ul',
          'ungrouped',
          'unlink',
          'unordered',
          'unselect', // unselectAll()
          'unshift',
          'uploader',
          'uri',
          'urlencoded',
          'usa',
          'util',
          'utils',
          'validator',
          'viewport',
          'volumne', // stockMarket, rename to volume
          'vue',
          'whitespace',
          'winloss',
          'xlsx', // ExcelJS
          'xhr',
          'Xmla',
          'xmla',
          'yargs',
          'youtube',
          'ytd',
          'zipcode',
          'Serializer', // XMLSerializer
          // VectorMap Demos
          'Kosovo',
          'Macau',
          'Niue',
          'Palau',
        ];

        return spellcheckRule;
      })(),
      'func-names': 0, // TODO warn (was warn) >500
      'import/extensions': 0,
      'import/order': 0,
      'no-shadow': 0,
      'default-case': 0,
      'new-cap': 0,
      'prefer-exponentiation-operator': 0,
      'no-bitwise': 0,
      'array-callback-return': 0,
      'camelcase': 0,
      'no-use-before-define': 0,
      'prefer-destructuring': 0,
      'no-param-reassign': ['error', {
        'props': false,
      }],
      'no-only-tests/no-only-tests': 'error',
      'class-methods-use-this': 0,
      'no-unsafe-optional-chaining': 0,
      'no-promise-executor-return': 0,
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
      '@stylistic/object-curly-newline': 0,
      '@stylistic/no-confusing-arrow': 0,
      '@stylistic/implicit-arrow-linebreak': 0,
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
      'eqeqeq': 0,
      'no-plusplus': 0,
      'max-classes-per-file': 0,
      'import/extensions': 0,
      'import/no-webpack-loader-syntax': 0,
      'no-restricted-properties': 0,
      'no-restricted-globals': 0,
      'spellcheck/spell-checker': 0,
      'no-useless-concat': 0,
      'no-self-assign': 0,
      'no-var': 0,
      'no-return-assign': 0,
      'vars-on-top': 0,
      'no-sequences': 0,
      'no-param-reassign': 0,
      'no-multi-assign': 0,
      'no-restricted-syntax': 0,
      'prefer-rest-params': 0,
      'radix': 0,
      'no-underscore-dangle': 0,
      'operator-assignment': 0,
      'prefer-const': 0,
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
      // 'deprecation/deprecation': 'error',
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
      '@typescript-eslint/dot-notation': 0,
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
      '@stylistic/quote-props': ['error', 'consistent'],
      'no-dupe-keys': 0,
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
      'react-perf': fixupPluginRules(reactPerf),
      'react-hooks': fixupPluginRules(reactHooks),
      react: fixupPluginRules(react),
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
        version: '16.2',
        flowVersion: '0.53',
      },
      propWrapperFunctions: ['forbidExtraProps'],
    },
    rules: {
      ...changeRulesToStylistic(react.configs.recommended.rules),
      '@stylistic/comma-spacing': 'error',
      '@stylistic/computed-property-spacing': 'error',
      '@stylistic/comma-style': ['error', 'last'],
      '@stylistic/implicit-arrow-linebreak': 0,
      'no-irregular-whitespace': 'error',
      'no-new-func': 'error',
      'no-eval': 'error',
      'no-undef': 'error',
      'no-unused-expressions': 'off',
      'no-extend-native': 'error',
      'no-alert': 'error',
      '@stylistic/no-whitespace-before-property': 'error',
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': 'error',
      'curly': ['error', 'multi-line', 'consistent'],
      'prefer-template': 'error',
      'func-style': ['error', 'declaration', { 'allowArrowFunctions': true }],
      'react/display-name': 'off',
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
      'react/jsx-tag-spacing': [
        'error',
        {
          beforeClosing: 'never',
        },
      ],
      'react/jsx-no-undef': [
        'error',
        {
          allowGlobals: true,
        },
      ],
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': [
        'error',
        {
          enforceDynamicLinks: 'never',
        },
      ],
      'react-perf/jsx-no-new-object-as-prop': [
        'error',
        {
          nativeAllowList: 'all',
        },
      ],
      'react-perf/jsx-no-new-array-as-prop': [
        'error',
        {
          nativeAllowList: 'all',
        },
      ],
      'react-perf/jsx-no-new-array-as-prop': 0,
      'react-perf/jsx-no-new-object-as-prop': 0,
      'react/no-unescaped-entities': 0,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TODO: consider these rules
      'react/jsx-fragments': 0,
    },
  },

  // Vue demos
  ...compat.extends('plugin:vue/vue3-recommended').map(config => ({
    ...config,
    rules: changeRulesToStylistic(config.rules || {}),
    files: [
      'Demos/**/Vue/*.vue',
      'Demos/**/Vue/*.js',
      'utils/templates/Vue/*.vue',
      'utils/templates/Vue/*.js',
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
      '@stylistic/comma-spacing': 'error',
      '@stylistic/computed-property-spacing': 'error',
      '@stylistic/comma-style': ['error', 'last'],

      'no-irregular-whitespace': 'error',
      'no-new-func': 'error',
      'no-eval': 'error',
      'no-undef': 'error',
      'no-unused-expressions': 'off',
      'no-extend-native': 'error',
      'no-alert': 'error',
      '@stylistic/no-whitespace-before-property': 'error',

      // TODO: enable 'no-unused-vars', see these rules to configure it:
      // 'no-unused-vars', 'vue/script-setup-uses-vars', '@typescript-eslint/no-unused-vars'
      'no-unused-vars': 'off',
      
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': 'error',
      'curly': ['error', 'multi-line', 'consistent'],

      'prefer-template': 'error',
      'vue/camelcase': 'error',
      'vue/component-name-in-template-casing': 'error',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/attributes-order': 'off',
      'vue/no-unused-vars': 'error',
      'vue/no-unused-components': 'off',
      'vue/no-template-shadow': 'off',
      'vue/no-v-html': 'off',
      'vue/no-v-model-argument': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/valid-v-model': 'off',
      'vue/valid-v-for': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/return-in-computed-property': 'off',
      '@stylistic/max-len': 'off',
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
      'import/no-unresolved': 0,
    },
  },

  // Demos data files
  {
    files: ['Demos/**/data.js', 'Demos/**/data.ts', 'Demos/**/app.service.ts'],
    rules: {
      '@stylistic/quotes': 0,
      '@stylistic/quote-props': 0,
      '@stylistic/max-len': 0,
      'no-useless-escape': 0,
      'no-unused-vars': 0,
      '@typescript-eslint/no-unused-vars': 0,
    }
  },

  // testcafe tests
  ...compat.extends('devextreme/testcafe').map(config => ({
    ...config,
    rules: changeRulesToStylistic(config.rules || {}),
    files: ['testing/**/*.js'],
  })),
  {
    files: ['testing/**/*.js'],
    languageOptions: {
      globals: {
        testUtils: true,
      },
    },
    rules: {
      'curly': ['error', 'multi-line'],
    },
  },

  // jest tests
  ...compat.extends('plugin:jest/recommended', 'plugin:jest/style').map(config => ({
    ...config,
    rules: changeRulesToStylistic(config.rules || {}),
    files: ['utils/tests/**/*.*'],
  })),
  {
    files: ['utils/tests/**/*.*'],
  },

  // testcafe visual tests
  ...compat.extends('devextreme/testcafe').map(config => ({
    ...config,
    rules: changeRulesToStylistic(config.rules || {}),
    files: ['utils/visual-tests/**/*.*'],
  })),
  {
    files: ['utils/visual-tests/**/*.*'],
    rules: {
      'curly': ['error', 'multi-line'],
    },
  },
];
