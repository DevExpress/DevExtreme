/* eslint-env node */
/* eslint-disable spellcheck/spell-checker, import/no-commonjs */
module.exports = {
    env: {
        es6: true,
        node: false,
    },
    overrides: [
        {
            files: [
                '**/[!module]*.ts',
            ],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                createDefaultProgram: true,
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
            rules: {
                'complexity': ['error', 3],
                'no-inner-declarations': ['error', 'both'],
            },
        },
        {
            files: [
                '**/module*.ts',
                '**/module*/**.ts',
            ],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                createDefaultProgram: true,
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
            rules: {
                'no-self-compare': 'warn',
                'no-multi-assign': 'warn',
                'no-param-reassign': 'warn',
                'no-underscore-dangle': 'off',
                'no-mixed-operators': 'warn',
                'no-nested-ternary': 'warn',
                'no-bitwise': 'warn',
                'no-plusplus': 'warn',
                'no-continue': 'warn',
                'prefer-spread': 'warn',
                'prefer-rest-params': 'warn',
                'max-len': 'warn',
                'consistent-return': 'warn',
                '@typescript-eslint/explicit-function-return-type': 'warn',
                '@typescript-eslint/init-declarations': 'warn',
                '@typescript-eslint/no-unsafe-return': 'warn',
                '@typescript-eslint/no-invalid-this': 'warn',
                '@typescript-eslint/no-explicit-any': 'warn',
                '@typescript-eslint/restrict-plus-operands': 'warn',
                '@typescript-eslint/no-use-before-define': 'warn',
                '@typescript-eslint/no-unused-expressions': 'warn',
                '@typescript-eslint/prefer-optional-chain': 'warn',
                '@typescript-eslint/no-this-alias': 'warn',
                '@typescript-eslint/no-non-null-assertion': 'warn',
                '@typescript-eslint/explicit-module-boundary-types': 'warn',
                '@typescript-eslint/no-shadow': 'warn',
                '@typescript-eslint/no-floating-promises': 'warn',
                '@typescript-eslint/no-implied-eval': 'warn',
                '@typescript-eslint/ban-ts-comment': 'warn',
                '@typescript-eslint/prefer-for-of': 'warn',
                '@typescript-eslint/no-restricted-imports': 'warn',
            }
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
