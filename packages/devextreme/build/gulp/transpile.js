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

const removeDebug = require('./compression-pipes.js').removeDebug;
const ctx = require('./context.js');
const testsConfig = require('../../testing/tests.babelrc.json');
const transpileConfig = require('./transpile-config');

const createTsCompiler = require('./typescript/compiler');

const { SideEffectFinder } = require('./side-effects-finder');

const sideEffectFinder = new SideEffectFinder();
const src = [
    'js/**/*.*',
    '!js/**/*.d.ts',
    '!js/**/*.{tsx,ts}',
    '!js/__internal/**/*.*',
];

const esmTranspileSrc = src.concat([
    '!js/viz/docs/**/*',
    '!**/*.json'
]);

const srcTsPattern = 'js/__internal/**/*.{ts,tsx}';
const srcTsIgnorePatterns = [
    '**/__tests__/**/*'
];

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

const createModuleConfig = (name, dir, filePath, dist) => {
    const isIndex = name === 'index.js';
    const relative = path.join('./', dir.replace(srcDir, ''), name);
    const currentPath = isIndex ? path.join(relative, '../') : relative;
    const esmFile = path.relative(currentPath, path.join('./esm', relative));
    const esmFilePath = path.join(dist, './esm', dir.replace(srcDir, ''), name);
    const cjsFile = path.relative(currentPath, path.join('./cjs', relative));
    const hasRealDTS = fs.existsSync(filePath.replace(/\.js$/, '.d.ts'));
    const hasGeneratedDTS = generatedTs.indexOf(relative.replace(/\.js$/, '.d.ts')) !== -1;
    const hasDTS = hasRealDTS || hasGeneratedDTS;
    const relativeEsmBase = normalize(esmFile).match(/^.*\/esm\//)[0];
    const sideEffectFiles = sideEffectFinder.getModuleSideEffectFiles(esmFilePath)
        .map((importPath) => importPath.replace(/^.*\/esm\//, relativeEsmBase));

    const result = {
        sideEffects: sideEffectFiles.length ? sideEffectFiles : false,
        main: normalize(cjsFile),
        module: normalize(esmFile),
    };

    if(hasDTS) {
        const typingFile = name.replace(/\.js$/, '.d.ts');

        result['typings'] = `${isIndex ? './' : '../'}${typingFile}`;
    }

    return JSON.stringify(result, null, 2);
};

const transpileTs = (compiler, src) => {
    const task = () => compiler
        .compileTs(src, srcTsIgnorePatterns)
        .pipe(gulp.dest(TS_OUTPUT_BASE_DIR));

    task.displayName = 'transpile TS';
    return task;
};

gulp.task('ts-compile-internal', (done) => {
    createTsCompiler(TS_COMPILER_CONFIG).then((compiler) => {
        transpileTs(compiler, srcTsPattern)()
            .on('end', done)
            .on('error', done);
    });
});

gulp.task('esm-dual-mode-manifests', () => {
    const dist = ctx.TRANSPILED_PROD_ESM_PATH;
    return gulp
        .src(esmTranspileSrc)
        .pipe(flatMap((stream, file) => {
            const filePath = file.path;
            const parsedPath = path.parse(filePath);
            const fileName = parsedPath.base;
            const fileDir = parsedPath.dir;

            // NOTE: flatmap thinks that the 'js/viz/vector_map.utils' folder is a file.
            if(file.extname === '.utils') return stream;

            return stream
                .pipe(replace(/[\s\S]*/, createModuleConfig(fileName, fileDir, filePath, dist)))
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
        .pipe(gulp.dest(dist));
});

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
        .pipe(removeDebug())
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
        .pipe(removeDebug())
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
