import path from 'path';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';

export default {
    input: './entry/modules_esm.js',
    output: {
        file: './dist/dist_rollup/bundle_esm.js',
        format: 'es'
    },
    external: [ 'rrule'],
    plugins: [
        alias({
            globalize$: path.join(__dirname, './node_modules/globalize/dist/globalize.js'),
            globalize: path.join(__dirname, './node_modules/globalize/dist/globalize'),
            cldr$: path.join(__dirname, './node_modules/cldrjs/dist/cldr.js'),
            cldr: path.join(__dirname, './node_modules/cldrjs/dist/cldr')
        }),
        nodeResolve(),
        commonJs()
    ]
};
