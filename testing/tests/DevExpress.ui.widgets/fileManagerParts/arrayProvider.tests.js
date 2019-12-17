const { test } = QUnit;

import 'ui/file_manager';
import ArrayFileProvider from 'ui/file_manager/file_provider/array';
import { FileManagerRootItem } from 'ui/file_manager/file_provider/file_provider';
import { ErrorCode } from 'ui/file_manager/ui.file_manager.common';
import { fileSaver } from 'exporter/file_saver';

import { createUploaderFiles, createUploadInfo } from '../../../helpers/fileManagerHelpers.js';

const moduleConfig = {

    beforeEach: function() {
        this.options = {
            data: [
                {
                    name: 'F1',
                    isDirectory: true,
                    items: [
                        {
                            name: 'F1.1',
                            isDirectory: true
                        },
                        {
                            name: 'F1.2',
                            isDirectory: true,
                            items: [
                                {
                                    name: 'File1.2.txt'
                                }
                            ]
                        },
                        {
                            name: 'F1.3',
                            isDirectory: true,
                            items: [
                                {
                                    name: 'F1.3.1',
                                    isDirectory: true
                                }
                            ]
                        }
                    ]
                },
                {
                    name: 'F2',
                    isDirectory: true
                }
            ]
        };

        this.provider = new ArrayFileProvider(this.options);

        sinon.stub(fileSaver, 'saveAs', (fileName, format, data) => {
            if(fileSaver._onTestSaveAs) {
                fileSaver._onTestSaveAs(fileName, format, data);
            }
        });
    },

    afterEach: function() {
        fileSaver.saveAs.restore();
        fileSaver._onTestSaveAs = null;
    }

};

