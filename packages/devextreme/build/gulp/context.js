'use strict';

// See tests in version-spec.js

const argv = require('yargs')
    .option('uglify', { type: 'boolean', default: false })
    .parseSync();

const version = require('../../package.json').version;

module.exports = {
    version,
    uglify: argv.uglify,
    RESULT_JS_PATH: 'artifacts/js',
    RESULT_NPM_PATH: 'artifacts/npm',
    TS_OUT_PATH: 'artifacts/dist_ts',
    TRANSPILED_PATH: 'artifacts/transpiled',
    TRANSPILED_PROD_RENOVATION_PATH: 'artifacts/transpiled-renovation-npm',
    TRANSPILED_RENOVATION_PATH: 'artifacts/transpiled-renovation',
    TRANSPILED_PROD_ESM_PATH: 'artifacts/transpiled-esm-npm',
    SCSS_PACKAGE_PATH: '../devextreme-scss',
    EULA_URL: 'https://js.devexpress.com/Licensing/'
};
