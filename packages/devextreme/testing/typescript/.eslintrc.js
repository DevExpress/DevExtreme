module.exports = {
    'overrides': [
        {
            'files': [
                '*.ts',
                '*.tsx'
            ],
            'rules': {
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-floating-promises': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off'
            }
        }
    ]
};
