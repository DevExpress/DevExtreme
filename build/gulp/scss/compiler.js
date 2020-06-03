'use strict';

const sass = require('gulp-dart-sass');
const gulp = require('gulp');
const functions = require('../gulp-data-uri').sassFunctions;
const cleanCss = require('gulp-clean-css');
const autoPrefix = require('gulp-autoprefixer');
const cleanCssOptions = require('../../../themebuilder-scss/src/data/clean-css-options.json');
const fiber = require('fibers');

function compile() {
    return gulp.src([
        'scss/bundles/*',
        '!scss/bundles/dx.ios7.default.scss'
    ])
        .pipe(sass({
            fiber,
            functions
        }).on('error', sass.logError))
        .pipe(autoPrefix())
        .pipe(cleanCss(cleanCssOptions))
        .pipe(gulp.dest('artifacts/scss-css'));
}

gulp.task('compile-scss', compile);

gulp.task('compile-scss:watch', () => {
    gulp.watch('scss/**/*.scss', compile);
});
