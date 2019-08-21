const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const replace = require('gulp-replace');
const replaceAsync = require('gulp-replace-async');
const gulpLess = require('gulp-less');
const plumber = require('gulp-plumber');
const lessCompiler = require('less');
const LessAutoPrefix = require('less-plugin-autoprefix');

const generator = require('../../themebuilder/modules/metadata-generator');
const context = require('./context');
const browsersList = require('../../package.json').browserslist;
const starLicense = require('./header-pipes').starLicense;
const autoPrefix = new LessAutoPrefix({ browsers: browsersList });

const cssArtifactsPath = path.join(process.cwd(), 'artifacts', 'css');
const commentsRegex = /\s*\/\*[\S\s]*?\*\//g;

const compileBundle = (src) => {
    return gulp
        .src(src)
        .pipe(plumber())
        .pipe(gulpLess({
            paths: [ path.join(process.cwd(), 'styles') ],
            plugins: [ autoPrefix ],
            useFileCache: true
        }))
        .pipe(replace(commentsRegex, ''))
        .pipe(starLicense())
        .pipe(gulp.dest(cssArtifactsPath));
};

const getBundleTasks = (bundleGroup) => {
    const lessSrcPath = path.join(process.cwd(), 'styles', 'bundles', bundleGroup);
    const lessBundles = fs.readdirSync(lessSrcPath);
    return lessBundles.map((bundle) => {
        return () => compileBundle(path.join(lessSrcPath, bundle));
    });
};

gulp.task('style-compiler-material', gulp.parallel(getBundleTasks('material')));
gulp.task('style-compiler-generic', gulp.parallel(getBundleTasks('generic')));
gulp.task('style-compiler-ios7', gulp.parallel(getBundleTasks('ios7')));
gulp.task('style-compiler-common', gulp.parallel(getBundleTasks('common')));

gulp.task('copy-fonts-and-icons', () => {
    return gulp
        .src(['fonts/**/*', 'icons/**/*'], { base: '.' })
        .pipe(gulp.dest(cssArtifactsPath));
});

gulp.task('style-compiler-themes',
    gulp.parallel(
        'style-compiler-generic',
        'style-compiler-material',
        'style-compiler-ios7',
        'style-compiler-common',
        'copy-fonts-and-icons')
);

gulp.task('style-compiler-themes-dev', gulp.parallel(() => {
    const commonSources = [
        'styles/widgets/base/**',
        'styles/mixins.less',
        'styles/theme.less'
    ];

    gulp.watch(['styles/widgets/generic/**', 'styles/bundles/generic/**'].concat(commonSources), gulp.series('style-compiler-generic'));
    gulp.watch(['styles/widgets/material/**', 'styles/bundles/material/**'].concat(commonSources), gulp.series('style-compiler-material'));
    gulp.watch(['styles/widgets/ios7/**', 'styles/bundles/ios7/**'].concat(commonSources), gulp.series('style-compiler-ios7'));
    gulp.watch(['styles/widgets/common/**', 'styles/bundles/common/**', 'styles/mixins.less', 'styles/widgets/ui.less'], gulp.series('style-compiler-common'));
    gulp.watch(['fonts/**', 'icons/**'], gulp.series('copy-fonts-and-icons'));
}));


gulp.task('style-compiler-tb-metadata', () => {
    return generator.generate(context.version.package, lessCompiler);
});

gulp.task('style-compiler-tb-assets', gulp.parallel('style-compiler-tb-metadata', () => {
    const assetsPath = path.join(process.cwd(), 'themebuilder', 'data', 'less');
    return gulp.src('styles/**/*')
        .pipe(replace(commentsRegex, ''))
        .pipe(replaceAsync(/data-uri\([^)]+\)/g, (match, callback) => {
            const validLessString = `selector{property:${match[0]};}`;
            lessCompiler.render(validLessString, { paths: [ path.join(process.cwd(), 'images') ] })
                .then(
                    (output) => callback(null, /url\([^)]+\)/.exec(output.css)[0]),
                    (error) => console.log(error)
                );
        }))
        .pipe(gulp.dest(assetsPath));
}));
