/* eslint-env node */
/* eslint-disable no-console */

const gulp = require('gulp');
const multiProcess = require('gulp-multi-process');
const env = require('./build/gulp/env-variables');
const cache = require('gulp-cache');
const shell = require('gulp-shell');

gulp.task('clean', function(callback) {
    require('del').sync('artifacts');
    cache.clearAll();
    callback();
});

require('./build/gulp/bundler-config');
require('./build/gulp/transpile');
require('./build/gulp/js-bundles');
require('./build/gulp/vectormap');
require('./build/gulp/styles/themebuilder-npm');
require('./build/gulp/styles/style-compiler');
require('./build/gulp/npm');
require('./build/gulp/aspnet');
require('./build/gulp/vendor');
require('./build/gulp/ts');
require('./build/gulp/localization');
require('./build/gulp/generator/gulpfile');
require('./build/gulp/check_licenses');
require('./build/gulp/qunit-in-docker');
require('./build/gulp/renovation-testing-playground');
require('./build/gulp/renovation-npm');
require('./build/gulp/systemjs');

if(!env.TEST_CI) {
    require('./build/gulp/create_timezones_data');
    require('./build/gulp/test_timezones_data');
}

if(env.TEST_CI) {
    console.warn('Using test CI mode!');
}

function createStyleCompilerBatch() {
    return gulp.series(env.TEST_CI
        ? ['style-compiler-themes-ci']
        : ['style-compiler-themes']
    );
}

function createMiscBatch() {
    const tasks = ['vectormap', 'vendor'];
    if(!env.TEST_CI) {
        tasks.push('aspnet', 'ts');
    }
    return gulp.parallel(tasks);
}

function createMainBatch(dev) {
    const tasks = [];
    if(!dev && !env.BUILD_TESTCAFE) {
        tasks.push('js-bundles-debug');
    }
    if(!env.TEST_CI || env.BUILD_TESTCAFE) {
        tasks.push('js-bundles-prod');
    }
    tasks.push('style-compiler-batch', 'misc-batch');
    return (callback) => multiProcess(tasks, callback, true);
}

function createDefaultBatch(dev) {
    const tasks = dev ? [] : ['clean'];
    tasks.push('localization');
    tasks.push(dev ? 'generate-components-dev' : 'generate-components');
    tasks.push('transpile');
    tasks.push('version-replace');
    tasks.push(dev && !env.BUILD_TESTCAFE ? 'main-batch-dev' : 'main-batch');
    if(!env.TEST_CI && !dev && !env.BUILD_TESTCAFE) {
        tasks.push('npm');
        if(!env.SKIP_THEMEBUILDER) {
            tasks.push('themebuilder-npm');
        }
        tasks.push('check-license-notices');
    }
    if(!env.BUILD_TESTCAFE) {
        tasks.push('discover-declarations');
    }
    tasks.push('transpile-systemjs');
    return gulp.series(tasks);
}

gulp.task('discover-declarations', shell.task('npm run discover-declarations'));
gulp.task('misc-batch', createMiscBatch());
gulp.task('style-compiler-batch', createStyleCompilerBatch());
gulp.task('main-batch', createMainBatch(false));
gulp.task('main-batch-dev', createMainBatch(true));

gulp.task('default', createDefaultBatch());
gulp.task('default-dev', createDefaultBatch(true));

gulp.task('test-env', shell.task('node ./testing/launch'));

gulp.task('dev-watch', gulp.parallel(
    'generate-jquery-components-watch',
    'generate-inferno-components-watch',
    'transpile-watch',
    'renovated-components-watch',
    'bundler-config-watch',
    'js-bundles-watch',
    'style-compiler-themes-watch',
    'test-env',
    'compile-ts-watch'
));

gulp.task('dev', gulp.series(
    'default-dev',
    'dev-watch'
));


