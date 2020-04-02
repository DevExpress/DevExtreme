import { when } from 'core/utils/deferred';
import FileSystemItem from 'file_management/file_system_item';
import CustomFileSystemProvider from 'file_management/custom_provider';
import { createSampleFileItems } from '../../../helpers/fileManagerHelpers.js';

const { test } = QUnit;

const { filesPathInfo, itemData, fileSystemItems } = createSampleFileItems();

const moduleConfig = {

    beforeEach: function() {
        this.options = {
            getItems: sinon.spy(pathInfo => itemData),
            renameItem: sinon.spy((item, name) => 'renamed'),
            createDirectory: sinon.spy((parentDir, name) => 'created'),
            deleteItem: sinon.spy(item => `deleted ${item.name}`),
            moveItem: sinon.spy((item, destinationDir) => `moved ${item.name}`),
            copyItem: sinon.spy((item, destinationDir) => `copied ${item.name}`),
            uploadFileChunk: sinon.spy((fileData, chunksInfo, destinationDir) => 'uploaded'),
            abortFileUpload: sinon.spy((fileData, chunksInfo, destinationDir) => 'aborted')
        };

        this.provider = new CustomFileSystemProvider(this.options);
    }

};

QUnit.module('Custom file provider', moduleConfig, () => {

    test('get directory file items', function(assert) {
        const done = assert.async();

        const filesDir = new FileSystemItem('Root/Files', true);

        this.provider.getItems(filesDir)
            .done(items => {
                assert.deepEqual(items, fileSystemItems, 'items acquired');
                assert.strictEqual(this.options.getItems.callCount, 1, 'getItems called once');
                assert.deepEqual(this.options.getItems.args[0][0], filesDir, 'getItems arguments are valid');
                done();
            });
    });

    test('rename item', function(assert) {
        const done = assert.async();

        const item = new FileSystemItem(filesPathInfo, 'Documents');

        this.provider.renameItem(item, 'Test 1')
            .done(result => {
                done();

                assert.strictEqual(result, undefined, 'resolved with no result');
                assert.strictEqual(this.options.renameItem.callCount, 1, 'renameItem called once');
                assert.deepEqual(this.options.renameItem.args[0][0], item, 'renameItem arguments are valid');
                assert.deepEqual(this.options.renameItem.args[0][1], 'Test 1', 'renameItem arguments are valid');
            });
    });

    test('create directory', function(assert) {
        const done = assert.async();

        const parentDir = new FileSystemItem(filesPathInfo, 'Documents');
        this.provider.createDirectory(parentDir, 'Test 1')
            .done(result => {
                done();

                assert.strictEqual(result, undefined, 'resolved with no result');
                assert.strictEqual(this.options.createDirectory.callCount, 1, 'createDirectory called once');
                assert.deepEqual(this.options.createDirectory.args[0][0], parentDir, 'createDirectory arguments are valid');
                assert.deepEqual(this.options.createDirectory.args[0][1], 'Test 1', 'createDirectory arguments are valid');
            });
    });

    test('delete items', function(assert) {
        const done = assert.async();

        const items = [
            new FileSystemItem(filesPathInfo, 'Documents'),
            new FileSystemItem(filesPathInfo, 'Article.txt')
        ];

        const deferreds = this.provider.deleteItems(items);
        assert.strictEqual(deferreds.length, 2, 'result contains deferrred for each item');

        when.apply(null, deferreds)
            .done((res1, res2) => {
                done();

                assert.strictEqual(res1, undefined, 'resolved with no result');
                assert.strictEqual(res2, undefined, 'resolved with no result');
                assert.strictEqual(this.options.deleteItem.callCount, 2, 'deleteItem called one time for each item');
                assert.deepEqual(this.options.deleteItem.args[0][0], items[0], 'deleteItem arguments are valid');
                assert.deepEqual(this.options.deleteItem.args[1][0], items[1], 'deleteItem arguments are valid');
            });
    });

    test('move items', function(assert) {
        const done = assert.async();

        const items = [
            new FileSystemItem(filesPathInfo, 'Documents'),
            new FileSystemItem(filesPathInfo, 'Article.txt')
        ];
        const destinationDir = new FileSystemItem(filesPathInfo, 'Music');

        const deferreds = this.provider.moveItems(items, destinationDir);
        assert.strictEqual(deferreds.length, 2, 'result contains deferrred for each item');

        when.apply(null, deferreds)
            .done((res1, res2) => {
                done();

                assert.strictEqual(res1, undefined, 'resolved with no result');
                assert.strictEqual(res2, undefined, 'resolved with no result');
                assert.strictEqual(this.options.moveItem.callCount, 2, 'moveItem called one time for each item');
                assert.deepEqual(this.options.moveItem.args[0][0], items[0], 'moveItem arguments are valid');
                assert.deepEqual(this.options.moveItem.args[0][1], destinationDir, 'moveItem arguments are valid');
                assert.deepEqual(this.options.moveItem.args[1][0], items[1], 'moveItem arguments are valid');
                assert.deepEqual(this.options.moveItem.args[1][1], destinationDir, 'moveItem arguments are valid');
            });
    });

    test('copy items', function(assert) {
        const done = assert.async();

        const items = [
            new FileSystemItem(filesPathInfo, 'Documents'),
            new FileSystemItem(filesPathInfo, 'Article.txt')
        ];
        const destinationDir = new FileSystemItem(filesPathInfo, 'Music');

        const deferreds = this.provider.copyItems(items, destinationDir);
        assert.strictEqual(deferreds.length, 2, 'result contains deferrred for each item');

        when.apply(null, deferreds)
            .done((res1, res2) => {
                done();

                assert.strictEqual(res1, undefined, 'resolved with no result');
                assert.strictEqual(res2, undefined, 'resolved with no result');
                assert.strictEqual(this.options.copyItem.callCount, 2, 'copyItem called one time for each item');
                assert.deepEqual(this.options.copyItem.args[0][0], items[0], 'copyItem arguments are valid');
                assert.deepEqual(this.options.copyItem.args[0][1], destinationDir, 'copyItem arguments are valid');
                assert.deepEqual(this.options.copyItem.args[1][0], items[1], 'copyItem arguments are valid');
                assert.deepEqual(this.options.copyItem.args[1][1], destinationDir, 'copyItem arguments are valid');
            });
    });

    test('upload file chunk', function(assert) {
        const done = assert.async();

        const fileData = { name: 'Test1.txt' };
        const chunksInfo = { chunkIndex: 1 };
        const destinationDir = new FileSystemItem(filesPathInfo, 'Documents');

        this.provider.uploadFileChunk(fileData, chunksInfo, destinationDir)
            .done(result => {
                done();

                assert.strictEqual(result, undefined, 'resolved with no result');
                assert.strictEqual(this.options.uploadFileChunk.callCount, 1, 'uploadFileChunk called once');
                assert.deepEqual(this.options.uploadFileChunk.args[0][0], fileData, 'uploadFileChunk arguments are valid');
                assert.deepEqual(this.options.uploadFileChunk.args[0][1], chunksInfo, 'uploadFileChunk arguments are valid');
                assert.deepEqual(this.options.uploadFileChunk.args[0][2], destinationDir, 'uploadFileChunk arguments are valid');
            });
    });

    test('abort file upload', function(assert) {
        const done = assert.async();

        const fileData = { name: 'Test1.txt' };
        const chunksInfo = { chunkIndex: 1 };
        const destinationDir = new FileSystemItem(filesPathInfo, 'Documents');

        this.provider.abortFileUpload(fileData, chunksInfo, destinationDir)
            .done(result => {
                done();

                assert.strictEqual(result, undefined, 'resolved with no result');
                assert.strictEqual(this.options.abortFileUpload.callCount, 1, 'abortFileUpload called once');
                assert.deepEqual(this.options.abortFileUpload.args[0][0], fileData, 'abortFileUpload arguments are valid');
                assert.deepEqual(this.options.abortFileUpload.args[0][1], chunksInfo, 'abortFileUpload arguments are valid');
                assert.deepEqual(this.options.abortFileUpload.args[0][2], destinationDir, 'abortFileUpload arguments are valid');
            });
    });

    test('native promise can be used as the funciton result', function(assert) {
        const done = assert.async();

        this.options.getItems = sinon.spy(dir => new Promise(resolve => resolve(itemData)));
        this.provider = new CustomFileSystemProvider(this.options);

        const filesDir = new FileSystemItem('Root/Files', true);

        this.provider.getItems(filesDir)
            .done(items => {
                assert.deepEqual(items, fileSystemItems, 'items acquired');
                assert.strictEqual(this.options.getItems.callCount, 1, 'getItems called once');
                assert.deepEqual(this.options.getItems.args[0][0], filesDir, 'getItems arguments are valid');
                done();
            });
    });

});
