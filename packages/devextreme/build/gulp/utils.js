'use strict';

const gulp = require('gulp');
const Vinyl = require('vinyl');
const env = require('./env-variables');
const {
    INTERNAL_PACKAGE_DIR,
    INTERNAL_PACKAGE_DIST_DIR,
} = require('./internal-build');

gulp.task('skippedTask', done => done());

const isEsmPackage = env.BUILD_ESM_PACKAGE;
const devextremeDir = 'devextreme';
const devextremeDistDir = 'devextreme-dist';
const packageDir = env.BUILD_INTERNAL_PACKAGE ? INTERNAL_PACKAGE_DIR : devextremeDir;
const packageDistDir = env.BUILD_INTERNAL_PACKAGE ? INTERNAL_PACKAGE_DIST_DIR : devextremeDistDir;

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
    devextremeDir,
    devextremeDistDir,
    packageDir,
    packageDistDir,
    stringSrc,
    isEsmPackage,
    runTaskByCondition,
    ifEsmPackage: (task) => runTaskByCondition(isEsmPackage, task),
};
