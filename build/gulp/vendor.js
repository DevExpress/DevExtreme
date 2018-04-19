// jshint node:true

"use strict";

var gulp = require('gulp');
var merge = require('merge-stream');

gulp.task('vendor', function() {
    return merge(
        gulp.src([
            './node_modules/angular/angular?(.min).js',
            './vendor/angular-route/*',
            './vendor/cldr/**',
            './vendor/globalize/**',
            './vendor/jquery/*',
            './vendor/jszip/*',
            './vendor/knockout/*'
        ]).pipe(gulp.dest('artifacts/js'))
    );
});
