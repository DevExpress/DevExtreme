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
                'max-len': ['error', { 'code': 150 }],

                // temporary rules - remove it asap!
                '@typescript-eslint/no-explicit-any': 'warn',
                'spellcheck/spell-checker': 'warn',
                '@typescript-eslint/prefer-optional-chain': 'warn',
                '@typescript-eslint/no-unsafe-return': 'warn',
                '@typescript-eslint/explicit-function-return-type': 'warn',
                '@typescript-eslint/no-use-before-define': 'warn',
                'no-param-reassign': 'warn',
                'consistent-return': 'warn',
                'array-callback-return': 'warn',
                'no-underscore-dangle': 'warn',
                'no-prototype-builtins': 'warn',
                '@typescript-eslint/explicit-module-boundary-types': 'warn',
                'no-restricted-syntax': 'warn',
                'import/no-cycle': 'warn',
                'no-plusplus': 'warn',
                'no-continue': 'warn',
                '@typescript-eslint/no-dynamic-delete': 'warn',
                'no-return-assign': 'warn',
                '@typescript-eslint/prefer-nullish-coalescing': 'warn',
                'import/no-extraneous-dependencies': 'warn',
                '@typescript-eslint/no-unused-vars': 'warn',
            }
        },
        {
            files: [ '*.d.ts' ],
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
