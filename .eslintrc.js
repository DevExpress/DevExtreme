// eslint-disable-next-line import/no-extraneous-dependencies
const spellcheckRule = require('eslint-config-devextreme/spell-check').rules['spellcheck/spell-checker'];
spellcheckRule[1].skipIfMatch = [...spellcheckRule[1].skipIfMatch, 'langParams'];

/* eslint-env node */
/* eslint-disable spellcheck/spell-checker */
module.exports = {
    extends: ['devextreme/spell-check'],
    root: true,
    plugins: ['no-only-tests', 'i18n'],
    overrides: [
        {
            files: ['*.js'],
            parser: '@babel/eslint-parser',
            parserOptions: { 'requireConfigFile': false },
            extends: [
                // TODO: We're ready to move on to our linter.
                // 'devextreme/javascript',
                'eslint:recommended',
                'plugin:import/recommended',
            ],
            env: { es6: true },
            globals: {
                'setInterval': true,
                'setTimeout': true,
                'clearInterval': true,
                'clearTimeout': true,
                'require': true,
                'module': true,
                'exports': true
            },
            rules: {
                'i18n/no-russian-character': ['error', { 'includeIdentifier': true }],
                'block-spacing': 'error',
                'comma-spacing': 'error',
                'computed-property-spacing': 'error',
                'comma-style': ['error', 'last'],
                'eqeqeq': ['error', 'allow-null'],
                'strict': 'error',
                'func-call-spacing': 'error',
                'key-spacing': 'error',
                'keyword-spacing': [
                    'error',
                    {
                        'overrides': {
                            'catch': {
                                'after': false,
                            },
                            'for': {
                                'after': false,
                            },
                            'if': {
                                'after': false,
                            },
                            'switch': {
                                'after': false,
                            },
                            'while': {
                                'after': false,
                            },
                        },
                    },
                ],
                'no-multiple-empty-lines': ['error', { max: 2 }],
                'no-multi-spaces': 'error',
                'no-trailing-spaces': 'error',
                'no-empty': ['error', { allowEmptyCatch: true }],
                'no-new-func': 'error',
                'no-eval': 'error',
                'no-undef-init': 'error',
                'no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
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
                'spaced-comment': [
                    'error',
                    'always',
                    {
                        'exceptions': [
                            '#DEBUG',
                            '#ENDDEBUG',
                        ],
                        'markers': [
                            '/',
                        ],
                    },
                ],
                'spellcheck/spell-checker': spellcheckRule,
                'brace-style': ['error', '1tbs', { allowSingleLine: true }],
                'curly': ['error', 'multi-line', 'consistent'],
                'unicode-bom': ['error', 'never'],
                'eol-last': ['error', 'always'],
                'indent': [
                    'error',
                    4,
                    {
                        'SwitchCase': 1,
                        'MemberExpression': 1,
                        'CallExpression': {
                            'arguments': 1,
                        },
                    },
                ],
                'quotes': ['error', 'single'],
                'import/named': 2,
                'import/default': 2,
                'import/no-duplicates': 2,
            }
        },
        {
            files: ['*.ts?(x)'],
            excludedFiles: ['*.d.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                createDefaultProgram: true,
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
                ecmaVersion: 6,
                sourceType: 'module',
            },
            extends: ['devextreme/typescript'],
            rules: {
                'prefer-regex-literals': 'off',
                'i18n/no-russian-character': ['error', { 'includeIdentifier': true }],
            }
        },
        {
            files: [ '*.d.ts' ],
            excludedFiles: 'js/renovation/**/*.d.ts',
            parser: '@typescript-eslint/parser',
            parserOptions: {
                createDefaultProgram: true,
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
                ecmaVersion: 6,
                sourceType: 'module',
                ecmaFeatures: {
                    globalReturn: true,
                    jsx: true
                }
            },
            extends: ['devextreme/typescript'],
            rules: {
                'i18n/no-russian-character': ['error', { 'includeIdentifier': true }],
            },
        },
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
};
