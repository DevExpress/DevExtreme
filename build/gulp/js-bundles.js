'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const lazyPipe = require('lazypipe');
const named = require('vinyl-named');
const notify = require('gulp-notify');
const path = require('path');
const plumber = require('gulp-plumber');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const log = require('fancy-log');

const compressionPipes = require('./compression-pipes.js');
const ctx = require('./context.js');
const headerPipes = require('./header-pipes.js');
const webpackConfig = require('../../webpack.config.js');

const namedDebug = lazyPipe()
    .pipe(named, (file) => path.basename(file.path, path.extname(file.path)) + '.debug');

const BUNDLES = [
    '/bundles/dx.all.js',
    '/bundles/dx.web.js',
    '/bundles/dx.viz.js'
];

const DEBUG_BUNDLES = BUNDLES.concat([ '/bundles/dx.custom.js' ]);

const processBundles = (bundles, pathPrefix) => bundles.map((bundle) => pathPrefix + bundle);
const muteWebPack = () => undefined;

const bundleProdPipe = lazyPipe()
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
);

function prepareDebugMeta(watch) {
    const debugConfig = Object.assign({ watch }, webpackConfig);
    const bundlesPath = ctx.TRANSPILED_PROD_RENOVATION_PATH;

    const bundles = processBundles(DEBUG_BUNDLES, bundlesPath);

    debugConfig.output = Object.assign({}, webpackConfig.output);
    debugConfig.output['pathinfo'] = true;
    debugConfig.mode = watch ? "development" : "production";

    if(!ctx.uglify) {
        debugConfig.devtool = 'eval-source-map';
    }

    return { debugConfig, bundles };
}

function createDebugBundlesStream(watch, displayName) {
    const { debugConfig, bundles } = prepareDebugMeta(watch);
    const destination = ctx.RESULT_JS_PATH;

    const task = () => gulp.src(bundles)
        .pipe(namedDebug())
        .on('end', ()=>log('.pipe(namedDebug())'))
        .pipe(gulpIf(watch, plumber({
            errorHandler: notify.onError('Error: <%= error.message %>').bind() // bind call is necessary to prevent firing 'end' event in notify.onError implementation
        })))
        .on('end', ()=>log('.pipe(gulpIf(watch, plumber({'))
        .pipe(webpackStream(debugConfig, webpack, muteWebPack))
        .on('end', ()=>log('.pipe(webpackStream(debugConfig, webpack, muteWebPack))'))
        .pipe(headerPipes.useStrict())
        .on('end', ()=>log('.pipe(headerPipes.useStrict())'))
        .pipe(headerPipes.bangLicense())
        .on('end', ()=>log('.pipe(headerPipes.bangLicense())'))
        .pipe(gulpIf(!watch, compressionPipes.beautify()))
        .on('end', ()=>log('.pipe(gulpIf(!watch, compressionPipes.beautify()))'))
        .pipe(gulp.dest(destination))
        .on('end', ()=>log('.pipe(gulp.dest(destination))'));

    task.displayName = `${displayName}-worker`;

    return task;
}

gulp.task('js-bundles-debug', gulp.series(
    createDebugBundlesStream(false, 'js-bundles-debug')
));

gulp.task('js-bundles-watch', gulp.parallel(
    createDebugBundlesStream(true, 'js-bundles-watch')
));
