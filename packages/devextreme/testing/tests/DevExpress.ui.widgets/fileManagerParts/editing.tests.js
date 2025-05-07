import $ from 'jquery';
import 'ui/file_manager';
import FileUploader from 'ui/file_uploader';
import fx from 'common/core/animation/fx';
import pointerEvents from 'common/core/events/pointer';
import ObjectFileSystemProvider from 'file_management/object_provider';
import CustomFileSystemProvider from 'file_management/custom_provider';
import FileSystemError from 'file_management/error.js';
import ErrorCode from 'file_management/error_codes';
import { Consts, FileManagerWrapper, FileManagerProgressPanelWrapper, createTestFileSystem, createUploaderFiles, stubFileReader, getDropFileEvent } from '../../../helpers/fileManagerHelpers.js';
import NoDuplicatesFileProvider from '../../../helpers/fileManager/file_provider.no_duplicates.js';
import SlowFileProvider from '../../../helpers/fileManager/file_provider.slow.js';
import { CLICK_EVENT } from '../../../helpers/grid/keyboardNavigationHelper.js';
import { implementationsMap } from 'core/utils/size';


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
        assert.equal(this.wrapper.getFolderNode(1).find('span').text(), 'Folder 1', 'has target folder');

        this.wrapper.getFolderActionButton(1).trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getContextMenuItem('Rename').trigger('dxclick');
        this.clock.tick(400);

        const $input = this.wrapper.getDialogTextInput();
        assert.equal($input.val(), 'Folder 1', 'input has value');

        $input.val('TestFolder 1').trigger('change');
        this.wrapper.getDialogButton('Save').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFolderNode(1).find('span').text(), 'TestFolder 1', 'folder renamed');
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
    });

    test('rename folder in folders area by Enter in dialog input', function(assert) {
        assert.equal(this.wrapper.getFolderNode(1).find('span').text(), 'Folder 1', 'has target folder');

        this.wrapper.getFolderActionButton(1).trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getContextMenuItem('Rename').trigger('dxclick');
        this.clock.tick(400);

        const $input = this.wrapper.getDialogTextInput();
        assert.equal($input.val(), 'Folder 1', 'input has value');

        $input.val('TestFolder 1').trigger('change');

        $input.trigger($.Event('keydown', { key: 'enter' }));
        $input.trigger($.Event('keyup', { key: 'enter' }));
        this.clock.tick(400);

        assert.equal(this.wrapper.getFolderNode(1).find('span').text(), 'TestFolder 1', 'folder renamed');
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

        $input.trigger($.Event('keydown', { key: 'enter' }));
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
        this.clock.tick(400);
        let togglesCount = this.wrapper.getFolderToggles().length;
        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 2', 'sub folder selected');
        assert.strictEqual(togglesCount, 2, 'specfied toggles shown');

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

        this.wrapper.getFolderActionButton(1).trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getContextMenuItem('Delete').trigger('dxclick');
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

        this.wrapper.getFolderActionButton(1).trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getContextMenuItem('Move to').trigger('dxclick');
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

        this.wrapper.getFolderActionButton(1).trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getContextMenuItem('Copy to').trigger('dxclick');
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

    test('request for uploading an empty file has correct chunk count in metadata - T1122867', function(assert) {
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

        const file = createUploaderFiles(1, 0)[0];
        this.wrapper.setUploadInputFile([ file ]);
        this.clock.tick(400);

        assert.strictEqual(uploadChunkSpy.callCount, 1, 'uploadFileChunk called for each chunk');

        const uploadInfo = uploadChunkSpy.args[0][1];
        assert.strictEqual(uploadChunkSpy.args.length, 1, 'there is only one chunk');
        assert.strictEqual(uploadInfo.chunkCount, 1, 'chunkCount correct');
        assert.strictEqual(uploadInfo.chunkIndex, 0, 'chunkIndex correct');
        assert.strictEqual(uploadInfo.bytesUploaded, 0, 'bytesUploaded correct');
    });

    test('uploading an empty file completes with 100% of total progress - T1122867', function(assert) {
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

        const file = createUploaderFiles(1, 0)[0];
        this.wrapper.setUploadInputFile([ file ]);
        this.clock.tick(400);

        assert.strictEqual(uploadChunkSpy.callCount, 1, 'fileUploaded');

        const infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'one operation is present');

        const common = infos[0].common;
        assert.equal(common.commonText, 'Uploaded an item to Files', 'common text is correct');
        assert.equal(common.progressBarValue, 100, 'task is completed');
    });

    test('uploading multiple empty files keeps total progress = 0 until all files are uploaded and completes with 100% of total progress - T1122867', function(assert) {
        const uploadChunkSpy = sinon.spy();
        const chunkSize = 50000;
        const operationDelay = 200;

        this.fileManager.option({
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationDelays: [operationDelay, operationDelay, operationDelay * 2],
                operationsToDelay: 'cud',
                realProviderInstance: new CustomFileSystemProvider({
                    uploadFileChunk: uploadChunkSpy
                })
            }),
            upload: { chunkSize }
        });
        this.clock.tick(500);

        this.wrapper.getToolbarButton('Upload').filter(':visible').trigger('dxclick');

        const emptyFiles = createUploaderFiles(3, 0);
        this.wrapper.setUploadInputFile(emptyFiles);

        this.clock.tick(operationDelay + 100);
        assert.strictEqual(uploadChunkSpy.callCount, 2, '2 empty files are uploaded, and 1 isn\'t started');

        let infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'one operation is present');

        let common = infos[0].common;
        assert.equal(common.commonText, 'Uploading 3 items to Files', 'common text is correct');
        assert.equal(common.progressBarValue, 0, 'summary task is in progress');

        let details = infos[0].details;
        assert.equal(details.length, 3, '3 detail items rendered');
        for(let i = 0; i < 3; i++) {
            const detail = details[i];
            if(i < 2) {
                assert.equal(detail.commonText, `Upload file ${i}.txt`, 'common text is correct');
                assert.equal(detail.progressBarValue, 100, 'task is completed');
            } else {
                assert.equal(detail.commonText, `Upload file ${i}.txt`, 'common text is correct');
                assert.equal(detail.progressBarValue, 0, 'task is not started yet');
            }
        }

        this.clock.tick(operationDelay + 100);
        assert.strictEqual(uploadChunkSpy.callCount, 3, 'all files are uploaded');

        infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'one operation is still present');

        common = infos[0].common;
        assert.equal(common.commonText, 'Uploaded 3 items to Files', 'common text is correct');
        assert.equal(common.progressBarValue, 100, 'summary task is completed');

        details = infos[0].details;
        assert.equal(details.length, 3, '3 detail items still rendered');
        for(let i = 0; i < 3; i++) {
            const detail = details[i];
            assert.equal(detail.commonText, `Upload file ${i}.txt`, 'common text is correct');
            assert.equal(detail.progressBarValue, 100, 'task is completed');
        }
    });

    test('uploading multiple empty files and regular file keeps total progress = 0 until all files are uploaded and completes with 100% of total progress - T1122867', function(assert) {
        const uploadChunkSpy = sinon.spy();
        const chunkSize = 50000;
        const operationDelay = 200;

        this.fileManager.option({
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationDelays: [operationDelay, operationDelay, operationDelay * 2],
                operationsToDelay: 'cud',
                realProviderInstance: new CustomFileSystemProvider({
                    uploadFileChunk: uploadChunkSpy
                })
            }),
            upload: { chunkSize }
        });
        this.clock.tick(500);

        this.wrapper.getToolbarButton('Upload').filter(':visible').trigger('dxclick');

        const emptyFiles = createUploaderFiles(2, 0);
        const file = createUploaderFiles(3, chunkSize * 2)[2];
        this.wrapper.setUploadInputFile([ ...emptyFiles, file ]);

        this.clock.tick(operationDelay + 100);
        assert.strictEqual(uploadChunkSpy.callCount, 2, 'empty files are uploaded, and 0 % of regular file is uploaded');

        let infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'one operation is present');

        let common = infos[0].common;
        assert.equal(common.commonText, 'Uploading 3 items to Files', 'common text is correct');
        assert.equal(common.progressBarValue, 0, 'summary task is in progress');

        let details = infos[0].details;
        assert.equal(details.length, 3, '3 detail items rendered');
        for(let i = 0; i < 3; i++) {
            const detail = details[i];
            if(i < 2) {
                assert.equal(detail.commonText, `Upload file ${i}.txt`, 'common text is correct');
                assert.equal(detail.progressBarValue, 100, 'task is completed');
            } else {
                assert.equal(detail.commonText, `Upload file ${i}.txt`, 'common text is correct');
                assert.equal(detail.progressBarValue, 0, 'task is not started yet');
            }
        }

        this.clock.tick(operationDelay + 100);
        assert.strictEqual(uploadChunkSpy.callCount, 3, 'empty files are uploaded, and 50 % of regular file is uploaded');

        infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'one operation is still present');

        common = infos[0].common;
        assert.equal(common.commonText, 'Uploading 3 items to Files', 'common text is correct');
        assert.equal(common.progressBarValue, 50, 'summary task is in progress');

        details = infos[0].details;
        assert.equal(details.length, 3, '3 detail items still rendered');
        for(let i = 0; i < 3; i++) {
            const detail = details[i];
            if(i < 2) {
                assert.equal(detail.commonText, `Upload file ${i}.txt`, 'common text is correct');
                assert.equal(detail.progressBarValue, 100, 'task is completed');
            } else {
                assert.equal(detail.commonText, `Upload file ${i}.txt`, 'common text is correct');
                assert.equal(detail.progressBarValue, 50, 'task is in progress');
            }
        }

        this.clock.tick(operationDelay + 100);
        assert.strictEqual(uploadChunkSpy.callCount, 4, 'all files are uploaded');

        infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'one operation is still present');

        common = infos[0].common;
        assert.equal(common.commonText, 'Uploaded 3 items to Files', 'common text is correct');
        assert.equal(common.progressBarValue, 100, 'summary task is completed');

        details = infos[0].details;
        assert.equal(details.length, 3, '3 detail items still rendered');
        for(let i = 0; i < 3; i++) {
            const detail = details[i];
            assert.equal(detail.commonText, `Upload file ${i}.txt`, 'common text is correct');
            assert.equal(detail.progressBarValue, 100, 'task is completed');
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
        this.wrapper.getRowNameCellInDetailsView(1).trigger(CLICK_EVENT).click();
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

        assert.strictEqual(itemNames.length, initialItemCount + 1, 'item count increased');
        assert.ok(uploadedFileIndex > -1, 'file is uploaded');
        assert.strictEqual(this.wrapper.getDetailsCellText('File Size', uploadedFileIndex), '293 KB', 'file size is correct');
    });

    test('upload drop zone responds on drag interaction', function(assert) {
        const itemViewPanel = this.wrapper.getItemsViewPanel();
        const dropZonePlaceholder = this.wrapper.getUploaderDropZonePlaceholder();

        assert.notOk(dropZonePlaceholder.is(':visible'), 'drop zone is invisible in initail state');

        this.wrapper.triggerDragEvent(itemViewPanel, 'dragenter');
        assert.roughEqual(dropZonePlaceholder.offset().top, itemViewPanel.offset().top, 0.02, 'drop zone has correct offset');
        assert.roughEqual(dropZonePlaceholder.offset().left, itemViewPanel.offset().left, 0.02, 'drop zone has correct offset');
        assert.ok(dropZonePlaceholder.is(':visible'), 'drop zone is visible');

        this.wrapper.triggerDragEvent(itemViewPanel, 'dragleave');
        assert.notOk(dropZonePlaceholder.is(':visible'), 'drop zone is invisible');
    });

    test('upload drop zone must hide on dragleave at the left edge (splitter issue)', function(assert) {
        const itemViewPanel = this.wrapper.getItemsViewPanel();
        const dropZonePlaceholder = this.wrapper.getUploaderDropZonePlaceholder();

        assert.notOk(dropZonePlaceholder.is(':visible'), 'drop zone is invisible in initail state');

        this.wrapper.triggerDragEvent(itemViewPanel, 'dragenter');
        assert.roughEqual(dropZonePlaceholder.offset().top, itemViewPanel.offset().top, 0.02, 'drop zone has correct offset');
        assert.roughEqual(dropZonePlaceholder.offset().left, itemViewPanel.offset().left, 0.02, 'drop zone has correct offset');
        assert.ok(dropZonePlaceholder.is(':visible'), 'drop zone is visible');

        const splitterHalfWidth = parseFloat(this.wrapper.getSplitter().css('margin-left'));

        this.wrapper.triggerDragEvent(itemViewPanel, 'dragleave', { top: 1, left: splitterHalfWidth - 1 });
        assert.notOk(dropZonePlaceholder.is(':visible'), 'drop zone is invisible');
    });

    test('upload drop zone does not hide on drag interaction', function(assert) {
        const itemViewPanel = this.wrapper.getItemsViewPanel();
        const detailsItemNameCell = $(this.wrapper.getDetailsCell('Name', 1));
        const dropZonePlaceholder = this.wrapper.getUploaderDropZonePlaceholder();

        assert.notOk(dropZonePlaceholder.is(':visible'), 'drop zone is invisible in initail state');

        this.wrapper.triggerDragEvent(itemViewPanel, 'dragenter');
        assert.roughEqual(dropZonePlaceholder.offset().top, itemViewPanel.offset().top, 0.02, 'drop zone has correct offset');
        assert.roughEqual(dropZonePlaceholder.offset().left, itemViewPanel.offset().left, 0.02, 'drop zone has correct offset');
        assert.ok(dropZonePlaceholder.is(':visible'), 'drop zone is visible');

        this.wrapper.triggerDragEvent(detailsItemNameCell, 'dragenter');
        assert.roughEqual(dropZonePlaceholder.offset().top, itemViewPanel.offset().top, 0.02, 'drop zone has correct offset');
        assert.roughEqual(dropZonePlaceholder.offset().left, itemViewPanel.offset().left, 0.02, 'drop zone has correct offset');
        assert.ok(dropZonePlaceholder.is(':visible'), 'drop zone is visible');

        this.wrapper.triggerDragEvent(detailsItemNameCell, 'dragleave');
        assert.roughEqual(dropZonePlaceholder.offset().top, itemViewPanel.offset().top, 0.02, 'drop zone has correct offset');
        assert.roughEqual(dropZonePlaceholder.offset().left, itemViewPanel.offset().left, 0.02, 'drop zone has correct offset');
        assert.ok(dropZonePlaceholder.is(':visible'), 'drop zone is visible');

        this.wrapper.triggerDragEvent(itemViewPanel, 'dragleave');
        assert.notOk(dropZonePlaceholder.is(':visible'), 'drop zone is invisible');
    });

    test('upload with drag and drop should not ignore correspondent permission', function(assert) {
        const fileManager = this.$element.dxFileManager('instance');
        fileManager.option('permissions.upload', false);
        this.clock.tick(400);
        stubFileReader(fileManager._controller._fileProvider);

        const initialItemCount = this.wrapper.getDetailsItemsNames().length;

        const file = createUploaderFiles(1)[0];
        const event = $.Event($.Event('drop', { dataTransfer: { files: [file] } }));

        this.wrapper.getItemsViewPanel().trigger(event);
        this.clock.tick(400);

        let itemNames = this.wrapper.getDetailsItemNamesTexts();
        let uploadedFileIndex = itemNames.indexOf(file.name);
        let infos = this.progressPanelWrapper.getInfos();

        assert.equal(infos.length, 0, 'there are no operation notifiactions');
        assert.strictEqual(itemNames.length, initialItemCount, 'item count not increased');
        assert.strictEqual(uploadedFileIndex, -1, 'file is not uploaded');

        fileManager.option('permissions.upload', true);
        this.clock.tick(400);
        stubFileReader(fileManager._controller._fileProvider);

        this.wrapper.getItemsViewPanel().trigger(event);
        this.clock.tick(400);

        itemNames = this.wrapper.getDetailsItemNamesTexts();
        uploadedFileIndex = itemNames.indexOf(file.name);
        infos = this.progressPanelWrapper.getInfos();

        assert.equal(infos.length, 1, 'there is one operation notifiaction');
        assert.strictEqual(itemNames.length, initialItemCount + 1, 'item count increased after allowing to upload');
        assert.ok(uploadedFileIndex > -1, 'file is uploaded after allowing to upload');
        assert.strictEqual(this.wrapper.getDetailsCellText('File Size', uploadedFileIndex), '293 KB', 'file size is correct');
    });

    test('upload drop zone does not respond on drag interaction when upload is not permitted', function(assert) {
        const fileManager = this.$element.dxFileManager('instance');
        fileManager.option('permissions.upload', false);
        this.clock.tick(400);

        let itemViewPanel = this.wrapper.getItemsViewPanel();
        let dropZonePlaceholder = this.wrapper.getUploaderDropZonePlaceholder();

        assert.notOk(dropZonePlaceholder.is(':visible'), 'drop zone is invisible in initail state');

        this.wrapper.triggerDragEvent(itemViewPanel, 'dragenter');
        assert.notOk(dropZonePlaceholder.is(':visible'), 'drop zone is invisible');

        this.wrapper.triggerDragEvent(itemViewPanel, 'dragleave');
        assert.notOk(dropZonePlaceholder.is(':visible'), 'drop zone is invisible');

        fileManager.option('permissions.upload', true);
        this.clock.tick(400);

        itemViewPanel = this.wrapper.getItemsViewPanel();
        dropZonePlaceholder = this.wrapper.getUploaderDropZonePlaceholder();

        assert.notOk(dropZonePlaceholder.is(':visible'), 'drop zone is invisible in initail state');

        this.wrapper.triggerDragEvent(itemViewPanel, 'dragenter');
        assert.roughEqual(dropZonePlaceholder.offset().top, itemViewPanel.offset().top, 0.02, 'drop zone has correct offset');
        assert.roughEqual(dropZonePlaceholder.offset().left, itemViewPanel.offset().left, 0.02, 'drop zone has correct offset');
        assert.ok(dropZonePlaceholder.is(':visible'), 'drop zone is visible');

        this.wrapper.triggerDragEvent(itemViewPanel, 'dragleave');
        assert.notOk(dropZonePlaceholder.is(':visible'), 'drop zone is invisible');
    });

    test('create directory duplicate leads to an error with correct text (T926881)', function(assert) {
        const folderName = 'Folder 1';
        this.wrapper.getInstance().option({
            fileSystemProvider: new NoDuplicatesFileProvider({
                currentDirectory: () => this.wrapper.getInstance().getCurrentDirectory()
            }),
            itemView: {
                showFolders: true
            }
        });
        this.clock.tick(400);

        const initialItemsLength = this.wrapper.getRowsInDetailsView().length;
        this.wrapper.getToolbarButton('New directory').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogTextInput().val(folderName).trigger('change');
        this.wrapper.getDialogButton('Create').trigger('dxclick');
        this.clock.tick(800);

        const items = this.wrapper.getRowsInDetailsView();
        const notificationInfo = this.progressPanelWrapper.getInfos()[0];
        assert.strictEqual(items.length, initialItemsLength, 'No items added');
        assert.strictEqual(this.wrapper.findDetailsItem(folderName).length, 1, 'No items added');
        assert.strictEqual(notificationInfo.details[0].commonText, folderName, 'Common text is correct');
        assert.ok(notificationInfo.details[0].hasError, 'Info has error');
        assert.strictEqual(notificationInfo.details[0].errorText, `Directory '${folderName}' already exists.`, 'Error text is correct');
    });

    test('rename directory to already existing leads to an error with correct text (T926881)', function(assert) {
        const newFolderName = 'Folder 1';
        const targetFolderName = 'Folder 2';
        this.wrapper.getInstance().option({
            fileSystemProvider: new NoDuplicatesFileProvider({
                currentDirectory: () => this.wrapper.getInstance().getCurrentDirectory()
            }),
            itemView: {
                showFolders: true
            }
        });
        this.clock.tick(400);

        this.wrapper.findDetailsItem(targetFolderName).trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogTextInput().val(newFolderName).trigger('change');
        this.wrapper.getDialogButton('Save').trigger('dxclick');
        this.clock.tick(800);

        const notificationInfo = this.progressPanelWrapper.getInfos()[0];
        assert.strictEqual(this.wrapper.findDetailsItem(newFolderName).length, 1, 'There\'s only one folder with this name');
        assert.strictEqual(this.wrapper.findDetailsItem(newFolderName).length, 1, 'No items added');
        assert.strictEqual(notificationInfo.details[0].commonText, targetFolderName, 'Common text is correct');
        assert.ok(notificationInfo.details[0].hasError, 'Info has error');
        assert.strictEqual(notificationInfo.details[0].errorText, `Directory '${newFolderName}' already exists.`, 'Error text is correct');
    });

    test('rename file to already existing leads to an error with correct text (T926881)', function(assert) {
        const newFileName = 'File 1.txt';
        const targetFileName = 'File 2.jpg';
        this.wrapper.getInstance().option({
            fileSystemProvider: new NoDuplicatesFileProvider({
                currentDirectory: () => this.wrapper.getInstance().getCurrentDirectory()
            }),
            itemView: {
                showFolders: true
            }
        });
        this.clock.tick(400);

        this.wrapper.findDetailsItem(targetFileName).trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogTextInput().val(newFileName).trigger('change');
        this.wrapper.getDialogButton('Save').trigger('dxclick');
        this.clock.tick(800);

        const notificationInfo = this.progressPanelWrapper.getInfos()[0];
        assert.strictEqual(this.wrapper.findDetailsItem(newFileName).length, 1, 'There\'s only one file with this name');
        assert.strictEqual(this.wrapper.findDetailsItem(newFileName).length, 1, 'No items added');
        assert.strictEqual(notificationInfo.details[0].commonText, targetFileName, 'Common text is correct');
        assert.ok(notificationInfo.details[0].hasError, 'Info has error');
        assert.strictEqual(notificationInfo.details[0].errorText, `File '${newFileName}' already exists.`, 'Error text is correct');
    });

    test('rename non-existent directory leads to an error with correct text (T926881, T1086802)', function(assert) {
        const newFolderName = 'Some new name';
        const targetFolderName = 'Folder 1';
        const folder1 = { isDirectory: true, name: targetFolderName };
        const folder2 = { isDirectory: true, name: 'Folder 2' };
        let beforeRename = true;
        this.wrapper.getInstance().option({
            fileSystemProvider: new CustomFileSystemProvider({
                getItems: dir => {
                    switch(dir.key) {
                        case '':
                            return beforeRename ? [folder1, folder2] : [folder2];
                        default:
                            return [];
                    }
                },
                renameItem: (item, name) => {
                    throw new FileSystemError(ErrorCode.DirectoryNotFound);
                }
            }),
            itemView: {
                showFolders: true
            }
        });
        this.clock.tick(400);
        beforeRename = false;
        this.wrapper.findDetailsItem(targetFolderName).trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogTextInput().val(newFolderName).trigger('change');
        this.wrapper.getDialogButton('Save').trigger('dxclick');
        this.clock.tick(800);

        const notificationInfo = this.progressPanelWrapper.getInfos()[0];
        assert.strictEqual(this.wrapper.findDetailsItem(targetFolderName).length, 1, 'There\'s only one folder with this name');
        assert.strictEqual(notificationInfo.details[0].commonText, targetFolderName, 'Common text is correct');
        assert.ok(notificationInfo.details[0].hasError, 'Info has error');
        assert.strictEqual(notificationInfo.details[0].errorText, `Directory '${targetFolderName}' not found.`, 'Error text is correct');
    });

    test('consequent upload of multiple files with drag and drop', function(assert) {
        const operationDelay = 200;
        const chunkSize = 50000;
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'cud'
            }),
            upload: {
                chunkSize
            }
        });
        this.clock.tick(400);

        let initialItemCount = this.wrapper.getDetailsItemsNames().length;
        const file0 = createUploaderFiles(1)[0];

        this.wrapper.getItemsViewPanel().trigger(getDropFileEvent(file0));
        this.clock.tick((file0.size / chunkSize + 1) * operationDelay);

        let itemNames = this.wrapper.getDetailsItemNamesTexts();
        let uploadedFileIndex = itemNames.indexOf(file0.name);

        assert.strictEqual(itemNames.length, initialItemCount + 1, 'item count increased');
        assert.ok(uploadedFileIndex > -1, 'file is uploaded');
        assert.strictEqual(this.wrapper.getDetailsCellText('File Size', uploadedFileIndex), '293 KB', 'file size is correct');

        let infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'rendered one operation');
        assert.strictEqual(infos[0].common.commonText, 'Uploaded an item to Files', 'Common operation text is correct');
        assert.strictEqual(infos[0].details.length, 1, 'There is only one detail section in the info');
        assert.strictEqual(infos[0].details[0].commonText, file0.name, 'Common details text is correct');
        assert.notOk(infos[0].details[0].hasError, 'Info has no error');
        assert.strictEqual(infos[0].details[0].$progressBar.length, 1, 'Info has progress bar');
        assert.strictEqual(infos[0].details[0].progressBarStatusText, 'Done', 'Progress bar has correct status');
        assert.strictEqual(infos[0].details[0].commonText, file0.name, 'Detail text is correct');

        initialItemCount = this.wrapper.getDetailsItemsNames().length;
        const file1 = createUploaderFiles(2)[1];

        this.wrapper.getItemsViewPanel().trigger(getDropFileEvent(file1));
        this.clock.tick((file1.size / chunkSize + 1) * operationDelay);

        itemNames = this.wrapper.getDetailsItemNamesTexts();
        uploadedFileIndex = itemNames.indexOf(file1.name);

        assert.strictEqual(itemNames.length, initialItemCount + 1, 'item count increased');
        assert.ok(uploadedFileIndex > -1, 'file is uploaded');
        assert.strictEqual(this.wrapper.getDetailsCellText('File Size', uploadedFileIndex), '488.3 KB', 'file size is correct');

        infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 2, 'rendered two operation');
        assert.strictEqual(infos[0].common.commonText, 'Uploaded an item to Files', 'Common operation text is correct');
        assert.strictEqual(infos[0].details.length, 1, 'There is only one detail section in the info');
        assert.strictEqual(infos[0].details[0].commonText, file1.name, 'Common details text is correct');
        assert.notOk(infos[0].details[0].hasError, 'Info has no error');
        assert.strictEqual(infos[0].details[0].$progressBar.length, 1, 'Info has progress bar');
        assert.strictEqual(infos[0].details[0].progressBarStatusText, 'Done', 'Progress bar has correct status');
        assert.strictEqual(infos[0].details[0].commonText, file1.name, 'Detail text is correct');
    });

    test('simultaneous upload of multiple files with drag and drop', function(assert) {
        const operationDelay = 200;
        const chunkSize = 50000;
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'cud'
            }),
            upload: {
                chunkSize
            }
        });
        this.clock.tick(400);

        const initialItemCount = this.wrapper.getDetailsItemsNames().length;
        const file0 = createUploaderFiles(1)[0];
        const timeToLoad0 = (file0.size / chunkSize + 1) * operationDelay;
        const timeRemains0 = timeToLoad0 / 3;
        const file1 = createUploaderFiles(2)[1];
        const timeToLoad1 = (file1.size / chunkSize + 1) * operationDelay;
        const timeRemains1 = timeToLoad1 / 3;

        this.wrapper.getItemsViewPanel().trigger(getDropFileEvent(file0));
        this.clock.tick(timeToLoad0 - timeRemains0);

        let infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, 'rendered one operation');
        assert.strictEqual(infos[0].common.commonText, 'Uploading an item to Files', 'Common operation text is correct');
        assert.strictEqual(infos[0].details.length, 1, 'There is only one detail section in the info');
        assert.strictEqual(infos[0].details[0].commonText, file0.name, 'Common details text is correct');
        assert.notOk(infos[0].details[0].hasError, 'Info has no error');
        assert.strictEqual(infos[0].details[0].$progressBar.length, 1, 'Info has progress bar');
        assert.ok(infos[0].details[0].progressBarValue < 80, 'Progress bar has correct value');
        assert.strictEqual(infos[0].details[0].commonText, file0.name, 'Detail text is correct');

        this.wrapper.getItemsViewPanel().trigger(getDropFileEvent(file1));
        this.clock.tick(timeToLoad1 - timeRemains1);

        infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 2, 'rendered two operation');
        assert.strictEqual(infos[0].common.commonText, 'Uploading an item to Files', 'Common operation text is correct');
        assert.strictEqual(infos[0].details.length, 1, 'There is only one detail section in the info');
        assert.strictEqual(infos[0].details[0].commonText, file1.name, 'Common details text is correct');
        assert.notOk(infos[0].details[0].hasError, 'Info has no error');
        assert.strictEqual(infos[0].details[0].$progressBar.length, 1, 'Info has progress bar');
        assert.ok(infos[0].details[0].progressBarValue < 80, 'Progress bar has correct value');
        assert.strictEqual(infos[0].details[0].commonText, file1.name, 'Detail text is correct');

        this.clock.tick(timeRemains0 + timeRemains1);

        const itemNames = this.wrapper.getDetailsItemNamesTexts();
        const uploadedFile0Index = itemNames.indexOf(file0.name);
        const uploadedFile1Index = itemNames.indexOf(file1.name);

        assert.strictEqual(initialItemCount + 2, itemNames.length, 'item count increased');
        assert.ok(uploadedFile0Index > -1, 'file0 is uploaded');
        assert.strictEqual(this.wrapper.getDetailsCellText('File Size', uploadedFile0Index), '293 KB', 'file size is correct');

        assert.ok(uploadedFile1Index > -1, 'file1 is uploaded');
        assert.strictEqual(this.wrapper.getDetailsCellText('File Size', uploadedFile1Index), '488.3 KB', 'file size is correct');

        infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 2, 'rendered two operation');
        assert.strictEqual(infos[0].common.commonText, 'Uploaded an item to Files', 'Common operation text is correct');
        assert.strictEqual(infos[0].details.length, 1, 'There is only one detail section in the info 0');
        assert.strictEqual(infos[0].details[0].commonText, file1.name, 'Common details text is correct');
        assert.notOk(infos[0].details[0].hasError, 'Info 0 has no error');
        assert.strictEqual(infos[0].details[0].$progressBar.length, 1, 'Info 0 has progress bar');
        assert.strictEqual(infos[0].details[0].progressBarStatusText, 'Done', 'Progress bar has correct status');
        assert.strictEqual(infos[0].details[0].commonText, file1.name, 'Detail text is correct');

        assert.strictEqual(infos[1].common.commonText, 'Uploaded an item to Files', 'Common operation text is correct');
        assert.strictEqual(infos[1].details.length, 1, 'There is only one detail section in the info 1');
        assert.strictEqual(infos[1].details[0].commonText, file0.name, 'Common details text is correct');
        assert.notOk(infos[1].details[0].hasError, 'Info 1 has no error');
        assert.strictEqual(infos[1].details[0].$progressBar.length, 1, 'Info 1 has progress bar');
        assert.strictEqual(infos[1].details[0].progressBarStatusText, 'Done', 'Progress bar has correct status');
        assert.strictEqual(infos[1].details[0].commonText, file0.name, 'Detail text is correct');
    });

    test('refresh during upload does not prevent files from being shown before next refresh (T928871)', function(assert) {
        const operationDelay = 1000;
        const chunkSize = 50000;
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            currentPath: 'Folder 1',
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'cud'
            }),
            upload: {
                chunkSize
            }
        });
        this.clock.tick(400);

        const initialItemCount = this.wrapper.getDetailsItemsNames().length;
        const file0 = createUploaderFiles(1)[0];

        this.wrapper.getItemsViewPanel().trigger(getDropFileEvent(file0));
        this.clock.tick(operationDelay / 2);
        fileManager.refresh();

        let itemNames = this.wrapper.getDetailsItemNamesTexts();
        let uploadedFileIndex = itemNames.indexOf(file0.name);

        assert.strictEqual(itemNames.length, initialItemCount, 'item count not increased');
        assert.strictEqual(uploadedFileIndex, -1, 'file is not uploaded');

        this.clock.tick((file0.size / chunkSize + 1) * operationDelay);

        itemNames = this.wrapper.getDetailsItemNamesTexts();
        uploadedFileIndex = itemNames.indexOf(file0.name);

        assert.strictEqual(itemNames.length, initialItemCount + 1, 'item count increased');
        assert.ok(uploadedFileIndex > -1, 'file is uploaded');
        assert.strictEqual(this.wrapper.getDetailsCellText('File Size', uploadedFileIndex), '293 KB', 'file size is correct');
    });

    test('refresh during copying does not prevent files from being shown before next refresh (T928871)', function(assert) {
        const operationDelay = 1000;
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            currentPath: 'Folder 1/Folder 1.1',
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'cud'
            }),
            itemView: {
                showFolders: true
            }
        });
        this.clock.tick(500);

        // Select folder 'Folder 1/Folder 1.1/File 1-1.txt'
        this.wrapper.getColumnCellsInDetailsView(2).eq(1).trigger(CLICK_EVENT).click();
        this.clock.tick(500);
        // Invoke copy dialog
        this.wrapper.getToolbarButton('Copy to').trigger('dxclick');
        this.clock.tick(500);
        // Select destination directory 'Folder 1/Folder 1.2'
        this.wrapper.getFolderNodes(true).eq(4).trigger('dxclick');
        this.wrapper.getDialogButton('Copy').trigger('dxclick');

        this.clock.tick(operationDelay + 100);
        fileManager.refresh();

        this.clock.tick(operationDelay);

        const itemNames = this.wrapper.getDetailsItemNamesTexts();
        const copiedFileIndex = itemNames.indexOf('File 1-1.txt');

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1.2', 'destination folder should be selected');
        assert.strictEqual(itemNames.length, 1, 'file is copied');
        assert.ok(copiedFileIndex > -1, 'file is copied');
        assert.strictEqual(this.wrapper.getDetailsCellText('File Size', copiedFileIndex), '0 B', 'file size is correct');
    });

    test('refresh during moving does not prevent files from being shown before next refresh (T928871)', function(assert) {
        const operationDelay = 1000;
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            currentPath: 'Folder 1/Folder 1.1',
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'cud'
            }),
            itemView: {
                showFolders: true
            }
        });
        this.clock.tick(400);

        // Select folder 'Folder 1/Folder 1.1/File 1-1.txt'
        this.wrapper.getColumnCellsInDetailsView(2).eq(1).trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        // Invoke copy dialog
        this.wrapper.getToolbarButton('Move to').trigger('dxclick');
        this.clock.tick(400);
        // Select destination directory 'Folder 1/Folder 1.2'
        this.wrapper.getFolderNodes(true).eq(4).trigger('dxclick');
        this.wrapper.getDialogButton('Move').trigger('dxclick');

        this.clock.tick(operationDelay + 1);
        fileManager.refresh();

        this.clock.tick(operationDelay);

        const itemNames = this.wrapper.getDetailsItemNamesTexts();
        const copiedFileIndex = itemNames.indexOf('File 1-1.txt');

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1.2', 'destination folder should be selected');
        assert.strictEqual(itemNames.length, 1, 'file is moved');
        assert.ok(copiedFileIndex > -1, 'file is moved');
        assert.strictEqual(this.wrapper.getDetailsCellText('File Size', copiedFileIndex), '0 B', 'file size is correct');
    });

    test('refresh during creating does not prevent folders from being shown before next refresh (T928871)', function(assert) {
        const operationDelay = 1000;
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            currentPath: 'Folder 3',
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'cud'
            }),
            itemView: {
                showFolders: true
            }
        });
        this.clock.tick(400);

        this.wrapper.getToolbarButton('New directory').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Create').trigger('dxclick');

        this.clock.tick(operationDelay);
        fileManager.refresh();

        this.clock.tick(operationDelay);

        const itemNames = this.wrapper.getDetailsItemNamesTexts();
        const copiedFileIndex = itemNames.indexOf('Untitled directory');

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 3', 'destination folder should be selected');
        assert.strictEqual(itemNames.length, 1, 'file is created');
        assert.ok(copiedFileIndex > -1, 'file is created');
        assert.strictEqual(this.wrapper.getDetailsCellText('File Size', copiedFileIndex), '\xa0', 'file size is correct');
    });

    test('it\'s impossible to select disabled folder (dialog remains open) (T939043)', function(assert) {
        this.wrapper.getFolderActionButton(1).trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getContextMenuItem('Copy to').trigger('dxclick');
        this.clock.tick(400);

        assert.ok(this.wrapper.getFolderChooserDialog().is(':visible'), 'Folder chooser dialog is visible');

        let $folderNodes = this.wrapper.getFolderNodes(true);

        $folderNodes.eq(0).trigger('dxclick');
        this.wrapper.getDialogButton('Copy').trigger('dxclick');
        this.clock.tick(400);
        assert.ok(this.wrapper.getFolderChooserDialog().is(':visible'), 'Folder chooser dialog is still visible');

        $folderNodes.eq(1).trigger('dxclick');
        this.wrapper.getDialogButton('Copy').trigger('dxclick');
        this.clock.tick(400);
        assert.ok(this.wrapper.getFolderChooserDialog().is(':visible'), 'Folder chooser dialog is still visible');

        $folderNodes.eq(3).trigger('dxclick');
        this.wrapper.getDialogButton('Copy').trigger('dxclick');
        this.clock.tick(400);

        assert.notOk(this.wrapper.getFolderChooserDialog().is(':visible'), 'Folder chooser dialog is invisible');
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

    test('parent and selected folders must be disabled: copy folder in folders area (T939043)', function(assert) {
        this.wrapper.getFolderActionButton(1).trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getContextMenuItem('Copy to').trigger('dxclick');
        this.clock.tick(400);

        const $folderNodes = this.wrapper.getFolderNodes(true);
        assert.strictEqual($folderNodes.length, 4, 'there are only 4 nodes');
        assert.ok($folderNodes.eq(0).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Files\' node is disabled');
        assert.ok($folderNodes.eq(0).is(':visible'), '\'Files\' node is visible');
        assert.ok($folderNodes.eq(1).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1\' node is disabled');
        assert.ok($folderNodes.eq(1).is(':visible'), '\'Folder 1\' node is visible');
        assert.notOk($folderNodes.eq(2).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 2\' node is enabled');
        assert.ok($folderNodes.eq(2).is(':visible'), '\'Folder 2\' node is visible');
        assert.notOk($folderNodes.eq(3).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 3\' node is enabled');
        assert.ok($folderNodes.eq(3).is(':visible'), '\'Folder 3\' node is visible');
    });

    test('parent and selected folders must be disabled: copy folder in files area via context menu (T939043)', function(assert) {
        this.$element.dxFileManager('option', { itemView: { showFolders: true } });
        this.clock.tick(400);
        this.wrapper.getRowActionButtonInDetailsView(1).trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getContextMenuItem('Copy to').trigger('dxclick');
        this.clock.tick(400);

        const $folderNodes = this.wrapper.getFolderNodes(true);
        assert.strictEqual($folderNodes.length, 4, 'there are only 4 nodes');
        assert.ok($folderNodes.eq(0).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Files\' node is disabled');
        assert.ok($folderNodes.eq(0).is(':visible'), '\'Files\' node is visible');
        assert.ok($folderNodes.eq(1).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1\' node is disabled');
        assert.ok($folderNodes.eq(1).is(':visible'), '\'Folder 1\' node is visible');
        assert.notOk($folderNodes.eq(2).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 2\' node is enabled');
        assert.ok($folderNodes.eq(2).is(':visible'), '\'Folder 2\' node is visible');
        assert.notOk($folderNodes.eq(3).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 3\' node is enabled');
        assert.ok($folderNodes.eq(3).is(':visible'), '\'Folder 3\' node is visible');
    });

    test('parent and all of selected folders must be disabled: copy folders in files area via toolbar (T939043)', function(assert) {
        const originalFunc = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 1200;

        this.$element.dxFileManager('option', {
            selectionMode: 'multiple',
            itemView: {
                showFolders: true
            },
            width: '1200px'
        });
        this.clock.tick(400);
        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxhold');
        this.clock.tick(400);
        this.wrapper.getRowNameCellInDetailsView(2).trigger('dxhold');
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Copy to').trigger('dxclick');
        this.clock.tick(400);

        const $folderNodes = this.wrapper.getFolderNodes(true);
        assert.strictEqual($folderNodes.length, 4, 'there are only 4 nodes');
        assert.ok($folderNodes.eq(0).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Files\' node is disabled');
        assert.ok($folderNodes.eq(0).is(':visible'), '\'Files\' node is visible');
        assert.ok($folderNodes.eq(1).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1\' node is disabled');
        assert.ok($folderNodes.eq(1).is(':visible'), '\'Folder 1\' node is visible');
        assert.ok($folderNodes.eq(2).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 2\' node is disabled');
        assert.ok($folderNodes.eq(2).is(':visible'), '\'Folder 2\' node is visible');
        assert.notOk($folderNodes.eq(3).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 3\' node is enabled');
        assert.ok($folderNodes.eq(3).is(':visible'), '\'Folder 3\' node is visible');
        implementationsMap.getWidth = originalFunc;
    });

    test('parent and selected folders must be disabled: copy folder in deep location (T939043)', function(assert) {
        this.$element.dxFileManager('option', {
            currentPath: 'Folder 1/Folder 1.1/Folder 1.1.1/Folder 1.1.1.1',
            itemView: {
                showFolders: true
            }
        });
        this.clock.tick(400);
        this.wrapper.getRowActionButtonInDetailsView(1).trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getContextMenuItem('Copy to').trigger('dxclick');
        this.clock.tick(400);

        const $folderNodes = this.wrapper.getFolderNodes(true);
        assert.strictEqual($folderNodes.length, 9, 'there are only 9 nodes');
        assert.notOk($folderNodes.eq(0).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Files\' node is enabled');
        assert.ok($folderNodes.eq(0).is(':visible'), '\'Files\' node is visible');
        assert.notOk($folderNodes.eq(1).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1\' node is enabled');
        assert.ok($folderNodes.eq(1).is(':visible'), '\'Folder 1\' node is visible');

        assert.notOk($folderNodes.eq(2).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1.1\' node is enabled');
        assert.ok($folderNodes.eq(2).is(':visible'), '\'Folder 1.1\' node is visible');
        assert.notOk($folderNodes.eq(3).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1.1.1\' node is enabled');
        assert.ok($folderNodes.eq(3).is(':visible'), '\'Folder 1.1.1\' node is visible');

        assert.ok($folderNodes.eq(4).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1.1.1.1\' node is disabled');
        assert.ok($folderNodes.eq(4).is(':visible'), '\'Folder 1.1.1.1\' node is visible');
        assert.ok($folderNodes.eq(5).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1.1.1.1.1\' node is disabled');
        assert.ok($folderNodes.eq(5).is(':visible'), '\'Folder 1.1.1.1.1\' node is visible');

        assert.notOk($folderNodes.eq(6).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1.2\' node is enabled');
        assert.ok($folderNodes.eq(6).is(':visible'), '\'Folder 1.2\' node is visible');

        assert.notOk($folderNodes.eq(7).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 2\' node is enabled');
        assert.ok($folderNodes.eq(7).is(':visible'), '\'Folder 2\' node is visible');
        assert.notOk($folderNodes.eq(8).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 3\' node is enabled');
        assert.ok($folderNodes.eq(8).is(':visible'), '\'Folder 3\' node is visible');
    });

    test('parent and selected folders must be disabled and selected folder must be collapsed: copy folder in deep location (T939043)', function(assert) {
        this.$element.dxFileManager('option', {
            currentPath: 'Folder 1/Folder 1.1/Folder 1.1.1/Folder 1.1.1.1',
            itemView: {
                showFolders: true
            }
        });
        this.clock.tick(400);
        this.wrapper.getRowActionButtonInDetailsView(1).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getContextMenuItem('Copy to').trigger('dxclick');
        this.clock.tick(400);

        let $folderNodes = this.wrapper.getFolderNodes(true);
        assert.ok(this.wrapper.getFolderChooserDialog().is(':visible'), 'Folder chooser dialog is visible');
        assert.strictEqual($folderNodes.length, 9, 'there are only 9 nodes');
        this.wrapper.getDialogButton('Cancel').trigger('dxclick');
        this.clock.tick(400);
        assert.notOk(this.wrapper.getFolderChooserDialog().is(':visible'), 'Folder chooser dialog is invisible');

        this.$element.dxFileManager('option', { currentPath: 'Folder 1' });
        this.clock.tick(400);
        this.wrapper.getRowActionButtonInDetailsView(1).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getContextMenuItem('Copy to').trigger('dxclick');
        this.clock.tick(400);

        $folderNodes = this.wrapper.getFolderNodes(true);
        assert.ok(this.wrapper.getFolderChooserDialog().is(':visible'), 'Folder chooser dialog is visible');
        assert.strictEqual($folderNodes.length, 9, 'there are only 9 nodes');
        assert.notOk($folderNodes.eq(0).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Files\' node is enabled');
        assert.ok($folderNodes.eq(0).is(':visible'), '\'Files\' node is visible');
        assert.ok($folderNodes.eq(1).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1\' node is disabled');
        assert.ok($folderNodes.eq(1).is(':visible'), '\'Folder 1\' node is visible');

        assert.ok($folderNodes.eq(2).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1.1\' node is disabled');
        assert.ok($folderNodes.eq(2).is(':visible'), '\'Folder 1.1\' node is visible');
        assert.notOk($folderNodes.eq(3).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1.1.1\' node is enabled');
        assert.notOk($folderNodes.eq(3).is(':visible'), '\'Folder 1.1.1\' node is invisible');

        assert.notOk($folderNodes.eq(4).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1.1.1.1\' node is enabled');
        assert.notOk($folderNodes.eq(4).is(':visible'), '\'Folder 1.1.1.1\' node is invisible');
        assert.notOk($folderNodes.eq(5).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1.1.1.1.1\' node is enabled');
        assert.notOk($folderNodes.eq(5).is(':visible'), '\'Folder 1.1.1.1.1\' node is invisible');

        assert.notOk($folderNodes.eq(6).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1.2\' node is enabled');
        assert.ok($folderNodes.eq(6).is(':visible'), '\'Folder 1.2\' node is visible');

        assert.notOk($folderNodes.eq(7).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 2\' node is enabled');
        assert.ok($folderNodes.eq(7).is(':visible'), '\'Folder 2\' node is visible');
        assert.notOk($folderNodes.eq(8).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 3\' node is enabled');
        assert.ok($folderNodes.eq(8).is(':visible'), '\'Folder 3\' node is visible');
    });

    test('only parent folder must be disabled if there are no selected folders (T939043)', function(assert) {
        this.wrapper.getRowActionButtonInDetailsView(1).trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getContextMenuItem('Copy to').trigger('dxclick');
        this.clock.tick(400);

        const $folderNodes = this.wrapper.getFolderNodes(true);
        assert.strictEqual($folderNodes.length, 4, 'there are only 4 nodes');
        assert.ok($folderNodes.eq(0).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Files\' node is disabled');
        assert.ok($folderNodes.eq(0).is(':visible'), '\'Files\' node is visible');
        assert.notOk($folderNodes.eq(1).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1\' node is enabled');
        assert.ok($folderNodes.eq(1).is(':visible'), '\'Folder 1\' node is visible');
        assert.notOk($folderNodes.eq(2).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 2\' node is enabled');
        assert.ok($folderNodes.eq(2).is(':visible'), '\'Folder 2\' node is visible');
        assert.notOk($folderNodes.eq(3).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 3\' node is enabled');
        assert.ok($folderNodes.eq(3).is(':visible'), '\'Folder 3\' node is visible');

        $folderNodes.eq(1).trigger('dxclick');
        this.wrapper.getDialogButton('Copy').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1', 'target folder should be selected');
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1-1.txt', 'it\'s target folder');
        assert.equal(this.wrapper.getDetailsItemName(1), 'File 1-2.jpg', 'it\'s target folder');
        assert.equal(this.wrapper.getDetailsItemName(2), 'File 1.txt', 'file copied to target folder');
    });

    test('treeView must remove expand node icon when removed the last subfolder of a collapsed folder - detailsView (T946436)', function(assert) {
        const operationDelay = 400;
        this.fileManager.option({
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'crud'
            }),
            currentPath: 'Folder 1/Folder 1.1',
            itemView: {
                showFolders: true
            }
        });
        this.clock.tick(3 * operationDelay + 400);

        assert.strictEqual(this.wrapper.getFolderToggles().length, 3, 'There are 3 node toggles');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Files'), true, '\'Files\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1'), true, '\'Folder 1\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.1'), false, '\'Folder 1.1\' toggle is closed');

        assert.equal(this.wrapper.getDetailsItemName(0), 'Folder 1.1.1', 'has target folder');
        this.wrapper.getRowNameCellInDetailsView(1).trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(3 * operationDelay + 400);

        assert.strictEqual(this.wrapper.getFolderToggles().length, 2, 'There are 2 node toggles left');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Files'), true, '\'Files\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1'), true, '\'Folder 1\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.1'), null, '\'Folder 1.1\' toggle is absent');
    });

    test('treeView must remove expand node icon when removed the last subfolder of a collapsed folder - thumbnailsView (T946436)', function(assert) {
        const operationDelay = 400;
        this.fileManager.option({
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'crud'
            }),
            currentPath: 'Folder 1/Folder 1.1',
            itemView: {
                showFolders: true,
                mode: 'thumbnails'
            }
        });
        this.clock.tick(3 * operationDelay + 400);

        assert.strictEqual(this.wrapper.getFolderToggles().length, 3, 'There are 3 node toggles');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Files'), true, '\'Files\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1'), true, '\'Folder 1\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.1'), false, '\'Folder 1.1\' toggle is closed');

        assert.equal(this.wrapper.getThumbnailsItemName(0), 'Folder 1.1.1', 'has target folder');
        this.wrapper.findThumbnailsItem('Folder 1.1.1').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(3 * operationDelay + 400);

        assert.strictEqual(this.wrapper.getFolderToggles().length, 2, 'There are 2 node toggles left');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Files'), true, '\'Files\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1'), true, '\'Folder 1\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.1'), null, '\'Folder 1.1\' toggle is absent');
    });

    test('treeView must update expand node icons on folder move - detailsView (T946436)', function(assert) {
        const operationDelay = 400;
        this.fileManager.option({
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'crud'
            }),
            currentPath: 'Folder 1/Folder 1.1',
            itemView: {
                showFolders: true
            }
        });
        this.clock.tick(3 * operationDelay + 400);

        assert.strictEqual(this.wrapper.getFolderToggles().length, 3, 'There are 3 node toggles');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Files'), true, '\'Files\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1'), true, '\'Folder 1\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.1'), false, '\'Folder 1.1\' toggle is closed');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.2'), null, '\'Folder 1.2\' toggle is absent');

        assert.equal(this.wrapper.getDetailsItemName(0), 'Folder 1.1.1', 'has target folder');
        this.wrapper.getRowNameCellInDetailsView(1).trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Move to').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getFolderNodes(true).eq(4).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Move').trigger('dxclick');
        this.clock.tick(3 * operationDelay + 400);

        assert.strictEqual(this.wrapper.getFolderToggles().length, 4, 'There are 4 node toggles left');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Files'), true, '\'Files\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1'), true, '\'Folder 1\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.1'), null, '\'Folder 1.1\' toggle is absent');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.2'), true, '\'Folder 1.2\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.1.1'), false, '\'Folder 1.1.1\' toggle is closed');
    });

    test('treeView must update expand node icons on folder move - thumbnailsView (T946436)', function(assert) {
        const operationDelay = 400;
        this.fileManager.option({
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'crud'
            }),
            currentPath: 'Folder 1/Folder 1.1',
            itemView: {
                showFolders: true,
                mode: 'thumbnails'
            }
        });
        this.clock.tick(3 * operationDelay + 400);

        assert.strictEqual(this.wrapper.getFolderToggles().length, 3, 'There are 3 node toggles');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Files'), true, '\'Files\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1'), true, '\'Folder 1\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.1'), false, '\'Folder 1.1\' toggle is closed');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.2'), null, '\'Folder 1.2\' toggle is absent');

        assert.equal(this.wrapper.getThumbnailsItemName(0), 'Folder 1.1.1', 'has target folder');
        this.wrapper.findThumbnailsItem('Folder 1.1.1').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Move to').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getFolderNodes(true).eq(4).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Move').trigger('dxclick');
        this.clock.tick(3 * operationDelay + 400);

        assert.strictEqual(this.wrapper.getFolderToggles().length, 4, 'There are 4 node toggles left');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Files'), true, '\'Files\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1'), true, '\'Folder 1\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.1'), null, '\'Folder 1.1\' toggle is absent');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.2'), true, '\'Folder 1.2\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1.1.1'), false, '\'Folder 1.1.1\' toggle is closed');
    });

    test('treeView must update expand node icons on folder create - treeView (T946436)', function(assert) {
        const operationDelay = 400;
        this.fileManager.option({
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'crud'
            }),
            itemView: { showFolders: true }
        });
        this.clock.tick(3 * operationDelay + 400);

        assert.strictEqual(this.wrapper.getFolderToggles().length, 2, 'There are 2 node toggles');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Files'), true, '\'Files\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1'), false, '\'Folder 1\' toggle is closed');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 2'), null, '\'Folder 2\' toggle is absent');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 3'), null, '\'Folder 3\' toggle is absent');

        this.wrapper.getFolderNode(3).trigger('dxcontextmenu');
        this.clock.tick(400);

        this.wrapper.getContextMenuItem('New directory').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Create').trigger('dxclick');
        this.clock.tick(800);

        assert.strictEqual(this.wrapper.getFolderToggles().length, 3, 'There are 3 node toggles');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Files'), true, '\'Files\' toggle is opened');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1'), false, '\'Folder 1\' toggle is closed');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 2'), null, '\'Folder 2\' toggle is absent');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 3'), false, '\'Folder 3\' toggle is closed');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Untitled directory'), null, '\'Untitled directory\' toggle is absent');
    });

    test('the notification popup cannot be shown if showPopup option is false', function(assert) {
        this.fileManager.option('notifications.showPopup', false);
        this.clock.tick(400);

        let $rows = this.wrapper.getRowsInDetailsView();
        const initialCount = $rows.length;

        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        $rows = this.wrapper.getRowsInDetailsView();
        assert.equal($rows.length, initialCount - 1, 'files count decreased');

        assert.notOk(this.wrapper.getNotificationPopup().is(':visible'), 'notification popup is hidden');
    });

    test('the notification popup hides if to set showPopup option false when popup is shown', function(assert) {
        this.fileManager.option('notifications.showPopup', true);
        this.clock.tick(400);

        let $rows = this.wrapper.getRowsInDetailsView();
        const initialCount = $rows.length;
        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Delete').trigger('dxclick');
        this.clock.tick(400);

        $rows = this.wrapper.getRowsInDetailsView();
        assert.equal($rows.length, initialCount - 1, 'files count decreased');

        assert.ok(this.wrapper.getNotificationPopup().is(':visible'), 'notification popup is visible');

        this.fileManager.option('notifications.showPopup', false);
        this.clock.tick(400);

        assert.notOk(this.wrapper.getNotificationPopup().is(':visible'), 'notification popup is hidden');
    });

    test('itemView updated after directory creation and breadcrumbs navigation - T894271', function(assert) {
        const testDirName = 'Test Dir 1';

        this.fileManager.option({
            currentPath: 'Folder 1/Folder 1.1',
            itemView: {
                showParentFolder: true,
                showFolders: true
            }
        });
        this.clock.tick(400);

        const fileSystem = this.fileManager.option('fileSystemProvider');
        const parentDir = fileSystem[0].items[0];
        parentDir.items.push({ name: testDirName, isDirectory: true });
        this.fileManager.refresh();
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsItemName(6), testDirName, 'directory created');

        this.wrapper.getBreadcrumbsItemByText('Folder 1').trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.findDetailsItem('Folder 1.1').trigger('dxdblclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsItemName(6), testDirName, 'itemView updated');
    });

    test('rtlEnabled option must affect choose directory dialogs', function(assert) {
        this.wrapper.getInstance().option({ rtlEnabled: true });
        this.clock.tick(400);
        this.wrapper.getRowNameCellInDetailsView(1).trigger(CLICK_EVENT).click();
        this.clock.tick(100);
        this.wrapper.getToolbarButton('Copy to').trigger('dxclick');
        this.clock.tick(400);
        assert.ok(this.wrapper.getFolderChooserDialog().hasClass('dx-rtl'));
        this.wrapper.getDialogButton('Cancel').trigger('dxclick');
    });

    test('rtlEnabled option must affect edit name dialogs', function(assert) {
        this.wrapper.getInstance().option({ rtlEnabled: true });
        this.clock.tick(400);
        this.wrapper.getRowNameCellInDetailsView(1).trigger(CLICK_EVENT).click();
        this.clock.tick(100);
        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);
        assert.ok(this.wrapper.getNameEditorDialog().hasClass('dx-rtl'));
        this.wrapper.getDialogButton('Cancel').trigger('dxclick');
    });

    test('rtlEnabled option must affect delete item dialog', function(assert) {
        this.wrapper.getInstance().option({ rtlEnabled: true });
        this.clock.tick(400);
        this.wrapper.getRowNameCellInDetailsView(1).trigger(CLICK_EVENT).click();
        this.clock.tick(100);
        this.wrapper.getToolbarButton('Delete').trigger('dxclick');
        this.clock.tick(400);
        assert.ok(this.wrapper.getDeleteItemDialog().hasClass('dx-rtl'));
        this.wrapper.getDialogButton('Cancel').trigger('dxclick');
    });

    test('it should not be possible to invoke move/copy dialog for treeView folders (T1004864)', function(assert) {
        const originalFunc = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 1200;

        this.$element.dxFileManager('option', {
            selectionMode: 'multiple',
            itemView: {
                showFolders: false
            },
            width: '1200px'
        });
        this.clock.tick(400);
        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxhold');
        this.clock.tick(400);
        this.wrapper.getFolderToggle(0).trigger('dxclick').click();
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Move to').trigger('dxclick');
        this.clock.tick(400);

        assert.notOk(this.wrapper.getToolbar().hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'file toolbar displayed');

        const $folderNodes = this.wrapper.getFolderNodes(true);
        assert.strictEqual($folderNodes.length, 4, 'there are 4 nodes');
        assert.strictEqual(this.wrapper.getFolderToggles(true).length, 2, 'there are 2 node toggles');

        assert.ok($folderNodes.eq(0).is(':visible'), '\'Files\' node is visible');
        assert.ok($folderNodes.eq(0).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Files\' node is disabled');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Files', true), true, '\'Files\' toggle is opened');

        assert.ok($folderNodes.eq(1).is(':visible'), '\'Folder 1\' node is visible');
        assert.notOk($folderNodes.eq(1).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 1\' node is enabled');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 1', true), false, '\'Folder 1\' toggle is closed');

        assert.ok($folderNodes.eq(2).is(':visible'), '\'Folder 2\' node is visible');
        assert.notOk($folderNodes.eq(2).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 2\' node is ensabled');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 2', true), null, '\'Folder 2\' toggle is absent');

        assert.ok($folderNodes.eq(3).is(':visible'), '\'Folder 3\' node is visible');
        assert.notOk($folderNodes.eq(3).is(`.${Consts.DISABLED_STATE_CLASS}`), '\'Folder 3\' node is enabled');
        assert.strictEqual(this.wrapper.isFolderNodeToggleOpened('Folder 3', true), null, '\'Folder 3\' toggle is absent');

        this.wrapper.getDialogButton('Cancel').trigger('dxclick');
        implementationsMap.getWidth = originalFunc;
    });

    test('create folder by Enter in dialog input - issue with IME compositionEnd for Chinese (T1024643)', function(assert) {
        this.wrapper.getToolbarButton('New directory').trigger('dxclick');
        this.clock.tick(400);

        const $input = this.wrapper.getDialogTextInput();
        assert.ok($input.has(':focus'), 'dialog\'s input element should be focused');
        assert.strictEqual($input.val(), 'Untitled directory', 'input has default value');

        $input.val('Test 4').trigger('change');

        const fileManager = this.wrapper.getInstance();
        const createItemDialog = fileManager._editing._dialogManager._createItemDialog;
        assert.strictEqual(createItemDialog._hasCompositionJustEnded, undefined, 'composition not yet started');

        $input.trigger($.Event('keydown', { key: 'enter' }));
        $input.trigger($.Event('keyup', { key: 'enter' }));
        this.clock.tick(400);

        assert.strictEqual(createItemDialog._hasCompositionJustEnded, true, 'compositionEnded successfully');

        const $folderNode = this.wrapper.getFolderNode(4);
        assert.strictEqual($folderNode.find('span').text(), 'Test 4', 'folder created');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
    });

    test('the entire widget must not be repainted when the permissions option changed (T1051605)', function(assert) {
        const fileManager = this.wrapper.getInstance();
        const initMarkupSpy = sinon.stub(fileManager, '_initMarkup');
        assert.ok(initMarkupSpy.notCalled, '_initMarkup not called yet');
        fileManager.option('permissions', { copy: true });
        assert.ok(initMarkupSpy.notCalled, '_initMarkup not called yet');
    });

    test('current directory must not be changed when all items not moved - events (T1080473)', function(assert) {
        const fileName1 = 'File 1.txt';
        const fileName2 = 'File 2.jpg';
        const initialDirName = 'Files';

        this.fileManager.option({
            selectionMode: 'multiple',
            selectedItemKeys: [ fileName1, fileName2 ],
            onItemMoving: e => {
                e.cancel = true;
            }
        });
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Move to').trigger('dxclick');
        this.clock.tick(400);

        const $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger('dxclick');

        this.wrapper.getDialogButton('Move').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getFocusedItemText(), initialDirName, 'initial folder should be selected');
        assert.strictEqual(this.fileManager.getCurrentDirectory().name, '', 'current folder is the initial folder');
        assert.strictEqual(this.wrapper.getDetailsItemName(0), fileName1, '1st file is still in the initial dir');
        assert.strictEqual(this.wrapper.getDetailsItemName(1), fileName2, '2nd file is still in the initial dir');
    });

    test('current directory must not be changed when all items not moved - provider (T1080473)', function(assert) {
        const fileName1 = 'File 1.txt';
        const fileName2 = 'File 2.jpg';
        const initialDirName = 'Files';
        const objectProvider = new ObjectFileSystemProvider({ data: createTestFileSystem() });

        this.fileManager.option({
            fileSystemProvider: new CustomFileSystemProvider({
                getItems: function() { return objectProvider.getItems(...arguments); },
                moveItem: function() { throw new FileSystemError(0, null); },
            }),
            selectionMode: 'multiple',
            selectedItemKeys: [ fileName1, fileName2 ]
        });
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Move to').trigger('dxclick');
        this.clock.tick(400);

        const $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger('dxclick');

        this.wrapper.getDialogButton('Move').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getFocusedItemText(), initialDirName, 'initial folder should be selected');
        assert.strictEqual(this.fileManager.getCurrentDirectory().name, '', 'current folder is the initial folder');
        assert.strictEqual(this.wrapper.getDetailsItemName(0), fileName1, '1st file is still in the initial dir');
        assert.strictEqual(this.wrapper.getDetailsItemName(1), fileName2, '2nd file is still in the initial dir');
    });

    test('current directory must not be changed when all items not copied - events (T1080473)', function(assert) {
        const fileName1 = 'File 1.txt';
        const fileName2 = 'File 2.jpg';
        const initialDirName = 'Files';

        this.fileManager.option({
            selectionMode: 'multiple',
            selectedItemKeys: [ fileName1, fileName2 ],
            onItemCopying: e => {
                e.cancel = true;
            }
        });
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Copy to').trigger('dxclick');
        this.clock.tick(400);

        const $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger('dxclick');

        this.wrapper.getDialogButton('Copy').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getFocusedItemText(), initialDirName, 'initial folder should be selected');
        assert.strictEqual(this.fileManager.getCurrentDirectory().name, '', 'current folder is the initial folder');
        assert.strictEqual(this.wrapper.getDetailsItemName(0), fileName1, '1st file is still in the initial dir');
        assert.strictEqual(this.wrapper.getDetailsItemName(1), fileName2, '2nd file is still in the initial dir');
    });

    test('current directory must not be changed when all items not copied - provider (T1080473)', function(assert) {
        const fileName1 = 'File 1.txt';
        const fileName2 = 'File 2.jpg';
        const initialDirName = 'Files';
        const objectProvider = new ObjectFileSystemProvider({ data: createTestFileSystem() });

        this.fileManager.option({
            fileSystemProvider: new CustomFileSystemProvider({
                getItems: function() { return objectProvider.getItems(...arguments); },
                copyItem: function() { throw new FileSystemError(0, null); },
            }),
            selectionMode: 'multiple',
            selectedItemKeys: [ fileName1, fileName2 ]
        });
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Copy to').trigger('dxclick');
        this.clock.tick(400);

        const $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger('dxclick');

        this.wrapper.getDialogButton('Copy').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getFocusedItemText(), initialDirName, 'initial folder should be selected');
        assert.strictEqual(this.fileManager.getCurrentDirectory().name, '', 'current folder is the initial folder');
        assert.strictEqual(this.wrapper.getDetailsItemName(0), fileName1, '1st file is still in the initial dir');
        assert.strictEqual(this.wrapper.getDetailsItemName(1), fileName2, '2nd file is still in the initial dir');
    });

    test('the \'copy\' dialog button must be disabled and dialog remains open after click on it if no folders are selected (T1092300)', function(assert) {
        let $cells = this.wrapper.getColumnCellsInDetailsView(2);
        const initialCount = $cells.length;
        const $cell = $cells.eq(0);

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');

        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Copy to').trigger('dxclick');
        this.clock.tick(400);
        assert.ok(this.wrapper.getFolderChooserDialog().is(':visible'), 'Folder chooser dialog is visible');
        assert.ok(this.wrapper.getDialogButton('Copy').hasClass(Consts.DISABLED_STATE_CLASS), '\'Copy\' dialog button is disabled');

        this.wrapper.getDialogButton('Copy').trigger('dxclick');
        this.clock.tick(400);

        $cells = this.wrapper.getColumnCellsInDetailsView(2);
        assert.equal($cells.length, initialCount, 'file count not changed');
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'first file is the target file');
        assert.equal(this.wrapper.getDetailsItemName(1), 'File 2.jpg', 'second file is not target file');
        assert.ok(this.wrapper.getFolderChooserDialog().is(':visible'), 'Folder chooser dialog is still visible');

        this.wrapper.getFolderNodes(true).eq(3).trigger('dxclick');
        this.clock.tick(200);
        assert.notOk(this.wrapper.getDialogButton('Copy').hasClass(Consts.DISABLED_STATE_CLASS), '\'Copy\' dialog button is enabled');

        this.wrapper.getDialogButton('Copy').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 3', 'root folder selected');
        $cells = this.wrapper.getColumnCellsInDetailsView(2);
        assert.equal($cells.length, 1, 'file count is correct');
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'first file is the target file');
        assert.notOk(this.wrapper.getFolderChooserDialog().is(':visible'), 'Folder chooser dialog is invisible');
    });

    test('the \'move\' dialog button must be disabled and dialog remains open after click on it if no folders are selected (T1092300)', function(assert) {
        let $cells = this.wrapper.getColumnCellsInDetailsView(2);
        const initialCount = $cells.length;
        const $cell = $cells.eq(0);

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');

        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Move to').trigger('dxclick');
        this.clock.tick(400);
        assert.ok(this.wrapper.getFolderChooserDialog().is(':visible'), 'Folder chooser dialog is visible');
        assert.ok(this.wrapper.getDialogButton('Move').hasClass(Consts.DISABLED_STATE_CLASS), '\'Move\' dialog button is disabled');

        this.wrapper.getDialogButton('Move').trigger('dxclick');
        this.clock.tick(400);

        $cells = this.wrapper.getColumnCellsInDetailsView(2);
        assert.equal($cells.length, initialCount, 'file count not changed');
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'first file is the target file');
        assert.equal(this.wrapper.getDetailsItemName(1), 'File 2.jpg', 'second file is not target file');
        assert.ok(this.wrapper.getFolderChooserDialog().is(':visible'), 'Folder chooser dialog is still visible');

        this.wrapper.getFolderNodes(true).eq(3).trigger('dxclick');
        this.clock.tick(200);
        assert.notOk(this.wrapper.getDialogButton('Move').hasClass(Consts.DISABLED_STATE_CLASS), '\'Move\' dialog button is enabled');

        this.wrapper.getDialogButton('Move').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 3', 'root folder selected');
        $cells = this.wrapper.getColumnCellsInDetailsView(2);
        assert.equal($cells.length, 1, 'file count is correct');
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'first file is the target file');
        assert.notOk(this.wrapper.getFolderChooserDialog().is(':visible'), 'Folder chooser dialog is invisible');
    });

    test('currentPath must not be changed when remaning a file after its moving (T1132584)', function(assert) {
        assert.strictEqual(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');

        // moving file
        this.wrapper.getRowNameCellInDetailsView(1).trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Move to').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getFolderNodes(true).eq(3).trigger('dxclick');
        this.wrapper.getDialogButton('Move').trigger('dxclick');
        this.clock.tick(400);

        // check that it moved
        assert.strictEqual(this.wrapper.getInstance().option('currentPath'), 'Folder 3', 'currentPath option matches destination directory');
        assert.deepEqual(this.wrapper.getInstance().option('currentPathKeys'), ['Folder 3'], 'currentPathKeys option matches destination directory');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 3', 'destination folder should be selected');
        assert.strictEqual(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'file moved to another folder');

        assert.strictEqual(this.wrapper.getColumnCellsInDetailsView(2).length, 1, 'file count is correct');

        // renaming moved file
        this.wrapper.getRowNameCellInDetailsView(1).trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogTextInput().val('File 1 renamed.txt').trigger('change');
        this.wrapper.getDialogButton('Save').trigger('dxclick');
        this.clock.tick(400);

        // check that file is renamed and we are still in the folder 'Folder 3'
        assert.strictEqual(this.wrapper.getInstance().option('currentPath'), 'Folder 3', 'currentPath option matches destination directory');
        assert.deepEqual(this.wrapper.getInstance().option('currentPathKeys'), ['Folder 3'], 'currentPathKeys option matches destination directory');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 3', 'destination folder should be selected');
        assert.strictEqual(this.wrapper.getDetailsItemName(0), 'File 1 renamed.txt', 'file renamed to another folder');

        assert.strictEqual(this.wrapper.getColumnCellsInDetailsView(2).length, 1, 'file count is correct');
        assert.strictEqual(this.wrapper.getDetailsItemName(0), 'File 1 renamed.txt', 'first file is the target file');
    });

    test('current directory must not be changed when all items not moved - events - try rename after operation (T1080473, T1132584)', function(assert) {
        const initialDirName = 'Folder 1';
        const fileName1 = 'File 1-1.txt';
        const fileName2 = 'File 1-2.jpg';
        const fileKey1 = `${initialDirName}/${fileName1}`;
        const fileKey2 = `${initialDirName}/${fileName2}`;
        const newFileName = 'File 1 renamed.txt';

        this.fileManager.option({
            currentPath: initialDirName,
            selectionMode: 'multiple',
            selectedItemKeys: [ fileKey1, fileKey2 ],
            onItemMoving: e => {
                e.cancel = true;
            }
        });
        this.clock.tick(400);

        // try moving selected files to the 'Folder 2'
        this.wrapper.getToolbarButton('Move to').trigger('dxclick');
        this.clock.tick(400);
        const $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(4).trigger('dxclick');
        this.wrapper.getDialogButton('Move').trigger('dxclick');
        this.clock.tick(400);

        // clear selection
        this.wrapper.getSelectAllCheckBox().trigger('dxclick');
        this.clock.tick(400);

        // renaming file 'File 1-1.txt'
        this.wrapper.getRowNameCellInDetailsView(1).trigger(CLICK_EVENT).click();
        this.wrapper.getRowNameCellInDetailsView(1).trigger(pointerEvents.down).trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogTextInput().val(newFileName).trigger('change');
        this.wrapper.getDialogButton('Save').trigger('dxclick');
        this.clock.tick(400);

        // check that no files have been moved and we are still in 'Folder 1'
        assert.strictEqual(this.wrapper.getInstance().option('currentPath'), initialDirName, 'currentPath option matches destination directory');
        assert.deepEqual(this.wrapper.getInstance().option('currentPathKeys'), [initialDirName], 'currentPathKeys option matches destination directory');
        assert.strictEqual(this.wrapper.getFocusedItemText(), initialDirName, 'initial folder should be selected');
        assert.strictEqual(this.fileManager.getCurrentDirectory().name, initialDirName, 'current folder is the initial folder');
        assert.strictEqual(this.wrapper.getDetailsItemName(0), newFileName, '1st file is still in the initial dir');
        assert.strictEqual(this.wrapper.getDetailsItemName(1), fileName2, '2nd file is still in the initial dir');
    });

    test('create folder from fast re-opened dialog (T1202022)', function(assert) {
        fx.off = false;
        this.wrapper.getToolbarButton('New directory').trigger('dxclick');
        this.clock.tick(400);

        $('.dx-overlay-shader').trigger('dxpointerdown');
        this.clock.tick(50);

        this.wrapper.getToolbarButton('New directory').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogButton('Create').trigger('dxclick');
        this.clock.tick(400);

        const $folderNode = this.wrapper.getFolderNode(4);
        assert.equal($folderNode.find('span').text(), 'Untitled directory', 'folder created');
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        fx.off = true;
    });

    test('rename item from fast re-opened dialog (T1202022)', function(assert) {
        fx.off = false;
        const newFileName = 'File 123.txt';

        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);

        $('.dx-overlay-shader').trigger('dxpointerdown');
        this.clock.tick(50);

        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogTextInput().val(newFileName).trigger('change');
        this.wrapper.getDialogButton('Save').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.strictEqual(this.wrapper.getDetailsItemName(0), newFileName, 'file is renamed');
        fx.off = true;
    });

    test('copy item from fast re-opened dialog (T1202022)', function(assert) {
        fx.off = false;

        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Copy to').trigger('dxclick');
        this.clock.tick(400);

        $('.dx-overlay-shader').trigger('dxpointerdown');
        this.clock.tick(50);

        this.wrapper.getToolbarButton('Copy to').trigger('dxclick');
        this.clock.tick(400);

        const $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger('dxclick');

        this.wrapper.getDialogButton('Copy').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 3', 'initial folder should be selected');
        assert.strictEqual(this.fileManager.getCurrentDirectory().name, 'Folder 3', 'current folder is the initial folder');
        assert.strictEqual(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'file copied');
        fx.off = true;
    });

    test('move item from fast re-opened dialog (T1202022)', function(assert) {
        fx.off = false;

        const $cell = this.wrapper.getRowNameCellInDetailsView(1);
        assert.equal(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'has target file');
        $cell.trigger(CLICK_EVENT).click();
        this.clock.tick(400);

        this.wrapper.getToolbarButton('Move to').trigger('dxclick');
        this.clock.tick(400);

        $('.dx-overlay-shader').trigger('dxpointerdown');
        this.clock.tick(50);

        this.wrapper.getToolbarButton('Move to').trigger('dxclick');
        this.clock.tick(400);

        const $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger('dxclick');

        this.wrapper.getDialogButton('Move').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 3', 'initial folder should be selected');
        assert.strictEqual(this.fileManager.getCurrentDirectory().name, 'Folder 3', 'current folder is the initial folder');
        assert.strictEqual(this.wrapper.getDetailsItemName(0), 'File 1.txt', 'file moved');
        fx.off = true;
    });
});
