'use strict';

const fs = require('fs');
const path = require('path');

const pkg = require('../package.json');

const generateProdPackageFile = (sourcePkg) => {
    const packagePath = path.resolve('./artifacts/npm/devextreme/package.json');

    sourcePkg.name = 'devextreme';
    sourcePkg.bin = {
        'devextreme-bundler-init': 'bin/bundler-init.js',
        'devextreme-bundler': 'bin/bundler.js'
    };

    delete sourcePkg.devDependencies;
    delete sourcePkg.scripts.preinstall;

    fs.writeFileSync(packagePath, Buffer.from(JSON.stringify(sourcePkg, null, 2)));
};

generateProdPackageFile(pkg);
