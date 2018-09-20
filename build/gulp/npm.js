var gulp = require('gulp');
var footer = require('gulp-footer');
var eol = require('gulp-eol');
var replace = require('gulp-replace');
var merge = require('merge-stream');
var file = require('gulp-file');
var path = require('path');
var ts = require('gulp-typescript');
var runSequence = require('run-sequence');
var through = require('through2');
var lazyPipe = require('lazypipe');

var context = require('./context.js');
var headerPipes = require('./header-pipes.js');
var compressionPipes = require('./compression-pipes.js');
var version = require('../../package.json').version;

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
    '!' + context.TRANSPILED_PATH + "/**/*.*",
    '!artifacts/npm/**/*.*',
    '!artifacts/js/dx.aspnet.mvc.js',
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
    '!artifacts/js/quill*',
    '!artifacts/js/Quill*',
    '!artifacts/js/turndown*',
    '!artifacts/js/showdown*',
    '!artifacts/ts/jquery*',
    '!artifacts/ts/knockout*',
    '!artifacts/ts/globalize*',
    '!artifacts/ts/cldr*',
    '!artifacts/css/dx*legacy*.css'
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

gulp.task('npm-sources', ['npm-dts-generator'], function() {
    return merge(

        gulp.src(TRANSPILED_GLOBS)
            .pipe(compressionPipes.removeDebug())
            .pipe(addDefaultExport())
            .pipe(headerPipes.starLicense())
            .pipe(compressionPipes.beautify())
            .pipe(gulp.dest(context.RESULT_NPM_PATH)),

        gulp.src(JSON_GLOBS)
            .pipe(gulp.dest(context.RESULT_NPM_PATH)),

        gulp.src('build/npm-bin/*.js')
            .pipe(eol('\n'))
            .pipe(gulp.dest(context.RESULT_NPM_PATH + '/bin')),

        gulp.src('webpack.config.js')
            .pipe(gulp.dest(context.RESULT_NPM_PATH + '/bin')),

        gulp.src('package.json')
            .pipe(replace(version, context.version.package))
            .pipe(gulp.dest(context.RESULT_NPM_PATH)),

        gulp.src(DIST_GLOBS)
            .pipe(gulp.dest(context.RESULT_NPM_PATH + '/dist')),

        gulp.src('README.md')
            .pipe(gulp.dest(context.RESULT_NPM_PATH))
    );
});

var widgetNameByPath = require("./ts").widgetNameByPath;
var generateJQueryAugmentation = require("./ts").generateJQueryAugmentation;
var getAugmentationOptionsPath = require("./ts").getAugmentationOptionsPath;

gulp.task('npm-dts-generator', function() {
    var tsModules = MODULES.map(function(moduleMeta) {
        var relPath = path.relative(path.dirname(moduleMeta.name), 'bundles/dx.all').replace(/\\/g, '/');
        if(!relPath.startsWith('../')) relPath = './' + relPath;

        var exports = '';
        if(moduleMeta.exports) {
            var exportNames = Object.keys(moduleMeta.exports);
            var exportProperties = exportNames.map(function(name) {
                var globalPath = moduleMeta.exports[name];
                if(name !== 'default') {
                    return `export declare let ${name}: typeof DevExpress.${globalPath};`;
                }

                var jQueryAugmentation = generateJQueryAugmentation(name, globalPath);
                if(jQueryAugmentation) {
                    jQueryAugmentation = `declare global {\n${jQueryAugmentation}}\n`;
                }

                var result = jQueryAugmentation + `export default DevExpress.${globalPath};`;

                var widgetOptionsPath = getAugmentationOptionsPath(globalPath);
                if(widgetOptionsPath) {
                    result += `\nexport type IOptions = DevExpress.${widgetOptionsPath};`;
                }

                return result;
            });

            exports = '\n\n' + exportProperties.join('\n');
        }

        var name = moduleMeta.name + '.d.ts',
            content = 'import DevExpress from \'' + relPath + '\';' + exports;

        if(moduleMeta.name === 'integration/jquery') {
            content = 'import \'jquery\';';
        }

        return file(name, content, { src: true });
    });


    return merge(
        gulp.src('artifacts/ts/dx.all.d.ts')
            .pipe(replace('/*!', '/**'))
            .pipe(replace(/\/\*\s*#StartGlobalDeclaration\s*\*\//g, 'declare global {'))
            .pipe(replace(/\/\*\s*#EndGlobalDeclaration\s*\*\//g, '}'))
            .pipe(footer('\nexport default DevExpress;'))
            .pipe(gulp.dest(path.join(context.RESULT_NPM_PATH, 'bundles'))),

        merge.apply(merge, tsModules)
            .pipe(headerPipes.starLicense())
            .pipe(gulp.dest(context.RESULT_NPM_PATH))
    );
});

gulp.task('npm-dts-check', ['npm-dts-generator'], function() {
    var content = 'import $ from \'jquery\';\n';

    content += MODULES.map(function(moduleMeta) {
        var modulePath = '\'./npm/' + moduleMeta.name + '\'';
        if(!moduleMeta.exports) {
            return 'import ' + modulePath + ';';
        }

        return Object.keys(moduleMeta.exports).map(function(name) {
            var uniqueIdentifier = moduleMeta.name.split('\/').concat([name]).join('__');
            var importIdentifier = name === 'default' ? uniqueIdentifier : `{ ${name} as ${uniqueIdentifier} }`;

            var widgetName = widgetNameByPath(moduleMeta.exports[name]);
            var checkJQueryAugmentation = widgetName ? `$('<div>').${widgetName}();\n` : '';

            return checkJQueryAugmentation + `import ${importIdentifier} from ${modulePath};`;
        }).join('\n');
    }).join('\n');

    return file('artifacts/modules.ts', content, { src: true })
        .pipe(ts({
            allowSyntheticDefaultImports: true,
            noEmitOnError: true
        }, ts.reporter.fullReporter()));
});

gulp.task('npm-check', ['npm-dts-check']);

gulp.task('npm', function(callback) {
    return runSequence(
        'npm-sources',
        'npm-check',
        callback);
});
