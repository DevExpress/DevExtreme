/* jshint node: true */

"use strict";

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
        'globalize/message': 'window.Globalize'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                    plugins: ['transform-es2015-modules-commonjs', 'add-module-exports']
                }
            }
        }]
    }
};
