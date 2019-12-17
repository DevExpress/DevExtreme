const { test } = QUnit;

import FileItemsController from 'ui/file_manager/file_items_controller';
import { ErrorCode } from 'ui/file_manager/ui.file_manager.common';
import { createUploaderFiles } from '../../../helpers/fileManagerHelpers.js';
import { isString } from 'core/utils/type';

const moduleConfig = {

    beforeEach: function() {
        this.data = [
            { name: 'F1', isDirectory: true },
            { name: 'F2', isDirectory: true },
            { name: 'File1' }
        ];
        this.controller = new FileItemsController({
            fileProvider: this.data
        });

        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    }

};

QUnit.module('FileItemsController tests', moduleConfig, () => {

    test('raise current directory change event', function(assert) {
        let counter = 0;
        const controller = new FileItemsController({
            fileProvider: this.data,
            onSelectedDirectoryChanged: () => { counter++; }
        });

        const rootDir = this.controller.getCurrentDirectory();
        assert.equal(counter, 0);

        const done = assert.async();
        controller
            .getDirectories(rootDir)
            .done(directories => {
                controller.setCurrentDirectory(directories[0]);
                assert.ok(controller.getCurrentDirectory().fileItem.equals(directories[0].fileItem));
                assert.equal(counter, 1);

                controller.setCurrentDirectory(directories[0]);
                assert.ok(controller.getCurrentDirectory().fileItem.equals(directories[0].fileItem));
                assert.equal(counter, 1);
                done();
            });

        this.clock.tick(100);
    });

    test('get directory contents', function(assert) {
        const selectedDir = this.controller.getCurrentDirectory();

        const done1 = assert.async();
        this.controller
            .getDirectoryContents(selectedDir)
            .done(items => {
                assert.equal(items.length, 3);
                assert.equal(items[0].fileItem.name, 'F1');
                assert.equal(items[1].fileItem.name, 'F2');
                assert.equal(items[2].fileItem.name, 'File1');
                done1();
            });

        const done2 = assert.async();
        this.controller
            .getDirectories(selectedDir)
            .done(directories => {
                assert.equal(directories.length, 2);
                assert.equal(directories[0].fileItem.name, 'F1');
                assert.equal(directories[1].fileItem.name, 'F2');
                done2();
            });

        const done3 = assert.async();
        this.controller
            .getFiles(selectedDir)
            .done(files => {
                assert.equal(files.length, 1);
                assert.equal(files[0].fileItem.name, 'File1');
                done3();
            });

        this.clock.tick(100);
    });

    test('create new directory', function(assert) {
        const done = assert.async();
        const selectedDir = this.controller.getCurrentDirectory();

        this.controller
            .getDirectories(selectedDir)
            .then(() => {
                assert.ok(selectedDir.itemsLoaded);
                assert.ok(selectedDir.items.length > 0);
                return this.controller.createDirectory(selectedDir, 'New');
            })
            .then(() => {
                assert.notOk(selectedDir.itemsLoaded);
                assert.notOk(selectedDir.items.length > 0);
                return this.controller.getDirectories(selectedDir);
            })
            .then(directories => {
                assert.equal(directories[2].fileItem.name, 'New');
                done();
            });

        this.clock.tick(100);
    });

    test('rename file item', function(assert) {
        const done = assert.async();
        const currentDir = this.controller.getCurrentDirectory();
        let targetDir = null;

        this.controller
            .getDirectories(currentDir)
            .then(directories => {
                targetDir = directories[0];
                return this.controller.renameItem(targetDir, 'New');
            })
            .then(() => {
                assert.notOk(currentDir.itemsLoaded);
                assert.equal(currentDir.items.length, 0);
                return this.controller.getDirectories(currentDir);
            })
            .then(directories => {
                assert.equal(directories[0].fileItem.name, 'New');
                done();
            });

        this.clock.tick(100);
    });

    test('move file items', function(assert) {
        const done = assert.async();
        const rootDir = this.controller.getCurrentDirectory();
        let targetItems = null;
        let destinationDir = null;

        this.controller
            .getDirectories(rootDir)
            .then(directories => {
                targetItems = [ directories[0] ];
                destinationDir = directories[1];
                return this.controller.moveItems(targetItems, destinationDir);
            })
            .then(() => {
                assert.notOk(rootDir.itemsLoaded);
                assert.equal(rootDir.items.length, 0);
                return this.controller.getDirectories(rootDir);
            })
            .then(directories => {
                assert.equal(directories.length, 1);
                assert.equal(directories[0].fileItem.name, 'F2');
                return this.controller.getDirectories(directories[0]);
            })
            .then(directories => {
                assert.equal(directories.length, 1);
                assert.equal(directories[0].fileItem.name, 'F1');
                done();
            });

        this.clock.tick(100);
    });

    test('copy file items', function(assert) {
        const done = assert.async();
        const rootDir = this.controller.getCurrentDirectory();
        let targetItems = null;
        let destinationDir = null;

        this.controller
            .getDirectories(rootDir)
            .then(directories => {
                targetItems = [ directories[0] ];
                destinationDir = directories[1];
                return this.controller.copyItems(targetItems, destinationDir);
            })
            .then(() => {
                assert.ok(rootDir.itemsLoaded);
                assert.equal(rootDir.items.length, 3);
                return this.controller.getDirectories(destinationDir);
            })
            .then(directories => {
                assert.equal(directories.length, 1);
                assert.equal(directories[0].fileItem.name, 'F1');
                assert.ok(directories[0].parentDirectory.expanded);
                done();
            });

        this.clock.tick(100);
    });

    test('delete file items', function(assert) {
        const done = assert.async();
        const currentDir = this.controller.getCurrentDirectory();
        let targetItems = null;

        this.controller
            .getDirectoryContents(currentDir)
            .then(itemInfos => {
                targetItems = [ itemInfos[1], itemInfos[2] ];
                return this.controller.deleteItems(targetItems);
            })
            .then(() => {
                assert.notOk(currentDir.itemsLoaded);
                assert.equal(currentDir.items.length, 0);
                return this.controller.getDirectoryContents(currentDir);
            })
            .then(itemInfos => {
                assert.equal(itemInfos.length, 1);
                assert.equal(itemInfos[0].fileItem.name, 'F1');
                done();
            });

        this.clock.tick(100);
    });

    test('get current path', function(assert) {
        const done = assert.async();
        const controller = new FileItemsController({
            fileProvider: [
                {
                    name: 'F1',
                    isDirectory: true,
                    items: [
                        { name: 'F1.1', isDirectory: true }
                    ]
                }
            ]
        });

        const rootDir = this.controller.getCurrentDirectory();
        controller
            .getDirectoryContents(rootDir)
            .then(directories => controller.getDirectories(directories[0]))
            .then(directories => {
                controller.getDirectories(directories[0]);
                return directories[0];
            })
            .then(parentDirectory => {
                controller.setCurrentDirectory(parentDirectory);
                assert.equal(controller.getCurrentPath(), 'F1/F1.1');
                done();
            });

        this.clock.tick(100);
    });

    test('refresh data and restore state', function(assert) {
        const done = assert.async();
        let myData = [
            {
                name: 'D1',
                isDirectory: true,
                items: [
                    {
                        name: 'D1.1',
                        isDirectory: true,
                        items: [ { name: 'file1' } ]
                    }
                ]
            }
        ];
        let controller = new FileItemsController({
            fileProvider: myData
        });

        const rootDir = controller.getCurrentDirectory();
        controller
            .getDirectoryContents(rootDir)
            .then(directories => {
                directories[0].expanded = true;
                return controller.getDirectories(directories[0]);
            })
            .then(directories => {
                directories[0].expanded = true;
                controller.setCurrentDirectory(directories[0]);
                return controller.getDirectoryContents(directories[0]);
            })
            .then(itemInfos => {
                myData[0].items[0].items.push({ name: 'file2' });

                assert.equal(itemInfos.length, 1);
                assert.equal(itemInfos[0].fileItem.name, 'file1');
                return controller.refresh();
            })
            .then(() => {
                const currentDir = controller.getCurrentDirectory();
                assert.equal(currentDir.fileItem.name, 'D1.1');
                return controller.getDirectoryContents(currentDir);
            })
            .then(itemInfos => {
                assert.equal(itemInfos.length, 2);
                assert.equal(itemInfos[0].fileItem.name, 'file1');
                assert.equal(itemInfos[1].fileItem.name, 'file2');
                assert.ok(controller.getCurrentDirectory().expanded);
                done();
            });

        this.clock.tick(100);
    });

    test('restore selection after refresh when selected item was removed', function(assert) {
        const done = assert.async();
        let myData = [
            {
                name: 'D1',
                isDirectory: true,
                items: [
                    {
                        name: 'D1.1',
                        isDirectory: true,
                        items: [ { name: 'file1' } ]
                    }
                ]
            }
        ];
        let controller = new FileItemsController({
            fileProvider: myData
        });

        const rootDir = controller.getCurrentDirectory();
        controller
            .getDirectoryContents(rootDir)
            .then(directories => {
                directories[0].expanded = true;
                return controller.getDirectories(directories[0]);
            })
            .then(directories => {
                directories[0].expanded = true;
                controller.setCurrentDirectory(directories[0]);
                return controller.getDirectoryContents(directories[0]);
            })
            .then(itemInfos => {
                myData[0].items = [ ];

                assert.equal(itemInfos.length, 1);
                assert.equal(itemInfos[0].fileItem.name, 'file1');
                return controller.refresh();
            })
            .then(() => {
                const currentDir = controller.getCurrentDirectory();
                assert.equal(currentDir.fileItem.name, 'D1');
                return controller.getDirectoryContents(currentDir);
            })
            .then(itemInfos => {
                assert.equal(itemInfos.length, 0);
                done();
            });

        this.clock.tick(100);
    });

    test('set current path', function(assert) {
        const done = assert.async();
        this.data[1].items = [
            {
                name: 'F2.1',
                isDirectory: true,
                items: [ { name: 'file' } ]
            }
        ];

        this.controller.setCurrentPath('F2/F2.1')
            .then(() => {
                assert.equal('F2/F2.1', this.controller.getCurrentPath());

                const currentDir = this.controller.getCurrentDirectory();
                assert.equal('F2/F2.1', currentDir.fileItem.key);
                assert.equal('F2.1', currentDir.fileItem.name);

                assert.notOk(currentDir.expanded);

                const dirF2 = currentDir.parentDirectory;
                assert.ok(dirF2.expanded);

                const rootDir = dirF2.parentDirectory;
                assert.ok(rootDir.expanded);

                done();
            });

        this.clock.tick(100);
    });

    test('upload fails when max file size exceeded', function(assert) {
        this.controller = new FileItemsController({
            fileProvider: this.data,
            maxUploadFileSize: 400000
        });

        const files = createUploaderFiles(2);

        const done1 = assert.async();
        const done2 = assert.async();
        const currentDir = this.controller.getCurrentDirectory();

        this.controller
            .getDirectories(currentDir)
            .then(() => this.controller.uploadFileChunk(files[0], { }, currentDir))
            .then(() => {
                done1();
                assert.throws(() => this.controller.uploadFileChunk(files[1], { }, currentDir),
                    error => {
                        done2();
                        return error.errorId === ErrorCode.MaxFileSizeExceeded;
                    },
                    'max file size exceeded error raised');
            });

        this.clock.tick(100);
    });

    test('upload fails when file has wrong extension', function(assert) {
        this.controller = new FileItemsController({
            fileProvider: this.data,
            allowedFileExtensions: [ '.tiff' ]
        });

        const files = createUploaderFiles(2);
        files[0].name = 'Test file 1.tiff';

        const done1 = assert.async();
        const done2 = assert.async();
        const currentDir = this.controller.getCurrentDirectory();

        this.controller
            .getDirectories(currentDir)
            .then(() => this.controller.uploadFileChunk(files[0], { }, currentDir))
            .then(() => {
                done1();
                assert.throws(() => this.controller.uploadFileChunk(files[1], { }, currentDir),
                    error => {
                        done2();
                        return error.errorId === ErrorCode.WrongFileExtension;
                    },
                    'wrong file extension error raised');
            });

        this.clock.tick(100);
    });

    test('files with empty extensions can be allowed or denied', function(assert) {
        this.controller = new FileItemsController({
            fileProvider: this.data,
            allowedFileExtensions: [ '.txt' ]
        });
        let selectedDir = this.controller.getCurrentDirectory();
        const done1 = assert.async();
        this.controller
            .getDirectoryContents(selectedDir)
            .done(items => {
                assert.equal(items.length, 2);
                assert.equal(items[0].fileItem.name, 'F1');
                assert.equal(items[1].fileItem.name, 'F2');
                done1();
            });

        this.controller = new FileItemsController({
            fileProvider: this.data,
            allowedFileExtensions: [ '.txt', '' ]
        });
        selectedDir = this.controller.getCurrentDirectory();
        const done2 = assert.async();
        this.controller
            .getDirectoryContents(selectedDir)
            .done(items => {
                assert.equal(items.length, 3);
                assert.equal(items[0].fileItem.name, 'F1');
                assert.equal(items[1].fileItem.name, 'F2');
                assert.equal(items[2].fileItem.name, 'File1');
                done2();
            });

        this.clock.tick(100);
    });

    test('root direcotry key is unique', function(assert) {
        const rootDir = this.controller.getCurrentDirectory();
        const rootKey = rootDir.fileItem.key;

        assert.ok(isString(rootKey), 'root key has type of string');
        assert.ok(rootKey.length > 10, 'root key contains many characters');
        assert.ok(rootKey.indexOf('Files') === -1, 'root key doesn\'t contain root directory name');
        assert.ok(rootKey.indexOf('__dxfmroot_') === 0, 'root key starts with internal prefix');
    });

});
