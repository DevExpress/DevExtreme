const gulp = require('gulp');
const merge = require('merge-stream');
const rename = require('gulp-rename');
const headerPipes = require('./header-pipes.js');
const compressionPipes = require('./compression-pipes.js');

gulp.task('aspnet', function() {
    return merge(
        gulp.src('./js/aspnet.js')
            .pipe(rename('dx.aspnet.mvc.js'))
            .pipe(compressionPipes.beautify())
            .pipe(headerPipes.bangLicense())
            .pipe(gulp.dest('artifacts/js'))
    );
});
