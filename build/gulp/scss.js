const gulp = require('gulp');
const path = require('path');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const del = require('del');
const sass = require('gulp-dart-sass');
const sassLint = require('gulp-sass-lint');
const through = require('through2');
const file = require('gulp-file');

const replaceAsync = require('gulp-replace-async');

const plumber = require('gulp-plumber');

const parseArguments = require('minimist');
const fs = require('fs');

const outputPath = 'scss';

const importReplacement = /@import \((once|reference|)\) (".*\/)(.*?)\.(generic|material).scss(";)/gm;
const compactMixinReplacementIndex = /@mixin dx-size-default\(\)\s*{([\w\W]*?)}\s*@mixin dx-size-compact\(\)\s*{([\w\W]*?)}/g;
const compactMixinReplacementSizes = /[\w\W]*?@mixin dx-size-default\(\)\s*{([\w\W]*?)}\s*@mixin dx-size-compact\(\)\s*{([\w\W]*?)}([\w\W]*)/g;

const compactMixinUsageReplacement = /@include\s+dx-size-(compact|default);/g;

gulp.task('fix-scss-clean', () => del([outputPath]));

gulp.task('fix-bundles', () => {
    return gulp
        .src('styles/bundles/*.scss')
        .pipe(replace(importReplacement, '@use "./$3";'))
        .pipe(gulp.dest(`${outputPath}/bundles`));
});

gulp.task('fix-base', () => {
    // the same code for different themes
    return gulp
        .src('styles/widgets/base/*.scss')
        .pipe(replace(importReplacement, '@use "./$3";'))
        .pipe(rename((path) => {
            path.basename = '_' + path.basename;
        }))
        .pipe(gulp.dest(`${outputPath}/widgets/base`));
});

gulp.task('fix-common', () => {
    // for dx.common.css
    return gulp
        .src('styles/widgets/common/*.scss')
        .pipe(replace(importReplacement, '@use "./$3";'))
        .pipe(rename((path) => {
            path.basename = '_' + path.basename;
        }))
        .pipe(gulp.dest(`${outputPath}/widgets/common`));
});

gulp.task('fix-themes', () => {
    return gulp
        .src(['styles/widgets/generic/*.scss', 'styles/widgets/material/*.scss'], { base: 'styles/' })
        .pipe(replace(importReplacement, '@use "../$3";'))
        // .pipe(replace.apply(gulp, compactMixinReplacement))
        .pipe(replace(compactMixinUsageReplacement, ''))
        .pipe(rename((path) => {
            const widgetName = path.basename.replace(/\.(material|generic)/g, '');
            path.dirname += `/${widgetName}`;
            path.basename = `_index`;
        }))
        .pipe(gulp.dest(outputPath))
        .pipe(through.obj((chunk, enc, cb) => {
            const folder = chunk.path.replace('_index.scss', '');
            const content = chunk.contents.toString();

            // remove size mixins from _index
            chunk.contents = new Buffer(content.replace(compactMixinReplacementIndex, ''));

            // TODO add colors and sizes import to index

            fs.writeFileSync(path.join(folder, '_colors.scss'), '@use "sass:color";\n$color-scheme: null !default;\n');

            // add size mixins into _sizes
            let sizesContent = '$size: null !default;\n\n';
            if(compactMixinReplacementSizes.test(content)) {
                sizesContent += content.replace(compactMixinReplacementSizes, (match, defaultSize, compactSize) => {
                    const defaultDefinition = defaultSize.replace(/^\s*(\$.*?):.*?;/gm, '$1: null !default;');
                    return `${defaultDefinition}\n@if $size == "default" {${defaultSize}}\n@else if $size == "compact" {${compactSize}}`;
                });
            }

            fs.writeFileSync(path.join(folder, '_sizes.scss'), sizesContent);

            cb(null, chunk);
        }))
        .pipe(gulp.dest(outputPath));
});

gulp.task('fix-lint', () => {
    return gulp.src(`${outputPath}/**/*.scss`)
        .pipe(sassLint({
            options: {
                // formatter: 'stylish',
                formatter: 'checkstyle',
                'merge-default-rules': false
            },
            rules: {
                'final-newline': true,
                'indentation': { size: 4 }
            }
        }))
        .pipe(sassLint.format())
        .pipe(gulp.dest(outputPath + '1'));
});

gulp.task('fix-scss', gulp.series(
    'fix-scss-clean',
    gulp.parallel(
        'fix-bundles',
        'fix-base',
        'fix-common',
        'fix-themes'
    )
    // 'fix-lint'
));


gulp.task('sass', () => {
    return gulp.src(`${outputPath}/bundles/dx.light.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('scss-css'));
});

gulp.task('sass1', () => {
    return gulp.src(`spike-scss/bundles/dx.light.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('scss-css'));
});
