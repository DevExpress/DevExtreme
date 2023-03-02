/* eslint-env node */
/* eslint-disable spellcheck/spell-checker, import/no-commonjs */
module.exports = {
    env: {
        es6: true,
        node: false,
    },
    overrides: [
        {
            files: ['*.js'],
            rules: {
                'import/no-commonjs': 'error',
                'no-restricted-modules': ['error', { 'patterns': ['*.js'] }],
                'no-restricted-imports': ['error', {
                    'paths': [
                        { 'name': 'jquery' },
                        { 'name': 'angular' },
                        { 'name': 'knockout' },
                        { 'name': 'globalize' },
                    ],
                    'patterns': ['jquery/*', 'angular/*', 'knockout/*', 'globalize/*'],
                }],
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
            files: ['*.d.ts'],
            rules: {
                '@typescript-eslint/no-non-null-assertion': 'warn',
                'no-return-await': 'error',
                '@typescript-eslint/no-unsafe-assignment': 'warn',
                '@typescript-eslint/restrict-template-expressions': 'warn',
                '@typescript-eslint/no-unsafe-call': 'warn',
                '@typescript-eslint/no-unnecessary-condition': 'warn',
                '@typescript-eslint/strict-boolean-expressions': 'warn',
                '@typescript-eslint/unbound-method': 'warn',
                '@typescript-eslint/no-unsafe-member-access': 'warn',
                '@typescript-eslint/indent': 'off',
                'spaced-comment': 'off',
                'max-len': 'off',
                '@typescript-eslint/method-signature-style': 'off',
                '@typescript-eslint/unified-signatures': 'off',
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        'selector': 'interface',
                        'format': ['PascalCase', 'camelCase'],
                    },
                    {
                        'selector': 'class',
                        'format': ['PascalCase', 'camelCase'],
                    }
                ],
                '@typescript-eslint/array-type': 'off',
                'no-irregular-whitespace': 'error',
                'import/named': 'off',
                'import/default': 'off',
                '@typescript-eslint/no-type-alias': 'off',
                '@typescript-eslint/member-ordering': 'off',
                '@typescript-eslint/prefer-readonly-parameter-types': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/explicit-member-accessibility': 'off',
                '@typescript-eslint/no-unnecessary-type-arguments': 'off',
                '@typescript-eslint/no-magic-numbers': 'off',
                '@typescript-eslint/ban-types': 'off',
                '@typescript-eslint/prefer-interface': 'off',
                '@typescript-eslint/consistent-type-definitions': 'off',
                '@typescript-eslint/no-empty-interface': 'off',
            },
        },
    ],
};
