/* eslint-env node */
/* eslint-disable no-console */

const gulp = require('gulp');
const multiProcess = require('gulp-multi-process');
const env = require('./build/gulp/env-variables');
const cache = require('gulp-cache');
const shell = require('gulp-shell');
const context = require('./build/gulp/context');
const { REMOVE_NON_PRODUCTION_MODULE } = context;

gulp.task('clean', function(callback) {
    require('del').sync([
        'artifacts/**',
        '!artifacts',
        '!artifacts/css',
        '!artifacts/css/*',
        '!artifacts/css/fonts',
        '!artifacts/css/fonts/*',
        '!artifacts/css/icons',
        '!artifacts/css/icons/*',
        '!artifacts/npm',
        '!artifacts/npm/devextreme',
        '!artifacts/npm/devextreme/*.json',
        '!artifacts/npm/devextreme-dist',
    ]);
    cache.clearAll();
    callback();
});

require('./build/gulp/bundler-config');
require('./build/gulp/transpile');
require('./build/gulp/js-bundles');
require('./build/gulp/npm');
require('./build/gulp/aspnet');
require('./build/gulp/vendor');
require('./build/gulp/ts');
require('./build/gulp/localization');
require('./build/gulp/check_licenses');
require('./build/gulp/systemjs');
require('./build/gulp/state_manager');

function getTranspileConfig() {
    if(env.TEST_CI) {
        return 'ci';
    }

    if(env.BUILD_INTERNAL_PACKAGE) {
        return 'internal';
    }

    return '';
}

const transpileConfig = getTranspileConfig();

gulp.task('transpile', shell.task(
    transpileConfig
        ? `pnpm nx run devextreme:build:transpile -c ${transpileConfig}`
        : 'pnpm nx run devextreme:build:transpile'
));

gulp.task('vectormap', shell.task(
    context.uglify
        ? 'pnpm nx run devextreme:build:vectormap -c production'
        : 'pnpm nx run devextreme:build:vectormap'
));

if(env.TEST_CI) {
    console.warn('Using test CI mode!');
}

function createMiscBatch() {
    const tasks = ['vectormap', 'vendor'];
    if(!env.TEST_CI) {
        tasks.push('aspnet', 'ts');
    }
    return gulp.parallel(tasks);
}

function createMainBatch(dev) {
    const tasks = [];
    if(!dev && !env.BUILD_TESTCAFE) {
        tasks.push('js-bundles-debug');
    }
    if(!env.TEST_CI || env.BUILD_TESTCAFE) {
        tasks.push('js-bundles-prod');
    }
    tasks.push('misc-batch');
    return (callback) => multiProcess(tasks, callback, true);
}

function createDefaultBatch(dev) {
    const tasks = dev ? [] : ['clean'];
    tasks.push('localization');
    tasks.push('transpile');

    if(REMOVE_NON_PRODUCTION_MODULE) {
        tasks.push('state-manager-replace-production-modules-transpiled-prod-renovation');
        tasks.push('state-manager-replace-production-modules-transpiled-prod-esm');

        tasks.push('state-manager-remove-development-only-modules-transpiled-prod-renovation');
        tasks.push('state-manager-remove-development-only-modules-transpiled-prod-esm');
    }

    tasks.push(dev && !env.BUILD_TESTCAFE ? 'main-batch-dev' : 'main-batch');
    if(!env.TEST_CI && !dev && !env.BUILD_TESTCAFE) {
        tasks.push('npm');
        tasks.push('check-license-notices');
    }
    return gulp.series(tasks);
}

gulp.task('misc-batch', createMiscBatch());
gulp.task('main-batch', createMainBatch(false));
gulp.task('main-batch-dev', createMainBatch(true));

gulp.task('default', createDefaultBatch());
gulp.task('default-dev', createDefaultBatch(true));

gulp.task('test-env', shell.task('node ./testing/launch'));

gulp.task('dev-watch', gulp.parallel(
    'transpile-watch',
    'bundler-config-watch',
    'js-bundles-watch',
    'test-env'
));

gulp.task('dev', gulp.series(
    'default-dev',
    'dev-watch'
));
