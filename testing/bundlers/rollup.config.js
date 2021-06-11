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
    external: [ 'rrule', /* 'devexpress-diagram', '@devextreme/vdom', './pager', './layout', './title', './group_panel'*/],
    plugins: [
        alias({
            globalize$: path.join(__dirname, './node_modules/globalize/dist/globalize.js'),
            globalize: path.join(__dirname, './node_modules/globalize/dist/globalize'),
            cldr$: path.join(__dirname, './node_modules/cldrjs/dist/cldr.js'),
            cldr: path.join(__dirname, './node_modules/cldrjs/dist/cldr')
        }),
        nodeResolve({
            moduleDirectories: ['./node_modules/', './node_modules/globalize/dist'],
        }),
        commonJs({
            include: [
                './node_modules/rxjs/**',
                './node_modules/jszip/**',
                './node_modules/devexpress-gantt/**',
                './node_modules/devextreme-quill/**',
                './node_modules/globalize/**',
                './node_modules/luxon/**',
                '../../node_modules/jquery/dist/jquery.js',
                './node_modules/devexpress-diagram/**'
            ],
            dynamicRequireTargets: [
                './node_modules/jszip/lib/utils.js'
            ]
        })
    ]
};
