import $ from 'jquery';
const { test } = QUnit;
import 'ui/file_manager';
import FileSystemError from 'file_management/error.js';
import CustomFileSystemProvider from 'file_management/custom_provider';
import ObjectFileSystemProvider from 'file_management/object_provider.js';
import { FileItemsController } from 'ui/file_manager/file_items_controller';
import FileManagerBreadcrumbs from 'ui/file_manager/ui.file_manager.breadcrumbs';
import fx from 'common/core/animation/fx';
import { FileManagerWrapper, FileManagerBreadcrumbsWrapper, FileManagerProgressPanelWrapper, createTestFileSystem } from '../../../helpers/fileManagerHelpers.js';
import SlowFileProvider from '../../../helpers/fileManager/file_provider.slow.js';
import { implementationsMap } from 'core/utils/size';
import { Deferred } from 'core/utils/deferred';
import { extend } from 'core/utils/extend';

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

const moduleConfig_T1085224 = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
        this.$element = $('#fileManager');
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

const createFileManager_T1085224 = (context, useThumbnailViewMode, extOptions) => {
    const provider = new CustomFileSystemProvider({
        getItems: () => { throw new FileSystemError(42, null, 'Custom text'); }
    });
    const getItemsSpy = sinon.spy(provider, 'getItems');
    const viewMode = useThumbnailViewMode ? 'thumbnails' : 'details';
    extOptions = extOptions || {};
    const options = extend({
        fileSystemProvider: provider,
        itemView: {
            mode: viewMode
        }
    }, extOptions);
    const fileManager = $('#fileManager').dxFileManager(options).dxFileManager('instance');
    context.clock.tick(400);
    return { fileManager, getItemsSpy };
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
        const originalFunc = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 900;

        $('#fileManager').css('width', '900px');
        this.wrapper.getInstance().repaint();
        const fileManagerWidth = $('#fileManager').get(0).clientWidth;

        assert.ok(this.wrapper.getSplitter().length, 'Splitter was rendered');
        assert.ok(this.wrapper.isSplitterActive(), 'Splitter is active');

        let oldTreeViewWidth = this.wrapper.getNavPaneDrawerPanelContent().get(0).clientWidth;
        let oldItemViewWidth = this.wrapper.getItemsPanel().get(0).clientWidth;
        this.wrapper.moveSplitter(100);
        assert.equal(this.wrapper.getNavPaneDrawerPanelContent().get(0).clientWidth, oldTreeViewWidth + 100, 'Dirs tree has correct width');
        assert.equal(this.wrapper.getItemsPanel().get(0).clientWidth, oldItemViewWidth - 100, 'Item view has correct width');

        oldTreeViewWidth = this.wrapper.getNavPaneDrawerPanelContent().get(0).clientWidth;
        oldItemViewWidth = this.wrapper.getItemsPanel().get(0).clientWidth;
        this.wrapper.moveSplitter(-200);
        assert.equal(this.wrapper.getNavPaneDrawerPanelContent().get(0).clientWidth, oldTreeViewWidth - 200, 'Dirs tree has correct width');
        assert.equal(this.wrapper.getItemsPanel().get(0).clientWidth, oldItemViewWidth + 200, 'Item view has correct width');

        oldTreeViewWidth = this.wrapper.getNavPaneDrawerPanelContent().get(0).clientWidth;
        oldItemViewWidth = this.wrapper.getItemsPanel().get(0).clientWidth;
        this.wrapper.moveSplitter(-oldTreeViewWidth * 2);
        assert.equal(this.wrapper.getNavPaneDrawerPanelContent().get(0).clientWidth, 0, 'Dirs tree has correct width');
        assert.equal(this.wrapper.getItemsPanel().get(0).clientWidth, fileManagerWidth, 'Item view has correct width');

        const splitterWidth = this.wrapper.getSplitter().get(0).clientWidth;
        oldTreeViewWidth = this.wrapper.getNavPaneDrawerPanelContent().get(0).clientWidth;
        oldItemViewWidth = this.wrapper.getItemsPanel().get(0).clientWidth;
        this.wrapper.moveSplitter(oldItemViewWidth * 2);
        assert.equal(this.wrapper.getNavPaneDrawerPanelContent().get(0).clientWidth, fileManagerWidth - splitterWidth, 'Dirs tree has correct width');
        assert.equal(this.wrapper.getItemsPanel().get(0).clientWidth, splitterWidth, 'Item view has correct width');

        implementationsMap.getWidth = originalFunc;
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
        this.wrapper.getToolbarRefreshButton().trigger('dxclick');
        this.clock.tick(700);

        infos = this.progressPanelWrapper.getInfos();
        assert.ok(infos.length > 0, 'There is some notification on panel');

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
        this.wrapper.getToolbarRefreshButton().trigger('dxclick');
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

    test('errorText can be customized on the getItems', function(assert) {
        const customMessage = 'Custom error message';
        this.fileManager.option({
            fileSystemProvider: new CustomFileSystemProvider({
                getItems: () => { throw new FileSystemError(0, null, customMessage); }
            })
        });
        this.clock.tick(400);

        const info = this.progressPanelWrapper.getInfos()[0];
        const common = info.common;
        const details = info.details[0];
        assert.notOk(common.hasError, 'error rendered');
        assert.equal(common.commonText, 'The directory cannot be opened', 'common text rendered');
        assert.notOk(common.$progressBar.length, 'progress bar not rendered');
        assert.ok(common.closeButtonVisible, 'close button visible');

        assert.ok(details.hasError, 'error rendered');
        assert.equal(details.errorText, customMessage, 'details error text rendered');
    });

    test('repaint method does not call data loading', function(assert) {
        const getItemsStub = sinon.stub();
        this.fileManager.option({
            fileSystemProvider: new CustomFileSystemProvider({
                getItems: getItemsStub
            })
        });
        this.clock.tick(400);
        getItemsStub.reset();

        this.fileManager.repaint();
        this.clock.tick(400);

        assert.ok(getItemsStub.notCalled, 'getItems method was not called');
    });

    test('currentPathKeys option has correct value with nameExpr and keyExpr (T988286)', function(assert) {
        this.fileManager.option('fileSystemProvider', {
            data: [
                {
                    title: 'Folder 1',
                    id: 'dir-1',
                    isDirectory: true,
                    items: [
                        {
                            title: 'Folder 1.1',
                            id: 'dir-1.1',
                            isDirectory: true
                        }
                    ]
                }
            ],
            nameExpr: 'title',
            keyExpr: 'id'
        });
        this.clock.tick(400);

        let currentPathKeys = this.fileManager.option('currentPathKeys');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files', 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, '', 'Current directory is root');
        assert.strictEqual(currentPathKeys.length, 0, 'Current path keys has correct size');

        this.wrapper.findThumbnailsItem('Folder 1').trigger('dxdblclick');
        this.clock.tick(400);

        currentPathKeys = this.fileManager.option('currentPathKeys');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1', 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, 'dir-1', 'Current directory is Folder 1');
        assert.strictEqual(currentPathKeys.length, 1, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], 'dir-1', 'Current path keys are correct');

        this.wrapper.findThumbnailsItem('Folder 1.1').trigger('dxdblclick');
        this.clock.tick(400);

        currentPathKeys = this.fileManager.option('currentPathKeys');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1/Folder 1.1', 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, 'dir-1.1', 'Current directory is Folder 1.1');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], 'dir-1');
        assert.strictEqual(currentPathKeys[1], 'dir-1.1', 'Current path keys are correct');
    });

    test('currentPath option value resets when provider is changed (T1045617)', function(assert) {
        const targetPath = 'Folder 1/Folder 1.1';

        this.fileManager.option('currentPath', targetPath);
        this.clock.tick(400);

        let currentPath = this.fileManager.option('currentPath');
        let currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, targetPath, 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], targetPath.split('/')[0], 'Current path keys [0] is correct');
        assert.strictEqual(currentPathKeys[1], targetPath, 'Current path keys [1] is correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/' + targetPath, 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, targetPath, 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 6, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'NavPane current folder text is correct');

        this.fileManager.option('fileSystemProvider', [
            {
                name: 'Directory1',
                isDirectory: true,
                hasSubDirectories: true,
                items: [
                    {
                        title: 'Directory11',
                        isDirectory: true,
                        hasSubDirectories: false,
                        items: []
                    }
                ]
            }
        ]);
        this.clock.tick(400);

        currentPath = this.fileManager.option('currentPath');
        currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, '', 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 0, 'Current path keys has correct size');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files', 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, '', 'Current directory is root');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 2, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Files', 'NavPane current folder text is correct');
    });

    test('currentPath option value can be changed along with the fileSystemProvider option (T1045617)', function(assert) {
        let targetPath = 'Folder 1/Folder 1.1';

        this.fileManager.option({
            currentPath: targetPath,
            itemView: { mode: 'details' }
        });
        this.clock.tick(400);

        let currentPath = this.fileManager.option('currentPath');
        let currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, targetPath, 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], targetPath.split('/')[0], 'Current path keys [0] is correct');
        assert.strictEqual(currentPathKeys[1], targetPath, 'Current path keys [1] is correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/' + targetPath, 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, targetPath, 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 6, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'NavPane current folder text is correct');

        targetPath = 'Directory1/Directory11';
        this.fileManager.option({
            fileSystemProvider: [
                {
                    name: 'Directory1',
                    isDirectory: true,
                    hasSubDirectories: true,
                    items: [
                        {
                            name: 'Directory11',
                            isDirectory: true,
                            hasSubDirectories: false,
                            items: []
                        }
                    ]
                }
            ],
            currentPath: targetPath
        });
        this.clock.tick(400);

        currentPath = this.fileManager.option('currentPath');
        currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, targetPath, 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], targetPath.split('/')[0], 'Current path keys [0] is correct');
        assert.strictEqual(currentPathKeys[1], targetPath, 'Current path keys [1] is correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/' + targetPath, 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, targetPath, 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 3, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Directory11', 'NavPane current folder text is correct');
    });

    test('fileSystemProvider option value can be changed along with the currentPath option (T1045617)', function(assert) {
        let targetPath = 'Folder 1/Folder 1.1';

        this.fileManager.option({
            currentPath: targetPath,
            itemView: { mode: 'details' }
        });
        this.clock.tick(400);

        let currentPath = this.fileManager.option('currentPath');
        let currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, targetPath, 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], targetPath.split('/')[0], 'Current path keys [0] is correct');
        assert.strictEqual(currentPathKeys[1], targetPath, 'Current path keys [1] is correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/' + targetPath, 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, targetPath, 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 6, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'NavPane current folder text is correct');

        targetPath = 'Directory1/Directory11';
        this.fileManager.option({
            currentPath: targetPath,
            fileSystemProvider: [
                {
                    name: 'Directory1',
                    isDirectory: true,
                    hasSubDirectories: true,
                    items: [
                        {
                            name: 'Directory11',
                            isDirectory: true,
                            hasSubDirectories: false,
                            items: []
                        }
                    ]
                }
            ]
        });
        this.clock.tick(400);

        currentPath = this.fileManager.option('currentPath');
        currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, targetPath, 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], targetPath.split('/')[0], 'Current path keys [0] is correct');
        assert.strictEqual(currentPathKeys[1], targetPath, 'Current path keys [1] is correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/' + targetPath, 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, targetPath, 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 3, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Directory11', 'NavPane current folder text is correct');
    });

    test('currentPath option value stays the same when changed along with the fileSystemProvider option (T1045617)', function(assert) {
        const targetPath = 'Folder 1/Folder 1.1';

        this.fileManager.option({
            currentPath: targetPath,
            itemView: { mode: 'details' }
        });
        this.clock.tick(400);

        let currentPath = this.fileManager.option('currentPath');
        let currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, targetPath, 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], targetPath.split('/')[0], 'Current path keys [0] is correct');
        assert.strictEqual(currentPathKeys[1], targetPath, 'Current path keys [1] is correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/' + targetPath, 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, targetPath, 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 6, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'NavPane current folder text is correct');

        this.fileManager.option({
            fileSystemProvider: [
                {
                    name: 'Folder 1',
                    isDirectory: true,
                    hasSubDirectories: true,
                    items: [
                        {
                            name: 'Folder 1.1',
                            isDirectory: true,
                            hasSubDirectories: false,
                            items: []
                        }
                    ]
                }
            ],
            currentPath: targetPath
        });
        this.clock.tick(500);

        currentPath = this.fileManager.option('currentPath');
        currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, targetPath, 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], targetPath.split('/')[0], 'Current path keys [0] is correct');
        assert.strictEqual(currentPathKeys[1], targetPath, 'Current path keys [1] is correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/' + targetPath, 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, targetPath, 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 3, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'NavPane current folder text is correct');
    });

    test('currentPath option value stays the same when fileSystemProvider option value set along with the currentPath option (T1045617)', function(assert) {
        const targetPath = 'Folder 1/Folder 1.1';

        this.fileManager.option({
            currentPath: targetPath,
            itemView: { mode: 'details' }
        });
        this.clock.tick(400);

        let currentPath = this.fileManager.option('currentPath');
        let currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, targetPath, 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], targetPath.split('/')[0], 'Current path keys [0] is correct');
        assert.strictEqual(currentPathKeys[1], targetPath, 'Current path keys [1] is correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/' + targetPath, 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, targetPath, 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 6, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'NavPane current folder text is correct');

        this.fileManager.option({
            currentPath: targetPath,
            fileSystemProvider: [
                {
                    name: 'Folder 1',
                    isDirectory: true,
                    hasSubDirectories: true,
                    items: [
                        {
                            name: 'Folder 1.1',
                            isDirectory: true,
                            hasSubDirectories: false,
                            items: []
                        }
                    ]
                }
            ]
        });
        this.clock.tick(400);

        currentPath = this.fileManager.option('currentPath');
        currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, targetPath, 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], targetPath.split('/')[0], 'Current path keys [0] is correct');
        assert.strictEqual(currentPathKeys[1], targetPath, 'Current path keys [1] is correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/' + targetPath, 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, targetPath, 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 3, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'NavPane current folder text is correct');
    });

    test('currentPath option value stays the same when changed along with the fileSystemProvider option with delay (T1045617)', function(assert) {
        const operationDelay = 1000;
        const targetPath = 'Folder 1/Folder 1.1';

        this.fileManager.option('currentPath', targetPath);
        this.clock.tick(400);

        let currentPath = this.fileManager.option('currentPath');
        let currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, targetPath, 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], targetPath.split('/')[0], 'Current path keys [0] is correct');
        assert.strictEqual(currentPathKeys[1], targetPath, 'Current path keys [1] is correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/' + targetPath, 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, targetPath, 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 6, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'NavPane current folder text is correct');

        this.fileManager.option({
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'r',
                realProviderInstance: new ObjectFileSystemProvider({ data: [
                    {
                        name: 'Folder 1',
                        isDirectory: true,
                        hasSubDirectories: true,
                        items: [
                            {
                                name: 'Folder 1.1',
                                isDirectory: true,
                                hasSubDirectories: false,
                                items: []
                            }
                        ]
                    }
                ]
                })
            }),
            currentPath: targetPath
        });
        this.clock.tick(operationDelay * 2 + 100);

        currentPath = this.fileManager.option('currentPath');
        currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, targetPath, 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], targetPath.split('/')[0], 'Current path keys [0] is correct');
        assert.strictEqual(currentPathKeys[1], targetPath, 'Current path keys [1] is correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/' + targetPath, 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, targetPath, 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 3, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'NavPane current folder text is correct');
    });

    test('currentPath option value stays the same when fileSystemProvider option value set along with the currentPath option with delay (T1045617)', function(assert) {
        const operationDelay = 1000;
        const targetPath = 'Folder 1/Folder 1.1';

        this.fileManager.option('currentPath', targetPath);
        this.clock.tick(400);

        let currentPath = this.fileManager.option('currentPath');
        let currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, targetPath, 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], targetPath.split('/')[0], 'Current path keys [0] is correct');
        assert.strictEqual(currentPathKeys[1], targetPath, 'Current path keys [1] is correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/' + targetPath, 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, targetPath, 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 6, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'NavPane current folder text is correct');

        this.fileManager.option({
            currentPath: targetPath,
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'r',
                realProviderInstance: new ObjectFileSystemProvider({ data: [
                    {
                        name: 'Folder 1',
                        isDirectory: true,
                        hasSubDirectories: true,
                        items: [
                            {
                                name: 'Folder 1.1',
                                isDirectory: true,
                                hasSubDirectories: false,
                                items: []
                            }
                        ]
                    }
                ]
                })
            }),
        });
        this.clock.tick(operationDelay * 2 + 100);

        currentPath = this.fileManager.option('currentPath');
        currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, targetPath, 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], targetPath.split('/')[0], 'Current path keys [0] is correct');
        assert.strictEqual(currentPathKeys[1], targetPath, 'Current path keys [1] is correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/' + targetPath, 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, targetPath, 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 3, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'NavPane current folder text is correct');
    });

    test('currentPath option value resets when corresponding path does not exist (T1045617)', function(assert) {
        this.fileManager.option('currentPath', 'Folder x');
        this.clock.tick(400);

        const currentPath = this.fileManager.option('currentPath');
        const currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, '', 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 0, 'Current path keys has correct size');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files', 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, '', 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 4, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Files', 'NavPane current folder text is correct');
    });

    test('currentPathKeys option value resets when corresponding path does not exist (T1045617)', function(assert) {
        this.fileManager.option('currentPathKeys', ['Folder x']);
        this.clock.tick(400);

        const currentPath = this.fileManager.option('currentPath');
        const currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, '', 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 0, 'Current path keys has correct size');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files', 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, '', 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 4, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Files', 'NavPane current folder text is correct');
    });

    test('notification does not disappear when permissions set dynamically (T1051605)', function(assert) {
        const optionChangedSpy = sinon.spy();
        const objectProvider = new ObjectFileSystemProvider({ data: createTestFileSystem() });
        const customProvider = new CustomFileSystemProvider({
            getItems: function(parentDirectory) {
                const deferred = new Deferred();
                if(parentDirectory.key === 'Folder 2') {
                    const error = new FileSystemError(42, parentDirectory, 'Custom text');
                    deferred.reject(error);
                } else {
                    objectProvider.getItems(parentDirectory).then(result => deferred.resolve(result));
                }
                return deferred.promise();
            }
        });
        this.fileManager.option({
            fileSystemProvider: customProvider,
            currentPath: 'Folder 1',
            onCurrentDirectoryChanged: ({ component }) => component.option('permissions', component.option('permissions')),
            onOptionChanged: optionChangedSpy
        });
        this.clock.tick(400);

        let currentPath = this.fileManager.option('currentPath');
        let currentPathKeys = this.fileManager.option('currentPathKeys');
        assert.strictEqual(currentPath, 'Folder 1', 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 1, 'Current path keys has correct size');
        assert.strictEqual(currentPathKeys[0], 'Folder 1', 'Current path keys are correct');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1', 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, 'Folder 1', 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1', 'NavPane current folder text is correct');

        optionChangedSpy.resetHistory();
        this.fileManager.option('currentPath', 'Folder 2');
        this.clock.tick(400);

        assert.ok(this.wrapper.getNotificationPopup().is(':visible'), 'notification popup is visible');
        assert.ok(this.wrapper.getToolbarRefreshButtonState().isError, 'refresh button is in error state');

        assert.strictEqual(optionChangedSpy.callCount, 6, 'Three options have changed');
        assert.strictEqual(optionChangedSpy.args[0][0].name, 'currentPath', 'CurrentPath changed');
        assert.strictEqual(optionChangedSpy.args[0][0].value, 'Folder 2', 'CurrentPath changed');
        assert.strictEqual(optionChangedSpy.args[1][0].name, 'currentPathKeys', 'CurrentPathKeys changed');
        assert.deepEqual(optionChangedSpy.args[1][0].value, ['Folder 2'], 'CurrentPathKeys changed');
        assert.strictEqual(optionChangedSpy.args[2][0].name, 'permissions', 'Permissions changed');
        assert.strictEqual(optionChangedSpy.args[3][0].name, 'currentPath', 'CurrentPath changed');
        assert.strictEqual(optionChangedSpy.args[3][0].value, '', 'CurrentPath changed');
        assert.strictEqual(optionChangedSpy.args[4][0].name, 'currentPathKeys', 'CurrentPathKeys changed');
        assert.strictEqual(optionChangedSpy.args[4][0].value.length, 0, 'CurrentPathKeys changed');
        assert.strictEqual(optionChangedSpy.args[5][0].name, 'permissions', 'Permissions changed');

        const infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 1, 'There is one notification on panel');
        assert.strictEqual(infos[0].common.commonText, 'The directory cannot be opened', 'Title is correct');

        const details = infos[0].details;
        assert.strictEqual(details.length, 1, 'Notification has one details section');
        assert.strictEqual(details[0].commonText, 'Folder 2', 'Common text is correct');
        assert.strictEqual(details[0].errorText, 'Custom text', 'Error text is correct');

        currentPath = this.fileManager.option('currentPath');
        currentPathKeys = this.fileManager.option('currentPathKeys');
        assert.strictEqual(currentPath, '', 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 0, 'Current path keys has correct size');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files', 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, '', 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Files', 'NavPane current folder text is correct');
    });

    test('There must be no errors on fast navigation details view (T1103086)', function(assert) {
        const operationDelay = 400;
        this.fileManager.option({
            fileSystemProvider: new SlowFileProvider({
                operationDelay,
                operationsToDelay: 'r'
            }),
            itemView: {
                mode: 'details'
            },
            currentPath: 'Folder 3'
        });
        this.clock.tick(3 * operationDelay);

        this.wrapper.getFolderNode(1).trigger('dxclick');
        this.clock.tick(2 * operationDelay);
        this.wrapper.getFolderToggle(1).trigger('dxclick');
        this.clock.tick(1);
        this.wrapper.getFolderNode(2).trigger('dxclick');
        this.clock.tick(1);

        assert.ok(this.wrapper.getDetailsOverlayShader().is(':visible'), 'load panel shader is visible');

        this.clock.tick(2 * operationDelay);

        const currentPath = this.fileManager.option('currentPath');
        const currentPathKeys = this.fileManager.option('currentPathKeys');

        assert.strictEqual(currentPath, 'Folder 1/Folder 1.1', 'Current path is correct');
        assert.strictEqual(currentPathKeys.length, 2, 'Current path keys has correct size');
        assert.strictEqual(this.wrapper.getBreadcrumbsPath(), 'Files/Folder 1/Folder 1.1', 'Breadcrumbs has correct path');
        assert.strictEqual(this.fileManager.getCurrentDirectory().key, 'Folder 1/Folder 1.1', 'Current directory is the target one');
        assert.strictEqual(this.wrapper.getFolderNodes().length, 6, 'NavPane folder nodes count is correct');
        assert.strictEqual(this.wrapper.getFocusedItemText(), 'Folder 1.1', 'NavPane current folder text is correct');
    });
});

