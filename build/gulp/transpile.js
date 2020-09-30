'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const path = require('path');
const notify = require('gulp-notify');
const compressionPipes = require('./compression-pipes.js');
const renovationPipes = require('./renovation-pipes');
const utils = require('./utils');
const env = require('./env-variables');
const context = require('./context.js');
const rename = require('gulp-rename');
const flatMap = require('gulp-flatmap');
const gulpIf = require('gulp-if');
const cjsConfig = require('../../cjs.babelrc.json');
const esmConfig = require('../../esm.babelrc.json');
const testsConfig = require('../../testing/tests.babelrc.json');
const fs = require('fs');
const normalize = require('normalize-path');

require('./generator/gulpfile');

const GLOB_TS = require('./ts').GLOB_TS;
const SRC = ['js/**/*.*', '!' + GLOB_TS, '!js/**/*.{tsx,ts}', '!js/renovation/code_coverage/**/*.*'];
const TRANSPILE_SRC = SRC.concat([
    '!js/bundles/**/*',
    '!js/viz/docs/**/*',
    '!js/renovation/**/*',
    '!**/*.json'
]);
const BANDLES_SRC = ['js/bundles/**/*.js'];
const TESTS_PATH = 'testing';
const TESTS_SRC = TESTS_PATH + '/**/*.js';

const VERSION_FILE_PATH = 'core/version.js';
const SRC_DIR = path.join(process.cwd(), './js');
const GENERATED_TS = [
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

const createModuleConfig = (name, dir, filePath) => {
    const isIndex = name === 'index.js';
    const relative = path.join('./', dir.replace(SRC_DIR, ''), name);
    const currentPath = isIndex ? path.join(relative, '../') : relative;
    const esmFile = path.relative(currentPath, path.join('./esm', relative));
    const cjsFile = path.relative(currentPath, path.join('./cjs', relative));
    const hasRealDTS = fs.existsSync(filePath.replace(/\.js$/, '.d.ts'));
    const hasGeneratedDTS = GENERATED_TS.indexOf(relative.replace(/\.js$/, '.d.ts')) !== -1;
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

function transpile(dist, replaceWidgets) {
    return gulp.series.apply(gulp, [
        () => gulp.src(SRC)
            .pipe(compressionPipes.removeDebug())
            .pipe(gulpIf(replaceWidgets, renovationPipes.replaceWidgets()))
            .pipe(babel(esmConfig))
            .pipe(gulp.dest(path.join(dist, './esm')))
            .pipe(babel(cjsConfig))
            .pipe(gulp.dest(path.join(dist, './cjs'))),

        () => gulp.src(BANDLES_SRC)
            .pipe(compressionPipes.removeDebug())
            .pipe(gulpIf(replaceWidgets, renovationPipes.replaceWidgets()))
            .pipe(babel(cjsConfig))
            .pipe(gulp.dest(path.join(dist, './bundles'))),

        () => gulp.src(TRANSPILE_SRC)
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
}

gulp.task('transpile-prod-renovation',
    utils.runTaskByCondition(env.RUN_RENOVATION_TASK, transpile(context.TRANSPILED_PROD_RENOVATION_PATH, true)));

gulp.task('transpile-prod-old', transpile(context.TRANSPILED_PROD_PATH));

gulp.task('transpile', gulp.series('bundler-config', 'transpile-prod-old', 'transpile-prod-renovation', function() {
    return gulp.src(SRC)
        .pipe(babel(cjsConfig))
        .pipe(gulp.dest(context.TRANSPILED_PATH));
}));

const replaceTask = (sourcePath, isProd) => {
    const src = isProd ? [
        path.join(sourcePath, './esm', VERSION_FILE_PATH),
        path.join(sourcePath, './cjs', VERSION_FILE_PATH)
    ] : path.join(sourcePath, VERSION_FILE_PATH);

    return () => gulp.src(src, { base: './' })
        .pipe(replace('%VERSION%', context.version.script))
        .pipe(gulp.dest('./'));
};

gulp.task('version-replace', gulp.series('transpile', gulp.parallel([
    replaceTask(context.TRANSPILED_PATH),
    replaceTask(context.TRANSPILED_PROD_PATH, true),
    utils.runTaskByCondition(env.RUN_RENOVATION_TASK, () => replaceTask(context.TRANSPILED_PROD_RENOVATION_PATH, true))(),
])));

gulp.task('transpile-watch', gulp.series('version-replace', function() {
    return watch(SRC)
        .pipe(plumber({
            errorHandler: notify.onError('Error: <%= error.message %>')
                .bind() // bind call is necessary to prevent firing 'end' event in notify.onError implementation
        }))
        .pipe(babel(cjsConfig))
        .pipe(gulp.dest(context.TRANSPILED_PATH));
}));

gulp.task('transpile-tests', gulp.series('bundler-config', function() {
    return gulp.src(TESTS_SRC)
        .pipe(babel(testsConfig))
        .pipe(gulp.dest(TESTS_PATH));
}));
