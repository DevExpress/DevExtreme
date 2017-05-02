// jshint node:true

"use strict";

var fs = require('fs');
var argv = require('yargs')
    .default('uglify', false)
    .argv;

var productVersion = readVersion(),
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

function readVersion() {
    var packageVersion = require('../../package.json').version;

    var SCRIPT_VERSION_FILE = 'js/core/version.js';
    var scriptVersion = (function() {
        var text = fs.readFileSync(SCRIPT_VERSION_FILE, 'utf8'),
            match = text.match(/"(.+?)".+?DevExpress\.VERSION/);

        if(!match) {
            throw 'Version marker is corrupt in ' + SCRIPT_VERSION_FILE;
        }

        return match[1];
    })();

    if(packageVersion !== scriptVersion) {
        throw 'Product version mismatch in ' + SCRIPT_VERSION_FILE;
    }

    return packageVersion;
}

module.exports = {
    version: {
        product: productVersion,
        package: packageVersion
    },
    uglify: argv.uglify,
    RESULT_JS_PATH: 'artifacts/js',
    RESULT_NPM_PATH: 'artifacts/npm',
    EULA_URL: 'https://js.devexpress.com/Licensing/'
};
