import peerDepsExternal from "rollup-plugin-peer-deps-external";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";

function checkExternalPackage(id) {
    return ['@devexpress'].includes(id.split('/')[0]);
}

function getEsmConfig(componentName, outputDir) {
    const inputPath = `src/components/${componentName}/index.ts`;

    return {
        input: inputPath,
        output: {
            dir: `${outputDir}/esm`,
            entryFileNames: '[name].js',
            format: 'esm',
            sourcemap: true,
            exports: 'named',
            preserveModules: true,
            preserveModulesRoot: 'src',
        },
        plugins: [
            peerDepsExternal(),
            typescript({
                tsconfig: './tsconfig.package.json',
                compilerOptions: {
                    outDir: `${outputDir}/esm`,
                    module: 'ES2020'
                }
            }),
            postcss({
                extract: `${componentName}.css`,
            })
        ],
        external: checkExternalPackage,
    }
}

function getCjsConfig(componentName, outputDir) {
    const inputPath = `src/components/${componentName}/index.ts`;

    return {
        input: inputPath,
        output: {
            dir: `${outputDir}/cjs`,
            entryFileNames: '[name].cjs',
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
            preserveModules: true,
            preserveModulesRoot: 'src',
        },
        plugins: [
            peerDepsExternal(),
            typescript({
                tsconfig: './tsconfig.package.json',
                compilerOptions: {
                    outDir: `${outputDir}/cjs`,
                    module: 'ESNEXT'
                }
            }),
            postcss({
                inject: false,
                extract: false,
            }),
        ],
        external: checkExternalPackage,
    };
}

function getRootConfig(outputDir) {
    return {
        input: './src/index.ts',
        output: {
            dir: `${outputDir}/esm`,
            format: 'esm',
            preserveModules: true,
            preserveModulesRoot: 'src',
        },
        plugins: [
            typescript({
                tsconfig: './tsconfig.package.json',
                compilerOptions: {
                    outDir: `${outputDir}/esm`,
                }
            }),
            postcss({
                inject: false,
                extract: false,
            }),

        ],
        external: checkExternalPackage,
    };
}

function getRollupConfig(components, outputPath) {
    return [
        ...components.map((componentName) => getEsmConfig(componentName, outputPath)),
        ...components.map((componentName) => getCjsConfig(componentName, outputPath)),
        getRootConfig(outputPath),
    ];
}

export {
    getEsmConfig,
    getCjsConfig,
    getRootConfig,
    getRollupConfig,
}
