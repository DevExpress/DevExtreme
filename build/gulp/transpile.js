'use strict';

const babel = require('gulp-babel');
const flatMap = require('gulp-flatmap');
const fs = require('fs');
const gulp = require('gulp');

const normalize = require('normalize-path');
const notify = require('gulp-notify');
const path = require('path');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const watch = require('gulp-watch');
const cache = require('gulp-cache');
const through2 = require('through2');

const removeDebug = require('./compression-pipes.js').removeDebug;
const ctx = require('./context.js');
const { replaceWidgets, reloadConfig, renovatedComponentsPath } = require('./renovation-pipes');
const { ifEsmPackage, writeFilePipe, replaceArtifactPath } = require('./utils');
const testsConfig = require('../../testing/tests.babelrc.json');
const transpileConfig = require('./transpile-config');

const createTsCompiler = require('./typescript/compiler');

require('./generator/gulpfile');


const src = [
    'js/**/*.*',
    '!js/**/*.d.ts',
    '!js/**/*.{tsx,ts}',
    '!js/renovation/code_coverage/**/*.*',
    '!js/__internal/**/*.*',
];

const esmTranspileSrc = src.concat([
    '!js/bundles/**/*',
    '!js/viz/docs/**/*',
    '!js/renovation/**/*',
    '!**/*.json'
]);

const srcTsPattern = 'js/__internal/**/*.ts';

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

