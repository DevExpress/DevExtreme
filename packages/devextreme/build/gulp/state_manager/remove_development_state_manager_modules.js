'use strict';

const path = require('path');
const gulp = require('gulp');
const del = require('del');
const {
    STATE_MANAGER_FOLDER_PATH,
    STATE_MANAGER_INDEX_MODULE_PATH,
    STATE_MANAGER_REACTIVE_PRIMITIVES_INDEX_MODULE_PATH,
    STATE_MANAGER_REACTIVE_PRIMITIVES_FOLDER_PATH
} = require('./constants');
const ctx = require('../context');

const MODULE_TYPES = ['esm', 'cjs'];

const removeDevelopmentStateManagerModules = (targetPath) => {
    const patterns = [];

    MODULE_TYPES.forEach(type => {
        patterns.push(`${path.join(targetPath, type, STATE_MANAGER_FOLDER_PATH)}/**`);
    });

    MODULE_TYPES.forEach(type => {
        patterns.push(`!${path.join(targetPath, type, STATE_MANAGER_FOLDER_PATH)}`);
        patterns.push(`!${path.join(targetPath, type, STATE_MANAGER_INDEX_MODULE_PATH)}`);
        patterns.push(`!${path.join(targetPath, type, STATE_MANAGER_REACTIVE_PRIMITIVES_FOLDER_PATH)}`);
        patterns.push(`!${path.join(targetPath, type, STATE_MANAGER_REACTIVE_PRIMITIVES_INDEX_MODULE_PATH)}`);
    });

    del.sync(patterns);
}

const createRemoveDevelopmentStateManagerModulesTask = (targetPath) => (done) => {
    removeDevelopmentStateManagerModules(targetPath);
    done();
};

gulp.task('state-manager-remove-development-only-modules-transpiled-prod-esm', createRemoveDevelopmentStateManagerModulesTask(ctx.TRANSPILED_PROD_ESM_PATH));

gulp.task('state-manager-remove-development-only-modules-transpiled-prod-renovation', createRemoveDevelopmentStateManagerModulesTask(ctx.TRANSPILED_PROD_RENOVATION_PATH));

module.exports = {
    removeDevelopmentStateManagerModules,
    createRemoveDevelopmentStateManagerModulesTask
};
