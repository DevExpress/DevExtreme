/* eslint-disable spellcheck/spell-checker */
/* global  __dirname */

import path from 'path';

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';

export default {
    input: './src/modules_esm.js',
    output: {
        file: './dist/dist_rollup/bundle_esm.js',
        format: 'es'
    },
    external: [ 'rrule' ],
    plugins: [
        alias({
            jszip: path.join(__dirname, './node_modules/jszip/dist/jszip.min.js'),
            globalize$: path.join(__dirname, './node_modules/globalize/dist/globalize.js'),
            globalize: path.join(__dirname, './node_modules/globalize/dist/globalize'),
            cldr$: path.join(__dirname, './node_modules/cldrjs/dist/cldr.js'),
            cldr: path.join(__dirname, './node_modules/cldrjs/dist/cldr')
        }),
        nodeResolve({
            moduleDirectories: ['./node_modules/', './node_modules/globalize/dist'],
            browser: true
        }),
        commonjs({
            include: [
                './node_modules/rxjs/**',
                './node_modules/jszip/**',
                './node_modules/devexpress-gantt/**',
                './node_modules/devextreme-quill/**',
                './node_modules/globalize/**',
                './node_modules/luxon/**'
            ]
        }),

    ]
};
