'use strict';

const gulp = require('gulp');
const Vinyl = require('vinyl');
const env = require('./env-variables');

gulp.task('skippedTask', done => done());

const isEsmPackage = env.BUILD_ESM_PACKAGE;
const packageDir = 'devextreme';
const packageDistDir = 'devextreme-dist';

const runTaskByCondition = (condition, task) => {
    if(condition) {
        return task;
    }
    return (done) => done ? done() : gulp.series('skippedTask');
};

const stringSrc = (filename, str) => {
    const src = require('stream').Readable({ objectMode: true });

    src._read = function() {
        this.push(new Vinyl({
            cwd: '',
            path: filename,
            contents: Buffer.from(str, 'utf-8')
        }));
        this.push(null);
    };

    return src;
};

module.exports = {
    packageDir,
    packageDistDir,
    stringSrc,
    isEsmPackage,
    runTaskByCondition,
    ifEsmPackage: (task) => runTaskByCondition(isEsmPackage, task),
};
