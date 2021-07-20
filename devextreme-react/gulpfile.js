const mkdir = require('mkdirp');
const fs = require('fs');
const del = require('del');

const gulp = require('gulp');
const shell = require('gulp-shell');
const header = require('gulp-header');
const ts = require('gulp-typescript');

const config = require('./build.config');

const generateSync = require('devextreme-react-generator').default;

const GENERATE = 'generate';
const CLEAN = 'clean';

const OLD_OUTPUTDIR_CREATE = 'output-dir.create';
const GEN_RUN = 'generator.run';

const NPM_CLEAN = 'npm.clean';
const NPM_PACKAGE = 'npm.package';
const NPM_LICENSE = 'npm.license';
const NPM_BUILD_WITH_HEADERS = 'npm.license-headers';
const NPM_README = 'npm.readme';
const NPM_BUILD = 'npm.build';
const NPM_PACK = 'npm.pack';

gulp.task(CLEAN, (c) =>
  del([`${config.generatedComponentsDir}\\*`, `!${config.coreComponentsDir}`], c)
);

gulp.task(OLD_OUTPUTDIR_CREATE, (done) =>
  mkdir(config.oldComponentsDir, {}, done)
);

gulp.task(GEN_RUN, (done) => {
  generateSync({
    metaData: JSON.parse(fs.readFileSync(config.metadataPath).toString()),
    components: {
      baseComponent: config.baseComponent,
      extensionComponent: config.extensionComponent,
      configComponent: config.configComponent
    },
    out: {
      componentsDir: config.generatedComponentsDir,
      oldComponentsDir: config.oldComponentsDir,
      indexFileName: config.indexFileName
    },
    widgetsPackage: 'devextreme'
  });

  done();
});

gulp.task(GENERATE, gulp.series(
  CLEAN,
  OLD_OUTPUTDIR_CREATE,
  GEN_RUN
));

gulp.task(NPM_CLEAN, (c) =>
  del(config.npm.dist, c)
);

gulp.task(NPM_PACKAGE, gulp.series(
  () => gulp.src(config.npm.package).pipe(gulp.dest(config.npm.dist))
));

gulp.task(NPM_LICENSE, gulp.series(
  () => gulp.src(config.npm.license).pipe(gulp.dest(config.npm.dist))
));

gulp.task(NPM_README, gulp.series(
  () => gulp.src(config.npm.readme).pipe(gulp.dest(config.npm.dist))
));

gulp.task(NPM_BUILD, gulp.series(
  NPM_CLEAN,
  gulp.parallel(NPM_LICENSE, NPM_PACKAGE, NPM_README),
  GENERATE,
  () => gulp.src([
    config.src,
    `!${config.testSrc}`
  ])
    .pipe(ts('tsconfig.json'))
    .pipe(gulp.dest(config.npm.dist))
));

gulp.task(NPM_BUILD_WITH_HEADERS, gulp.series(
  NPM_BUILD,
  () => {
    const pkg = require('./package.json');
    const now = new Date();
    const data = {
      pkg,
      date: now.toDateString(),
      year: now.getFullYear()
    };

    const banner = [
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
        ' * https://github.com/DevExpress/devextreme-react',
        ' */',
        '\n'
        ].join('\n');

    return gulp.src(`${config.npm.dist}**/*.{ts,js}`)
        .pipe(header(banner, data))
        .pipe(gulp.dest(config.npm.dist));
  }
));

gulp.task(NPM_PACK, gulp.series(
  NPM_BUILD_WITH_HEADERS,
  shell.task(['npm pack'], { cwd: config.npm.dist })
));
