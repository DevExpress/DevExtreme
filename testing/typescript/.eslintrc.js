/* eslint-env node */
/* eslint-disable spellcheck/spell-checker */
module.exports = {
    overrides: [
        {
            files: [ '*.ts' ],
            parserOptions: {
                createDefaultProgram: true,
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
            rules: {
                'import/no-relative-packages': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-floating-promises': 'off',
                '@typescript-eslint/no-unused-vars': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/explicit-module-boundary-types': 'off'
            }
        }
    ]
};
