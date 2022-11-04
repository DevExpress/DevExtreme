'use strict';

import gulp from 'gulp';
// const gulpIf from 'gulp-if');
import lazyPipe from 'lazypipe';
import named from 'vinyl-named';
// const notify from 'gulp-notify');
import path from 'path';
// const plumber from 'gulp-plumber');
import webpack from 'webpack';
import webpackStream from 'webpack-stream';

// const compressionPipes = require('./compression-pipes.js');
// const ctx = require('./context.js');

// const headerPipes = require('./header-pipes.js');
// const webpackConfig = require('../../webpack.config.js');
const webpackConfig = {
    module: {
        rules: [{
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
                //'scoped-css-loader',
                'sass-loader',
            ],
        },
        ]
    },
    mode: 'production',
    // optimization: {
    //     // eslint-disable-next-line spellcheck/spell-checker
    //     minimizer: [new TerserPlugin({
    //         extractComments: false,
    //     })],
    // },
    output: {
        sourcePrefix: '    ',
        devtoolModuleFilenameTemplate: 'devextreme:///[resource-path]',
        devtoolFallbackModuleFilenameTemplate: 'devextreme:///[resource-path]?[hash]'
    },
    resolve: {
        mainFields: ['browser', 'main'],
        alias: {
            "rxjs": path.resolve('./node_modules/rxjs'),
            "@dx/core/components/pager": path.resolve('./node_modules/@dx/core/components/pager/index.mjs'),
            // "@devextreme/runtime/inferno-hooks":path.resolve('./node_modules/@devextreme/runtime/cjs/inferno-hooks/index.js'),
            // "inferno": path.resolve('./node_modules/inferno/dist/index.cjs.js')
        }
    }
}
const namedDebug = lazyPipe()
    .pipe(named, (file) => path.basename(file.path, path.extname(file.path)) + '.debug');

const BUNDLES = [
    '/bundle.js',
    // '/bundles/dx.web.js',
    // '/bundles/dx.viz.js'
];

const DEBUG_BUNDLES = BUNDLES;// .concat([ '/bundles/dx.custom.js' ]);

const processBundles = (bundles, pathPrefix) => bundles.map((bundle) => pathPrefix + bundle);
const muteWebPack = () => undefined;

/*const bundleProdPipe = lazyPipe()
    .pipe(named)
    .pipe(() => webpackStream(webpackConfig, webpack, muteWebPack))
    .pipe(headerPipes.useStrict)
    .pipe(headerPipes.bangLicense)
    .pipe(compressionPipes.minify);

const jsBundlesProd = (src, dist, bundles) => (() =>
    gulp.src(processBundles(bundles, src))
        .pipe(bundleProdPipe())
        .pipe(gulp.dest(dist))
);

gulp.task('js-bundles-prod',
    jsBundlesProd(ctx.TRANSPILED_PROD_RENOVATION_PATH,
        ctx.RESULT_JS_PATH, BUNDLES
    )
);*/

function prepareDebugMeta(watch) {
    const debugConfig = Object.assign({ watch }, webpackConfig);
    const bundlesPath = './src';//ctx.TRANSPILED_PROD_RENOVATION_PATH;

    const bundles = processBundles(DEBUG_BUNDLES, bundlesPath);

    debugConfig.output = Object.assign({}, webpackConfig.output);
    debugConfig.output['pathinfo'] = true;
    debugConfig.mode = "development" //watch ? "development" : "production";
    // debugConfig.optimization.minimize = false;

    // if(!ctx.uglify) {
    //     debugConfig.devtool = 'eval-source-map';
    // }

    return { debugConfig, bundles };
}

function createDebugBundlesStream(watch, displayName) {
    const { debugConfig, bundles } = prepareDebugMeta(watch);
    const destination = './dest';

    const task = () => gulp.src('./src/**/*.*')
        .pipe(namedDebug())
        // .pipe(gulpIf(watch, plumber({
        //     errorHandler: notify.onError('Error: <%= error.message %>')
        //         .bind() // bind call is necessary to prevent firing 'end' event in notify.onError implementation
        // })))
        .pipe(webpackStream(debugConfig, webpack, muteWebPack))
        //.pipe(headerPipes.useStrict())
        //.pipe(headerPipes.bangLicense())
        //.pipe(gulpIf(!watch, compressionPipes.beautify()))
        .pipe(gulp.dest(destination));

    task.displayName = `${displayName}-worker`;

    return task;
}

gulp.task('js-bundles-debug', gulp.series(
    createDebugBundlesStream(false, 'js-bundles-debug')
));

gulp.task('js-bundles-watch', gulp.parallel(
    createDebugBundlesStream(true, 'js-bundles-watch')
));
