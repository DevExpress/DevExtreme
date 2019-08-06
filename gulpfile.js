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

gulp.task('parallel-build', (callback) => {
    return multiProcess(['js-bundles-debug', 'js-bundles-prod', 'style-compiler-themes'], callback, true);
});


if(process.env['DEVEXTREME_QUNIT_CI']) {
    console.warn("Using QUnit CI mode for gulp default!");
    gulp.task('default', gulp.series(
        'clean',
        'localization',
        gulp.parallel([
            'js-bundles-debug',
            'vectormap',
            'vendor'
        ]),
        'style-compiler-themes'
    ));
} else {
    gulp.task('default', gulp.series(
        'clean',
        'localization',
        'parallel-build',
        gulp.parallel([
            'vectormap',
            'aspnet',
            'vendor',
            'ts'
        ]),
        'style-compiler-tb-assets',
        'npm',
        'themebuilder-npm'
    ));
}

gulp.task('dev', gulp.parallel('bundler-config-dev', 'js-bundles-dev', 'style-compiler-themes-dev'));
