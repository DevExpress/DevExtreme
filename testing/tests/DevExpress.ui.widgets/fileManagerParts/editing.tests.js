import $ from 'jquery';
import 'ui/file_manager';
import FileUploader from 'ui/file_uploader';
import fx from 'animation/fx';
import CustomFileSystemProvider from 'file_management/custom_provider';
import ErrorCode from 'file_management/errors';
import { Consts, FileManagerWrapper, FileManagerProgressPanelWrapper, createTestFileSystem, createUploaderFiles, stubFileReader } from '../../../helpers/fileManagerHelpers.js';
import { CLICK_EVENT } from '../../../helpers/grid/keyboardNavigationHelper.js';


const { test } = QUnit;

const FileUploaderInternals = FileUploader.__internals;

const ALLOWED_FILE_EXTENSIONS = [ '.txt', '.jpg', '.png', '.xml' ];

const moduleConfig = {
    beforeEach: function() {
        const fileSystem = createTestFileSystem();

        this.clock = sinon.useFakeTimers();
        fx.off = true;

        FileUploaderInternals.changeFileInputRenderer(() => $('<div>'));

        this.$element = $('#fileManager').dxFileManager({
            fileSystemProvider: fileSystem,
            selectionMode: 'single',
            itemView: {
                showFolders: false,
                showParentFolder: false
            },
            permissions: {
                create: true,
                copy: true,
                move: true,
                delete: true,
                rename: true,
                upload: true,
                download: true
            }
        });

        this.fileManager = this.$element.dxFileManager('instance');
        this.wrapper = new FileManagerWrapper(this.$element);
        this.progressPanelWrapper = new FileManagerProgressPanelWrapper(this.$element);

        this.clock.tick(400);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;

        FileUploaderInternals.resetFileInputTag();
    }
};