QUnit.module('initial navigation with error (T1085224)', moduleConfig_T1085224, () => {
    test('getItems must be invoked only once in case of exception after refresh thumbanilsView (T1085224)', function(assert) {
        const { getItemsSpy } = createFileManager_T1085224(this, true);
        getItemsSpy.resetHistory();
        this.wrapper.getToolbarRefreshButton().trigger('dxclick');
        this.clock.tick(800);

        assert.strictEqual(getItemsSpy.callCount, 1, 'getItems function must be called once');
    });

    test('getItems must be invoked only once in case of exception after refresh detailsView (T1085224)', function(assert) {
        const { getItemsSpy } = createFileManager_T1085224(this);
        getItemsSpy.resetHistory();
        this.wrapper.getToolbarRefreshButton().trigger('dxclick');
        this.clock.tick(800);

        assert.strictEqual(getItemsSpy.callCount, 1, 'getItems function must be called once');
    });

    test('only one notification must be shown in case of getItems exception after refresh thumbnailsView (T1085224)', function(assert) {
        createFileManager_T1085224(this, true);

        this.progressPanelWrapper.getInfos()[0].common.$closeButton.trigger('dxclick');
        this.clock.tick(400);

        let infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 0, 'There are no notifications on panel');

        this.wrapper.getToolbarRefreshButton().trigger('dxclick');
        this.clock.tick(700);

        infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 1, 'There is one notification on panel');

        assert.strictEqual(infos[0].common.commonText, 'The directory cannot be opened', 'Title is correct');

        const details = infos[0].details;
        assert.strictEqual(details.length, 1, 'Notification has one details section');

        assert.strictEqual(details[0].commonText, '', 'Common text is correct');
        assert.strictEqual(details[0].errorText, 'Custom text', 'Error text is correct');
    });

    test('only one notification must be shown in case of getItems exception after refresh detailsView (T1085224)', function(assert) {
        createFileManager_T1085224(this, true);

        this.progressPanelWrapper.getInfos()[0].common.$closeButton.trigger('dxclick');
        this.clock.tick(400);

        let infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 0, 'There are no notifications on panel');

        this.wrapper.getToolbarRefreshButton().trigger('dxclick');
        this.clock.tick(700);

        infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 1, 'There is one notification on panel');

        assert.strictEqual(infos[0].common.commonText, 'The directory cannot be opened', 'Title is correct');

        const details = infos[0].details;
        assert.strictEqual(details.length, 1, 'Notification has one details section');

        assert.strictEqual(details[0].commonText, '', 'Common text is correct');
        assert.strictEqual(details[0].errorText, 'Custom text', 'Error text is correct');
    });

    test('getItems must be invoked only once in case of exception thumbnailsView (T1085224)', function(assert) {
        const { getItemsSpy } = createFileManager_T1085224(this, true);
        assert.strictEqual(getItemsSpy.callCount, 1, 'getItems function must be called once');
    });

    test('getItems must be invoked only once in case of exception detailsView (T1085224)', function(assert) {
        const { getItemsSpy } = createFileManager_T1085224(this);
        assert.strictEqual(getItemsSpy.callCount, 1, 'getItems function must be called once');
    });

    test('only one notification must be shown in case of getItems exception thumbnailsView (T1085224)', function(assert) {
        createFileManager_T1085224(this, true);

        const infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 1, 'There is one notification on panel');

        assert.strictEqual(infos[0].common.commonText, 'The directory cannot be opened', 'Title is correct');

        const details = infos[0].details;
        assert.strictEqual(details.length, 1, 'Notification has one details section');

        assert.strictEqual(details[0].commonText, '', 'Common text is correct');
        assert.strictEqual(details[0].errorText, 'Custom text', 'Error text is correct');
    });

    test('only one notification must be shown in case of getItems exception detailsView (T1085224)', function(assert) {
        createFileManager_T1085224(this);

        const infos = this.progressPanelWrapper.getInfos();
        assert.strictEqual(infos.length, 1, 'There is one notification on panel');

        assert.strictEqual(infos[0].common.commonText, 'The directory cannot be opened', 'Title is correct');

        const details = infos[0].details;
        assert.strictEqual(details.length, 1, 'Notification has one details section');

        assert.strictEqual(details[0].commonText, '', 'Common text is correct');
        assert.strictEqual(details[0].errorText, 'Custom text', 'Error text is correct');
    });

    test('getItems must be invoked only once in case of exception thumbnailsView (provider+path) (T1085224)', function(assert) {
        const { getItemsSpy } = createFileManager_T1085224(this, true, { currentPath: 'somePath' });
        assert.strictEqual(getItemsSpy.callCount, 1, 'getItems function must be called once');
    });

    test('getItems must be invoked only once in case of exception detailsView (provider+path) (T1085224)', function(assert) {
        const { getItemsSpy } = createFileManager_T1085224(this, false, { currentPath: 'somePath' });
        assert.strictEqual(getItemsSpy.callCount, 1, 'getItems function must be called once');
    });
});
