/* eslint-env node */
/* eslint-disable no-console */

const gulp = require('gulp');
const multiProcess = require('gulp-multi-process');

gulp.task('clean', function(callback) {
    require('del').sync('artifacts');
    callback();
});

require('./build/gulp/bundler-config');
require('./build/gulp/transpile');
require('./build/gulp/js-bundles');
require('./build/gulp/vectormap');
require('./build/gulp/npm');
require('./build/gulp/renovation-npm');
require('./build/gulp/themebuilder-npm');
require('./build/gulp/aspnet');
require('./build/gulp/vendor');
require('./build/gulp/ts');
require('./build/gulp/localization');
require('./build/gulp/style-compiler');
require('./build/gulp/generator/gulpfile');

const TEST_CI = Boolean(process.env['DEVEXTREME_TEST_CI']);
const DOCKER_CI = Boolean(process.env['DEVEXTREME_DOCKER_CI']);

if(TEST_CI) {
    console.warn('Using test CI mode!');
}

function createStyleCompilerBatch() {
    return gulp.series(TEST_CI
        ? ['style-compiler-themes-ci']
        : ['style-compiler-themes']
    );
}

function createMiscBatch() {
    const tasks = ['vectormap', 'vendor'];
    if(!TEST_CI) {
        tasks.push('aspnet', 'ts');
    }
    return gulp.parallel(tasks);
}

function createMainBatch() {
    const tasks = ['js-bundles-debug'];
    if(!TEST_CI) {
        tasks.push('js-bundles-prod', 'js-bundles-prod-renovation');
    }
    tasks.push('style-compiler-batch', 'misc-batch');
    return DOCKER_CI
        ? gulp.series(tasks)
        : (callback) => multiProcess(tasks, callback, true);
}

function createDefaultBatch() {
    const tasks = ['clean', 'localization', 'generate-components', 'create-renovation-temp', 'version-replace', createMainBatch()];
    if(!TEST_CI) {
        tasks.push('npm', 'renovation-npm', 'themebuilder-npm');
    }
    return gulp.series(tasks);
}

gulp.task('misc-batch', createMiscBatch());
gulp.task('style-compiler-batch', createStyleCompilerBatch());

gulp.task('default', createDefaultBatch());

gulp.task('dev', gulp.series(
    'generate-jquery-components',
    'create-renovation-temp',
    gulp.parallel('bundler-config-dev', 'js-bundles-dev', 'style-compiler-themes-dev', 'generate-jquery-components-watch')),
);

