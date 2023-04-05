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
                'no-restricted-imports': ['error', {
                    'paths': [
                        { 'name': 'jquery' },
                        { 'name': 'angular' },
                        { 'name': 'knockout' },
                        { 'name': 'globalize' },
                    ],
                    'patterns': ['jquery/*', 'angular/*', 'knockout/*', 'globalize/*'],
                }],
                'import/no-commonjs': 'error',
                'no-restricted-modules': ['error', { 'patterns': ['*.js'] }],
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
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
};
