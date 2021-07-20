const del = require('del');
const mkdir = require('mkdirp');
const fs = require('fs');
const gulp = require('gulp');
const ts = require('gulp-typescript');

const generateSync = require('devextreme-vue-generator').default;

const config = require('./build.config');

gulp.task('build.components', gulp.series(
  (done) => 
    mkdir(config.oldComponentsDir, {}, done),
  (done) => {
    generateSync(
      JSON.parse(fs.readFileSync(config.metadataPath).toString()),
      config.baseComponent,
      config.configComponent,
      {
        componentsDir: config.generatedComponentsDir,
        oldComponentsDir: config.oldComponentsDir,
        indexFileName: config.indexFileName
      },
      config.widgetsPackage
    );
  
    done();
  }
));

gulp.task('clean', gulp.parallel(
  (c) => del([`${config.generatedComponentsDir}\\*`, `!${config.coreComponentsDir}`], c), 
  (c) => del(config.npm.dist, c)
));

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
  'build.strategy',
  'build.components'
));
