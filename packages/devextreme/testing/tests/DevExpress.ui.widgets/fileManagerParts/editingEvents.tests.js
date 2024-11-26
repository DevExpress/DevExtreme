const { test } = QUnit;

import $ from 'jquery';
import fx from 'common/core/animation/fx';
import FileUploader from 'ui/file_uploader';
import ObjectFileSystemProvider from 'file_management/object_provider';
import { createTestFileSystem, createEditingEvents, createUploaderFiles, stubFileReader, FileManagerWrapper, FileManagerProgressPanelWrapper } from '../../../helpers/fileManagerHelpers.js';
import { extend } from 'core/utils/extend';
import { Deferred } from 'core/utils/deferred';

const moduleConfig = {

    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        FileUploader.__internals.changeFileInputRenderer(() => $('<div>'));

        this.createFileSystemProvider();

        this.events = createEditingEvents();

        let options = {
            fileSystemProvider: this.provider,
            permissions: {
                create: true,
                copy: true,
                move: true,
                delete: true,
                rename: true,
                upload: true,
                download: true
            }
        };
        options = extend(options, this.events);

        this.$element = $('#fileManager').dxFileManager(options);
        this.fileManager = this.$element.dxFileManager('instance');
        this.progressPanelWrapper = new FileManagerProgressPanelWrapper(this.$element);
        this.clock.tick(400);

        this.dialogResult = { };

        const showDialog = () => new Deferred().resolve(this.dialogResult).promise();
        sinon.stub(this.fileManager._editing, '_showDialog').callsFake(showDialog);
    },

    afterEach: function() {
        this.clock.restore();
    },

    createFileSystemProvider: function() {
        const fileSystem = createTestFileSystem();
        this.provider = new ObjectFileSystemProvider({ data: fileSystem });

        sinon.spy(this.provider, 'createDirectory');
        sinon.spy(this.provider, 'renameItem');
        sinon.spy(this.provider, 'moveItems');
        sinon.spy(this.provider, 'copyItems');
        sinon.spy(this.provider, 'deleteItems');
        sinon.spy(this.provider, 'uploadFileChunk');
        sinon.stub(this.provider, 'downloadItems');
    }

};

