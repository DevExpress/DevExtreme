// jshint node:true

"use strict";

var gulp = require('gulp');
var merge = require('merge-stream');

gulp.task('vendor', function() {
    return merge(
        gulp.src([
            './node_modules/angular/angular?(.min).js',
            './vendor/cldr/**',
            './vendor/globalize/**',
            './vendor/jquery/*',
            './vendor/jszip/*',
            './node_modules/knockout/build/output/knockout-latest?(.debug).js'
        ]).pipe(gulp.dest('artifacts/js'))
    );
});
