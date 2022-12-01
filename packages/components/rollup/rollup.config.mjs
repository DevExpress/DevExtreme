import Path from "path";
import copy from "rollup-plugin-copy";

const OUTPUT_DIR = './lib'
const TSC_OUT_DIR = 'tsc-out';
const FORMAT_EXTENSIONS = {
  esm: 'mjs',
  cjs: 'cjs',
}

function getBundleConfig(outputDir, format) {
    return {
      input: Path.join(TSC_OUT_DIR, 'index.js'),
        output: {
            dir: outputDir,
            entryFileNames: `[name].${FORMAT_EXTENSIONS[format]}`,
            format,
            sourcemap: true
        },
        plugins: [
            copy({
              targets: [
                { src: 'tsc-out/**/*.d.ts', dest: `${outputDir}` },
                { src: 'tsc-out/**/*.d.ts.map', dest: `${outputDir}` }
              ],
              copyOnce: true,
              flatten: false
            })
        ]
    };
}

function getRollupConfig(outputDir) {
    return [
        getBundleConfig(outputDir, 'esm'),
        getBundleConfig(outputDir, 'cjs'),
    ];
}

export default getRollupConfig(OUTPUT_DIR)
