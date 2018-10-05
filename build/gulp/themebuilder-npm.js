const gulp = require('gulp');
const babel = require('gulp-babel');
const replace = require('gulp-replace');
const merge = require('merge-stream');
const context = require('./context.js');
const version = require('../../themebuilder/package.json').version;
const packagePath = context.RESULT_NPM_PATH + '/devextreme-themebuilder';

const ASSETS = [
    'themebuilder/**/*.*',
    '!themebuilder/modules/*.js',
    '!themebuilder/tests/**/*.*',
    '!themebuilder/node_modules/**/*',
    '!themebuilder/.npmignore',
    '!themebuilder/cli/.eslintrc',
    '!themebuilder/package.json',
    '!themebuilder/package-lock.json'
];

const SCRIPTS = [
    'themebuilder/modules/*.js'
];

gulp.task('themebuilder-npm', () => {
    return merge(
        gulp.src(ASSETS)
            .pipe(gulp.dest(packagePath)),

        gulp.src(SCRIPTS)
            .pipe(babel())
            .pipe(gulp.dest(packagePath + '/modules')),

        gulp.src('themebuilder/package.json')
            .pipe(replace(version, context.version.package))
            .pipe(gulp.dest(packagePath))
    );
});
