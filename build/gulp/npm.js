'use strict';

const gulp = require('gulp');
const eol = require('gulp-eol');
const replace = require('gulp-replace');
const merge = require('merge-stream');
const through = require('through2');
const lazyPipe = require('lazypipe');
const dataUri = require('./gulp-data-uri').gulpPipe;

const context = require('./context.js');
const headerPipes = require('./header-pipes.js');
const compressionPipes = require('./compression-pipes.js');
const renovationPipes = require('./renovation-pipes');
const version = require('../../package.json').version;
const packagePath = context.RESULT_NPM_PATH + '/devextreme';
const scssPackagePath = packagePath + '/scss';

const TRANSPILED_GLOBS = [
    context.TRANSPILED_PROD_PATH + '/**/*.js',
    '!' + context.TRANSPILED_PROD_RENOVATION_PATH + '/**/*.*',
    '!' + context.TRANSPILED_PROD_PATH + '/renovation/**/*',
    '!' + context.TRANSPILED_PROD_PATH + '/bundles/*.js',
    '!' + context.TRANSPILED_PROD_PATH + '/bundles/modules/parts/*.js',
    '!' + context.TRANSPILED_PROD_PATH + '/viz/vector_map.utils/*.js',
    '!' + context.TRANSPILED_PROD_PATH + '/viz/docs/*.js'
];

const JSON_GLOBS = [
    'js/**/*.json',
    '!js/viz/vector_map.utils/*.*'
];

const DIST_GLOBS = [
    'artifacts/**/*.*',
    '!' + context.TRANSPILED_PROD_PATH + '/**/*.*',
    '!' + context.RESULT_JS_RENOVATION_PATH + '/**/*.*',
    '!' + context.TRANSPILED_PROD_RENOVATION_PATH + '/**/*.*',
    '!' + renovationPipes.TEMP_PATH + '/**/*.*',
    '!artifacts/npm/**/*.*',
    '!artifacts/js/angular**/*.*',
    '!artifacts/js/angular*',
    '!artifacts/js/knockout*',
    '!artifacts/js/cldr/*.*',
    '!artifacts/js/cldr*',
    '!artifacts/js/globalize/*.*',
    '!artifacts/js/globalize*',
    '!artifacts/js/jquery*',
    '!artifacts/js/jszip*',
    '!artifacts/js/dx.custom*',
    '!artifacts/js/dx-diagram*',
    '!artifacts/js/dx-gantt*',
    '!artifacts/ts/jquery*',
    '!artifacts/ts/knockout*',
    '!artifacts/ts/globalize*',
    '!artifacts/ts/cldr*',
    '!artifacts/css/dx-diagram.*',
    '!artifacts/css/dx-gantt.*'
];

const MODULES = require('./modules_metadata.json');

function createSassStream(destPath) {
    return gulp.parallel(() => {
        return gulp
            .src('scss/**/*')
            .pipe(dataUri())
            .pipe(gulp.dest(destPath));

    }, () => {
        return gulp
            .src('fonts/**/*', { base: '.' })
            .pipe(gulp.dest(destPath + '/widgets/material/typography'));
    }, () => {
        return gulp
            .src('icons/**/*', { base: '.' })
            .pipe(gulp.dest(destPath + '/widgets/base'));
    });
}

const addDefaultExport = lazyPipe().pipe(function() {
    return through.obj(function(chunk, enc, callback) {
        const moduleName = chunk.relative.replace('.js', '').split('\\').join('/');
        const moduleMeta = MODULES.filter(m => m.name === moduleName)[0];

        if(moduleMeta && moduleMeta.exports && moduleMeta.exports.default) {
            chunk.contents = Buffer.from(String(chunk.contents) + 'module.exports.default = module.exports;');
        }
        callback(null, chunk);
    });
});

gulp.task('npm-sources', gulp.series('ts-sources', function() {
    return merge(

        gulp.src(TRANSPILED_GLOBS)
            .pipe(addDefaultExport())
            .pipe(headerPipes.starLicense())
            .pipe(compressionPipes.beautify())
            .pipe(gulp.dest(packagePath)),

        gulp.src(JSON_GLOBS)
            .pipe(gulp.dest(packagePath)),

        gulp.src('build/npm-bin/*.js')
            .pipe(eol('\n'))
            .pipe(gulp.dest(packagePath + '/bin')),

        gulp.src('webpack.config.js')
            .pipe(gulp.dest(packagePath + '/bin')),

        gulp.src('package.json')
            .pipe(replace(version, context.version.package))
            .pipe(gulp.dest(packagePath)),

        gulp.src(DIST_GLOBS)
            .pipe(gulp.dest(packagePath + '/dist')),

        gulp.src('README.md')
            .pipe(gulp.dest(packagePath))
    );
}));

gulp.task('npm-sass', createSassStream(scssPackagePath));

gulp.task('npm-check', gulp.series('ts-modules-check'));

gulp.task('npm', gulp.series('npm-sources', 'npm-check', 'npm-sass'));

module.exports = {
    addDefaultExport,
    createSassStream,
};
