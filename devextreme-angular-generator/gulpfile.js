var gulp = require('gulp');
var path = require('path');
var typescript = require('gulp-typescript');
var exec = require('child_process').exec;
var sourcemaps = require('gulp-sourcemaps');
var jasmine = require('gulp-jasmine');
var jasmineReporters = require('jasmine-reporters');
var del = require('del');

const SRC_FILES_PATTERN = './src/**/*.ts';
const TEMPLATES_FILES_PATTERN = './src/templates/*.tst';
const DIST_PATH = './dist';

//------------npm------------

gulp.task('npm.pack', gulp.series(
    (cb) => { exec('npm pack', (err) => cb(err)); },
    () => gulp.src('./*.tgz').pipe(gulp.dest(DIST_PATH)),
    (c) => del('./*.tgz', c)
));

//------------Main------------

var buildTask = gulp.series(
    () => gulp.src(TEMPLATES_FILES_PATTERN).pipe(gulp.dest(path.join(DIST_PATH, 'templates'))),
    () => gulp.src(SRC_FILES_PATTERN)
        .pipe(sourcemaps.init())
        .pipe(typescript('tsconfig.json'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DIST_PATH))
);

gulp.task('build', buildTask);
gulp.task('default', buildTask);


//------------Testing------------

gulp.task('run.tests', function() {
    return gulp.src('./spec/tests/*.spec.js')
        .pipe(jasmine({
            errorOnFail: false,
            reporter: [
                new jasmineReporters.TerminalReporter({
                    verbosity: 1,
                    color: true,
                    showStack: true
                })
            ]
        }));
});

gulp.task('test', gulp.series('build', 'run.tests'));

