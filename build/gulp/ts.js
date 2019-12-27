var gulp = require('gulp');
var file = require('gulp-file');
var concat = require('gulp-concat');
var ts = require('gulp-typescript');

var headerPipes = require('./header-pipes.js');

var OUTPUT_DIR = 'artifacts/ts';
var MODULES = require('./modules_metadata.json');
var TS_PATH = './ts/dx.all.d.ts';

var widgetNameByPath = exports.widgetNameByPath = function(widgetPath) {
    if(widgetPath.startsWith('ui.dx') || widgetPath.startsWith('viz.dx')) {
        var parts = widgetPath.split('.');
        return parts.length === 2 ? parts[1] : '';
    }
};

exports.getAugmentationOptionsPath = (widgetPath) => widgetNameByPath(widgetPath) ? getWidgetOptionsPath(widgetPath) : '';

var getWidgetOptionsPath = (widgetPath) => `${widgetPath}Options`;

exports.generateJQueryAugmentation = function(globalWidgetPath) {
    var widgetName = widgetNameByPath(globalWidgetPath);
    if(!widgetName) return '';

    return 'interface JQuery {\n' +
           `    ${widgetName}(): JQuery;\n` +
           `    ${widgetName}(options: "instance"): DevExpress.${globalWidgetPath};\n` +
           `    ${widgetName}(options: string): any;\n` +
           `    ${widgetName}(options: string, ...params: any[]): any;\n` +
           `    ${widgetName}(options: DevExpress.${getWidgetOptionsPath(globalWidgetPath)}): JQuery;\n` +
           '}\n';
};

gulp.task('ts-vendor', function() {
    return gulp.src('./ts/vendor/*')
        .pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('ts-sources', function() {
    return gulp.src([TS_PATH, './ts/aliases.d.ts'])
        .pipe(concat('dx.all.d.ts'))
        .pipe(headerPipes.bangLicense())
        .pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('ts-jquery-check', gulp.series('ts-sources', function() {
    var content = `/// <reference path="${TS_PATH}" />\n`;
    content += 'import * as $ from \'jquery\';';

    content += MODULES
        .map(function(moduleMeta) {
            return Object.keys(moduleMeta.exports || []).map(function(name) {

                if(moduleMeta.isInternal) { return ''; }

                const exportEntry = moduleMeta.exports[name];
                if(!exportEntry.isWidget) { return ''; }

                var globalPath = exportEntry.path;
                var widgetName = widgetNameByPath(globalPath);
                if(!widgetName) { return ''; }

                return `$().${widgetName}();\n` +
                    `<DevExpress.${globalPath}>$().${widgetName}("instance");\n`;
            }).join('');
        }).join('\n');

    const tsProject = ts.createProject('build/gulp/tsconfig.json');
    return file('artifacts/globals.ts', content, { src: true })
        .pipe(tsProject(ts.reporter.fullReporter()));
}));

gulp.task('ts-compilation-check', function() {
    const tsProject = ts.createProject('build/gulp/tsconfig.json');
    return gulp.src(TS_PATH)
        .pipe(tsProject(ts.reporter.fullReporter()));
});

gulp.task('ts', gulp.series('ts-vendor', 'ts-sources', 'ts-jquery-check', 'ts-compilation-check'));
