/* global process */
process.env.CHROME_BIN = require('puppeteer').executablePath();

const path = require('path');

const webpackConfig = require(path.resolve(__dirname, './webpack.test'));

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
          '--enable-features=MeasureMemory',
          '--js-flags=--expose-gc',
          '--no-sandbox',
          '--disable-gpu',
          '--enable-precise-memory-info',
        ],
      },
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
    beforeMiddleware: ['customHeaders'],
    // Karma plugins loaded
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-junit-reporter'),
      require('karma-webpack'),
      {
        'middleware:customHeaders': ['factory', function () {
          return function (req, res, next) {
            res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
            next();
          };
        }],
      },
    ],

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only',
    },

    singleRun: true,

    concurrency: Infinity,
  });
};
