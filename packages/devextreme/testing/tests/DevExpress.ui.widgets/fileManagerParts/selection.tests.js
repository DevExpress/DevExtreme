import $ from 'jquery';
const { test } = QUnit;
import 'ui/file_manager';
import fx from 'common/core/animation/fx';
import { FileManagerWrapper, createTestFileSystem, isDesktopDevice } from '../../../helpers/fileManagerHelpers.js';
import { triggerCellClick } from '../../../helpers/fileManager/events.js';

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

const createFileManager = (context, options) => {
    const fileSystem = createTestFileSystem();

    const defaultOptions = {
        fileSystemProvider: fileSystem,
        permissions: {
            create: true,
            copy: true,
            move: true,
            delete: true,
            rename: true,
            upload: true
        }
    };

    const finalOptions = $.extend(defaultOptions, options || {});

    context.fileManager = $('#fileManager')
        .dxFileManager(finalOptions)
        .dxFileManager('instance');

    context.clock.tick(400);
};

QUnit.module('Selection', moduleConfig, () => {

    test('Details view - current path and selection synchronous change', function(assert) {
        const selectionSpy = sinon.spy();

        const itemPath1 = 'Folder 1/Folder 1.2';
        createFileManager(this, {
            currentPath: 'Folder 1',
            selectedItemKeys: [ itemPath1 ],
            onSelectionChanged: selectionSpy
        });

        assert.ok(this.wrapper.isDetailsRowSelected(3), 'directory selected');
        assert.strictEqual(selectionSpy.callCount, 0, 'events not raised');

        const itemPath2 = 'Folder 2/File 2-1.jpg';
        this.fileManager.option({
            currentPath: 'Folder 2',
            selectedItemKeys: [ itemPath2 ]
        });
        this.clock.tick(400);

        assert.ok(this.wrapper.isDetailsRowSelected(2), 'directory selected');
        assert.strictEqual(selectionSpy.callCount, 1, 'event raised');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems.length, 1, 'one item in selection');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems[0].path, itemPath2, 'correct item in selection');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [ itemPath2 ], 'selected key provided');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [ itemPath2 ], 'one item became selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [ itemPath1 ], 'one item became deselected');
    });

    test('Thumbnails view - current path and selection synchronous change', function(assert) {
        const selectionSpy = sinon.spy();

        const itemPath1 = 'Folder 1/Folder 1.2';
        createFileManager(this, {
            itemView: {
                mode: 'thumbnails'
            },
            currentPath: 'Folder 1',
            selectedItemKeys: [ itemPath1 ],
            onSelectionChanged: selectionSpy
        });

        assert.ok(this.wrapper.isThumbnailsItemSelected('Folder 1.2'), 'directory selected');
        assert.strictEqual(selectionSpy.callCount, 0, 'events not raised');

        const itemPath2 = 'Folder 2/File 2-1.jpg';
        this.fileManager.option({
            currentPath: 'Folder 2',
            selectedItemKeys: [ itemPath2 ]
        });
        this.clock.tick(400);

        assert.ok(this.wrapper.isThumbnailsItemSelected('File 2-1.jpg'), 'directory selected');
        assert.strictEqual(selectionSpy.callCount, 1, 'event raised');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems.length, 1, 'one item in selection');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems[0].path, itemPath2, 'correct item in selection');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [ itemPath2 ], 'selected key provided');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [ itemPath2 ], 'one item became selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [ itemPath1 ], 'one item became deselected');
    });

    test('Details view - single selection can be cleared', function(assert) {
        const itemPath = 'Folder 2';

        const selectionSpy = sinon.spy();
        const focusSpy = sinon.spy();

        createFileManager(this, {
            selectionMode: 'single',
            onFocusedItemChanged: focusSpy,
            onSelectionChanged: selectionSpy
        });

        const $cell = this.wrapper.getRowNameCellInDetailsView(2);
        triggerCellClick($cell);
        this.clock.tick(400);

        assert.ok(this.wrapper.isDetailsRowFocused(2), 'item selected');
        assert.strictEqual(selectionSpy.callCount, 1, 'selection event raised');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems[0].path, itemPath, 'correct item in selection');
        assert.strictEqual(focusSpy.callCount, 1, 'focused event raised');
        assert.strictEqual(focusSpy.args[0][0].item.path, itemPath, 'focused item is correct');

        this.wrapper.getToolbarButton('Clear').trigger('dxclick');
        this.clock.tick(400);

        assert.notOk(this.wrapper.isDetailsRowFocused(2), 'item not selected');
        assert.strictEqual(selectionSpy.callCount, 2, 'selection event raised');
        assert.deepEqual(selectionSpy.args[1][0].currentDeselectedItemKeys, [ itemPath ], 'correct item in selection');
        assert.strictEqual(focusSpy.callCount, 2, 'focused event raised');
        assert.notOk(focusSpy.args[1][0].item, 'focused item is correct');
    });

    test('Thumbnails view - single selection can be cleared', function(assert) {
        const itemPath = 'Folder 2';

        const selectionSpy = sinon.spy();
        const focusSpy = sinon.spy();

        createFileManager(this, {
            selectionMode: 'single',
            itemView: {
                mode: 'thumbnails'
            },
            onFocusedItemChanged: focusSpy,
            onSelectionChanged: selectionSpy
        });

        const $item = this.wrapper.findThumbnailsItem(itemPath);
        triggerCellClick($item);
        this.clock.tick(400);

        assert.ok(this.wrapper.isThumbnailsItemSelected(itemPath), 'item selected');
        assert.ok(this.wrapper.isThumbnailsItemFocused(itemPath), 'item focused');
        assert.strictEqual(selectionSpy.callCount, 1, 'selection event raised');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems[0].path, itemPath, 'correct item in selection');
        assert.strictEqual(focusSpy.callCount, 1, 'focused event raised');
        assert.strictEqual(focusSpy.args[0][0].item.path, itemPath, 'focused item is correct');

        this.wrapper.getToolbarButton('Clear').trigger('dxclick');
        this.clock.tick(400);

        assert.notOk(this.wrapper.isThumbnailsItemSelected(itemPath), 'item not selected');
        assert.ok(this.wrapper.isThumbnailsItemFocused(itemPath), 'item focused');
        assert.strictEqual(selectionSpy.callCount, 2, 'selection event raised');
        assert.deepEqual(selectionSpy.args[1][0].currentDeselectedItemKeys, [ itemPath ], 'correct item in selection');
        assert.strictEqual(focusSpy.callCount, 1, 'focused event not raised');
    });

    test('Thumbnails view - selection preserved during refresh', function(assert) {
        const itemPath1 = 'Folder 1/Folder 1.2';
        createFileManager(this, {
            itemView: {
                mode: 'thumbnails'
            },
            currentPath: 'Folder 1',
            selectedItemKeys: [ itemPath1 ]
        });

        const selectionSpy = sinon.spy();
        this.fileManager.option('onSelectionChanged', selectionSpy);
        this.fileManager.refresh();
        this.clock.tick(400);

        assert.ok(this.wrapper.isThumbnailsItemSelected('Folder 1.2'), 'directory selected');
        assert.strictEqual(this.wrapper.getThumbnailsSelectedItems().length, 1, 'one item is selected in markup');
        assert.strictEqual(selectionSpy.callCount, 0, 'event not fired');

        this.wrapper.getFolderNode(0).trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getThumbnailsSelectedItems().length, 0, 'no selected items in markup');
        assert.strictEqual(selectionSpy.callCount, 1, 'event fired');
        assert.deepEqual(selectionSpy.args[0][0].selectedItems, [], 'no items in selection');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [], 'no selected keys provided');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [], 'no one item became selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [ itemPath1 ], 'one item became deselected');

        this.wrapper.getFolderNode(1).trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getThumbnailsSelectedItems().length, 0, 'no selected items in markup');
        assert.strictEqual(selectionSpy.callCount, 1, 'no event fired');
    });

    test('Details view - select all raises selection changed event', function(assert) {
        if(!isDesktopDevice()) {
            assert.ok(true);
            return;
        }

        const selectionSpy = sinon.spy();

        createFileManager(this, {
            selectionMode: 'multiple',
            currentPath: 'Folder 1',
            onSelectionChanged: selectionSpy
        });

        this.wrapper.getSelectAllCheckBox().trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 1, 'event fired');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems.length, 4, 'all items in selection');
        assert.strictEqual(selectionSpy.args[0][0].selectedItemKeys.length, 4, 'all selected keys provided');
        assert.strictEqual(selectionSpy.args[0][0].currentSelectedItemKeys.length, 4, 'all items became selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [], 'one item became deselected');
    });

    test('Thumbnails view - single selection works same as in details', function(assert) {
        const selectionSpy = sinon.spy();

        createFileManager(this, {
            selectionMode: 'single',
            itemView: {
                mode: 'thumbnails'
            },
            onSelectionChanged: selectionSpy
        });

        const $item = this.wrapper.findThumbnailsItem('Folder 1');
        triggerCellClick($item);
        this.clock.tick(400);

        assert.ok(this.wrapper.isThumbnailsItemSelected('Folder 1'), 'item selected');
        assert.ok(this.wrapper.isThumbnailsItemFocused('Folder 1'), 'item focused');
        assert.strictEqual(this.wrapper.getThumbnailsSelectedItems().length, 1, 'one item is selected in markup');
        assert.strictEqual(selectionSpy.callCount, 1, 'event fired');

        this.wrapper.getThumbnailsViewPort().trigger($.Event('keydown', { key: 'ArrowRight' }));
        this.clock.tick(400);

        assert.ok(this.wrapper.isThumbnailsItemSelected('Folder 2'), 'next item selected');
        assert.ok(this.wrapper.isThumbnailsItemFocused('Folder 2'), 'next item focused');
        assert.strictEqual(this.wrapper.getThumbnailsSelectedItems().length, 1, 'one item is selected in markup');
        assert.strictEqual(selectionSpy.callCount, 2, 'event fired');

        assert.deepEqual(selectionSpy.args[1][0].selectedItems.map(item => item.key), [ 'Folder 2' ], 'item in selection');
        assert.deepEqual(selectionSpy.args[1][0].selectedItemKeys, [ 'Folder 2' ], 'selected item key provided');
        assert.deepEqual(selectionSpy.args[1][0].currentSelectedItemKeys, [ 'Folder 2' ], 'one item became selected');
        assert.deepEqual(selectionSpy.args[1][0].currentDeselectedItemKeys, [ 'Folder 1' ], 'one item became deselected');
    });

    test('Details view - wrong selected key raises selection changed event', function(assert) {
        const selectionSpy = sinon.spy();

        const selectedItemKeys = [ 'Folder 1/Folder 1.2', 'wrong key' ];
        createFileManager(this, {
            currentPath: 'Folder 1',
            selectedItemKeys,
            onSelectionChanged: selectionSpy
        });

        assert.ok(this.wrapper.isDetailsRowSelected(3), 'directory selected');
        assert.strictEqual(selectionSpy.callCount, 1, 'event raised');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems.length, 1, 'one item in selection');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems[0].path, selectedItemKeys[0], 'correct item in selection');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [ selectedItemKeys[0] ], 'selected key provided');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [], 'no one item became selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [ selectedItemKeys[1] ], 'one item became deselected');
    });

    test('Thumbnails view - wrong selected key raises selection changed event', function(assert) {
        const selectionSpy = sinon.spy();

        const selectedItemKeys = [ 'Folder 1/Folder 1.2', 'wrong key' ];
        createFileManager(this, {
            itemView: {
                mode: 'thumbnails'
            },
            currentPath: 'Folder 1',
            selectedItemKeys,
            onSelectionChanged: selectionSpy
        });

        assert.ok(this.wrapper.isThumbnailsItemSelected('Folder 1.2'), 'directory selected');
        assert.strictEqual(selectionSpy.callCount, 1, 'event raised');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems.length, 1, 'one item in selection');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems[0].path, selectedItemKeys[0], 'correct item in selection');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [ selectedItemKeys[0] ], 'selected key provided');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [], 'no one item became selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [ selectedItemKeys[1] ], 'one item became deselected');
    });

    test('Thumbnails view - focused item key option can be updated', function(assert) {
        const itemName = 'Folder 1.2';
        const itemPath = `Folder 1/${itemName}`;
        const nextItemName = 'File 1-1.txt';

        createFileManager(this, {
            itemView: {
                mode: 'thumbnails'
            },
            currentPath: 'Folder 1',
            focusedItemKey: itemPath
        });

        assert.ok(this.wrapper.isThumbnailsItemFocused(itemName), 'item focused');
        assert.notOk(this.wrapper.isThumbnailsItemSelected(itemName), 'item not selected');

        const $item = this.wrapper.findThumbnailsItem(nextItemName);
        triggerCellClick($item);
        this.clock.tick(400);

        assert.notOk(this.wrapper.isThumbnailsItemFocused(itemName), 'item not focused');
        assert.ok(this.wrapper.isThumbnailsItemFocused(nextItemName), 'next item focused');
        assert.ok(this.wrapper.isThumbnailsItemSelected(nextItemName), 'next item selected');
        assert.strictEqual(this.fileManager.option('focusedItemKey'), `Folder 1/${nextItemName}`, 'option updated to the next item key');

        this.fileManager.option('focusedItemKey', itemPath);
        this.clock.tick(400);

        assert.ok(this.wrapper.isThumbnailsItemFocused(itemName), 'item focused');
        assert.notOk(this.wrapper.isThumbnailsItemSelected(itemName), 'item selected');
        assert.notOk(this.wrapper.isThumbnailsItemFocused(nextItemName), 'next item not focused');
        assert.ok(this.wrapper.isThumbnailsItemSelected(nextItemName), 'next item selected');
        assert.strictEqual(this.fileManager.option('focusedItemKey'), itemPath, 'option updated to the item key');
    });

    test('Details view - focused item key option can be updated', function(assert) {
        const itemPath = 'Folder 1/Folder 1.2';

        createFileManager(this, {
            currentPath: 'Folder 1',
            focusedItemKey: itemPath
        });

        assert.ok(this.wrapper.isDetailsRowFocused(3), 'item focused');
        assert.notOk(this.wrapper.isDetailsRowSelected(3), 'item not selected');

        const $cell = this.wrapper.getRowNameCellInDetailsView(4);
        triggerCellClick($cell);
        this.clock.tick(400);

        assert.notOk(this.wrapper.isDetailsRowFocused(3), 'item not focused');
        assert.ok(this.wrapper.isDetailsRowFocused(4), 'next item focused');
        assert.ok(this.wrapper.isDetailsRowSelected(4), 'next item selected');
        assert.strictEqual(this.fileManager.option('focusedItemKey'), 'Folder 1/File 1-1.txt', 'option updated to the next item key');

        this.fileManager.option('focusedItemKey', itemPath);
        this.clock.tick(400);

        assert.ok(this.wrapper.isDetailsRowFocused(3), 'item focused');
        assert.notOk(this.wrapper.isDetailsRowSelected(3), 'item selected');
        assert.notOk(this.wrapper.isDetailsRowFocused(4), 'next item not focused');
        assert.ok(this.wrapper.isDetailsRowSelected(4), 'next item selected');
        assert.strictEqual(this.fileManager.option('focusedItemKey'), itemPath, 'option updated to the item key');
    });

    test('Thumbnails view - focusedItemChanged is not raised when initial valid focusedItemKey specified', function(assert) {
        const itemName = 'Folder 1.2';
        const itemPath = `Folder 1/${itemName}`;
        const focusedItemSpy = sinon.spy();

        createFileManager(this, {
            itemView: {
                mode: 'thumbnails'
            },
            currentPath: 'Folder 1',
            focusedItemKey: itemPath,
            onFocusedItemChanged: focusedItemSpy
        });

        assert.ok(this.wrapper.isThumbnailsItemFocused(itemName), 'item focused');
        assert.notOk(this.wrapper.isThumbnailsItemSelected(itemName), 'item not selected');
        assert.strictEqual(focusedItemSpy.callCount, 0, 'event is not raised');
    });

    test('Thumbnails view - focusedItemChanged raised when initial invalid focusedItemKey specified', function(assert) {
        const focusedItemSpy = sinon.spy();

        createFileManager(this, {
            itemView: {
                mode: 'thumbnails'
            },
            currentPath: 'Folder 1',
            focusedItemKey: 'wrong key',
            onFocusedItemChanged: focusedItemSpy
        });

        assert.strictEqual(focusedItemSpy.callCount, 1, 'event is raised');
        assert.notOk(focusedItemSpy.args[0][0].item, 'item not specified');
        assert.notOk(focusedItemSpy.args[0][0].itemElement, 'itemElement not specified');
    });

    test('Details view - focusedItemChanged is not raised when initial valid focusedItemKey specified', function(assert) {
        const itemPath = 'Folder 1/Folder 1.2';
        const focusedItemSpy = sinon.spy();

        createFileManager(this, {
            currentPath: 'Folder 1',
            focusedItemKey: itemPath,
            onFocusedItemChanged: focusedItemSpy
        });

        assert.ok(this.wrapper.isDetailsRowFocused(3), 'item focused');
        assert.notOk(this.wrapper.isDetailsRowSelected(3), 'item not selected');
        assert.strictEqual(focusedItemSpy.callCount, 0, 'event is not raised');
    });
});
