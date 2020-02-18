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

        this.wrapper.findThumbnailsItem('Folder 1').trigger('click');
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 1, 'event raised');
        assert.deepEqual(selectionSpy.args[0][0].selectedItems.map(item => item.path), [ 'Folder 1' ], 'selection valid');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [ 'Folder 1' ], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [ 'Folder 1' ], 'item selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [], 'no items deselected');

        this.wrapper.findThumbnailsItem('Folder 2').trigger('click');
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

        this.wrapper.findThumbnailsItem('Folder 1').trigger('click');
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 1, 'event raised');
        assert.deepEqual(selectionSpy.args[0][0].selectedItems.map(item => item.path), [ 'Folder 1' ], 'selection valid');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [ 'Folder 1' ], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [ 'Folder 1' ], 'item selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [], 'no item deselected');

        let e = $.Event('click');
        e.ctrlKey = true;
        this.wrapper.findThumbnailsItem('Folder 3').trigger(e);
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 2, 'event raised');
        assert.deepEqual(selectionSpy.args[1][0].selectedItems.map(item => item.path), [ 'Folder 1', 'Folder 3' ], 'selection valid');
        assert.deepEqual(selectionSpy.args[1][0].selectedItemKeys, [ 'Folder 1', 'Folder 3' ], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[1][0].currentSelectedItemKeys, [ 'Folder 3' ], 'item selected');
        assert.deepEqual(selectionSpy.args[1][0].currentDeselectedItemKeys, [], 'no item deselected');

        e = $.Event('click');
        e.ctrlKey = true;
        this.wrapper.findThumbnailsItem('Folder 1').trigger(e);
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 3, 'event raised');
        assert.deepEqual(selectionSpy.args[2][0].selectedItems.map(item => item.path), [ 'Folder 3' ], 'selection valid');
        assert.deepEqual(selectionSpy.args[2][0].selectedItemKeys, [ 'Folder 3' ], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[2][0].currentSelectedItemKeys, [], 'no item selected');
        assert.deepEqual(selectionSpy.args[2][0].currentDeselectedItemKeys, [ 'Folder 1' ], 'item deselected');

        e = $.Event('click');
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

        this.wrapper.findThumbnailsItem('Folder 1.1').trigger('click');
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 1, 'event raised');
        assert.deepEqual(selectionSpy.args[0][0].selectedItems.map(item => item.path), [ 'Folder 1/Folder 1.1' ], 'selection valid');
        assert.deepEqual(selectionSpy.args[0][0].selectedItemKeys, [ 'Folder 1/Folder 1.1' ], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[0][0].currentSelectedItemKeys, [ 'Folder 1/Folder 1.1' ], 'item selected');
        assert.deepEqual(selectionSpy.args[0][0].currentDeselectedItemKeys, [], 'no item deselected');

        this.wrapper.findThumbnailsItem('..').trigger('click');
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 2, 'event raised');
        assert.deepEqual(selectionSpy.args[1][0].selectedItems.map(item => item.path), [], 'selection valid');
        assert.deepEqual(selectionSpy.args[1][0].selectedItemKeys, [], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[1][0].currentSelectedItemKeys, [], 'no item selected');
        assert.deepEqual(selectionSpy.args[1][0].currentDeselectedItemKeys, [ 'Folder 1/Folder 1.1' ], 'item deselected');

        this.wrapper.findThumbnailsItem('Folder 1.1').trigger('click');
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 3, 'event raised');
        assert.deepEqual(selectionSpy.args[2][0].selectedItems.map(item => item.path), [ 'Folder 1/Folder 1.1' ], 'selection valid');
        assert.deepEqual(selectionSpy.args[2][0].selectedItemKeys, [ 'Folder 1/Folder 1.1' ], 'selection keys valid');
        assert.deepEqual(selectionSpy.args[2][0].currentSelectedItemKeys, [ 'Folder 1/Folder 1.1' ], 'item selected');
        assert.deepEqual(selectionSpy.args[2][0].currentDeselectedItemKeys, [], 'no item deselected');

        const e = $.Event('click');
        e.ctrlKey = true;
        this.wrapper.findThumbnailsItem('..').trigger(e);
        this.clock.tick(400);

        assert.strictEqual(selectionSpy.callCount, 3, 'event not raised');
    });

});
