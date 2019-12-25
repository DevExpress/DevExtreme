var path = require('path');
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var replace = require('gulp-replace');
var named = require('vinyl-named');
var webpack = require('webpack');
var lazyPipe = require('lazypipe');
var webpackStream = require('webpack-stream');

var webpackConfig = require('../../webpack.config.js');
var webpackConfigDev = require('../../playground/webpack.config.dev.js');
var headerPipes = require('./header-pipes.js');
var compressionPipes = require('./compression-pipes.js');
var context = require('./context.js');

var namedDebug = lazyPipe()
    .pipe(named, function(file) {
        return path.basename(file.path, path.extname(file.path)) + '.debug';
    });

var BUNDLES = [
    '/bundles/dx.all.js',
    '/bundles/dx.web.js',
    '/bundles/dx.viz.js',
    '/bundles/dx.viz-web.js'
];

var DEBUG_BUNDLES = BUNDLES.concat([
    '/bundles/dx.custom.js'
]);

var VERSION_FILE_PATH = 'core/version.js';

function processBundles(bundles) {
    return bundles.map(function(bundle) {
        return context.TRANSPILED_PATH + bundle;
    });
}

function processDevBundles(bundles) {
    return bundles.map(function(bundle) {
        return 'js' + bundle;
    });
}

function muteWebPack() {
}

gulp.task('version-replace', ['transpile'], function() {
    return gulp.src(path.join(context.TRANSPILED_PATH, VERSION_FILE_PATH), { base: './' })
        .pipe(replace('%VERSION%', context.version.script))
        .pipe(gulp.dest('./'));
});

gulp.task('js-bundles-prod', ['version-replace'], function() {
    return gulp.src(processBundles(BUNDLES))
        .pipe(named())
        .pipe(webpackStream(webpackConfig, webpack, muteWebPack))
        .pipe(headerPipes.useStrict())
        .pipe(headerPipes.bangLicense())
        .pipe(compressionPipes.minify())
        .pipe(gulp.dest(context.RESULT_JS_PATH));
});


var createDebugBundlesStream = function(watch) {
    var debugConfig, bundles;
    if(watch) {
        debugConfig = Object.assign({}, webpackConfigDev);
        bundles = processDevBundles(DEBUG_BUNDLES);
    } else {
        debugConfig = Object.assign({}, webpackConfig);
        bundles = processBundles(DEBUG_BUNDLES);
    }
    debugConfig.output = Object.assign({}, webpackConfig.output);
    debugConfig.output['pathinfo'] = true;
    if(!context.uglify) {
        debugConfig.devtool = 'eval';
    }

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
};


gulp.task('js-bundles-debug', ['version-replace'], function() {
    return createDebugBundlesStream(false);
});

gulp.task('js-bundles-dev', function() {
    return createDebugBundlesStream(true);
});
