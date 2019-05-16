var gulp = require('gulp');
var babel = require('gulp-babel');
var watch = require('gulp-watch');

var context = require('./context.js');

var SRC = 'js/**/*.*';

gulp.task('transpile', ['bundler-config'], function() {
    return gulp.src(SRC)
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PATH));
});

gulp.task('transpile-watch', ['version-replace'], function() {
    return watch(SRC)
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PATH));
});
