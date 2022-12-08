import typescript from '@rollup/plugin-typescript';

const OUTPUT_DIR = './lib'
const FORMAT_EXTENSIONS = {
    esm: 'mjs',
    cjs: 'cjs',
}

function checkExternalPackage(id) {
    return ['@devextreme'].includes(id.split('/')[0]);
}

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

export default getRollupConfig(OUTPUT_DIR)
