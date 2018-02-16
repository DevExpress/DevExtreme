// jshint node:true

"use strict";

var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');

var context = require('./context.js');

var JS_SRC = 'js/**/*.js';

gulp.task('transpile', ['bundler-config'], function() {
    return gulp.src(JS_SRC)
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PATH));
});


gulp.task('transpile-watch', ['transpile'], function() {
    return watch(JS_SRC)
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PATH));
});
