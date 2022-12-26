import esbuild from 'rollup-plugin-esbuild';
import {
  FORMAT_EXTENSIONS, getDtsConfig,
} from '../../../build/rollup/utils.js';

const OUTPUT_DIR = './lib';

function getBundleConfig(outputDir, format) {
  return {
    input: './src/index.ts',
    output: {
      dir: outputDir,
      entryFileNames: `[name].${FORMAT_EXTENSIONS[format]}`,
      format,
      sourcemap: true,
    },
    plugins: [
      esbuild({
        tsconfig: './tsconfig.package.json',
      })
    ],
  };
}

function getRollupConfig(outputDir) {
  return [
    getBundleConfig(outputDir, 'esm'),
    getBundleConfig(outputDir, 'cjs'),
    getDtsConfig(outputDir),
  ];
}

export default getRollupConfig(OUTPUT_DIR);
