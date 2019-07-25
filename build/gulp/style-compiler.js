var gulp = require('gulp');
var path = require('path');
var context = require('./context.js');

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

gulp.task('style-compiler-themes-dev', function(callback) {
    return gulp.watch("styles/**", ['style-compiler-themes']);
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
