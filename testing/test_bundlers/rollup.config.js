/* eslint-disable spellcheck/spell-checker */

import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import nodePolyfills from 'rollup-plugin-node-polyfills';
// import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';


export default {
    input: './src/modules_esm.js',
    output: {
        file: './dist/dist_rollup/bundle_esm.js',
        // exports: 'auto',
        format: 'cjs'
    },
    plugins: [
        replace({
            'preventAssignment': true,
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        nodeResolve({
            moduleDirectories: ['./node_modules/', './node_modules/globalize/dist'],
            // moduleDirectories: ['./node_modules/'],
            preferBuiltins: false
        }),
        // commonjs(),
        commonjs({
            sourceMap: true,
            exclude: [ '../../artifacts/npm/devextreme/node_modules/rrule/dist/esm/src/rrule.js'],
            // esmExternals: ['./rrule'],
            // defaultIsModuleExports: true,
            // requireReturnsDefault: 'preferred',
            // ignoreDynamicRequires: true,
            include: [
                '../../artifacts/npm/devextreme/node_modules/jszip/lib/index.js',
                '../../artifacts/npm/devextreme/node_modules/devexpress-gantt/dist/dx-gantt.js',
                '../../artifacts/npm/devextreme/node_modules/devextreme-quill/dist/dx-quill.js',
                '../../node_modules/globalize/dist/node-main.js',
                '../../artifacts/npm/devextreme/node_modules/rrule/dist/esm/src/rrule.js'
            ],
            dynamicRequireTargets: [
                '../../artifacts/npm/devextreme/node_modules/jszip/lib/index.js',
                '../../artifacts/npm/devextreme/node_modules/devexpress-gantt/dist/dx-gantt.js',
                '../../artifacts/npm/devextreme/node_modules/devextreme-quill/dist/dx-quill.js',
                '../../node_modules/globalize/dist/node-main.js',
                '../../artifacts/npm/devextreme/node_modules/rrule/dist/esm/src/rrule.js',
                '../../artifacts/npm/devextreme/node_modules/luxon/src/impl/locale.js',
                '../../artifacts/npm/devextreme/node_modules/luxon/src/datetime.js'
            ],
        })
        // alias({
        //     globalize$: './node_modules/globalize/dist/globalize.js',
        //     globalize: './node_modules/globalize/dist/globalize',
        //     cldr$: './node_modules/cldrjs/dist/cldr.js',
        //     cldr: './node_modules/cldrjs/dist/cldr'
        // })
    ]
};
