import $ from "jquery";
const { test } = QUnit;
import "ui/file_manager";
import fx from "animation/fx";
import { Consts, FileManagerWrapper, createTestFileSystem } from "../../../helpers/fileManagerHelpers.js";

const moduleConfig = {

    beforeEach: function() {
        const fileSystem = createTestFileSystem();

        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#fileManager").dxFileManager({
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

QUnit.module("Raise context menu", moduleConfig, () => {

    test('right click by row', function(assert) {
        const $row1 = this.wrapper.getRowInDetailsView(1);
        assert.notOk($row1.hasClass(Consts.SELECTION_CLASS));
        assert.equal(this.wrapper.getContextMenuItems().length, 0);

        this.wrapper.getRowNameCellInDetailsView(1).trigger("dxcontextmenu");
        assert.ok($row1.hasClass(Consts.SELECTION_CLASS));
        assert.ok(this.wrapper.getContextMenuItems().length > 0);

        const $row2 = this.wrapper.getRowInDetailsView(2);
        assert.notOk($row2.hasClass(Consts.SELECTION_CLASS));

        this.wrapper.getRowNameCellInDetailsView(2).trigger("dxcontextmenu");
        assert.notOk($row1.hasClass(Consts.SELECTION_CLASS));
        assert.ok($row2.hasClass(Consts.SELECTION_CLASS));
        assert.ok(this.wrapper.getContextMenuItems().length > 0);
    });

    test('right click by row and click by select check box', function(assert) {
        this.wrapper.getSelectCheckBoxInDetailsView(1).trigger("dxclick");

        const $row1 = this.wrapper.getRowInDetailsView(1);
        assert.ok($row1.hasClass(Consts.SELECTION_CLASS));
        assert.equal(this.wrapper.getContextMenuItems().length, 0);

        this.wrapper.getRowNameCellInDetailsView(2).trigger("dxcontextmenu");
        const $row2 = this.wrapper.getRowInDetailsView(2);
        assert.ok($row1.hasClass(Consts.SELECTION_CLASS));
        assert.ok($row2.hasClass(Consts.SELECTION_CLASS));
        assert.ok(this.wrapper.getContextMenuItems().length > 0);
    });

    test('click by row\'s action button', function(assert) {
        const $row1 = this.wrapper.getRowInDetailsView(1);
        $row1.trigger("dxhoverstart");
        this.wrapper.getRowActionButtonInDetailsView(1).trigger("dxclick");

        assert.ok($row1.hasClass(Consts.SELECTION_CLASS));
        assert.ok(this.wrapper.getContextMenuItems().length > 0);

        const $row2 = this.wrapper.getRowInDetailsView(2);
        $row2.trigger("dxhoverstart");
        this.wrapper.getRowActionButtonInDetailsView(2).trigger("dxclick");
        assert.notOk($row1.hasClass(Consts.SELECTION_CLASS));
        assert.ok($row2.hasClass(Consts.SELECTION_CLASS));
        assert.ok(this.wrapper.getContextMenuItems().length > 0);
    });

    test('click by select check box and row\'s action button', function(assert) {
        this.wrapper.getSelectCheckBoxInDetailsView(1).trigger("dxclick");

        const $row1 = this.wrapper.getRowInDetailsView(1);
        assert.ok($row1.hasClass(Consts.SELECTION_CLASS));
        assert.equal(this.wrapper.getContextMenuItems().length, 0);

        const $row2 = this.wrapper.getRowInDetailsView(2);
        $row2.trigger("dxhoverstart");
        this.wrapper.getRowActionButtonInDetailsView(2).trigger("dxclick");
        assert.ok($row1.hasClass(Consts.SELECTION_CLASS));
        assert.ok($row2.hasClass(Consts.SELECTION_CLASS));
        assert.ok(this.wrapper.getContextMenuItems().length > 0);
    });

    test('right click by focused folder node', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getContextMenuItems().length, 0, "context menu is hidden");

        this.wrapper.getFolderNode(0).trigger("dxcontextmenu");
        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, "context menu is shown");

        this.wrapper.getContextMenuItem("Refresh").trigger("dxclick");

        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getContextMenuItems(true).length, 0, "context menu is hidden");

        this.wrapper.getFolderNode(1).trigger("dxcontextmenu");
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, "context menu is shown");
    });

    test('right click by non focused folder node', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getContextMenuItems().length, 0, "context menu is hidden");

        this.wrapper.getFolderNode(1).trigger("dxcontextmenu");
        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, "context menu is shown");

        this.wrapper.getContextMenuItem("Refresh").trigger("dxclick");

        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getContextMenuItems(true).length, 0, "context menu is hidden");

        this.wrapper.getFolderNode(1).trigger("dxcontextmenu");
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, "context menu is shown");
    });

    test('click by focused folder node action button', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getContextMenuItems().length, 0, "context menu is hidden");

        this.wrapper.getFolderActionButton(0).trigger("dxclick");
        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, "context menu is shown");

        this.wrapper.getContextMenuItem("Refresh").trigger("dxclick");

        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getContextMenuItems(true).length, 0, "context menu is hidden");

        this.wrapper.getFolderNode(1).trigger("dxcontextmenu");
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, "context menu is shown");
    });

    test('click by non focused folder node action button', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getContextMenuItems().length, 0, "context menu is hidden");

        this.wrapper.getFolderActionButton(1).trigger("dxclick");
        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, "context menu is shown");

        this.wrapper.getContextMenuItem("Refresh").trigger("dxclick");

        this.clock.tick(400);
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getContextMenuItems(true).length, 0, "context menu is hidden");

        this.wrapper.getFolderNode(1).trigger("dxcontextmenu");
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.ok(this.wrapper.getContextMenuItems(true).length > 0, "context menu is shown");
    });

    test('root folder context menu has restricted items', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getContextMenuItems().length, 0, "context menu is hidden");

        this.wrapper.getFolderNode(0).trigger("dxcontextmenu");
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItems(true);
        assert.equal($items.length, 3, "context menu is shown");

        assert.ok($items.eq(0).text().indexOf("New directory") > -1, "create folder item shown");
        assert.ok($items.eq(1).text().indexOf("Upload files") > -1, "upload files item shown");
        assert.ok($items.eq(2).text().indexOf("Refresh") > -1, "refresh item shown");
    });

    test('root folder action button menu has restricted items', function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getContextMenuItems().length, 0, "context menu is hidden");

        this.wrapper.getFolderActionButton(0).trigger("dxclick");
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItems(true);
        assert.equal($items.length, 3, "context menu is shown");

        assert.ok($items.eq(0).text().indexOf("New directory") > -1, "create folder item shown");
        assert.ok($items.eq(1).text().indexOf("Upload files") > -1, "upload files item shown");
        assert.ok($items.eq(2).text().indexOf("Refresh") > -1, "refresh item shown");
    });

});

