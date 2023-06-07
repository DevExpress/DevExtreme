/* eslint-env node */
/* eslint-disable spellcheck/spell-checker, import/no-commonjs */
module.exports = {
    env: {
        es6: true,
        node: false,
    },
    plugins: [
        'simple-import-sort',
        // TODO Vinogradov: Move this plugin to this package:
        //   https://github.com/DevExpress/eslint-config-devextreme
        // This custom plugin clones the @typescript-eslint/no-restricted-imports rule
        // See issue: https://github.com/eslint/eslint/issues/14061
        'forbidden-imports',
    ],
    overrides: [
        // General TS rules.
        {
            files: [
                '**/*.ts'
            ],
            parser: '@typescript-eslint/parser',
            parserOptions: {
                createDefaultProgram: true,
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
            rules: {
                'no-restricted-globals': [
                    'warn',
                    {
                        'name': 'setTimeout',
                        'message': 'Use setTimeout only if there is absolutely no another way. If it is, ignore this rule and leave a comment why setTimeout is used here.'
                    },
                    {
                        'name': 'setInterval',
                        'message': 'Use setInterval only if there is absolutely no another way. If it is, ignore this rule and leave a comment why setInterval is used here.'
                    }
                ],
                'no-restricted-imports': 'off',
                'forbidden-imports/no-restricted-imports': [
                    'error',
                    {
                        paths: [{
                            name: '@js/core/utils/iterator',
                            message: 'Please use @dom_utils/element_wrapper_iterator or native js methods instead.',
                        }],
                        patterns: [
                            {
                                group: ['../'],
                                message: 'Please try to avoid import of modules from upper directories.',
                            }
                        ]
                    }
                ],
                '@typescript-eslint/no-restricted-imports': [
                    'error',
                    {
                        patterns: [
                            {
                                group: [
                                    '@js/ui/data_grid/*',
                                    '@js/ui/pivot_grid/*',
                                    '@js/ui/tree_list/*',
                                    '@js/ui/grid_core/*',
                                ],
                                message: 'Please use import from TS modules instead.'
                            },
                            {
                                group: [
                                    '@js/__internal/*',
                                ],
                                message: 'Please use @ts instead.'
                            }],
                    }
                ],
                'simple-import-sort/imports': 'error',
                'simple-import-sort/exports': 'error'
            }
        },
        // Rules for a new TS files.
        {
            files: [
                '**/*.ts',
            ],
            excludedFiles: '**/m_*.ts',
            parser: '@typescript-eslint/parser',
            parserOptions: {
                createDefaultProgram: true,
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
            rules: {
                'max-depth': ['error', 3],
                'no-inner-declarations': ['error', 'both'],
            },
        },
        // Rules for migrated from JS files.
        {
            files: [
                '**/m_*.ts',
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
                'array-callback-return': 'warn',
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
                'forbidden-imports/no-restricted-imports': 'warn',
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
