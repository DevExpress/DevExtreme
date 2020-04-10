import $ from 'jquery';
const { test } = QUnit;
import 'ui/file_manager';
import fx from 'animation/fx';
import { FileManagerWrapper, createTestFileSystem } from '../../../helpers/fileManagerHelpers.js';
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
        assert.ok(selectionSpy.callCount <= 1, 'event fired not more then once');

        const itemPath2 = 'Folder 2/File 2-1.jpg';
        this.fileManager.option({
            currentPath: 'Folder 2',
            selectedItemKeys: [ itemPath2 ]
        });
        this.clock.tick(400);

        const lastIndex = selectionSpy.callCount - 1;
        assert.ok(this.wrapper.isThumbnailsItemSelected('File 2-1.jpg'), 'directory selected');
        assert.ok(selectionSpy.callCount <= 3, 'events raised not more 3 times');
        assert.strictEqual(selectionSpy.args[lastIndex][0].selectedItems.length, 1, 'one item in selection');
        assert.strictEqual(selectionSpy.args[lastIndex][0].selectedItems[0].path, itemPath2, 'correct item in selection');
        assert.deepEqual(selectionSpy.args[lastIndex][0].selectedItemKeys, [ itemPath2 ], 'selected key provided');
        assert.deepEqual(selectionSpy.args[lastIndex][0].currentSelectedItemKeys, [ itemPath2 ], 'one item became selected');
        assert.deepEqual(selectionSpy.args[lastIndex - 1][0].currentDeselectedItemKeys, [ itemPath1 ], 'one item became deselected');
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

});
