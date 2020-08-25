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
const utils = require('./utils');
const env = require('./env-variables');

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

const bundleProdPipe = lazyPipe()
    .pipe(named)
    .pipe(() => webpackStream(webpackConfig, webpack, muteWebPack))
    .pipe(headerPipes.useStrict)
    .pipe(headerPipes.bangLicense)
    .pipe(compressionPipes.minify);

gulp.task('js-bundles-prod-renovation', function() {
    return gulp.src(processBundles(BUNDLES, context.TRANSPILED_PROD_RENOVATION_PATH))
        .pipe(bundleProdPipe())
        .pipe(gulp.dest(context.RESULT_JS_RENOVATION_PATH));
});

gulp.task('js-bundles-prod', function() {
    return gulp.src(processBundles(BUNDLES, context.TRANSPILED_PROD_PATH))
        .pipe(bundleProdPipe())
        .pipe(gulp.dest(context.RESULT_JS_PATH));
});

function prepareDebugMeta(watch, renovation) {
    let debugConfig;
    let bundles;
    if(watch) {
        debugConfig = Object.assign({}, webpackConfigDev);
        bundles = processBundles(DEBUG_BUNDLES, renovation ? renovationPipes.TEMP_PATH : 'js');
    } else {
        debugConfig = Object.assign({}, webpackConfig);
        bundles = processBundles(DEBUG_BUNDLES, renovation ? context.TRANSPILED_PROD_RENOVATION_PATH : context.TRANSPILED_PROD_PATH);
    }
    debugConfig.output = Object.assign({}, webpackConfig.output);
    debugConfig.output['pathinfo'] = true;
    if(!context.uglify) {
        debugConfig.devtool = 'eval-source-map';
    }

    return { debugConfig, bundles };
}

function createDebugBundlesStream(watch, renovation) {
    const { debugConfig, bundles } = prepareDebugMeta(watch, renovation);
    const destination = renovation
        ? context.RESULT_JS_RENOVATION_PATH
        : context.RESULT_JS_PATH;

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
        .pipe(gulp.dest(destination));
}

gulp.task('create-renovation-temp', utils.runTaskByCondition(env.RUN_RENOVATION_TASK, function() {
    return gulp.src(['js/**/*.*'])
        .pipe(renovationPipes.replaceWidgets())
        .pipe(gulp.dest(renovationPipes.TEMP_PATH));
}));

gulp.task('js-bundles-debug', gulp.series(function() {
    return createDebugBundlesStream(false, false);
}, utils.runTaskByCondition(env.RUN_RENOVATION_TASK, function() {
    return createDebugBundlesStream(false, true);
})));

gulp.task('js-bundles-dev', gulp.parallel(function() {
    return createDebugBundlesStream(true, false);
}, utils.runTaskByCondition(env.RUN_RENOVATION_TASK, function() {
    return createDebugBundlesStream(true, true);
})));
