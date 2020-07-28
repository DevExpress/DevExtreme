'use strict';

const gulp = require('gulp');
const eol = require('gulp-eol');
const replace = require('gulp-replace');
const merge = require('merge-stream');
const through = require('through2');
const lazyPipe = require('lazypipe');
const dataUri = require('./gulp-data-uri').gulpPipe;
const fs = require('fs');
const header = require('gulp-header');
const rename = require('gulp-rename');
const gulpEach = require('gulp-each');

const renovatedComponents = require('../../js/bundles/modules/parts/renovation');
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

const componentsExpr = renovatedComponents.map(component => ('dxr' + component.name)).join('|');

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
            .pipe(replace(new RegExp(componentsExpr, 'g'), function(match) {
                return match.replace('dxr', 'dx');
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

gulp.task('generate-renovation-config', function() {
    const pathToTemplate = 'js/bundles/modules/parts/widgets-base.js';
    const resultPath = 'js/bundles/modules/parts/';

    return gulp.src(pathToTemplate)
        .pipe(rename(function(path) {
            path.basename = context.RENOVATION_WIDGETS_BASE;
        }))
        .pipe(header('// !!! AUTO-GENERATED FILE, DO NOT EDIT.\n\n'))
        .pipe(gulpEach(function(content, file, callback) {
            let fileLines = content.split('\n');

            renovatedComponents.forEach((component) => {
                let isComponentExists = false;
                const componentImport = `ui.dx${component.name} = require('../../../renovation/${component.pathInRenovationFolder}').default;`;

                fileLines = fileLines.reduce((accumulator, line) => {
                    if(line.indexOf(`dx${component.name} =`) !== -1) {
                        isComponentExists = true;
                        accumulator.push(componentImport);
                    } else {
                        accumulator.push(line);
                    }
                    return accumulator;
                }, []);

                if(!isComponentExists) {
                    fileLines.push(componentImport);
                }
            });

            const fileContext = fileLines.join('\n');
            callback(null, fileContext);
        }))
        .pipe(eol('\n'))
        .pipe(gulp.dest(resultPath));
});

gulp.task('renovation-npm', gulp.series('renovation-npm-sources', 'npm-check', 'renovation-npm-sass'));
