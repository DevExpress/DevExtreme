'use strict';

const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('localization', shell.task('pnpm nx build:localization devextreme'));

gulp.task('generate-community-locales', shell.task('pnpm nx build:community-localization devextreme'));
