/* jshint node: true */

"use strict";

module.exports = {
    output: {
        sourcePrefix: '    ',
        devtoolModuleFilenameTemplate: "devextreme:///[resource-path]",
        devtoolFallbackModuleFilenameTemplate: "devextreme:///[resource-path]?[hash]"
    },
    externals: {
        // Required
        'jquery': 'jQuery',
        // Optional (calling through window to skip error on script load)
        'jszip': 'window.JSZip',
        'knockout': 'window.ko',
        'angular': 'window.angular',
        'globalize': 'window.Globalize',
        'globalize/number': 'window.Globalize',
        'globalize/currency': 'window.Globalize',
        'globalize/date': 'window.Globalize',
        'globalize/message': 'window.Globalize'
    }
};
