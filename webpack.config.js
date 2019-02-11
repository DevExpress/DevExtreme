/* eslint-env node */

var webpack = require('webpack');

module.exports = {
    output: {
        sourcePrefix: '    ',
        devtoolModuleFilenameTemplate: "devextreme:///[resource-path]",
        devtoolFallbackModuleFilenameTemplate: "devextreme:///[resource-path]?[hash]"
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
        'quill': 'window.Quill',
        'turndown': 'window.TurndownService',
        'showdown': 'window.showdown'
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version)
        })
    ]
};
