var gulp = require('gulp');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var headerPipes = require('./header-pipes.js');
var compressionPipes = require('./compression-pipes.js');

gulp.task('aspnet', function() {
    return merge(
        gulp.src('./js/aspnet.js')
            .pipe(rename('dx.aspnet.mvc.js'))
            .pipe(compressionPipes.beautify())
            .pipe(headerPipes.bangLicense())
            .pipe(gulp.dest('artifacts/js'))
    );
});
