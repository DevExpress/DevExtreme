import $ from 'jquery';
const { test } = QUnit;
import 'ui/file_manager';
import fx from 'common/core/animation/fx';
import pointerEvents from 'common/core/events/pointer';
import { Consts, FileManagerWrapper, createTestFileSystem, isDesktopDevice } from '../../../helpers/fileManagerHelpers.js';

const moduleConfig = {

    beforeEach: function() {
        const fileSystem = createTestFileSystem();

        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $('#fileManager').dxFileManager({
            fileSystemProvider: fileSystem,
            itemView: {
                showFolders: false
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

        this.wrapper = new FileManagerWrapper(this.$element);
        this.fileManager = this.wrapper.getInstance();

        this.clock.tick(400);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }

};

QUnit.module('Raise context menu', moduleConfig, () => {

    test('right click by row on desktops', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desctops');
            return;
        }
        const $row1 = this.wrapper.getRowInDetailsView(1);
        assert.notOk($row1.hasClass(Consts.SELECTION_CLASS));
        assert.equal(this.wrapper.getContextMenuItems().length, 0);

        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxcontextmenu');
        assert.ok($row1.hasClass(Consts.SELECTION_CLASS));
        assert.ok(this.wrapper.getContextMenuItems().length > 0);

        const $row2 = this.wrapper.getRowInDetailsView(2);
        assert.notOk($row2.hasClass(Consts.SELECTION_CLASS));

        this.wrapper.getRowNameCellInDetailsView(2).trigger('dxcontextmenu');
        assert.notOk($row1.hasClass(Consts.SELECTION_CLASS));
        assert.ok($row2.hasClass(Consts.SELECTION_CLASS));
        assert.ok(this.wrapper.getContextMenuItems().length > 0);
    });

    test('right click by row on mobiles', function(assert) {
        if(isDesktopDevice()) {
            assert.ok(true, 'only on mobiles');
            return;
        }

        assert.equal(this.wrapper.getContextMenuItems().length, 0);

        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxcontextmenu');
        assert.strictEqual(this.wrapper.getContextMenuItems().length, 0);

        this.wrapper.getRowNameCellInDetailsView(2).trigger('dxcontextmenu');
        assert.strictEqual(this.wrapper.getContextMenuItems().length, 0);
    });

    test('right click by thumbnails item on desktops', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desctops');
            return;
        }

        this.wrapper.getInstance().option({
            itemView: {
                mode: 'thumbnails',
                showFolders: true
            },
            permissions: {
                download: true
            }
        });
        this.clock.tick(400);

        const item1 = this.wrapper.findThumbnailsItem('File 1.txt');
        const item2 = this.wrapper.findThumbnailsItem('Folder 1');

        assert.equal(this.wrapper.getContextMenuItems().length, 0);

        item1.trigger('dxcontextmenu');
        assert.strictEqual(this.wrapper.getContextMenuItems().length, 6, 'context menu items for files');
        assert.ok(item1.hasClass(Consts.ITEM_SELECTED_CLASS));
        assert.notOk(item2.hasClass(Consts.ITEM_SELECTED_CLASS));

        item2.trigger('dxcontextmenu');
        assert.strictEqual(this.wrapper.getContextMenuItems().length, 5, 'context menu items for folders');
        assert.notOk(item1.hasClass(Consts.ITEM_SELECTED_CLASS));
        assert.ok(item2.hasClass(Consts.ITEM_SELECTED_CLASS));
    });

    test('right click by thumbnails item on mobiles', function(assert) {
        if(isDesktopDevice()) {
            assert.ok(true, 'only on mobiles');
            return;
        }

        this.wrapper.getInstance().option({
            itemView: {
                mode: 'thumbnails',
                showFolders: true
            }
        });
        this.clock.tick(400);

        assert.equal(this.wrapper.getContextMenuItems().length, 0);

        this.wrapper.findThumbnailsItem('File 1.txt').trigger('dxcontextmenu');
        assert.strictEqual(this.wrapper.getContextMenuItems().length, 0);

        this.wrapper.findThumbnailsItem('Folder 1').trigger('dxcontextmenu');
        assert.strictEqual(this.wrapper.getContextMenuItems().length, 0);
    });

    test('right click by row and click by select check box', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true);
            return;
        }
        this.wrapper.getSelectCheckBoxInDetailsView(1).trigger('dxclick');

        const $row1 = this.wrapper.getRowInDetailsView(1);
        assert.ok($row1.hasClass(Consts.SELECTION_CLASS));
        assert.equal(this.wrapper.getContextMenuItems().length, 0);

        this.wrapper.getRowNameCellInDetailsView(2).trigger('dxcontextmenu');
        const $row2 = this.wrapper.getRowInDetailsView(2);
        assert.ok($row1.hasClass(Consts.SELECTION_CLASS));
        assert.ok($row2.hasClass(Consts.SELECTION_CLASS));
        assert.ok(this.wrapper.getContextMenuItems().length > 0);
    });

    test('click by row\'s action button', function(assert) {
        const $row1 = this.wrapper.getRowInDetailsView(1);
        $row1.trigger('dxhoverstart');
        this.wrapper.getRowActionButtonInDetailsView(1).trigger('dxclick');

        assert.ok($row1.hasClass(Consts.SELECTION_CLASS));
        assert.ok(this.wrapper.getContextMenuItems().length > 0);

        const $row2 = this.wrapper.getRowInDetailsView(2);
        $row2.trigger('dxhoverstart');
        this.wrapper.getRowActionButtonInDetailsView(2).trigger('dxclick');
        assert.notOk($row1.hasClass(Consts.SELECTION_CLASS));
        assert.ok($row2.hasClass(Consts.SELECTION_CLASS));
        assert.ok(this.wrapper.getContextMenuItems().length > 0);
    });

    test('click by select check box and row\'s action button', function(assert) {
        this.wrapper.getSelectCheckBoxInDetailsView(1).trigger('dxclick');

        const $row1 = this.wrapper.getRowInDetailsView(1);
        assert.ok($row1.hasClass(Consts.SELECTION_CLASS));
        assert.equal(this.wrapper.getContextMenuItems().length, 0);

        const $row2 = this.wrapper.getRowInDetailsView(2);
        $row2.trigger('dxhoverstart');
        this.wrapper.getRowActionButtonInDetailsView(2).trigger('dxclick');
        if(isDesktopDevice()) {
            assert.ok($row1.hasClass(Consts.SELECTION_CLASS));
        }
        assert.ok($row2.hasClass(Consts.SELECTION_CLASS));
        assert.ok(this.wrapper.getContextMenuItems().length > 0);
    });

    test('right click by focused folder node', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getContextMenuItems().length, 0, 'context menu is hidden');

        this.wrapper.getFolderNode(0).trigger('dxcontextmenu');
        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, 'context menu is shown');

        this.wrapper.getContextMenuItem('Refresh').trigger('dxclick');

        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getContextMenuItems(true).length, 0, 'context menu is hidden');

        this.wrapper.getFolderNode(1).trigger('dxcontextmenu');
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, 'context menu is shown');
    });

    test('right click by non focused folder node', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getContextMenuItems().length, 0, 'context menu is hidden');

        this.wrapper.getFolderNode(1).trigger('dxcontextmenu');
        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, 'context menu is shown');

        this.wrapper.getContextMenuItem('Refresh').trigger('dxclick');

        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getContextMenuItems(true).length, 0, 'context menu is hidden');

        this.wrapper.getFolderNode(1).trigger('dxcontextmenu');
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, 'context menu is shown');
    });

    test('click by focused folder node action button', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getContextMenuItems().length, 0, 'context menu is hidden');

        this.wrapper.getFolderActionButton(0).trigger('dxclick');
        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, 'context menu is shown');

        this.wrapper.getContextMenuItem('Refresh').trigger('dxclick');

        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getContextMenuItems(true).length, 0, 'context menu is hidden');

        this.wrapper.getFolderNode(1).trigger('dxcontextmenu');
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, 'context menu is shown');
    });

    test('click by non focused folder node action button', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getContextMenuItems().length, 0, 'context menu is hidden');

        this.wrapper.getFolderActionButton(1).trigger('dxclick');
        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, 'context menu is shown');

        this.wrapper.getContextMenuItem('Refresh').trigger('dxclick');

        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getContextMenuItems(true).length, 0, 'context menu is hidden');

        this.wrapper.getFolderNode(1).trigger('dxcontextmenu');
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, 'context menu is shown');
    });

    test('root folder context menu has restricted items', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getContextMenuItems().length, 0, 'context menu is hidden');

        this.wrapper.getFolderNode(0).trigger('dxcontextmenu');
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItems(true);
        assert.equal($items.length, 3, 'context menu is shown');

        assert.ok($items.eq(0).text().indexOf('New directory') > -1, 'create folder item shown');
        assert.ok($items.eq(1).text().indexOf('Upload files') > -1, 'upload files item shown');
        assert.ok($items.eq(2).text().indexOf('Refresh') > -1, 'refresh item shown');
    });

    test('root folder action button menu has restricted items', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), 'Files', 'root folder selected');
        assert.equal(this.wrapper.getContextMenuItems().length, 0, 'context menu is hidden');

        this.wrapper.getFolderActionButton(0).trigger('dxclick');
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItems(true);
        assert.equal($items.length, 3, 'context menu is shown');

        assert.ok($items.eq(0).text().indexOf('New directory') > -1, 'create folder item shown');
        assert.ok($items.eq(1).text().indexOf('Upload files') > -1, 'upload files item shown');
        assert.ok($items.eq(2).text().indexOf('Refresh') > -1, 'refresh item shown');
    });

    test('Raise the ContextMenuItemClick event on treeView', function(assert) {
        const spy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuItemClick: spy,
            permissions: {
                rename: true
            },
            contextMenu: {
                items: [
                    {
                        name: 'someItem',
                        text: 'someItem',
                        visibilityMode: 'manual',
                        visible: true,
                        items: [
                            {
                                name: 'otherItem',
                                text: 'otherItem',
                                specialField: 123
                            }
                        ]
                    }, 'rename'
                ]
            }
        });
        this.clock.tick(800);

        this.wrapper.getFolderNode(2).trigger('dxcontextmenu');
        this.clock.tick(800);

        let $items = this.wrapper.getContextMenuItems();
        $items.eq(0).trigger('dxclick');
        this.clock.tick(800);

        const itemData = fileManager.option('contextMenu.items[0]');
        const targetFileSystemItem = fileManager.option('fileSystemProvider[1]');

        assert.strictEqual(spy.callCount, 1, 'event raised');
        assert.strictEqual(spy.args[0][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(spy.args[0][0].itemElement).get(0), $items.eq(0).get(0), 'itemElement is correct');
        assert.strictEqual(spy.args[0][0].itemIndex, 0, 'itemIndex is correct');
        assert.strictEqual(spy.args[0][0].itemData, itemData, 'itemData is correct');
        assert.strictEqual(spy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(spy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(spy.args[0][0].fileSystemItem.dataItem, targetFileSystemItem, 'fileSystemItem is correct');
        assert.strictEqual(spy.args[0][0].viewArea, 'navPane', 'viewArea is correct');

        this.wrapper.getFolderNode(2).trigger('dxcontextmenu');
        this.clock.tick(800);

        $items = this.wrapper.getContextMenuItems();
        $items.eq(1).trigger('dxclick');
        this.clock.tick(800);

        assert.strictEqual(spy.callCount, 2, 'event raised');
        assert.strictEqual(spy.args[1][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(spy.args[1][0].itemElement).get(0), $items.eq(1).get(0), 'itemElement is correct');
        assert.strictEqual(spy.args[1][0].itemIndex, 1, 'itemIndex is correct');
        assert.strictEqual(spy.args[1][0].itemData, 'rename', 'itemData is correct');
        assert.strictEqual(spy.args[1][0].component, fileManager, 'component is correct');
        assert.strictEqual($(spy.args[1][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(spy.args[1][0].fileSystemItem.dataItem, targetFileSystemItem, 'fileSystemItem is correct');
        assert.strictEqual(spy.args[1][0].viewArea, 'navPane', 'viewArea is correct');
    });

    test('Raise the ContextMenuItemClick event on subitems', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const spy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuItemClick: spy,
            permissions: {
                rename: true
            },
            contextMenu: {
                items: [
                    {
                        name: 'someItem',
                        text: 'someItem',
                        visibilityMode: 'manual',
                        visible: true,
                        items: [
                            {
                                name: 'otherItem',
                                text: 'otherItem',
                                specialField: 123
                            }
                        ]
                    }, 'rename'
                ]
            }
        });
        this.clock.tick(800);

        this.wrapper.getFolderNode(2).trigger('dxcontextmenu');
        this.clock.tick(800);

        this.wrapper.getContextMenuItems().eq(0).trigger('dxclick');
        spy.resetHistory();
        this.clock.tick(800);

        const $subItems = this.wrapper.getContextMenuSubMenuItems();
        $subItems.eq(0).trigger('dxclick');
        this.clock.tick(800);

        const itemData = fileManager.option('contextMenu.items[0].items[0]');
        const targetFileSystemItem = fileManager.option('fileSystemProvider[1]');

        assert.strictEqual(spy.callCount, 1, 'event raised');
        assert.strictEqual(spy.args[0][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(spy.args[0][0].itemElement).get(0), $subItems.eq(0).get(0), 'itemElement is correct');
        assert.strictEqual(spy.args[0][0].itemIndex, 1, 'itemIndex is correct');
        assert.strictEqual(spy.args[0][0].itemData, itemData, 'itemData is correct');
        assert.strictEqual(spy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(spy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(spy.args[0][0].fileSystemItem.dataItem, targetFileSystemItem, 'fileSystemItem is correct');
        assert.strictEqual(spy.args[0][0].viewArea, 'navPane', 'viewArea is correct');
    });

    test('Raise the ContextMenuItemClick event for items modified on contextMenuShowing', function(assert) {
        const spy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        const contextMenuItems = [
            {
                name: 'someItem',
                text: 'someItem',
                visibilityMode: 'manual',
                visible: true,
                items: [
                    {
                        name: 'otherItem',
                        text: 'otherItem',
                        specialField: 123
                    }
                ]
            }, 'rename'
        ];
        let preparingEventArgs = {};
        fileManager.option({
            onContextMenuShowing: e => {
                e.component.option('contextMenu.items', contextMenuItems);
                preparingEventArgs = e;
            },
            onContextMenuItemClick: spy,
            permissions: {
                rename: true
            },
            contextMenu: {
                items: []
            }
        });
        this.clock.tick(800);

        this.wrapper.getFolderNode(2).trigger('dxcontextmenu');
        this.clock.tick(800);

        let $items = this.wrapper.getContextMenuItems();
        $items.eq(0).trigger('dxclick');
        this.clock.tick(800);

        const targetFileSystemItem = fileManager.option('fileSystemProvider[1]');

        assert.strictEqual(spy.callCount, 1, 'event raised');
        assert.strictEqual(spy.args[0][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(spy.args[0][0].itemElement).get(0), $items.eq(0).get(0), 'itemElement is correct');
        assert.strictEqual(spy.args[0][0].itemIndex, 0, 'itemIndex is correct');
        assert.strictEqual(spy.args[0][0].itemData, contextMenuItems[0], 'itemData is correct');
        assert.strictEqual(spy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(spy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(spy.args[0][0].fileSystemItem.dataItem, preparingEventArgs.fileSystemItem.dataItem, 'integrated fileSystemItem is correct');
        assert.strictEqual(spy.args[0][0].fileSystemItem.dataItem, targetFileSystemItem, 'fileSystemItem is correct');
        assert.strictEqual(spy.args[0][0].viewArea, 'navPane', 'viewArea is correct');

        this.wrapper.getFolderNode(2).trigger('dxcontextmenu');
        this.clock.tick(800);

        $items = this.wrapper.getContextMenuItems();
        $items.eq(1).trigger('dxclick');
        this.clock.tick(800);

        assert.strictEqual(spy.callCount, 2, 'event raised');
        assert.strictEqual(spy.args[1][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(spy.args[1][0].itemElement).get(0), $items.eq(1).get(0), 'itemElement is correct');
        assert.strictEqual(spy.args[1][0].itemIndex, 1, 'itemIndex is correct');
        assert.strictEqual(spy.args[1][0].itemData, 'rename', 'itemData is correct');
        assert.strictEqual(spy.args[1][0].component, fileManager, 'component is correct');
        assert.strictEqual($(spy.args[1][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(spy.args[1][0].fileSystemItem.dataItem, preparingEventArgs.fileSystemItem.dataItem, 'integrated fileSystemItem is correct');
        assert.strictEqual(spy.args[1][0].fileSystemItem.dataItem, targetFileSystemItem, 'fileSystemItem is correct');
        assert.strictEqual(spy.args[1][0].viewArea, 'navPane', 'viewArea is correct');
    });

    test('Raise the contextMenuShowing event on treeView items', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const eventSpy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuShowing: eventSpy,
            permissions: { rename: true }
        });
        this.clock.tick(400);

        const targetItemElement = this.wrapper.getFolderNode(2);
        targetItemElement.trigger('dxcontextmenu');
        this.clock.tick(400);

        const targetFileSystemItem = fileManager.option('fileSystemProvider[1]');

        assert.strictEqual(eventSpy.callCount, 1, 'event raised');
        assert.strictEqual(eventSpy.args[0][0].event.type, 'dxcontextmenu', 'event has correct type');
        assert.strictEqual($(eventSpy.args[0][0].targetElement).get(0), targetItemElement.get(0), 'itemElement is correct');
        assert.strictEqual(eventSpy.args[0][0].fileSystemItem.dataItem, targetFileSystemItem, 'itemData(fileSystemItem) is correct');
        assert.strictEqual(eventSpy.args[0][0].cancel, false, 'cancel flag presents');
        assert.strictEqual(eventSpy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(eventSpy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(eventSpy.args[0][0].viewArea, 'navPane', 'viewArea is correct');
        assert.strictEqual(eventSpy.args[0][0]._isActionButton, false, '_isActionButton flag is correct');
    });

    test('Raise the contextMenuShowing event on treeView actionButtons', function(assert) {
        const eventSpy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuShowing: eventSpy,
            permissions: { rename: true }
        });
        this.clock.tick(400);

        const targetItemElement = this.wrapper.getFolderNode(2);
        this.wrapper.getFolderActionButton(2).trigger('dxclick');
        this.clock.tick(400);

        const targetFileSystemItem = fileManager.option('fileSystemProvider[1]');

        assert.strictEqual(eventSpy.callCount, 1, 'event raised');
        assert.strictEqual(eventSpy.args[0][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(eventSpy.args[0][0].targetElement).get(0), targetItemElement.get(0), 'itemElement is correct');
        assert.strictEqual(eventSpy.args[0][0].fileSystemItem.dataItem, targetFileSystemItem, 'itemData(fileSystemItem) is correct');
        assert.strictEqual(eventSpy.args[0][0].cancel, false, 'cancel flag presents');
        assert.strictEqual(eventSpy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(eventSpy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(eventSpy.args[0][0].viewArea, 'navPane', 'viewArea is correct');
        assert.strictEqual(eventSpy.args[0][0]._isActionButton, true, '_isActionButton flag is correct');
    });

    test('Cancel the context menu on the contextMenuShowing event: treeView', function(assert) {
        const fileManager = this.wrapper.getInstance();
        const contextMenuItems = ['rename', { text: 'someText', beginGroup: true }];
        fileManager.option({
            onContextMenuShowing: e => e.cancel = true,
            permissions: { rename: true },
            contextMenu: { items: contextMenuItems }
        });
        this.clock.tick(400);

        this.wrapper.getFolderActionButton(2).trigger('dxclick');
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItemsWithSeparators();
        assert.equal($items.length, 0, 'context menu is invisible');
    });

    test('Raise the contextMenuShowing event on detailsView items', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const eventSpy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuShowing: eventSpy,
            permissions: { rename: true }
        });
        this.clock.tick(400);

        this.wrapper.getRowNameCellInDetailsView(2).trigger('dxcontextmenu');
        this.clock.tick(400);

        const targetItemElement = this.wrapper.getRowInDetailsView(2);
        const targetFileSystemItem = fileManager.option('fileSystemProvider[4]');

        assert.strictEqual(eventSpy.callCount, 1, 'event raised');
        assert.strictEqual(eventSpy.args[0][0].event.type, 'dxcontextmenu', 'event has correct type');
        assert.strictEqual($(eventSpy.args[0][0].targetElement).get(0), targetItemElement.get(0), 'itemElement is correct');
        assert.strictEqual(eventSpy.args[0][0].fileSystemItem.dataItem, targetFileSystemItem, 'itemData(fileSystemItem) is correct');
        assert.strictEqual(eventSpy.args[0][0].cancel, false, 'cancel flag presents');
        assert.strictEqual(eventSpy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(eventSpy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(eventSpy.args[0][0].viewArea, 'itemView', 'viewArea is correct');
        assert.strictEqual(eventSpy.args[0][0]._isActionButton, false, '_isActionButton flag is correct');
    });

    test('Raise the contextMenuShowing event on detailsView actionButtons', function(assert) {
        const eventSpy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuShowing: eventSpy,
            permissions: { rename: true }
        });
        this.clock.tick(400);

        this.wrapper.getRowActionButtonInDetailsView(2).trigger('dxclick');
        this.clock.tick(400);

        const targetItemElement = this.wrapper.getRowInDetailsView(2);
        const targetFileSystemItem = fileManager.option('fileSystemProvider[4]');

        assert.strictEqual(eventSpy.callCount, 1, 'event raised');
        assert.strictEqual(eventSpy.args[0][0].event.type, 'dxclick', 'event has correct type');
        assert.strictEqual($(eventSpy.args[0][0].targetElement).get(0), targetItemElement.get(0), 'itemElement is correct');
        assert.strictEqual(eventSpy.args[0][0].fileSystemItem.dataItem, targetFileSystemItem, 'itemData(fileSystemItem) is correct');
        assert.strictEqual(eventSpy.args[0][0].cancel, false, 'cancel flag presents');
        assert.strictEqual(eventSpy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(eventSpy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(eventSpy.args[0][0].viewArea, 'itemView', 'viewArea is correct');
        assert.strictEqual(eventSpy.args[0][0]._isActionButton, true, '_isActionButton flag is correct');
    });

    test('Raise the contextMenuShowing event on detailsView free space', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const eventSpy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuShowing: eventSpy,
            permissions: { rename: true }
        });
        this.clock.tick(400);

        this.wrapper.getDetailsViewScrollable().trigger('dxcontextmenu');
        this.clock.tick(400);

        assert.strictEqual(eventSpy.callCount, 1, 'event raised');
        assert.strictEqual(eventSpy.args[0][0].event.type, 'dxcontextmenu', 'event has correct type');
        assert.strictEqual(eventSpy.args[0][0].targetElement, undefined, 'itemElement is correct');
        assert.strictEqual(eventSpy.args[0][0].fileSystemItem, undefined, 'itemData(fileSystemItem) is correct');
        assert.strictEqual(eventSpy.args[0][0].cancel, false, 'cancel flag presents');
        assert.strictEqual(eventSpy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(eventSpy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(eventSpy.args[0][0].viewArea, 'itemView', 'viewArea is correct');
        assert.strictEqual(eventSpy.args[0][0]._isActionButton, false, '_isActionButton flag is correct');
    });

    test('Cancel the context menu on the contextMenuShowing event: detailsView', function(assert) {
        const fileManager = this.wrapper.getInstance();
        const contextMenuItems = ['rename', { text: 'someText', beginGroup: true }];
        fileManager.option({
            onContextMenuShowing: e => e.cancel = true,
            permissions: { rename: true },
            contextMenu: { items: contextMenuItems }
        });
        this.clock.tick(400);

        this.wrapper.getRowActionButtonInDetailsView(2).trigger('dxclick');
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItemsWithSeparators();
        assert.equal($items.length, 0, 'context menu is invisible');
    });

    test('Raise the contextMenuShowing event on thumbnailsView items', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const eventSpy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuShowing: eventSpy,
            permissions: { rename: true },
            itemView: { mode: 'thumbnails' }
        });
        this.clock.tick(400);

        this.wrapper.getThumbnailsItemContent('File 2.jpg').trigger('dxcontextmenu');
        this.clock.tick(400);

        const targetItemElement = this.wrapper.findThumbnailsItem('File 2.jpg');
        const targetFileSystemItem = fileManager.option('fileSystemProvider[4]');

        assert.strictEqual(eventSpy.callCount, 1, 'event raised');
        assert.strictEqual(eventSpy.args[0][0].event.type, 'dxcontextmenu', 'event has correct type');
        assert.strictEqual($(eventSpy.args[0][0].targetElement).get(0), targetItemElement.get(0), 'itemElement is correct');
        assert.strictEqual(eventSpy.args[0][0].fileSystemItem.dataItem, targetFileSystemItem, 'itemData(fileSystemItem) is correct');
        assert.strictEqual(eventSpy.args[0][0].cancel, false, 'cancel flag presents');
        assert.strictEqual(eventSpy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(eventSpy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(eventSpy.args[0][0].viewArea, 'itemView', 'viewArea is correct');
        assert.strictEqual(eventSpy.args[0][0]._isActionButton, false, '_isActionButton flag is correct');
    });

    test('Raise the contextMenuShowing event on thumbnailsView free space', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const eventSpy = sinon.spy();
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuShowing: eventSpy,
            permissions: { rename: true },
            itemView: { mode: 'thumbnails' }
        });
        this.clock.tick(400);

        this.wrapper.getThumbnailsViewScrollable().trigger('dxcontextmenu');
        this.clock.tick(400);

        assert.strictEqual(eventSpy.callCount, 1, 'event raised');
        assert.strictEqual(eventSpy.args[0][0].event.type, 'dxcontextmenu', 'event has correct type');
        assert.strictEqual(eventSpy.args[0][0].targetElement, undefined, 'itemElement is correct');
        assert.strictEqual(eventSpy.args[0][0].fileSystemItem, undefined, 'itemData(fileSystemItem) is correct');
        assert.strictEqual(eventSpy.args[0][0].cancel, false, 'cancel flag presents');
        assert.strictEqual(eventSpy.args[0][0].component, fileManager, 'component is correct');
        assert.strictEqual($(eventSpy.args[0][0].element).get(0), this.$element.get(0), 'element is correct');
        assert.strictEqual(eventSpy.args[0][0].viewArea, 'itemView', 'viewArea is correct');
        assert.strictEqual(eventSpy.args[0][0]._isActionButton, false, '_isActionButton flag is correct');
    });

    test('Cancel the context menu on the contextMenuShowing event: thumbnailsView', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const fileManager = this.wrapper.getInstance();
        const contextMenuItems = ['rename', { text: 'someText', beginGroup: true }];
        fileManager.option({
            onContextMenuShowing: e => e.cancel = true,
            permissions: { rename: true },
            itemView: { mode: 'thumbnails' },
            contextMenu: { items: contextMenuItems }
        });
        this.clock.tick(400);

        this.wrapper.findThumbnailsItem('File 2.jpg').trigger('dxcontextmenu');
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItemsWithSeparators();
        assert.equal($items.length, 0, 'context menu is invisible');
    });

    test('event propagation is stopped for click by folder node T1009625', function(assert) {
        const done = assert.async();
        this.wrapper.getInstance().option({
            onContextMenuShowing: function({ event }) {
                assert.ok(event.isDefaultPrevented(), 'default is prevented');
                assert.ok(event.isPropagationStopped(), 'propagation is stopped');
                done();
            }
        });
        assert.equal(this.wrapper.getContextMenuItems(true).length, 0, 'context menu is hidden');

        this.wrapper.getFolderNode(1).trigger('dxcontextmenu');
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, 'context menu is shown');
    });

});

QUnit.module('Cutomize context menu', moduleConfig, () => {

    test('default items rearrangement and modification', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const testClick = sinon.spy();

        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('contextMenu', {
            items: [
                'move',
                {
                    name: 'create',
                    icon: 'upload',
                    visible: true
                },
                'rename',
                {
                    name: 'upload',
                    visible: true
                },
                'rename', 'copy',
                {
                    name: 'delete',
                    text: 'Destruct'
                },
                {
                    name: 'refresh',
                    onClick: testClick
                }
            ]
        });
        this.clock.tick(800);

        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxcontextmenu');
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItems();
        assert.equal($items.length, 8, 'all of items are visible');

        assert.ok($items.eq(0).text().indexOf('Move') > -1, 'move item is rendered in new position');
        assert.ok($items.eq(1).text().indexOf('New directory') > -1, 'create folder is rendered');
        assert.ok($items.eq(1).find('.dx-icon').hasClass(Consts.UPLOAD_ICON_CLASS), 'create folder item is rendered with new icon');
        assert.ok($items.eq(2).text().indexOf('Rename') > -1, 'rename item is rendered twice');
        assert.ok($items.eq(3).text().indexOf('Upload files') > -1, 'upload files item is rendered below its original position');

        assert.ok($items.eq(4).text().indexOf('Rename') > -1, 'rename item is rendered twice');
        assert.ok($items.eq(5).text().indexOf('Copy') > -1, 'copy item is rendered');
        assert.ok($items.eq(6).text().indexOf('Destruct') > -1, 'delete item is rendered with new text');
        assert.ok($items.eq(7).text().indexOf('Refresh') > -1, 'refresh files item is rendered');
        assert.equal(testClick.callCount, 0, 'refresh has not changed its action');
    });

    test('custom items render and modification', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const testClick = sinon.spy();

        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('contextMenu', {
            items: [
                {
                    name: 'create',
                    visible: true
                },
                {
                    ID: 42,
                    text: 'New commnand text',
                    icon: 'upload',
                    onClick: testClick
                }
            ]
        });
        this.clock.tick(400);

        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxcontextmenu');
        this.clock.tick(400);

        let $items = this.wrapper.getContextMenuItems();
        assert.equal($items.length, 2, 'all of items are visible');

        assert.ok($items.eq(1).text().indexOf('New commnand text') > -1, 'newCommand item is rendered correctly');
        assert.ok($items.eq(1).find('.dx-icon').hasClass(Consts.UPLOAD_ICON_CLASS), 'newCommand item is rendered with new icon');

        $items.eq(1).trigger('dxclick');
        assert.equal(testClick.callCount, 1, 'newCommand has correct action');
        assert.equal(testClick.args[0][0].itemData.ID, 42, 'custom attribute is available from onClick fuction');

        fileManagerInstance.option('contextMenu', {
            items: [
                {
                    name: 'create',
                    visible: true
                },
                {
                    text: 'New commnand text',
                    disabled: true,
                    onClick: testClick
                }
            ]
        });
        this.clock.tick(400);

        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxcontextmenu');
        this.clock.tick(400);

        $items = this.wrapper.getContextMenuItems();
        assert.equal($items.length, 2, 'all of items are visible');

        $items.eq(1).trigger('dxclick');
        assert.equal(testClick.callCount, 1, 'newCommand has no action due to its disabled state');
    });

    test('default items manual visibility management', function(assert) {
        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('contextMenu', {
            items: [
                'create', 'upload',
                {
                    name: 'rename',
                    visible: true
                },
                'move', 'copy', 'delete', 'refresh'
            ]
        });
        this.clock.tick(400);

        this.wrapper.getFolderNode(0).trigger('dxcontextmenu');
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItems();
        assert.equal($items.length, 4, 'all of items are visible');
        assert.ok($items.eq(2).text().indexOf('Rename') > -1, 'rename item is rendered correctly');
    });

    test('nested items set and use', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('contextMenu', {
            items: [
                {
                    text: 'Edit',
                    items: [
                        'move', 'rename', 'copy', 'delete'
                    ]
                }
            ]
        });
        this.clock.tick(400);

        this.wrapper.getDetailsViewScrollable().trigger('dxcontextmenu');
        this.clock.tick(400);

        let $items = this.wrapper.getContextMenuItems();

        $items.eq(0).trigger('dxclick');
        this.clock.tick(400);

        let $subMenuItems = this.wrapper.getContextMenuSubMenuItems();
        assert.equal($subMenuItems.length, 0, 'there is no items available');

        this.wrapper.getToolbarRefreshButton().trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxcontextmenu');
        this.clock.tick(400);

        $items = this.wrapper.getContextMenuItems();

        $items.eq(0).trigger('dxclick');
        this.clock.tick(400);

        $subMenuItems = this.wrapper.getContextMenuSubMenuItems();
        assert.equal($subMenuItems.length, 4, 'all of edit actions are visible');

        $subMenuItems.eq(1).trigger('dxclick');
        this.clock.tick(400);

        this.wrapper.getDialogTextInput()
            .val('New name.txt')
            .trigger('change');
        this.wrapper.getDialogButton('Save').trigger('dxclick');
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), 'New name.txt', 'file is renamed');
    });

    test('context menu for parent directory item contains no edit actions', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const fileManager = this.$element.dxFileManager('instance');
        fileManager.option('currentPath', 'Folder 1');
        this.clock.tick(400);

        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxcontextmenu');
        let menuItems = this.wrapper.getContextMenuItems();
        assert.strictEqual(menuItems.length, 1, 'one menu item shown');
        assert.strictEqual(menuItems.eq(0).text(), 'Refresh', '\'refresh\' menu item shown');

        this.wrapper.getRowNameCellInDetailsView(2).trigger('dxclick');
        this.wrapper.getRowNameCellInDetailsView(2).trigger(pointerEvents.up);
        this.clock.tick(400);

        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxcontextmenu');
        menuItems = this.wrapper.getContextMenuItems();
        assert.strictEqual(menuItems.length, 1, 'one menu item shown');
        assert.strictEqual(menuItems.eq(0).text(), 'Refresh', '\'refresh\' menu item shown');
    });

    test('context menu items can be updated on selection changed event after right button click', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }

        this.fileManager.option({
            contextMenu: {
                items: [ { text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' } ]
            },
            onSelectionChanged: () => {
                this.fileManager.option('contextMenu.items[1].disabled', true);
            }
        });

        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxcontextmenu');
        this.clock.tick(400);

        assert.ok(this.wrapper.getContextMenuItems().eq(1).is(`.${Consts.DISABLED_STATE_CLASS}`), 'item disabled');
    });

    test('context menu items can be updated on selection changed event after action button click', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }

        this.fileManager.option({
            contextMenu: {
                items: [ { text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' } ]
            },
            onSelectionChanged: () => {
                this.fileManager.option('contextMenu.items[1].disabled', true);
            }
        });

        this.wrapper.getRowInDetailsView(1).trigger('dxhoverstart');
        this.wrapper.getRowActionButtonInDetailsView(1).trigger('dxclick');
        this.clock.tick(400);

        assert.ok(this.wrapper.getContextMenuItems().eq(1).is(`.${Consts.DISABLED_STATE_CLASS}`), 'item disabled');
    });

    test('context menu items can be updated for visible menu after action button click', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }

        this.fileManager.option('contextMenu.items', [ { text: 'Item 1' }, { text: 'Item 2' }, { text: 'Item 3' } ]);

        this.wrapper.getRowInDetailsView(1).trigger('dxhoverstart');
        this.wrapper.getRowActionButtonInDetailsView(1).trigger('dxclick');
        this.clock.tick(400);

        this.fileManager.option('contextMenu.items[1].disabled', true);
        this.clock.tick(400);

        assert.ok(this.wrapper.getContextMenuItems().eq(1).is(`.${Consts.DISABLED_STATE_CLASS}`), 'item disabled');
    });

    test('default context menu items can be updated for visible menu after action button click', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }

        this.fileManager.option('contextMenu.items', [ { name: 'copy' }, 'move', 'refresh' ]);

        this.wrapper.getRowInDetailsView(1).trigger('dxhoverstart');
        this.wrapper.getRowActionButtonInDetailsView(1).trigger('dxclick');
        this.clock.tick(400);


        this.fileManager.option('contextMenu.items[0].disabled', true);
        this.clock.tick(400);

        const items = this.wrapper.getContextMenuItems(true);
        assert.strictEqual(items.length, 3, 'all items are shown');
        assert.ok(items.eq(0).is(`.${Consts.DISABLED_STATE_CLASS}`), 'item disabled');
    });

    test('default items visibility - all items are visible (T922557)', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }

        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('contextMenu', {
            items: [
                {
                    name: 'create',
                    visible: true
                },
                {
                    name: 'upload',
                    visible: true
                },
                {
                    name: 'rename',
                    visible: true
                },
                {
                    name: 'move',
                    visible: true
                },
                {
                    name: 'copy',
                    visible: true
                },
                {
                    name: 'delete',
                    visible: true
                },
                {
                    name: 'refresh',
                    visible: true
                },
                {
                    name: 'download',
                    visible: true
                }
            ]
        });
        this.clock.tick(800);

        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxcontextmenu');
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItems();
        assert.equal($items.length, 8, 'all of items but "create" are visible');

        assert.ok($items.eq(0).text().indexOf('New directory') > -1, 'create item is rendered correctly');
        assert.ok($items.eq(1).text().indexOf('Upload files') > -1, 'upload item is rendered correctly');
        assert.ok($items.eq(2).text().indexOf('Rename') > -1, 'rename item is rendered correctly');
        assert.ok($items.eq(3).text().indexOf('Move to') > -1, 'move item is rendered correctly');

        assert.ok($items.eq(4).text().indexOf('Copy to') > -1, 'copy item is rendered correctly');
        assert.ok($items.eq(5).text().indexOf('Delete') > -1, 'delete item is rendered correctly');
        assert.ok($items.eq(6).text().indexOf('Refresh') > -1, 'refresh item is rendered correctly');
        assert.ok($items.eq(7).text().indexOf('Download') > -1, 'download item is rendered correctly');
    });

    test('default items visibility - none items are visible (T922557)', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }

        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('contextMenu', {
            items: [
                {
                    name: 'create',
                    visible: false
                },
                {
                    name: 'upload',
                    visible: false
                },
                {
                    name: 'rename',
                    visible: false
                },
                {
                    name: 'move',
                    visible: false
                },
                {
                    name: 'copy',
                    visible: false
                },
                {
                    name: 'delete',
                    visible: false
                },
                {
                    name: 'refresh',
                    visible: false
                },
                {
                    name: 'download',
                    visible: false
                }
            ]
        });
        this.clock.tick(800);

        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxcontextmenu');
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItems();
        assert.equal($items.length, 0, 'none of items are visible');
    });

    test('Customize the context menu on the contextMenuShowing event: treeView', function(assert) {
        const contextMenuItems = ['rename', { text: 'someText', beginGroup: true }];
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuShowing: e => e.component.option('contextMenu.items', contextMenuItems),
            permissions: { rename: true },
            contextMenu: { items: [] }
        });
        this.clock.tick(400);

        this.wrapper.getFolderActionButton(2).trigger('dxclick');
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItemsWithSeparators();
        assert.equal($items.length, 3, 'all of items are visible');

        assert.strictEqual($items.eq(0).text(), 'Rename', 'first item is correct');
        assert.ok($items.eq(1).hasClass(Consts.CONTEXT_MENU_SEPARATOR_CLASS), 'second item is correct');
        assert.strictEqual($items.eq(2).text(), 'someText', 'third item is correct');
    });

    test('Customize the context menu on the contextMenuShowing event: detailsView', function(assert) {
        const contextMenuItems = ['rename', { text: 'someText', beginGroup: true }];
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuShowing: e => e.component.option('contextMenu.items', contextMenuItems),
            permissions: { rename: true },
            contextMenu: { items: [] }
        });
        this.clock.tick(400);

        this.wrapper.getRowActionButtonInDetailsView(2).trigger('dxclick');
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItemsWithSeparators();
        assert.equal($items.length, 3, 'all of items are visible');

        assert.strictEqual($items.eq(0).text(), 'Rename', 'first item is correct');
        assert.ok($items.eq(1).hasClass(Consts.CONTEXT_MENU_SEPARATOR_CLASS), 'second item is correct');
        assert.strictEqual($items.eq(2).text(), 'someText', 'third item is correct');
    });

    test('Customize the context menu on the contextMenuShowing event: thumbnailsView', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const contextMenuItems = ['rename', { text: 'someText', beginGroup: true }];
        const fileManager = this.wrapper.getInstance();
        fileManager.option({
            onContextMenuShowing: e => e.component.option('contextMenu.items', contextMenuItems),
            permissions: { rename: true },
            itemView: { mode: 'thumbnails' },
            contextMenu: { items: [] }
        });
        this.clock.tick(400);

        this.wrapper.findThumbnailsItem('File 2.jpg').trigger('dxcontextmenu');
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItemsWithSeparators();
        assert.equal($items.length, 3, 'all of items are visible');

        assert.strictEqual($items.eq(0).text(), 'Rename', 'first item is correct');
        assert.ok($items.eq(1).hasClass(Consts.CONTEXT_MENU_SEPARATOR_CLASS), 'second item is correct');
        assert.strictEqual($items.eq(2).text(), 'someText', 'third item is correct');
    });

    test.skip('default items missed and forbidden options (T972377)', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('contextMenu', {
            items: ['upload', {
                name: 'refresh',
                closeMenuOnClick: false,
                selectable: true,
                selected: true,
                items: ['upload', 'refresh']
            }]
        });
        this.clock.tick(400);

        this.wrapper.getDetailsViewScrollable().trigger('dxcontextmenu');
        this.clock.tick(400);

        let $items = this.wrapper.getContextMenuItems(true);
        assert.strictEqual($items.length, 2, 'there are two items');

        $items.eq(1).trigger('mouseenter');
        this.clock.tick(400);

        const $subMenuItems = this.wrapper.getContextMenuSubMenuItems();
        assert.strictEqual($subMenuItems.length, 0, 'there are no items available');

        $items.eq(1).trigger('dxclick');
        this.clock.tick(600);

        $items = this.wrapper.getContextMenuItems(true);
        assert.strictEqual($items.length, 2, 'context menu is still visible');
        assert.ok($items.eq(1).hasClass(Consts.MENU_ITEM_SELECTED_CLASS), 'context menu item is selected');
    });

    test('custom items missed and forbidden options (T972377)', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true, 'only on desktops');
            return;
        }
        const customText = 'customText';
        const clickSpy = sinon.spy();
        const fileManagerInstance = $('#fileManager').dxFileManager('instance');
        fileManagerInstance.option('contextMenu', {
            items: [{
                text: customText,
                closeMenuOnClick: false,
                selectable: true,
                selected: true,
                onClick: clickSpy
            }, 'refresh']
        });
        this.clock.tick(400);

        this.wrapper.getDetailsViewScrollable().trigger('dxcontextmenu');
        this.clock.tick(400);

        let $items = this.wrapper.getContextMenuItems(true);
        assert.strictEqual($items.length, 2, 'there are two items');

        $items.eq(0).trigger('dxclick');
        this.clock.tick(600);

        $items = this.wrapper.getContextMenuItems(true);
        assert.strictEqual(clickSpy.callCount, 1, 'custom command is called');
        assert.strictEqual($items.length, 2, 'context menu is still visible');
        assert.ok($items.eq(0).hasClass(Consts.MENU_ITEM_SELECTED_CLASS), 'context menu item is selected');
    });

    test('Hidden context menu can be updated with change of the permissions option (T1051605)', function(assert) {
        this.wrapper.getRowActionButtonInDetailsView(2).trigger('dxclick');
        this.clock.tick(400);

        let $items = this.wrapper.getContextMenuItems(true);
        assert.equal($items.length, 5, 'all of items are visible');

        assert.strictEqual($items.eq(0).text(), 'Rename', 'first item is correct');
        assert.strictEqual($items.eq(1).text(), 'Move to', 'second item is correct');
        assert.strictEqual($items.eq(2).text(), 'Copy to', 'third item is correct');
        assert.strictEqual($items.eq(3).text(), 'Delete', 'fourth item is correct');
        assert.strictEqual($items.eq(4).text(), 'Refresh', 'fifth item is correct');

        this.wrapper.getContextMenuItem('Refresh').trigger('dxclick');
        this.wrapper.getInstance().option('permissions', { rename: false });
        this.clock.tick(400);

        this.wrapper.getRowActionButtonInDetailsView(2).trigger('dxclick');
        this.clock.tick(400);

        $items = this.wrapper.getContextMenuItems(true);
        assert.equal($items.length, 4, 'fewer items are visible now');

        assert.strictEqual($items.eq(0).text(), 'Move to', 'first item is correct');
        assert.strictEqual($items.eq(1).text(), 'Copy to', 'second item is correct');
        assert.strictEqual($items.eq(2).text(), 'Delete', 'third item is correct');
        assert.strictEqual($items.eq(3).text(), 'Refresh', 'fourth item is correct');
    });

    test('Visible context menu can be updated with change of the permissions option (T1051605)', function(assert) {
        this.wrapper.getRowActionButtonInDetailsView(2).trigger('dxclick');
        this.clock.tick(400);

        let $items = this.wrapper.getContextMenuItems(true);
        assert.equal($items.length, 5, 'all of items are visible');

        assert.strictEqual($items.eq(0).text(), 'Rename', 'first item is correct');
        assert.strictEqual($items.eq(1).text(), 'Move to', 'second item is correct');
        assert.strictEqual($items.eq(2).text(), 'Copy to', 'third item is correct');
        assert.strictEqual($items.eq(3).text(), 'Delete', 'fourth item is correct');
        assert.strictEqual($items.eq(4).text(), 'Refresh', 'fifth item is correct');

        this.wrapper.getInstance().option('permissions', { rename: false });
        this.clock.tick(400);

        $items = this.wrapper.getContextMenuItems(true);
        assert.equal($items.length, 4, 'fewer items are visible now');

        assert.strictEqual($items.eq(0).text(), 'Move to', 'first item is correct');
        assert.strictEqual($items.eq(1).text(), 'Copy to', 'second item is correct');
        assert.strictEqual($items.eq(2).text(), 'Delete', 'third item is correct');
        assert.strictEqual($items.eq(3).text(), 'Refresh', 'fourth item is correct');
    });

});