const TS_OUTPUT_SRC = ['artifacts/dist_ts/__internal/**/*.js'];
const TS_COMPILER_CONFIG = {
    tsconfigAbsPath: path.resolve(__dirname, '../../js/__internal/tsconfig.json'),
    aliasAbsPath: path.resolve(__dirname, '../../js'),
    clearFilePattern: 'artifacts/dist_ts',
    normalizeTsAliasFilePath: (filePath) => filePath.replace(/\/artifacts\/dist_ts\//, '/js/'),
    messages: {
        createDirErr: 'Cannot create directory',
        createFileErr: 'Cannot create file',
        compilationFailed: 'TS Compilation failed',
    },
};

function transpileTs(compiler, src) {
    return async() => await compiler.compileTsAsync(src);
}
transpileTs.displayName = 'transpile TS';

function transpileTsClear(compiler) {
    return async() => await compiler.clearAfterTSCompileAsync();
}
transpileTsClear.displayName = 'clear after TS transpile';

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

function transpile(src, dist, pipes = [], isEsm = false) {
    const task = () => {
        let result = gulp.src(src);

        pipes.forEach(pipe => {
            result = result.pipe(pipe);
        });

        return result.pipe(gulp.dest(dist));
    };
    task.displayName = `transpile JS: ${dist}`;

    const babelTSTask = () => gulp.src(TS_OUTPUT_SRC)
        .pipe(
            isEsm
                ? babel(transpileConfig.esm)
                : babel(transpileConfig.tsCjs)
        )
        .pipe(gulp.dest(`${dist}/__internal`));
    babelTSTask.displayName = `babel TS: ${dist}`;

    return gulp.series([task, babelTSTask]);
}

function babelCjs() {
    return cache(babel(transpileConfig.cjs), { name: 'babel-cjs' });
}

function babelEsm() {
    return babel(transpileConfig.esm);
}

const transpileDefault = () => transpile(src, ctx.TRANSPILED_PATH, [
    babelCjs()
]);

const touch = () => through2.obj(function(file, enc, cb) {
    if(file.stat) {
        // eslint-disable-next-line spellcheck/spell-checker
        file.stat.atime = file.stat.mtime = file.stat.ctime = new Date();
    }
    cb(null, file);
});

const transpileRenovation = (watch) => transpile(src, ctx.TRANSPILED_RENOVATION_PATH, [
    replaceWidgets(true),
    babelCjs(),
    touch()
], watch);

const transpileProd = (dist, isEsm) => transpile(
    src,
    dist,
    [
        removeDebug(),
        replaceWidgets(false),
        isEsm ? babelEsm() : babelCjs(),
    ],
    isEsm);

const transpileRenovationProd = (watch) => transpileProd(ctx.TRANSPILED_PROD_RENOVATION_PATH, false, watch);

const transpileEsm = (dist) => gulp.series.apply(gulp, [
    transpileProd(path.join(dist, './cjs'), false),
    transpileProd(path.join(dist, './esm'), true),
    transpile(bundlesSrc, path.join(dist, './bundles'), [
        removeDebug(),
        babelCjs(),
    ]),

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

gulp.task('transpile-esm', transpileEsm(ctx.TRANSPILED_PROD_ESM_PATH));

gulp.task('transpile', (done) => {
    const compiler = createTsCompiler(TS_COMPILER_CONFIG);
    gulp.series(
        'bundler-config',
        transpileTs(compiler, srcTsPattern),
        transpileDefault(),
        transpileRenovation(),
        transpileRenovationProd(),
        ifEsmPackage('transpile-esm'),
        transpileTsClear(compiler),
    )(done);
});

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
    replaceTask(ctx.TRANSPILED_RENOVATION_PATH),
    replaceTask(ctx.TRANSPILED_PROD_RENOVATION_PATH),
    ifEsmPackage(() => replaceTask(path.join(ctx.TRANSPILED_PROD_ESM_PATH, './esm')))(),
    ifEsmPackage(() => replaceTask(path.join(ctx.TRANSPILED_PROD_ESM_PATH, './cjs')))(),
]);

gulp.task('version-replace', replaceVersion());

gulp.task('renovated-components-watch', () => {
    return gulp
        .watch(
            [renovatedComponentsPath + '.js'],
            function transpileRenovatedComponents(done) {
                gulp.series(
                    reloadConfig,
                    transpileRenovation(),
                    transpileRenovationProd()
                )(done);
            }
        )
        .on('ready', () => console.log('renovated-components task is watching for changes...'));

});

gulp.task('compile-ts-watch', async() => {
    const compiler = createTsCompiler(TS_COMPILER_CONFIG);
    await compiler.watchTsAsync();

    gulp.watch(TS_OUTPUT_SRC)
        .on('change', (path) => {
            gulp.src(path)
                .pipe(babel(transpileConfig.tsCjs))
                .pipe(writeFilePipe((filePath) => replaceArtifactPath(filePath, ctx.TS_OUT_PATH, ctx.TRANSPILED_PATH)))
                .pipe(writeFilePipe((filePath) => replaceArtifactPath(filePath, ctx.TS_OUT_PATH, ctx.TRANSPILED_RENOVATION_PATH)))
                .pipe(writeFilePipe((filePath) => replaceArtifactPath(filePath, ctx.TS_OUT_PATH, ctx.TRANSPILED_PROD_RENOVATION_PATH)));
        });
});

gulp.task('transpile-watch', gulp.series(
    () => {
        const watchTask = watch(src)
            .on('ready', () => console.log('transpile task is watching for changes...'))
            .pipe(plumber({
                errorHandler: notify
                    .onError('Error: <%= error.message %>')
                    .bind() // bind call is necessary to prevent firing 'end' event in notify.onError implementation
            }));
        watchTask
            .pipe(babel(transpileConfig.cjs))
            .pipe(gulp.dest(ctx.TRANSPILED_PATH));
        watchTask
            .pipe(replaceWidgets(true))
            .pipe(babel(transpileConfig.cjs))
            .pipe(gulp.dest(ctx.TRANSPILED_RENOVATION_PATH));
        watchTask
            .pipe(removeDebug())
            .pipe(replaceWidgets(true))
            .pipe(babel(transpileConfig.cjs))
            .pipe(gulp.dest(ctx.TRANSPILED_PROD_RENOVATION_PATH));
        return watchTask;
    }
));

gulp.task('transpile-tests', gulp.series('bundler-config', () =>
    gulp
        .src(['testing/**/*.js', '!testing/renovation-npm/**/*.js'])
        .pipe(babel(testsConfig))
        .pipe(gulp.dest('testing'))
));
