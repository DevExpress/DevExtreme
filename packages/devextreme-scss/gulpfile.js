/* eslint-env node */
/* eslint-disable no-console */

const gulp = require('gulp');
const env = require('../devextreme/build/gulp/env-variables');
const cache = require('gulp-cache');
const shell = require('gulp-shell');
const replace = require('gulp-replace');
const through = require('through2');
const { getFigmaVarValue, setFigmaVarAlias } = require('./generate-figma');

gulp.task('clean', function(callback) {
    require('del').sync([
        '../devextreme/artifacts/css/**',
        '../devextreme/scss/bundles/**'
    ], { force: true });
    cache.clearAll();
    callback();
});

require('./build/style-compiler');

if(env.TEST_CI) {
    console.warn('Using test CI mode!');
}

function createStyleCompilerBatch() {
    return gulp.series(
      'clean',
      env.TEST_CI
        ? ['style-compiler-themes-ci']
        : ['style-compiler-themes']
    );
}

gulp.task('default', createStyleCompilerBatch());

gulp.task('watch', gulp.series(
    'style-compiler-themes-watch'
));

gulp.task('generate', gulp.series(
    () => gulp
        .src('scss/widgets/**/*.scss')
        .pipe(through.obj(function(file, encoding, callback) {
            const content = file.contents.toString(encoding);
            const iter = content.matchAll(/(\s*\/\/ getFigmaVariable\('(.+?)', *'(.+?)', *'(.+?)' *\)\n\s*(\$.+?): *)(.+?)( !default;)/g);
            for (let [match, beginning,  name, collection, mode, scssName, scssValue, end] of iter) {
                setFigmaVarAlias(name, scssName, collection);
            }
            callback(null, file);
        })),
    () => gulp
        .src('scss/widgets/**/*.scss')
        .pipe(through.obj(function(file, encoding, callback) {
            const content = file.contents.toString(encoding);
            const newContent = content.replace(/(\s*\/\/ getFigmaVariable\('(.+?)', *'(.+?)', *'(.+?)' *\)\n\s*(\$.+?): *)(.+?)( !default;)/g, function(match, beginning,  name, collection, mode, scssName, scssValue, end) {
                return beginning + getFigmaVarValue(name, collection, mode) + end;
            })
            file.contents = Buffer.from(newContent)
            callback(null, file);
        }))
        .pipe(gulp.dest('scss/widgets')),

))
