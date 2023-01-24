import gulp from 'gulp';
import fs from 'node:fs';
import babel from 'gulp-babel';
import { generateInfernoFromReactComponents, ReactSrc } from './gulp/inferno-from-react.mjs';
import './gulp/js-bundles.mjs';
import transpileConfig from './gulp/transpile-config.mjs';

function generateInfernoComponents() {
  return generateInfernoFromReactComponents('./src/generated');
}

function patchGeneratedSources(done) {
  fs.copyFileSync('./patch/radio-button-hocs.jsx', './src/generated/components/radio-button/radio-button-hocs.jsx');
  done();
}

function transpile() {
  return gulp.src('./src/**/*.js*')
    .pipe(babel(transpileConfig.esm))
    .pipe(gulp.dest('./lib/esm'));
}

function copydts() {
  return gulp.src(['./src/**/*.d.ts'])
    .pipe(gulp.dest('./lib/esm'));
}

function generateInferno() {
  return gulp.series(
    generateInfernoComponents,
    patchGeneratedSources,
  );
}

function build() {
  return gulp.series(
    generateInferno(),
        gulp.parallel(
      'js-bundles-debug',
      gulp.series(
        transpile,
        copydts
      )
    )
  )
}

gulp.task('build-dev',
  build(),
);

gulp.task('watch', () =>
  gulp.watch(
    [...ReactSrc, './src/*'],
    build(),
  ),
);
