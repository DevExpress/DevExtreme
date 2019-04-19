
/* global internals, createTestFileSystem */

import $ from "jquery";
import "ui/file_manager";
import fx from "animation/fx";

const { test } = QUnit;

const moduleConfig = {
    beforeEach: function() {
        const fileSystem = createTestFileSystem();

        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#fileManager").dxFileManager({
            fileProvider: fileSystem,
            selectionMode: "single",
            itemView: {
                showFolders: false,
                showParentFolder: false
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

        this.clock.tick(400);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }
};

const getFolderNode = ($element, index, inDialog) => {
    return getFolderNodes($element, inDialog).eq(index);
};

const getFocusedItemText = $element => {
    return $element.find(`.${internals.CONTAINER_CLASS} .${internals.FOCUSED_ITEM_CLASS}`).text();
};

const getFolderNodes = ($element, inDialog) => {
    if(inDialog) {
        return $(`.${internals.DIALOG_CLASS} .${internals.FOLDERS_TREE_VIEW_ITEM_CLASS}`);
    } else {
        return $element.find(`.${internals.CONTAINER_CLASS} .${internals.FOLDERS_TREE_VIEW_ITEM_CLASS}`);
    }
};

const getFolderToggles = ($element, inDialog) => {
    if(inDialog) {
        return $(`.${internals.DIALOG_CLASS} .${internals.FOLDERS_TREE_VIEW_ITEM_TOGGLE_CLASS}`);
    } else {
        return $element.find(`.${internals.CONTAINER_CLASS} .${internals.FOLDERS_TREE_VIEW_ITEM_TOGGLE_CLASS}`);
    }
};

QUnit.module("Editing operations", moduleConfig, () => {

    test("rename folder in folders area", function(assert) {
        let $folderNode = getFolderNode(this.$element, 1);
        assert.equal($folderNode.text(), "Folder 1", "has target folder");

        $folderNode.trigger("dxclick");
        $folderNode.trigger("click");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Rename')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        const $input = $(`.${internals.DIALOG_CLASS} .${internals.TEXT_EDITOR_INPUT_CLASS}`);
        assert.equal($input.val(), "Folder 1", "input has value");

        $input.val("TestFolder 1");
        $input.trigger("change");
        const $okButton = $(`.${internals.POPUP_BOTTOM_CLASS} .${internals.BUTTON_CLASS}:contains('Save')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        $folderNode = getFolderNode(this.$element, 1);
        assert.equal($folderNode.text(), "TestFolder 1", "folder renamed");

        assert.equal(getFocusedItemText(this.$element), "Files", "root folder selected");
    });

    test("rename file in items area", function(assert) {
        let $cell = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td`).eq(1);
        assert.equal($cell.get(0).childNodes[0].textContent, "File 1.txt", "has target file");

        $cell.trigger("dxclick");
        this.$element.find(`.${internals.ITEMS_GRID_VIEW_CLASS}`).trigger("click");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Rename')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        const $input = $(`.${internals.DIALOG_CLASS} .${internals.TEXT_EDITOR_INPUT_CLASS}`);
        assert.equal($input.val(), "File 1.txt", "input has value");

        $input.val("Testfile 11.txt");
        $input.trigger("change");
        const $okButton = $(`.${internals.POPUP_BOTTOM_CLASS} .${internals.BUTTON_CLASS}:contains('Save')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        $cell = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td`).eq(1);
        assert.equal($cell.get(0).childNodes[0].textContent, "Testfile 11.txt", "file renamed");

        assert.equal(getFocusedItemText(this.$element), "Files", "root folder selected");
    });

    test("create folder in folders area from items area without folders", function(assert) {
        const $row = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS}`).eq(1);
        $row.trigger("dxclick");

        assert.ok($row.hasClass(internals.SELECTION_CLASS), "file selected");

        const $commandButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('New folder')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        const $input = $(`.${internals.DIALOG_CLASS} .${internals.TEXT_EDITOR_INPUT_CLASS}`);
        assert.notOk($input.val(), "input has not value");

        $input.val("Test 4");
        $input.trigger("change");
        const $okButton = $(`.${internals.POPUP_BOTTOM_CLASS} .${internals.BUTTON_CLASS}:contains('Create')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        const $folderNode = getFolderNode(this.$element, 4);
        assert.equal($folderNode.text(), "Test 4", "folder created");

        assert.equal(getFocusedItemText(this.$element), "Files", "root folder selected");
    });

    test("delete folder in folders area", function(assert) {
        let $folderNodes = getFolderNodes(this.$element);
        const initialCount = $folderNodes.length;
        const $folderNode = $folderNodes.eq(1);
        assert.equal($folderNode.text(), "Folder 1", "has target folder");

        $folderNode.trigger("dxclick");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Delete')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        $folderNodes = getFolderNodes(this.$element);
        assert.equal($folderNodes.length, initialCount - 1, "folders count decreased");
        assert.ok($folderNodes.eq(1).text().indexOf("Folder 1") === -1, "first folder is not target folder");
        assert.ok($folderNodes.eq(2).text().indexOf("Folder 1") === -1, "second folder is not target folder");

        assert.equal(getFocusedItemText(this.$element), "Files", "root folder selected");
    });

    test("delete file in items area", function(assert) {
        let $rows = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS}`);
        const initialCount = $rows.length;

        const $cell = $rows.find("td").eq(1);
        assert.equal($cell.get(0).childNodes[0].textContent, "File 1.txt", "has target file");

        $cell.trigger("dxclick");
        this.$element.find(`.${internals.ITEMS_GRID_VIEW_CLASS}`).trigger("click");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Delete')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        $rows = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS}`);
        assert.equal($rows.length, initialCount - 1, "files count decreased");
        assert.ok($rows.eq(0).text().indexOf("File 1.txt") === -1, "first folder is not target folder");
        assert.ok($rows.eq(1).text().indexOf("File 1.txt") === -1, "second folder is not target folder");

        assert.equal(getFocusedItemText(this.$element), "Files", "root folder selected");
    });

    test("move folder in folders area", function(assert) {
        let $folderNodes = getFolderNodes(this.$element);
        const initialCount = $folderNodes.length;
        const $folderNode = $folderNodes.eq(1);
        assert.equal($folderNode.text(), "Folder 1", "has target folder");

        $folderNode.trigger("dxclick");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Move')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        $folderNodes = getFolderNodes(this.$element, true);
        $folderNodes.eq(3).trigger("dxclick");

        const $okButton = $(`.${internals.POPUP_BOTTOM_CLASS} .${internals.BUTTON_CLASS}:contains('Select')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(getFocusedItemText(this.$element), "Files", "root folder selected");

        $folderNodes = getFolderNodes(this.$element);
        assert.equal($folderNodes.length, initialCount - 1, "folders count decreased");
        assert.equal($folderNodes.eq(1).text(), "Folder 2", "first folder is not target folder");
        assert.equal($folderNodes.eq(2).text(), "Folder 3", "second folder is not target folder");

        const $folderToggles = getFolderToggles(this.$element);
        $folderToggles.eq(2).trigger("dxclick");
        this.clock.tick(400);

        $folderNodes = getFolderNodes(this.$element);
        assert.equal($folderNodes.eq(3).text(), "Folder 1", "target folder moved");
        $folderNodes.eq(3).trigger("dxclick");
        this.clock.tick(400);

        const $cells = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td:nth-child(2)`);
        assert.equal($cells.get(0).childNodes[0].textContent, "File 1-1.txt", "file moved with target folder");
        assert.equal($cells.get(1).childNodes[0].textContent, "File 1-2.jpg", "file moved with target folder");
    });

    test("copy folder in folders area", function(assert) {
        let $folderNodes = getFolderNodes(this.$element);
        const initialCount = $folderNodes.length;
        const $folderNode = $folderNodes.eq(1);
        assert.equal($folderNode.text(), "Folder 1", "has target folder");

        $folderNode.trigger("dxclick");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Copy')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        $folderNodes = getFolderNodes(this.$element, true);
        $folderNodes.eq(3).trigger("dxclick");

        const $okButton = $(`.${internals.POPUP_BOTTOM_CLASS} .${internals.BUTTON_CLASS}:contains('Select')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(getFocusedItemText(this.$element), "Folder 1", "target folder selected");

        $folderNodes = getFolderNodes(this.$element);
        assert.equal($folderNodes.length, initialCount, "folders count not changed");
        assert.equal($folderNodes.eq(1).text(), "Folder 1", "first folder is target folder");
        assert.equal($folderNodes.eq(2).text(), "Folder 2", "second folder is not target folder");

        const $folderToggles = getFolderToggles(this.$element);
        $folderToggles.eq(3).trigger("dxclick");
        this.clock.tick(400);

        $folderNodes = getFolderNodes(this.$element);
        assert.equal($folderNodes.eq(4).text(), "Folder 1", "target folder copied");
        $folderNodes.eq(4).trigger("dxclick");
        this.clock.tick(400);

        const $cells = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td:nth-child(2)`);
        assert.equal($cells.get(0).childNodes[0].textContent, "File 1-1.txt", "file copied with target folder");
        assert.equal($cells.get(1).childNodes[0].textContent, "File 1-2.jpg", "file copied with target folder");
    });

    test("move file in items area", function(assert) {
        let $cells = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td:nth-child(2)`);
        const initialCount = $cells.length;
        const $cell = $cells.eq(0);
        assert.equal($cell.get(0).childNodes[0].textContent, "File 1.txt", "has target file");

        $cell.trigger("dxclick");
        this.$element.find(`.${internals.ITEMS_GRID_VIEW_CLASS}`).trigger("click");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Move')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        let $folderNodes = getFolderNodes(this.$element, true);
        $folderNodes.eq(3).trigger("dxclick");

        const $okButton = $(`.${internals.POPUP_BOTTOM_CLASS} .${internals.BUTTON_CLASS}:contains('Select')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(getFocusedItemText(this.$element), "Files", "root folder selected");

        $cells = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td:nth-child(2)`);
        assert.equal($cells.length, initialCount - 1, "file count decreased");
        assert.equal($cells.get(0).childNodes[0].textContent, "File 2.jpg", "first file is not target file");
        assert.equal($cells.get(1).childNodes[0].textContent, "File 3.xml", "second file is not target file");

        $folderNodes = getFolderNodes(this.$element);
        $folderNodes.eq(3).trigger("dxclick");
        this.clock.tick(400);

        $cells = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td:nth-child(2)`);
        assert.equal($cells.get(0).childNodes[0].textContent, "File 1.txt", "file moved to another folder");
    });

    test("copy file in items area", function(assert) {
        let $cells = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td:nth-child(2)`);
        const initialCount = $cells.length;
        const $cell = $cells.eq(0);
        assert.equal($cell.get(0).childNodes[0].textContent, "File 1.txt", "has target file");

        $cell.trigger("dxclick");
        this.$element.find(`.${internals.ITEMS_GRID_VIEW_CLASS}`).trigger("click");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}:contains('Copy')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(getFocusedItemText(this.$element), "Files", "root folder selected");

        let $folderNodes = getFolderNodes(this.$element, true);
        $folderNodes.eq(3).trigger("dxclick");

        const $okButton = $(`.${internals.POPUP_BOTTOM_CLASS} .${internals.BUTTON_CLASS}:contains('Select')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        $cells = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td:nth-child(2)`);
        assert.equal($cells.length, initialCount, "file count not changed");
        assert.equal($cells.get(0).childNodes[0].textContent, "File 1.txt", "first file is the target file");
        assert.equal($cells.get(1).childNodes[0].textContent, "File 2.jpg", "second file is not target file");

        $folderNodes = getFolderNodes(this.$element);
        $folderNodes.eq(3).trigger("dxclick");
        this.clock.tick(400);

        $cells = this.$element.find(`.${internals.GRID_DATA_ROW_CLASS} > td:nth-child(2)`);
        assert.equal($cells.get(0).childNodes[0].textContent, "File 1.txt", "file moved to another folder");
    });

});
