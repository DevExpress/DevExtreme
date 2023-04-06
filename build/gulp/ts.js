'use strict';

const gulp = require('gulp');
const file = require('gulp-file');
const footer = require('gulp-footer');
const concat = require('gulp-concat');
const { spawn } = require('child_process');
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
const src = ['./js/**/*.d.ts', '!./js/renovation/**/*'];

const TS_TESTS_PATH = './testing/typescript';

function compileTS(settings) {
    return ts.createProject({
        typescript: require('typescript-min'),
        types: ['jquery'],
        noEmitOnError: true,
        allowJs: true,
        lib: [ 'es6', 'es7', 'es2017.object', 'dom' ],
        strict: true,
        noImplicitAny: false,
        ...settings
    })(ts.reporter.fullReporter());
}

const packagePath = `${context.RESULT_NPM_PATH}/${packageDir}`;
const packageBundlesPath = path.join(packagePath, 'bundles');


gulp.task('ts-copy-vendor', function() {
    return gulp.src('./ts/vendor/*')
        .pipe(gulp.dest(OUTPUT_ARTIFACTS_DIR));
});

function bundleTS() {
    return gulp.src(TS_BUNDLE_SOURCES)
        .pipe(concat('dx.all.d.ts'))
        .pipe(headerPipes.bangLicense());
}

gulp.task('ts-copy-bundle', gulp.series(
    function writeTsBundle() {
        return bundleTS()
            .pipe(replace(/^declare global\s*{([\s\S]*?)^}/gm, '$1'))
            .pipe(gulp.dest(OUTPUT_ARTIFACTS_DIR)); // will be copied to the npm's /dist folder by another task
    },

    function writeTsBundleForNPM() {
        return bundleTS()
            .pipe(footer('\nexport default DevExpress;'))
            .pipe(replace('/*!', '/**'))
            .pipe(replace(/(interface JQuery\b[\s\S]*?{)[\s\S]+?(})/gm, '$1$2'))
            .pipe(gulp.dest(packageBundlesPath));
    },

    function writeAngularHack() {
        return file('dx.all.js', '// This file is required to compile devextreme-angular', { src: true })
            .pipe(headerPipes.starLicense())
            .pipe(gulp.dest(packageBundlesPath));
    }
));

gulp.task('ts-check-jquery', function() {
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
        .pipe(compileTS());
});

gulp.task('ts-check-bundle', function() {

    return gulp.src(path.join(OUTPUT_ARTIFACTS_DIR, 'dx.all.d.ts'))
        .pipe(compileTS());
});

gulp.task('ts-check-modules', function() {
    return gulp.src(src)
        .pipe(compileTS());
});

gulp.task('ts-copy-modules', function() {
    const BUNDLE_IMPORT = 'import DevExpress from \'../bundles/dx.all\';';

    return gulp.src(src)
        /* legacy modules */
        .pipe(file('events/click.d.ts', BUNDLE_IMPORT))
        .pipe(file('events/contextmenu.d.ts', BUNDLE_IMPORT))
        .pipe(file('events/dblclick.d.ts', BUNDLE_IMPORT))
        .pipe(file('events/drag.d.ts', BUNDLE_IMPORT))
        .pipe(file('events/hold.d.ts', BUNDLE_IMPORT))
        .pipe(file('events/hover.d.ts', BUNDLE_IMPORT))
        .pipe(file('events/pointer.d.ts', BUNDLE_IMPORT))
        .pipe(file('events/swipe.d.ts', BUNDLE_IMPORT))
        .pipe(file('events/transform.d.ts', BUNDLE_IMPORT))
        .pipe(file('integration/jquery.d.ts', 'import \'jquery\';'))

        .pipe(headerPipes.starLicense())
        .pipe(gulp.dest(packagePath));
});

gulp.task('ts-sources', gulp.series('ts-copy-modules', 'ts-copy-bundle'));

gulp.task('ts-check-public-modules', gulp.series('ts-copy-modules', function() {
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
        .pipe(compileTS({ allowSyntheticDefaultImports: true }));
}));

gulp.task('test-ts', gulp.series(
    (callback) => {
        spawn('npm', ['i', '--no-audit', '--no-fund'], { shell: true, cwd: TS_TESTS_PATH })
            .on('error', callback)
            .on('close', code => code ? callback(new Error(code)) : callback());
    },
    () => {
        return gulp
            .src([
                `${TS_TESTS_PATH}/**/*.ts`,
                `!${TS_TESTS_PATH}/node_modules/**/*`,
            ])
            .pipe(compileTS({
                'esModuleInterop': true,
                'moduleResolution': 'node',
                'noEmit': true,
                'skipLibCheck': true,
                'typeRoots': [],
                'target': 'es2015',
                'baseUrl': `${TS_TESTS_PATH}`,
                'paths': {
                    '*': ['node_modules/*']
                },
            }));
    }
));

gulp.task('validate-ts', gulp.series(
    'ts-check-modules',
    'ts-copy-bundle',
    'ts-check-bundle',
    'ts-check-jquery',
    'ts-check-public-modules'
));

gulp.task('ts', gulp.series(
    'ts-copy-vendor',
    'ts-copy-bundle',
    'ts-check-jquery',
    'ts-check-bundle'
));

function widgetNameByPath(widgetPath) {
    if(widgetPath.startsWith('ui.dx') || widgetPath.startsWith('viz.dx')) {
        const parts = widgetPath.split('.');
        return parts.length === 2 ? parts[1] : '';
    }
}
