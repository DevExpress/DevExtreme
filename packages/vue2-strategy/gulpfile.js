const del = require('del');
const mkdir = require('mkdirp');
const fs = require('fs');
const gulp = require('gulp');
const ts = require('gulp-typescript');

const generateSync = require('devextreme-vue-generator').default;

const config = require('./build.config');
const VUE_VERSION = 2;

gulp.task('build.components', gulp.series(
  (done) => {
    generateSync(
      JSON.parse(fs.readFileSync(config.metadataPath).toString()),
      config.baseComponent,
      config.configComponent,
      {
        componentsDir: config.generatedComponentsDir,
        indexFileName: config.indexFileName
      },
      config.widgetsPackage,
      VUE_VERSION,
      true
    );

    done();
  }
));

gulp.task('clean', gulp.parallel(
  (c) => del([`${config.generatedComponentsDir}\\*`, `!${config.coreComponentsDir}`], c),
  (c) => del(config.npm.dist, c)
));

gulp.task('copy-helper', () => {
  return gulp.src('../devextreme-vue/src/core/helpers.ts')
    .pipe(gulp.dest('./src/core'));
});

gulp.task('build.strategy', function() {
  return gulp.src([
      config.core,
      ...config.ignoredGlobs
    ])
    .pipe(ts('tsconfig.json'))
    .pipe(gulp.dest(config.npm.dist))
});

gulp.task('build', gulp.series(
  'clean',
  'copy-helper',
  'build.strategy',
  'build.components'
));
