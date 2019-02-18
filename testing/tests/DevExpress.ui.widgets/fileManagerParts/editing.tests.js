
/* global internals, createTestFileSystem */

import $ from "jquery";
import "ui/file_manager";
import fx from "animation/fx";

const { test } = QUnit;

const moduleConfig = {
    beforeEach: () => {
        var fileSystem = createTestFileSystem();

        this.clock = sinon.useFakeTimers();
        fx.off = true;

        $("#fileManager").dxFileManager({
            fileSystemType: "data",
            jsonData: fileSystem
        });

        this.clock.tick(400);
    },

    afterEach: () => {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module("Editing operations", moduleConfig, () => {

    test("rename folder in folders area", (assert) => {
        var $folderNode = this.$element.find(`.${internals.FOLDERS_TREE_VIEW_ITEM_CLASS}`).eq(0);
        assert.equal($folderNode.text(), "Folder 1", "has target folder");

        $folderNode.trigger("dxclick");
        this.clock.tick(400);

        var $commandButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Rename')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        var $input = $(`.${internals.DIALOG_CLASS} .${internals.TEXT_EDITOR_INPUT_CLASS}`);
        assert.equal($input.val(), "Folder 1", "input has value");

        $input.val("TestFolder 1");
        $input.trigger("change");
        var $okButton = $(`.${internals.POPUP_BOTTOM_CLASS} .${internals.BUTTON_CLASS}:contains('Save')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        $folderNode = this.$element.find(`.${internals.FOLDERS_TREE_VIEW_ITEM_CLASS}`).eq(0);
        assert.equal($folderNode.text(), "TestFolder 1", "folder renamed");
    });

    test("rename file in items area", (assert) => {
        var $cell = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td`).eq(0);
        assert.equal($cell.text(), "File 1.txt", "has target file");

        $cell.trigger("click");
        this.clock.tick(400);

        var $commandButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Rename')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        var $input = $(`.${internals.DIALOG_CLASS} .${internals.TEXT_EDITOR_INPUT_CLASS}`);
        assert.equal($input.val(), "File 1.txt", "input has value");

        $input.val("Testfile 11.txt");
        $input.trigger("change");
        var $okButton = $(`.${internals.POPUP_BOTTOM_CLASS} .${internals.BUTTON_CLASS}:contains('Save')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        $cell = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td`).eq(0);
        assert.equal($cell.text(), "Testfile 11.txt", "file renamed");
    });

    test("create folder in folders area from items area without folders", (assert) => {
        var $row = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS}`).eq(0);
        $row.trigger("dxclick");

        assert.ok($row.hasClass(internals.SELECTION_CLASS), "file selected");

        var $commandButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Create')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        var $input = $(`.${internals.DIALOG_CLASS} .${internals.TEXT_EDITOR_INPUT_CLASS}`);
        assert.notOk($input.val(), "input has not value");

        $input.val("Test 4");
        $input.trigger("change");
        var $okButton = $(`.${internals.POPUP_BOTTOM_CLASS} .${internals.BUTTON_CLASS}:contains('Create')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        var $folderNode = this.$element.find(`.${internals.FOLDERS_TREE_VIEW_ITEM_CLASS}`).eq(3);
        assert.equal($folderNode.text(), "Test 4", "folder created");
    });

    test("delete folder in folders area", (assert) => {
        var $folderNode = this.$element.find(`.${internals.FOLDERS_TREE_VIEW_ITEM_CLASS}`).eq(0);
        assert.equal($folderNode.text(), "Folder 1", "has target folder");

        $folderNode.trigger("dxclick");
        this.clock.tick(400);

        var $commandButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Delete')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        var $folderNodes = this.$element.find(`.${internals.FOLDERS_TREE_VIEW_ITEM_CLASS}`);
        assert.equal($folderNodes.length, 2, "folders count decreased");
        assert.ok($folderNodes.eq(0).text().indexOf("Folder 1") === -1, "first folder is not target folder");
        assert.ok($folderNodes.eq(1).text().indexOf("Folder 1") === -1, "second folder is not target folder");
    });

});
