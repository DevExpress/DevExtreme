'use strict';

const gulp = require('gulp');
const env = require('./env-variables');

gulp.task('skippedTask', done => done());

const runTaskByCondition = (condition, task) => {
    if(condition) {
        return task;
    }
    return (done) => done ? done() : gulp.series('skippedTask');
};

const isEsmPackage = env.BUILD_ESM_PACKAGE;

const packageDir = 'devextreme';

module.exports = {
    packageDir,
    isEsmPackage,
    runTaskByCondition,
    ifEsmPackage: (task) => runTaskByCondition(isEsmPackage, task),
};
