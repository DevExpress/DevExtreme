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

function compileMaterial() {
    return compileBundle(`${tmpPath}/bundles/dx.material.blue.light.scss`);
}

function compileGeneric() {
    return compileBundle(`${tmpPath}/bundles/dx.light.scss`);
}

gulp.task('compile', gulp.series(
    processDataUri,
    compileMaterial,
    compileGeneric
));
