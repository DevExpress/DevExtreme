'use strict';

const gulp = require('gulp');
const env = require('./env-variables');
const Vinyl = require('vinyl');

gulp.task('skippedTask', done => done());

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

const isEsmPackage = env.BUILD_ESM_PACKAGE;

const packageDir = 'devextreme';

module.exports = {
    packageDir,
    stringSrc,
    isEsmPackage,
    runTaskByCondition,
    ifEsmPackage: (task) => runTaskByCondition(isEsmPackage, task),
};
