const sass = require('gulp-dart-sass');
const gulp = require('gulp');

const outputPath = require('./config').outputPath;

gulp.task('sass-material', () => {
    return gulp.src(`${outputPath}/bundles/dx.material.blue.light.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('scss-css'));
});

gulp.task('sass-generic', () => {
    return gulp.src(`${outputPath}/bundles/dx.light.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('scss-css'));
});
