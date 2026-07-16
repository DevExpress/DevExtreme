'use strict';

const gulp = require('gulp');
const shell = require('gulp-shell');

// Migrated to native Nx targets (devextreme-nx-infra-plugin:babel-transform /
// build-typescript with watch mode). These gulp tasks are thin delegates kept only
// while the dev-watch orchestrator still references them; remove once dev-watch is migrated.
gulp.task('transpile-watch', shell.task('pnpm nx build:transpile:watch devextreme'));

gulp.task('transpile-tests', shell.task('pnpm nx transpile:tests devextreme'));
