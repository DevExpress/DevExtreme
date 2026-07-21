/* eslint-env node */

const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('clean', shell.task('pnpm nx clean:artifacts devextreme'));

require('./build/gulp/bundler-config');
require('./build/gulp/transpile');
require('./build/gulp/localization');
