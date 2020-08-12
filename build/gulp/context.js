'use strict';

// See tests in version-spec.js

const argv = require('yargs')
    .default('uglify', false)
    .argv;

const version = require('./version')(
    require('../../package.json').version,
    process.env.DEVEXTREME_DXBUILD_LABEL,
    process.env.DEVEXTREME_DXBUILD_FLAVOR,
    process.env.DEVEXTREME_DXBUILD_REVISION
);

module.exports = {
    version,
    uglify: argv.uglify,
    RESULT_JS_PATH: 'artifacts/js',
    RESULT_JS_RENOVATION_PATH: 'artifacts/js-renovation',
    RESULT_NPM_PATH: 'artifacts/npm',
    TRANSPILED_PATH: 'artifacts/transpiled',
    TRANSPILED_PROD_PATH: 'artifacts/transpiled-npm',
    TRANSPILED_PROD_RENOVATION_PATH: 'artifacts/transpiled-renovation-npm',
    EULA_URL: 'https://js.devexpress.com/Licensing/'
};
