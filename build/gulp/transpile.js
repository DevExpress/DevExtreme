var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');
var replace = require('gulp-replace');
var plumber = require('gulp-plumber');
var path = require('path');
var notify = require('gulp-notify');

var context = require('./context.js');

var SRC = 'js/**/*.*';
var TESTS_PATH = 'testing';
var TESTS_SRC = TESTS_PATH + '/**/*.js';

var VERSION_FILE_PATH = 'core/version.js';


gulp.task('transpile', gulp.series('bundler-config', function() {
    return gulp.src(SRC)
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PATH));
}));

gulp.task('version-replace', gulp.series('transpile', function() {
    return gulp.src(path.join(context.TRANSPILED_PATH, VERSION_FILE_PATH), { base: './' })
        .pipe(replace('%VERSION%', context.version.script))
        .pipe(gulp.dest('./'));
}));

gulp.task('transpile-watch', gulp.series('version-replace', function() {
    return watch(SRC)
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
                .bind() // bind call is necessary to prevent firing 'end' event in notify.onError implementation
        }))
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PATH));
}));

gulp.task('transpile-tests', gulp.series('bundler-config', function() {
    return gulp.src(TESTS_SRC)
        .pipe(babel())
        .pipe(gulp.dest(TESTS_PATH));
}));
