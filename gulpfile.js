/* eslint-env node */
/* eslint-disable no-console */

var gulp = require('gulp');
var os = require('os');
var runSequence = require('run-sequence');

if(os.cpus().length >= 4 && !process.env['DEVEXTREME_DOCKER_CI']) {
    require('gulp-ll').tasks(['js-bundles-debug', 'js-bundles-prod']);
}

gulp.task('clean', function(callback) {
    require('del').sync('artifacts');
    callback();
});

require('./build/gulp/bundler-config');
require('./build/gulp/js-bundles');
require('./build/gulp/vectormap');
require('./build/gulp/npm');
require('./build/gulp/themebuilder-npm');
require('./build/gulp/aspnet');
require('./build/gulp/vendor');
require('./build/gulp/ts');
require('./build/gulp/localization');
require('./build/gulp/style-compiler');
require('./build/gulp/transpile');


function gulpDefault(callback) {
    runSequence(
        'clean',
        'localization',
        [
            'js-bundles-debug',
            'js-bundles-prod',
            'vectormap',
            'aspnet',
            'vendor',
            'ts'
        ],
        'style-compiler-themes',
        'style-compiler-tb-assets',
        'npm',
        'themebuilder-npm',
        'style-compiler-generic-legacy',
        callback);
}

function gulpDefault_QUnitCI(callback) {
    runSequence(
        'clean',
        'localization',
        [
            'js-bundles-debug',
            'vectormap',
            'vendor'
        ],
        'style-compiler-themes',
        callback);
}

if(process.env['DEVEXTREME_QUNIT_CI']) {
    console.warn('Using QUnit CI mode for gulp default!');
    gulp.task('default', gulpDefault_QUnitCI);
} else {
    gulp.task('default', gulpDefault);
}

gulp.task('dev', function(callback) {
    runSequence('bundler-config-dev', ['js-bundles-dev', 'style-compiler-themes-dev'], callback);
});
