import typescript from "@rollup/plugin-typescript";

function getEs6Config(path, outputDir) {
    return {
        input: `src/${path}/index.ts`,
        output: [
            {
                dir: `${outputDir}/esm`,
                entryFileNames: '[name].js',
                format: 'esm',
                sourcemap: true,
                exports: 'named',
                preserveModules: true,
                preserveModulesRoot: 'src',
            }
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.package.json',
                compilerOptions: {
                    outDir: `${outputDir}/esm`,
                    module: 'ES2020'
                }
            }),
        ]
    }
}

function getCjsConfig(path, outputDir) {
    return {
        input: `src/${path}/index.ts`,
        output: [
            {
                dir: `${outputDir}/cjs`,
                entryFileNames: '[name].cjs',
                format: 'cjs',
                sourcemap: true,
                exports: 'named',
                preserveModules: true,
                preserveModulesRoot: 'src',
            }
        ],
        plugins: [
            typescript({
                tsconfig: './tsconfig.package.json',
                compilerOptions: {
                    outDir: `${outputDir}/cjs`,
                    module: 'ESNEXT',
                    // declaration: false,
                    // declarationMap: false
                }
            }),
        ]
    }
}

function getRootConfig(outputDir) {
    return {
        input: './src/index.ts',
        output: {
            dir: outputDir,
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
    return [
        ...components.map((componentName) => getEs6Config(`components/${componentName}`, outputDir)),
        ...components.map((componentName) => getCjsConfig(`components/${componentName}`, outputDir)),
        getEs6Config('internal', outputDir),
        getCjsConfig('internal', outputDir),
       // getRootConfig(outputDir),
    ];
}

export {
    getEs6Config,
    getCjsConfig,
    getRootConfig,
    getRollupConfig,
}
