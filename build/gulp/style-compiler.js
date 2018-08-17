var gulp = require('gulp');
var path = require('path');
var context = require('./context.js');
var autoPrefix = require('gulp-autoprefixer');

function runStyleCompiler(command, params, callback) {
    var spawn = require('child_process').spawn,
        process = spawn(
            'dotnet',
            ['build/style-compiler/bin/style-compiler.dll', command].concat(params),
            { stdio: 'inherit' }
        );

    process.on('exit', function(code) {
        if(code === 0) {
            addCssPrefixes(params, callback);
        } else {
            callback('Style compiler failed');
        }
    });
}

function addCssPrefixes(params, callback) {
    var outputPath,
        dateStart;

    if(params.length > 0) {
        outputPath = params.find(param => !!param.match("--output-path"));
        outputPath = outputPath && outputPath.replace("--output-path=", "");
    }
    if(outputPath) {
        dateStart = new Date();
        gulp.src(outputPath + "/*.css")
            .pipe(autoPrefix())
            .pipe(gulp.dest(function(file) { return file.base; })
                .on('end', function() {
                    console.log(`  Autoprefixer finished after ${(new Date() - dateStart) / 1000}s`);
                    callback();
                }))
            .on('error', function() {
                callback('  Autoprefixer failed');
            });
    }
}

function generateCustomTheme(baseTheme, baseColorScheme, baseSizeScheme, customMetaPath, outputPath, callback) {
    var params = [
        '--base-theme=' + baseTheme,
        '--base-color-scheme=' + baseColorScheme
    ];

    if(baseSizeScheme) {
        params.push('--base-size-scheme=' + baseSizeScheme);
    }

    params.push(
        '--custom-meta-path=' + path.join(process.cwd(), customMetaPath),
        '--output-path=' + path.join(process.cwd(), outputPath)
    );

    runStyleCompiler('custom-theme', params, callback);
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

gulp.task('style-compiler-generic-legacy-light', function(callback) {
    generateCustomTheme(
        'generic', 'light', null,
        'styles/legacy/generic/light.json',
        'artifacts/css/dx.legacy.light.css',
        callback
    );
});

gulp.task('style-compiler-generic-legacy-light-compact', function(callback) {
    generateCustomTheme(
        'generic', 'light', 'compact',
        'styles/legacy/generic/light.json',
        'artifacts/css/dx.legacy.light.compact.css',
        callback
    );
});

gulp.task('style-compiler-generic-legacy-dark', function(callback) {
    generateCustomTheme(
        'generic', 'dark', null,
        'styles/legacy/generic/dark.json',
        'artifacts/css/dx.legacy.dark.css',
        callback
    );
});

gulp.task('style-compiler-generic-legacy-dark-compact', function(callback) {
    generateCustomTheme(
        'generic', 'dark', 'compact',
        'styles/legacy/generic/dark.json',
        'artifacts/css/dx.legacy.dark.compact.css',
        callback
    );
});

gulp.task('style-compiler-generic-legacy', [
    'style-compiler-generic-legacy-light',
    'style-compiler-generic-legacy-dark',
    'style-compiler-generic-legacy-light-compact',
    'style-compiler-generic-legacy-dark-compact'
]);
