'use strict';

const gulp = require('gulp');

const TEST_CI = Boolean(process.env['DEVEXTREME_TEST_CI']);

gulp.task('skippedTask', done => done());

module.exports = {
    skipTaskOnTestCI: (task) => {
        if(TEST_CI) {
            return (done) => done ? done() : gulp.series('skippedTask');
        }
        return () => task();
    }
};
