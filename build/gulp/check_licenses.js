'use strict';
const gulp = require('gulp');
const lazyPipe = require('lazypipe');
const named = require('vinyl-named');
// const context = require('./context.js');
const path = require('path');
const artifactsPath = path.join(__dirname, '..', '..', '..', '..', 'artifacts');

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
    const file = path.join(artifactsPath, 'js', 'dx.all.js');
    return gulp.src(file)
        .pipe(checkRruleLicenseComment());
});
