const gulp = require('gulp');
const path = require('path');
const context = require('./context.js');

// less (new)
const less = require('gulp-less');
const LessAutoPrefix = require('less-plugin-autoprefix');
const autoPrefix = new LessAutoPrefix({ browsers: ['last 2 versions'] }); // TODO read the right browsers list


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
const materialTasks = [];

materialColors.forEach((color) => {
    materialLights.forEach((light) => {
        const taskName = `material${color}${light}`;
        materialTasks.push(taskName);
        gulp.task(taskName, () => {
            const cssArtifactsPath = path.join(process.cwd(), 'artifacts/css');
            const lessSrcPath = path.join(process.cwd(), 'styles/bundles');

            return gulp.src(path.join(lessSrcPath, 'material.less'))
                .pipe(less({
                    paths: [ path.join(process.cwd(), 'styles') ],
                    plugins: [ autoPrefix ],
                    modifyVars: {
                        color,
                        light
                    }
                }))
                .pipe(gulp.dest(path.join(cssArtifactsPath, 'new', `dx.material.${color}.${light}.css`)));
        });
    });
});

gulp.task('style-compiler-themes1', function(callback) {
    // const cssArtifactsPath = path.join(process.cwd(), 'artifacts/css');
    // const lessSrcPath = path.join(process.cwd(), 'styles/bundles');

    // return gulp.src(path.join(lessSrcPath, 'material.less'))
    //     .pipe(less({
    //         paths: [ path.join(process.cwd(), 'styles') ],
    //         plugins: [ autoPrefix ]
    //     }))
    //     .pipe(gulp.dest(cssArtifactsPath));
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
