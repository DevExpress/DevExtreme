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
require('./build/gulp/themebuilder-npm');
require('./build/gulp/aspnet');
require('./build/gulp/vendor');
require('./build/gulp/ts');
require('./build/gulp/localization');
require('./build/gulp/style-compiler');

let styleTasks = ['style-compiler-themes', 'style-compiler-tb-assets'];
let commonTasks = ['vectormap', 'aspnet', 'vendor', 'ts'];
let parallelTasks = ['js-bundles-debug', 'js-bundles-prod', 'style-processing', 'common'];

if(process.env['DEVEXTREME_QUNIT_CI']) {
    console.warn("Using QUnit CI mode for gulp default!");
    commonTasks = ['vectormap', 'vendor'];
    styleTasks = ['style-compiler-themes'];
    parallelTasks = ['js-bundles-debug', 'style-processing', 'common'];
}

gulp.task('common', gulp.parallel.apply(gulp, commonTasks));
gulp.task('style-processing', gulp.parallel.apply(gulp, styleTasks));

gulp.task('parallel-build',
    process.env['DEVEXTREME_DOCKER_CI'] ?
        gulp.parallel.apply(gulp, parallelTasks) :
        (callback) => multiProcess(parallelTasks, callback, true));


gulp.task('default', gulp.series(
    'clean',
    'localization',
    'parallel-build',
    'npm',
    'themebuilder-npm'
));

gulp.task('dev', gulp.parallel('bundler-config-dev', 'js-bundles-dev', 'style-compiler-themes-dev'));
