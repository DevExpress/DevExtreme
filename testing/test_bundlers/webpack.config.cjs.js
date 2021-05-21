/* global  __dirname */
const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, '../../testing/test_bundlers/src/import_modules_cjs.js'),
    output: {
        filename: 'modules_cjs.js',
        path: path.resolve(__dirname, '../../artifacts/test_bundlers/dist_webpack/'),
    },
    resolve: {
        modules: [ path.resolve(__dirname, 'node_modules/devextreme'), 'node_modules'],
        alias: {
            globalize$: path.resolve(__dirname, 'node_modules/globalize/dist/globalize.js'),
            globalize: path.resolve(__dirname, 'node_modules/globalize/dist/globalize'),
            cldr$: path.resolve(__dirname, 'node_modules/cldrjs/dist/cldr.js'),
            cldr: path.resolve(__dirname, 'node_modules/cldrjs/dist/cldr')
        },
    },
};
