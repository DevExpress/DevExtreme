const sass = require('gulp-dart-sass');
const gulp = require('gulp');

const outputPath = require('./config').outputPath;

const compileBundle = (bundleName) => {
    return gulp.src(bundleName)
        .pipe(sass())
        .pipe(gulp.dest('scss-css'));
};

gulp.task('sass-material', () => compileBundle(`${outputPath}/bundles/dx.material.blue.light.scss`));
gulp.task('sass-generic', () => compileBundle(`${outputPath}/bundles/dx.light.scss`));
