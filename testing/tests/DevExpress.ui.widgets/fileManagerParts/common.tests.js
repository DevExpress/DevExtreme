const { test } = QUnit;
import { getPathParts, getEscapedFileName } from 'file_management/utils';
import FileSystemItem from 'file_management/file_system_item';

QUnit.module('Common tests', () => {
    test('getPathParts() function must correctly separate path string', function(assert) {
        const testData = {
            'Files/Documents': ['Files', 'Documents'],
            'Files/Documents/ ': ['Files', 'Documents', ' '],
            'Files/ /Documents': ['Files', ' ', 'Documents'],
            'Files/// /Documents': ['Files/', ' ', 'Documents'],
            'Files///Documents': ['Files/', 'Documents'],
            '': [],
            '/': [],
            '//': ['/'],
            '///': ['/'],
            '////': ['//'],
            '/////': ['//'],
            '/// /Documents': ['/', ' ', 'Documents'],
            'Test/': ['Test'],
            'Test//': ['Test/'],
            '/Test': ['Test'],
            '//Test': ['/Test']
        };
        for(const key in testData) {
            assert.deepEqual(getPathParts(key), testData[key]);
        }
    });

    test('getEscapedFileName() function must correctly escape slashes in name string', function(assert) {
        const testData = {
            '': '',
            '/': '//',
            '//': '////',
            '///': '//////',
            'Docu/ments': 'Docu//ments',
            'Documents': 'Documents',
            'Test/': 'Test//',
            'Test//': 'Test////',
            '/Test': '//Test',
            '//Test': '////Test'
        };
        for(const key in testData) {
            assert.strictEqual(getEscapedFileName(key), testData[key]);
        }
    });

    test('FileSystemItem default key contains encoded path', function(assert) {
        const pathInfo = [
            { key: 'F1', name: 'F1' }
        ];
        const item = new FileSystemItem(pathInfo, 'Docu/ments', true);
        assert.strictEqual(item.key, 'F1/Docu//ments', 'key is in encoded format');
    });

    test('create FileSystemItem by public constructor', function(assert) {
        const testData = {
            '1': {
                path: 'folder1',
                isDir: true,
                name: 'folder1',
                key: 'folder1',
                pathInfo: []
            },
            '2': {
                path: 'folder1/file1',
                isDir: false,
                pathKeys: [ '7', '11' ],
                name: 'file1',
                key: '11',
                pathInfo: [ { key: '7', name: 'folder1' }]
            }
        };

        for(const key in testData) {
            const testCase = testData[key];

            const item = new FileSystemItem(testCase.path, testCase.isDir, testCase.pathKeys);

            assert.strictEqual(item.name, testCase.name, `${key}: name correct`);
            assert.strictEqual(item.key, testCase.key, `${key}: key correct`);
            assert.strictEqual(item.isDirectory, testCase.isDir, `${key}: isDirectory correct`);
            assert.strictEqual(item.relativeName, testCase.path, `${key}: relativeName correct`);
            assert.deepEqual(item.pathInfo, testCase.pathInfo, `${key}: pathInfo correct`);
        }
    });

});
