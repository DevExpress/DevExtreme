import typescript from '@rollup/plugin-typescript';

const OUTPUT_DIR = './lib'

function getBundleConfig(outputDir, format) {
    return {
        input: './src/index.ts',
        output: {
            dir: outputDir,
            entryFileNames: `[name].${format === 'cjs' ? 'cjs' : 'mjs'}`,
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
