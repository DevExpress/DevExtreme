const mock = require('mock-require');
const assert = require('chai').assert;
const MetadataLoader = require('../modules/metadata-loader');
const MetadataRepository = require('../modules/metadata-repository');
const themes = require('./test-themes');
const metadata = require('./test-metadata');

const expectedLightMetadata = [{
    'Name': '1. Font family',
    'Key': '@base-font-family',
    'Group': 'base.typography'
}, {
    'Name': '50. Background color',
    'Key': '@base-bg',
    'Group': 'base.common'
}];

const expectedLightMetadataAfterUpdate = [{
    'Name': '1. Font family',
    'Key': '@base-font-family',
    'Group': 'base.typography'
}, {
    'Name': '50. Background color',
    'Key': '@base-bg',
    'Group': 'base.common',
    'Value': '#fff'
}];

describe('MetadataRepository', () => {
    beforeEach(() => {
        mock('../data/metadata/dx-theme-builder-metadata', metadata);
    });
    it('Init', () => {
        const metadataRepository = new MetadataRepository(new MetadataLoader());
        return metadataRepository.init(themes).then(() => {
            let genericLightMetadata = metadataRepository.getData({
                name: 'generic',
                colorScheme: 'light'
            });

            assert.deepEqual(genericLightMetadata, expectedLightMetadata, 'right metadata for theme');

            metadataRepository.updateData([
                { key: '@base-bg', value: '#fff' }
            ], {
                name: 'generic',
                colorScheme: 'light'
            });

            genericLightMetadata = metadataRepository.getData({
                name: 'generic',
                colorScheme: 'light'
            });

            assert.deepEqual(genericLightMetadata, expectedLightMetadataAfterUpdate, 'right metadata for theme after update');
        });
    });

    it('Version', () => {
        const metadataRepository = new MetadataRepository(new MetadataLoader());
        assert.equal(metadataRepository.getVersion(), '18.2.0');
    });

});
