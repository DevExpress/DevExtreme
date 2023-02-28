'use strict';

const gulp = require('gulp');
const exec = require('child_process').exec;
const context = require('../context.js');
const packagePath = context.RESULT_NPM_PATH + '/devextreme-themebuilder';

gulp.task('themebuilder-npm', gulp.series(
    (callback) => {
        exec('npm run build -w themebuilder-scss', (e, out, err) => {
            console.log(out, err);
            callback(e);
        });
    },
    () => {
        return gulp.src('themebuilder-scss/dist/**/*.*')
            .pipe(gulp.dest(packagePath));
    }
));
