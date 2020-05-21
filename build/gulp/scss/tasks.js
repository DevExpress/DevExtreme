'use strict';

require('./compiler');
require('./generator');

const gulp = require('gulp');

gulp.task('generate-scss', gulp.series(
    'scss-clean',
    'less2sass',
    'fix-bundles',
    'fix-base',
    'fixCommon',
    'create-widgets',
    'fix-mixins',
    'create-base-widget',
    'create-theme-index',
    'lint-scss',
    'compile-scss',
    'scss-raw-scss-clean'
));
