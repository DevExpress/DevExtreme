/* eslint-disable spellcheck/spell-checker */
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

module.exports = {
    root: './src',

    build: {
        rollupOptions: {
            input: './src/modules_esm.js',
            output: {
                file: '../../artifacts/test_bundlers/dist_vite/bundle_esm.js',
                exports: 'auto',
                format: 'es'
            },
            plugins: [
                nodeResolve({
                    moduleDirectories: ['node_modules', './node_modules/globalize/dist'],
                    preferBuiltins: false
                }),
                commonjs()
            ]
        }
    }
};
