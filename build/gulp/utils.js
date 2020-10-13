'use strict';

const gulp = require('gulp');

gulp.task('skippedTask', done => done());

module.exports = {
    runTaskByCondition: (condition, task) => {
        if(condition) {
            return (done) => task(done);
        }
        return (done) => done ? done() : gulp.series('skippedTask');
    }
};
