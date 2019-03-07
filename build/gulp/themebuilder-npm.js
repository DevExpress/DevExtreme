const gulp = require('gulp');
const babel = require('gulp-babel');
const jsonEditor = require('gulp-json-editor');
const merge = require('merge-stream');
const context = require('./context.js');
const browsersList = require('../../package.json').browserslist;
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
            .pipe(jsonEditor({
                version: context.version.package,
                browserslist: browsersList
            }))
            .pipe(gulp.dest(packagePath))
    );
});
