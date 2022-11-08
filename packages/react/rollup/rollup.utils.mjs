import Path from 'path';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
// import typescript from 'rollup-plugin-typescript2';
import typescript from "@rollup/plugin-typescript";
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';

function checkExternalPackage(id) {
    return ['@devexpress'].includes(id.split('/')[0]);
}

const OUTPUT_DIR = './lib';
const TSC_OUT = 'tsc-out'

const inputPaths = {
    pager: Path.join(TSC_OUT, `components/pager`, 'index.js'),
    slideToggle: Path.join(TSC_OUT, `components/slideToggle`, 'index.js'),
    internal: Path.join(TSC_OUT, `internal`, 'index.js'),
}

function getOutputConfig(outDir, format) {
    return {
        dir: outDir,
        entryFileNames: `[name].js`,
        format,
        sourcemap: true,
        exports: 'named',
    }
}

function getInputPath(path) {
    return Path.join('tsc-out', path, 'index.js')
}

function getRootConfig() {
    return {
        input: getInputPath(''),
        output: OUTPUT_DIR,
        plugins: [
            copy({
                targets: [
                    { src: 'src/**/*.scss', dest: 'tsc-out' },
                    { src: 'tsc-out/**/*.d.ts', dest: `${OUTPUT_DIR}/esm` }
                ],
                copyOnce: true,
                flatten: false
            }),
        ],
    }
}

function getEsmConfig() {
    return {
        input: inputPaths,
        output: getOutputConfig(`${OUTPUT_DIR}/esm`, 'esm'),
        plugins: [
            peerDepsExternal(),
            postcss({
                extract: true,
            })
        ],
        external: checkExternalPackage,
    }
}

function getCjsConfig() {
    return {
        input: inputPaths,
        output: getOutputConfig(`${OUTPUT_DIR}/cjs`, 'cjs'),
        plugins: [
            peerDepsExternal(),
            postcss({
                inject: false,
                extract: false,
            }),
        ],
        external: checkExternalPackage,
    };
}

function getRollupConfig() {
    return [
        getRootConfig(),
        getEsmConfig(),
        getCjsConfig()
    ]
}

export {
    getEsmConfig,
    getCjsConfig,
    getRollupConfig,
}
