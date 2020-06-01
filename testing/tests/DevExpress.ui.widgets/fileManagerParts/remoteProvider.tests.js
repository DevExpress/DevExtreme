import 'ui/file_manager';
import FileSystemItem from 'file_management/file_system_item';

import RemoteFileSystemProvider from 'file_management/remote_provider';
import ajaxMock from '../../../helpers/ajaxMock.js';
import { createSampleFileItems, generateString, createFileObject } from '../../../helpers/fileManagerHelpers.js';
import { when } from 'core/utils/deferred';
import { isString } from 'core/utils/type';
import browser from 'core/utils/browser';

const { test } = QUnit;

const { filesPathInfo, itemData, fileSystemItems } = createSampleFileItems();

const moduleConfig = {

    beforeEach: function() {
        this.options = {
            endpointUrl: '/api/endpoint'
        };

        this.provider = new RemoteFileSystemProvider(this.options);
    },

    afterEach: function() {
        ajaxMock.clear();
    }

};

QUnit.module('Remote Provider', moduleConfig, () => {

    test('get directory file items', function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + '?command=GetDirContents&arguments=%7B%22pathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%5D%7D',
            responseText: {
                result: itemData,
                success: true
            },
            callback: request => assert.equal(request.method, 'GET')
        });

        const filesDir = new FileSystemItem('Root/Files', true);

        this.provider.getItems(filesDir)
            .done(folders => {
                assert.deepEqual(folders, fileSystemItems, 'folders received');
                done();
            });
    });

    test('create directory', function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + '?command=CreateDir&arguments=%7B%22pathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Documents%22%7D%5D%2C%22name%22%3A%22Test%201%22%7D',
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, 'POST')
        });

        const parentFolder = new FileSystemItem(filesPathInfo, 'Documents');
        this.provider.createDirectory(parentFolder, 'Test 1')
            .done(result => {
                assert.ok(result.success, 'folder created');
                done();
            });
    });

    test('rename item test', function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + '?command=Rename&arguments=%7B%22pathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Documents%22%7D%5D%2C%22isDirectory%22%3Afalse%2C%22name%22%3A%22Test%201%22%7D',
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, 'POST')
        });

        const item = new FileSystemItem(filesPathInfo, 'Documents');
        this.provider.renameItem(item, 'Test 1')
            .done(result => {
                assert.ok(result.success, 'item renamed');
                done();
            });
    });

    test('delete item test', function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + '?command=Remove&arguments=%7B%22pathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Documents%22%7D%5D%2C%22isDirectory%22%3Afalse%7D',
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, 'POST')
        });

        const item = new FileSystemItem(filesPathInfo, 'Documents');
        const deferreds = this.provider.deleteItems([ item ]);
        when.apply(null, deferreds)
            .done(result => {
                assert.ok(result.success, 'item deleted');
                done();
            });
    });

    test('move item test', function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + '?command=Move&arguments=%7B%22sourcePathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Documents%22%7D%5D%2C%22sourceIsDirectory%22%3Afalse%2C%22destinationPathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FImages%22%2C%22name%22%3A%22Images%22%7D%5D%7D',
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, 'POST')
        });

        const item = new FileSystemItem(filesPathInfo, 'Documents');
        const destinationFolder = new FileSystemItem(filesPathInfo, 'Images');
        const deferreds = this.provider.moveItems([ item ], destinationFolder);
        when.apply(null, deferreds)
            .done(result => {
                assert.ok(result.success, 'item moved');
                done();
            });
    });

    test('copy item test', function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + '?command=Copy&arguments=%7B%22sourcePathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Documents%22%7D%5D%2C%22sourceIsDirectory%22%3Afalse%2C%22destinationPathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FImages%22%2C%22name%22%3A%22Images%22%7D%5D%7D',
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, 'POST')
        });

        const item = new FileSystemItem(filesPathInfo, 'Documents');
        const destinationFolder = new FileSystemItem(filesPathInfo, 'Images');
        const deferreds = this.provider.copyItems([ item ], destinationFolder);
        when.apply(null, deferreds)
            .done(result => {
                assert.ok(result.success, 'item copied');
                done();
            });
    });

    test('upload file chunk', function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl,
            responseText: {
                success: true
            },
            callback: request => {
                assert.equal(request.method, 'POST');

                if(browser.msie) {
                    return;
                }

                const data = request.data;

                const args = JSON.parse(data.get('arguments'));

                const chunkMetadata = JSON.parse(args.chunkMetadata);
                const uploadId = chunkMetadata.UploadId;
                chunkMetadata.UploadId = '';

                const expectedChunkMetadata = {
                    UploadId: '',
                    FileName: 'New File 1.txt',
                    Index: 0,
                    TotalCount: 5,
                    FileSize: 100
                };

                const documentsPathInfo = [...filesPathInfo];
                documentsPathInfo.push({ key: 'Root/Files/Documents', name: 'Documents' });

                assert.ok(data instanceof FormData, 'data has type of FormData');
                assert.strictEqual(data.get('command'), 'UploadChunk', 'command type passed to the request');

                assert.deepEqual(args.destinationPathInfo, documentsPathInfo, 'directory pathInfo passed to the request');
                assert.deepEqual(chunkMetadata, expectedChunkMetadata, 'chunkMetadata passed to the request');

                assert.ok(isString(uploadId), 'uploadId has type of string');
                assert.ok(uploadId.length > 6, 'uploadId contains symbol sequence');
            }
        });

        const directory = new FileSystemItem(filesPathInfo, 'Documents');
        const fileData = createFileObject('New File 1.txt', generateString(100));
        const chunkBlob = new window.Blob([generateString(20)], { type: 'application/octet-stream' });
        const uploadInfo = {
            bytesUploaded: 0,
            chunkCount: 5,
            customData: { },
            chunkBlob,
            chunkIndex: 0
        };

        this.provider.uploadFileChunk(fileData, uploadInfo, directory)
            .done(() => done());
    });

    test('get items content test', function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl,
            responseText: new ArrayBuffer(5),
            callback: request => {
                assert.strictEqual(request.method, 'POST');
                assert.strictEqual(request.responseType, 'arraybuffer');
            }
        });

        const item = new FileSystemItem(filesPathInfo, 'Article.txt');
        this.provider.getItemsContent([ item ])
            .done(result => {
                assert.strictEqual(result.byteLength, 5, 'item content acquired');
                done();
            });
    });

    test('generation end point', function(assert) {
        let provider = new RemoteFileSystemProvider({
            endpointUrl: 'myEndpoint'
        });
        assert.notStrictEqual(provider._getEndpointUrl('myCommand', { }).indexOf('myEndpoint?command=myCommand'), -1);

        provider = new RemoteFileSystemProvider({
            endpointUrl: 'myEndpoint?param1=value'
        });
        assert.notStrictEqual(provider._getEndpointUrl('myCommand', { }).indexOf('myEndpoint?param1=value&command=myCommand'), -1);
    });

});
