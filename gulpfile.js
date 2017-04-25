// jshint node:true

"use strict";

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
require('./build/gulp/legacy-exporter');
require('./build/gulp/vectormap');
require('./build/gulp/npm');
require('./build/gulp/aspnet');
require('./build/gulp/vendor');
require('./build/gulp/ts');
require('./build/gulp/layouts');
require('./build/gulp/localization');
require('./build/gulp/style-compiler');


gulp.task('default', function(callback) {
    runSequence(
        'clean',
        [
            'js-bundles-debug',
            'js-bundles-prod',
            'legacy-exporter',
            'vectormap',
            'aspnet',
            'vendor',
            'ts',
            'layouts',
            'localization'
        ],
        'style-compiler-themes',
        'npm',
        'style-compiler-generic-legacy',
        callback);
});

gulp.task('dev', ['bundler-config-dev', 'js-bundles-dev']);
