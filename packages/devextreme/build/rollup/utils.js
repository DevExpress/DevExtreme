import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

export const FORMAT_EXTENSIONS = {
  esm: 'mjs',
  cjs: 'cjs',
}

export function checkExternalPackage(id) {
  return ['@devextreme'].includes(id.split('/')[0]);
}

export function checkWatchMode() {
  return process.argv.indexOf('--watch') === -1;
}

export function isWatchMode() {
  return process.argv.indexOf('--watch') > -1;
}

export function getDtsConfig(outputDir, forceTsConfig = false) {
  return {
    input: './src/index.ts',
    output: [{
      file: `${outputDir}/index.d.ts`,
      format: 'es',
      sourcemap: true,
    }],
    plugins: [
      dts(forceTsConfig ? {
        tsconfig: './tsconfig.package.json',
      } : {}),
    ],
  };
}

export function getBundleConfig(outputDir, format) {
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
    external: checkExternalPackage,
  };
}
