/* eslint-env node */
/* eslint-disable spellcheck/spell-checker */
module.exports = {
    env: {
        node: true,
    },
    overrides: [
        {
            files: ['*.js'],
            rules: {
                'import/no-unresolved': 'off',
            },
        },
    ],
};
