/* eslint-env node */
/* eslint-disable no-console */

const gulp = require('gulp');
const env = require('../devextreme/build/gulp/env-variables');
const cache = require('gulp-cache');
const shell = require('gulp-shell');

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
