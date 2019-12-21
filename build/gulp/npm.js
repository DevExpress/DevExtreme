var gulp = require('gulp');
var eol = require('gulp-eol');
var replace = require('gulp-replace');
var merge = require('merge-stream');
var through = require('through2');
var lazyPipe = require('lazypipe');

var context = require('./context.js');
var headerPipes = require('./header-pipes.js');
var compressionPipes = require('./compression-pipes.js');
var version = require('../../package.json').version;
var packagePath = context.RESULT_NPM_PATH + '/devextreme';

var TRANSPILED_GLOBS = [
    context.TRANSPILED_PATH + '/**/*.js',
    '!' + context.TRANSPILED_PATH + '/bundles/*.js',
    '!' + context.TRANSPILED_PATH + '/bundles/modules/parts/*.js',
    '!' + context.TRANSPILED_PATH + '/viz/vector_map.utils/*.js',
    '!' + context.TRANSPILED_PATH + '/viz/docs/*.js'
];

var JSON_GLOBS = [
    'js/**/*.json',
    '!js/viz/vector_map.utils/*.*'
];

var DIST_GLOBS = [
    'artifacts/**/*.*',
    '!' + context.TRANSPILED_PATH + '/**/*.*',
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

var MODULES = require('./modules_metadata.json');

var addDefaultExport = lazyPipe().pipe(function() {
    return through.obj(function(chunk, enc, callback) {
        var moduleName = chunk.relative.replace('.js', '').split('\\').join('/'),
            moduleMeta = MODULES.filter(m => m.name === moduleName)[0];

        if(moduleMeta && moduleMeta.exports && moduleMeta.exports.default) {
            chunk.contents = new Buffer(String(chunk.contents) + 'module.exports.default = module.exports;');
        }
        callback(null, chunk);
    });
});

gulp.task('npm-sources', gulp.series('ts-sources', function() {
    return merge(

        gulp.src(TRANSPILED_GLOBS)
            .pipe(compressionPipes.removeDebug())
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

gulp.task('npm-check', gulp.series('ts-modules-check'));

gulp.task('npm', gulp.series('npm-sources', 'npm-check', 'npm-less'));
