import typescript from '@rollup/plugin-typescript';
import {
  checkExternalPackage,
  checkWatchMode,
  FORMAT_EXTENSIONS,
} from '../../../build/rollup/utils.js';

const OUTPUT_DIR = './lib'

function getBundleConfig(outputDir, format) {
  return {
    input: 'src/index.ts',
    output: {
      dir: outputDir,
      entryFileNames: `[name].${FORMAT_EXTENSIONS[format]}`,
      format,
      sourcemap: true
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.package.json',
        compilerOptions: {
          noEmitOnError: checkWatchMode(),
          outDir: outputDir,
        },
        outputToFilesystem: true
      })
    ],
    external: checkExternalPackage,
  };
}

function getRollupConfig(outputDir) {
  return [
    getBundleConfig(outputDir, 'esm'),
    getBundleConfig(outputDir, 'cjs'),
  ];
}

export default getRollupConfig(OUTPUT_DIR);