QUnit.module('Array File Provider', moduleConfig, () => {

    test('get directory file items', function(assert) {
        let items = this.provider.getItems();
        assert.equal(items.length, 2);
        assert.equal(items[0].name, 'F1');
        assert.ok(items[0].hasSubDirs);
        assert.equal(items[1].name, 'F2');
        assert.notOk(items[1].hasSubDirs);

        let pathInfo = [ { key: 'F1', name: 'F1' } ];
        items = this.provider.getItems(pathInfo);
        assert.equal(items.length, 3);
        assert.equal(items[0].name, 'F1.1');
        assert.notOk(items[0].hasSubDirs);
        assert.equal(items[1].name, 'F1.2');
        assert.notOk(items[1].hasSubDirs);
        assert.equal(items[2].name, 'F1.3');
        assert.ok(items[2].hasSubDirs);

        pathInfo = [
            { key: 'F1', name: 'F1' },
            { key: 'F1/F1.2', name: 'F1.2' }
        ];
        items = this.provider.getItems(pathInfo);
        assert.equal(items.length, 1);
        assert.equal(items[0].name, 'File1.2.txt');
    });

    test('getItems method generates ids for items with duplicate names', function(assert) {
        const data = [
            { name: 'F1', isDirectory: true },
            { name: 'file_1.txt' },
            { name: 'file_2.jpg' },
            { name: 'file_1.txt' }
        ];
        const testResult = [false, false, true, false, false, true];

        this.options.data.push(...data);
        const items = this.provider.getItems();
        assert.strictEqual(items.length, testResult.length, 'item count is correct');

        testResult.forEach((generated, index) => {
            const item = items[index];
            const obj = this.options.data[index];

            assert.strictEqual(item.name, obj.name, 'item name valid');

            if(generated) {
                assert.notStrictEqual(item.key, obj.name, 'item has non default key');
                assert.ok(obj.__KEY__, 'data object key is generated');
                assert.ok(obj.__KEY__.length > 10, 'generated key string is big');
            } else {
                assert.strictEqual(item.key, obj.name, 'item has default key');
                assert.notOk(obj.__KEY__, 'data object key not specified');
            }
        });
    });

    test('move directory', function(assert) {
        const pathInfo = [ { key: 'F2', name: 'F2' } ];

        let items = this.provider.getItems();
        const subItemsCount = this.provider.getItems(pathInfo).length;
        this.provider.moveItems([ items[0] ], items[1]);

        items = this.provider.getItems();
        const newSubItemsCount = this.provider.getItems(pathInfo).length;
        assert.equal(items.length, 1);
        assert.ok(items[0].hasSubDirs);
        assert.strictEqual(newSubItemsCount, subItemsCount + 1, 'sub item count has increased');
    });

    test('copy directory', function(assert) {
        const pathInfo = [ { key: 'F2', name: 'F2' } ];

        let items = this.provider.getItems();
        const subItemsCount = this.provider.getItems(pathInfo).length;
        this.provider.copyItems([ items[0] ], items[1]);

        items = this.provider.getItems();
        assert.equal(items.length, 2, 'source dir preserved');
        assert.ok(items[0].hasSubDirs, 'source dir items preserved');

        const newSubItemsCount = this.provider.getItems(pathInfo).length;
        assert.strictEqual(newSubItemsCount, subItemsCount + 1, 'sub item count has increased');
    });

    test('copy directory to root directory does not change root\'s hasSubDir property', function(assert) {
        const root = new FileManagerRootItem();
        const pathInfo = [ { key: 'F1', name: 'F1' } ];

        assert.strictEqual(root.hasSubDirs, undefined, 'root hasSubDirs property is undefined');

        const itemCount = this.provider.getItems().length;
        const items = this.provider.getItems(pathInfo);

        this.provider.copyItems([ items[1] ], root);
        const newItemCount = this.provider.getItems().length;

        assert.strictEqual(root.hasSubDirs, undefined, 'root hasSubDirs property is undefined');
        assert.strictEqual(newItemCount, itemCount + 1, 'sub item count has increased');
    });

    test('throw error when try moving folder with incorrect parameters', function(assert) {
        let errorCount = 0;
        let lastErrorId = -1;
        const items = this.provider.getItems();

        try {
            this.provider.moveItems([ items[0] ], items[0]);
        } catch(e) {
            errorCount++;
            lastErrorId = e.errorId;
        }
        assert.equal(items[0].name, 'F1');
        assert.equal(errorCount, 1);
        assert.equal(lastErrorId, ErrorCode.Other);

        const pathInfo = [ { key: 'F1', name: 'F1' } ];
        const subFolders = this.provider.getItems(pathInfo);
        try {
            this.provider.moveItems([ subFolders[0] ], subFolders[0]);
        } catch(e) {
            errorCount++;
            lastErrorId = e.errorId;
        }
        assert.equal(subFolders[0].name, 'F1.1');
        assert.equal(errorCount, 2);
        assert.equal(lastErrorId, ErrorCode.Other);
    });

    test('throw error when try moving directory into it\'s subdirectory', function(assert) {
        this.options.data[0].__KEY__ = 1;
        this.options.data[0].items[0].__KEY__ = 100;
        this.options.data.push({
            __KEY__: 3,
            name: 'F1',
            isDirectory: true
        });

        let errorCount = 0;
        let lastErrorId = -1;
        const items = this.provider.getItems();

        const pathInfo = [ { key: 1, name: 'F1' } ];
        const subFolders = this.provider.getItems(pathInfo);

        assert.equal(items[0].name, 'F1', 'folder name is correct');
        assert.equal(subFolders[0].name, 'F1.1', 'subfolder name is correct');

        try {
            this.provider.moveItems([ items[0] ], subFolders[0]);
        } catch(e) {
            errorCount++;
            lastErrorId = e.errorId;
        }

        assert.equal(errorCount, 1, 'error is raised');
        assert.equal(lastErrorId, ErrorCode.Other, 'error code is correct');

        errorCount = 0;
        try {
            this.provider.moveItems([ items[2] ], subFolders[0]);
        } catch(e) {
            errorCount++;
        }

        assert.equal(errorCount, 0, 'error is not raised');
    });

    test('throw error when try copying folder with incorrect parameters', function(assert) {
        let errorCount = 0;
        let lastErrorId = -1;
        const folders = this.provider.getItems();

        try {
            this.provider.copyItems([ folders[0] ], folders[0]);
        } catch(e) {
            errorCount++;
            lastErrorId = e.errorId;
        }
        assert.equal(folders[0].name, 'F1');
        assert.equal(errorCount, 1);
        assert.equal(lastErrorId, ErrorCode.Other);

        const pathInfo = [ { key: 'F1', name: 'F1' } ];
        const subFolders = this.provider.getItems(pathInfo);
        try {
            this.provider.copyItems([ subFolders[0] ], subFolders[0]);
        } catch(e) {
            errorCount++;
            lastErrorId = e.errorId;
        }
        assert.equal(subFolders[0].name, 'F1.1');
        assert.equal(errorCount, 2);
        assert.equal(lastErrorId, ErrorCode.Other);
    });

    test('create new folder with existing name', function(assert) {
        this.provider.createFolder(new FileManagerRootItem(), 'F1');

        const dirs = this.provider.getItems();
        assert.equal(dirs[0].name, 'F1');
        assert.equal(dirs[0].key, 'F1');
        assert.equal(dirs[1].name, 'F2');
        assert.equal(dirs[1].key, 'F2');
        assert.equal(dirs[2].name, 'F1');
        assert.notEqual(dirs[2].key, 'F1');
        assert.ok(dirs[2].key.length > 1);
    });

    test('throw error on creating new directory in unexisting directory', function(assert) {
        let errorCount = 0;
        let errorId = 0;

        const f1Dir = this.provider.getItems()[0];
        this.options.data.splice(0, this.options.data.length);

        try {
            this.provider.createFolder(f1Dir, 'NewDir');
        } catch(e) {
            errorCount++;
            errorId = e.errorId;
        }
        assert.equal(errorCount, 1);
        assert.equal(errorId, ErrorCode.DirectoryNotFound);
    });

    test('rename file item with existing name', function(assert) {
        const fileItems = this.provider.getItems();
        this.provider.renameItem(fileItems[0], 'F2');

        assert.equal(fileItems[0].name, 'F2');
        assert.notEqual(fileItems[0].key, fileItems[1].key);

        assert.equal(fileItems[1].name, 'F2');
        assert.equal(fileItems[1].key, 'F2');
    });

    test('delete directory', function(assert) {
        let fileItems = this.provider.getItems();
        assert.equal(fileItems[0].name, 'F1');
        assert.equal(fileItems[1].name, 'F2');
        assert.equal(fileItems.length, 2);

        this.provider.deleteItems([ fileItems[0] ]);
        fileItems = this.provider.getItems();
        assert.equal(fileItems[0].name, 'F2');
        assert.equal(fileItems.length, 1);
    });

    test('throw exception if remove unexisting directory', function(assert) {
        let errorCount = 0;
        let errorId = 0;

        const f1Dir = this.provider.getItems()[0];
        this.options.data.splice(0, this.options.data.length);

        try {
            this.provider.deleteItems([ f1Dir ]);
        } catch(e) {
            errorCount++;
            errorId = e.errorId;
        }
        assert.equal(errorCount, 1);
        assert.equal(errorId, ErrorCode.DirectoryNotFound);
    });

    test('upload file', function(assert) {
        const done1 = assert.async();
        const done2 = assert.async();

        const dir = new FileManagerRootItem();
        const initialCount = this.provider.getItems().length;

        const file = createUploaderFiles(1)[0];
        let uploadInfo = createUploadInfo(file);

        this.provider.uploadFileChunk(file, uploadInfo, dir)
            .then(() => {
                done1();

                uploadInfo = createUploadInfo(file, 1, uploadInfo.customData);
                return this.provider.uploadFileChunk(file, uploadInfo, dir);
            })
            .then(() => {
                done2();

                const items = this.provider.getItems();
                const uploadedFile = items.filter(item => item.name === file.name && !item.isDirectory)[0];

                assert.strictEqual(items.length, initialCount + 1, 'item count increased');
                assert.ok(uploadedFile, 'file uploaded');
                assert.strictEqual(window.atob(uploadedFile.dataItem.content), file._dxContent, 'uploaded file has correct content');
            });
    });

    test('download single file', function(assert) {
        const content = 'Test content 1';
        const done = assert.async();

        fileSaver._onTestSaveAs = (fileName, format, data) => {
            done();
            assert.strictEqual(fileName, file.name, 'file name is correct');
            assert.strictEqual(data.size, content.length, 'file size is correct');
        };

        const pathInfo = [
            { key: 'F1', name: 'F1' },
            { key: 'F1/F1.2', name: 'F1.2' }
        ];
        const file = this.provider.getItems(pathInfo)[0];

        file.dataItem.content = window.btoa(content);

        this.provider.downloadItems([ file ]);
    });

    test('download multiple files', function(assert) {
        const done = assert.async();

        fileSaver._onTestSaveAs = (fileName, format, data) => {
            done();
            assert.strictEqual(fileName, 'files.zip', 'file name is correct');
            assert.strictEqual(data.size, 254, 'file size is correct');
        };

        this.options.data[0].items[1].items.push({
            name: 'File1.2.2.txt',
            content: window.btoa('Test content 2')
        });

        const pathInfo = [
            { key: 'F1', name: 'F1' },
            { key: 'F1/F1.2', name: 'F1.2' }
        ];
        const files = this.provider.getItems(pathInfo);

        files[0].dataItem.content = window.btoa('Test content 1');

        this.provider.downloadItems(files);
    });

});
