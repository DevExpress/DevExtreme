'use strict';

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const babel = require('gulp-babel');
const gulpEach = require('gulp-each');
const watch = require('gulp-watch');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const path = require('path');
const notify = require('gulp-notify');
const compressionPipes = require('./compression-pipes.js');

const context = require('./context.js');

require('./generator/gulpfile');

const GLOB_TS = require('./ts').GLOB_TS;
const SRC = ['js/**/*.*', '!' + GLOB_TS, '!js/**/*.{tsx,ts}'];
const TESTS_PATH = 'testing';
const TESTS_SRC = TESTS_PATH + '/**/*.js';

const VERSION_FILE_PATH = 'core/version.js';

function isRenovated(file) {
    const isRenovatedName = !!file.basename.match(/^button\b/g); // only renovated files
    const isNotRenovationFolder = file.path.match(/renovation/g) === null; // without renovation folder
    const isJsFile = file.extname === '.js';
    const isWidget = !!file.path.match(/ui\/button/g); // ui/text_box/../button.js

    return isRenovatedName && isNotRenovationFolder && isJsFile && isWidget;
}

gulp.task('transpile-prod-renovation', function() {
    return gulp.src(SRC)
        .pipe(compressionPipes.removeDebug())
        .pipe(gulpIf(isRenovated, gulpEach((content, file, callback) => {
            const pathToRenovatedFile = 'import Widget from "../renovation/' + file.stem + '.j";export default Widget;';
            callback(null, pathToRenovatedFile);
        })))
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PROD_RENOVATION_PATH));
});

gulp.task('transpile-prod-old', function() {
    return gulp.src(SRC)
        .pipe(compressionPipes.removeDebug())
        .pipe(babel())
        .pipe(gulp.dest(context.TRANSPILED_PROD_PATH));
});

gulp.task('transpile-prod', gulp.series('transpile-prod-old', 'transpile-prod-renovation'));

gulp.task('transpile', gulp.series('generate-components', 'bundler-config', 'transpile-prod', function() {
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
