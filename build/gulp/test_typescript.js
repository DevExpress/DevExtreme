'use strict';

const gulp = require('gulp');
const exec = require('child_process').exec;

gulp.task('test-ts',
    (callback) => {
        exec(`cd testing/typescript && npm i --no-audit --no-fund && npm run test-ts`, (e, out, err) => {
            console.log(out, err);
            callback(e);
        });
    }
);