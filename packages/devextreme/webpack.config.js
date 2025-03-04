/* eslint-env node */
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
        'globalize': 'window.Globalize',
        'globalize/number': 'window.Globalize',
        'globalize/currency': 'window.Globalize',
        'globalize/date': 'window.Globalize',
        'globalize/message': 'window.Globalize',
        'devextreme-quill': 'window.DevExpress.Quill',
        'exceljs': 'window.ExcelJS',
        'jspdf': 'window.jspdf.jsPDF',
        'devexpress-diagram': 'window.DevExpress.diagram',
        'devexpress-gantt': 'window.DevExpress.Gantt',
        'luxon': 'window.luxon'
    },
    resolve: {
        alias: {
            // '@devextreme/vdom': require.resolve('@devextreme/vdom/dist/cjs/index.js'),
            // '@devextreme/runtime/common': require.resolve('./js/__internal/core/r1/runtime/common/index.ts'),
            '@devextreme/runtime/inferno': require.resolve('js/__internal/core/r1/runtime/inferno/index.ts'),
            // '@devextreme/runtime/declarations': require.resolve('./js/__internal/core/r1/runtime/declarations/index.ts'),
            // '@devextreme/runtime/angular': require.resolve('./js/__internal/core/r1/runtime/angular/index.ts'),
            // '@devextreme/runtime/vue': require.resolve('./js/__internal/core/r1/runtime/vue/index.ts'),
            // '@devextreme/runtime/react': require.resolve('./js/__internal/core/r1/runtime/react/index.tsx')
        }
    },
};
