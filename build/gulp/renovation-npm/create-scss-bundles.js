const { mkdirSync, existsSync } = require('fs');
const { join, resolve } = require('path');
const { generateScssBundleName, generateScssBundles } = require('../styles/style-compiler');

function createScssBundles(context) {
    return function createScssBundles(done) {
        const scssFolder = resolve(process.cwd(), join(context.destination, 'scss'));
        const getBundleContent = (theme, size, color, mode) =>
            `@use '${context.scssBundlesSource}/${generateScssBundleName(theme, size, color, mode)}';`;

        if(!existsSync(scssFolder)) mkdirSync(scssFolder);
        generateScssBundles(scssFolder, getBundleContent);
        done();
    };
}

module.exports = createScssBundles;
