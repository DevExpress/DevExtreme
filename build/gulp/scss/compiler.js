const sass = require('gulp-dart-sass');
const gulp = require('gulp');
const config = require('./config');
const dataUri = require('../gulp-data-uri');
const cleanCss = require('gulp-clean-css');
const autoPrefix = require('gulp-autoprefixer');
const cleanCssOptions = require('../../../themebuilder/modules/clean-css-options');

const outputPath = config.outputPath;
const tmpPath = `${outputPath}/tmp`;

function compileBundle(bundleName) {
    return gulp.src(bundleName)
        .pipe(sass())
        .pipe(autoPrefix())
        .pipe(cleanCss(cleanCssOptions))
        .pipe(gulp.dest('artifacts/scss-css'));
}

function processDataUri() {
    return gulp.src(`${outputPath}/**/*`)
        .pipe(dataUri())
        .pipe(gulp.dest(tmpPath));
}

function compile() {
    return compileBundle([
        `${tmpPath}/bundles/*`,
        `!${tmpPath}/bundles/dx.ios7.default.scss`
    ]);
}

gulp.task('compile-scss', gulp.series(
    processDataUri,
    compile
));
