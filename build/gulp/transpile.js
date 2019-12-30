const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const path = require('path');
const notify = require('gulp-notify');

const context = require('./context.js');

require('./generator');

const SRC = 'js/**/*.js*';
const TESTS_PATH = 'testing';
const TESTS_SRC = TESTS_PATH + '/**/*.js';

const VERSION_FILE_PATH = 'core/version.js';

gulp.task('transpile', gulp.series('generate-components', 'bundler-config', function() {
    return gulp.src(SRC)
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PATH));
}));

gulp.task('version-replace', gulp.series('transpile', function() {
    return gulp.src(path.join(context.TRANSPILED_PATH, VERSION_FILE_PATH), { base: './' })
        .pipe(replace('%VERSION%', context.version.script))
        .pipe(gulp.dest('./'));
}));

gulp.task('transpile-watch', gulp.series('version-replace', 'generate-components-watch', function() {
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
