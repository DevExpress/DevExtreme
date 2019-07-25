/* eslint-env node */
/* eslint-disable no-console */

var gulp = require('gulp');

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
        gulp.parallel([
            'js-bundles-debug',
            'js-bundles-prod',
            'vectormap',
            'aspnet',
            'vendor',
            'ts'
        ]),
        'style-compiler-themes',
        'style-compiler-tb-assets',
        'npm',
        'themebuilder-npm'
    ));
}

gulp.task('dev', gulp.parallel('bundler-config-dev', 'js-bundles-dev', 'style-compiler-themes-dev'));
