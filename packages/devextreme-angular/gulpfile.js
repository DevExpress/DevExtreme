const gulp = require('gulp');
const path = require('path');
const typescript = require('gulp-typescript');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const karmaServer = require('karma').Server;
const karmaConfig = require('karma').config;
const header = require('gulp-header');
const ngPackagr = require('ng-packagr');
const fs = require('fs');
const { exec } = require('child_process');

const { AngularMetadataGenerator } = require('devextreme-internal-tools');
const { AngularDotGenerator } = require('devextreme-internal-tools');
const { AngularFacadeGenerator } = require('devextreme-internal-tools');
const { AngularModuleFacadeGenerator } = require('devextreme-internal-tools');
const { AngularCommonReexportsGenerator } = require('devextreme-internal-tools');
const { AngularComponentNamesGenerator } = require('devextreme-internal-tools');

const argv = require('yargs')
  .option('with-descriptions', { type: 'boolean', default: false })
  .parseSync();

const buildConfig = require('./build.config');

// ------------Components------------

gulp.task('clean.metadata', gulp.series(() => {
  const { outputFolderPath } = buildConfig.tools.metadataGenerator;

  return del([outputFolderPath]);
}));

gulp.task('generate.metadata', gulp.series('clean.metadata', (done) => {
  const generator = new AngularMetadataGenerator();

  generator.generate(buildConfig.tools.metadataGenerator);
  done();
}));

gulp.task('clean.generatedComponents', (done) => {
  const { outputFolderPath } = buildConfig.tools.componentGenerator;
  const { skipFromCleaningFiles } = buildConfig.components;

  del.sync([
    `${outputFolderPath}/*/**`,
    ...skipFromCleaningFiles.flatMap(keepPattern => {
      const pathParts = keepPattern.match(/[\*\/]$/) ? keepPattern.split('/') : [keepPattern];

      const patternsToKeep = pathParts.reduce((acc, pathPart) => {

        if(pathPart) {
          acc.path += '/' + pathPart;
          acc.patterns.push(`!${acc.path}`);
        }

        return acc;
      }, {
        patterns: [],
        path: outputFolderPath.replace(/\/$/,'')
      }).patterns;

      return patternsToKeep;
    })
  ]);

  done();
});

gulp.task('generate.components', gulp.series('generate.metadata', 'clean.generatedComponents', (done) => {
  const generator = new AngularDotGenerator();

  generator.generate(buildConfig.tools.componentGenerator);
  done();
}));

gulp.task('generate.moduleFacades', gulp.series('generate.components', (done) => {
  const moduleFacadeGenerator = new AngularModuleFacadeGenerator();

  moduleFacadeGenerator.generate(buildConfig.tools.moduleFacadeGenerator);
  done();
}));

gulp.task('before-generate.preserve-component-files', (done) => {
  const { outputFolderPath } = buildConfig.tools.componentGenerator;
  const { preserveComponentFiles, temporaryFolderForPreserved } = buildConfig.afterGenerate;

  const tasks = preserveComponentFiles.map((folderOrFilePath) => {
    const [componentName, folder] = folderOrFilePath.split('/');
    let src = outputFolderPath + folderOrFilePath;
    const isFolder = !fs.statSync(src).isFile();

    let dest = `${temporaryFolderForPreserved}/${componentName}`;

    if (isFolder) {
      dest += `/${folder}`;
      src += '/**/*';
    }

    return () => gulp.src(src).pipe(gulp.dest(dest));
  });

  gulp.parallel(...tasks)(done);
});

gulp.task('generate.facades', gulp.series('generate.moduleFacades', (done) => {
  const facadeGenerator = new AngularFacadeGenerator();

  facadeGenerator.generate({
    ...buildConfig.tools.facadeGenerator,
    templatingOptions: {
      quotes: 'single',
      excplicitIndexInImports: true,
    },
  });

  done();
}));

gulp.task('generate.common-reexports', (done) => {
  const { outputPath, imdMetadataFilePath } = buildConfig.tools.commonReexportsGenerator;

  AngularCommonReexportsGenerator.generate({
    outputPath,
    metadata: JSON.parse(fs.readFileSync(imdMetadataFilePath).toString()),
    templatingOptions: {
      quotes: 'single',
      excplicitIndexInImports: true,
    },
  });
  done();
});

gulp.task('build.license-headers', () => {
  const config = buildConfig.components;
  const pkg = require('./package.json');
  const now = new Date();
  const data = {
    pkg,
    date: now.toDateString(),
    year: now.getFullYear(),
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
    ' * https://github.com/DevExpress/devextreme-angular',
    ' */',
    '\n', // This new line is necessary to keep the header after TS compilation
  ].join('\n');

  return gulp.src(`${config.outputPath}/${config.srcFilesPattern}`)
    .pipe(header(banner, data))
    .pipe(gulp.dest(config.outputPath));
});

gulp.task('clean.dist', () => {
  del.sync([`${buildConfig.components.outputPath}/*.*`]);
  return del([buildConfig.components.outputPath]);
});

