'use strict';

const gulp = require('gulp');
const eol = require('gulp-eol');
const replace = require('gulp-replace');
const merge = require('merge-stream');
const fs = require('fs');

const tasksNPM = require('./npm');
const renovatedComponents = require('../../js/bundles/modules/parts/renovation');
const context = require('./context.js');
const headerPipes = require('./header-pipes.js');
const compressionPipes = require('./compression-pipes.js');
const renovationPipes = require('./renovation-pipes');
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

const TRANSPILED_PROD_RENOVATION_JSON_GLOB = [
    `${context.TRANSPILED_PROD_RENOVATION_PATH}/**/*.json`,
    `!${context.TRANSPILED_PROD_RENOVATION_PATH}/viz/vector_map.utils/**/*`
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
    '!' + renovationPipes.TEMP_PATH + '/**/*.*',
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

gulp.task('rename-renovation-folder', function(done) {
    fs.rename(packagePath + '/dist/js-renovation', packagePath + '/dist/js', function(err) {
        if(err) {
            throw err;
        }
        done();
    });
});

const componentsExpr = renovatedComponents.map(component => ('dxr' + component.name)).join('|');

gulp.task('renovation-npm-sources', gulp.series('ts-sources', function() {
    return merge(

        gulp.src(TRANSPILED_GLOBS)
            .pipe(tasksNPM.addDefaultExport())
            .pipe(headerPipes.starLicense())
            .pipe(compressionPipes.beautify())
            .pipe(gulp.dest(packagePath)),

        gulp.src(TRANSPILED_PROD_RENOVATION_JSON_GLOB)
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
            .pipe(replace(new RegExp(componentsExpr, 'g'), function(match) {
                return match.replace('dxr', 'dx');
            }))
            .pipe(gulp.dest(packagePath + '/dist')),

        gulp.src('README.md')
            .pipe(gulp.dest(packagePath))
    );
}, 'rename-renovation-folder'));

gulp.task('renovation-npm-sass', tasksNPM.createSassStream(scssPackagePath));

gulp.task('renovation-npm', gulp.series('renovation-npm-sources', 'npm-check', 'renovation-npm-sass'));
