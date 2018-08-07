var gulp = require('gulp');
var merge = require('merge-stream');
var prettify = require('gulp-jsbeautifier');
var compressionPipes = require('./compression-pipes');
var headerPipes = require('./header-pipes.js');

gulp.task('layouts', function() {
    return merge(
        gulp.src('./layouts/*/*.{css,html}').pipe(gulp.dest('artifacts/layouts')),
        gulp.src('./layouts/*/*.js')
            .pipe(compressionPipes.removeDebug())
            .pipe(prettify())
            .pipe(headerPipes.useStrict())
            .pipe(gulp.dest('artifacts/layouts'))
    );
});
