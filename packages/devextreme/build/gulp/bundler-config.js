'use strict';

const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('bundler-config', shell.task(
    'pnpm nx build:devextreme-bundler-config devextreme && pnpm nx build:devextreme-bundler-config devextreme -c prod'
));

gulp.task('bundler-config-watch', shell.task('pnpm nx build:devextreme-bundler-config:watch devextreme'));
