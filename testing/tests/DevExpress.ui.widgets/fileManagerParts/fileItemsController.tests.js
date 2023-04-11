const { test } = QUnit;

import { FileItemsController } from 'ui/file_manager/file_items_controller';
import ErrorCode from 'file_management/error_codes';
import { createUploaderFiles, createUploadInfo, stubFileReader, createEditingEvents } from '../../../helpers/fileManagerHelpers.js';
import { isString } from 'core/utils/type';
import { extend } from 'core/utils/extend';

const moduleConfig = {

    beforeEach: function() {
        this.data = [
            {
                name: 'F1',
                isDirectory: true,
                items: [{ name: 'F1_1', isDirectory: true }]
            },
            {
                name: 'F2',
                isDirectory: true,
                items: [{ name: 'F2_1', isDirectory: true }]
            },
            { name: 'File1' }
        ];

        this.createController();

        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
    },

    createController: function(options) {
        this.editingEvents = createEditingEvents();

        const actualOptions = extend({
            fileProvider: this.data,
            editingEvents: this.editingEvents
        }, options || { });

        this.controller = new FileItemsController(actualOptions);
    }

};

const stubFileReaderInProvider = controller => stubFileReader(controller._fileProvider);

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

        this.clock.tick(100);
    });

    test('create new directory', function(assert) {
        const done = assert.async();
        const selectedDir = this.controller.getCurrentDirectory();
        const onCreating = this.editingEvents.onDirectoryCreating;
        const onCreated = this.editingEvents.onDirectoryCreated;

        this.controller
            .getDirectories(selectedDir)
            .then(() => {
                assert.ok(selectedDir.itemsLoaded);
                assert.ok(selectedDir.items.length > 0);
                return this.controller.createDirectory(selectedDir, 'New');
            })
            .then(() => {
                assert.ok(onCreating.calledOnce);
                assert.strictEqual(onCreating.args[0][0].parentDirectory.name, '');
                assert.strictEqual(onCreating.args[0][0].name, 'New');

                assert.ok(onCreated.calledOnce);
                assert.strictEqual(onCreated.args[0][0].parentDirectory.name, '');
                assert.strictEqual(onCreated.args[0][0].name, 'New');

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
        const onRenaming = this.editingEvents.onItemRenaming;
        const onRenamed = this.editingEvents.onItemRenamed;

        this.controller
            .getDirectories(currentDir)
            .then(directories => {
                targetDir = directories[0];
                return this.controller.renameItem(targetDir, 'New');
            })
            .then(() => {
                assert.ok(onRenaming.calledOnce);
                assert.strictEqual(onRenaming.args[0][0].item.name, 'F1');
                assert.strictEqual(onRenaming.args[0][0].item.relativeName, 'F1');
                assert.strictEqual(onRenaming.args[0][0].item.pathKeys.join('|'), 'F1');
                assert.strictEqual(onRenaming.args[0][0].newName, 'New');

                assert.ok(onRenamed.calledOnce);
                assert.strictEqual(onRenamed.args[0][0].sourceItem.name, 'F1');
                assert.strictEqual(onRenamed.args[0][0].sourceItem.relativeName, 'F1');
                assert.strictEqual(onRenamed.args[0][0].sourceItem.pathKeys.join('|'), 'F1');
                assert.strictEqual(onRenamed.args[0][0].itemName, 'New');

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

    test('move file items from parent folder to child folder', function(assert) {
        const done = assert.async();
        const rootDir = this.controller.getCurrentDirectory();
        let targetItems = null;
        let destinationDir = null;
        const onMoving = this.editingEvents.onItemMoving;
        const onMoved = this.editingEvents.onItemMoved;

        this.controller
            .getDirectories(rootDir)
            .then(directories => {
                targetItems = [ directories[0] ];
                destinationDir = directories[1];
                return this.controller.moveItems(targetItems, destinationDir);
            })
            .then(() => {
                assert.ok(onMoving.calledOnce);
                assert.strictEqual(onMoving.args[0][0].item.name, 'F1');
                assert.strictEqual(onMoving.args[0][0].item.relativeName, 'F1');
                assert.strictEqual(onMoving.args[0][0].item.parentPath, '');
                assert.strictEqual(onMoving.args[0][0].item.pathKeys.join('|'), 'F1');
                assert.strictEqual(onMoving.args[0][0].destinationDirectory.name, 'F2');

                assert.ok(onMoved.calledOnce);
                assert.strictEqual(onMoved.args[0][0].sourceItem.name, 'F1');
                assert.strictEqual(onMoved.args[0][0].sourceItem.relativeName, 'F1');
                assert.strictEqual(onMoved.args[0][0].sourceItem.parentPath, '');
                assert.strictEqual(onMoved.args[0][0].sourceItem.pathKeys.join('|'), 'F1');
                assert.strictEqual(onMoved.args[0][0].parentDirectory.name, 'F2');
                assert.strictEqual(onMoved.args[0][0].itemName, 'F1');
                assert.strictEqual(onMoved.args[0][0].itemPath, 'F2/F1');

                assert.ok(rootDir.itemsLoaded);
                assert.strictEqual(rootDir.items.length, 2);
                return this.controller.getDirectories(rootDir);
            })
            .then(directories => {
                assert.strictEqual(directories.length, 1);
                assert.strictEqual(directories[0].fileItem.name, 'F2');
                return this.controller.getDirectories(directories[0]);
            })
            .then(directories => {
                assert.strictEqual(directories.length, 2);
                assert.strictEqual(directories[0].fileItem.name, 'F2_1');
                assert.strictEqual(directories[1].fileItem.name, 'F1');
                done();
            });

        this.clock.tick(100);
    });

    test('move file items between sibling folders (T1132584)', function(assert) {
        const done = assert.async();
        const rootDir = this.controller.getCurrentDirectory();
        this.controller.getDirectories(rootDir)
            .then(dirs => {
                const f1Dir = dirs[0];
                const f2Dir = dirs[1];
                let targetItems = null;
                let destinationDir = null;
                const onMoving = this.editingEvents.onItemMoving;
                const onMoved = this.editingEvents.onItemMoved;

                this.controller
                    .getDirectories(f1Dir)
                    .then(directories => {
                        targetItems = [ directories[0] ];
                        destinationDir = f2Dir;
                        return this.controller.moveItems(targetItems, destinationDir);
                    })
                    .then(() => {
                        assert.ok(onMoving.calledOnce);
                        assert.strictEqual(onMoving.args[0][0].item.name, 'F1_1');
                        assert.strictEqual(onMoving.args[0][0].item.relativeName, 'F1/F1_1');
                        assert.strictEqual(onMoving.args[0][0].item.parentPath, 'F1');
                        assert.strictEqual(onMoving.args[0][0].item.pathKeys.join('|'), 'F1|F1/F1_1');
                        assert.strictEqual(onMoving.args[0][0].destinationDirectory.name, 'F2');

                        assert.ok(onMoved.calledOnce);
                        assert.strictEqual(onMoved.args[0][0].sourceItem.name, 'F1_1');
                        assert.strictEqual(onMoved.args[0][0].sourceItem.relativeName, 'F1/F1_1');
                        assert.strictEqual(onMoved.args[0][0].sourceItem.parentPath, 'F1');
                        assert.strictEqual(onMoved.args[0][0].sourceItem.pathKeys.join('|'), 'F1|F1/F1_1');
                        assert.strictEqual(onMoved.args[0][0].parentDirectory.name, 'F2');
                        assert.strictEqual(onMoved.args[0][0].itemName, 'F1_1');
                        assert.strictEqual(onMoved.args[0][0].itemPath, 'F2/F1_1');

                        assert.notOk(f1Dir.itemsLoaded);
                        assert.strictEqual(f1Dir.items.length, 0);
                        assert.notOk(f2Dir.itemsLoaded);
                        assert.strictEqual(f2Dir.items.length, 0);
                        return this.controller.getDirectories(f2Dir);
                    })
                    .then(directories => {
                        assert.strictEqual(directories.length, 2);
                        assert.strictEqual(directories[0].fileItem.name, 'F2_1');
                        assert.strictEqual(directories[1].fileItem.name, 'F1_1');
                        done();
                    });
                this.clock.tick(100);
            });

        this.clock.tick(100);
    });

    test('copy file items', function(assert) {
        const done = assert.async();
        const rootDir = this.controller.getCurrentDirectory();
        let targetItems = null;
        let destinationDir = null;
        const onCopying = this.editingEvents.onItemCopying;
        const onCopied = this.editingEvents.onItemCopied;

        this.controller
            .getDirectories(rootDir)
            .then(directories => {
                targetItems = [ directories[0] ];
                destinationDir = directories[1];
                return this.controller.copyItems(targetItems, destinationDir);
            })
            .then(() => {
                assert.ok(onCopying.calledOnce);
                assert.strictEqual(onCopying.args[0][0].item.name, 'F1');
                assert.strictEqual(onCopying.args[0][0].item.relativeName, 'F1');
                assert.strictEqual(onCopying.args[0][0].item.parentPath, '');
                assert.strictEqual(onCopying.args[0][0].item.pathKeys.join('|'), 'F1');
                assert.strictEqual(onCopying.args[0][0].destinationDirectory.name, 'F2');

                assert.ok(onCopied.calledOnce);
                assert.strictEqual(onCopied.args[0][0].sourceItem.name, 'F1');
                assert.strictEqual(onCopied.args[0][0].sourceItem.relativeName, 'F1');
                assert.strictEqual(onCopied.args[0][0].sourceItem.parentPath, '');
                assert.strictEqual(onCopied.args[0][0].sourceItem.pathKeys.join('|'), 'F1');
                assert.strictEqual(onCopied.args[0][0].parentDirectory.name, 'F2');
                assert.strictEqual(onCopied.args[0][0].itemName, 'F1');
                assert.strictEqual(onCopied.args[0][0].itemPath, 'F2/F1');

                assert.ok(rootDir.itemsLoaded);
                assert.equal(rootDir.items.length, 3);
                return this.controller.getDirectories(destinationDir);
            })
            .then(directories => {
                assert.equal(directories.length, 2);
                assert.equal(directories[0].fileItem.name, 'F2_1');
                assert.equal(directories[1].fileItem.name, 'F1');
                assert.ok(directories[1].parentDirectory.expanded);
                done();
            });

        this.clock.tick(100);
    });

    test('delete file items', function(assert) {
        const done = assert.async();
        const currentDir = this.controller.getCurrentDirectory();
        let targetItems = null;
        const onDeleting = this.editingEvents.onItemDeleting;
        const onDeleted = this.editingEvents.onItemDeleted;

        this.controller
            .getDirectoryContents(currentDir)
            .then(itemInfos => {
                targetItems = [ itemInfos[1], itemInfos[2] ];
                return this.controller.deleteItems(targetItems);
            })
            .then(() => {
                assert.ok(onDeleting.calledTwice);
                assert.strictEqual(onDeleting.args[0][0].item.name, 'F2');
                assert.strictEqual(onDeleting.args[1][0].item.name, 'File1');

                assert.ok(onDeleted.calledTwice);
                assert.strictEqual(onDeleted.args[0][0].item.name, 'F2');
                assert.strictEqual(onDeleted.args[1][0].item.name, 'File1');

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
        const myData = [
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
        const controller = new FileItemsController({
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
        const myData = [
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
        const controller = new FileItemsController({
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
                assert.equal(this.controller.getCurrentPath(), 'F2/F2.1');

                const currentDir = this.controller.getCurrentDirectory();
                assert.equal(currentDir.fileItem.key, 'F2/F2.1');
                assert.equal(currentDir.fileItem.name, 'F2.1');

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
        this.createController({ uploadMaxFileSize: 400000 });

        stubFileReaderInProvider(this.controller);

        const files = createUploaderFiles(2);

        const done1 = assert.async();
        const done2 = assert.async();
        const currentDir = this.controller.getCurrentDirectory();

        this.controller
            .getDirectories(currentDir)
            .then(() => this.controller.uploadFileChunk(files[0], createUploadInfo(files[0]), currentDir.fileItem))
            .then(() => {
                done1();
                assert.throws(() => this.controller.uploadFileChunk(files[1], createUploadInfo(files[1]), currentDir.fileItem),
                    error => {
                        done2();
                        return error.errorCode === ErrorCode.MaxFileSizeExceeded;
                    },
                    'max file size exceeded error raised');
            });

        this.clock.tick(100);
    });

    test('upload fails when file has wrong extension', function(assert) {
        this.createController({ allowedFileExtensions: [ '.tiff' ] });

        stubFileReaderInProvider(this.controller);

        const files = createUploaderFiles(2);
        files[0].name = 'Test file 1.tiff';

        const done1 = assert.async();
        const done2 = assert.async();
        const currentDir = this.controller.getCurrentDirectory();

        this.controller
            .getDirectories(currentDir)
            .then(() => this.controller.uploadFileChunk(files[0], createUploadInfo(files[0]), currentDir.fileItem))
            .then(() => {
                done1();
                assert.throws(() => this.controller.uploadFileChunk(files[1], createUploadInfo(files[1]), currentDir.fileItem),
                    error => {
                        done2();
                        return error.errorCode === ErrorCode.WrongFileExtension;
                    },
                    'wrong file extension error raised');
            });

        this.clock.tick(100);
    });

    test('files with empty extensions can be allowed or denied', function(assert) {
        this.createController({ allowedFileExtensions: [ '.txt' ] });
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

        this.createController({ allowedFileExtensions: [ '.txt', '' ] });
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

    test('root directory object has valid properties', function(assert) {
        const rootDir = this.controller.getCurrentDirectory();
        const rootItem = rootDir.fileItem;

        assert.strictEqual(rootItem.key, '', 'root key is empty string');
        assert.strictEqual(rootItem.path, '', 'root path is empty string');
        assert.strictEqual(rootItem.name, '', 'root name is empty string');
        assert.strictEqual(rootDir.getDisplayName(), 'Files', 'root info name has default value');

        assert.ok(isString(rootDir.getInternalKey()), 'root info key has type of string');
        assert.ok(rootDir.getInternalKey(), 'root info key is not empty');

        assert.ok(rootItem.isRoot(), 'root has root flag');
    });

    test('files can have extensions of any letter case', function(assert) {
        const extendedData = this.data.concat({ name: 'File2.JPEG' }, { name: 'File3.Doc' });
        this.createController({
            fileProvider: extendedData,
            allowedFileExtensions: [ '.jpeg', '.doC' ]
        });
        const selectedDir = this.controller.getCurrentDirectory();
        const done1 = assert.async();
        this.controller
            .getDirectoryContents(selectedDir)
            .done(items => {
                assert.equal(items.length, 4);
                assert.equal(items[0].fileItem.name, 'F1');
                assert.equal(items[1].fileItem.name, 'F2');
                assert.equal(items[2].fileItem.name, 'File2.JPEG');
                assert.equal(items[3].fileItem.name, 'File3.Doc');
                done1();
            });
        this.clock.tick(100);
    });

});
