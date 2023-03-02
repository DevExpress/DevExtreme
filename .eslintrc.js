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
