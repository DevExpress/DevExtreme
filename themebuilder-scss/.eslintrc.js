/* eslint-env node */
/* eslint-disable spellcheck/spell-checker */
module.exports = {
    overrides: [
        {
            files: ['src/**/*.ts'],
            extends: ['devextreme/typescript'],
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
            rules: {
                // TODO Vinogradov: remove after eslint-config-devextreme rc2 will be released:
                'function-paren-newline': 'off',

                'import/extensions': 'off',
                'import/no-relative-packages': 'off',
                'class-methods-use-this': 'warn',
                'prefer-regex-literals': 'warn',
                '@typescript-eslint/prefer-nullish-coalescing': 'off',
                '@typescript-eslint/no-unsafe-return': 'warn',
                '@typescript-eslint/no-non-null-assertion': 'warn',
                '@typescript-eslint/member-ordering': 'warn',
                '@typescript-eslint/ban-types': 'warn',
            },
        },
        {
            files: ['tests/**/*.ts'],
            extends: ['devextreme/jest'],
            parserOptions: {
                project: './tsconfig.tests.json',
                tsconfigRootDir: __dirname,
            },
            rules: {
                'import/extensions': 'off',
                'import/no-relative-packages': 'off',
                '@typescript-eslint/prefer-nullish-coalescing': 'off',
                'jest/valid-title': 'warn',
                'jest/no-alias-methods': 'warn',
                '@typescript-eslint/no-non-null-assertion': 'warn',
            }
        },
    ],
}
