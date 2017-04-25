// jshint node:true

"use strict";

var gulp = require('gulp');
var rename = require('gulp-rename');
var merge = require('merge-stream');

var compressionPipes = require('./compression-pipes.js');
var headerPipes = require('./header-pipes.js');
var context = require('./context.js');

var EXPORTER_PATH = 'js/exporter.js';

gulp.task('legacy-exporter', function() {
    return merge(

        gulp.src(EXPORTER_PATH)
            .pipe(rename(function(path) {
                path.basename = 'dx.' + path.basename + '.debug';
            }))
            .pipe(headerPipes.useStrict())
            .pipe(headerPipes.bangLicense())
            .pipe(compressionPipes.beautify())
            .pipe(gulp.dest(context.RESULT_JS_PATH)),

        gulp.src(EXPORTER_PATH)
            .pipe(rename(function(path) {
                path.basename = 'dx.' + path.basename;
            }))
            .pipe(headerPipes.useStrict())
            .pipe(headerPipes.bangLicense())
            .pipe(compressionPipes.minify())
            .pipe(gulp.dest(context.RESULT_JS_PATH))
    );
});
