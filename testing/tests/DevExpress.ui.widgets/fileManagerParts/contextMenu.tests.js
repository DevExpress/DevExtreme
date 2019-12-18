import $ from 'jquery';
const { test } = QUnit;
import 'ui/file_manager';
import fx from 'animation/fx';
import { Consts, FileManagerWrapper, createTestFileSystem } from '../../../helpers/fileManagerHelpers.js';

const moduleConfig = {

    beforeEach: function() {
        const fileSystem = createTestFileSystem();

        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $('#fileManager').dxFileManager({
            fileProvider: fileSystem,
            itemView: {
                showFolders: false
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

        this.wrapper = new FileManagerWrapper(this.$element);

        this.clock.tick(400);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }

};

QUnit.module('Raise context menu', moduleConfig, () => {

    test('right click by row', function(assert) {
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

    test('right click by row and click by select check box', function(assert) {
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
        assert.ok($row1.hasClass(Consts.SELECTION_CLASS));
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

        assert.ok($items.eq(0).text().indexOf('New folder') > -1, 'create folder item shown');
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

        assert.ok($items.eq(0).text().indexOf('New folder') > -1, 'create folder item shown');
        assert.ok($items.eq(1).text().indexOf('Upload files') > -1, 'upload files item shown');
        assert.ok($items.eq(2).text().indexOf('Refresh') > -1, 'refresh item shown');
    });

});
