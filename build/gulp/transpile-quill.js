var gulp = require('gulp');
var babel = require('gulp-babel');
var merge = require('merge-stream');

var context = require('./context.js');

var DESTINATION_FOLDER = context.TRANSPILED_PATH + "/quill_modules";
var QUILL_SRC = 'node_modules/quill/**/*.js';
var QUILL_DELTA_SRC = 'node_modules/quill-delta/**/*.*';
var QUILL_DELTA_TO_HTML_SRC = 'node_modules/quill-delta-to-html/**/*.*';
var PARCHMENT_SRC = 'node_modules/parchment/**/*.*';
var EXTEND_SRC = 'node_modules/extend/**/*.*';
var CLONE_SRC = 'node_modules/clone/**/*.*';
var DEEP_EQUAL_SRC = 'node_modules/deep-equal/**/*.*';
var EVENTEMMITER_SRC = 'node_modules/eventemitter3/**/*.*';
var FAST_DIFF_SRC = 'node_modules/fast-diff/**/*.*';


gulp.task('transpile-quill', ['bundler-config'], function() {
    return merge(
        gulp.src(QUILL_SRC)
            .pipe(babel())
            .pipe(gulp.dest(DESTINATION_FOLDER + "/quill")),

        gulp.src(QUILL_DELTA_SRC)
            .pipe(gulp.dest(DESTINATION_FOLDER + "/quill-delta")),

        gulp.src(QUILL_DELTA_TO_HTML_SRC)
            .pipe(gulp.dest(DESTINATION_FOLDER + "/quill-delta-to-html")),

        gulp.src(PARCHMENT_SRC)
            .pipe(gulp.dest(DESTINATION_FOLDER + "/parchment")),

        gulp.src(EXTEND_SRC)
            .pipe(gulp.dest(DESTINATION_FOLDER + "/extend")),

        gulp.src(CLONE_SRC)
            .pipe(gulp.dest(DESTINATION_FOLDER + "/clone")),

        gulp.src(DEEP_EQUAL_SRC)
            .pipe(gulp.dest(DESTINATION_FOLDER + "/deep-equal")),

        gulp.src(EVENTEMMITER_SRC)
            .pipe(gulp.dest(DESTINATION_FOLDER + "/eventemitter3")),

        gulp.src(FAST_DIFF_SRC)
            .pipe(gulp.dest(DESTINATION_FOLDER + "/fast-diff"))
    );
});
