'use strict';
const gulp = require('gulp');
const lazyPipe = require('lazypipe');
const named = require('vinyl-named');

const TEST_CI = Boolean(process.env['DEVEXTREME_TEST_CI']);

const rruleName = 'rrule.js';
const rruleUrl = 'https://github.com/jakubroztocil/rrule';
const rruleLicenseUrl = 'https://github.com/jakubroztocil/rrule/blob/master/LICENCE';

const re = new RegExp('\\*!\\s*.*' + rruleName + '[\\s\\S]*' + rruleUrl + '[\\s\\S]*' + '.*Copyright[\\s\\S]*' + rruleLicenseUrl);
const licenseNotice = 'rrule.js - Library for working with recurrence rules for calendar dates';

const checkRruleLicenseComment = lazyPipe()
    .pipe(named, function(file) {
        const code = file.contents.toString();
        let result = -1;

        if(file.stem === 'dx.all') {
            result = code.search(re);
        } else {
            result = code.indexOf(licenseNotice);
        }

        if(result === -1) {
            throw new Error(`RRule license header wasn't found in ${file.stem}`);
        }
    });

gulp.task('check-rrule-license-header', function() {
    const fileName = TEST_CI ? 'artifacts/js/dx.all.debug.js' : 'artifacts/js/dx.all.js';

    return gulp.src(fileName)
        .pipe(checkRruleLicenseComment());
});
