import $ from 'jquery';
import 'ui/file_manager';
import fx from 'animation/fx';
import { FileManagerWrapper, createTestFileSystem } from '../../../helpers/fileManagerHelpers.js';

const { test } = QUnit;

const moduleConfig = {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $('#fileManager').dxFileManager({
            itemView: {
                mode: 'thumbnails'
            },
            fileSystemProvider: createTestFileSystem()
        });

        this.fileManager = this.$element.dxFileManager('instance');

        this.wrapper = new FileManagerWrapper(this.$element);

        this.clock.tick(400);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module('Thumbnails View', moduleConfig, () => {

    test('SelectionChanged event - single selection', function(assert) {
        const selectionSpy = sinon.spy();

        this.fileManager.option({
            selectionMode: 'single',
            onSelectionChanged: selectionSpy
        });
        this.clock.tick(400);

        this.wrapper.findThumbnailsItem('Folder 1').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 1, 'event raised');
        assert.deepEqual(selectionSpy.args[0][0].selectedItems.map(item => item.path), [ 'Folder 1' ], 'selection valid');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [ 'Folder 1' ], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [ 'Folder 1' ], 'item selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [], 'no items deselected');

        this.wrapper.findThumbnailsItem('Folder 2').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 2, 'event raised');
        assert.deepEqual(selectionSpy.args[1][0].selectedItems.map(item => item.path), [ 'Folder 2' ], 'selection valid');
        assert.deepEqual(selectionSpy.args[1][0].selectedItemKeys, [ 'Folder 2' ], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[1][0].currentSelectedItemKeys, [ 'Folder 2' ], 'item selected');
        assert.deepEqual(selectionSpy.args[1][0].currentDeselectedItemKeys, [ 'Folder 1' ], 'previous item deselected');
    });

    test('SelectionChanged event - multiple selection', function(assert) {
        const selectionSpy = sinon.spy();
        this.fileManager.option('onSelectionChanged', selectionSpy);

        this.wrapper.findThumbnailsItem('Folder 1').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 1, 'event raised');
        assert.deepEqual(selectionSpy.args[0][0].selectedItems.map(item => item.path), [ 'Folder 1' ], 'selection valid');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [ 'Folder 1' ], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [ 'Folder 1' ], 'item selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [], 'no item deselected');

        let e = $.Event('dxclick');
        e.ctrlKey = true;
        this.wrapper.findThumbnailsItem('Folder 3').trigger(e);
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 2, 'event raised');
        assert.deepEqual(selectionSpy.args[1][0].selectedItems.map(item => item.path), [ 'Folder 1', 'Folder 3' ], 'selection valid');
        assert.deepEqual(selectionSpy.args[1][0].selectedItemKeys, [ 'Folder 1', 'Folder 3' ], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[1][0].currentSelectedItemKeys, [ 'Folder 3' ], 'item selected');
        assert.deepEqual(selectionSpy.args[1][0].currentDeselectedItemKeys, [], 'no item deselected');

        e = $.Event('dxclick');
        e.ctrlKey = true;
        this.wrapper.findThumbnailsItem('Folder 1').trigger(e);
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 3, 'event raised');
        assert.deepEqual(selectionSpy.args[2][0].selectedItems.map(item => item.path), [ 'Folder 3' ], 'selection valid');
        assert.deepEqual(selectionSpy.args[2][0].selectedItemKeys, [ 'Folder 3' ], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[2][0].currentSelectedItemKeys, [], 'no item selected');
        assert.deepEqual(selectionSpy.args[2][0].currentDeselectedItemKeys, [ 'Folder 1' ], 'item deselected');

        e = $.Event('dxclick');
        e.ctrlKey = true;
        this.wrapper.findThumbnailsItem('Folder 3').trigger(e);
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 4, 'event raised');
        assert.deepEqual(selectionSpy.args[3][0].selectedItems.map(item => item.path), [], 'selection valid');
        assert.deepEqual(selectionSpy.args[3][0].selectedItemKeys, [], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[3][0].currentSelectedItemKeys, [], 'no item selected');
        assert.deepEqual(selectionSpy.args[3][0].currentDeselectedItemKeys, [ 'Folder 3' ], 'item deselected');
    });

    test('SelectionChanged event - parent directory ignored in multiple selection', function(assert) {
        const selectionSpy = sinon.spy();

        this.fileManager.option({
            currentPath: 'Folder 1',
            onSelectionChanged: selectionSpy
        });
        this.clock.tick(400);

        this.wrapper.findThumbnailsItem('Folder 1.1').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 1, 'event raised');
        assert.deepEqual(selectionSpy.args[0][0].selectedItems.map(item => item.path), [ 'Folder 1/Folder 1.1' ], 'selection valid');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [ 'Folder 1/Folder 1.1' ], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [ 'Folder 1/Folder 1.1' ], 'item selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [], 'no item deselected');
        assert.strictEqual(this.fileManager.getSelectedItems().length, 1, 'only one item is selected');

        this.wrapper.findThumbnailsItem('..').trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 2, 'event raised');
        assert.deepEqual(selectionSpy.args[1][0].selectedItems.map(item => item.path), [], 'selection valid');
        assert.deepEqual(selectionSpy.args[1][0].selectedItemKeys, [], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[1][0].currentSelectedItemKeys, [], 'no item selected');
        assert.deepEqual(selectionSpy.args[1][0].currentDeselectedItemKeys, [ 'Folder 1/Folder 1.1' ], 'item deselected');
        assert.strictEqual(this.fileManager.getSelectedItems().length, 0, 'no selected items');

        this.wrapper.findThumbnailsItem('Folder 1.1').trigger('dxclick');
        this.clock.tick(400);

        const oldSelectedItems = this.fileManager.getSelectedItems();

        assert.strictEqual(selectionSpy.callCount, 3, 'event raised');
        assert.deepEqual(selectionSpy.args[2][0].selectedItems.map(item => item.path), [ 'Folder 1/Folder 1.1' ], 'selection valid');
        assert.deepEqual(selectionSpy.args[2][0].selectedItemKeys, [ 'Folder 1/Folder 1.1' ], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[2][0].currentSelectedItemKeys, [ 'Folder 1/Folder 1.1' ], 'item selected');
        assert.deepEqual(selectionSpy.args[2][0].currentDeselectedItemKeys, [], 'no item deselected');
        assert.strictEqual(oldSelectedItems.length, 1, 'only one item is selected');

        const e = $.Event('dxclick');
        e.ctrlKey = true;
        this.wrapper.findThumbnailsItem('..').trigger(e);
        this.clock.tick(400);

        const newSelectedItems = this.fileManager.getSelectedItems();

        assert.strictEqual(selectionSpy.callCount, 3, 'event not raised');
        assert.strictEqual(newSelectedItems.length, 1, 'only one item is selected');
        assert.deepEqual(newSelectedItems, oldSelectedItems, 'selected item has not changed');
    });

    test('Support selection by long tap', function(assert) {
        const selectionSpy = sinon.spy();
        const item1Path = 'Folder 1/Folder 1.1';
        const item2Path = 'Folder 1/Folder 1.2';

        this.fileManager.option({
            currentPath: 'Folder 1',
            onSelectionChanged: selectionSpy
        });
        this.clock.tick(400);

        this.wrapper.getThumbnailsItemContent('Folder 1.1').trigger('dxhold');
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 1, 'event raised');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems.length, 1);
        assert.strictEqual(this.fileManager.getSelectedItems().length, 1, 'one item in selection');
        assert.strictEqual(selectionSpy.args[0][0].selectedItems[0].path, item1Path);
        assert.strictEqual(this.fileManager.getSelectedItems()[0].key, item1Path, 'correct item in selection');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [ item1Path ], 'selected key provided');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [ item1Path ], 'one item became selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [], 'no deselected items');


        this.wrapper.getThumbnailsItemContent('Folder 1.2').trigger('dxhold');
        this.clock.tick(400);

        const oldSelectedItems = this.fileManager.getSelectedItems();

        assert.strictEqual(selectionSpy.callCount, 2, 'event raised');
        assert.strictEqual(selectionSpy.args[1][0].selectedItems.length, 2);
        assert.strictEqual(oldSelectedItems.length, 2, 'two items in selection');
        assert.strictEqual(selectionSpy.args[1][0].selectedItems[0].path, item1Path);
        assert.strictEqual(oldSelectedItems[0].key, item1Path, 'correct item1 in selection');
        assert.strictEqual(selectionSpy.args[1][0].selectedItems[1].path, item2Path);
        assert.strictEqual(oldSelectedItems[1].key, item2Path, 'correct item2 in selection');
        assert.deepEqual(selectionSpy.args[1][0].selectedItemKeys, [ item1Path, item2Path ], 'selected keys provided');
        assert.deepEqual(selectionSpy.args[1][0].currentSelectedItemKeys, [ item2Path ], 'one item became selected');
        assert.deepEqual(selectionSpy.args[1][0].currentDeselectedItemKeys, [], 'no deselected items');

        this.wrapper.getThumbnailsItemContent('..').trigger('dxhold');
        this.clock.tick(400);

        const newSelectedItems = this.fileManager.getSelectedItems();

        assert.strictEqual(selectionSpy.callCount, 2, 'event not raised');
        assert.strictEqual(newSelectedItems.length, 2);
        assert.deepEqual(newSelectedItems, oldSelectedItems, 'selection has not changed');
    });

});
