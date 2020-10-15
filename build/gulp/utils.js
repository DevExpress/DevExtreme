'use strict';

const gulp = require('gulp');
const env = require('./env-variables');

gulp.task('skippedTask', done => done());

const runTaskByCondition = (condition, task) => {
    if(condition) {
        return (done) => task(done);
    }
    return (done) => done ? done() : gulp.series('skippedTask');
};

module.exports = {
    runTaskByCondition,
    ifEsmPackage: (task) => runTaskByCondition(env.BUILD_ESM_PACKAGE, task),
    ifRenovation: (task) => runTaskByCondition(env.USE_RENOVATION, task)
};
