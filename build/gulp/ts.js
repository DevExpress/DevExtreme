var gulp = require('gulp');
var file = require('gulp-file');
var footer = require('gulp-footer');
const fs = require('fs');
var concat = require('gulp-concat');
var map = require('map-stream');
var path = require('path');
var replace = require('gulp-replace');
var ts = require('gulp-typescript');

var context = require('./context.js');
var headerPipes = require('./header-pipes.js');
var MODULES = require('./modules_metadata.json');

var PACKAGE_DIR = context.RESULT_NPM_PATH + '/devextreme';
var DIST_DIR = PACKAGE_DIR + '/dist';
var OUTPUT_ARTIFACTS_DIR = 'artifacts/ts';
var OUTPUT_PACKAGE_DIR = path.join(PACKAGE_DIR, 'bundles');
var TS_BUNDLE_FILE = './ts/dx.all.d.ts';
var TS_BUNDLE_SOURCES = [TS_BUNDLE_FILE, './ts/aliases.d.ts'];
var TS_MODULES_GLOB = './js/**/*.d.ts';

gulp.task('ts-vendor', function() {
    return gulp.src('./ts/vendor/*')
        .pipe(gulp.dest(OUTPUT_ARTIFACTS_DIR));
});

gulp.task('ts-bundle', function writeTsBundle() {
    return gulp.src(TS_BUNDLE_SOURCES)
        .pipe(concat('dx.all.d.ts'))
        .pipe(headerPipes.bangLicense())
        .pipe(gulp.dest(OUTPUT_ARTIFACTS_DIR)) // will be copied to the npm's /dist folder by another task
        .pipe(replace('/*!', '/**'))
        .pipe(replace(/\/\*\s*#StartGlobalDeclaration\s*\*\//g, 'declare global {'))
        .pipe(replace(/\/\*\s*#EndGlobalDeclaration\s*\*\//g, '}'))
        .pipe(replace(/\/\*\s*#StartJQueryAugmentation\s*\*\/[\s\S]*\/\*\s*#EndJQueryAugmentation\s*\*\//g, ''))
        .pipe(footer('\nexport default DevExpress;'))
        .pipe(gulp.dest(OUTPUT_PACKAGE_DIR));
});

gulp.task('ts-jquery-check', gulp.series('ts-bundle', function checkJQueryAugmentations() {
    var content = `/// <reference path='${TS_BUNDLE_FILE}' />\n`;

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
                    `<DevExpress.${globalPath}>$().${widgetName}('instance');\n`;
            }).join('');
        }).join('\n');

    return file('artifacts/globals.ts', content, { src: true })
        .pipe(ts({
            noEmitOnError: true
        }, ts.reporter.fullReporter()));
}));

gulp.task('ts-compilation-check', function() {
    return gulp.src(TS_BUNDLE_FILE)
        .pipe(ts({
            noEmitOnError: true
        }, ts.reporter.fullReporter()));
});

gulp.task('ts-modules', function generateModules() {
    var bundleImport = 'import DevExpress from \'../bundles/dx.all\';';

    return gulp.src(TS_MODULES_GLOB)
        /* legacy modules */
        .pipe(file('events/click.d.ts', bundleImport))
        .pipe(file('events/contextmenu.d.ts', bundleImport))
        .pipe(file('events/dblclick.d.ts', bundleImport))
        .pipe(file('events/drag.d.ts', bundleImport))
        .pipe(file('events/hold.d.ts', bundleImport))
        .pipe(file('events/hover.d.ts', bundleImport))
        .pipe(file('events/pointer.d.ts', bundleImport))
        .pipe(file('events/swipe.d.ts', bundleImport))
        .pipe(file('events/transform.d.ts', bundleImport))
        .pipe(file('integration/jquery.d.ts', 'import \'jquery\';'))

        .pipe(headerPipes.starLicense())
        .pipe(gulp.dest(PACKAGE_DIR));
});

gulp.task('ts-angular-hack', function() {
    return gulp.src([PACKAGE_DIR + '/**/*.d.ts', '!' + DIST_DIR + '/**/*.*'])
        .pipe(map(function(file, callback) {
            const jsPath = file.path.replace('.d.ts', '.js');
            if(fs.existsSync(jsPath)) {
                callback();
                return;
            }

            file.path = jsPath;
            file.contents = Buffer.from('// This file is required to compile devextreme-angular');
            callback(null, file);
        }))
        .pipe(headerPipes.starLicense())
        .pipe(gulp.dest(PACKAGE_DIR));
});

gulp.task('ts-sources', gulp.series('ts-modules', 'ts-bundle', 'ts-angular-hack'));

gulp.task('ts-modules-check', gulp.series('ts-modules', function checkModules() {
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

gulp.task('ts', gulp.series(
    'ts-vendor',
    'ts-bundle',
    'ts-jquery-check',
    'ts-compilation-check'
));

function widgetNameByPath(widgetPath) {
    if(widgetPath.startsWith('ui.dx') || widgetPath.startsWith('viz.dx')) {
        var parts = widgetPath.split('.');
        return parts.length === 2 ? parts[1] : '';
    }
}

exports.GLOB_TS = TS_MODULES_GLOB;
