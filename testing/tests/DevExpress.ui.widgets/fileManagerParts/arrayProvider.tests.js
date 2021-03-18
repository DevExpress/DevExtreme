const { test } = QUnit;

import 'ui/file_manager';
import ObjectFileSystemProvider from 'file_management/object_provider';
import FileSystemItem from 'file_management/file_system_item';
import ErrorCode from 'file_management/file_system_error_code';
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

        this.provider = new ObjectFileSystemProvider(this.options);

        this.rootItem = new FileSystemItem('', true);

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
        const done1 = assert.async();
        const done2 = assert.async();
        const done3 = assert.async();

        const dir1 = new FileSystemItem('F1', true);
        const dir2 = new FileSystemItem('F1/F1.2', true);

        this.provider.getItems(this.rootItem)
            .done(items => {
                done1();

                assert.equal(items.length, 2);
                assert.equal(items[0].name, 'F1');
                assert.ok(items[0].hasSubDirectories);
                assert.equal(items[1].name, 'F2');
                assert.notOk(items[1].hasSubDirectories);
            })
            .then(() => this.provider.getItems(dir1))
            .done(items => {
                done2();

                assert.equal(items.length, 3);
                assert.equal(items[0].name, 'F1.1');
                assert.notOk(items[0].hasSubDirectories);
                assert.equal(items[1].name, 'F1.2');
                assert.notOk(items[1].hasSubDirectories);
                assert.equal(items[2].name, 'F1.3');
                assert.ok(items[2].hasSubDirectories);
            })
            .then(() => this.provider.getItems(dir2))
            .done(items => {
                done3();

                assert.equal(items.length, 1);
                assert.equal(items[0].name, 'File1.2.txt');
            });
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

        const done = assert.async();

        this.provider.getItems(this.rootItem)
            .done(items => {
                done();
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
    });

    test('move directory', function(assert) {
        const dir = new FileSystemItem('F2', true);

        let items = null;
        let subItemsCount = -1;
        const done = assert.async(5);

        this.provider.getItems(this.rootItem)
            .then(result => {
                done();

                items = result;
                return this.provider.getItems(dir);
            })
            .then(subItems => {
                done();

                subItemsCount = subItems.length;

                const deferreds = this.provider.moveItems([ items[0] ], items[1]);
                assert.strictEqual(deferreds.length, 1, 'deferreds same count as the items');
                return deferreds[0];
            })
            .then(result => {
                done();

                assert.strictEqual(result, undefined, 'resolved with no result');

                return this.provider.getItems(this.rootItem);
            })
            .then(result => {
                done();

                items = result;
                return this.provider.getItems(dir);
            })
            .done(subItems => {
                done();

                assert.equal(items.length, 1);
                assert.ok(items[0].hasSubDirectories);
                assert.strictEqual(subItems.length, subItemsCount + 1, 'sub item count has increased');
            });
    });

    test('move directory via arguments without data items', function(assert) {
        const destDir = new FileSystemItem('F2', true);
        const destDirData = this.options.data[1];

        const dir = new FileSystemItem('F1', true);

        const srcItemCount = this.options.data.length;
        const destItemCount = destDirData.items && destDirData.items.length || 0;

        const done = assert.async(1);

        const deferreds = this.provider.moveItems([ dir ], destDir);
        deferreds[0].done(() => {
            done();

            assert.strictEqual(this.options.data.length, srcItemCount - 1, 'directory removed from source');
            assert.strictEqual(destDirData.items.length, destItemCount + 1, 'destination directory sub items increased');
        });
    });

    test('copy directory', function(assert) {
        const dir = new FileSystemItem('F2', true);

        let items = null;
        let subItemsCount = -1;
        const done = assert.async(5);

        this.provider.getItems(this.rootItem)
            .then(result => {
                done();

                items = result;
                return this.provider.getItems(dir);
            })
            .then(subItems => {
                done();

                subItemsCount = subItems.length;

                const deferreds = this.provider.copyItems([ items[0] ], items[1]);
                assert.strictEqual(deferreds.length, 1, 'deferreds same count as the items');
                return deferreds[0];
            })
            .then(result => {
                done();

                assert.strictEqual(result, undefined, 'resolved with no result');

                return this.provider.getItems(this.rootItem);
            })
            .then(result => {
                done();

                items = result;
                assert.equal(items.length, 2, 'source dir preserved');
                assert.ok(items[0].hasSubDirectories, 'source dir items preserved');

                return this.provider.getItems(dir);
            })
            .done(subItems => {
                done();

                assert.strictEqual(subItems.length, subItemsCount + 1, 'sub item count has increased');
            });
    });

    test('copy directory to root directory does not change root\'s hasSubDir property', function(assert) {
        const root = new FileSystemItem();
        const dir = new FileSystemItem('F1', true);

        assert.strictEqual(root.hasSubDirectories, undefined, 'root hasSubDirectories property is undefined');

        let items = null;
        let itemCount = -1;
        const done = assert.async(4);

        this.provider.getItems(this.rootItem)
            .then(result => {
                done();

                itemCount = result.length;
                return this.provider.getItems(dir);
            })
            .then(result => {
                done();

                items = result;

                const deferreds = this.provider.copyItems([ items[1] ], root);
                return deferreds[0];
            })
            .then(() => {
                done();

                return this.provider.getItems(this.rootItem);
            })
            .then(result => {
                done();

                assert.strictEqual(root.hasSubDirectories, undefined, 'root hasSubDirectories property is undefined');
                assert.strictEqual(result.length, itemCount + 1, 'sub item count has increased');
            });
    });

    test('copy directory via arguments without data items', function(assert) {
        const destDir = new FileSystemItem('F2', true);
        const destDirData = this.options.data[1];

        const dir = new FileSystemItem('F1', true);

        const srcItemCount = this.options.data.length;
        const destItemCount = destDirData.items && destDirData.items.length || 0;

        const done = assert.async(1);

        const deferreds = this.provider.copyItems([ dir ], destDir);
        deferreds[0].done(() => {
            done();

            assert.strictEqual(this.options.data.length, srcItemCount, 'source directory not changed');
            assert.strictEqual(destDirData.items.length, destItemCount + 1, 'destination directory sub items increased');
        });
    });

    test('throw error when try moving folder with incorrect parameters', function(assert) {
        let items = null;
        let subFolders = null;

        const done = assert.async(4);

        this.provider.getItems(this.rootItem)
            .then(result => {
                done();

                items = result;

                const deferreds = this.provider.moveItems([ items[0] ], items[0]);
                return deferreds[0];
            })
            .then(null, error => {
                done();

                assert.equal(items[0].name, 'F1');
                assert.equal(error.errorId, ErrorCode.Other);

                const dir = new FileSystemItem('F1', true);
                return this.provider.getItems(dir);
            })
            .then(result => {
                done();

                subFolders = result;

                const deferreds = this.provider.moveItems([ subFolders[0] ], subFolders[0]);
                return deferreds[0];
            })
            .then(null, error => {
                done();

                assert.equal(subFolders[0].name, 'F1.1');
                assert.equal(error.errorId, ErrorCode.Other);
            });
    });

    test('throw error when try moving directory into it\'s subdirectory', function(assert) {
        this.options.data[0].__KEY__ = 1;
        this.options.data[0].items[0].__KEY__ = 100;
        this.options.data.push({
            __KEY__: 3,
            name: 'F1',
            isDirectory: true
        });

        let items = null;
        let subFolders = null;

        const done = assert.async(4);

        this.provider.getItems(this.rootItem)
            .then(result => {
                done();

                items = result;

                const dir = new FileSystemItem('F1', true, [ 1 ]);
                return this.provider.getItems(dir);
            })
            .then(result => {
                done();

                subFolders = result;
                assert.equal(items[0].name, 'F1', 'folder name is correct');
                assert.equal(subFolders[0].name, 'F1.1', 'subfolder name is correct');

                const deferreds = this.provider.moveItems([ items[0] ], subFolders[0]);
                return deferreds[0];
            })
            .then(null, error => {
                done();

                assert.equal(error.errorId, ErrorCode.Other, 'error code is correct');

                const deferreds = this.provider.moveItems([ items[2] ], subFolders[0]);
                return deferreds[0];
            })
            .then(result => {
                done();

                assert.strictEqual(result, undefined, 'resolved with no result');
            });
    });

    test('throw error when try copying folder with incorrect parameters', function(assert) {
        let items = null;
        let subFolders = null;

        const done = assert.async(4);

        this.provider.getItems(this.rootItem)
            .then(result => {
                done();

                items = result;

                const deferreds = this.provider.copyItems([ items[0] ], items[0]);
                return deferreds[0];
            })
            .then(null, error => {
                done();

                assert.equal(items[0].name, 'F1');
                assert.equal(error.errorId, ErrorCode.Other);

                const dir = new FileSystemItem('F1', true);
                return this.provider.getItems(dir);
            })
            .then(result => {
                done();

                subFolders = result;

                const deferreds = this.provider.copyItems([ subFolders[0] ], subFolders[0]);
                return deferreds[0];
            })
            .then(null, error => {
                done();

                assert.equal(subFolders[0].name, 'F1.1');
                assert.equal(error.errorId, ErrorCode.Other);
            });
    });

    test('create new folder with existing name', function(assert) {
        const done = assert.async(2);

        const root = new FileSystemItem('', true);
        this.provider.createDirectory(root, 'F1')
            .then(result => {
                done();

                assert.strictEqual(result, undefined, 'resolved with no result');
                return this.provider.getItems(this.rootItem);
            })
            .then(dirs => {
                done();

                assert.equal(dirs[0].name, 'F1');
                assert.equal(dirs[0].key, 'F1');
                assert.equal(dirs[1].name, 'F2');
                assert.equal(dirs[1].key, 'F2');
                assert.equal(dirs[2].name, 'F1');
                assert.notEqual(dirs[2].key, 'F1');
                assert.ok(dirs[2].key.length > 1);
            });
    });

    test('create directory via arguments without data items', function(assert) {
        const dir = new FileSystemItem('F2', true);
        const dirData = this.options.data[1];

        const itemCount = dirData.items && dirData.items.length || 0;

        const done = assert.async(1);

        this.provider.createDirectory(dir, 'new F.2.2 test dir')
            .done(() => {
                done();

                assert.strictEqual(dirData.items.length, itemCount + 1, 'directory created');
            });
    });

    test('throw error on creating new directory in unexisting directory', function(assert) {
        const done = assert.async(2);

        this.provider.getItems(this.rootItem)
            .then(([ f1Dir ]) => {
                done();

                this.options.data.splice(0, this.options.data.length);
                return this.provider.createDirectory(f1Dir, 'NewDir');
            })
            .then(null, ({ errorId }) => {
                done();

                assert.equal(errorId, ErrorCode.DirectoryNotFound);
            });
    });

    test('rename file item with existing name', function(assert) {
        let fileItems = null;

        const done = assert.async(2);

        this.provider.getItems(this.rootItem)
            .then(result => {
                done();

                fileItems = result;
                return this.provider.renameItem(fileItems[0], 'F2');
            })
            .then(result => {
                done();

                assert.strictEqual(result, undefined, 'resolved with no result');

                assert.equal(fileItems[0].name, 'F2');
                assert.notEqual(fileItems[0].key, fileItems[1].key);

                assert.equal(fileItems[1].name, 'F2');
                assert.equal(fileItems[1].key, 'F2');
            });
    });

    test('rename directory via arguments without data items', function(assert) {
        const dir = new FileSystemItem('F2', true);
        const dirData = this.options.data[1];

        assert.strictEqual(dirData.name, 'F2', 'directory name correct');

        const done = assert.async(1);

        this.provider.renameItem(dir, 'new F2 test name')
            .done(() => {
                done();

                assert.strictEqual(dirData.name, 'new F2 test name', 'directory renamed');
            });
    });

    test('delete directory', function(assert) {
        let fileItems = null;

        const done = assert.async(3);

        this.provider.getItems(this.rootItem)
            .then(result => {
                done();

                fileItems = result;
                assert.equal(fileItems[0].name, 'F1');
                assert.equal(fileItems[1].name, 'F2');
                assert.equal(fileItems.length, 2);

                const deferreds = this.provider.deleteItems([ fileItems[0] ]);
                assert.strictEqual(deferreds.length, 1, 'deferreds count is same as the items count');
                return deferreds[0];
            })
            .then(result => {
                done();

                assert.strictEqual(result, undefined, 'resolved with no result');
                return this.provider.getItems(this.rootItem);
            })
            .then(result => {
                done();

                fileItems = result;
                assert.equal(fileItems[0].name, 'F2');
                assert.equal(fileItems.length, 1);
            });
    });

    test('throw exception if remove unexisting directory', function(assert) {
        const done = assert.async(2);

        this.provider.getItems(this.rootItem)
            .then(([ f1Dir ]) => {
                done();

                this.options.data.splice(0, this.options.data.length);
                const deferreds = this.provider.deleteItems([ f1Dir ]);
                return deferreds[0];
            })
            .then(null, ({ errorId }) => {
                done();

                assert.equal(errorId, ErrorCode.DirectoryNotFound);
            });
    });

    test('delete directory via arguments without data items', function(assert) {
        const dir = new FileSystemItem('F1', true);

        const srcItemCount = this.options.data.length;

        const done = assert.async(1);

        const deferreds = this.provider.deleteItems([ dir ]);
        deferreds[0].done(() => {
            done();

            assert.strictEqual(this.options.data.length, srcItemCount - 1, 'directory removed from source');
        });
    });

    test('upload file', function(assert) {
        const done = assert.async(4);

        const dir = new FileSystemItem('', true);
        let initialCount = -1;

        const file = createUploaderFiles(1)[0];
        let uploadInfo = createUploadInfo(file);

        this.provider.getItems(this.rootItem)
            .then(items => {
                done();

                initialCount = items.length;
                return this.provider.uploadFileChunk(file, uploadInfo, dir);
            })
            .then(() => {
                done();

                uploadInfo = createUploadInfo(file, 1, uploadInfo.customData);
                return this.provider.uploadFileChunk(file, uploadInfo, dir);
            })
            .then(result => {
                done();

                assert.strictEqual(result, undefined, 'resolved with no result');
                return this.provider.getItems(this.rootItem);
            })
            .then(items => {
                done();

                const uploadedFile = items.filter(item => item.name === file.name && !item.isDirectory)[0];

                assert.strictEqual(items.length, initialCount + 1, 'item count increased');
                assert.ok(uploadedFile, 'file uploaded');
                assert.strictEqual(window.atob(uploadedFile.dataItem.content), file._dxContent, 'uploaded file has correct content');
            });
    });

    test('upload file via arguments without data items', function(assert) {
        const done = assert.async(2);

        const dir = new FileSystemItem('F2', true);
        const dirData = this.options.data[1];

        const itemCount = dirData.items && dirData.items.length || 0;

        const file = createUploaderFiles(1)[0];
        let uploadInfo = createUploadInfo(file);

        this.provider.uploadFileChunk(file, uploadInfo, dir)
            .then(() => {
                done();

                uploadInfo = createUploadInfo(file, 1, uploadInfo.customData);
                return this.provider.uploadFileChunk(file, uploadInfo, dir);
            })
            .then(() => {
                done();

                assert.strictEqual(dirData.items.length, itemCount + 1, 'file uploaded');
            });
    });

    test('download single file', function(assert) {
        const content = 'Test content 1';
        const done = assert.async(2);

        let file = null;

        fileSaver._onTestSaveAs = (fileName, format, data) => {
            done();
            assert.strictEqual(fileName, file.name, 'file name is correct');
            assert.strictEqual(data.size, content.length, 'file size is correct');
        };

        const dir = new FileSystemItem('F1/F1.2', true);

        this.provider.getItems(dir)
            .then(([ file1 ]) => {
                done();

                file = file1;
                file.dataItem.content = window.btoa(content);

                this.provider.downloadItems([ file ]);
            });
    });

    test('download multiple files', function(assert) {
        const done = assert.async(2);

        fileSaver._onTestSaveAs = (fileName, format, data) => {
            done();
            assert.strictEqual(fileName, 'files.zip', 'file name is correct');
            assert.strictEqual(data.size, 254, 'file size is correct');
        };

        this.options.data[0].items[1].items.push({
            name: 'File1.2.2.txt',
            content: window.btoa('Test content 2')
        });

        const dir = new FileSystemItem('F1/F1.2', true);

        this.provider.getItems(dir)
            .then(files => {
                done();

                files[0].dataItem.content = window.btoa('Test content 1');

                this.provider.downloadItems(files);
            });
    });

    test('download single file via arguments without data items', function(assert) {
        const done = assert.async(1);

        const file = new FileSystemItem('F1/F1.2/File1.2.txt');

        fileSaver._onTestSaveAs = (fileName) => {
            done();
            assert.strictEqual(fileName, 'File1.2.txt', 'file downloaded');
        };

        this.provider.downloadItems([ file ]);
    });
});
