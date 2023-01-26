const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './entry/modules_esm.js'),
    output: {
        filename: 'bundle_esm.js',
        path: path.resolve(__dirname, './dist/dist_webpack/'),
    },
    resolve: {
        alias: {
            globalize$: path.resolve(__dirname, 'node_modules/globalize/dist/globalize.js'),
            globalize: path.resolve(__dirname, 'node_modules/globalize/dist/globalize'),
            cldr$: path.resolve(__dirname, 'node_modules/cldrjs/dist/cldr.js'),
            cldr: path.resolve(__dirname, 'node_modules/cldrjs/dist/cldr')
        },
    },
    stats: {
        errorDetails: true
    }
};
