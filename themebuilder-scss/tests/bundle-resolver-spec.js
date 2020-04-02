const assert = require('chai').assert;
const getBundleName = require('../modules/bundle-resolver');

describe('Bundle resolver', () => {
    it('getBundleName - the right filename is generate', () => {

        const fileNamesForThemes = [
            { theme: 'generic', colorScheme: 'light', fileName: 'bundles/dx.light.scss' },
            { theme: 'generic', colorScheme: 'dark', fileName: 'bundles/dx.dark.scss' },
            { theme: 'generic', colorScheme: 'greenmist', fileName: 'bundles/dx.greenmist.scss' },
            { theme: 'generic', colorScheme: 'light-compact', fileName: 'bundles/dx.light.compact.scss' },
            { theme: 'material', colorScheme: 'blue-light', fileName: 'bundles/dx.material.blue.light.scss' },
            { theme: 'material', colorScheme: 'blue-light-compact', fileName: 'bundles/dx.material.blue.light.compact.scss' }
        ];

        fileNamesForThemes.forEach((themeData) => {
            assert.equal(getBundleName(themeData.theme, themeData.colorScheme), themeData.fileName);
        });
    });
});
