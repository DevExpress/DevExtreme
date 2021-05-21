/* eslint-disable spellcheck/spell-checker */
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: '../../testing/test_bundlers/src/import_modules_esm.js',
    output: {
        file: '../../artifacts/test_bundlers/dist_rollup/modules_esm.js',
        exports: 'auto',
        format: 'es'
    },
    plugins: [nodeResolve({
        moduleDirectories: ['node_modules'],
        preferBuiltins: false,
    }),
    commonjs()
    ]
};
