/* eslint-env node */
/* eslint-disable no-console */

import gulp from 'gulp';
import cache from 'gulp-cache';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const env = require('../devextreme/build/gulp/env-variables.js');
const del = require('del');

gulp.task('clean', function(callback) {
    del.sync([
        '../devextreme/artifacts/css/**',
        '../devextreme/scss/bundles/**'
    ], { force: true });
    cache.clearAll();
    callback();
});

import './build/style-compiler.js';

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
