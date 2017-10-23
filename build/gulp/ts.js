// jshint node:true

"use strict";

var gulp = require('gulp');
var concat = require('gulp-concat');
var replace = require('gulp-replace');
var file = require('gulp-file');
var runSequence = require('run-sequence');
var ts = require('gulp-typescript');

var headerPipes = require('./header-pipes.js');

var definitionSources = [
    'core',
    'widgets-base',
    'widgets-mobile',
    'widgets-web',
    'framework',
    'viz-core',
    'viz-charts',
    'viz-gauges',
    'viz-funnel',
    'viz-rangeselector',
    'viz-vectormap',
    'viz-sparklines',
    'viz-treemap'
].map(i => './ts/legacy/' + i + '.d.ts');

var OUTPUT_DIR = 'artifacts/ts';
var MODULES = require('./modules_metadata.json');
var TS = require('./ts_metadata.json');

var widgetNameByPath = exports.widgetNameByPath = function(path) {
    if(path.startsWith('ui.dx') || path.startsWith('viz.dx')) {
        return path.split('.')[1];
    }
};

var widgetOptionsPathByPath = function(path) {
    var widgetName = widgetNameByPath(path);
    var tsWidgetMetadata = TS.filter((d) => d.widgetName === widgetName)[0];

    return tsWidgetMetadata ? tsWidgetMetadata.optionsPath : `${path}Options`;
};

var generateJQueryAugmentation = exports.generateJQueryAugmentation = function(exportName, globalPath) {
    var widgetName = widgetNameByPath(globalPath);
    if(!widgetName) return '';

    var widgetOptionsPath = widgetOptionsPathByPath(globalPath);
    return `interface JQuery {\n` +
           `    ${widgetName}(): JQuery;\n` +
           `    ${widgetName}(options: "instance"): DevExpress.${globalPath};\n` +
           `    ${widgetName}(options: string): any;\n` +
           `    ${widgetName}(options: string, ...params: any[]): any;\n` +
           `    ${widgetName}(options: DevExpress.${widgetOptionsPath}): JQuery;\n` +
           `}\n`;
};

gulp.task('ts-vendor', function() {
    return gulp.src('./ts/vendor/*')
        .pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('ts-sources', function() {
    return gulp.src('./ts/dx.all.d.ts')
        .pipe(headerPipes.bangLicense())
        .pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('ts-sources-legacy', function() {
    var jQueryAugmentation = MODULES.map(function(moduleMeta) {
        return Object.keys(moduleMeta.exports || []).map(function(name) {
            return generateJQueryAugmentation(name, moduleMeta.exports[name]);
        }).join('');
    }).join('\n');

    return gulp.src(definitionSources)
        .pipe(file('jquery-augmentation.d.ts', jQueryAugmentation))
        .pipe(concat('dx.all.legacy.d.ts'))
        .pipe(replace(/\/\/[^\r\n]+/g, ''))
        .pipe(replace(/^\s*[\r\n]+/gm, ''))
        .pipe(headerPipes.bangLicense())
        .pipe(gulp.dest(OUTPUT_DIR));
});

gulp.task('ts-check', ['ts-sources'], function() {
    var content = '/// <reference path="./ts/dx.all.d.ts" />\n';

    content += MODULES.map(function(moduleMeta) {
        return Object.keys(moduleMeta.exports || []).map(function(name) {
            var globalPath = moduleMeta.exports[name];
            var widgetName = widgetNameByPath(globalPath);
            if(!widgetName) return '';

            return `$().${widgetName}();\n` +
                   `<DevExpress.${globalPath}>$().${widgetName}("instance");\n`;
        }).join('');
    }).join('\n');

    return file('artifacts/globals.ts', content, { src: true })
        .pipe(ts({
            noEmitOnError: true
        }, ts.reporter.fullReporter()));
});

gulp.task('ts', function(callback) {
    return runSequence(
        'ts-vendor',
        'ts-sources',
        'ts-sources-legacy',
        'ts-check',
        callback);
});
