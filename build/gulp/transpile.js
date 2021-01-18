'use strict';

const babel = require('gulp-babel');
const flatMap = require('gulp-flatmap');
const fs = require('fs');
const gulp = require('gulp');

const gulpIf = require('gulp-if');
const normalize = require('normalize-path');
const notify = require('gulp-notify');
const path = require('path');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const watch = require('gulp-watch');

const compressionPipes = require('./compression-pipes.js');
const ctx = require('./context.js');
const globTs = require('./ts').GLOB_TS;
const renovationPipes = require('./renovation-pipes');
const { ifRenovationPackage, ifEsmPackage } = require('./utils');
const testsConfig = require('../../testing/tests.babelrc.json');
const transpileConfig = require('./transpile-config');

require('./generator/gulpfile');

const src = [
    'js/**/*.*',
    `!${globTs}`,
    '!js/**/*.{tsx,ts}',
    '!js/renovation/code_coverage/**/*.*'
];

const esmTranspileSrc = src.concat([
    '!js/bundles/**/*',
    '!js/viz/docs/**/*',
    '!js/renovation/**/*',
    '!**/*.json'
]);

const srcDir = path.join(process.cwd(), './js');
const generatedTs = [
    'events/click.d.ts',
    'events/contextmenu.d.ts',
    'events/dblclick.d.ts',
    'events/drag.d.ts',
    'events/hold.d.ts',
    'events/hover.d.ts',
    'events/pointer.d.ts',
    'events/swipe.d.ts',
    'events/transform.d.ts',
    'integration/jquery.d.ts'
];

const bundlesSrc = ['js/bundles/**/*.js'];

const createModuleConfig = (name, dir, filePath) => {
    const isIndex = name === 'index.js';
    const relative = path.join('./', dir.replace(srcDir, ''), name);
    const currentPath = isIndex ? path.join(relative, '../') : relative;
    const esmFile = path.relative(currentPath, path.join('./esm', relative));
    const cjsFile = path.relative(currentPath, path.join('./cjs', relative));
    const hasRealDTS = fs.existsSync(filePath.replace(/\.js$/, '.d.ts'));
    const hasGeneratedDTS = generatedTs.indexOf(relative.replace(/\.js$/, '.d.ts')) !== -1;
    const hasDTS = hasRealDTS || hasGeneratedDTS;

    const result = {
        sideEffects: false,
        main: normalize(cjsFile),
        module: normalize(esmFile)
    };

    if(hasDTS) {
        const typingFile = name.replace(/\.js$/, '.d.ts');

        result['typings'] = `${isIndex ? './' : '../'}${typingFile}`;
    }

    return JSON.stringify(result, null, 2);
};

const transpile = (src, dist, config = transpileConfig.cjs, removeDebug = true, wrapWidgetForQUnit = false) => {
    const isRenovationDist = dist === ctx.TRANSPILED_RENOVATION_PATH || dist === ctx.TRANSPILED_PROD_RENOVATION_PATH;
    const task = () => gulp
        .src(src)
        .pipe(gulpIf(removeDebug, compressionPipes.removeDebug()))
        .pipe(gulpIf(isRenovationDist, renovationPipes.replaceWidgets(wrapWidgetForQUnit)))
        .pipe(babel(config))
        .pipe(gulp.dest(dist));
    task.displayName = 'transpile:' + dist;
    return task;
};

const transpileEsm = (dist) => gulp.series.apply(gulp, [
    transpile(src, path.join(dist, './esm'), transpileConfig.esm),
    transpile(src, path.join(dist, './cjs'), transpileConfig.cjs),
    transpile(bundlesSrc, path.join(dist, './bundles')),

    () => gulp
        .src(esmTranspileSrc)
        .pipe(flatMap((stream, file) => {
            const filePath = file.path;
            const parsedPath = path.parse(filePath);
            const fileName = parsedPath.base;
            const fileDir = parsedPath.dir;

            // NOTE: flatmap thinks that the 'js/viz/vector_map.utils' folder is a file.
            if(file.extname === '.utils') return stream;

            return stream
                .pipe(replace(/[\s\S]*/, createModuleConfig(fileName, fileDir, filePath)))
                .pipe(rename(fPath => {
                    const isIndexFile = parsedPath.base === 'index.js';
                    const shouldBePlacedInSeparateDir = !isIndexFile;

                    if(shouldBePlacedInSeparateDir) {
                        fPath.dirname = path.join(fPath.dirname, fPath.basename);
                    }

                    fPath.basename = 'package';
                    fPath.extname = '.json';
                }));
        }))
        .pipe(gulp.dest(dist))
]);
gulp.task('tmp',);

gulp.task('transpile', gulp.series(
    'bundler-config',
    gulp.parallel([
        transpile(src, ctx.TRANSPILED_PROD_PATH),
        transpile(src, ctx.TRANSPILED_PATH, transpileConfig.cjs, false),
        ifRenovationPackage(transpile(src, ctx.TRANSPILED_PROD_RENOVATION_PATH, transpileConfig.cjs)),
        ifRenovationPackage(transpile(src, ctx.TRANSPILED_RENOVATION_PATH, transpileConfig.cjs, false, true)),
    ]),
    ifEsmPackage(transpileEsm(ctx.TRANSPILED_PROD_ESM_PATH)),
));

const replaceTask = (sourcePath) => {
    const task = () => gulp
        .src(path.join(sourcePath, 'core/version.js'), { base: './' })
        .pipe(replace('%VERSION%', ctx.version.script))
        .pipe(gulp.dest('./'));
    task.displayName = `replace-version:${sourcePath}`;
    return task;
};

const replaceVersion = () => gulp.parallel([
    replaceTask(ctx.TRANSPILED_PATH),
    replaceTask(ctx.TRANSPILED_PROD_PATH),
    ifRenovationPackage(() => replaceTask(ctx.TRANSPILED_PROD_RENOVATION_PATH))(),
    ifRenovationPackage(() => replaceTask(ctx.TRANSPILED_RENOVATION_PATH))(),
    ifEsmPackage(() => replaceTask(path.join(ctx.TRANSPILED_PROD_ESM_PATH, './esm')))(),
    ifEsmPackage(() => replaceTask(path.join(ctx.TRANSPILED_PROD_ESM_PATH, './cjs')))(),
]);

gulp.task('version-replace', gulp.series('transpile', replaceVersion()));

gulp.task('transpile-watch', gulp.series(
    gulp.parallel([
        transpile(src, ctx.TRANSPILED_PATH, transpileConfig.cjs, false),
        transpile(src, ctx.TRANSPILED_RENOVATION_PATH, transpileConfig.cjs, false, true)
    ]),
    replaceVersion(),
    () => {
        const watchTask = watch(src).on('ready', () => console.log('transpile task is watching for changes...'))
            .pipe(plumber({
                errorHandler: notify
                    .onError('Error: <%= error.message %>')
                    .bind() // bind call is necessary to prevent firing 'end' event in notify.onError implementation
            }));
        watchTask
            .pipe(babel(transpileConfig.cjs))
            .pipe(gulp.dest(ctx.TRANSPILED_PATH));
        watchTask
            .pipe(renovationPipes.replaceWidgets(true))
            .pipe(babel(transpileConfig.cjs))
            .pipe(gulp.dest(ctx.TRANSPILED_RENOVATION_PATH));
        return watchTask;
    }
));

gulp.task('transpile-tests', gulp.series('bundler-config', () =>
    gulp
        .src(['testing/**/*.js'])
        .pipe(babel(testsConfig))
        .pipe(gulp.dest('testing'))
));
