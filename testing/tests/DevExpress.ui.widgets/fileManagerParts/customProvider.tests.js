import { FileManagerItem } from 'ui/file_manager/file_provider/file_provider';
import CustomFileProvider from 'ui/file_manager/file_provider/custom';
import { createSampleFileItems } from '../../../helpers/fileManagerHelpers.js';

const { test } = QUnit;

const { filesPathInfo, itemData, fileManagerItems } = createSampleFileItems();

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
            abortFileUpload: sinon.spy((fileData, chunksInfo, destinationDir) => 'aborted'),
            uploadChunkSize: 1000
        };

        this.provider = new CustomFileProvider(this.options);
    }

};

QUnit.module('Custom file provider', moduleConfig, () => {

    test('get directory file items', function(assert) {
        const done = assert.async();

        this.provider.getItems(filesPathInfo)
            .done(items => {
                assert.deepEqual(items, fileManagerItems, 'items acquired');
                assert.strictEqual(this.options.getItems.callCount, 1, 'getItems called once');
                assert.deepEqual(this.options.getItems.args[0][0], filesPathInfo, 'getItems arguments are valid');
                done();
            });
    });

    test('rename item', function(assert) {
        const item = new FileManagerItem(filesPathInfo, 'Documents');
        const result = this.provider.renameItem(item, 'Test 1');

        assert.strictEqual(result, 'renamed', 'result acquired');
        assert.strictEqual(this.options.renameItem.callCount, 1, 'renameItem called once');
        assert.deepEqual(this.options.renameItem.args[0][0], item, 'renameItem arguments are valid');
        assert.deepEqual(this.options.renameItem.args[0][1], 'Test 1', 'renameItem arguments are valid');
    });

    test('create directory', function(assert) {
        const parentDir = new FileManagerItem(filesPathInfo, 'Documents');
        const result = this.provider.createFolder(parentDir, 'Test 1');

        assert.strictEqual(result, 'created', 'result acquired');
        assert.strictEqual(this.options.createDirectory.callCount, 1, 'createDirectory called once');
        assert.deepEqual(this.options.createDirectory.args[0][0], parentDir, 'createDirectory arguments are valid');
        assert.deepEqual(this.options.createDirectory.args[0][1], 'Test 1', 'createDirectory arguments are valid');
    });

    test('delete items', function(assert) {
        const items = [
            new FileManagerItem(filesPathInfo, 'Documents'),
            new FileManagerItem(filesPathInfo, 'Article.txt')
        ];
        const result = this.provider.deleteItems(items);

        assert.deepEqual(result, [ 'deleted Documents', 'deleted Article.txt' ], 'result acquired');
        assert.strictEqual(this.options.deleteItem.callCount, 2, 'deleteItem called one time for each item');
        assert.deepEqual(this.options.deleteItem.args[0][0], items[0], 'deleteItem arguments are valid');
        assert.deepEqual(this.options.deleteItem.args[1][0], items[1], 'deleteItem arguments are valid');
    });

    test('move items', function(assert) {
        const items = [
            new FileManagerItem(filesPathInfo, 'Documents'),
            new FileManagerItem(filesPathInfo, 'Article.txt')
        ];
        const destinationDir = new FileManagerItem(filesPathInfo, 'Music');
        const result = this.provider.moveItems(items, destinationDir);

        assert.deepEqual(result, [ 'moved Documents', 'moved Article.txt' ], 'result acquired');
        assert.strictEqual(this.options.moveItem.callCount, 2, 'moveItem called one time for each item');
        assert.deepEqual(this.options.moveItem.args[0][0], items[0], 'moveItem arguments are valid');
        assert.deepEqual(this.options.moveItem.args[0][1], destinationDir, 'moveItem arguments are valid');
        assert.deepEqual(this.options.moveItem.args[1][0], items[1], 'moveItem arguments are valid');
        assert.deepEqual(this.options.moveItem.args[1][1], destinationDir, 'moveItem arguments are valid');
    });

    test('copy items', function(assert) {
        const items = [
            new FileManagerItem(filesPathInfo, 'Documents'),
            new FileManagerItem(filesPathInfo, 'Article.txt')
        ];
        const destinationDir = new FileManagerItem(filesPathInfo, 'Music');
        const result = this.provider.copyItems(items, destinationDir);

        assert.deepEqual(result, [ 'copied Documents', 'copied Article.txt' ], 'result acquired');
        assert.strictEqual(this.options.copyItem.callCount, 2, 'copyItem called one time for each item');
        assert.deepEqual(this.options.copyItem.args[0][0], items[0], 'copyItem arguments are valid');
        assert.deepEqual(this.options.copyItem.args[0][1], destinationDir, 'copyItem arguments are valid');
        assert.deepEqual(this.options.copyItem.args[1][0], items[1], 'copyItem arguments are valid');
        assert.deepEqual(this.options.copyItem.args[1][1], destinationDir, 'copyItem arguments are valid');
    });

    test('upload file chunk', function(assert) {
        const fileData = { name: 'Test1.txt' };
        const chunksInfo = { chunkIndex: 1 };
        const destinationDir = new FileManagerItem(filesPathInfo, 'Documents');
        const result = this.provider.uploadFileChunk(fileData, chunksInfo, destinationDir);

        assert.deepEqual(result, 'uploaded', 'result acquired');
        assert.strictEqual(this.options.uploadFileChunk.callCount, 1, 'uploadFileChunk called once');
        assert.deepEqual(this.options.uploadFileChunk.args[0][0], fileData, 'uploadFileChunk arguments are valid');
        assert.deepEqual(this.options.uploadFileChunk.args[0][1], chunksInfo, 'uploadFileChunk arguments are valid');
        assert.deepEqual(this.options.uploadFileChunk.args[0][2], destinationDir, 'uploadFileChunk arguments are valid');
    });

    test('abort file upload', function(assert) {
        const fileData = { name: 'Test1.txt' };
        const chunksInfo = { chunkIndex: 1 };
        const destinationDir = new FileManagerItem(filesPathInfo, 'Documents');
        const result = this.provider.abortFileUpload(fileData, chunksInfo, destinationDir);

        assert.deepEqual(result, 'aborted', 'result acquired');
        assert.strictEqual(this.options.abortFileUpload.callCount, 1, 'abortFileUpload called once');
        assert.deepEqual(this.options.abortFileUpload.args[0][0], fileData, 'abortFileUpload arguments are valid');
        assert.deepEqual(this.options.abortFileUpload.args[0][1], chunksInfo, 'abortFileUpload arguments are valid');
        assert.deepEqual(this.options.abortFileUpload.args[0][2], destinationDir, 'abortFileUpload arguments are valid');
    });

    test('upload chunk size', function(assert) {
        let size = this.provider.getFileUploadChunkSize();
        assert.strictEqual(size, this.options.uploadChunkSize, 'result acquired');

        const provider = new CustomFileProvider();
        size = provider.getFileUploadChunkSize();
        assert.ok(size > 100000, 'default value used');
    });

});
