'use strict';

const path = require('path');
const gulp = require('gulp');
const del = require('del');
const {
    STATE_MANAGER_FOLDER_PATH,
    STATE_MANAGER_SETUP_STATE_MANAGER_MODULE_PATH,
    STATE_MANAGER_INDEX_MODULE_PATH
} = require('./constants');
const ctx = require('../context');

const MODULE_TYPES = ['esm', 'cjs'];

const createRemoveDevelopmentStateManagerModulesTask = (targetPath) => (done) => {
    const patterns = [];

    MODULE_TYPES.forEach(type => {
        patterns.push(`${path.join(targetPath, type, STATE_MANAGER_FOLDER_PATH)}/**`);
    });

    MODULE_TYPES.forEach(type => {
        patterns.push(`!${path.join(targetPath, type, STATE_MANAGER_FOLDER_PATH)}`);
        patterns.push(`!${path.join(targetPath, type, STATE_MANAGER_INDEX_MODULE_PATH)}`);
        patterns.push(`!${path.join(targetPath, type, STATE_MANAGER_SETUP_STATE_MANAGER_MODULE_PATH)}`);
    });

    del.sync(patterns);

    done();
};

gulp.task('state-manager-remove-development-only-modules', createRemoveDevelopmentStateManagerModulesTask(ctx.TRANSPILED_PROD_ESM_PATH));


module.exports = createRemoveDevelopmentStateManagerModulesTask;
