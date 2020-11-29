import $ from 'jquery';
import renderer from 'core/renderer';
const { test } = QUnit;
import 'ui/file_manager';
import CustomFileSystemProvider from 'file_management/custom_provider';
import FileItemsController from 'ui/file_manager/file_items_controller';
import FileManagerBreadcrumbs from 'ui/file_manager/ui.file_manager.breadcrumbs';
import fx from 'animation/fx';
import { FileManagerWrapper, FileManagerBreadcrumbsWrapper, FileManagerProgressPanelWrapper, createTestFileSystem, createHugeFileSystem, Consts } from '../../../helpers/fileManagerHelpers.js';

const moduleConfig = {

    beforeEach: function() {
        const fileSystem = createTestFileSystem();

        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $('#fileManager').dxFileManager({
            fileSystemProvider: fileSystem,
            itemView: {
                mode: 'thumbnails'
            },
            permissions: {
                create: true,
                copy: true,
                move: true,
                delete: true,
                rename: true,
                upload: true
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
    }

};

const createBreadcrumbs = (context, controller) => {
    const $breadcrumbs = $('<div>').appendTo(context.$element);
    context.breadcrumbs = new FileManagerBreadcrumbs($breadcrumbs, {
        onCurrentDirectoryChanging: e => {
            controller.setCurrentDirectory(e.currentDirectory);
        }
    });
    context.clock.tick(400);

    context.breadcrumbsWrapper = new FileManagerBreadcrumbsWrapper($breadcrumbs);
};

const createFileProviderWithIncorrectName = (incorrectName, isOnlyNewItem) => {
    let fileProvider = [];
    const newItem = {
        name: incorrectName,
        isDirectory: true,
        items: [
            {
                name: 'About',
                isDirectory: true,
                items: []
            },
            {
                name: ' ',
                isDirectory: true,
                items: [
                    {
                        name: 'Folder inside',
                        isDirectory: true,
                        items: []
                    },
                    {
                        name: ' ',
                        isDirectory: true,
                        items: []
                    }
                ]
            },
            {
                name: 'File.txt',
                isDirectory: false,
                size: 3072000
            }
        ]
    };

    if(!isOnlyNewItem) {
        fileProvider = createTestFileSystem();
    }
    fileProvider.push(newItem);
    return fileProvider;
};

QUnit.module('Navigation operations', moduleConfig, () => {

    test('keep selection and expanded state during refresh', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files', 'breadcrumbs refrers to the root');

        let $folderToggle = this.wrapper.getFolderToggle(1);
        $folderToggle.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files', 'breadcrumbs refrers to the root');

        $folderToggle = this.wrapper.getFolderToggle(2);
        $folderToggle.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files', 'breadcrumbs refrers to the root');

        const $folderNode = this.wrapper.getFolderNode(2);
        $folderNode.trigger('dxclick');

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'descendant folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1/Folder 1.1', 'breadcrumbs refrers to the descendant folder');

        const $commandButton = this.wrapper.getToolbarButton('Refresh');
        $commandButton.trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'descendant folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1/Folder 1.1', 'breadcrumbs refrers to the descendant folder');
    });

    test('navigate by folders in item view', function(assert) {
        let $item = this.wrapper.findThumbnailsItem('Folder 1');
        $item.trigger('dxdblclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1', 'descendant folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1', 'breadcrumbs refrers to the descendant folder');

        $item = this.wrapper.findThumbnailsItem('Folder 1.1');
        $item.trigger('dxdblclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'descendant folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1/Folder 1.1', 'breadcrumbs refrers to the descendant folder');

        $item = this.wrapper.findThumbnailsItem('..');
        $item.trigger('dxdblclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1', 'descendant folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1', 'breadcrumbs refrers to the descendant folder');


        $item = this.wrapper.findThumbnailsItem('..');
        $item.trigger('dxdblclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files', 'breadcrumbs refrers to the root');
    });

    test('navigate by breadcrumbs items', function(assert) {
        const inst = this.wrapper.getInstance();
        inst.option('currentPath', 'Folder 1/Folder 1.1');
        this.clock.tick(800);

        this.wrapper.getBreadcrumbsItemByText('Folder 1').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1', 'parent folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1', 'breadcrumbs refrers to the parent folder');

        this.wrapper.getBreadcrumbsItemByText('Files').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files', 'breadcrumbs refrers to the root folder');
    });

    test('navigate by breadcrumbs parent directory item', function(assert) {
        const inst = this.wrapper.getInstance();
        inst.option('currentPath', 'Folder 1/Folder 1.1');
        this.clock.tick(800);

        this.wrapper.getBreadcrumbsParentDirectoryItem().trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1', 'parent folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1', 'breadcrumbs refrers to the parent folder');

        this.wrapper.getBreadcrumbsParentDirectoryItem().trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files', 'breadcrumbs refrers to the root folder');
    });

    test('getSelectedItems method', function(assert) {
        const testCases = [
            { mode: 'thumbnails', wrapperMethod: 'findThumbnailsItem', eventName: 'dxclick' },
            { mode: 'details', wrapperMethod: 'findDetailsItem', eventName: 'dxclick' }
        ];

        testCases.forEach(({ mode, wrapperMethod, eventName }) => {
            const inst = this.wrapper.getInstance();
            inst.option({
                itemView: { mode },
                selectedItemKeys: []
            });
            this.clock.tick(400);

            let items = inst.getSelectedItems();
            assert.strictEqual(items.length, 0, 'selected items count is valid');

            this.wrapper[wrapperMethod]('Folder 1').trigger(eventName);
            this.clock.tick(400);

            items = inst.getSelectedItems();
            assert.strictEqual(items.length, 1, 'selected items count is valid');
            assert.strictEqual(items[0].relativeName, 'Folder 1', 'item is in selection');
            assert.ok(items[0].isDirectory, 'directory selected');

            const e = $.Event(eventName);
            e.ctrlKey = true;
            this.wrapper[wrapperMethod]('File 2.jpg').trigger(e);
            this.clock.tick(400);

            items = inst.getSelectedItems();
            assert.strictEqual(items.length, 2, 'selected items count is valid');
            assert.strictEqual(items[0].relativeName, 'Folder 1', 'item is in selection');
            assert.ok(items[0].isDirectory, 'directory selected');
            assert.strictEqual(items[1].relativeName, 'File 2.jpg', 'item is in selection');
            assert.notOk(items[1].isDirectory, 'file selected');
        });
    });

    test('getCurrentDirectory method', function(assert) {
        const inst = this.wrapper.getInstance();
        let dir = inst.getCurrentDirectory();
        assert.strictEqual(dir.relativeName, '', 'directory has empty relative name');
        assert.ok(dir.isDirectory, 'directory has directory flag');
        assert.ok(dir.isRoot(), 'directory has root flag');

        inst.option('currentPath', 'Folder 1/Folder 1.1');
        this.clock.tick(800);

        dir = inst.getCurrentDirectory();
        assert.strictEqual(dir.relativeName, 'Folder 1/Folder 1.1', 'directory has correct relative name');
        assert.ok(dir.isDirectory, 'directory has directory flag');
        assert.notOk(dir.isRoot(), 'directory has not root flag');
    });

    test('change current directory by public API', function(assert) {
        const inst = this.wrapper.getInstance();
        const spy = sinon.spy();

        assert.equal(inst.option('currentPath'), '');

        inst.option('onCurrentDirectoryChanged', spy);
        inst.option('currentPath', 'Folder 1/Folder 1.1');
        this.clock.tick(800);

        assert.equal(spy.callCount, 1);
        assert.equal(spy.args[0][0].directory.path, 'Folder 1/Folder 1.1', 'directory passed as argument');
        assert.equal(inst.option('currentPath'), 'Folder 1/Folder 1.1', 'The option \'currentPath\' was changed');

        const $folder1Node = this.wrapper.getFolderNode(1);
        assert.equal($folder1Node.find('span').text(), 'Folder 1');

        const $folder11Node = this.wrapper.getFolderNode(2);
        assert.equal($folder11Node.find('span').text(), 'Folder 1.1');

        inst.option('currentPath', '');
        this.clock.tick(800);

        assert.equal(spy.callCount, 2);
        assert.equal(spy.args[1][0].directory.path, '', 'directory argument updated');
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files', 'breadcrumbs refrers to the root folder');
    });

    test('during navigation internal current directory updated only once', function(assert) {
        const inst = this.wrapper.getInstance();
        const setCurrentDirSpy = sinon.spy(inst._controller, 'setCurrentDirectory');

        this.wrapper.findThumbnailsItem('Folder 1').trigger('dxdblclick');
        this.clock.tick(400);

        assert.strictEqual(setCurrentDirSpy.callCount, 1, 'internal method called once');
    });

    test('change root file name by public API', function(assert) {
        let treeViewNode = this.wrapper.getFolderNodes();
        assert.equal(treeViewNode.length, 4, 'Everything right on its\' place');

        let breadcrumbs = this.wrapper.getBreadcrumbsPath();
        let target = this.wrapper.getFolderNodeText(0);
        assert.equal(breadcrumbs, 'Files', 'Default breadcrumbs text is correct');
        assert.equal(target, 'Files', 'Default is correct');

        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('rootFolderName', 'TestRFN');
        this.clock.tick(400);

        treeViewNode = this.wrapper.getFolderNodes();
        assert.equal(treeViewNode.length, 4, 'Everything right on its\' place');

        breadcrumbs = this.wrapper.getBreadcrumbsPath();
        target = this.wrapper.getFolderNodeText(0);
        assert.equal(breadcrumbs, 'TestRFN', 'Custom breadcrumbs text is correct');
        assert.equal(target, 'TestRFN', 'Custom is correct');
    });

    test('splitter should change width of dirs tree and file items areas', function(assert) {
        const originalFunc = renderer.fn.width;
        renderer.fn.width = () => 900;

        $('#fileManager').css('width', '900px');
        this.wrapper.getInstance().repaint();
        const fileManagerWidth = $('#fileManager').get(0).clientWidth;

        assert.ok(this.wrapper.getSplitter().length, 'Splitter was rendered');
        assert.ok(this.wrapper.isSplitterActive(), 'Splitter is active');

        let oldTreeViewWidth = this.wrapper.getDrawerPanelContent().get(0).clientWidth;
        let oldItemViewWidth = this.wrapper.getItemsPanel().get(0).clientWidth;
        this.wrapper.moveSplitter(100);
        assert.equal(this.wrapper.getDrawerPanelContent().get(0).clientWidth, oldTreeViewWidth + 100, 'Dirs tree has correct width');
        assert.equal(this.wrapper.getItemsPanel().get(0).clientWidth, oldItemViewWidth - 100, 'Item view has correct width');

        oldTreeViewWidth = this.wrapper.getDrawerPanelContent().get(0).clientWidth;
        oldItemViewWidth = this.wrapper.getItemsPanel().get(0).clientWidth;
        this.wrapper.moveSplitter(-200);
        assert.equal(this.wrapper.getDrawerPanelContent().get(0).clientWidth, oldTreeViewWidth - 200, 'Dirs tree has correct width');
        assert.equal(this.wrapper.getItemsPanel().get(0).clientWidth, oldItemViewWidth + 200, 'Item view has correct width');

        oldTreeViewWidth = this.wrapper.getDrawerPanelContent().get(0).clientWidth;
        oldItemViewWidth = this.wrapper.getItemsPanel().get(0).clientWidth;
        this.wrapper.moveSplitter(-oldTreeViewWidth * 2);
        assert.equal(this.wrapper.getDrawerPanelContent().get(0).clientWidth, 0, 'Dirs tree has correct width');
        assert.equal(this.wrapper.getItemsPanel().get(0).clientWidth, fileManagerWidth, 'Item view has correct width');

        const splitterWidth = this.wrapper.getSplitter().get(0).clientWidth;
        oldTreeViewWidth = this.wrapper.getDrawerPanelContent().get(0).clientWidth;
        oldItemViewWidth = this.wrapper.getItemsPanel().get(0).clientWidth;
        this.wrapper.moveSplitter(oldItemViewWidth * 2);
        assert.equal(this.wrapper.getDrawerPanelContent().get(0).clientWidth, fileManagerWidth - splitterWidth, 'Dirs tree has correct width');
        assert.equal(this.wrapper.getItemsPanel().get(0).clientWidth, splitterWidth, 'Item view has correct width');

        renderer.fn.width = originalFunc;
    });

    test('file items with the wrong extension is not shown', function(assert) {
        assert.strictEqual(this.wrapper.getThumbnailsItems().length, 6, 'all items are shown');

        this.wrapper.getInstance().option('allowedFileExtensions', ['.xml']);
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getThumbnailsItems().length, 4, 'only items with allow extensions are shown');
        assert.strictEqual(this.wrapper.getThumbnailsItemName(3), 'File 3.xml', 'item name has allowed extension');
    });

    test('slashes in directory name must be processed correctly', function(assert) {
        const incorrectName = 'Docu\\/me\\/nts';
        const fileProvider = createFileProviderWithIncorrectName(incorrectName);
        const controller = new FileItemsController({
            fileProvider,
            rootText: 'Files',
            currentPath: '',
            onSelectedDirectoryChanged: () => { this.breadcrumbs.setCurrentDirectory(controller.getCurrentDirectory()); }
        });

        createBreadcrumbs(this, controller);

        const rootDirectory = controller.getCurrentDirectory();
        controller
            .getDirectoryContents(rootDirectory)
            .then(items => {
                controller.setCurrentDirectory(items[6]);
                assert.equal(this.breadcrumbsWrapper.getPath(), 'Files/' + incorrectName, 'breadcrumbs refrers to the target folder');
            });
        this.clock.tick(400);

        controller
            .getDirectoryContents(controller.getCurrentDirectory())
            .then(items => {
                controller.setCurrentDirectory(items[0]);
                assert.equal(this.breadcrumbsWrapper.getPath(), 'Files/' + incorrectName + '/About', 'breadcrumbs refrers to the target folder');
            });
        this.clock.tick(400);

        this.breadcrumbsWrapper.getItemByText(incorrectName).trigger('dxclick');
        this.clock.tick(400);
        assert.equal(this.breadcrumbsWrapper.getPath(), 'Files/' + incorrectName, 'breadcrumbs refrers to the target folder');

        this.breadcrumbsWrapper.getItemByText('Files').trigger('dxclick');
        this.clock.tick(400);
        assert.equal(this.breadcrumbsWrapper.getPath(), 'Files', 'breadcrumbs refrers to the root folder');
    });

    test('whitespace as directory name must be processed correctly', function(assert) {
        const incorrectName = 'Docu\\/me\\/nts';
        const fileProvider = createFileProviderWithIncorrectName(incorrectName);
        const controller = new FileItemsController({
            fileProvider,
            rootText: 'Files',
            currentPath: '',
            onSelectedDirectoryChanged: () => { this.breadcrumbs.setCurrentDirectory(controller.getCurrentDirectory()); }
        });

        createBreadcrumbs(this, controller);

        const rootDirectory = controller.getCurrentDirectory();
        controller
            .getDirectoryContents(rootDirectory)
            .then(items => controller.getDirectoryContents(items[6]))
            .then(items => controller.getDirectoryContents(items[1]))
            .then(items => {
                controller.setCurrentDirectory(items[0]);
                assert.equal(this.breadcrumbsWrapper.getPath(), 'Files/' + incorrectName + '/ /Folder inside', 'breadcrumbs refrers to the target folder');
            });
        this.clock.tick(400);

        this.breadcrumbsWrapper.getItemByText(' ').trigger('dxclick');
        this.clock.tick(400);
        assert.equal(this.breadcrumbsWrapper.getPath(), 'Files/' + incorrectName + '/ ', 'breadcrumbs refrers to the target folder');

        controller
            .getDirectoryContents(rootDirectory)
            .then(items => controller.getDirectoryContents(items[6]))
            .then(items => controller.getDirectoryContents(items[1]))
            .then(items => {
                controller.setCurrentDirectory(items[1]);
                assert.equal(this.breadcrumbsWrapper.getPath(), 'Files/' + incorrectName + '/ / ', 'breadcrumbs refrers to the target folder');
            });
        this.clock.tick(400);

        this.breadcrumbsWrapper.getParentDirectoryItem().trigger('dxclick');
        this.clock.tick(400);
        assert.equal(this.breadcrumbsWrapper.getPath(), 'Files/' + incorrectName + '/ ', 'breadcrumbs refrers to the target folder');
    });

    test('special symbols in \'currentPath\' option must be processed correctly', function(assert) {
        const inst = this.wrapper.getInstance();
        const incorrectOptionValue = 'Docu//me//nts';
        const incorrectName = 'Docu/me/nts';
        const fileProvider = createFileProviderWithIncorrectName(incorrectName);
        inst.option('fileSystemProvider', fileProvider);

        let counter = 0;
        inst.option('onOptionChanged', (e) => { e.name === 'currentPath' && counter++; });

        inst.option('currentPath', incorrectOptionValue);
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), incorrectName, 'target folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/' + incorrectName, 'breadcrumbs refrers to the target folder');
        assert.equal(inst.option('currentPath'), incorrectOptionValue, 'currentPath option is correct');
        assert.equal(counter, 1, 'setCurrentPath() called once');

        inst.option('currentPath', incorrectOptionValue + '/About');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'About', 'target folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/' + incorrectName + '/About', 'breadcrumbs refrers to the target folder');
        assert.equal(inst.option('currentPath'), incorrectOptionValue + '/About', 'currentPath option is correct');
        assert.equal(counter, 2, 'setCurrentPath() called once');

        inst.option('currentPath', incorrectOptionValue + '/ ');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), ' ', 'target folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/' + incorrectName + '/ ', 'breadcrumbs refrers to the target folder');
        assert.equal(inst.option('currentPath'), incorrectOptionValue + '/ ', 'currentPath option is correct');
        assert.equal(counter, 3, 'setCurrentPath() called once');

        inst.option('currentPath', incorrectOptionValue + '/ / ');
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), ' ', 'target folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/' + incorrectName + '/ / ', 'breadcrumbs refrers to the target folder');
        assert.equal(inst.option('currentPath'), incorrectOptionValue + '/ / ', 'currentPath option is correct');
        assert.equal(counter, 4, 'setCurrentPath() called once');

        inst.option('currentPath', inst.option('currentPath'));
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), ' ', 'target folder has not changed');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/' + incorrectName + '/ / ', 'breadcrumbs has not changed');
        assert.equal(inst.option('currentPath'), incorrectOptionValue + '/ / ', 'currentPath option has not changed');
        assert.equal(counter, 4, 'setCurrentPath() was not call');

        assert.equal(inst.getCurrentDirectory().relativeName, incorrectName + '/ / ');
    });

    test('triple slash in \'currentPath\' option must be processed correctly', function(assert) {
        const inst = this.wrapper.getInstance();
        const incorrectOptionValue = 'Docu///About';
        const incorrectName = 'Docu/me/nts';
        const incorrectPartialName = 'Docu/';
        let fileProvider = createFileProviderWithIncorrectName(incorrectName);
        fileProvider = fileProvider.concat(createFileProviderWithIncorrectName(incorrectPartialName, true));
        inst.option('fileSystemProvider', fileProvider);

        inst.option('currentPath', incorrectOptionValue);
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), 'About', 'target folder selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/' + incorrectPartialName + '/About', 'breadcrumbs refrers to the target folder');
        assert.equal(inst.option('currentPath'), incorrectOptionValue, 'currentPath option is correct');
    });

    test('navigating deep via \'currentPath\' option must be processed correctly', function(assert) {
        const longPath = 'Folder 1/Folder 1.1/Folder 1.1.1/Folder 1.1.1.1/Folder 1.1.1.1.1';
        this.wrapper.getInstance().option('itemView.mode', 'details');
        this.wrapper.getInstance().option('currentPath', longPath);
        this.clock.tick(1200);
        assert.equal(this.wrapper.getFocusedItemText(), 'Folder 1.1.1.1.1', 'Target folder is selected');
        assert.equal(this.wrapper.getBreadcrumbsPath(), 'Files/' + longPath, 'breadcrumbs refrers to the target folder');
        assert.equal(this.wrapper.getDetailsItemName(1), 'Special deep file.txt', 'has specail file');
    });

    test('\'Back\' directory must have attributes of the represented directory', function(assert) {
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            fileSystemProvider: [
                {
                    name: 'Folder 1',
                    isDirectory: true,
                    items: [],
                    dateModified: '16/06/2018'
                }
            ],
            itemView: {
                showParentFolder: true
            }
        });
        this.clock.tick(400);

        fileManager._getItemViewItems()
            .then(fileInfos => {
                const parentFolder = fileInfos[0];
                const parentDate = parentFolder.fileItem.dateModified;
                fileManager.option('currentPath', 'Folder 1');
                this.clock.tick(400);
                fileManager._getItemViewItems()
                    .then(fileInfos => {
                        const targetFolder = fileInfos[0];
                        assert.ok(targetFolder.fileItem.isParentFolder, 'The target folder is \'back\' directory');
                        assert.notOk(parentFolder.fileItem.isParentFolder, 'The parent folder regular directory');
                        assert.equal(targetFolder.fileItem.dateModified, parentDate, 'The date is correct');
                    });
            });
    });

    test('navigate via \'currentPathKeys\' option updating', function(assert) {
        const optionChangedSpy = sinon.spy();
        const dirChangedSpy = sinon.spy();
        const pathKeys = [ 'Folder 1', 'Folder 1/Folder 1.1' ];

        assert.deepEqual(this.fileManager.option('currentPathKeys'), [], 'initial value correct');

        this.fileManager.option({
            onCurrentDirectoryChanged: dirChangedSpy,
            onOptionChanged: optionChangedSpy,
            currentPathKeys: pathKeys
        });
        this.clock.tick(800);

        assert.strictEqual(dirChangedSpy.callCount, 1, 'directory changed event raised');
        assert.strictEqual(dirChangedSpy.args[0][0].directory.path, 'Folder 1/Folder 1.1', 'directory passed as argument');
        assert.deepEqual(this.fileManager.option('currentPathKeys'), pathKeys, 'The option \'currentPathKeys\' was changed');
        assert.strictEqual(optionChangedSpy.callCount, 2, 'option changed event raised');
        assert.strictEqual(optionChangedSpy.args[1][0].name, 'currentPath', 'current path option changed');
        assert.strictEqual(optionChangedSpy.args[1][0].value, 'Folder 1/Folder 1.1', 'current path option value updated');

        const $folder1Node = this.wrapper.getFolderNode(1);
        assert.strictEqual($folder1Node.find('span').text(), 'Folder 1');

        const $folder11Node = this.wrapper.getFolderNode(2);
        assert.strictEqual($folder11Node.find('span').text(), 'Folder 1.1');

        this.fileManager.option('currentPathKeys', []);
        this.clock.tick(800);

        assert.strictEqual(dirChangedSpy.callCount, 2, 'directory changed event raised');
        assert.strictEqual(dirChangedSpy.args[1][0].directory.path, '', 'directory argument updated');
        assert.strictEqual(this.fileManager.option('currentPath'), '', 'The option \'currentPath\' was changed');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files', 'breadcrumbs refrers to the root folder');
        assert.strictEqual(optionChangedSpy.callCount, 4, 'option changed event raised');
        assert.strictEqual(optionChangedSpy.args[3][0].name, 'currentPath', 'current path option changed');
        assert.strictEqual(optionChangedSpy.args[3][0].value, '', 'current path option value updated');
    });

    test('navigate via \'currentPathKeys\' option on init', function(assert) {
        const optionChangedSpy = sinon.spy();

        this.$element.dxFileManager({
            onOptionChanged: optionChangedSpy,
            currentPathKeys: [ 'Folder 1', 'Folder 1/Folder 1.1' ],
        });
        this.clock.tick(800);

        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'Target folder is selected');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1/Folder 1.1', 'breadcrumbs refrers to the target folder');
        assert.strictEqual(optionChangedSpy.callCount, 3, 'option changed event raised');
        assert.strictEqual(optionChangedSpy.args[0][0].name, 'onOptionChanged', 'onOptionChanged option changed');
        assert.strictEqual(optionChangedSpy.args[1][0].name, 'currentPathKeys', 'currentPathKeys option changed');
        assert.strictEqual(optionChangedSpy.args[2][0].name, 'currentPath', 'currentPath option changed');
        assert.strictEqual(optionChangedSpy.args[2][0].value, 'Folder 1/Folder 1.1', 'currentPath option updated');
    });

    test('Details view - navigation by double click doesn\'t focus parent folder', function(assert) {
        this.fileManager.option({
            itemView: {
                mode: 'details'
            }
        });
        this.clock.tick(400);

        let $cell = this.wrapper.getRowNameCellInDetailsView(3);
        $cell.trigger('dxdblclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsItemName(0), '..', 'parent folder shown');
        assert.notOk(this.wrapper.isDetailsRowSelected(0), 'item not selected');
        assert.notOk(this.wrapper.isDetailsRowFocused(0), 'item not focused');

        $cell = this.wrapper.getRowNameCellInDetailsView(1);
        $cell.trigger('dxdblclick');
        this.clock.tick(400);

        assert.notOk(this.wrapper.isDetailsRowSelected(3), 'item not selected');
        assert.ok(this.wrapper.isDetailsRowFocused(3), 'item focused');
    });

    test('Thumbnails view - navigation by double click doesn\'t focus parent folder', function(assert) {
        const itemName = 'Folder 3';

        let $item = this.wrapper.findThumbnailsItem(itemName);
        $item.trigger('dxdblclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getThumbnailsItemName(0), '..', 'parent folder shown');
        assert.notOk(this.wrapper.isThumbnailsItemSelected('..'), 'item not selected');
        assert.notOk(this.wrapper.isThumbnailsItemFocused('..'), 'item not focused');

        $item = this.wrapper.findThumbnailsItem('..');
        $item.trigger('dxdblclick');
        this.clock.tick(400);

        assert.notOk(this.wrapper.isThumbnailsItemSelected(itemName), 'item not selected');
        assert.ok(this.wrapper.isThumbnailsItemFocused(itemName), 'item focused');
    });

    test('Details view - must keep scroll position', function(assert) {
        this.fileManager.option({
            width: 500,
            height: 250,
            fileSystemProvider: createHugeFileSystem(),
            itemView: {
                mode: 'details'
            }
        });
        this.clock.tick(400);

        const scrollPosition = 100;
        this.wrapper.getDetailsViewScrollableContainer().scrollTop(scrollPosition);
        this.clock.tick(400);

        this.fileManager.refresh();
        this.clock.tick(800);

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), scrollPosition, 'scroll position is the same');
    });

    test('Thumbnails view - must keep scroll position', function(assert) {
        const originalFunc = renderer.fn.width;
        renderer.fn.width = () => 1200;

        this.fileManager.option({
            width: 500,
            height: 250,
            fileSystemProvider: createHugeFileSystem()
        });
        this.clock.tick(400);

        const scrollPosition = 150;
        this.wrapper.getThumbnailsViewScrollableContainer().scrollTop(scrollPosition);
        this.clock.tick(400);

        this.fileManager.refresh();
        this.clock.tick(800);

        assert.strictEqual(this.wrapper.getThumbnailsViewScrollableContainer().scrollTop(), scrollPosition, 'scroll position is the same');

        renderer.fn.width = originalFunc;
    });

    test('All views - must keep scroll position for sync focused item', function(assert) {
        // focus item in thumbnails and remember its scroll position
        this.fileManager.option('fileSystemProvider', createHugeFileSystem());
        this.clock.tick(400);

        this.wrapper.findThumbnailsItem('Folder 0').trigger('dxpointerdown');
        this.clock.tick(400);
        this.wrapper.getThumbnailsViewPort().trigger($.Event('keydown', { key: 'PageDown' }));
        this.clock.tick(400);

        const thumbnailsScrollPosition = this.wrapper.getThumbnailsViewScrollableContainer().scrollTop();

        // switch to details and remember scroll position
        this.wrapper.getToolbarDropDownButton().find(`.${Consts.BUTTON_CLASS}`).trigger('dxclick');
        this.clock.tick(400);
        let detailsViewSelector = this.wrapper.getToolbarViewSwitcherListItem(0);
        $(detailsViewSelector).trigger('dxclick');
        this.clock.tick(400);

        const detailsScrollPosition = this.wrapper.getDetailsViewScrollableContainer().scrollTop();

        // switch to thumbnails and check scroll position
        this.wrapper.getToolbarDropDownButton().find(`.${Consts.BUTTON_CLASS}`).trigger('dxclick');
        this.clock.tick(400);
        const thumbnailsViewSelector = this.wrapper.getToolbarViewSwitcherListItem(1);
        $(thumbnailsViewSelector).trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getThumbnailsViewScrollableContainer().scrollTop(), thumbnailsScrollPosition, 'thumbnails scroll position is the same');

        // switch to details and check scroll position
        this.wrapper.getToolbarDropDownButton().find(`.${Consts.BUTTON_CLASS}`).trigger('dxclick');
        this.clock.tick(400);
        detailsViewSelector = this.wrapper.getToolbarViewSwitcherListItem(0);
        $(detailsViewSelector).trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDetailsViewScrollableContainer().scrollTop(), detailsScrollPosition, 'details scroll position is the same');
    });

    test('Navigation to forbidden folder rises an error', function(assert) {
        this.fileManager.option('fileSystemProvider',
            new CustomFileSystemProvider({
                getItems: pathInfo => {
                    if(pathInfo.path === '') {
                        return [{ name: 'Folder', isDirectory: 'true' }];
                    } else {
                        throw new Error('Error');
                    }
                }
            }));
        this.clock.tick(400);

        this.wrapper.findThumbnailsItem('Folder').trigger('dxdblclick');
        this.clock.tick(400);

        const infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 1, 'There is one notification on panel');

        assert.strictEqual(infos[0].common.commonText, 'The directory cannot be opened', 'Title is correct');

        const details = infos[0].details;
        assert.strictEqual(details.length, 1, 'Notification has one details section');

        assert.strictEqual(details[0].commonText, 'Folder', 'Common text is correct');
        assert.strictEqual(details[0].errorText, 'Unspecified error.', 'Error text is correct');

        assert.strictEqual(this.wrapper.getThumbnailsItems().length, 1);
        assert.strictEqual(this.wrapper.getThumbnailsItemName(0), 'Folder', 'The only item is shown');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files', 'Breadcrumbs has correct path');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Files', 'Root folder selected');
        assert.strictEqual(this.fileManager.getCurrentDirectory().path, '', 'Current directory is root');
        assert.strictEqual(this.fileManager.option('currentPath'), '', 'Current path is correct');
    });

    test('Forbiddance of current folder and refresh leads to navigating up and rising an error', function(assert) {
        const provider = new CustomFileSystemProvider({
            getItems: function(pathInfo) {
                if(pathInfo.path === '') {
                    return [{ name: 'Folder', isDirectory: 'true' }];
                } else if(pathInfo.path === 'Folder' && !this.forbidAll) {
                    return [{ name: 'Subfolder', isDirectory: 'true' }];
                } else if(pathInfo.path === 'Folder/Subfolder' && !this.forbidAll) {
                    return [];
                } else {
                    throw new Error('Error');
                }
            }
        });

        this.fileManager.option('fileSystemProvider', provider);
        this.clock.tick(400);

        this.wrapper.findThumbnailsItem('Folder').trigger('dxdblclick');
        this.clock.tick(400);

        let infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 0, 'No notifications');

        this.wrapper.findThumbnailsItem('Subfolder').trigger('dxdblclick');
        this.clock.tick(400);

        infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 0, 'No notifications');

        provider.forbidAll = true;
        this.wrapper.getToolbarButton('Refresh').trigger('dxclick');
        this.clock.tick(700);

        infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 2, 'There is some notification on panel');

        assert.strictEqual(infos[0].common.commonText, 'The directory cannot be opened', 'Title is correct');

        const details = infos[0].details;
        assert.strictEqual(details.length, 1, 'Notification has one details section');

        assert.strictEqual(details[0].commonText, 'Folder', 'Common text is correct');
        assert.strictEqual(details[0].errorText, 'Unspecified error.', 'Error text is correct');

        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files', 'Breadcrumbs has correct path');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Files', 'Root folder selected');
        assert.strictEqual(this.fileManager.getCurrentDirectory().path, '', 'Current directory is root');
        assert.strictEqual(this.fileManager.option('currentPath'), '', 'Current path is correct');
    });

    test('Expanding forbidden treeview node leads to rising an error and no navigating up', function(assert) {
        this.fileManager.option('fileSystemProvider',
            new CustomFileSystemProvider({
                getItems: pathInfo => {
                    if(pathInfo.path === '') {
                        return [{ name: 'Folder', isDirectory: 'true' }, { name: 'Other folder', isDirectory: 'true' }];
                    } else if(pathInfo.path === 'Folder') {
                        return [{ name: 'Subfolder', isDirectory: 'true' }];
                    } else {
                        throw new Error('Error');
                    }
                }
            }));
        this.clock.tick(400);

        this.wrapper.findThumbnailsItem('Folder').trigger('dxdblclick');
        this.clock.tick(400);

        let infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 0, 'No notifications');

        this.wrapper.getFolderToggles().last().trigger('dxclick');
        this.clock.tick(400);

        infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 1, 'There is one notification on panel');

        assert.strictEqual(infos[0].common.commonText, 'The directory cannot be opened', 'Title is correct');

        const details = infos[0].details;
        assert.strictEqual(details.length, 1, 'Notification has one details section');

        assert.strictEqual(details[0].commonText, 'Other folder', 'Common text is correct');
        assert.strictEqual(details[0].errorText, 'Unspecified error.', 'Error text is correct');

        assert.strictEqual(this.wrapper.getThumbnailsItems().length, 2);
        assert.strictEqual(this.wrapper.getThumbnailsItemName(0), '..', 'The parent folder item is shown');
        assert.strictEqual(this.wrapper.getThumbnailsItemName(1), 'Subfolder', 'The subfolder item is shown');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/Folder', 'Breadcrumbs has correct path');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder', 'Root folder selected');
        assert.strictEqual(this.fileManager.getCurrentDirectory().path, 'Folder', 'Current directory is root');
        assert.strictEqual(this.fileManager.option('currentPath'), 'Folder', 'Current path is correct');
    });

    test('When current folder not found and refresh then an error rises without navigating up', function(assert) {
        const changeableFolder = { name: 'Folder', isDirectory: 'true' };
        this.fileManager.option('fileSystemProvider',
            new CustomFileSystemProvider({
                getItems: pathInfo => {
                    if(pathInfo.path === '') {
                        return [changeableFolder];
                    } else if(pathInfo.path === 'Folder') {
                        return [{ name: 'Subfolder', isDirectory: 'true' }];
                    } else if(pathInfo.path === 'Folder/Subfolder') {
                        return [];
                    } else {
                        throw new Error('Error');
                    }
                }
            }));
        this.clock.tick(400);

        this.wrapper.findThumbnailsItem('Folder').trigger('dxdblclick');
        this.clock.tick(400);

        let infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 0, 'No notifications');

        this.wrapper.findThumbnailsItem('Subfolder').trigger('dxdblclick');
        this.clock.tick(400);

        infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 0, 'No notifications');

        changeableFolder.name = 'Folder1';
        this.wrapper.getToolbarButton('Refresh').trigger('dxclick');
        this.clock.tick(400);

        infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 0, 'No notifications');

        assert.strictEqual(this.wrapper.getThumbnailsItems().length, 1);
        assert.strictEqual(this.wrapper.getThumbnailsItemName(0), 'Folder1', 'The only item is shown');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files', 'Breadcrumbs has correct path');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Files', 'Root folder selected');
        assert.strictEqual(this.fileManager.getCurrentDirectory().path, '', 'Current directory is root');
        assert.strictEqual(this.fileManager.option('currentPath'), '', 'Current path is correct');
    });

    test('Repaint at non-root level without jQuery does not lead to js errors (T931481)', function(assert) {
        const folderName = 'Folder 1';

        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Files', 'root folder is focused after init');

        this.fileManager.option('currentPath', folderName);
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getFocusedItemText(), folderName, 'current folder is focused');

        this.fileManager.repaint();
        this.clock.tick(800);

        assert.strictEqual(this.wrapper.getFocusedItemText(), folderName, 'current folder is still focused');
    });
});
