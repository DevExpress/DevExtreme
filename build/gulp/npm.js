var gulp = require('gulp');
var footer = require('gulp-footer');
var eol = require('gulp-eol');
var replace = require('gulp-replace');
var merge = require('merge-stream');
var file = require('gulp-file');
var fs = require('fs');
var path = require('path');
var ts = require('gulp-typescript');
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
    '!' + context.TRANSPILED_PATH + "/**/*.*",
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

var widgetNameByPath = require("./ts").widgetNameByPath;
var generateJQueryAugmentation = require("./ts").generateJQueryAugmentation;
var getAugmentationOptionsPath = require("./ts").getAugmentationOptionsPath;

gulp.task('npm-ts-modules-generator', gulp.series('ts-sources', function() {
    var tsModules = MODULES.map(function(moduleMeta) {
        var relPath = path.relative(path.dirname(moduleMeta.name), 'bundles/dx.all').replace(/\\/g, '/');
        if(!relPath.startsWith('../')) relPath = './' + relPath;

        var exports = '';
        if(moduleMeta.exports) {
            var exportNames = Object.keys(moduleMeta.exports);
            var exportProperties = exportNames.map(function(name) {
                const exportEntry = moduleMeta.exports[name];

                if(name !== 'default') {
                    switch(moduleMeta.exports[name].exportAs) {
                        case "type":
                            return `export type ${name} = DevExpress.${exportEntry.path};`;
                    }
                    return `export declare let ${name}: typeof DevExpress.${exportEntry.path};`;
                }

                let result = '';

                if(exportEntry.isWidget) {
                    var jQueryAugmentation = generateJQueryAugmentation(exportEntry.path);
                    if(jQueryAugmentation) {
                        result += `declare global {\n${jQueryAugmentation}}\n`;
                    }
                }

                result += `export default DevExpress.${exportEntry.path};`;

                var widgetOptionsPath = getAugmentationOptionsPath(exportEntry.path);
                if(widgetOptionsPath) {
                    result += `\nexport type Options = DevExpress.${widgetOptionsPath};`;
                    result += `\n\n/** @deprecated use Options instead */`;
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


    fs.writeFileSync(path.join(packagePath, 'bundles/dx.all.js'), '// This file is required to compile devextreme-angular');

    return merge(
        gulp.src('artifacts/ts/dx.all.d.ts')
            .pipe(replace('/*!', '/**'))
            .pipe(replace(/\/\*\s*#StartGlobalDeclaration\s*\*\//g, 'declare global {'))
            .pipe(replace(/\/\*\s*#EndGlobalDeclaration\s*\*\//g, '}'))
            .pipe(replace(/\/\*\s*#StartJQueryAugmentation\s*\*\/[\s\S]*\/\*\s*#EndJQueryAugmentation\s*\*\//g, ''))
            .pipe(footer('\nexport default DevExpress;'))
            .pipe(gulp.dest(path.join(packagePath, 'bundles'))),

        merge.apply(merge, tsModules)
            .pipe(headerPipes.starLicense())
            .pipe(gulp.dest(packagePath))
    );
}));

gulp.task('npm-sources', gulp.series('npm-ts-modules-generator', function() {
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

gulp.task('npm-ts-modules-check', gulp.series('npm-ts-modules-generator', function() {
    var content = 'import $ from \'jquery\';\n';

    content += MODULES.map(function(moduleMeta) {
        var modulePath = '\'./npm/devextreme/' + moduleMeta.name + '\'';
        if(!moduleMeta.exports) {
            return 'import ' + modulePath + ';';
        }

        return Object.keys(moduleMeta.exports).map(function(name) {
            const exportEntry = moduleMeta.exports[name];

            var uniqueIdentifier = moduleMeta.name
                .replace(/\./g, '_')
                .split('/')
                .concat([name])
                .join('__');

            var importIdentifier = name === 'default' ? uniqueIdentifier : `{ ${name} as ${uniqueIdentifier} }`;

            const importStatement = `import ${importIdentifier} from ${modulePath};`;
            var widgetName = widgetNameByPath(exportEntry.path);
            if(exportEntry.isWidget && widgetName) {
                return `$('<div>').${widgetName}();\n${importStatement}`;
            }

            return importStatement;
        }).join('\n');
    }).join('\n');

    return file('artifacts/modules.ts', content, { src: true })
        .pipe(ts({
            allowSyntheticDefaultImports: true,
            noEmitOnError: true
        }, ts.reporter.fullReporter()));
}));

gulp.task('npm-check', gulp.series('npm-ts-modules-check'));

gulp.task('npm', gulp.series('npm-sources', 'npm-check', 'npm-less'));
