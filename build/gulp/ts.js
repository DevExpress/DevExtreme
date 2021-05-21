'use strict';

const gulp = require('gulp');
const file = require('gulp-file');
const footer = require('gulp-footer');
const concat = require('gulp-concat');
const path = require('path');
const replace = require('gulp-replace');
const ts = require('gulp-typescript');
const context = require('./context.js');
const headerPipes = require('./header-pipes.js');
const MODULES = require('./modules_metadata.json');
const { packageDir } = require('./utils');

const OUTPUT_ARTIFACTS_DIR = 'artifacts/ts';

const TS_BUNDLE_FILE = './ts/dx.all.d.ts';
const TS_BUNDLE_SOURCES = [TS_BUNDLE_FILE, './ts/aliases.d.ts'];
const TS_MODULES_GLOB = './js/**/*.d.ts';

const COMMON_TS_COMPILER_OPTIONS = {
    noEmitOnError: true,
    types: ['jquery']
};

const packagePath = `${context.RESULT_NPM_PATH}/${packageDir}`;
const packageBundlesPath = path.join(packagePath, 'bundles');


gulp.task('ts-vendor', function() {
    return gulp.src('./ts/vendor/*')
        .pipe(gulp.dest(OUTPUT_ARTIFACTS_DIR));
});

function bundleTS(jqueryPartFile) {
    return gulp.src([jqueryPartFile].concat(TS_BUNDLE_SOURCES))
        .pipe(concat('dx.all.d.ts'))
        .pipe(headerPipes.bangLicense());
}

gulp.task('ts-bundle', gulp.series(
    function writeTsBundle() {
        return bundleTS('./ts/dx.all-jquery-augmentations.d.ts')
            .pipe(gulp.dest(OUTPUT_ARTIFACTS_DIR)); // will be copied to the npm's /dist folder by another task
    },

    function writeTsBundleForNPM() {
        return bundleTS('./ts/dx.all-jquery-stubs.d.ts')
            .pipe(footer('\nexport default DevExpress;'))
            .pipe(replace('/*!', '/**'))
            .pipe(gulp.dest(packageBundlesPath));
    },

    function writeAngularHack() {
        return file('dx.all.js', '// This file is required to compile devextreme-angular', { src: true })
            .pipe(headerPipes.starLicense())
            .pipe(gulp.dest(packageBundlesPath));
    }
));

gulp.task('ts-jquery-check', function checkJQueryAugmentations() {
    let content = `/// <reference path='${TS_BUNDLE_FILE}' />\n`;
    content += 'import * as $ from \'jquery\';';

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
                    `<DevExpress.${globalPath}>$().${widgetName}('instance');\n`;
            }).join('');
        }).join('\n');

    return file('artifacts/globals.ts', content, { src: true })
        .pipe(ts(COMMON_TS_COMPILER_OPTIONS, ts.reporter.fullReporter()));
});

gulp.task('ts-compilation-check', function() {
    return gulp.src(path.join(OUTPUT_ARTIFACTS_DIR, 'dx.all.d.ts'))
        .pipe(ts(COMMON_TS_COMPILER_OPTIONS, ts.reporter.fullReporter()));
});

gulp.task('ts-modules', function generateModules() {
    const bundleImport = 'import DevExpress from \'../bundles/dx.all\';';

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
        .pipe(gulp.dest(packagePath));
});

gulp.task('ts-sources', gulp.series('ts-modules', 'ts-bundle'));

gulp.task('ts-modules-check', gulp.series('ts-modules', function checkModules() {
    let content = 'import $ from \'jquery\';\n';

    content += MODULES.map(function(moduleMeta) {
        const modulePath = `'./npm/${packageDir}/${moduleMeta.name}'`;
        if(!moduleMeta.exports) {
            return `import ${modulePath};`;
        }

        return Object.keys(moduleMeta.exports).map(function(name) {
            const exportEntry = moduleMeta.exports[name];

            const uniqueIdentifier = moduleMeta.name
                .replace(/\./g, '_')
                .split('/')
                .concat([name])
                .join('__');

            const importIdentifier = name === 'default' ? uniqueIdentifier : `{ ${name} as ${uniqueIdentifier} }`;

            const importStatement = `import ${importIdentifier} from ${modulePath};`;
            const widgetName = widgetNameByPath(exportEntry.path);
            if(exportEntry.isWidget && widgetName) {
                return `$('<div>').${widgetName}();\n${importStatement}`;
            }

            return importStatement;
        }).join('\n');
    }).join('\n');

    return file('artifacts/modules.ts', content, { src: true })
        .pipe(ts(
            Object.assign({}, COMMON_TS_COMPILER_OPTIONS, {
                allowSyntheticDefaultImports: true
            })
        ), ts.reporter.fullReporter());
}));

gulp.task('validate-ts', gulp.series(
    'ts-bundle',
    'ts-compilation-check',
    'ts-jquery-check',
    'ts-modules-check'
));

gulp.task('ts', gulp.series(
    'ts-vendor',
    'ts-bundle',
    'ts-jquery-check',
    'ts-compilation-check'
));

function widgetNameByPath(widgetPath) {
    if(widgetPath.startsWith('ui.dx') || widgetPath.startsWith('viz.dx')) {
        const parts = widgetPath.split('.');
        return parts.length === 2 ? parts[1] : '';
    }
}

exports.GLOB_TS = TS_MODULES_GLOB;
