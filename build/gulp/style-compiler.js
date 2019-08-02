const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const strip = require('gulp-strip-css-comments');
const context = require('./context.js');
const browsersList = require('../../package.json').browserslist;


// less (new)
const less = require('gulp-less');
const LessAutoPrefix = require('less-plugin-autoprefix');
const autoPrefix = new LessAutoPrefix({ browsers: browsersList });


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

gulp.task('style-compiler-themes', function(callback) {
    var cssArtifactsPath = path.join(process.cwd(), 'artifacts/css');

    runStyleCompiler(
        'themes', [
            '--version=' + context.version.product,
            '--output-path=' + cssArtifactsPath
        ],
        callback
    );
});

const compileBundle = (src) => {
    const cssArtifactsPath = path.join(process.cwd(), 'artifacts/css');
    return gulp
        .src(src)
        .pipe(less({
            paths: [ path.join(process.cwd(), 'styles') ],
            plugins: [ autoPrefix ],
            useFileCache: true
        }))
        .pipe(strip())
        .pipe(gulp.dest(path.join(cssArtifactsPath, 'new'))); // TODO 'new' path changed
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

gulp.task('style-compiler-themes1',
    gulp.parallel(
        'style-compiler-generic',
        'style-compiler-material',
        'style-compiler-ios7')
    // TODO copy fonts and styles
);

gulp.task('style-compiler-themes-dev', function(callback) {
    return gulp.watch("styles/**", gulp.series('style-compiler-themes'));
});

gulp.task('style-compiler-themes-dev1', gulp.parallel(() => {
    const commonSources = [
        "styles/widgets/base/**",
        "styles/mixins.less",
        "styles/theme.less"
    ];

    gulp.watch(["styles/widgets/generic/**", "styles/bundles/generic/**"].concat(commonSources), gulp.series('style-compiler-generic'));
    gulp.watch(["styles/widgets/material/**", "styles/bundles/material/**"].concat(commonSources), gulp.series('style-compiler-material'));
    gulp.watch(["styles/widgets/ios7/**", "styles/bundles/ios7/**"].concat(commonSources), gulp.series('style-compiler-ios7'));
}));

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
