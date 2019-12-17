import $ from 'jquery';
import 'ui/file_manager';
import fx from 'animation/fx';
import { Consts, FileManagerWrapper, createTestFileSystem } from '../../../helpers/fileManagerHelpers.js';

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
        fileProvider: fileSystem,
        itemView: {
            mode: viewMode,
            showFolders: false,
            showParentFolder: false
        },
        permissions: {
            create: true,
            copy: true,
            move: true,
            remove: true,
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
        $item.trigger('click');
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
        $item.trigger('click');
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');

        let $folderNode = this.wrapper.getFolderNode(0);
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

        let $folderNode = this.wrapper.getFolderNode(0);
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
            remove: false,
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
        $item.trigger('click');
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
                    name: 'viewSwitcher',
                    location: 'before'
                }]
        });
        this.clock.tick(400);

        let $elements = this.wrapper.getGeneralToolbarElements();
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

        let $toolbar = this.wrapper.getToolbar();
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
                'viewSwitcher',
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
                'viewSwitcher',
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
                'viewSwitcher'
            ]
        });
        this.clock.tick(400);

        let $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 4, 'general toolbar has elements');

        assert.notStrictEqual($elements.eq(2).text().indexOf('Move'), -1, 'move is rendered in new position');

        const $item = this.wrapper.findDetailsItem('File 1.txt');
        $item.trigger('dxclick');
        $item.trigger('click');
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), 'file toolbar displayed');
    });

    test('itemView dropDownButton must show correct state', function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('itemView.mode', 'thumbnails');
        this.clock.tick(400);

        let $dropDownButton = this.wrapper.getGeneralToolbarElements().last();
        assert.equal($dropDownButton.attr('title'), 'Thumbnails View', 'Thumbnails View');

        $dropDownButton.find(`.${Consts.BUTTON_CLASS}`).trigger('dxclick');
        this.clock.tick(400);
        let detailsViewSelector = this.wrapper.getToolbarViewSwitcherListItem(0);
        $(detailsViewSelector).trigger('dxclick');
        this.clock.tick(400);

        $dropDownButton = this.wrapper.getGeneralToolbarElements().last();
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

        $dropDownButton = this.wrapper.getGeneralToolbarElements().last();
        assert.equal($dropDownButton.attr('title'), 'Details View', 'Details View');

        $dropDownButton.find(`.${Consts.BUTTON_CLASS}`).trigger('dxclick');
        this.clock.tick(400);
        detailsViewSelector = this.wrapper.getToolbarViewSwitcherListItem(1);
        $(detailsViewSelector).trigger('dxclick');
        this.clock.tick(400);

        $dropDownButton = this.wrapper.getGeneralToolbarElements().last();
        assert.equal($dropDownButton.attr('title'), 'Thumbnails View', 'Thumbnails View');
    });

});