QUnit.module("Cutomize context menu", moduleConfig, () => {

    test("default items rearrangement and modification", function(assert) {
        const testClick = sinon.spy();

        const fileManagerInstance = $("#fileManager").dxFileManager("instance");
        fileManagerInstance.option("contextMenu", {
            items: [
                "move",
                {
                    name: "create",
                    icon: "upload"
                },
                "rename", "upload", "rename", "copy",
                {
                    name: "delete",
                    text: "Destruct"
                },
                {
                    name: "refresh",
                    onClick: testClick
                }
            ]
        });
        this.clock.tick(400);

        this.wrapper.getRowNameCellInDetailsView(1).trigger("dxcontextmenu");
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItems();
        assert.equal($items.length, 8, "all of items are visible");

        assert.ok($items.eq(0).text().indexOf("Move") > -1, "move item is rendered in new position");
        assert.ok($items.eq(1).text().indexOf("New directory") > -1, "create folder is rendered");
        assert.ok($items.eq(1).find(".dx-icon").hasClass(Consts.UPLOAD_ICON_CLASS), "create folder item is rendered with new icon");
        assert.ok($items.eq(2).text().indexOf("Rename") > -1, "rename item is rendered twice");
        assert.ok($items.eq(3).text().indexOf("Upload files") > -1, "upload files item is rendered below its original position");

        assert.ok($items.eq(4).text().indexOf("Rename") > -1, "rename item is rendered twice");
        assert.ok($items.eq(5).text().indexOf("Copy") > -1, "copy item is rendered");
        assert.ok($items.eq(6).text().indexOf("Destruct") > -1, "delete item is rendered with new text");
        assert.ok($items.eq(7).text().indexOf("Refresh") > -1, "refresh files item is rendered");
        assert.equal(testClick.callCount, 0, "refresh has not changed its action");
    });

    test("custom items render and modification", function(assert) {
        const testClick = sinon.spy();

        const fileManagerInstance = $("#fileManager").dxFileManager("instance");
        fileManagerInstance.option("contextMenu", {
            items: [
                "create",
                {
                    ID: 42,
                    text: "New commnand text",
                    icon: "upload",
                    onClick: testClick
                }
            ]
        });
        this.clock.tick(400);

        this.wrapper.getRowNameCellInDetailsView(1).trigger("dxcontextmenu");
        this.clock.tick(400);

        let $items = this.wrapper.getContextMenuItems();
        assert.equal($items.length, 2, "all of items are visible");

        assert.ok($items.eq(1).text().indexOf("New commnand text") > -1, "newCommand item is rendered correctly");
        assert.ok($items.eq(1).find(".dx-icon").hasClass(Consts.UPLOAD_ICON_CLASS), "newCommand item is rendered with new icon");

        $items.eq(1).trigger("dxclick");
        assert.equal(testClick.callCount, 1, "newCommand has correct action");
        assert.equal(testClick.args[0][0].itemData.ID, 42, "custom attribute is available from onClick fuction");

        fileManagerInstance.option("contextMenu", {
            items: [
                "create",
                {
                    text: "New commnand text",
                    disabled: true,
                    onClick: testClick
                }
            ]
        });
        this.clock.tick(400);

        this.wrapper.getRowNameCellInDetailsView(1).trigger("dxcontextmenu");
        this.clock.tick(400);

        $items = this.wrapper.getContextMenuItems();
        assert.equal($items.length, 2, "all of items are visible");

        $items.eq(1).trigger("dxclick");
        assert.equal(testClick.callCount, 1, "newCommand has no action due to its disabled state");
    });

    test("default items manual visibility management", function(assert) {
        const fileManagerInstance = $("#fileManager").dxFileManager("instance");
        fileManagerInstance.option("contextMenu", {
            items: [
                "create", "upload",
                {
                    name: "rename",
                    visible: true
                },
                "move", "copy", "delete", "refresh"
            ]
        });
        this.clock.tick(400);

        this.wrapper.getFolderNode(0).trigger("dxcontextmenu");
        this.clock.tick(400);

        const $items = this.wrapper.getContextMenuItems();
        assert.equal($items.length, 4, "all of items are visible");
        assert.ok($items.eq(2).text().indexOf("Rename") > -1, "rename item is rendered correctly");
    });

    test("nested items set and use", function(assert) {
        const fileManagerInstance = $("#fileManager").dxFileManager("instance");
        fileManagerInstance.option("contextMenu", {
            items: [
                {
                    text: "Edit",
                    items: [
                        "move", "rename", "copy", "delete"
                    ]
                }
            ]
        });
        this.clock.tick(400);

        this.wrapper.getDetailsItemList().trigger("dxcontextmenu");
        this.clock.tick(400);

        let $items = this.wrapper.getContextMenuItems();

        $items.eq(0).trigger("dxclick");
        this.clock.tick(400);

        let $subMenuItems = this.wrapper.getContextMenuSubMenuItems();
        assert.equal($subMenuItems.length, 0, "there is no items available");

        const $commandButton = this.wrapper.getToolbarButton("Refresh");
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        this.wrapper.getRowNameCellInDetailsView(1).trigger("dxcontextmenu");
        this.clock.tick(400);

        $items = this.wrapper.getContextMenuItems();

        $items.eq(0).trigger("dxclick");
        this.clock.tick(400);

        $subMenuItems = this.wrapper.getContextMenuSubMenuItems();
        assert.equal($subMenuItems.length, 4, "all of edit actions are visible");

        $subMenuItems.eq(1).trigger("dxclick");
        this.clock.tick(400);

        this.wrapper.getDialogTextInput()
            .val("New name.txt")
            .trigger("change");
        this.wrapper.getDialogButton("Save").trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), "New name.txt", "file is renamed");
    });

});
