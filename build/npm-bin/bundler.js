#!/usr/bin/env node

const path = require('path');
const webpack = require('webpack');
const webpackVersion = require('webpack/package.json').version;

const outputDir = process.cwd();
const sourcesDir = path.join(__dirname, '..');
let bundle = process.argv.length > 2 ? process.argv[2] : 'dx.custom';

bundle = bundle.replace(/.config.js$/, '');

const baseConfig = require('./webpack.config.js');
const createConfig = function(outputFile, mode) {
    const config = Object.assign({}, baseConfig);

    if(webpackVersion.split('.')[0] >= 4) {
        config.mode = mode;
    } else if(mode === 'production') {
        config.plugins = (config.plugins || []).concat([
            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false }
            })
        ]);
    }
    config.context = process.cwd();
    config.entry = './' + bundle + '.config.js';
    config.output = {
        path: outputDir,
        filename: outputFile
    };

    config.resolve = {
        alias: {
            'devextreme': sourcesDir
        }
    };

    return config;
};

console.log('bundling using \'' + bundle + '.config.js\'...');
webpack([
    createConfig(bundle + '.debug.js', 'development'),
    createConfig(bundle + '.js', 'production')
], function(err, stats) {
    if(err) {
        throw err;
    }

    const jsonStats = stats.toJson();
    if(jsonStats.errors.length) {
        console.log('\'' + bundle + '\' bundles creation failed!\n\n' + jsonStats.errors.join('\n\n'));
    } else {
        console.log('\'' + bundle + '\' bundles created!');
    }
});
