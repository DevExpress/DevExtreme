'use strict';

const path = require('path');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const named = require('vinyl-named');
const webpack = require('webpack');
const lazyPipe = require('lazypipe');
const webpackStream = require('webpack-stream');

const webpackConfig = require('../../webpack.config.js');
const webpackConfigDev = require('../../webpack.config.dev.js');
const headerPipes = require('./header-pipes.js');
const compressionPipes = require('./compression-pipes.js');
const renovationPipes = require('./renovation-pipes');
const context = require('./context.js');

const namedDebug = lazyPipe()
    .pipe(named, function(file) {
        return path.basename(file.path, path.extname(file.path)) + '.debug';
    });

const BUNDLES = [
    '/bundles/dx.all.js',
    '/bundles/dx.web.js',
    '/bundles/dx.viz.js',
    '/bundles/dx.viz-web.js'
];

const DEBUG_BUNDLES = BUNDLES.concat([
    '/bundles/dx.custom.js'
]);

function processBundles(bundles, pathPrefix) {
    return bundles.map(function(bundle) {
        return pathPrefix + bundle;
    });
}

function muteWebPack() {
}

gulp.task('js-bundles-prod-renovation', gulp.series('version-replace', function() {
    return gulp.src(processBundles(BUNDLES, context.TRANSPILED_PROD_RENOVATION_PATH))
        .pipe(named())
        .pipe(webpackStream(webpackConfig, webpack, muteWebPack))
        .pipe(headerPipes.useStrict())
        .pipe(headerPipes.bangLicense())
        .pipe(compressionPipes.minify())
        .pipe(gulp.dest(context.RESULT_JS_RENOVATION_PATH));
}));

gulp.task('js-bundles-prod', gulp.series('version-replace', function() {
    return gulp.src(processBundles(BUNDLES, context.TRANSPILED_PROD_PATH))
        .pipe(named())
        .pipe(webpackStream(webpackConfig, webpack, muteWebPack))
        .pipe(headerPipes.useStrict())
        .pipe(headerPipes.bangLicense())
        .pipe(compressionPipes.minify())
        .pipe(gulp.dest(context.RESULT_JS_PATH));
}));

function prepareDebugMeta(watch) {
    let debugConfig;
    let bundles;
    if(watch) {
        debugConfig = Object.assign({}, webpackConfigDev);
        bundles = processBundles(DEBUG_BUNDLES, 'js');
    } else {
        debugConfig = Object.assign({}, webpackConfig);
        bundles = processBundles(DEBUG_BUNDLES, context.TRANSPILED_PROD_PATH);
    }
    debugConfig.output = Object.assign({}, webpackConfig.output);
    debugConfig.output['pathinfo'] = true;
    if(!context.uglify) {
        debugConfig.devtool = 'eval-source-map';
    }

    return { debugConfig, bundles };
}

function createDebugBundlesStream(watch) {
    const { debugConfig, bundles } = prepareDebugMeta(watch);

    return gulp.src(bundles)
        .pipe(namedDebug())
        .pipe(gulpIf(watch, plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
                .bind() // bind call is necessary to prevent firing 'end' event in notify.onError implementation
        })))
        .pipe(webpackStream(debugConfig, webpack, muteWebPack))
        .pipe(headerPipes.useStrict())
        .pipe(headerPipes.bangLicense())
        .pipe(gulpIf(!watch, compressionPipes.beautify()))
        .pipe(gulp.dest(context.RESULT_JS_PATH));
}

function createDebugBundlesStreamRenovation(watch) {
    const { debugConfig } = prepareDebugMeta(watch);

    return gulp.src(processBundles(DEBUG_BUNDLES, renovationPipes.tempFolder))
        .pipe(namedDebug())
        .pipe(gulpIf(watch, plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
                .bind() // bind call is necessary to prevent firing 'end' event in notify.onError implementation
        })))
        .pipe(webpackStream(debugConfig, webpack, muteWebPack))
        .pipe(headerPipes.useStrict())
        .pipe(headerPipes.bangLicense())
        .pipe(gulpIf(!watch, compressionPipes.beautify()))
        .pipe(gulp.dest(context.RESULT_JS_RENOVATION_PATH));
}

gulp.task('js-bundles-debug', gulp.series('version-replace', function() {
    return createDebugBundlesStream(false);
}));

const SRC = ['js/**/*.*'];

gulp.task('js-bundles-dev', gulp.parallel(function() {
    return createDebugBundlesStream(true);
}, gulp.series(function() {
    return gulp.src(SRC)
        .pipe(renovationPipes.replaceWidgets())
        .pipe(gulp.dest(renovationPipes.tempFolder));
}, function() {
    return createDebugBundlesStreamRenovation(true);
})));
