import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: './testing/test_bundlers/src/index.js',
    output: {
        file: './artifacts/test_bundlers/dist_rollup/main.js',
        format: 'cjs'
    },
    plugins: [nodeResolve({
        moduleDirectories: ['./artifacts/npm/', 'node_modules']
    })]
};
