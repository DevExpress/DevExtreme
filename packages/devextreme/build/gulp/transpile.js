'use strict';

const babel = require('gulp-babel');
const gulp = require('gulp');
const notify = require('gulp-notify');
const path = require('path');
const plumber = require('gulp-plumber');
const replace = require('gulp-replace');
const watch = require('gulp-watch');

const ctx = require('./context.js');
const testsConfig = require('../../testing/tests.babelrc.json');
const transpileConfig = require('./transpile-config');
const createTsCompiler = require('./typescript/compiler');

const REMOVE_DEBUG_REGEXP = /\/{2,}\s{0,}#DEBUG[\s\S]*?\/{2,}\s{0,}#ENDDEBUG/g;

const src = [
    'js/**/*.*',
    '!js/**/*.d.ts',
    '!js/**/*.{tsx,ts}',
    '!js/__internal/**/*.*',
];

const TS_OUTPUT_BASE_DIR = 'artifacts/dist_ts';
const TS_COMPILER_CONFIG = {
    baseAbsPath: path.resolve(__dirname, '../..'),
    relativePath: {
        tsconfig: 'js/__internal/tsconfig.json',
        alias: 'js',
        dist: TS_OUTPUT_BASE_DIR,
    },
    tsBaseDirName: '__internal',
    messages: {
        createDirErr: 'Cannot create directory',
        createFileErr: 'Cannot create file',
        compilationFailed: 'TS Compilation failed',
    },
};

const watchJsTask = () => {
    const watchTask = watch(src)
        .on('ready', () => console.log('transpile JS is watching for changes...'))
        .pipe(plumber({
            errorHandler: notify
                .onError('Error: <%= error.message %>')
                .bind() // bind call is necessary to prevent firing 'end' event in notify.onError implementation
        }));
    watchTask
        .pipe(babel(transpileConfig.cjs))
        .pipe(gulp.dest(ctx.TRANSPILED_PATH));
    watchTask
        .pipe(replace(REMOVE_DEBUG_REGEXP, ''))
        .pipe(babel(transpileConfig.cjs))
        .pipe(gulp.dest(ctx.TRANSPILED_PROD_RENOVATION_PATH));
    return watchTask;
};
watchJsTask.displayName = 'transpile JS watch';

const watchTsTask = async() => {
    const compiler = await createTsCompiler(TS_COMPILER_CONFIG);
    const tsWatch = compiler.watchTs();

    tsWatch
        .pipe(plumber({
            errorHandler: notify
                .onError('Error: <%= error.message %>')
                .bind() // bind call is necessary to prevent firing 'end' event in notify.onError implementation
        }))
        .pipe(babel(transpileConfig.tsCjs))
        .pipe(gulp.dest(ctx.TRANSPILED_PATH))
        .pipe(replace(REMOVE_DEBUG_REGEXP, ''))
        .pipe(gulp.dest(ctx.TRANSPILED_PROD_RENOVATION_PATH));
};
watchTsTask.displayName = 'transpile TS watch';

gulp.task('transpile-watch', gulp.parallel(watchJsTask, watchTsTask));

gulp.task('transpile-tests', gulp.series('bundler-config', () =>
    gulp
        .src(['testing/**/*.js'])
        .pipe(babel(testsConfig))
        .pipe(gulp.dest('testing'))
));
