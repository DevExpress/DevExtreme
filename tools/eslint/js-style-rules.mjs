// Rules for the plain JavaScript files that several packages lint the same way.
// The configs that spread them register the @stylistic, import and i18n plugins.
export default {
    'i18n/no-russian-character': ['error', {
        includeIdentifier: true,
    }],
    '@stylistic/block-spacing': 'error',
    '@stylistic/comma-spacing': 'error',
    '@stylistic/computed-property-spacing': 'error',
    '@stylistic/comma-style': ['error', 'last'],
    'eqeqeq': ['error', 'allow-null'],
    'strict': 'error',
    '@stylistic/function-call-spacing': 'error',
    '@stylistic/key-spacing': 'error',
    '@stylistic/keyword-spacing': ['error', {
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
    '@stylistic/no-multiple-empty-lines': ['error', {
        max: 2,
    }],
    '@stylistic/no-multi-spaces': 'error',
    '@stylistic/no-trailing-spaces': 'error',
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
    '@stylistic/no-whitespace-before-property': 'error',
    '@stylistic/object-curly-spacing': ['error', 'always'],
    'one-var': ['error', 'never'],
    'prefer-const': 'error',
    '@stylistic/semi-spacing': 'error',
    '@stylistic/semi': 'error',
    '@stylistic/space-before-blocks': 'error',
    '@stylistic/space-before-function-paren': ['error', 'never'],
    '@stylistic/space-in-parens': 'error',
    '@stylistic/space-infix-ops': 'error',
    '@stylistic/space-unary-ops': 'error',
    '@stylistic/spaced-comment': ['error', 'always', {
        exceptions: ['#DEBUG', '#ENDDEBUG'],
        markers: ['/'],
    }],
    '@stylistic/brace-style': ['error', '1tbs', {
        allowSingleLine: true,
    }],
    'curly': ['error', 'multi-line', 'consistent'],
    'unicode-bom': ['error', 'never'],
    '@stylistic/eol-last': ['error', 'always'],
    '@stylistic/indent': ['error', 4, {
        SwitchCase: 1,
        MemberExpression: 1,

        CallExpression: {
            arguments: 1,
        },
    }],
    '@stylistic/quotes': ['error', 'single'],
    'import/named': 'error',
    'import/default': 'error',
    'import/no-duplicates': 'error',
};
