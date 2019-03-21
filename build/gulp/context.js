// Look at the versionSpecification.js for testing

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
    EULA_URL: 'https://js.devexpress.com/Licensing/'
};
