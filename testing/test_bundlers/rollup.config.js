/* eslint-disable spellcheck/spell-checker */
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: './testing/test_bundlers/src/index.js',
    output: {
        file: './artifacts/test_bundlers/dist_rollup/main.js',
        format: 'iife'
    },
    plugins: [nodeResolve({
        moduleDirectories: ['./artifacts/npm/devextreme', 'node_modules'],
        preferBuiltins: false,
    }),
    commonjs(),
    ]
};
