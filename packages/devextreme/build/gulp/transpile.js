'use strict';

const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('transpile-tests', shell.task('pnpm nx transpile:tests devextreme'));
