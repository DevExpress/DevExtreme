const path = require('path');

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, './src/modules_esm.js'),
    output: {
        filename: 'bundle_esm.js',
        path: path.resolve(__dirname, './dist/dist_webpack/'),
    },
    resolve: {
        modules: ['node_modules'],
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
