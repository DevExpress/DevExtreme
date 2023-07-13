'use strict';

const gulp = require('gulp');
const merge = require('merge-stream');
const rename = require('gulp-rename');
const headerPipes = require('./header-pipes.js');
const compressionPipes = require('./compression-pipes.js');
const context = require('./context');

gulp.task('aspnet', function() {
    return merge(
        gulp.src('./js/aspnet.js')
            .pipe(rename('dx.aspnet.mvc.js'))
            .pipe(compressionPipes.beautify())
            .pipe(headerPipes.bangLicense())
            .pipe(gulp.dest(context.RESULT_JS_PATH))
    );
});
