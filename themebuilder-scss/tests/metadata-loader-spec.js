const mock = require('mock-require');
const assert = require('chai').assert;
const MetadataLoader = require('../modules/metadata-loader');
const metadata = require('./test-metadata');

const expectedDarkMetadata = [{
    'Name': '2. Font family',
    'Key': '@base-font-family',
    'Group': 'base.typography'
}, {
    'Name': '51. Background color',
    'Key': '@base-bg',
    'Group': 'base.common'
}];

describe('MetadataLoader', () => {
    beforeEach(() => {
        mock('../data/metadata/dx-theme-builder-metadata', metadata);
    });

    it('Load metadata', () => {
        const metadataLoader = new MetadataLoader();
        return metadataLoader.load('generic', 'dark').then(data => {
            assert.deepEqual(data, expectedDarkMetadata, 'load function works');
        });
    });

    it('Version', () => {
        const metadataLoader = new MetadataLoader();
        assert.equal(metadataLoader.version(), '18.2.0');
    });
});

