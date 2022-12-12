'use strict';

import gulp from 'gulp';
import lazyPipe from 'lazypipe';
import named from 'vinyl-named';
import path from 'path';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import transpileConfig from './transpile-config.mjs';


const webpackConfig = {
    stats: 'verbose',
    module: {
        rules: [
            {
                test: /\.jsx$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: transpileConfig.esm
                    }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.m?js$/,
                type: "javascript/auto",
            },
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false,
                },
            },
            {
                test: /\.(sc|c|sa)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
        ]
    },
    mode: 'production',
    output: {
        sourcePrefix: '    ',
        devtoolModuleFilenameTemplate: 'devextreme:///[resource-path]',
        devtoolFallbackModuleFilenameTemplate: 'devextreme:///[resource-path]?[hash]'
    },
    resolve: {
        extensions: [ '.js', '.jsx' ],
        mainFields: ['browser', 'main'],
        alias: {}
    }
}
const namedDebug = lazyPipe()
    .pipe(named, (file) => path.basename(file.path, path.extname(file.path)) + '.debug');

const BUNDLES = [
    '/bundle.js',
];

const DEBUG_BUNDLES = BUNDLES;

const processBundles = (bundles, pathPrefix) => bundles.map((bundle) => pathPrefix + bundle);
const muteWebPack = () => undefined;

function prepareDebugMeta() {
    const debugConfig = { ...webpackConfig };
    const bundlesPath = './src';

    const bundles = processBundles(DEBUG_BUNDLES, bundlesPath);

    debugConfig.output = Object.assign({}, webpackConfig.output);
    debugConfig.output['pathinfo'] = true;
    debugConfig.mode = "development";
    return { debugConfig, bundles };
}

function createDebugBundlesStream(displayName) {
    const { debugConfig, bundles } = prepareDebugMeta();
    const destination = './lib';

    const task = () => gulp.src(bundles)
        .pipe(namedDebug())
        .pipe(webpackStream(debugConfig, webpack, muteWebPack))
        .pipe(gulp.dest(destination));

    task.displayName = `${displayName}-worker`;

    return task;
}

gulp.task('js-bundles-debug', gulp.series(
    createDebugBundlesStream('js-bundles-debug')
));
