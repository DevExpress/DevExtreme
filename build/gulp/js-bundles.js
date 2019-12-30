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

gulp.task('js-bundles-prod', gulp.series('version-replace', function() {
    return gulp.src(processBundles(BUNDLES))
        .pipe(named())
        .pipe(webpackStream(webpackConfig, webpack, muteWebPack))
        .pipe(headerPipes.useStrict())
        .pipe(headerPipes.bangLicense())
        .pipe(compressionPipes.minify())
        .pipe(gulp.dest(context.RESULT_JS_PATH));
}));


const createDebugBundlesStream = function(watch) {
    let debugConfig; let bundles;
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


gulp.task('js-bundles-debug', gulp.series('version-replace', function() {
    return createDebugBundlesStream(false);
}));

gulp.task('js-bundles-dev', function() {
    return createDebugBundlesStream(true);
});
