'use strict';

const gulp = require('gulp');

gulp.task('skippedTask', done => done());

module.exports = {
    runTaskByCondition: (condition, task) => {
        console.log(`RENOVATION_RUN === ${condition}`);
        if(condition) {
            return () => task();
        }
        return (done) => done ? done() : gulp.series('skippedTask');
    }
};
