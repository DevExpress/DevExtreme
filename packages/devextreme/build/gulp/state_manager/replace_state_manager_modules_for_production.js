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
    STATE_MANAGER_INDEX_PRODUCTION_MODULE_PATH,
} = require('./constants');
const ctx = require('../context');

const ERROR_PREFIX = 'Error during replacing the state manager modules:';

function replaceStateManagerModulesForProduction() {
    return through2.obj(function(file, enc, callback) {
        if (file.path.includes(STATE_MANAGER_INDEX_MODULE_PATH)) {
            try {
                const absolutePathToStateManagerFolder = path.dirname(file.path);
                const replacerFileName = path.basename(STATE_MANAGER_INDEX_PRODUCTION_MODULE_PATH);

                const replacerFilePath = path.join(
                    absolutePathToStateManagerFolder,
                    replacerFileName,
                );

                const shouldReplaceWithProductionCode = fs.existsSync(replacerFilePath);

                if (shouldReplaceWithProductionCode) {
                    let productionContent = fs.readFileSync(replacerFilePath, 'utf8');

                    file.contents = Buffer.from(productionContent);

                } else {
                    console.error(
                        ERROR_PREFIX,
                        `${replacerFileName} file not found at ${replacerFilePath}`);
                }
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

gulp.task('state-manager-replace-production-modules', prepareStateManager(ctx.TRANSPILED_PROD_ESM_PATH));

module.exports = replaceStateManagerModulesForProduction;
