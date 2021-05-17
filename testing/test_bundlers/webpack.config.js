module.exports = {
    mode: 'production',
    entry: './testing/test_bundlers/src/index.js',
    output: {
        filename: './artifacts/test_bundlers/dist_webpack/main.js',
    },
    resolve: {
        modules: ['./artifacts/npm/devextreme', 'node_modules'],
        alias: {
            globalize$: ('node_modules/globalize/dist/globalize.js'),
            globalize: ('node_modules/globalize/dist/globalize'),
            cldr$: ('node_modules/cldrjs/dist/cldr.js'),
            cldr: ('node_modules/cldrjs/dist/cldr')
        },
    },
};
