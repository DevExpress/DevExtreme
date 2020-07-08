'use strict';
const gulp = require('gulp');
const lazyPipe = require('lazypipe');
const named = require('vinyl-named');

const checkRruleLicenseNotice = lazyPipe()
    .pipe(named, function(file) {
        const name = 'rrule.js';
        const url = 'https://github.com/jakubroztocil/rrule';
        const licenseUrl = 'https://github.com/jakubroztocil/rrule/blob/master/LICENCE';
        const re = new RegExp('\\*!\\s*.*' + name + '[\\s\\S]*' + url + '[\\s\\S]*' + '.*Copyright[\\s\\S]*' + licenseUrl);

        if(file.contents.toString().search(re) === -1) {
            throw new Error(`RRule license header wasn't found in ${file.stem}`);
        }
    });

gulp.task('check-license-notices', function() {
    return gulp.src('artifacts/js/dx.all.js')
        .pipe(checkRruleLicenseNotice());
});
