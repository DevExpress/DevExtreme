// jshint node:true

"use strict";

var path = require('path');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var named = require('vinyl-named');
var webpack = require('webpack');
var lazyPipe = require('lazypipe');
var webpackStream = require('webpack-stream');

var webpackConfig = require('../../webpack.config.js');
var headerPipes = require('./header-pipes.js');
var compressionPipes = require('./compression-pipes.js');
var context = require('./context.js');

var namedDebug = lazyPipe()
    .pipe(named, function(file) {
        return path.basename(file.path, path.extname(file.path)) + '.debug';
    });

var BUNDLES = [
    'js/bundles/dx.all.js',
    'js/bundles/dx.mobile.js',
    'js/bundles/dx.web.js',
    'js/bundles/dx.viz.js',
    'js/bundles/dx.viz-web.js'
];

var DEBUG_BUNDLES = BUNDLES.concat([
    'js/bundles/dx.custom.js'
]);

function muteWebPack() {
}

gulp.task('js-bundles-prod', function() {
    return gulp.src(BUNDLES)
        .pipe(named())
        .pipe(webpackStream(webpackConfig, webpack, muteWebPack))
        .pipe(headerPipes.useStrict())
        .pipe(headerPipes.bangLicense())
        .pipe(compressionPipes.minify())
        .pipe(gulp.dest(context.RESULT_JS_PATH));
});

var createDebugBundlesStream = function(watch) {
    var debugConfig = Object.assign({}, webpackConfig);
    debugConfig.watch = watch;
    debugConfig.debug = true;
    debugConfig.output = Object.assign({}, webpackConfig.output);
    debugConfig.output['pathinfo'] = true;
    if(!context.uglify) {
        debugConfig.devtool = 'eval';
    }

    return gulp.src(DEBUG_BUNDLES)
        .pipe(namedDebug())
        .pipe(gulpIf(watch, plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })))
        .pipe(webpackStream(debugConfig, webpack, muteWebPack))
        .pipe(headerPipes.useStrict())
        .pipe(headerPipes.bangLicense())
        .pipe(gulpIf(!watch, compressionPipes.beautify()))
        .pipe(gulp.dest(context.RESULT_JS_PATH));
};


gulp.task('js-bundles-debug', ['bundler-config'], function() {
    return createDebugBundlesStream(false);
});

gulp.task('js-bundles-dev', ['bundler-config'], function() {
    return createDebugBundlesStream(true);
});
