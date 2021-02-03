/* global process */
process.env.CHROME_BIN = require('puppeteer').executablePath();

var webpackConfig = require('./webpack.test');

module.exports = function(config) {
    config.set({

        basePath: './',

        frameworks: ['jasmine'],

        port: 9876,

        logLevel: config.LOG_ERROR,

        colors: true,

        autoWatch: true,

        browsers: ['ChromeHeadless'],

        reporters: [
            'progress',
            'junit'
        ],

        junitReporter: {
            outputFile: 'test-results.xml'
        },

        // Karma plugins loaded
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-junit-reporter'),
            require('karma-webpack')
        ],

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        singleRun: true,

        concurrency: Infinity
    });
};
