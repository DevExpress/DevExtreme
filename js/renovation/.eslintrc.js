/* eslint-env node */
/* eslint-disable spellcheck/spell-checker, import/no-commonjs */
module.exports = {
    overrides: [
        {
            files: ['*.ts?(x)'],
            parserOptions: {
                createDefaultProgram: true,
                project: '../../tsconfig.json',
                tsconfigRootDir: __dirname,
                ecmaVersion: 6,
                sourceType: 'module',
                ecmaFeatures: {
                    globalReturn: true,
                    jsx: true,
                }
            },
            extends: [
                'plugin:react/recommended',
                'plugin:jsx-a11y/recommended',
                'devextreme/typescript',
                'devextreme/renovation-declarations'
            ],
            excludedFiles: '**/__tests__/**/*',
            rules: {
                'import/extensions': 'off',
                'function-paren-newline': 'off',
                'operator-linebreak': 'warn',
                'function-call-argument-newline': 'warn',
                '@typescript-eslint/indent': [
                    'error',
                    2,
                    {
                        'SwitchCase': 1,
                        'MemberExpression': 1,
                        'CallExpression': {
                            'arguments': 1,
                        },
                        'ignoredNodes': [
                            'PropertyDefinition',
                            'JSXElement *',
                            'JSXElement'
                        ]
                    },
                ],
                '@typescript-eslint/init-declarations': 'off',
            }
        },
        {
            files: ['**/__tests__/**/*.ts?(x)', '**/test_utils/**/*.ts?(x)'],
            extends: [
                'devextreme/typescript',
                'devextreme/jest'
            ],
            rules: {
                'import/extensions': 'off',
                'jest/no-alias-methods': 'warn',
                'jest/no-conditional-expect': 'warn',
                'jest/valid-title': 'warn',
                'no-restricted-globals': 'off',
                'function-paren-newline': 'off',
                'function-call-argument-newline': 'off',

                // Disable props validation for temporary JSX components created during the tests
                'react/prop-types': ['error', { skipUndeclared: true }],

                // Allow the use of props spreading in the temporary JSX components
                'react/jsx-props-no-spreading': 'off',

                // Allow defining the widget's `accessKey` attribute
                'jsx-a11y/no-access-key': 'off',

                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-magic-numbers': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/init-declarations': 'off',

                '@typescript-eslint/indent': [
                    'error',
                    2,
                    {
                        'SwitchCase': 1,
                        'MemberExpression': 1,
                        'CallExpression': {
                            'arguments': 1,
                        },
                        'ignoredNodes': [
                            'PropertyDefinition',
                            'JSXElement *',
                            'JSXElement'
                        ]
                    },
                ],
            }
        },
        {
            files: ['*.js'],
            rules: {
                'import/no-unresolved': 'off',
            },
        }
    ]
};
