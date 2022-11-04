import gulp from 'gulp';
import * as fs from 'fs';
import { generateInfernoFromReactComponents } from './gulp/inferno-from-react.js';
import './gulp/js-bundles.js';

gulp.task('build-inferno', gulp.series(
  () => {
    return generateInfernoFromReactComponents('./src/generated');
  },
  (done) => {
    fs.rmSync('./src/generated/components/slideToggle', { recursive: true });

    fs.copyFileSync('./patch/empty.js', './src/generated/components/pager/types/public/index.js');
    fs.copyFileSync('./patch/empty.js', './src/generated/internal/types/index.js');
    fs.copyFileSync('./patch/internal-index.js',
      './src/generated/internal/index.js');
    fs.copyFileSync('./patch/dxPager.scss',
      './src/generated/components/pager/dxPager.scss');
    done()
  },
  'js-bundles-debug'
)
)
