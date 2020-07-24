'use strict';

const gulp = require('gulp');
const eol = require('gulp-eol');
const replace = require('gulp-replace');
const merge = require('merge-stream');
const through = require('through2');
const lazyPipe = require('lazypipe');
const dataUri = require('./gulp-data-uri').gulpPipe;
const fs = require('fs');

const context = require('./context.js');
const headerPipes = require('./header-pipes.js');
const compressionPipes = require('./compression-pipes.js');
const version = require('../../package.json').version;
const packagePath = context.RESULT_NPM_PATH + '/devextreme-renovation';
const scssPackagePath = packagePath + '/scss';

const TRANSPILED_GLOBS = [
    context.TRANSPILED_PROD_RENOVATION_PATH + '/**/*.js',
    '!' + context.TRANSPILED_PROD_PATH + '/**/*.*',
    '!' + context.TRANSPILED_PROD_RENOVATION_PATH + '/bundles/*.js',
    '!' + context.TRANSPILED_PROD_RENOVATION_PATH + '/bundles/modules/parts/*.js',
    '!' + context.TRANSPILED_PROD_RENOVATION_PATH + '/viz/vector_map.utils/*.js',
    '!' + context.TRANSPILED_PROD_RENOVATION_PATH + '/viz/docs/*.js'
];

const JSON_GLOBS = [
    'js/**/*.json',
    '!js/viz/vector_map.utils/*.*'
];

const DIST_GLOBS = [
    'artifacts/**/*.*',
    '!' + context.TRANSPILED_PROD_RENOVATION_PATH + '/**/*.*',
    '!' + context.RESULT_JS_PATH + '/**/*.*',
    '!' + context.TRANSPILED_PROD_PATH + '/**/*.*',
    '!artifacts/npm/**/*.*',
    '!artifacts/js-renovation/angular**/*.*',
    '!artifacts/js-renovation/angular*',
    '!artifacts/js-renovation/knockout*',
    '!artifacts/js-renovation/cldr/*.*',
    '!artifacts/js-renovation/cldr*',
    '!artifacts/js-renovation/globalize/*.*',
    '!artifacts/js-renovation/globalize*',
    '!artifacts/js-renovation/jquery*',
    '!artifacts/js-renovation/jszip*',
    '!artifacts/js-renovation/dx.custom*',
    '!artifacts/js-renovation/dx-diagram*',
    '!artifacts/js-renovation/dx-gantt*',
    '!artifacts/ts/jquery*',
    '!artifacts/ts/knockout*',
    '!artifacts/ts/globalize*',
    '!artifacts/ts/cldr*',
    '!artifacts/css/dx-diagram.*',
    '!artifacts/css/dx-gantt.*'
];

const MODULES = require('./modules_metadata.json');

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

gulp.task('rename-renovation-folder', function(done) {
    fs.rename(packagePath + '/dist/js-renovation', packagePath + '/dist/js', function(err) {
        if(err) {
            throw err;
        }
        done();
    });
});

gulp.task('renovation-npm-sources', gulp.series('ts-sources', function() {
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
            .pipe(replace(new RegExp('dxrButton|dxrPager', 'g'), function(match) {
                return match.replace('dxr', 'dx');
                // return 'dxButton';
            }))
            .pipe(gulp.dest(packagePath + '/dist')),

        gulp.src('README.md')
            .pipe(gulp.dest(packagePath))
    );
}, 'rename-renovation-folder'));

gulp.task('renovation-npm-sass', gulp.parallel(() => {
    return gulp
        .src('scss/**/*')
        .pipe(dataUri())
        .pipe(gulp.dest(scssPackagePath));

}, () => {
    return gulp
        .src('fonts/**/*', { base: '.' })
        .pipe(gulp.dest(scssPackagePath + '/widgets/material/typography'));
}, () => {
    return gulp
        .src('icons/**/*', { base: '.' })
        .pipe(gulp.dest(scssPackagePath + '/widgets/base'));
}));


// gulp.task('npm-check', gulp.series('ts-modules-check'));  // from old code

gulp.task('renovation-npm', gulp.series('renovation-npm-sources', 'npm-check', 'renovation-npm-sass'));

// const renovationWidgets = [];

// gulp.task('renovation-npm', function() {
//     return gulp.src([context.RESULT_NPM_PATH + '/devextreme/**/*'])
//         .pipe(replace(/renovation\.dxr[A-Z, a-z]*/g, (match) => {
//             const widgetName = match.match(/([A-Z])\w+/g)[0];
//             renovationWidgets.push(widgetName);
//             return match.replace('renovation.dxr', 'renovation.dx');
//         }))
//         .pipe(replace('renovation.dxr', (match, p1, offset, string) => {
//             // console.log(match);
//             // renovationWidgets.push(String(p1).match(/renovation\.dxr[A-Z, a-z]*/g));
//             // console.log(renovationWidgets.join(' - '));
//             return match;
//         }))
//         .pipe(gulp.dest(context.RESULT_NPM_PATH + '/devextreme-renovation'));
// });
