import gulp from 'gulp';
import fs from 'node:fs';
import { generateInfernoFromReactComponents, ReactSrc } from './gulp/inferno-from-react.mjs';
import './gulp/js-bundles.mjs';

gulp.task('build-dev', gulp.series(
   function generateInfernoComponents() {
      return generateInfernoFromReactComponents('./src/generated');
   },
   function patchGeneratedSourcies(done) {
      fs.copyFileSync('./patch/radio-button-hocs.jsx', './src/generated/components/radio-button/radio-button-hocs.jsx');
      done()
   },
   'js-bundles-debug'
)
)

gulp.task('watch', () =>
   gulp.watch(
      [...ReactSrc, './src/*'],
      gulp.series(['js-bundles-debug'])
   )
);
