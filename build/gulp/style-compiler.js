'use strict';

const gulp = require('gulp');
const path = require('path');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const sass = require('gulp-dart-sass');
const functions = require('./gulp-data-uri').sassFunctions;

const fiber = require('fibers');
const cleanCss = require('gulp-clean-css');
const autoPrefix = require('gulp-autoprefixer');
const parseArguments = require('minimist');
const fs = require('fs');
const cleanCssOptions = require('../../themebuilder-scss/src/data/clean-css-options.json');
const starLicense = require('./header-pipes').starLicense;

const cssArtifactsPath = path.join(process.cwd(), 'artifacts', 'css');
const commentsRegex = /\s*\/\*[\S\s]*?\*\//g;

const DEFAULT_DEV_BUNDLE_NAMES = [
    'common',
    'light',
    'material.blue.light'
];

const getBundleSourcePath = name => `scss/bundles/dx.${name}.scss`;

const compileBundles = (bundles) => {
    return gulp
        .src(bundles)
        .pipe(plumber(e => {
            console.log(e);
            this.emit('end');
        }))
        .on('data', (chunk) => console.log('Build: ', chunk.path))
        .pipe(sass({
            fiber,
            functions
        }))
        .pipe(autoPrefix())
        .pipe(cleanCss(cleanCssOptions))
        .pipe(replace(commentsRegex, ''))
        .pipe(starLicense())
        .pipe(replace(/([\s\S]*)(@charset.*?;\s)/, '$2$1'))
        .pipe(gulp.dest(cssArtifactsPath));
};


gulp.task('copy-fonts-and-icons', () => {
    return gulp
        .src(['fonts/**/*', 'icons/**/*'], { base: '.' })
        .pipe(gulp.dest(cssArtifactsPath));
});

gulp.task('style-compiler-themes', gulp.parallel(
    () => compileBundles(getBundleSourcePath('*')),
    'copy-fonts-and-icons'
));

gulp.task('style-compiler-themes-ci', gulp.parallel(
    () => compileBundles(DEFAULT_DEV_BUNDLE_NAMES.map(getBundleSourcePath)),
    'copy-fonts-and-icons'
));

gulp.task('style-compiler-themes-dev', () => {
    const args = parseArguments(process.argv);
    const bundlesArg = args['bundles'];

    const bundles = (
        bundlesArg
            ? bundlesArg.split(',')
            : DEFAULT_DEV_BUNDLE_NAMES)
        .map((bundle) => {
            const sourcePath = getBundleSourcePath(bundle);
            if(fs.existsSync(sourcePath)) {
                return sourcePath;
            }
            console.log(`${sourcePath} file does not exists`);
            return null;
        });

    gulp.watch('scss/**/*', gulp.parallel(() => compileBundles(bundles), 'copy-fonts-and-icons'));
});
