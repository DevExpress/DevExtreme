var argv = require('yargs')
    .default('uglify', false)
    .argv;

var productVersion = require('../../package.json').version,
    scriptVersion = productVersion,
    packageVersion = productVersion;

var dxBuildLabel = process.env.DEVEXTREME_DXBUILD_LABEL,
    dxBuildLabelFlavor = process.env.DEVEXTREME_DXBUILD_LABEL_FLAVOR,
    dxBuildRevision = process.env.DEVEXTREME_DXBUILD_REVISION;

if(dxBuildLabel) {
    if(String(dxBuildLabel).replace(/_/g, '.') !== productVersion) {
        throw 'DXBuild label does not match version in package.json';
    }
    if(dxBuildLabelFlavor) {
        productVersion += '-' + dxBuildLabelFlavor;
        packageVersion += '-' + dxBuildLabelFlavor;
    }
} else {
    if(dxBuildRevision) {
        productVersion += ' (build ' + dxBuildRevision + ')';
        packageVersion = packageVersion.replace(/\d+$/, m => 1 + Number(m)) + '-pre-' + dxBuildRevision;
    } else {
        productVersion += '-dev';
        packageVersion += '-dev';
    }
}

module.exports = {
    version: {
        product: productVersion,
        package: packageVersion,
        script: scriptVersion
    },
    uglify: argv.uglify,
    RESULT_JS_PATH: 'artifacts/js',
    RESULT_NPM_PATH: 'artifacts/npm',
    TRANSPILED_PATH: 'artifacts/transpiled',
    EULA_URL: 'https://js.devexpress.com/Licensing/'
};