gulp.task('build.ngc', () => {
  const config = buildConfig.components;

  return ngPackagr
    .ngPackagr()
    .forProject(path.join(config.outputPath, 'ng-package.json'))
    .withTsConfig('tsconfig.lib.json')
    .build();
});

gulp.task('build.copy-sources', gulp.series('clean.dist', () => {
  const config = buildConfig.components;
  return gulp.src(config.sourcesGlobs)
    .pipe(gulp.dest(config.outputPath));
}));

// Note: workaround for https://github.com/angular/angular-cli/issues/4874
gulp.task('build.remove-unusable-variable', () => {
  const config = buildConfig.npm;

  return gulp.src(`${config.distPath}/**/*.js`)
    .pipe(replace(/DevExpress\.[\w\.]+/g, 'Object'))
    .pipe(gulp.dest(config.distPath));
});

gulp.task('build.components', gulp.series(
  'build.copy-sources',
  'build.license-headers',
  'build.ngc',
  'build.remove-unusable-variable',
));

// ------------npm------------

gulp.task('npm.content', gulp.series(
  'build.copy-sources',
  'build.license-headers',
  'build.ngc',
  'build.remove-unusable-variable',
  () => {
    const npmConfig = buildConfig.npm;
    const cmpConfig = buildConfig.components;

    return gulp.src([`${cmpConfig.outputPath}/**/collection.json`, ...npmConfig.content])
      .pipe(gulp.dest(npmConfig.distPath));
  },
));

gulp.task('npm.package-json', (cb) => {
  const pkgPath = path.join('.', buildConfig.npm.distPath, 'package.json');
  const pkg = require(`./${pkgPath}`);
  delete pkg.publishConfig;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  cb();
});

gulp.task('npm.pack', gulp.series(
  'npm.content',
  'npm.package-json',
  (cb) => {
    argv.withDescriptions ? exec('pnpm run angular:inject-descriptions', { cwd: '../..' }, (err) => cb(err)) : cb();
  },
  (cb) => { exec('pnpm pack', { }, (err) => cb(err)); },
  () => gulp.src(buildConfig.npm.distPath)
    .pipe(gulp.dest('./node_modules/devextreme-angular')),
));

// ------------Main------------

const buildTask = gulp.series('build.components');

gulp.task('build', buildTask);
gulp.task('default', buildTask);
gulp.task('generate', gulp.series(
  'generate.facades',
  'generate.common-reexports',
));

// ------------Testing------------

gulp.task('clean.tests', () => {
  const outputFolderPath = buildConfig.components.testsPath;

  return del([outputFolderPath]);
});

gulp.task('generate-component-names', (done) => {
  const generator = new AngularComponentNamesGenerator(buildConfig.tools.componentNamesGenerator);

  generator.generate();

  done();
});

gulp.task('copy.dist.dx-angular', () => {
  return gulp
    .src(`${buildConfig.npm.distPath}/**/*`)
    .pipe(gulp.dest(path.join(buildConfig.components.testsPath, 'node_modules/devextreme-angular')));
});

gulp.task('build.tests', gulp.series('clean.tests', 'generate-component-names', 'copy.dist.dx-angular', () => {
  const config = buildConfig.components;
  const testConfig = buildConfig.tests;

  return gulp.src(config.tsTestSrc)
    .pipe(sourcemaps.init())
    .pipe(typescript(testConfig.tsConfigPath))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.testsPath));
}));

gulp.task('watch.spec', () => {
  gulp.watch(buildConfig.components.tsTestSrc, ['build.tests']);
});

const getKarmaConfig = function (testsPath) {
  const preprocessors = {};
  preprocessors[testsPath] = ['webpack'];
  return karmaConfig.parseConfig(path.resolve('./karma.conf.js'), {
    files: [{ pattern: testsPath, watched: false }],
    preprocessors,
  }, {throwErrors: true});
};

gulp.task('test.components.client', gulp.series('build.tests', (done) => {
  new karmaServer(getKarmaConfig('./karma.test.shim.js'), done).start();
}));

gulp.task('test.components.server', gulp.series('build.tests', (done) => {
  new karmaServer(getKarmaConfig('./karma.server.test.shim.js'), done).start();
}, (done) => {
  new karmaServer(getKarmaConfig('./karma.hydration.test.shim.js'), done).start();
}));

gulp.task('test.components.client.debug', (done) => {
  const config = getKarmaConfig('./karma.test.shim.js');
  config.browsers = ['Chrome'];
  config.singleRun = false;

  new karmaServer(config, done).start();
});

gulp.task('test.components.server.debug', (done) => {
  const config = getKarmaConfig('./karma.server.test.shim.js');
  config.browsers = ['Chrome'];
  config.singleRun = false;

  new karmaServer(config, done).start();
});

gulp.task('run.tests', gulp.series('test.components.client', 'test.components.server'));

gulp.task('test', gulp.series('build', 'run.tests'));

gulp.task('watch.test', (done) => {
  new karmaServer({
    configFile: `${__dirname}/karma.conf.js`,
  }, done).start();
});
