const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const replace = require('gulp-replace');
const less = require('gulp-less');
const LessAutoPrefix = require('less-plugin-autoprefix');

const context = require('./context.js');
const browsersList = require('../../package.json').browserslist;
const starLicense = require('./header-pipes').starLicense;
const autoPrefix = new LessAutoPrefix({ browsers: browsersList });

const cssArtifactsPath = path.join(process.cwd(), 'artifacts', 'css');

const compileBundle = (src) => {
    return gulp
        .src(src)
        .pipe(less({
            paths: [ path.join(process.cwd(), 'styles') ],
            plugins: [ autoPrefix ],
            useFileCache: true
        }))
        .pipe(replace(/\s*\/\*[\S\s]*?\*\//g, ''))
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


function runStyleCompiler(command, params, callback) {
    var spawn = require('child_process').spawn;
    var process = spawn(
        'dotnet',
        ['build/style-compiler/bin/style-compiler.dll', command].concat(params),
        { stdio: 'inherit' }
    );

    process.on('exit', function(code) {
        if(code === 0) {
            callback();
        } else {
            callback('Style compiler failed');
        }
    });
}

gulp.task('style-compiler-tb-assets', function(callback) {
    var assetsPath = path.join(process.cwd(), 'themebuilder');

    runStyleCompiler(
        'tb-assets', [
            '--version=' + context.version.package,
            '--tb-ui-path=' + assetsPath
        ],
        callback
    );
});

gulp.task('style-compiler-tb-assets1', gulp.parallel(() => {
    const assetsPath = path.join(process.cwd(), 'themebuilder1');
    return gulp.src('styles/**/*')
        .pipe(gulp.dest(assetsPath));
}, () => {
    const assetsPath = path.join(process.cwd(), 'themebuilder1', 'images');
    return gulp.src('images/**/*')
        .pipe(gulp.dest(assetsPath));
}));

gulp.task('style-compiler-tb-assets2', function(callback) {
    var assetsPath = path.join(process.cwd(), 'themebuilder2');

    return gulp.src('themebuilder1/bundles/generic/dx.light.less')
        //.pipe(replace(/\(once\)(.*)/g, '(reference)$1\n@import (inline)$1'))
        // TODO inline images
        //.pipe(filter(['styles/bundles/generic/*']))
        .pipe(less({ paths: [ path.join(process.cwd(), 'themebuilder1') ] }))
        .pipe(gulp.dest(assetsPath));
});

