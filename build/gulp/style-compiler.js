const gulp = require('gulp');
const path = require('path');
const rename = require('gulp-rename');
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

const materialColors = [ 'blue', 'lime', 'orange', 'purple', 'teal' ];
const materialLights = [ 'light', 'dark' ];
const sizeSchemes = [ 'default', 'compact' ];
const materialTasks = [];

materialColors.forEach((color) => {
    materialLights.forEach((light) => {
        sizeSchemes.forEach((size) => {
            materialTasks.push({ color, light, size });
        });
    });
});

gulp.task('style-compiler-themes1', gulp.parallel(materialTasks.map((task) => {
    const cssArtifactsPath = path.join(process.cwd(), 'artifacts/css');
    const lessSrcPath = path.join(process.cwd(), 'styles/bundles');
    const sizePostfix = task.size === 'default' ? '' : '.' + task.size;
    const fileName = `dx.material.${task.color}.${task.light}${sizePostfix}.css`;

    return function() {
        return gulp
            .src(path.join(lessSrcPath, 'material.less'))
            .pipe(less({
                paths: [ path.join(process.cwd(), 'styles') ],
                plugins: [ autoPrefix ],
                useFileCache: true,
                modifyVars: task
            }))
            .pipe(strip())
            .pipe(rename(fileName))
            .pipe(gulp.dest(path.join(cssArtifactsPath, 'new'))); // TODO 'new' path changed
    };
    // TODO copy fonts and styles
})));

gulp.task('style-compiler-themes-dev', function(callback) {
    return gulp.watch("styles/**", gulp.series('style-compiler-themes'));
});

gulp.task('style-compiler-themes-dev1', function(callback) {
    return gulp.watch("styles/**", gulp.series('style-compiler-themes1'));
});

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
