import {
  getBundleConfig, getDtsConfig,
} from '../../../build/rollup/utils.js';

const OUTPUT_DIR = './lib';

function getRollupConfig(outputDir) {
  return [
    getBundleConfig(outputDir, 'esm'),
    getBundleConfig(outputDir, 'cjs'),
    getDtsConfig(outputDir, true),
  ];
}

export default getRollupConfig(OUTPUT_DIR);
