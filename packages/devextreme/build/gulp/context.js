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
    RESULT_NPM_PATH: 'artifacts/npm',
    TRANSPILED_PATH: 'artifacts/transpiled',
    TRANSPILED_PROD_RENOVATION_PATH: 'artifacts/transpiled-renovation-npm',
    TRANSPILED_RENOVATION_PATH: 'artifacts/transpiled-renovation',
    TRANSPILED_PROD_ESM_PATH: 'artifacts/transpiled-esm-npm',
    EULA_URL: 'https://js.devexpress.com/Licensing/'
};
