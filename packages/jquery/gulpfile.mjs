import gulp from 'gulp';
import fs from 'node:fs';
import { generateInfernoFromReactComponents, ReactSrc } from './gulp/inferno-from-react.mjs';
import './gulp/js-bundles.mjs';

function generateInfernoComponents() {
  return generateInfernoFromReactComponents('./src/generated');
}

function patchGeneratedSources(done) {
  fs.copyFileSync('./patch/radio-button-hocs.jsx', './src/generated/components/radio-button/radio-button-hocs.jsx');
  done();
}

function bundle() {
  return gulp.series(
    generateInfernoComponents,
    patchGeneratedSources,
    'js-bundles-debug',
  );
}

gulp.task('build-dev',
  bundle(),
);

gulp.task('watch', () =>
  gulp.watch(
    [...ReactSrc, './src/*'],
    bundle(),
  ),
);
