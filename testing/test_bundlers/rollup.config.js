/* eslint-disable spellcheck/spell-checker */
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: '../../testing/test_bundlers/src/index_esm.js',
    output: {
        file: '../../artifacts/test_bundlers/dist_rollup/main.js',
        exports: 'auto',
        format: 'es'
    },
    plugins: [nodeResolve({
        moduleDirectories: ['../../artifacts/npm', 'node_modules'],
        preferBuiltins: false,
    }),
    commonjs()
    ]
};
