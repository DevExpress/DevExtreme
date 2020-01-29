require('./compiler');
require('./generator');

const gulp = require('gulp');

gulp.task('generate-scss', gulp.series(
    'scss-clean',
    'less2sass',
    'fix-bundles',
    'fix-base',
    'fix-common',
    'create-widgets',
    'fix-mixins',
    // TODO - create common bundle
    'create-base-widget',
    'create-theme-index',
    'sass-material',
    'sass-generic',
    'scss-raw-scss-clean'
));
