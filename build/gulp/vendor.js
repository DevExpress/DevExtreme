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
            './node_modules/jquery/dist/jquery?(.min).js',
            './node_modules/jszip/dist/jszip?(.min).js',
            './node_modules/knockout/build/output/knockout-latest?(.debug).js'
        ]).pipe(gulp.dest('artifacts/js'))
    );
});
