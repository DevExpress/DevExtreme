const mock = require('mock-require');
const assert = require('chai').assert;
const MetadataLoader = require('../modules/metadata-loader');
const metadata = require('./test-migration-metadata');

const migrationData = {
    generic: [
        '@datagrid-base-background-color',
        '@datagrid-border-color',
        '@treelist-base-background-color',
        '@treelist-border-color'
    ]
};

const expectedMetadata = [{
    'Name': '10. Font family',
    'Key': '@base-font-family',
    'Group': 'base.typography',
}, {
    'Name': '20. Label color',
    'Key': '@base-label-color',
    'Group': 'base.typography',
}, {
    'Key': '@datagrid-base-background-color'
}, {
    'Key': '@datagrid-border-color'
}, {
    'Key': '@treelist-base-background-color'
}, {
    'Key': '@treelist-border-color'
}];

describe('Migration metadataLoader', () => {
    beforeEach(() => {
        mock('../data/metadata/dx-theme-builder-metadata', metadata);
        mock('../data/migration-metadata/migration-metadata', migrationData);
    });

    it('Load metadata', () => {
        const metadataLoader = new MetadataLoader();
        return metadataLoader.load('generic', 'light').then(data => {
            assert.deepEqual(data, expectedMetadata, 'add missing constants works');
        });
    });
});

