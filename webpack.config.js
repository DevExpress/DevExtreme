/* eslint-env node */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    optimization: {
        // eslint-disable-next-line spellcheck/spell-checker
        minimizer: [new TerserPlugin({
            extractComments: false,
        })],
    },
    output: {
        sourcePrefix: '    ',
        devtoolModuleFilenameTemplate: 'devextreme:///[resource-path]',
        devtoolFallbackModuleFilenameTemplate: 'devextreme:///[resource-path]?[hash]'
    },
    externals: {
        // Optional (calling through window to skip error on script load)
        'jquery': 'window.jQuery',
        'jszip': 'window.JSZip',
        'knockout': 'window.ko',
        'angular': 'window.angular',
        'globalize': 'window.Globalize',
        'globalize/number': 'window.Globalize',
        'globalize/currency': 'window.Globalize',
        'globalize/date': 'window.Globalize',
        'globalize/message': 'window.Globalize',
        'devextreme-quill': 'window.DevExpress.Quill',
        'turndown': 'window.TurndownService',
        'devextreme-showdown': 'window.showdown',
        'exceljs': 'window.ExcelJS',
        'jspdf': 'window.jspdf.jsPDF',
        'devexpress-diagram': 'window.DevExpress.diagram',
        'devexpress-gantt': 'window.DevExpress.Gantt',
        'luxon': 'window.luxon'
    },
    resolve: {
        alias: {
            '@devextreme/vdom': path.resolve('./node_modules/@devextreme/vdom/dist/cjs/index.js'),
            '@devextreme/runtime/common': path.resolve('./node_modules/@devextreme/runtime/cjs/common/index.js'),
            '@devextreme/runtime/inferno': path.resolve('./node_modules/@devextreme/runtime/cjs/inferno/index.js'),
            '@devextreme/runtime/declarations': path.resolve('./node_modules/@devextreme/runtime/cjs/declarations/index.js'),
            '@devextreme/runtime/angular': path.resolve('./node_modules/@devextreme/runtime/cjs/angular/index.js'),
            '@devextreme/runtime/vue': path.resolve('./node_modules/@devextreme/runtime/cjs/vue/index.js'),
            '@devextreme/runtime/react': path.resolve('./node_modules/@devextreme/runtime/cjs/react/index.js')
        }
    },
};
