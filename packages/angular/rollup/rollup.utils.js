import peerDepsExternal from "rollup-plugin-peer-deps-external";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy";

function checkExternalPackage(id) {
    return ['@devexpress'].includes(id.split('/')[0]);
}

function getEsmConfig(componentName, outputDir) {
    const inputPath = `src/components/${componentName}/index.ts`;

    return {
        input: inputPath,
        output: {
            dir: outputDir,
            entryFileNames: '[name].js',
            format: 'esm',
            sourcemap: true,
            exports: 'named',
            preserveModules: true,
            preserveModulesRoot: 'src',
        },
        plugins: [
            peerDepsExternal(),
            commonjs(),
            typescript({
                tsconfig: './tsconfig.package.json',
                compilerOptions: {
                    outDir: outputDir,
                    declaration: true,
                }
            }),
            postcss({
                extract: `${componentName}.css`,
            }),
            copy({
                targets: [{
                    src: `src/components/${componentName}/package.json`,
                    dest: `${outputDir}/components/${componentName}`
                }]
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
            commonjs(),
            typescript({
                tsconfig: './tsconfig.package.json',
                compilerOptions: {
                    outDir: `${outputDir}/cjs`,
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
            dir: outputDir,
            format: 'esm',
            preserveModules: true,
            preserveModulesRoot: 'src',
        },
        plugins: [
            typescript({
                tsconfig: './tsconfig.package.json',
                compilerOptions: {
                    outDir: `${outputDir}`,
                }
            }),
            postcss({
                inject: false,
                extract: false,
            }),
            copy({
                targets: [
                    {src: './rollup/package.build.json', dest: outputDir, rename: 'package.json'}
                ]
            })
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
