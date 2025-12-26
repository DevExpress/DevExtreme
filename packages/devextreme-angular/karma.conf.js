/* global process */
process.env.CHROME_BIN = require('puppeteer').executablePath();

const webpackConfig = require('./webpack.test');

module.exports = function (config) {
  config.set({

    basePath: './',

    frameworks: ['jasmine'],

    port: 9876,

    logLevel: config.LOG_ERROR,

    colors: true,

    autoWatch: true,

    browsers: ['ChromeHeadlessWithGC'],

    customLaunchers: {
      ChromeHeadlessWithGC: {
        base: 'ChromeHeadless',
        flags: [
          '--js-flags=--expose-gc',
          '--no-sandbox',
          '--disable-gpu',
          '--enable-precise-memory-info'
        ]
      }
    },

    reporters: [
      'progress',
      'junit',
    ],

    client: {
      jasmine: {
        random: false,
      },
    },

    junitReporter: {
      outputFile: 'test-results.xml',
    },

    // Karma plugins loaded
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-junit-reporter'),
      require('karma-webpack'),
    ],

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only',
    },

    singleRun: true,

    concurrency: Infinity,
  });
};
