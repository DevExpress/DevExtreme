'use strict';

const path = require('path');
const gulp = require('gulp');
const fs = require('fs');
const { STATE_MANAGER_FOLDER_PATH } = require('./constants');

const PRODUCTION_MODULES = [
    'setup_state_manager.js',
    'index.js'
];

function removeDevelopmentStateManagerFiles(dirPath) {
    if (!fs.existsSync(dirPath)) {
        return;
    }

    try {
        const files = fs.readdirSync(dirPath);

        files.forEach(fileName => {
            const fullPath = path.join(dirPath, fileName);

            if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
                return;
            }

            if (PRODUCTION_MODULES.includes(fileName)) {
                return;
            }

            try {
                fs.unlinkSync(fullPath);
            } catch (err) {
                console.error(`Error deleting ${fullPath}: ${err.message}`);
            }
        });
    } catch (err) {
        console.error(`Error processing directory ${dirPath}: ${err.message}`);
    }
}

const removeDevelopmentStateManagerModulesNpmEsm = (npmArtifactsPath, done) => {
    const stateManagerPath = path.join(npmArtifactsPath, 'devextreme', 'esm', STATE_MANAGER_FOLDER_PATH);
    removeDevelopmentStateManagerFiles(stateManagerPath);
    done();
};

const removeDevelopmentStateManagerModulesNpmCjs = (npmArtifactsPath, done) => {
    const stateManagerPath = path.join(npmArtifactsPath, 'devextreme', 'cjs', STATE_MANAGER_FOLDER_PATH);
    removeDevelopmentStateManagerFiles(stateManagerPath);
    done();
};

const createRemoveDevelopmentStateManagerModulesTask = (ctx) => {
    const removeDevelopmentStateManagerModulesFromNpmEsmTask = (done) => removeDevelopmentStateManagerModulesNpmEsm(ctx.RESULT_NPM_PATH, done);
    const removeDevelopmentStateManagerModulesFromCjsTask = (done) => removeDevelopmentStateManagerModulesNpmCjs(ctx.RESULT_NPM_PATH, done);

    const task = gulp.parallel(
        removeDevelopmentStateManagerModulesFromNpmEsmTask,
        removeDevelopmentStateManagerModulesFromCjsTask
    );

    task.displayName = 'remove development state manager modules';
    return task;
};

module.exports = createRemoveDevelopmentStateManagerModulesTask;
