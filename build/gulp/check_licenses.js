'use strict';
const gulp = require('gulp');
const lazyPipe = require('lazypipe');
const named = require('vinyl-named');

const checkRruleLicenseNotice = lazyPipe()
    .pipe(named, function(file) {
        const name = 'rrule.js - Library for working with recurrence rules for calendar dates.';
        const url = 'https://github.com/jakubroztocil/rrule';
        const copyright = 'Copyright 2010, Jakub Roztocil and Lars Schoning';
        const licenseUrl = 'https://github.com/jakubroztocil/rrule/blob/master/LICENCE';
        const licenseType = 'Licenced under the BSD licence.';
        const separator = '\\s*\\*\\s';

        const fileContent = file.contents.toString();

        // const re1 = new RegExp('\\*!\\s*.*' + name + '\\s*\\*\\s' + url + '\\s*\\*\\s*\\*\\s' + copyright + '\\s*\\*\\s' + licenceType + '\\s*\\*\\s' + licenseUrl);
        // const re = new RegExp('\\*!\\s*.*' + name + separator + url + separator + '*\\*\\s' + copyright + separator + licenseType + separator + licenseUrl);

        const re = new RegExp(`\\*!\\s*.*${name}${separator}${url}${separator}*\\*\\s${copyright}${separator}${licenseType}${separator}${licenseUrl}`);
        if(fileContent.search(re) === -1) {
            throw new Error(`RRule license header wasn't found in ${file.stem}`);
        }
    });

gulp.task('check-license-notices', function() {
    return gulp.src('artifacts/js/dx.all.js')
        .pipe(checkRruleLicenseNotice());
});
