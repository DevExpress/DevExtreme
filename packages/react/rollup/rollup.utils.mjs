import Path from 'path';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import sourcemaps from 'rollup-plugin-sourcemaps';

function checkExternalPackage(id) {
    return ['@devexpress'].includes(id.split('/')[0]);
}

const TSC_OUT_DIR = 'tsc-out';
const FORMAT_EXTENSIONS = {
    esm: 'mjs',
    cjs: 'cjs',
}

function getOutputConfig(outDir, format) {
    return {
        dir: outDir,
        entryFileNames: `[name].${FORMAT_EXTENSIONS[format]}`,
        format,
        sourcemap: true,
        exports: 'named',
    }
}

function getRootConfig(outDir) {
    return {
        input: Path.join(TSC_OUT_DIR, 'index.js'),
        output: {
            dir: outDir
        },
        plugins: [
            copy({
                targets: [
                    { src: 'src/**/*.scss', dest: 'tsc-out' },
                    { src: 'tsc-out/**/*.d.ts', dest: `${outDir}` },
                    { src: 'tsc-out/**/*.d.ts.map', dest: `${outDir}` }
                ],
                copyOnce: true,
                flatten: false
            }),
        ],
    }
}

function getEsmConfig(input, outDir) {
    return {
        input,
        output: getOutputConfig(`${outDir}`, 'esm'),
        plugins: [
            sourcemaps(),
            peerDepsExternal(),
            postcss({
                inject: false,
                extract: false,
            })
        ],
        external: checkExternalPackage,
    }
}

function getCjsConfig(input, outDir) {
    return {
        input,
        output: getOutputConfig(`${outDir}`, 'cjs'),
        plugins: [
            sourcemaps(),
            peerDepsExternal(),
            postcss({
                inject: false,
                extract: false,
            }),
        ],
        external: checkExternalPackage,
    };
}

function getCSSConfigs(components, inputPaths, outDir) {
    return components.map(componentName => {
        return {
            input: inputPaths[componentName],
            output: {
                file: Path.join(outDir, `${componentName}.css`)
            },
            plugins: [
                peerDepsExternal(),
                postcss({
                    extract: true,
                }),
            ],
            external: checkExternalPackage,
        }
    })
}

function getRollupConfig(components, outDir) {
    const inputPaths = {
        internal: Path.join(TSC_OUT_DIR, `internal`, 'index.js'),
    }
    components.forEach(componentName => {
        inputPaths[componentName] = Path.join(TSC_OUT_DIR, 'components', componentName, 'index.js')
    })

    return [
        getRootConfig(outDir),
        getEsmConfig(inputPaths, outDir),
        getCjsConfig(inputPaths, outDir),
        ...getCSSConfigs(components, inputPaths, outDir),
    ]
}

export {
    getRollupConfig,
}
