/* global internals, createTestFileSystem */

import $ from "jquery";
const { test } = QUnit;
import "ui/file_manager";
import fx from "animation/fx";

const moduleConfig = {
    beforeEach: () => {
        const fileSystem = createTestFileSystem();

        this.clock = sinon.useFakeTimers();
        fx.off = true;

        $("#fileManager").dxFileManager({
            fileProvider: fileSystem,
            itemView: {
                showFolders: false
            },
            selectionMode: "multiple"
        });

        this.clock.tick(400);
    },

    afterEach: () => {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }
};

const getRowActionButtonInDetailsView = ($element, index) => getRowInDetailsView($element, index).find(".dx-filemanager-file-actions-button");

const getSelectCheckBoxInDetailsView = ($element, index) => getRowInDetailsView($element, index).find("td").eq(0);

const getRowNameCellInDetailsView = ($element, index) => getRowInDetailsView($element, index).find("td").eq(1);

const getRowInDetailsView = ($element, index) => $element.find(`.${internals.GRID_DATA_ROW_CLASS}[aria-rowindex=${index}]`);

const getContextMenuItems = () => $(".dx-context-menu .dx-menu-item");

QUnit.module("Raise context menu", moduleConfig, () => {
    test('right click by row', assert => {
        const $row1 = getRowInDetailsView(this.$element, 1);
        assert.notOk($row1.hasClass("dx-selection"));
        assert.equal(getContextMenuItems().length, 0);

        getRowNameCellInDetailsView(this.$element, 1).trigger("dxcontextmenu");
        assert.ok($row1.hasClass("dx-selection"));
        assert.ok(getContextMenuItems().length > 0);

        const $row2 = getRowInDetailsView(this.$element, 2);
        assert.notOk($row2.hasClass("dx-selection"));

        getRowNameCellInDetailsView(this.$element, 2).trigger("dxcontextmenu");
        assert.notOk($row1.hasClass("dx-selection"));
        assert.ok($row2.hasClass("dx-selection"));
        assert.ok(getContextMenuItems().length > 0);
    });

    test('right click by row and click by select check box', assert => {
        getSelectCheckBoxInDetailsView(this.$element, 1).trigger("dxclick");

        const $row1 = getRowInDetailsView(this.$element, 1);
        assert.ok($row1.hasClass("dx-selection"));
        assert.equal(getContextMenuItems().length, 0);

        getRowNameCellInDetailsView(this.$element, 2).trigger("dxcontextmenu");
        const $row2 = getRowInDetailsView(this.$element, 2);
        assert.ok($row1.hasClass("dx-selection"));
        assert.ok($row2.hasClass("dx-selection"));
        assert.ok(getContextMenuItems().length > 0);
    });

    test('click by row\'s action button', assert => {
        const $row1 = getRowInDetailsView(this.$element, 1);
        $row1.trigger("dxhoverstart");
        getRowActionButtonInDetailsView(this.$element, 1).trigger("dxclick");

        assert.ok($row1.hasClass("dx-selection"));
        assert.ok(getContextMenuItems().length > 0);

        const $row2 = getRowInDetailsView(this.$element, 2);
        $row2.trigger("dxhoverstart");
        getRowActionButtonInDetailsView(this.$element, 2).trigger("dxclick");
        assert.notOk($row1.hasClass("dx-selection"));
        assert.ok($row2.hasClass("dx-selection"));
        assert.ok(getContextMenuItems().length > 0);
    });

    test('click by select check box and row\'s action button', assert => {
        getSelectCheckBoxInDetailsView(this.$element, 1).trigger("dxclick");

        const $row1 = getRowInDetailsView(this.$element, 1);
        assert.ok($row1.hasClass("dx-selection"));
        assert.equal(getContextMenuItems().length, 0);

        const $row2 = getRowInDetailsView(this.$element, 2);
        $row2.trigger("dxhoverstart");
        getRowActionButtonInDetailsView(this.$element, 2).trigger("dxclick");
        assert.ok($row1.hasClass("dx-selection"));
        assert.ok($row2.hasClass("dx-selection"));
        assert.ok(getContextMenuItems().length > 0);

    });

});
