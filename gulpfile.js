/* eslint-env node */
/* eslint-disable no-console */

const gulp = require('gulp');
const multiProcess = require('gulp-multi-process');
const env = require('./build/gulp/env-variables');

gulp.task('clean', function(callback) {
    require('del').sync('artifacts');
    callback();
});

require('./build/gulp/bundler-config');
require('./build/gulp/transpile');
require('./build/gulp/js-bundles');
require('./build/gulp/vectormap');
require('./build/gulp/npm');
require('./build/gulp/themebuilder-npm');
require('./build/gulp/aspnet');
require('./build/gulp/vendor');
require('./build/gulp/ts');
require('./build/gulp/localization');
require('./build/gulp/style-compiler');
require('./build/gulp/generator/gulpfile');
require('./build/gulp/check_licenses');

if(!env.TEST_CI && !env.DOCKER_CI) {
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

function createMainBatch() {
    const tasks = ['js-bundles-debug'];
    if(!env.TEST_CI) {
        tasks.push('js-bundles-prod');
    }
    tasks.push('style-compiler-batch', 'misc-batch');
    return env.DOCKER_CI
        ? gulp.series(tasks)
        : (callback) => multiProcess(tasks, callback, true);
}

function createDefaultBatch() {
    const tasks = ['clean', 'localization', 'generate-components'];
    env.USE_RENOVATION && tasks.push('create-renovation-temp');
    tasks.push('version-replace', createMainBatch());
    if(!env.TEST_CI) {
        tasks.push('npm');
        tasks.push('themebuilder-npm');
        tasks.push('check-license-notices');
    }
    return gulp.series(tasks);
}

gulp.task('misc-batch', createMiscBatch());
gulp.task('style-compiler-batch', createStyleCompilerBatch());

gulp.task('default', createDefaultBatch());

gulp.task('dev', gulp.series(
    'generate-jquery-components',
    'create-renovation-temp',
    gulp.parallel('create-renovation-temp-watch', 'bundler-config-dev', 'js-bundles-dev', 'style-compiler-themes-dev', 'generate-jquery-components-watch')),
);