QUnit.module('Editing operations', moduleConfig, () => {

    test('rename folder in folders area', function(assert) {
        let $folderNode = this.wrapper.getFolderNode(1);
        assert.equal($folderNode.find('span').text(), 'Folder 1', 'has target folder');

        $folderNode.trigger('dxclick');
        $folderNode.trigger('click');
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);

        const $input = this.wrapper.getDialogTextInput();
        assert.equal($input.val(), 'Folder 1', 'input has value');

        $input.val('TestFolder 1').trigger('change');
        this.wrapper.getDialogButton('Save').trigger('dxclick');
        this.clock.tick(400);

        $folderNode = this.wrapper.getFolderNode(1);
        assert.equal($folderNode.find('span').text(), 'TestFolder 1', 'folder renamed');

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
    });

    test('rename folder in folders area by Enter in dialog input', function(assert) {
        let $folderNode = this.wrapper.getFolderNode(1);
        assert.equal($folderNode.find('span').text(), 'Folder 1', 'has target folder');

        $folderNode.trigger('dxclick');
        $folderNode.trigger('click');
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);

        const $input = this.wrapper.getDialogTextInput();
        assert.equal($input.val(), 'Folder 1', 'input has value');

        $input.val('TestFolder 1').trigger('change');

        $input.trigger($.Event('keyup', { key: 'enter' }));
        this.clock.tick(400);

        $folderNode = this.wrapper.getFolderNode(1);
        assert.equal($folderNode.find('span').text(), 'TestFolder 1', 'folder renamed');

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
    });

    test('rename file in items area', function(assert) {
        let $cell = this.wrapper.getRowNameCellInDetailsView(1);
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');

        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);

        const $input = this.wrapper.getDialogTextInput();
        assert.equal($input.val(), 'File 1.txt', 'input has value');

        $input.val('Testfile 11.txt').trigger('change');
        this.wrapper.getDialogButton('Save').trigger('dxclick');
        this.clock.tick(400);

        $cell = this.wrapper.getRowNameCellInDetailsView(1);
        assert.equal(this.wrapper.getDetailsItemName(0), 'Testfile 11.txt', 'file renamed');

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
    });

    test('create folder in folders area from items area without folders', function(assert) {
        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();

        const $row = $cell.parent();
        assert.ok($row.hasClass(Consts.FOCUSED_ROW_CLASS), 'file selected');

        this.wrapper.getToolbarButton('New directory').trigger('dxclick');
        this.clock.tick(400);

        const $input = this.wrapper.getDialogTextInput();
        assert.ok($input.has(':focus'), 'dialog\'s input element should be focused');
        assert.equal($input.val(), 'Untitled directory', 'input has default value');

        $input.val('Test 4').trigger('change');
        this.wrapper.getDialogButton('Create').trigger('dxclick');
        this.clock.tick(400);

        const $folderNode = this.wrapper.getFolderNode(4);
        assert.equal($folderNode.find('span').text(), 'Test 4', 'folder created');

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
    });

    test('create folder in folders area from items area without folders by Enter in dialog input', function(assert) {
        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();

        const $row = $cell.parent();
        assert.ok($row.hasClass(Consts.FOCUSED_ROW_CLASS), 'file selected');

        this.wrapper.getToolbarButton('New directory').trigger('dxclick');
        this.clock.tick(400);

        const $input = this.wrapper.getDialogTextInput();
        assert.ok($input.has(':focus'), 'dialog\'s input element should be focused');
        assert.equal($input.val(), 'Untitled directory', 'input has default value');

        $input.val('Test 4').trigger('change');

        $input.trigger($.Event('keyup', { key: 'enter' }));
        this.clock.tick(400);

        const $folderNode = this.wrapper.getFolderNode(4);
        assert.equal($folderNode.find('span').text(), 'Test 4', 'folder created');

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
    });

    test('create sub-folder for new folder', function(assert) {
        this.$element.dxFileManager('option', {
            itemView: {
                showParentFolder: true,
                showFolders: true
            }
        });
        this.clock.tick(400);

        this.wrapper.getFolderNodes().eq(2).trigger('dxclick');
        let togglesCount = this.wrapper.getFolderToggles().length;
        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 2', 'sub folder selected');
        assert.ok(togglesCount >= 2, 'specfied toggles shown');

        this.wrapper.getToolbarButton('New directory').trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getDialogTextInput().val('test 111').trigger('change');
        this.wrapper.getDialogButton('Create').trigger('dxclick');
        this.clock.tick(400);

        let $cell = this.wrapper.findDetailsItem('test 111');
        assert.equal($cell.length, 1, 'new folder created');
        assert.equal(this.wrapper.getFolderToggles().length, ++togglesCount, 'new folder toggle shown');

        $cell.trigger('dxdblclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'test 111', 'new folder selected');
        assert.equal(this.wrapper.getFolderToggles().length, togglesCount, 'toggle count is not changed');

        this.wrapper.getToolbarButton('New directory').trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getDialogTextInput().val('test 222').trigger('change');
        this.wrapper.getDialogButton('Create').trigger('dxclick');
        this.clock.tick(400);

        $cell = this.wrapper.findDetailsItem('test 222');
        assert.equal($cell.length, 1, 'new folder created');
        assert.equal(this.wrapper.getFolderToggles().length, ++togglesCount, 'new folder toggle shown');

        $cell.trigger('dxdblclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'test 222', 'new folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 2/test 111/test 222', 'correct path shown');
        assert.equal(this.wrapper.getFolderToggles().length, togglesCount, 'toggle count is not changed');
    });

    test('delete folder in folders area', function(assert) {
        let $folderNodes = this.wrapper.getFolderNodes();
        const initialCount = $folderNodes.length;
        const $folderNode = $folderNodes.eq(1);
        assert.equal($folderNode.find('span').text(), 'Folder 1', 'has target folder');

        $folderNode.trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        $folderNodes = this.wrapper.getFolderNodes();
        assert.equal($folderNodes.length, initialCount - 1, 'folders count decreased');
        assert.strictEqual($folderNodes.eq(1).find('span').text().indexOf('Folder 1'), -1, 'first folder is not target folder');
        assert.strictEqual($folderNodes.eq(2).find('span').text().indexOf('Folder 1'), -1, 'second folder is not target folder');

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
    });

    test('delete file in items area', function(assert) {
        const initialCount = this.wrapper.getRowsInDetailsView().length;

        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');

        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        const $rows = this.wrapper.getRowsInDetailsView();
        assert.equal($rows.length, initialCount - 1, 'files count decreased');
        assert.strictEqual($rows.eq(0).text().indexOf('File 1.txt'), -1, 'first folder is not target folder');
        assert.strictEqual($rows.eq(1).text().indexOf('File 1.txt'), -1, 'second folder is not target folder');

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
    });

    test('delete file from subfolder in items area', function(assert) {
        this.wrapper.getFolderNodes().eq(1).trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1', 'sub folder selected');

        let $rows = this.wrapper.getRowsInDetailsView();
        const initialCount = $rows.length;

        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1-1.txt', 'has target file');

        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        $rows = this.wrapper.getRowsInDetailsView();
        assert.equal($rows.length, initialCount - 1, 'files count decreased');
        assert.strictEqual($rows.eq(0).text().indexOf('File 1-1.txt'), -1, 'first folder is not target folder');
        assert.strictEqual($rows.eq(1).text().indexOf('File 1-1.txt'), -1, 'second folder is not target folder');

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1', 'sub folder selected');
    });

    test('move folder in folders area', function(assert) {
        let $folderNodes = this.wrapper.getFolderNodes();
        const initialCount = $folderNodes.length;
        const $folderNode = $folderNodes.eq(1);
        assert.equal($folderNode.find('span').text(), 'Folder 1', 'has target folder');

        $folderNode.trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Move to').trigger('dxclick');
        this.clock.tick(400);

        $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger('dxclick');

        this.wrapper.getDialogButton('Move').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 3', 'destination folder should be selected');

        $folderNodes = this.wrapper.getFolderNodes();
        assert.equal($folderNodes.length, initialCount - 1, 'folders count decreased');
        assert.equal($folderNodes.eq(1).find('span').text(), 'Folder 2', 'first folder is not target folder');
        assert.equal($folderNodes.eq(2).find('span').text(), 'Folder 3', 'second folder is not target folder');

        const $folderToggles = this.wrapper.getFolderToggles();
        $folderToggles.eq(1).trigger('dxclick');
        this.clock.tick(400);

        $folderNodes = this.wrapper.getFolderNodes();
        assert.equal($folderNodes.eq(3).find('span').text(), 'Folder 1', 'target folder moved');
        $folderNodes.eq(3).trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1-1.txt', 'file moved with target folder');
        assert.equal(this.wrapper.getDetailsItemName(1), 'File 1-2.jpg', 'file moved with target folder');
    });

    test('copy folder in folders area', function(assert) {
        let $folderNodes = this.wrapper.getFolderNodes();
        const $folderNode = $folderNodes.eq(1);
        assert.equal($folderNode.find('span').text(), 'Folder 1', 'has target folder');

        $folderNode.trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Copy to').trigger('dxclick');
        this.clock.tick(400);

        $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger('dxclick');

        this.wrapper.getDialogButton('Copy').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 3', 'target folder should be selected');

        $folderNodes = this.wrapper.getFolderNodes();
        assert.equal($folderNodes.eq(4).find('span').text(), 'Folder 1', 'target folder copied');
        $folderNodes.eq(4).trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1-1.txt', 'file copied with target folder');
        assert.equal(this.wrapper.getDetailsItemName(1), 'File 1-2.jpg', 'file copied with target folder');

        $folderNodes = this.wrapper.getFolderNodes();
        assert.equal($folderNodes.eq(1).find('span').text(), 'Folder 1', 'first folder is target folder');
        assert.equal($folderNodes.eq(2).find('span').text(), 'Folder 2', 'second folder is not target folder');
        assert.equal($folderNodes.eq(3).find('span').text(), 'Folder 3', 'third folder is not target folder');
    });

    test('move file in items area', function(assert) {
        let $cells = this.wrapper.getColumnCellsInDetailsView(2);
        const initialCount = $cells.length;
        const $cell = $cells.eq(0);
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');

        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Move to').trigger('dxclick');
        this.clock.tick(400);

        let $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger('dxclick');

        this.wrapper.getDialogButton('Move').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 3', 'destination folder should be selected');

        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'file moved to another folder');

        $folderNodes = this.wrapper.getFolderNodes();
        $folderNodes.eq(0).trigger('dxclick');
        this.clock.tick(400);

        $cells = this.wrapper.getColumnCellsInDetailsView(2);
        assert.equal($cells.length, initialCount - 1, 'file count decreased');
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 2.jpg', 'first file is not target file');
        assert.equal(this.wrapper.getDetailsItemName(1), 'File 3.xml', 'second file is not target file');
    });

    test('copy file in items area', function(assert) {
        let $cells = this.wrapper.getColumnCellsInDetailsView(2);
        const initialCount = $cells.length;
        const $cell = $cells.eq(0);
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');

        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Copy to').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');

        let $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger('dxclick');

        this.wrapper.getDialogButton('Copy').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'file moved to another folder');

        $folderNodes = this.wrapper.getFolderNodes();
        $folderNodes.eq(0).trigger('dxclick');
        this.clock.tick(400);

        $cells = this.wrapper.getColumnCellsInDetailsView(2);
        assert.equal($cells.length, initialCount, 'file count not changed');
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'first file is the target file');
        assert.equal(this.wrapper.getDetailsItemName(1), 'File 2.jpg', 'second file is not target file');
    });

    test('rename file failed for not allowed extension', function(assert) {
        this.fileManager.option('allowedFileExtensions', ALLOWED_FILE_EXTENSIONS);
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');

        this.wrapper.getRowNameCellInDetailsView(1).trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getDialogTextInput()
            .val('Testpage 11.aspx')
            .trigger('change');
        this.wrapper.getDialogButton('Save').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'file was not renamed');
    });

    test('download file', function(assert) {
        const fileManager = this.$element.dxFileManager('instance');
        const fileProvider = fileManager._controller._fileProvider;
        sinon.stub(fileProvider, 'downloadItems');

        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');

        this.wrapper.getRowNameCellInDetailsView(1).trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Download').filter(':visible').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(fileProvider.downloadItems.callCount, 1, 'downloadItems method called');
        const items = fileProvider.downloadItems.args[0][0];
        assert.strictEqual(items.length, 1, 'downloadItems args is valid');
        assert.strictEqual(items[0].name, 'File 1.txt', 'downloadItems args is valid');

        fileProvider.downloadItems.restore();
    });

    test('upload file', function(assert) {
        const fileManager = this.$element.dxFileManager('instance');
        stubFileReader(fileManager._controller._fileProvider);

        const initialItemCount = this.wrapper.getDetailsItemsNames().length;

        this.wrapper.getToolbarButton('Upload').filter(':visible').trigger('dxclick');

        const file = createUploaderFiles(1)[0];
        this.wrapper.setUploadInputFile([ file ]);
        this.clock.tick(400);

        const itemNames = this.wrapper.getDetailsItemNamesTexts();
        const uploadedFileIndex = itemNames.indexOf(file.name);

        assert.strictEqual(initialItemCount + 1, itemNames.length, 'item count increased');
        assert.ok(uploadedFileIndex > -1, 'file is uploaded');
        assert.strictEqual(this.wrapper.getDetailsCellText('File Size', uploadedFileIndex), '293 KB', 'file size is correct');
    });

    test('upload chunkSize option', function(assert) {
        const uploadChunkSpy = sinon.spy();
        const chunkSize = 50000;

        this.fileManager.option({
            fileSystemProvider: new CustomFileSystemProvider({
                uploadFileChunk: uploadChunkSpy
            }),
            upload: { chunkSize }
        });

        this.clock.tick(400);

        this.wrapper.getToolbarButton('Upload').filter(':visible').trigger('dxclick');

        const file = createUploaderFiles(1)[0];
        this.wrapper.setUploadInputFile([ file ]);
        this.clock.tick(400);

        assert.strictEqual(uploadChunkSpy.callCount, 6, 'uploadFileChunk called for each chunk');

        for(let i = 0; i < 6; i++) {
            const uploadInfo = uploadChunkSpy.args[i][1];
            assert.strictEqual(uploadInfo.chunkCount, 6, `chunkCount correct for ${i} chunk`);
            assert.strictEqual(uploadInfo.chunkIndex, i, `chunkIndex correct for ${i} chunk`);
            assert.strictEqual(uploadInfo.bytesUploaded, i * chunkSize, `bytesUploaded correct for ${i} chunk`);
        }
    });

    test('copying file must be completed in progress panel and current directory must be changed to the destination', function(assert) {
        const longPath = 'Files/Folder 1/Folder 1.1/Folder 1.1.1/Folder 1.1.1.1/Folder 1.1.1.1.1';
        assert.equal(this.progressPanelWrapper.getInfos().length, 0, 'there is no operations');

        let $cells = this.wrapper.getColumnCellsInDetailsView(2);
        const initialCount = $cells.length;
        const $cell = $cells.eq(0);
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');

        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Copy to').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getFolderToggle(1, true).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getFolderToggle(2, true).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getFolderToggle(3, true).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getFolderToggle(4, true).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getFolderNode(5, true).trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getDialogButton('Copy').trigger('dxclick');
        this.clock.tick(1200);

        assert.equal(this.wrapper.getDetailsItemName(0), 'Special deep file.txt', 'has specail file');
        assert.equal(this.wrapper.getDetailsItemName(1), 'File 1.txt', 'file copied to another folder');
        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1.1.1.1.1', 'target folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), longPath, 'breadcrumbs refrers to the target folder');

        const infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'one operation is present');

        const common = infos[0].common;
        assert.equal(common.commonText, 'Copied an item to Folder 1.1.1.1.1', 'common text is correct');
        assert.equal(common.progressBarValue, 100, 'task is completed');

        this.wrapper.getFolderNode(0).trigger('dxclick');
        this.clock.tick(400);

        $cells = this.wrapper.getColumnCellsInDetailsView(2);
        assert.equal($cells.length, initialCount, 'file count not changed');
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'first file is the target file');
        assert.equal(this.wrapper.getDetailsItemName(1), 'File 2.jpg', 'second file is not target file');
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
    });

    test('create directory by context menu rised on directory', function(assert) {
        this.wrapper.getInstance().option({
            itemView: {
                showFolders: true
            },
            contextMenu: {
                items: [
                    {
                        name: 'create',
                        visible: true
                    }
                ]
            }
        });
        this.clock.tick(400);

        const initialItemsLength = this.wrapper.getRowsInDetailsView().length;
        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getRowActionButtonInDetailsView(1).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getContextMenuItem('New directory').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Create').trigger('dxclick');
        this.clock.tick(800);

        const items = this.wrapper.getRowsInDetailsView();
        assert.strictEqual(items.length, initialItemsLength + 1, 'One item added');
        assert.ok(items.eq(items.length - 1).text().indexOf('Untitled directory') > -1, 'Directory created');
        assert.equal(this.progressPanelWrapper.getInfos()[0].common.commonText, 'Created a directory inside Files', 'common text is correct');
    });

    test('Action dialogues must have "Cancel" button', function(assert) {
        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Copy to').trigger('dxclick');
        this.clock.tick(400);
        const cancelButton = this.wrapper.getDialogButton('Cancel');
        assert.strictEqual(cancelButton.length, 1, ' Dialog Cancel button exists');
        cancelButton.trigger('dxclick');
        const fileNames = this.wrapper.getDetailsItemNamesTexts();
        assert.strictEqual(fileNames.filter(name => name === 'File 1.txt').length, 1, 'File wasn\'t copied');
    });

    test('errorOccurred event raised', function(assert) {
        this.fileManager.option('allowedFileExtensions', ALLOWED_FILE_EXTENSIONS);
        this.clock.tick(400);

        const errorSpy = sinon.spy();
        this.fileManager.option('onErrorOccurred', errorSpy);

        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');

        this.wrapper.getRowNameCellInDetailsView(1).trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getDialogTextInput()
            .val('Testpage 11.aspx')
            .trigger('change');
        this.wrapper.getDialogButton('Save').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(errorSpy.callCount, 1, 'event raised');
        assert.strictEqual(errorSpy.args[0][0].errorCode, ErrorCode.WrongFileExtension, 'errorCode correct');
        assert.strictEqual(errorSpy.args[0][0].errorText, 'File extension is not allowed.', 'errorText correct');
        assert.strictEqual(errorSpy.args[0][0].fileSystemItem.name, 'File 1.txt', 'fileSystemItem correct');
    });

    test('failed upload notification in notification panel should have an invisible close button in details', function(assert) {
        const fileManager = this.$element.dxFileManager('instance');
        fileManager.option('upload.maxFileSize', 100);
        this.clock.tick(400);
        stubFileReader(fileManager._controller._fileProvider);

        this.wrapper.getToolbarButton('Upload').filter(':visible').trigger('dxclick');

        const file = createUploaderFiles(1)[0];
        this.wrapper.setUploadInputFile([ file ]);
        this.clock.tick(400);


        const infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'rendered one operation');

        const common = infos[0].common;
        assert.ok(common.closeButtonVisible, 'close button visible');

        const details = infos[0].details;
        assert.equal(details.length, 1, 'one detail item rendered');

        const detail = details[0];
        assert.ok(detail.hasError, 'error rendered');
        assert.equal(detail.errorText, 'File size exceeds the maximum allowed size.', 'error text rendered');
        assert.equal(detail.commonText, 'Upload file 0.txt', 'detail item common text rendered');
        assert.notOk(detail.$progressBar.length, 'progress bar not rendered');
        assert.notOk(detail.closeButtonVisible, 'detail item has an invisible close button');
    });

    test('upload file with drag and drop', function(assert) {
        const fileManager = this.$element.dxFileManager('instance');
        stubFileReader(fileManager._controller._fileProvider);

        const initialItemCount = this.wrapper.getDetailsItemsNames().length;

        const file = createUploaderFiles(1)[0];
        const event = $.Event($.Event('drop', { dataTransfer: { files: [file] } }));

        this.wrapper.getItemsViewPanel().trigger(event);
        this.clock.tick(400);

        const itemNames = this.wrapper.getDetailsItemNamesTexts();
        const uploadedFileIndex = itemNames.indexOf(file.name);

        assert.strictEqual(initialItemCount + 1, itemNames.length, 'item count increased');
        assert.ok(uploadedFileIndex > -1, 'file is uploaded');
        assert.strictEqual(this.wrapper.getDetailsCellText('File Size', uploadedFileIndex), '293 KB', 'file size is correct');
    });

    test('upload drop zone responds on drag interaction', function(assert) {
        const itemViewPanel = this.wrapper.getItemsViewPanel();
        const dropZonePlaceholder = this.wrapper.getUploaderDropZonePlaceholder();

        assert.notOk(dropZonePlaceholder.is(':visible'), 'drop zone is invisible in initail state');

        itemViewPanel.trigger('dragenter');
        assert.deepEqual(itemViewPanel.offset(), dropZonePlaceholder.offset(), 'drop zone has correct offset');
        assert.ok(dropZonePlaceholder.is(':visible'), 'drop zone is visible');

        itemViewPanel.trigger('dragleave');
        assert.notOk(dropZonePlaceholder.is(':visible'), 'drop zone is invisible');
    });

});
