/* eslint-disable import/no-commonjs, spellcheck/spell-checker, no-undef */
module.exports = {
    env: {
        es6: true,
        node: false
    },
    parserOptions: {
        sourceType: 'module',
        project: '../tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    rules: {
        'no-restricted-modules': [
            'error',
            {
                patterns: ['*.js']
            }
        ],
        'no-restricted-imports': [ 'error', {
            paths: [
                { 'name': 'jquery' },
                { 'name': 'angular' },
                { 'name': 'knockout' },
                { 'name': 'globalize' }
            ],
            patterns: ['jquery/*', 'angular/*', 'knockout/*', 'globalize/*']
        }]
    }
};
