
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

        var $renameButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Rename')`);
        $renameButton.trigger("dxclick");
        this.clock.tick(400);

        var $input = $(`.${internals.DIALOG_CLASS} .${internals.TEXT_EDITOR_INPUT_CLASS}`);
        assert.equal($input.val(), "Folder 1", "input has value");

        $input.val("TestFolder 1");
        $input.trigger("change");
        var $saveButton = $(`.${internals.POPUP_BOTTOM_CLASS} .${internals.BUTTON_CLASS}:contains('Save')`);
        $saveButton.trigger("dxclick");
        this.clock.tick(400);

        $folderNode = this.$element.find(`.${internals.FOLDERS_TREE_VIEW_ITEM_CLASS}`).eq(0);
        assert.equal($folderNode.text(), "TestFolder 1", "folder renamed");
    });

    test("rename file in items area", (assert) => {
        var $cell = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td`).eq(0);
        assert.equal($cell.text(), "File 1.txt", "has target file");

        $cell.trigger("click");
        this.clock.tick(400);

        var $renameButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Rename')`);
        $renameButton.trigger("dxclick");
        this.clock.tick(400);

        var $input = $(`.${internals.DIALOG_CLASS} .${internals.TEXT_EDITOR_INPUT_CLASS}`);
        assert.equal($input.val(), "File 1.txt", "input has value");

        $input.val("Testfile 11.txt");
        $input.trigger("change");
        var $saveButton = $(`.${internals.POPUP_BOTTOM_CLASS} .${internals.BUTTON_CLASS}:contains('Save')`);
        $saveButton.trigger("dxclick");
        this.clock.tick(400);

        $cell = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td`).eq(0);
        assert.equal($cell.text(), "Testfile 11.txt", "file renamed");
    });

});
