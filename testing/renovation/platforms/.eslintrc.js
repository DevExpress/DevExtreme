module.exports = {
    'overrides': [
        {
            'files': [
                '*.ts',
                '*.tsx'
            ],
            'rules': {
                'max-classes-per-file': 'off',
                '@typescript-eslint/no-floating-promises': 'off',
                '@typescript-eslint/no-extraneous-class': 'off',
                '@typescript-eslint/member-ordering': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off',
                'rules/react-in-jsx-scope': 'off',
                'import/no-extraneous-dependencies': 'off',
            }
        },
    ]
};
