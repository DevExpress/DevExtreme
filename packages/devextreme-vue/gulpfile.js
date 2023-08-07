const mkdir = require('mkdirp');
const fs = require('fs');
const del = require('del');

const gulp = require('gulp');
const shell = require('gulp-shell');
const header = require('gulp-header');
const ts = require('gulp-typescript');

const generateSync = require('devextreme-vue-generator').default;

const config = require('./build.config');

const
  GENERATE = 'generate',
  CLEAN = 'clean',

  OUTPUTDIR_CLEAN = 'output-dir.clean',
  GEN_RUN = 'generator.run',

  BUILD_STRATEGY = 'build.strategy',
  COPY_STRATEGY = 'copy.strategy',
  NPM_CLEAN = 'npm.clean',
  NPM_PACKAGE = 'npm.package',
  NPM_LICENSE = 'npm.license',
  ADD_HEADERS = 'npm.license-headers',
  NPM_README = 'npm.readme',
  NPM_BUILD = 'npm.build',
  NPM_PACK = 'npm.pack',
  VUE_VERSION = 3;

gulp.task(OUTPUTDIR_CLEAN, (c) =>
  del([`${config.generatedComponentsDir}\\*`, `!${config.coreComponentsDir}`], c)
);

gulp.task(NPM_CLEAN, (c) =>
  del(config.npm.dist, c)
);

gulp.task(CLEAN, gulp.parallel(OUTPUTDIR_CLEAN, NPM_CLEAN));

gulp.task(GEN_RUN, (done) => {
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
});

gulp.task(GENERATE, gulp.series(
  GEN_RUN
));

gulp.task(NPM_PACKAGE,
  () => gulp.src(config.npm.package).pipe(gulp.dest(config.npm.dist))
);

gulp.task(NPM_LICENSE,
  () => gulp.src(config.npm.license).pipe(gulp.dest(config.npm.dist))
);

gulp.task(NPM_README,
  () => gulp.src(config.npm.readme).pipe(gulp.dest(config.npm.dist))
);

gulp.task(NPM_BUILD, gulp.series(
  gulp.parallel(NPM_LICENSE, NPM_PACKAGE, NPM_README),
  GENERATE,
  () => {
    return gulp.src([
        config.src,
        ...config.ignoredGlobs
      ])
      .pipe(ts('tsconfig.json'))
      .pipe(gulp.dest(config.npm.dist))
  }
));

gulp.task(ADD_HEADERS, function() {
  const pkg = require('./package.json'),
      now = new Date(),
      data = {
          pkg: pkg,
          date: now.toDateString(),
          year: now.getFullYear()
      };

  var banner = [
      '/*!',
      ' * <%= pkg.name %>',
      ' * Version: <%= pkg.version %>',
      ' * Build date: <%= date %>',
      ' *',
      ' * Copyright (c) 2012 - <%= year %> Developer Express Inc. ALL RIGHTS RESERVED',
      ' *',
      ' * This software may be modified and distributed under the terms',
      ' * of the MIT license. See the LICENSE file in the root of the project for details.',
      ' *',
      ' * https://github.com/DevExpress/devextreme-vue',
      ' */',
      '\n'
      ].join('\n');

  return gulp.src(`${config.npm.dist}**/*.{ts,js}`)
      .pipe(header(banner, data))
      .pipe(gulp.dest(config.npm.dist));
});

gulp.task(BUILD_STRATEGY, shell.task(['npm run pack -w devextreme-vue2-strategy']))

gulp.task(COPY_STRATEGY, function() {
  return gulp.src(`${config.npm.strategySrc}`)
        .pipe(gulp.dest(config.npm.strategyDist));
});

gulp.task(NPM_PACK, gulp.series(
  CLEAN,
  NPM_BUILD,
  BUILD_STRATEGY,
  COPY_STRATEGY,
  ADD_HEADERS,
  shell.task(['npm pack'], { cwd: config.npm.dist })
));
