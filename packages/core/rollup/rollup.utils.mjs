import typescript from '@rollup/plugin-typescript';
import Path from "path";

function getEs6Config(input, outputDir) {
    return {
        input,
        output: [
            {
                dir: outputDir,
                entryFileNames: '[name].mjs',
                format: 'esm',
                sourcemap: true,
                exports: 'named',
            }
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.package.json',
                compilerOptions: {
                    outDir: outputDir,
                }
            }),
        ]
    }
}

function getCjsConfig(input, outputDir) {
    return {
        input,
        output: [
            {
                dir: outputDir,
                entryFileNames: '[name].cjs',
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
            }
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.package.json',
                compilerOptions: {
                    outDir: outputDir,
                    // declaration: false,
                    // declarationMap: false
                }
            }),
        ]
    }
}

function getRootConfig(outputDir, format) {
    return {
        input: './src/index.ts',
        output: {
            dir: outputDir,
            entryFileNames: `[name].${format === 'cjs' ? 'cjs' : 'mjs'}`,
            format,
        },
        plugins: [
            typescript({
                tsconfig: './tsconfig.package.json',
                compilerOptions: {
                    outDir: outputDir
                }
            })
        ]
    };
}

function getRollupConfig(components, outputDir) {
    // const inputPaths = {
    //     internal: Path.join('src', `internal`, 'index.ts'),
    // }
    // components.forEach(componentName => {
    //     inputPaths[componentName] = Path.join('src', 'components', componentName, 'index.ts')
    // })

    return [
        // getEs6Config(inputPaths, outputDir),
        // getCjsConfig(inputPaths, outputDir),
       getRootConfig(outputDir, 'esm'),
       getRootConfig(outputDir, 'cjs'),
    ];
}

export {
    getEs6Config,
    getCjsConfig,
    getRootConfig,
    getRollupConfig,
}
