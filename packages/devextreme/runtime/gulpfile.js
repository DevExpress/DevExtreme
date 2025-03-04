const ts = require('gulp-typescript');
const gulp = require('gulp');
const replace = require('gulp-replace');
const shell = require('gulp-shell');
const platforms = ['angular', 'react', 'vue', 'inferno', 'inferno-hooks', 'declarations', 'common'];

const getPackageContent = (platform) => {
  return `
  {
    "module": "../esm/${platform}/index",
    "main": "../cjs/${platform}/index"
  }
  `;
};

platforms.forEach(function(platform) {
  gulp.task(`create-package-json-file.${platform}`, function() {
    return gulp
      .src('./package.json')
      .pipe(replace(/[\s\S]+/, getPackageContent(platform)))
      .pipe(gulp.dest(`dist/${platform}`))
  });
});

gulp.task('compile.esm', function() {
  var tsProject = ts.createProject('tsconfig.esm.build.json');
  return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest('./dist/esm'))
});

gulp.task('compile.cjs', function() {
  const tsProject = ts.createProject('tsconfig.cjs.build.json');
  return tsProject.src()
    .pipe(tsProject())
    .pipe(gulp.dest('./dist/cjs'))
});

gulp.task('npm.license', function(done) {
  gulp
    .src('./LICENSE')
    .pipe(gulp.dest('./dist'))
  done();
});

gulp.task('npm.package', () => gulp
    .src('./package.json')
    .pipe(gulp.dest('./dist'))
);

gulp.task('npm.build',
  gulp.series(
    gulp.parallel('npm.license', 'npm.package'),
    shell.task(['npm pack'], { cwd: './dist' }),
    () => {
      return gulp.src('./dist/*.tgz')
        .pipe(gulp.dest('./'));
    }
));

gulp.task('create-package-json-file', gulp.parallel(
  platforms.map(function(name) { return `create-package-json-file.${name}` })
));

gulp.task('build', gulp.series(
  'compile.esm',
  'compile.cjs',
  'create-package-json-file')
);
