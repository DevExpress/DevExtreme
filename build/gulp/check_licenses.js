'use strict';
const gulp = require('gulp');
const lazyPipe = require('lazypipe');
const named = require('vinyl-named');

const rruleName = 'rrule.js';
const rruleUrl = 'https://github.com/jakubroztocil/rrule';
const rruleLicenseUrl = 'https://github.com/jakubroztocil/rrule/blob/master/LICENCE';

const re = new RegExp('\\*!\\s*.*' + rruleName + '[\\s\\S]*' + rruleUrl + '[\\s\\S]*' + '.*Copyright[\\s\\S]*' + rruleLicenseUrl);
const checkRruleLicenseComment = lazyPipe()
    .pipe(named, function(file) {
        const code = file.contents.toString();
        if(code.search(re) === -1) {
            throw new Error(`RRule license header wasn't found in ${file.stem}`);
        }
    });

gulp.task('check-rrule-license-header', function() {
    return gulp.src('artifacts/js/dx.all.js')
        .pipe(checkRruleLicenseComment());
});
