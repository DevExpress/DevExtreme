var gulp = require('gulp');
var replace = require('gulp-replace');
var merge = require('merge-stream');
var context = require('./context.js');
var version = require('../../themebuilder/package.json').version;

var SCRIPTS = [
    'themebuilder/**/*.*',
    '!themebuilder/tests/**/*.*',
    '!themebuilder/node_modules/**/*',
    '!themebuilder/.npmignore',
    '!themebuilder/cli/.eslintrc',
    '!themebuilder/package.json'
];

gulp.task('themebuilder-npm', function() {
    return merge(
        gulp.src(SCRIPTS)
            .pipe(gulp.dest(context.RESULT_THEMEBUILDER_NPM_PATH)),

        gulp.src('themebuilder/package.json')
            .pipe(replace(version, context.version.package))
            .pipe(gulp.dest(context.RESULT_THEMEBUILDER_NPM_PATH))
    );
});
