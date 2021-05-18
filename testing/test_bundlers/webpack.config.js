/* global  __dirname */
const path = require('path');

module.exports = {
    // mode: 'development',
    entry: path.resolve(__dirname, '../../testing/test_bundlers/src/index.js'),
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, '../../artifacts/test_bundlers/dist_webpack/'),
    },
    resolve: {
        modules: ['./artifacts/npm/devextreme', 'node_modules'],
        alias: {
            globalize$: path.resolve(__dirname, '../../node_modules/globalize/dist/globalize.js'),
            globalize: path.resolve(__dirname, '../../node_modules/globalize/dist/globalize'),
            cldr$: path.resolve(__dirname, '../../node_modules/cldrjs/dist/cldr.js'),
            cldr: path.resolve(__dirname, '../../node_modules/cldrjs/dist/cldr')
        },
    },
};
