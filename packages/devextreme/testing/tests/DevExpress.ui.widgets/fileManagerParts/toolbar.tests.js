import $ from 'jquery';
import 'ui/file_manager';
import fx from 'common/core/animation/fx';
import { Consts, FileManagerWrapper, createTestFileSystem } from '../../../helpers/fileManagerHelpers.js';
import { implementationsMap } from 'core/utils/size';

const { test } = QUnit;

const moduleConfig = {

    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $('#fileManager');
        this.wrapper = new FileManagerWrapper(this.$element);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }

};

const createFileManager = useThumbnailViewMode => {
    const fileSystem = createTestFileSystem();
    const viewMode = useThumbnailViewMode ? 'thumbnails' : 'details';

    $('#fileManager').dxFileManager({
        fileSystemProvider: fileSystem,
        itemView: {
            mode: viewMode,
            showFolders: false,
            showParentFolder: false
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
};

QUnit.module('Toolbar', moduleConfig, () => {

    test('toolbar updated after selection changing in thumbnails view mode', function(assert) {
        createFileManager(true);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');

        let $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 3, 'has buttons');

        assert.notStrictEqual($elements.eq(0).text().indexOf('New directory'), -1, 'create folder button displayed');
        assert.notStrictEqual($elements.eq(1).text().indexOf('Upload files'), -1, 'upload files button displayed');
        assert.notStrictEqual($elements.eq(2).attr('title').indexOf('Thumbnails'), -1, 'view switcher displayed');

        const $item = this.wrapper.findThumbnailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');

        $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 5, 'has buttons');

        assert.notStrictEqual($elements.eq(0).text().indexOf('Move'), -1, 'move displayed');
        assert.notStrictEqual($elements.eq(1).text().indexOf('Copy'), -1, 'copy displayed');
        assert.notStrictEqual($elements.eq(2).text().indexOf('Rename'), -1, 'rename displayed');
        assert.notStrictEqual($elements.eq(3).text().indexOf('Delete'), -1, 'delete button displayed');
        assert.notStrictEqual($elements.eq(4).text().indexOf('Clear selection'), -1, 'clear selection button displayed');
    });

    test('toolbar updated after folder changing in thumbnails view mode', function(assert) {
        createFileManager(true);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');

        const $item = this.wrapper.findThumbnailsItem('File 1.txt');
        $item.trigger('dxclick');
        $item.trigger('click');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');

        const $folderNode = this.wrapper.getFolderNode(1);
        $folderNode.trigger('dxclick');
        $folderNode.trigger('click');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');
    });

    test('toolbar updated after selection changing in details view mode', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');

        let $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 3, 'has buttons');

        assert.notStrictEqual($elements.eq(0).text().indexOf('New directory'), -1, 'create folder button displayed');
        assert.notStrictEqual($elements.eq(1).text().indexOf('Upload files'), -1, 'upload files button displayed');
        assert.notStrictEqual($elements.eq(2).attr('title').indexOf('Details'), -1, 'view switcher displayed');

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');

        $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 5, 'has buttons');

        assert.notStrictEqual($elements.eq(0).text().indexOf('Move'), -1, 'move displayed');
        assert.notStrictEqual($elements.eq(1).text().indexOf('Copy'), -1, 'copy displayed');
        assert.notStrictEqual($elements.eq(2).text().indexOf('Rename'), -1, 'rename displayed');
        assert.notStrictEqual($elements.eq(3).text().indexOf('Delete'), -1, 'delete button displayed');
        assert.notStrictEqual($elements.eq(4).text().indexOf('Clear selection'), -1, 'clear selection button displayed');
    });

    test('toolbar updated after folder changing in details view mode', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        $item.trigger('click');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');

        const $folderNode = this.wrapper.getFolderNode(1);
        $folderNode.trigger('dxclick');
        $folderNode.trigger('click');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');
    });

    test('Display only general toolbar if file toolbar doesn\'t have items', function(assert) {
        createFileManager(false);

        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('permissions', {
            create: false,
            copy: false,
            move: false,
            delete: false,
            rename: false,
            upload: false
        });
        this.clock.tick(400);

        const $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');
        assert.ok(!$toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar hidden');

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);

        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');
        assert.ok(!$toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar hidden');
    });

    test('separator for hidden group is not visible', function(assert) {
        createFileManager(true);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');
        assert.equal(this.wrapper.getToolbarSeparators().length, 1, 'specified separator visible');

        const $item = this.wrapper.findThumbnailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');
        assert.equal(this.wrapper.getToolbarSeparators().length, 1, 'specified separator visible');
    });

    test('default items rearrangement and modification', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('toolbar', {
            items: [
                {
                    name: 'showNavPane',
                    icon: 'upload'
                },
                'upload',
                {
                    name: 'create',
                    locateInMenu: 'always'
                },
                {
                    name: 'refresh',
                    text: 'Reinvigorate'
                },
                {
                    name: 'separator',
                    location: 'after'
                },
                {
                    name: 'switchView',
                    location: 'before'
                }]
        });
        this.clock.tick(400);

        const $elements = this.wrapper.getGeneralToolbarElements();
        assert.equal($elements.length, 5, 'general toolbar has elements');

        assert.ok($elements.eq(0).find('.dx-icon').hasClass(Consts.UPLOAD_ICON_CLASS), 'show tree view button is rendered with new icon');
        assert.notStrictEqual($elements.eq(1).text().indexOf('Upload files'), -1, 'upload files button is rendered in new position');

        const $toolbarDropDownMenuButton = this.wrapper.getToolbarDropDownMenuButton();
        $toolbarDropDownMenuButton.trigger('dxclick');
        this.clock.tick(400);
        const toolbarDropDownMenuItem = this.wrapper.getToolbarDropDownMenuItem(0);
        assert.notStrictEqual($(toolbarDropDownMenuItem).find('.dx-button-text').text().indexOf('New directory'), -1, 'create folder button is rendered in the dropDown menu');

        assert.notStrictEqual($elements.eq(2).attr('title').indexOf('Details'), -1, 'view switcher is rendered in new location');
        assert.notStrictEqual($elements.eq(3).text().indexOf('Reinvigorate'), -1, 'refresh button is rendered with new text');


        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        $item.trigger('click');
        this.clock.tick(400);

        const $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');
    });

    test('custom items render and modification', function(assert) {
        const testClick = sinon.spy();

        createFileManager(false);
        this.clock.tick(400);

        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('toolbar', {
            items: [
                'showNavPane', 'create', 'upload', 'refresh',
                {
                    name: 'separator',
                    location: 'after'
                },
                'switchView',
                {
                    ID: 42,
                    name: 'commandName',
                    location: 'after',
                    locateInMenu: 'never',
                    visible: true,
                    onClick: testClick,
                    options:
                        {
                            text: 'newButton'
                        }
                }
            ]
        });
        this.clock.tick(400);

        let $elements = this.wrapper.getGeneralToolbarElements();
        assert.equal($elements.length, 6, 'general toolbar has elements');

        let $newButton = $elements.eq(5);
        assert.notStrictEqual($newButton.text().indexOf('newButton'), -1, 'newButton is rendered at correct place');
        assert.ok($newButton.hasClass('dx-button-mode-text'), 'newButton has default stylingMode');

        $newButton.trigger('dxclick');
        assert.equal(testClick.callCount, 1, 'newButton has correct action');
        assert.equal(testClick.args[0][0].itemData.ID, 42, 'custom attribute is available from onClick fuction');

        fileManagerInstance.option('toolbar', {
            items: [
                'showNavPane', 'create', 'upload', 'refresh',
                {
                    name: 'separator',
                    location: 'after'
                },
                'switchView',
                {
                    name: 'commandName',
                    locateInMenu: 'always',
                    visible: true,
                    disabled: true,
                    onClick: testClick,
                    options:
                        {
                            text: 'newButton'
                        }
                },
                {
                    name: 'newCommand',
                    location: 'after',
                    locateInMenu: 'never',
                    visible: false,
                    options:
                        {
                            text: 'Some new command',
                            icon: 'upload'
                        }
                }
            ]
        });
        this.clock.tick(400);

        $elements = this.wrapper.getGeneralToolbarElements();
        assert.equal($elements.length, 7, 'general toolbar has elements');
        const $visibleElements = this.wrapper.getToolbarElements();
        assert.equal($visibleElements.length, 3, 'general toolbar has visible elements');

        const $toolbarDropDownMenuButton = this.wrapper.getToolbarDropDownMenuButton();
        $toolbarDropDownMenuButton.trigger('dxclick');
        this.clock.tick(400);

        const toolbarDropDownMenuItem = this.wrapper.getToolbarDropDownMenuItem(0);
        $newButton = $(toolbarDropDownMenuItem).find('.dx-button');
        assert.notStrictEqual($newButton.find('.dx-button-text').text().indexOf('newButton'), -1, 'newButton is rendered in the dropDown menu');

        $newButton.trigger('dxclick');
        assert.equal(testClick.callCount, 1, 'newButton has no action due to its disabled state');

        const $newCommandButton = $elements.eq(5);
        assert.notStrictEqual($newCommandButton.text().indexOf('Some new command'), -1, 'new command button is placed correctly');
        assert.ok($newCommandButton.find('.dx-icon').hasClass(Consts.UPLOAD_ICON_CLASS), 'new command button has new icon');

        assert.strictEqual($visibleElements.eq(0).text().indexOf('Some new command'), -1);
        assert.strictEqual($visibleElements.eq(1).text().indexOf('Some new command'), -1);
        assert.strictEqual($visibleElements.eq(2).val().indexOf('Some new command'), -1, 'new command button is hidden');
    });

    test('default items manual visibility management', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('toolbar', {
            items: [
                'showNavPane', 'create', 'upload', 'separator',
                {
                    name: 'move',
                    visible: true,
                    disabled: true
                }, 'refresh',
                {
                    name: 'separator',
                    location: 'after'
                },
                'switchView'
            ]
        });
        this.clock.tick(400);

        let $elements = this.wrapper.getAllItemsOfToolbar();
        assert.equal($elements.length, 8, 'general toolbar has elements');
        assert.strictEqual($elements.eq(4).text(), 'Move to', 'move is rendered in new position');
        assert.ok($elements.eq(4).is(`.${Consts.DISABLED_STATE_CLASS}`), 'move button is disabled');

        fileManagerInstance.option('toolbar.items[4].visible', undefined);
        this.clock.tick(400);

        $elements = this.wrapper.getAllItemsOfToolbar();
        assert.equal($elements.length, 8, 'general toolbar has elements');
        assert.strictEqual($elements.eq(4).text(), 'Move to', 'move is rendered');
        assert.ok($elements.eq(4).is(`.${Consts.DISABLED_STATE_CLASS}`), 'move button can be disabled even if its "visible" property manually not set');

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        $item.trigger('click');
        this.clock.tick(400);

        const $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');
    });

    test('itemView dropDownButton must show correct state', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('itemView.mode', 'thumbnails');
        this.clock.tick(400);

        let $dropDownButton = this.wrapper.getToolbarDropDownButton();
        assert.equal($dropDownButton.attr('title'), 'Thumbnails View', 'Thumbnails View');

        $dropDownButton.find(`.${Consts.BUTTON_CLASS}`).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getToolbarViewSwitcherListItem(0).trigger('dxclick');
        this.clock.tick(400);

        $dropDownButton = this.wrapper.getToolbarDropDownButton();
        assert.equal($dropDownButton.attr('title'), 'Details View', 'Details View');

        this.wrapper.findDetailsItem('File 1.txt').trigger('dxclick');
        this.wrapper.getDetailsItemList().trigger('click');
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Rename').trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getDialogTextInput()
            .val('New filename.txt')
            .trigger('change');
        this.wrapper.getDialogButton('Save').trigger('dxclick');
        this.clock.tick(400);
        assert.equal(this.wrapper.getDetailsItemName(0), 'New filename.txt', 'File renamed');

        $dropDownButton = this.wrapper.getToolbarDropDownButton();
        assert.equal($dropDownButton.attr('title'), 'Details View', 'Details View');

        $dropDownButton.find(`.${Consts.BUTTON_CLASS}`).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getToolbarViewSwitcherListItem(1).trigger('dxclick');
        this.clock.tick(400);

        $dropDownButton = this.wrapper.getToolbarDropDownButton();
        assert.equal($dropDownButton.attr('title'), 'Thumbnails View', 'Thumbnails View');
    });

    test('Raise the ToolbarItemClick event on default toolbar', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const spy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onToolbarItemClick: spy,
            toolbar: {
                items: [
                    {
                        name: 'someItem',
                        options: {
                            text: 'someItem'
                        },
                        visible: true,
                        location: 'before'
                    }, 'create'
                ]
            }
        });
        this.clock.tick(800);

        const $items = this.wrapper.getGeneralToolbarElements();
        $items.eq(0).trigger('dxclick');
        this.clock.tick(400);

        let itemElement = $($items.eq(0)).parent().parent().get(0);
        let itemData = fileManager.option('toolbar.items')[0];

        assert.strictEqual(spy.callCount, 1, 'event raised');
        assert.strictEqual(spy.args[0][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(spy.args[0][0].itemElement).get(0), itemElement, 'itemElement is correct');
        assert.strictEqual(spy.args[0][0].itemIndex, 0, 'itemIndex is correct');
        assert.strictEqual(spy.args[0][0].itemData, itemData, 'itemData is correct');
        assert.strictEqual(spy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(spy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');

        $items.eq(1).trigger('dxclick');
        this.clock.tick(400);

        itemElement = $($items.eq(1)).parent().parent().get(0);
        itemData = fileManager.option('toolbar.items')[1];

        assert.strictEqual(spy.callCount, 2, 'event raised');
        assert.strictEqual(spy.args[1][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(spy.args[1][0].itemElement).get(0), itemElement, 'itemElement is correct');
        assert.strictEqual(spy.args[1][0].itemIndex, 1, 'itemIndex is correct');
        assert.strictEqual(spy.args[1][0].itemData, itemData, 'itemData is correct');
        assert.strictEqual(spy.args[1][0].component, fileManager, 'component is correct');
        assert.strictEqual($(spy.args[1][0].element).get(0), this.$element.get(0), 'element is correct');
    });

    test('Raise the ToolbarItemClick event on fileSelection toolbar', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const spy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onToolbarItemClick: spy,
            toolbar: {
                fileSelectionItems: [
                    {
                        name: 'someItem',
                        options: {
                            text: 'someItem'
                        },
                        visible: true,
                        location: 'before'
                    }, 'create'
                ]
            }
        });
        this.clock.tick(800);

        this.wrapper.getRowNameCellInDetailsView(2).trigger('dxclick');
        this.clock.tick(800);

        const $items = this.wrapper.getFileSelectionToolbarElements();
        $items.eq(0).trigger('dxclick');
        this.clock.tick(400);

        let itemElement = $($items.eq(0)).parent().parent().get(0);
        let itemData = fileManager.option('toolbar.fileSelectionItems')[0];

        assert.strictEqual(spy.callCount, 1, 'event raised');
        assert.strictEqual(spy.args[0][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(spy.args[0][0].itemElement).get(0), itemElement, 'itemElement is correct');
        assert.strictEqual(spy.args[0][0].itemIndex, 0, 'itemIndex is correct');
        assert.strictEqual(spy.args[0][0].itemData, itemData, 'itemData is correct');
        assert.strictEqual(spy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(spy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');

        $items.eq(1).trigger('dxclick');
        this.clock.tick(400);

        itemElement = $($items.eq(1)).parent().parent().get(0);
        itemData = fileManager.option('toolbar.fileSelectionItems')[1];

        assert.strictEqual(spy.callCount, 2, 'event raised');
        assert.strictEqual(spy.args[1][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(spy.args[1][0].itemElement).get(0), itemElement, 'itemElement is correct');
        assert.strictEqual(spy.args[1][0].itemIndex, 1, 'itemIndex is correct');
        assert.strictEqual(spy.args[1][0].itemData, itemData, 'itemData is correct');
        assert.strictEqual(spy.args[1][0].component, fileManager, 'component is correct');
        assert.strictEqual($(spy.args[1][0].element).get(0), this.$element.get(0), 'element is correct');
    });

    test('file toolbar should support case when only custom elements are specified', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const buttonClick = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onToolbarItemClick: buttonClick,
            toolbar: {
                fileSelectionItems: [
                    {
                        widget: 'dxButton',
                        options: {
                            text: 'Properties',
                            icon: 'preferences'
                        }
                    },
                    {
                        widget: 'dxButton',
                        options: {
                            text: 'Options',
                            secretKey: 42
                        }
                    }
                ]
            }
        });
        this.clock.tick(400);

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);

        const $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');

        const $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 2, 'file toolbar has two elements');

        assert.strictEqual($elements.eq(0).text(), 'Properties', 'properties button is rendered');
        assert.strictEqual($elements.eq(1).text(), 'Options', 'options button is rendered');

        $elements.eq(0).trigger('dxclick');

        assert.strictEqual(buttonClick.callCount, 1, 'event raised');
        assert.strictEqual(buttonClick.args[0][0].itemData.widget, 'dxButton', 'is correct widget');
        assert.strictEqual(buttonClick.args[0][0].itemData.options.text, 'Properties', 'has correct text');
        assert.strictEqual(buttonClick.args[0][0].itemData.options.icon, 'preferences', 'has correct icon');

        $elements.eq(1).trigger('dxclick');

        assert.strictEqual(buttonClick.callCount, 2, 'event raised');
        assert.strictEqual(buttonClick.args[1][0].itemData.widget, 'dxButton', 'is correct widget');
        assert.strictEqual(buttonClick.args[1][0].itemData.options.text, 'Options', 'has correct text');
        assert.strictEqual(buttonClick.args[1][0].itemData.options.secretKey, 42, 'has custom option');
    });

    test('display only general toolbar if file toolbar have only custom items and none visible', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            toolbar: {
                fileSelectionItems: [
                    {
                        widget: 'dxButton',
                        options: {
                            text: 'Properties'
                        },
                        visible: false
                    }
                ]
            }
        });
        this.clock.tick(400);

        const $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');
        assert.ok(!$toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar hidden');

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);

        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar displayed');
        assert.ok(!$toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar hidden');
    });

    test('toolbar separators must take location into account', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            permissions: {
                download: true
            },
            toolbar: {
                fileSelectionItems: ['download', 'separator', 'clearSelection']
            }
        });
        this.clock.tick(400);

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);

        const $separators = this.wrapper.getToolbarSeparators();
        assert.equal($separators.length, 0, 'file toolbar has no separators');
    });

    test('toolbar separators must render one time for empty group', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            toolbar: {
                items: [
                    {
                        options: {
                            text: 'item0'
                        },
                        visible: true,
                        location: 'before'
                    },
                    'separator',
                    {
                        options: {
                            text: 'item1'
                        },
                        visible: false,
                        location: 'before'
                    },
                    'separator',
                    {
                        options: {
                            text: 'item2'
                        },
                        visible: true,
                        location: 'before'
                    }
                ]
            }
        });
        this.clock.tick(400);

        const $separators = this.wrapper.getToolbarSeparators();
        assert.equal($separators.length, 1, 'toolbar has one separator');
    });

    test('toolbar separators must support default items in menu', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            toolbar: {
                fileSelectionItems: [
                    'download', 'move', 'copy', 'rename', 'separator', 'delete', 'refresh', 'clearSelection',
                    {
                        widget: 'dxButton',
                        options: {
                            text: 'some button with very-very long text to make it easier to hide some items in toolbar menu'
                        }
                    },
                    {
                        widget: 'dxButton',
                        options: {
                            text: 'some item 2 with text'
                        }
                    }
                ]
            }
        });
        this.clock.tick(400);

        const originalWidth = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 700;
        $('#fileManager').css('width', '100%');
        fileManager.repaint();
        this.clock.tick(800);

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);

        const $separators = this.wrapper.getToolbarSeparators();
        assert.equal($separators.length, 0, 'file toolbar has no separators');

        implementationsMap.getWidth = originalWidth;
    });

    test('toolbar separators must support custom items in menu', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            toolbar: {
                fileSelectionItems: [
                    'download', 'move', 'copy', 'rename', 'separator', 'refresh', 'clearSelection',
                    {
                        widget: 'dxButton',
                        options: {
                            text: 'some item 1 with text'
                        },
                        locateInMenu: 'auto'
                    }
                ]
            }
        });
        this.clock.tick(400);

        const originalWidth = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 360;
        $('#fileManager').css('width', '100%');
        fileManager.repaint();
        this.clock.tick(800);

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);
        const $separators = this.wrapper.getToolbarSeparators();
        assert.equal($separators.length, 0, 'file toolbar has no separators');

        implementationsMap.getWidth = originalWidth;
    });

    test('items can render in menu after first load', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            toolbar: {
                fileSelectionItems: [
                    'download', 'move', 'copy', 'rename', 'separator', 'refresh', 'clearSelection',
                    {
                        widget: 'dxButton',
                        options: {
                            text: 'some item 1 with text'
                        },
                        locateInMenu: 'auto'
                    }
                ]
            }
        });
        this.clock.tick(400);

        const originalWidth = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 300;
        $('#fileManager').css('width', '100%');
        fileManager.repaint();
        this.clock.tick(800);

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);

        const $toolbarDropDownMenuButton = this.wrapper.getToolbarDropDownMenuButton();
        $toolbarDropDownMenuButton.trigger('dxclick');
        this.clock.tick(400);

        const toolbarDropDownMenuItem = this.wrapper.getToolbarDropDownMenuItem(0);
        assert.notStrictEqual($(toolbarDropDownMenuItem).find('.dx-button-text').text().indexOf('some item 1 with text'), -1, 'custom button is rendered in the dropDown menu');
        implementationsMap.getWidth = originalWidth;
    });

    test('items must render in \'before\' section by default', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            toolbar: {
                items: [
                    {
                        widget: 'dxButton',
                        options: {
                            text: 'item 1'
                        },
                        locateInMenu: 'never'
                    }
                ]
            }
        });
        this.clock.tick(400);

        const $beforeItems = this.wrapper.getToolbarElementsInSection('before');
        const $centerItems = this.wrapper.getToolbarElementsInSection('center');
        const $afterItems = this.wrapper.getToolbarElementsInSection('after');

        assert.strictEqual($beforeItems.length, 1, 'there is one item in before group');
        assert.strictEqual($beforeItems.text(), 'item 1', 'the item is correct');
        assert.strictEqual($centerItems.length, 0, 'there is no items in center group');
        assert.strictEqual($afterItems.length, 0, 'there is no items in after group');
    });

    test('toolbar items can be specified by option full name', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManager = this.wrapper.getInstance();
        fileManager.option('toolbar.items', [
            'create',
            {
                widget: 'dxButton',
                options: {
                    text: 'item 1'
                },
                locateInMenu: 'never'
            },
            'upload']);
        this.clock.tick(400);
        fileManager.option('toolbar.fileSelectionItems', [
            'move',
            {
                widget: 'dxButton',
                options: {
                    text: 'item 2'
                },
                locateInMenu: 'never'
            },
            'rename']);
        this.clock.tick(400);

        const $generalToolbarElements = this.wrapper.getGeneralToolbarElements();
        assert.strictEqual($generalToolbarElements.length, 3, 'there are three elements in general toolbar');
        assert.strictEqual($generalToolbarElements.eq(0).text(), 'New directory', 'fisrt general element correct');
        assert.strictEqual($generalToolbarElements.eq(1).text(), 'item 1', 'second general element correct');
        assert.strictEqual($generalToolbarElements.eq(2).text(), 'Upload files', 'third general element correct');

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);

        const $fileToolbarElements = this.wrapper.getFileSelectionToolbarElements();
        assert.strictEqual($fileToolbarElements.length, 3, 'there are three elements in file toolbar');
        assert.strictEqual($fileToolbarElements.eq(0).text(), 'Move to', 'fisrt file element correct');
        assert.strictEqual($fileToolbarElements.eq(1).text(), 'item 2', 'second file element correct');
        assert.strictEqual($fileToolbarElements.eq(2).text(), 'Rename', 'third file element correct');
    });

    test('custom toolbar items have compact mode', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManager = this.wrapper.getInstance();
        fileManager.option('toolbar.items', [
            {
                widget: 'dxButton',
                options: {
                    text: 'item with long name 0',
                    icon: 'upload'
                },
                locateInMenu: 'never'
            },
            {
                widget: 'dxButton',
                options: {
                    text: 'item with long name 1',
                    icon: 'upload'
                },
                locateInMenu: 'never'
            },
            {
                widget: 'dxButton',
                options: {
                    text: 'item with long name 2'
                },
                locateInMenu: 'never'
            }
        ]);
        this.clock.tick(400);

        const originalWidth = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 400;
        $('#fileManager').css('width', '100%');
        fileManager.repaint();
        this.clock.tick(800);

        const $generalToolbarElements = this.wrapper.getGeneralToolbarElements();

        assert.strictEqual($generalToolbarElements.length, 3, 'there are three elements in general toolbar');
        assert.strictEqual($generalToolbarElements.eq(0).find(`.${Consts.BUTTON_TEXT_CLASS}:visible`).text(), '', 'fisrt general element correct');
        assert.strictEqual($generalToolbarElements.eq(1).find(`.${Consts.BUTTON_TEXT_CLASS}:visible`).text(), '', 'second general element correct');
        assert.strictEqual($generalToolbarElements.eq(2).find(`.${Consts.BUTTON_TEXT_CLASS}:visible`).text(), 'item with long name 2', 'third general element correct');

        implementationsMap.getWidth = originalWidth;
    });

    test('buttons without text have tooltip', function(assert) {
        createFileManager(true);
        this.clock.tick(400);

        const $refresh = this.wrapper.getToolbarButton('Refresh');
        assert.strictEqual($refresh.length, 2, 'refresh button exists');
        assert.strictEqual($refresh.eq(0).attr('title'), 'Refresh', 'refresh button has tooltip');
        assert.strictEqual($refresh.eq(1).attr('title'), 'Refresh', 'refresh button has tooltip');

        const $showNavPane = this.wrapper.getGeneralToolbarElements().eq(0);
        assert.strictEqual($showNavPane.attr('title'), 'Toggle navigation pane', 'showNavPane button has tooltip');
    });

    test('buttons in compact mode have tooltips', function(assert) {
        createFileManager(true);
        this.clock.tick(400);

        this.wrapper.getInstance().option('permissons.download', true);
        this.clock.tick(400);

        const toolbar = this.wrapper.getInstance()._toolbar;
        toolbar._toolbarHasItemsOverflow = () => true;
        toolbar._update();
        this.clock.tick(800);

        const $generalElements = this.wrapper.getGeneralToolbarElements();
        assert.strictEqual($generalElements.eq(1).attr('title'), 'New directory', 'create button has tooltip');
        assert.strictEqual($generalElements.eq(2).attr('title'), 'Upload files', 'upload button has tooltip');

        const $item = this.wrapper.findThumbnailsItem('File 1.txt');
        $item.trigger('dxclick');
        this.clock.tick(400);

        const $selectionElements = this.wrapper.getFileSelectionToolbarElements();
        assert.strictEqual($selectionElements.eq(0).attr('title'), 'Download', 'download button has tooltip');
        assert.strictEqual($selectionElements.eq(1).attr('title'), 'Move to', 'move button has tooltip');
        assert.strictEqual($selectionElements.eq(2).attr('title'), 'Copy to', 'copy button has tooltip');
        assert.strictEqual($selectionElements.eq(3).attr('title'), 'Rename', 'rename button has tooltip');
        assert.strictEqual($selectionElements.eq(4).attr('title'), 'Delete', 'delete button has tooltip');
        assert.strictEqual($selectionElements.eq(5).attr('title'), 'Clear selection', 'clear selection button has tooltip');
    });

    test('file toolbar items visibility can be updated on selectionCahnged event (T926161)', function(assert) {
        createFileManager();
        this.clock.tick(400);

        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            itemView: {
                showFolders: true
            },
            toolbar: {
                fileSelectionItems: [
                    {
                        name: 'copy',
                        visible: true
                    },
                    {
                        name: 'rename',
                        visible: true
                    }
                ]
            },
            onSelectionChanged: function(e) {
                const isFoldersPresent = e.selectedItems.some(item => item.name.indexOf('Folder') !== -1);
                e.component.option('toolbar.fileSelectionItems[1].visible', !isFoldersPresent);
            }
        });
        this.clock.tick(400);

        this.wrapper.findDetailsItem('File 1.txt').trigger('dxclick');
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        let $elements = this.wrapper.getToolbarElements();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');
        assert.equal($elements.length, 2, 'has two buttons');
        assert.strictEqual($elements.eq(0).text().indexOf('Move'), -1, 'move displayed');
        assert.strictEqual($elements.eq(1).text().indexOf('Copy'), -1, 'copy displayed');

        this.wrapper.findDetailsItem('Folder 1').trigger('dxclick');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        $elements = this.wrapper.getToolbarElements();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');
        assert.equal($elements.length, 1, 'has one button');
        assert.strictEqual($elements.eq(0).text().indexOf('Move'), -1, 'move displayed');

        this.wrapper.findDetailsItem('File 2.jpg').trigger('dxclick');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        $elements = this.wrapper.getToolbarElements();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');
        assert.equal($elements.length, 2, 'has two buttons');
        assert.strictEqual($elements.eq(0).text().indexOf('Move'), -1, 'move displayed');
        assert.strictEqual($elements.eq(1).text().indexOf('Copy'), -1, 'copy displayed');
    });

    test('default items missed options (T948755)', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const customCssClass = 'custom-class';
        const customText = 'customText';
        const customIcon = 'upload';
        const buttonOptions = { text: customText, icon: customIcon, stylingMode: 'outlined' };
        const dropDownButtonOptions = { stylingMode: 'outlined' };
        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('toolbar', {
            items: [{
                name: 'create',
                cssClass: customCssClass
            }, {
                name: 'refresh',
                location: 'before',
                showText: 'always',
                cssClass: customCssClass,
                options: buttonOptions
            }, {
                name: 'separator',
                cssClass: customCssClass
            }, {
                name: 'switchView',
                location: 'before',
                cssClass: customCssClass,
                options: dropDownButtonOptions
            }]
        });
        this.clock.tick(400);

        const $elements = this.wrapper.getAllItemsOfToolbar();
        assert.strictEqual($elements.length, 4, 'general toolbar has 4 elements');

        assert.strictEqual($elements.eq(0).text(), 'New directory', 'create is rendered in the expexted position');
        assert.ok($elements.eq(0).hasClass(customCssClass), 'create has custom css class');

        assert.strictEqual($elements.eq(1).text(), customText, 'refresh is rendered in the expexted position with correct text option');
        assert.ok($elements.eq(1).hasClass(customCssClass), 'refresh has custom css class');
        assert.ok($elements.eq(1).hasClass(Consts.TOOLBAR_HAS_LARGE_ICON_CLASS), 'refresh has default css class');
        assert.ok($elements.eq(1).find('.dx-icon').hasClass(Consts.UPLOAD_ICON_CLASS), 'refresh has correct icon option');
        assert.ok($elements.eq(1).find(`.${Consts.BUTTON_CLASS}`).hasClass(Consts.BUTTON_OUTLINED_CLASS), 'refresh stylingMode option is applied');
        assert.notOk($elements.eq(1).hasClass(Consts.TOOLBAR_ITEM_WITH_HIDDEN_TEXT_CLASS), 'refresh text is shown');

        assert.strictEqual($elements.eq(2).find(`.${Consts.TOOLBAR_SEPARATOR_ITEM_CLASS}`).length, 1, 'separator is rendered in the expexted position and has default class');
        assert.ok($elements.eq(2).hasClass(customCssClass), 'separator has custom css class');

        assert.ok($elements.eq(3).hasClass(Consts.TOOLBAR_VIEWMODE_ITEM_CLASS), 'switchView is rendered in the expexted position and has default class');
        assert.ok($elements.eq(3).hasClass(customCssClass), 'switchView has custom css class');
        assert.ok($elements.eq(3).find(`.${Consts.BUTTON_CLASS}`).hasClass(Consts.BUTTON_OUTLINED_CLASS), 'switchView stylingMode option is applied');
    });

    test('default items forbidden options (T948755)', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const customClick = sinon.spy();
        const customClick1 = sinon.spy();
        const buttonOptions = { onClick: customClick };
        const dropDownButtonOptions = { onItemClick: customClick1 };
        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('toolbar', {
            items: [{
                name: 'refresh',
                location: 'before',
                showText: 'always',
                options: buttonOptions
            }, {
                name: 'switchView',
                location: 'before',
                options: dropDownButtonOptions
            }],
            fileSelectionItems: []
        });
        this.clock.tick(400);

        this.wrapper.getToolbarRefreshButton().trigger('dxclick');
        this.clock.tick(400);
        assert.ok(customClick.notCalled, 'refresh has its default action');
        this.wrapper.getToolbarDropDownButton().find(`.${Consts.BUTTON_CLASS}`).trigger('dxclick');
        this.clock.tick(400);
        this.wrapper.getToolbarViewSwitcherListItem(1).trigger('dxclick');
        assert.ok(customClick1.notCalled, 'switchView has its default action');
    });

    test('toolbar must keeps its state during refreshes (T1031638)', function(assert) {
        createFileManager(true);
        this.clock.tick(400);

        this.wrapper.getInstance().option('toolbar', {
            items: ['create', 'refresh'],
            fileSelectionItems: ['rename', 'move', 'create', 'switchView']
        });
        this.clock.tick(400);

        this.wrapper.findThumbnailsItem('File 1.txt').trigger('dxclick');
        this.clock.tick(100);

        assert.notOk(this.wrapper.getGeneralToolbar().is(':visible'), 'general toolbar is invisible');
        assert.ok(this.wrapper.getFileSelectionToolbar().is(':visible'), 'file selection toolbar is visible');
        assert.strictEqual(this.wrapper.getToolbarElements().length, 4, 'file selection toolbar has 4 visible items');
        this.wrapper.getToolbarDropDownButton().find(`.${Consts.BUTTON_CLASS}`).trigger('dxclick');
        this.clock.tick(100);
        this.wrapper.getToolbarViewSwitcherListItem(0).trigger('dxclick');
        this.clock.tick(400);
        assert.notOk(this.wrapper.getGeneralToolbar().is(':visible'), 'general toolbar is invisible');
        assert.ok(this.wrapper.getFileSelectionToolbar().is(':visible'), 'file selection toolbar is visible');
        assert.strictEqual(this.wrapper.getToolbarElements().length, 4, 'file selection toolbar has 4 visible items');
    });

});
