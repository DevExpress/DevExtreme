#!/usr/bin/env node
'use strict';

const path = require('path');
const webpack = require('webpack');

const outputDir = process.cwd();
const sourcesDir = path.join(__dirname, '..');
let bundle = process.argv.length > 2 ? process.argv[2] : 'dx.custom';

bundle = bundle.replace(/.config.js$/, '');

const baseConfig = require('./webpack.config.js'); // eslint-disable-line node/no-missing-require
const createConfig = function(outputFile, mode) {
    const config = Object.assign({}, baseConfig);

    config.mode = mode;
    config.context = process.cwd();
    config.entry = './' + bundle + '.config.js';
    config.output = {
        path: outputDir,
        filename: outputFile
    };

    config.resolve = {
        alias: {
            'devextreme': sourcesDir,
            '../../events/index': path.resolve(sourcesDir, 'cjs/events/index.js'),
            '../../common/core/events/utils/index': path.resolve(sourcesDir, 'cjs/common/core/events.js')
        },
        mainFields: ['main']
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
        const errorMessages = jsonStats.errors.map(({ message }) => message);
        console.log('\'' + bundle + '\' bundles creation failed!\n\n' + errorMessages.join('\n\n'));
    } else {
        console.log('\'' + bundle + '\' bundles created!');
    }
});
