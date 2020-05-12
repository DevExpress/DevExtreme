const gulp = require('gulp');
const path = require('path');
const replace = require('gulp-replace');
const gulpLess = require('gulp-less');
const plumber = require('gulp-plumber');
const lessCompiler = require('less');
const cleanCss = require('gulp-clean-css');
const autoPrefix = require('gulp-autoprefixer');
const parseArguments = require('minimist');
const fs = require('fs');

const dataUri = require('./gulp-data-uri').gulpPipe;
const generator = require('../../themebuilder/modules/metadata-generator');
const cleanCssOptions = require('../../themebuilder/modules/clean-css-options');
const context = require('./context');
const starLicense = require('./header-pipes').starLicense;

const cssArtifactsPath = path.join(process.cwd(), 'artifacts', 'css');
const commentsRegex = /\s*\/\*[\S\s]*?\*\//g;

const DEFAULT_DEV_BUNDLE_NAMES = [
    'common',
    'light',
    'material.blue.light',
    'ios7.default'
];

const getBundleSourcePath = name => `styles/bundles/dx.${name}.less`;

const compileBundles = (bundles) => {
    const paths = path.join(process.cwd(), 'styles');

    return gulp
        .src(bundles)
        .pipe(plumber(e => {
            console.log(e);
            this.emit('end');
        }))
        .on('data', (chunk) => console.log('Build: ', chunk.path))
        .pipe(gulpLess({
            paths: [ paths ],
            useFileCache: true
        }))
        .pipe(autoPrefix())
        .pipe(cleanCss(cleanCssOptions))
        .pipe(replace(commentsRegex, ''))
        .pipe(starLicense())
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

    gulp.watch('styles/**/*', gulp.parallel(() => compileBundles(bundles), 'copy-fonts-and-icons'));
});

gulp.task('style-compiler-tb-metadata', () => {
    return generator.generate(context.version.package, lessCompiler);
});

gulp.task('style-compiler-tb-assets', gulp.parallel('style-compiler-tb-metadata', () => {
    const assetsPath = path.join(process.cwd(), 'themebuilder', 'data', 'less');
    return gulp.src('styles/**/*')
        .pipe(replace(commentsRegex, ''))
        .pipe(dataUri())
        .pipe(gulp.dest(assetsPath));
}));
