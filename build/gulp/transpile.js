'use strict';

const babel = require('gulp-babel');
const gulp = require('gulp');
const gulpIf = require('gulp-if');
const notify = require('gulp-notify');
const path = require('path');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const watch = require('gulp-watch');

const compressionPipes = require('./compression-pipes.js');
const ctx = require('./context.js');
const globTs = require('./ts').GLOB_TS;
const renovationPipes = require('./renovation-pipes');
const { ifRenovation } = require('./utils');

require('./generator/gulpfile');

const src = [
    'js/**/*.*',
    `!${globTs}`,
    '!js/**/*.{tsx,ts}',
    '!js/renovation/code_coverage/**/*.*'
];

const transpile = (dist, replaceWidgets) => (() =>
    gulp
        .src(src)
        .pipe(compressionPipes.removeDebug())
        .pipe(gulpIf(replaceWidgets, renovationPipes.replaceWidgets()))
        .pipe(babel())
        .pipe(gulp.dest(dist))
);

gulp.task('transpile', gulp.series(
    'bundler-config',
    transpile(ctx.TRANSPILED_PROD_PATH),
    ifRenovation(transpile(ctx.TRANSPILED_PROD_RENOVATION_PATH, true)),
    () => gulp
        .src(src)
        .pipe(babel())
        .pipe(gulp.dest(ctx.TRANSPILED_PATH))
));

const replaceTask = (sourcePath) => (() =>
    gulp
        .src(path.join(sourcePath, 'core/version.js'), { base: './' })
        .pipe(replace('%VERSION%', ctx.version.script))
        .pipe(gulp.dest('./'))
);

gulp.task('version-replace', gulp.series('transpile', gulp.parallel([
    replaceTask(ctx.TRANSPILED_PATH),
    replaceTask(ctx.TRANSPILED_PROD_PATH),
    ifRenovation(() => replaceTask(ctx.TRANSPILED_PROD_RENOVATION_PATH))(),
])));

gulp.task('transpile-watch', gulp.series('version-replace', () =>
    watch(src)
        .pipe(plumber({
            errorHandler: notify
                .onError('Error: <%= error.message %>')
                .bind() // bind call is necessary to prevent firing 'end' event in notify.onError implementation
        }))
        .pipe(babel())
        .pipe(gulp.dest(ctx.TRANSPILED_PATH))
));

gulp.task('transpile-tests', gulp.series('bundler-config', () =>
    gulp
        .src('testing/**/*.js')
        .pipe(babel())
        .pipe(gulp.dest('testing'))
));