QUnit.module('Editing events tests', moduleConfig, () => {

    test('delete item', function(assert) {
        const fileName = 'File 1.txt';

        this.fileManager.option('selectedItemKeys', [ fileName ]);
        this.clock.tick(400);

        this.fileManager.executeCommand('delete');
        this.clock.tick(400);

        assert.ok(this.events.onItemDeleting.calledOnce);
        assert.strictEqual(this.events.onItemDeleting.args[0][0].cancel, false);
        assert.strictEqual(this.events.onItemDeleting.args[0][0].errorText, '');
        assert.ok('errorCode' in this.events.onItemDeleting.args[0][0]);
        assert.strictEqual(this.events.onItemDeleting.args[0][0].errorCode, undefined);
        assert.strictEqual(this.events.onItemDeleting.args[0][0].item.name, fileName);

        assert.ok(this.provider.deleteItems.calledOnce);

        assert.ok(this.events.onItemDeleted.calledOnce);
        assert.strictEqual(this.events.onItemDeleted.args[0][0].item.name, fileName);

        assert.ok(this.events.onItemDeleting.calledBefore(this.provider.deleteItems));
        assert.ok(this.events.onItemDeleted.calledAfter(this.provider.deleteItems));
    });

    test('delete multiple items', function(assert) {
        const fileName1 = 'File 1.txt';
        const fileName2 = 'File 2.jpg';

        this.fileManager.option('selectedItemKeys', [ fileName1, fileName2 ]);
        this.clock.tick(400);

        this.fileManager.executeCommand('delete');
        this.clock.tick(400);

        assert.ok(this.events.onItemDeleting.calledTwice);
        assert.strictEqual(this.events.onItemDeleting.args[0][0].item.name, fileName1);
        assert.strictEqual(this.events.onItemDeleting.args[1][0].item.name, fileName2);

        assert.ok(this.provider.deleteItems.calledTwice);

        assert.ok(this.events.onItemDeleted.calledTwice);
        assert.strictEqual(this.events.onItemDeleted.args[0][0].item.name, fileName1);
        assert.strictEqual(this.events.onItemDeleted.args[1][0].item.name, fileName2);

        assert.ok(this.events.onItemDeleting.getCall(0).calledBefore(this.provider.deleteItems.getCall(0)));
        assert.ok(this.events.onItemDeleting.getCall(1).calledBefore(this.provider.deleteItems.getCall(1)));
        assert.ok(this.events.onItemDeleted.getCall(0).calledAfter(this.provider.deleteItems.getCall(0)));
        assert.ok(this.events.onItemDeleted.getCall(1).calledAfter(this.provider.deleteItems.getCall(1)));
    });

    test('delete item - cancel operation', function(assert) {
        const fileName = 'File 1.txt';
        const onItemDeleting = sinon.spy(args => {
            args.cancel = true;
        });

        this.fileManager.option({
            selectedItemKeys: [ fileName ],
            onItemDeleting
        });
        this.clock.tick(400);

        this.fileManager.executeCommand('delete');
        this.clock.tick(400);

        assert.ok(onItemDeleting.calledOnce);
        assert.notOk(this.provider.deleteItems.called);
        assert.notOk(this.events.onItemDeleted.called);
    });

    test('delete item - async cancel operation', function(assert) {
        const fileName = 'File 1.txt';
        let resolved = false;
        const onItemDeleting = sinon.spy(args => {
            const deferred = new Deferred();
            args.cancel = deferred.promise();
            setTimeout(() => {
                resolved = true;
                deferred.resolve({
                    cancel: true
                });
            }, 3000);
        });

        this.fileManager.option({
            selectedItemKeys: [ fileName ],
            onItemDeleting
        });
        this.clock.tick(400);

        this.fileManager.executeCommand('delete');
        this.clock.tick(400);

        assert.ok(onItemDeleting.calledOnce);
        assert.notOk(resolved);

        this.clock.tick(2000);
        assert.notOk(resolved);

        this.clock.tick(1000);
        assert.ok(resolved);
        assert.ok(onItemDeleting.calledOnce);
        assert.notOk(this.provider.deleteItems.called);
        assert.notOk(this.events.onItemDeleted.called);
    });

    test('delete item - async allowed operation', function(assert) {
        const fileName = 'File 1.txt';
        let resolved = false;
        const onItemDeleting = sinon.spy(args => {
            const deferred = new Deferred();
            args.cancel = deferred.promise();
            setTimeout(() => {
                resolved = true;
                deferred.resolve({
                    cancel: false
                });
            }, 3000);
        });

        this.fileManager.option({
            selectedItemKeys: [ fileName ],
            onItemDeleting
        });
        this.clock.tick(400);

        this.fileManager.executeCommand('delete');
        this.clock.tick(400);

        assert.ok(onItemDeleting.calledOnce);
        assert.notOk(resolved);
        assert.notOk(this.provider.deleteItems.called);
        assert.notOk(this.events.onItemDeleted.called);

        this.clock.tick(2000);
        assert.notOk(resolved);
        assert.notOk(this.provider.deleteItems.called);
        assert.notOk(this.events.onItemDeleted.called);

        this.clock.tick(1000);
        assert.ok(resolved);
        assert.ok(onItemDeleting.calledOnce);
        assert.ok(this.provider.deleteItems.calledOnce);
        assert.ok(this.events.onItemDeleted.calledOnce);
    });

    test('create directory', function(assert) {
        const dirName = 'New';

        this.dialogResult = { name: dirName };
        this.fileManager.executeCommand('create');
        this.clock.tick(400);

        assert.ok(this.events.onDirectoryCreating.calledOnce);
        assert.strictEqual(this.events.onDirectoryCreating.args[0][0].parentDirectory.name, '');
        assert.strictEqual(this.events.onDirectoryCreating.args[0][0].name, dirName);

        assert.ok(this.provider.createDirectory.calledOnce);

        assert.ok(this.events.onDirectoryCreated.calledOnce);
        assert.strictEqual(this.events.onDirectoryCreated.args[0][0].parentDirectory.name, '');
        assert.strictEqual(this.events.onDirectoryCreated.args[0][0].name, dirName);
    });

    test('rename item', function(assert) {
        const fileName = 'File 1.txt';
        const newName = 'New.txt';

        this.fileManager.option('selectedItemKeys', [ fileName ]);
        this.clock.tick(400);

        this.dialogResult = { name: newName };
        this.fileManager.executeCommand('rename');
        this.clock.tick(400);

        assert.ok(this.events.onItemRenaming.calledOnce);
        assert.strictEqual(this.events.onItemRenaming.args[0][0].item.name, fileName);
        assert.strictEqual(this.events.onItemRenaming.args[0][0].item.relativeName, fileName);
        assert.strictEqual(this.events.onItemRenaming.args[0][0].item.parentPath, '');
        assert.strictEqual(this.events.onItemRenaming.args[0][0].item.pathKeys.join('|'), fileName);
        assert.strictEqual(this.events.onItemRenaming.args[0][0].newName, newName);

        assert.ok(this.provider.renameItem.calledOnce);

        assert.ok(this.events.onItemRenamed.calledOnce);
        assert.strictEqual(this.events.onItemRenamed.args[0][0].sourceItem.name, fileName);
        assert.strictEqual(this.events.onItemRenamed.args[0][0].sourceItem.relativeName, fileName);
        assert.strictEqual(this.events.onItemRenamed.args[0][0].sourceItem.parentPath, '');
        assert.strictEqual(this.events.onItemRenamed.args[0][0].sourceItem.pathKeys.join('|'), fileName);
        assert.strictEqual(this.events.onItemRenamed.args[0][0].itemName, newName);
    });

    test('move item', function(assert) {
        const fileName = 'File 1.txt';

        this.fileManager.option('selectedItemKeys', [ fileName ]);
        this.clock.tick(400);

        const targetDir = this.fileManager._controller._rootDirectoryInfo.items[1];
        this.dialogResult = { folder: targetDir };
        this.fileManager.executeCommand('move');
        this.clock.tick(400);

        assert.ok(this.events.onItemMoving.calledOnce);
        assert.strictEqual(this.events.onItemMoving.args[0][0].item.name, fileName);
        assert.strictEqual(this.events.onItemMoving.args[0][0].item.relativeName, fileName);
        assert.strictEqual(this.events.onItemMoving.args[0][0].item.parentPath, '');
        assert.strictEqual(this.events.onItemMoving.args[0][0].item.pathKeys.join('|'), fileName);
        assert.strictEqual(this.events.onItemMoving.args[0][0].destinationDirectory.name, 'Folder 2');

        assert.ok(this.provider.moveItems.calledOnce);

        assert.ok(this.events.onItemMoved.calledOnce);
        assert.strictEqual(this.events.onItemMoved.args[0][0].sourceItem.name, fileName);
        assert.strictEqual(this.events.onItemMoved.args[0][0].sourceItem.relativeName, fileName);
        assert.strictEqual(this.events.onItemMoved.args[0][0].sourceItem.parentPath, '');
        assert.strictEqual(this.events.onItemMoved.args[0][0].sourceItem.pathKeys.join('|'), fileName);
        assert.strictEqual(this.events.onItemMoved.args[0][0].parentDirectory.name, 'Folder 2');
        assert.strictEqual(this.events.onItemMoved.args[0][0].itemName, fileName);
        assert.strictEqual(this.events.onItemMoved.args[0][0].itemPath, `Folder 2/${fileName}`);
    });

    test('copy item', function(assert) {
        const fileName = 'File 1.txt';

        this.fileManager.option('selectedItemKeys', [ fileName ]);
        this.clock.tick(400);

        const targetDir = this.fileManager._controller._rootDirectoryInfo.items[1];
        this.dialogResult = { folder: targetDir };
        this.fileManager.executeCommand('copy');
        this.clock.tick(400);

        assert.ok(this.events.onItemCopying.calledOnce);
        assert.strictEqual(this.events.onItemCopying.args[0][0].item.name, fileName);
        assert.strictEqual(this.events.onItemCopying.args[0][0].item.relativeName, fileName);
        assert.strictEqual(this.events.onItemCopying.args[0][0].item.parentPath, '');
        assert.strictEqual(this.events.onItemCopying.args[0][0].item.pathKeys.join('|'), fileName);
        assert.strictEqual(this.events.onItemCopying.args[0][0].destinationDirectory.name, 'Folder 2');

        assert.ok(this.provider.copyItems.calledOnce);

        assert.ok(this.events.onItemCopied.calledOnce);
        assert.strictEqual(this.events.onItemCopied.args[0][0].sourceItem.name, fileName);
        assert.strictEqual(this.events.onItemCopied.args[0][0].sourceItem.relativeName, fileName);
        assert.strictEqual(this.events.onItemCopied.args[0][0].sourceItem.parentPath, '');
        assert.strictEqual(this.events.onItemCopied.args[0][0].sourceItem.pathKeys.join('|'), fileName);
        assert.strictEqual(this.events.onItemCopied.args[0][0].parentDirectory.name, 'Folder 2');
        assert.strictEqual(this.events.onItemCopied.args[0][0].itemName, fileName);
        assert.strictEqual(this.events.onItemCopied.args[0][0].itemPath, `Folder 2/${fileName}`);
    });

    test('upload file', function(assert) {
        stubFileReader(this.provider);

        const file = createUploaderFiles(1)[0];
        const wrapper = new FileManagerWrapper(this.$element);
        wrapper.setUploadInputFile([ file ]);
        this.clock.tick(400);

        assert.ok(this.events.onFileUploading.calledOnce);
        assert.strictEqual(this.events.onFileUploading.args[0][0].fileData.name, file.name);
        assert.strictEqual(this.events.onFileUploading.args[0][0].destinationDirectory.name, '');

        assert.ok(this.provider.uploadFileChunk.calledTwice);

        assert.ok(this.events.onFileUploaded.calledOnce);
        assert.strictEqual(this.events.onFileUploaded.args[0][0].fileData.name, file.name);
        assert.strictEqual(this.events.onFileUploaded.args[0][0].parentDirectory.name, '');
    });

    test('download item', function(assert) {
        const fileName = 'File 1.txt';

        this.fileManager.option('selectedItemKeys', [ fileName ]);
        this.clock.tick(400);

        this.fileManager.executeCommand('download');
        this.clock.tick(400);

        assert.ok(this.events.onItemDownloading.calledOnce);
        assert.strictEqual(this.events.onItemDownloading.args[0][0].item.name, fileName);

        assert.ok(this.provider.downloadItems.calledOnce);
    });

    test('error that is specified in the itemDownloading must not be ignored - single file (T1086905)', function(assert) {
        const fileName = 'File 1.txt';
        const customErrorText = 'Custom error text';
        const operationDelay = 500;

        this.fileManager.option({
            onItemDownloading: function(e) {
                const deferred = new Deferred();
                e.cancel = deferred.promise();
                setTimeout(() => deferred.resolve({
                    cancel: true,
                    errorText: customErrorText,
                    errorCode: 2
                }), operationDelay);
            },
            selectedItemKeys: [ fileName ]
        });
        this.clock.tick(400);

        this.fileManager.executeCommand('download');
        this.clock.tick(operationDelay + 400);

        const infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 1, 'There is one notification on panel');

        assert.strictEqual(infos[0].common.commonText, 'Item was not downloaded', 'Title is correct');

        const details = infos[0].details;
        assert.strictEqual(details.length, 1, 'Notification has one details section');

        assert.strictEqual(details[0].commonText, fileName, 'Common text is correct');
        assert.strictEqual(details[0].errorText, customErrorText, 'Error text is correct');
    });

    test('error that is specified in the itemDownloading must not be ignored - multiple files, cancel all (T1086905)', function(assert) {
        const fileName1 = 'File 1.txt';
        const fileName2 = 'File 2.jpg';
        const operationDelay = 500;

        this.fileManager.option({
            onItemDownloading: function(e) {
                const deferred = new Deferred();
                e.cancel = deferred.promise();
                setTimeout(() => deferred.resolve({
                    cancel: true,
                    errorCode: 2
                }), operationDelay);
            },
            selectedItemKeys: [ fileName1, fileName2 ]
        });
        this.clock.tick(400);

        this.fileManager.executeCommand('download');
        this.clock.tick(operationDelay + 400);

        const infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 1, 'There is one notification on panel');

        assert.strictEqual(infos[0].common.commonText, '2 items were not downloaded', 'Title is correct');

        const details = infos[0].details;
        assert.strictEqual(details.length, 2, 'Notification has one details section');

        assert.strictEqual(details[0].commonText, fileName1, 'Common text 1 is correct');
        assert.strictEqual(details[0].errorText, `File '${fileName1}' not found.`, 'Error text 1 is correct');
        assert.strictEqual(details[1].commonText, fileName2, 'Common text 2 is correct');
        assert.strictEqual(details[1].errorText, `File '${fileName2}' not found.`, 'Error text 2 is correct');
    });

    test('error that is specified in the itemDownloading must not be ignored - multiple files, cancel one - nothing downloaded (T1086905)', function(assert) {
        const fileName1 = 'File 1.txt';
        const fileName2 = 'File 2.jpg';
        const operationDelay = 500;

        this.fileManager.option({
            onItemDownloading: function(e) {
                const deferred = new Deferred();
                e.cancel = deferred.promise();
                setTimeout(() => deferred.resolve({
                    cancel: e.item.name === fileName1,
                    errorCode: 2
                }), operationDelay);
            },
            selectedItemKeys: [ fileName1, fileName2 ]
        });
        this.clock.tick(400);

        this.fileManager.executeCommand('download');
        this.clock.tick(operationDelay + 400);

        const infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 1, 'There is one notification on panel');

        assert.strictEqual(infos[0].common.commonText, '2 items were not downloaded', 'Title is correct');

        const details = infos[0].details;
        assert.strictEqual(details.length, 2, 'Notification has one details section');

        assert.strictEqual(details[0].commonText, fileName1, 'Common text 1 is correct');
        assert.strictEqual(details[0].errorText, `File '${fileName1}' not found.`, 'Error text 1 is correct');
        assert.strictEqual(details[1].commonText, fileName2, 'Common text 2 is correct');
        assert.strictEqual(details[1].errorText, `File '${fileName2}' not found.`, 'Error text 2 is correct');
        assert.ok(this.provider.downloadItems.notCalled, 'provider.downloadItems method not called');
    });
});
