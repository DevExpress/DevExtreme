module.exports = {
    overrides: [
        {
            files: [
                '*.ts',
                '*.tsx'
            ],
            extends: [
                'plugin:react/recommended',
                'plugin:jsx-a11y/recommended',
            ],
            rules: {
                'max-classes-per-file': 'off',
                '@typescript-eslint/no-floating-promises': 'off',
                '@typescript-eslint/no-extraneous-class': 'off',
                '@typescript-eslint/member-ordering': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                '@typescript-eslint/method-signature-style': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                'rules/react-in-jsx-scope': 'off',
                'import/no-extraneous-dependencies': 'off',
                'import/extensions': 'off',
            }
        },
    ]
};
