const gulp = require('gulp');
const replace = require('gulp-replace');
const merge = require('merge-stream');
const context = require('./context.js');
const version = require('../../themebuilder/package.json').version;

const SCRIPTS = [
    'themebuilder/**/*.*',
    '!themebuilder/tests/**/*.*',
    '!themebuilder/node_modules/**/*',
    '!themebuilder/.npmignore',
    '!themebuilder/cli/.eslintrc',
    '!themebuilder/package.json'
];

gulp.task('themebuilder-npm', () => {
    return merge(
        gulp.src(SCRIPTS)
            .pipe(gulp.dest(context.RESULT_THEMEBUILDER_NPM_PATH)),

        gulp.src('themebuilder/package.json')
            .pipe(replace(version, context.version.package))
            .pipe(gulp.dest(context.RESULT_THEMEBUILDER_NPM_PATH))
    );
});
