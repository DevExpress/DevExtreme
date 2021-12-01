const { mkdirSync, existsSync } = require('fs');
const { join, resolve } = require('path');
const { generateScssBundleName, generateScssBundles } = require('../styles/style-compiler');

function createScssBundles(context) {
    return function createScssBundles(done) {
        const scssFolder = resolve(process.cwd(), join(context.destination, 'scss'));
        const bundlesFolder = join(scssFolder, 'bundles');
        const getBundleContent = (theme, size, color, mode) =>
            `@use '${context.scssBundlesSource}/${generateScssBundleName(theme, size, color, mode)}';`;

        if(!existsSync(scssFolder)) mkdirSync(scssFolder);
        if(!existsSync(bundlesFolder)) mkdirSync(bundlesFolder);
        generateScssBundles(bundlesFolder, getBundleContent);
        done();
    };
}

module.exports = createScssBundles;
