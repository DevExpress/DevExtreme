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

const isEsmPackage = env.BUILD_ESM_PACKAGE && !env.USE_RENOVATION;
const isRegularPackage = !env.BUILD_ESM_PACKAGE && !env.USE_RENOVATION;
const isRenovationPackage = env.USE_RENOVATION && !env.BUILD_ESM_PACKAGE;

let packageDir = '';

if(isRenovationPackage) {
    packageDir = 'devextreme-renovation';
} else if(isEsmPackage) {
    packageDir = 'devextreme-esm';
} else if(isRegularPackage) {
    packageDir = 'devextreme';
}

module.exports = {
    packageDir,
    isEsmPackage,
    isRegularPackage,
    isRenovationPackage,
    runTaskByCondition,
    ifRegularPackage: (task) => runTaskByCondition(isRegularPackage, task),
    ifEsmPackage: (task) => runTaskByCondition(isEsmPackage, task),
    ifRenovationPackage: (task) => runTaskByCondition(isRenovationPackage, task)
};
