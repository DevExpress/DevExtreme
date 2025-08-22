'use strict';

const gulp = require('gulp');
const through2 = require('through2');
const path = require('path');
const fs = require('fs');
const babel = require('@babel/core');
const transpileConfig = require('../transpile-config');
const {
    STATE_MANAGER_FOLDER_PATH,
    STATE_MANAGER_INDEX_MODULE_PATH,
} = require('./constants');
const ctx = require('../context');

const ERROR_PREFIX = 'Error during replacing the state manager modules:';

function replaceStateManagerModulesForProduction() {
    return through2.obj(function(file, enc, callback) {
        if (file.path.includes(STATE_MANAGER_INDEX_MODULE_PATH)) {
            try {
                file.contents = Buffer.from(`export * from './prod/index';`);
            } catch (error) {
                console.error(ERROR_PREFIX, error);
            }
        }

        callback(null, file);
    });
}

const prepareStateManager = (dist) => gulp.series.apply(gulp, [
    () => gulp
        .src(`${dist}/**/${STATE_MANAGER_FOLDER_PATH}/**`)
        .pipe(replaceStateManagerModulesForProduction())
        .pipe(gulp.dest(dist)),
]);

gulp.task('state-manager-replace-production-modules-transpiled-prod-esm', prepareStateManager(ctx.TRANSPILED_PROD_ESM_PATH));

gulp.task('state-manager-replace-production-modules-transpiled-prod-renovation', prepareStateManager(ctx.TRANSPILED_PROD_RENOVATION_PATH));

module.exports = replaceStateManagerModulesForProduction;
