const gulp = require('gulp');
const file = require('gulp-file');
const concat = require('gulp-concat');
const ts = require('gulp-typescript');

const headerPipes = require('./header-pipes.js');

const OUTPUT_DIR = 'artifacts/ts';
const MODULES = require('./modules_metadata.json');
const TS_PATH = './ts/dx.all.d.ts';

const widgetNameByPath = exports.widgetNameByPath = function(widgetPath) {
    if(widgetPath.startsWith('ui.dx') || widgetPath.startsWith('viz.dx')) {
        const parts = widgetPath.split('.');
        return parts.length === 2 ? parts[1] : '';
    }
};

const getWidgetOptionsPath = (widgetPath) => `${widgetPath}Options`;

exports.getAugmentationOptionsPath = (widgetPath) => widgetNameByPath(widgetPath) ? getWidgetOptionsPath(widgetPath) : '';

exports.generateJQueryAugmentation = function(globalWidgetPath) {
    const widgetName = widgetNameByPath(globalWidgetPath);
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
    let content = `/// <reference path="${TS_PATH}" />\n`;

    content += MODULES
        .map(function(moduleMeta) {
            return Object.keys(moduleMeta.exports || []).map(function(name) {

                if(moduleMeta.isInternal) { return ''; }

                const exportEntry = moduleMeta.exports[name];
                if(!exportEntry.isWidget) { return ''; }

                const globalPath = exportEntry.path;
                const widgetName = widgetNameByPath(globalPath);
                if(!widgetName) { return ''; }

                return `$().${widgetName}();\n` +
                    `<DevExpress.${globalPath}>$().${widgetName}("instance");\n`;
            }).join('');
        }).join('\n');

    return file('artifacts/globals.ts', content, { src: true })
        .pipe(ts({
            noEmitOnError: true
        }, ts.reporter.fullReporter()));
}));

gulp.task('ts-compilation-check', function() {
    return gulp.src(TS_PATH)
        .pipe(ts({
            noEmitOnError: true
        }, ts.reporter.fullReporter()));
});

gulp.task('ts', gulp.series('ts-vendor', 'ts-sources', 'ts-jquery-check', 'ts-compilation-check'));
