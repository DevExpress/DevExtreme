'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const path = require('path');
const notify = require('gulp-notify');
const compressionPipes = require('./compression-pipes.js');
const renovationPipes = require('./renovation-pipes');

const context = require('./context.js');

require('./generator/gulpfile');

const GLOB_TS = require('./ts').GLOB_TS;
const SRC = ['js/**/*.*', '!' + GLOB_TS, '!js/**/*.{tsx,ts}', '!js/renovation/code_coverage/**/*.*'];
const TESTS_PATH = 'testing';
const TESTS_SRC = TESTS_PATH + '/**/*.js';

const VERSION_FILE_PATH = 'core/version.js';

gulp.task('transpile-prod-renovation', function() {
    return gulp.src(SRC)
        .pipe(compressionPipes.removeDebug())
        .pipe(renovationPipes.replaceWidgets())
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PROD_RENOVATION_PATH));
});

gulp.task('transpile-prod-old', function() {
    return gulp.src(SRC)
        .pipe(compressionPipes.removeDebug())
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PROD_PATH));
});

gulp.task('transpile-prod', gulp.parallel('transpile-prod-old', 'transpile-prod-renovation'));

gulp.task('transpile', gulp.series('bundler-config', 'transpile-prod', function() {
    return gulp.src(SRC)
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PATH));
}));

const replaceTask = (sourcePath) => {
    return () => gulp.src(path.join(sourcePath, VERSION_FILE_PATH), { base: './' })
        .pipe(replace('%VERSION%', context.version.script))
        .pipe(gulp.dest('./'));
};

gulp.task('version-replace', gulp.series('transpile', gulp.parallel([
    replaceTask(context.TRANSPILED_PATH),
    replaceTask(context.TRANSPILED_PROD_PATH),
    replaceTask(context.TRANSPILED_PROD_RENOVATION_PATH),
])));

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
