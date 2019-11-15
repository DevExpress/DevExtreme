import $ from "jquery";
import "ui/file_manager";
import fx from "animation/fx";
import { Consts, FileManagerWrapper, FileManagerProgressPanelWrapper, createTestFileSystem } from "../../../helpers/fileManagerHelpers.js";

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
                upload: true,
                download: true
            }
        });

        this.wrapper = new FileManagerWrapper(this.$element);
        this.progressPanelWrapper = new FileManagerProgressPanelWrapper(this.$element);

        this.clock.tick(400);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module("Editing operations", moduleConfig, () => {

    test("rename folder in folders area", function(assert) {
        let $folderNode = this.wrapper.getFolderNode(1);
        assert.equal($folderNode.find("span").text(), "Folder 1", "has target folder");

        $folderNode.trigger("dxclick");
        $folderNode.trigger("click");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('Rename')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        const $input = $(`.${Consts.DIALOG_CLASS} .${Consts.TEXT_EDITOR_INPUT_CLASS}`);
        assert.equal($input.val(), "Folder 1", "input has value");

        $input.val("TestFolder 1");
        $input.trigger("change");
        const $okButton = $(`.${Consts.POPUP_BOTTOM_CLASS} .${Consts.BUTTON_CLASS}:contains('Save')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        $folderNode = this.wrapper.getFolderNode(1);
        assert.equal($folderNode.find("span").text(), "TestFolder 1", "folder renamed");

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
    });

    test("rename folder in folders area by Enter in dialog input", function(assert) {
        let $folderNode = this.wrapper.getFolderNode(1);
        assert.equal($folderNode.find("span").text(), "Folder 1", "has target folder");

        $folderNode.trigger("dxclick");
        $folderNode.trigger("click");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('Rename')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        const $input = $(`.${Consts.DIALOG_CLASS} .${Consts.TEXT_EDITOR_INPUT_CLASS}`);
        assert.equal($input.val(), "Folder 1", "input has value");

        $input.val("TestFolder 1");
        $input.trigger("change");

        $input.trigger($.Event("keyup", { key: "enter" }));
        this.clock.tick(400);

        $folderNode = this.wrapper.getFolderNode(1);
        assert.equal($folderNode.find("span").text(), "TestFolder 1", "folder renamed");

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
    });

    test("rename file in items area", function(assert) {
        let $cell = this.$element.find(`.${Consts.GRID_DATA_ROW_CLASS} > td`).eq(1);
        assert.equal(this.wrapper.getDetailsItemName(0), "File 1.txt", "has target file");

        $cell.trigger("dxclick");
        this.$element.find(`.${Consts.ITEMS_GRID_VIEW_CLASS}`).trigger("click");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('Rename')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        const $input = $(`.${Consts.DIALOG_CLASS} .${Consts.TEXT_EDITOR_INPUT_CLASS}`);
        assert.equal($input.val(), "File 1.txt", "input has value");

        $input.val("Testfile 11.txt");
        $input.trigger("change");
        const $okButton = $(`.${Consts.POPUP_BOTTOM_CLASS} .${Consts.BUTTON_CLASS}:contains('Save')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        $cell = this.$element.find(`.${Consts.GRID_DATA_ROW_CLASS} > td`).eq(1);
        assert.equal(this.wrapper.getDetailsItemName(0), "Testfile 11.txt", "file renamed");

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
    });

    test("create folder in folders area from items area without folders", function(assert) {
        const $row = this.$element.find(`.${Consts.GRID_DATA_ROW_CLASS}`).eq(1);
        $row.trigger("dxclick");

        assert.ok($row.hasClass(Consts.SELECTION_CLASS), "file selected");

        const $commandButton = this.$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('New directory')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        const $input = $(`.${Consts.DIALOG_CLASS} .${Consts.TEXT_EDITOR_INPUT_CLASS}`);
        assert.ok($input.has(":focus"), "dialog's input element should be focused");
        assert.equal("Untitled directory", $input.val(), "input has default value");

        $input.val("Test 4");
        $input.trigger("change");
        const $okButton = $(`.${Consts.POPUP_BOTTOM_CLASS} .${Consts.BUTTON_CLASS}:contains('Create')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        const $folderNode = this.wrapper.getFolderNode(4);
        assert.equal($folderNode.find("span").text(), "Test 4", "folder created");

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
    });

    test("create folder in folders area from items area without folders by Enter in dialog input", function(assert) {
        const $row = this.$element.find(`.${Consts.GRID_DATA_ROW_CLASS}`).eq(1);
        $row.trigger("dxclick");

        assert.ok($row.hasClass(Consts.SELECTION_CLASS), "file selected");

        const $commandButton = this.$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('New directory')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        const $input = $(`.${Consts.DIALOG_CLASS} .${Consts.TEXT_EDITOR_INPUT_CLASS}`);
        assert.ok($input.has(":focus"), "dialog's input element should be focused");
        assert.equal("Untitled directory", $input.val(), "input has default value");

        $input.val("Test 4");
        $input.trigger("change");

        $input.trigger($.Event("keyup", { key: "enter" }));
        this.clock.tick(400);

        const $folderNode = this.wrapper.getFolderNode(4);
        assert.equal($folderNode.find("span").text(), "Test 4", "folder created");

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
    });

    test("create sub-folder for new folder", function(assert) {
        this.$element.dxFileManager("option", {
            itemView: {
                showParentFolder: true,
                showFolders: true
            }
        });
        this.clock.tick(400);

        this.wrapper.getFolderNodes().eq(2).trigger("dxclick");
        let togglesCount = this.wrapper.getFolderToggles().length;
        assert.equal(this.wrapper.getFocusedItemText(), "Folder 2", "sub folder selected");
        assert.ok(togglesCount >= 2, "specfied toggles shown");

        this.wrapper.getToolbarButton("New directory").trigger("dxclick");
        this.clock.tick(400);

        $(`.${Consts.DIALOG_CLASS} .${Consts.TEXT_EDITOR_INPUT_CLASS}`).val("test 111").trigger("change");
        $(`.${Consts.POPUP_BOTTOM_CLASS} .${Consts.BUTTON_CLASS}:contains('Create')`).trigger("dxclick");
        this.clock.tick(400);

        let $cell = this.wrapper.findDetailsItem("test 111");
        assert.equal($cell.length, 1, "new folder created");
        assert.equal(this.wrapper.getFolderToggles().length, ++togglesCount, "new folder toggle shown");

        $cell.trigger("dxdblclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "test 111", "new folder selected");
        assert.equal(this.wrapper.getFolderToggles().length, togglesCount, "toggle count is not changed");

        this.wrapper.getToolbarButton("New directory").trigger("dxclick");
        this.clock.tick(400);

        $(`.${Consts.DIALOG_CLASS} .${Consts.TEXT_EDITOR_INPUT_CLASS}`).val("test 222").trigger("change");
        $(`.${Consts.POPUP_BOTTOM_CLASS} .${Consts.BUTTON_CLASS}:contains('Create')`).trigger("dxclick");
        this.clock.tick(400);

        $cell = this.wrapper.findDetailsItem("test 222");
        assert.equal($cell.length, 1, "new folder created");
        assert.equal(this.wrapper.getFolderToggles().length, ++togglesCount, "new folder toggle shown");

        $cell.trigger("dxdblclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "test 222", "new folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/Folder 2/test 111/test 222", "correct path shown");
        assert.equal(this.wrapper.getFolderToggles().length, togglesCount, "toggle count is not changed");
    });

    test("delete folder in folders area", function(assert) {
        let $folderNodes = this.wrapper.getFolderNodes();
        const initialCount = $folderNodes.length;
        const $folderNode = $folderNodes.eq(1);
        assert.equal($folderNode.find("span").text(), "Folder 1", "has target folder");

        $folderNode.trigger("dxclick");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('Delete')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        $folderNodes = this.wrapper.getFolderNodes();
        assert.equal($folderNodes.length, initialCount - 1, "folders count decreased");
        assert.ok($folderNodes.eq(1).find("span").text().indexOf("Folder 1") === -1, "first folder is not target folder");
        assert.ok($folderNodes.eq(2).find("span").text().indexOf("Folder 1") === -1, "second folder is not target folder");

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
    });

    test("delete file in items area", function(assert) {
        let $rows = this.$element.find(`.${Consts.GRID_DATA_ROW_CLASS}`);
        const initialCount = $rows.length;

        const $cell = $rows.find("td").eq(1);
        assert.equal(this.wrapper.getDetailsItemName(0), "File 1.txt", "has target file");

        $cell.trigger("dxclick");
        this.$element.find(`.${Consts.ITEMS_GRID_VIEW_CLASS}`).trigger("click");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('Delete')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        $rows = this.$element.find(`.${Consts.GRID_DATA_ROW_CLASS}`);
        assert.equal($rows.length, initialCount - 1, "files count decreased");
        assert.ok($rows.eq(0).text().indexOf("File 1.txt") === -1, "first folder is not target folder");
        assert.ok($rows.eq(1).text().indexOf("File 1.txt") === -1, "second folder is not target folder");

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
    });

    test("delete file from subfolder in items area", function(assert) {
        this.wrapper.getFolderNodes().eq(1).trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Folder 1", "sub folder selected");

        let $rows = this.$element.find(`.${Consts.GRID_DATA_ROW_CLASS}`);
        const initialCount = $rows.length;

        const $cell = $rows.find("td").eq(1);
        assert.equal(this.wrapper.getDetailsItemName(0), "File 1-1.txt", "has target file");

        $cell.trigger("dxclick");
        this.$element.find(`.${Consts.ITEMS_GRID_VIEW_CLASS}`).trigger("click");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('Delete')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        $rows = this.$element.find(`.${Consts.GRID_DATA_ROW_CLASS}`);
        assert.equal($rows.length, initialCount - 1, "files count decreased");
        assert.ok($rows.eq(0).text().indexOf("File 1-1.txt") === -1, "first folder is not target folder");
        assert.ok($rows.eq(1).text().indexOf("File 1-1.txt") === -1, "second folder is not target folder");

        assert.equal(this.wrapper.getFocusedItemText(), "Folder 1", "sub folder selected");
    });

    test("move folder in folders area", function(assert) {
        let $folderNodes = this.wrapper.getFolderNodes();
        const initialCount = $folderNodes.length;
        const $folderNode = $folderNodes.eq(1);
        assert.equal($folderNode.find("span").text(), "Folder 1", "has target folder");

        $folderNode.trigger("dxclick");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('Move')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger("dxclick");

        const $okButton = $(`.${Consts.POPUP_BOTTOM_CLASS} .${Consts.BUTTON_CLASS}:contains('Select')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Folder 3", "destination folder should be selected");

        $folderNodes = this.wrapper.getFolderNodes();
        assert.equal($folderNodes.length, initialCount - 1, "folders count decreased");
        assert.equal($folderNodes.eq(1).find("span").text(), "Folder 2", "first folder is not target folder");
        assert.equal($folderNodes.eq(2).find("span").text(), "Folder 3", "second folder is not target folder");

        const $folderToggles = this.wrapper.getFolderToggles();
        $folderToggles.eq(1).trigger("dxclick");
        this.clock.tick(400);

        $folderNodes = this.wrapper.getFolderNodes();
        assert.equal($folderNodes.eq(3).find("span").text(), "Folder 1", "target folder moved");
        $folderNodes.eq(3).trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), "File 1-1.txt", "file moved with target folder");
        assert.equal(this.wrapper.getDetailsItemName(1), "File 1-2.jpg", "file moved with target folder");
    });

    test("copy folder in folders area", function(assert) {
        let $folderNodes = this.wrapper.getFolderNodes();
        const $folderNode = $folderNodes.eq(1);
        assert.equal($folderNode.find("span").text(), "Folder 1", "has target folder");

        $folderNode.trigger("dxclick");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('Copy')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger("dxclick");

        const $okButton = $(`.${Consts.POPUP_BOTTOM_CLASS} .${Consts.BUTTON_CLASS}:contains('Select')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Folder 3", "target folder should be selected");

        $folderNodes = this.wrapper.getFolderNodes();
        assert.equal($folderNodes.eq(4).find("span").text(), "Folder 1", "target folder copied");
        $folderNodes.eq(4).trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), "File 1-1.txt", "file copied with target folder");
        assert.equal(this.wrapper.getDetailsItemName(1), "File 1-2.jpg", "file copied with target folder");

        $folderNodes = this.wrapper.getFolderNodes();
        assert.equal($folderNodes.eq(1).find("span").text(), "Folder 1", "first folder is target folder");
        assert.equal($folderNodes.eq(2).find("span").text(), "Folder 2", "second folder is not target folder");
        assert.equal($folderNodes.eq(3).find("span").text(), "Folder 3", "third folder is not target folder");
    });

    test("move file in items area", function(assert) {
        let $cells = this.$element.find(`.${Consts.GRID_DATA_ROW_CLASS} > td:nth-child(2)`);
        const initialCount = $cells.length;
        const $cell = $cells.eq(0);
        assert.equal(this.wrapper.getDetailsItemName(0), "File 1.txt", "has target file");

        $cell.trigger("dxclick");
        this.$element.find(`.${Consts.ITEMS_GRID_VIEW_CLASS}`).trigger("click");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('Move')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        let $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger("dxclick");

        const $okButton = $(`.${Consts.POPUP_BOTTOM_CLASS} .${Consts.BUTTON_CLASS}:contains('Select')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Folder 3", "destination folder should be selected");

        assert.equal(this.wrapper.getDetailsItemName(0), "File 1.txt", "file moved to another folder");

        $folderNodes = this.wrapper.getFolderNodes();
        $folderNodes.eq(0).trigger("dxclick");
        this.clock.tick(400);

        $cells = this.$element.find(`.${Consts.GRID_DATA_ROW_CLASS} > td:nth-child(2)`);
        assert.equal($cells.length, initialCount - 1, "file count decreased");
        assert.equal(this.wrapper.getDetailsItemName(0), "File 2.jpg", "first file is not target file");
        assert.equal(this.wrapper.getDetailsItemName(1), "File 3.xml", "second file is not target file");
    });

    test("copy file in items area", function(assert) {
        let $cells = this.$element.find(`.${Consts.GRID_DATA_ROW_CLASS} > td:nth-child(2)`);
        const initialCount = $cells.length;
        const $cell = $cells.eq(0);
        assert.equal(this.wrapper.getDetailsItemName(0), "File 1.txt", "has target file");

        $cell.trigger("dxclick");
        this.$element.find(`.${Consts.ITEMS_GRID_VIEW_CLASS}`).trigger("click");
        this.clock.tick(400);

        const $commandButton = this.$element.find(`.${Consts.TOOLBAR_CLASS} .${Consts.BUTTON_CLASS}:contains('Copy')`);
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");

        let $folderNodes = this.wrapper.getFolderNodes(true);
        $folderNodes.eq(3).trigger("dxclick");

        const $okButton = $(`.${Consts.POPUP_BOTTOM_CLASS} .${Consts.BUTTON_CLASS}:contains('Select')`);
        $okButton.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), "File 1.txt", "file moved to another folder");

        $folderNodes = this.wrapper.getFolderNodes();
        $folderNodes.eq(0).trigger("dxclick");
        this.clock.tick(400);

        $cells = this.$element.find(`.${Consts.GRID_DATA_ROW_CLASS} > td:nth-child(2)`);
        assert.equal($cells.length, initialCount, "file count not changed");
        assert.equal(this.wrapper.getDetailsItemName(0), "File 1.txt", "first file is the target file");
        assert.equal(this.wrapper.getDetailsItemName(1), "File 2.jpg", "second file is not target file");
    });

    test("rename file failed for not allowed extension", function(assert) {
        assert.equal(this.wrapper.getDetailsItemName(0), "File 1.txt", "has target file");

        this.wrapper.getRowNameCellInDetailsView(1).trigger("dxclick");
        this.wrapper.getDetailsItemList().trigger("click");
        this.clock.tick(400);

        this.wrapper.getToolbarButton("Rename").trigger("dxclick");
        this.clock.tick(400);

        this.wrapper.getDialogTextInput()
            .val("Testpage 11.aspx")
            .trigger("change");
        this.wrapper.getDialogButton("Save").trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getDetailsItemName(0), "File 1.txt", "file was not renamed");
    });

    test("download file", function(assert) {
        const fileManager = this.$element.dxFileManager("instance");
        const fileProvider = fileManager._controller._fileProvider;
        sinon.stub(fileProvider, "downloadItems");

        assert.equal(this.wrapper.getDetailsItemName(0), "File 1.txt", "has target file");

        this.wrapper.getRowNameCellInDetailsView(1).trigger("dxclick");
        this.wrapper.getDetailsItemList().trigger("click");
        this.clock.tick(400);

        this.wrapper.getToolbarButton("Download").filter(":visible").trigger("dxclick");
        this.clock.tick(400);

        assert.strictEqual(fileProvider.downloadItems.callCount, 1, "downloadItems method called");
        const items = fileProvider.downloadItems.args[0][0];
        assert.strictEqual(items.length, 1, "downloadItems args is valid");
        assert.strictEqual(items[0].name, "File 1.txt", "downloadItems args is valid");

        fileProvider.downloadItems.restore();
    });

    test("copying file must be completed in progress panel and current directory must be changed to the destination", function(assert) {
        const longPath = "Files/Folder 1/Folder 1.1/Folder 1.1.1/Folder 1.1.1.1/Folder 1.1.1.1.1";
        assert.equal(this.progressPanelWrapper.getInfos().length, 0, "there is no operations");

        let $cells = this.wrapper.getColumnCellsInDetailsView(2);
        const initialCount = $cells.length;
        const $cell = $cells.eq(0);
        assert.equal(this.wrapper.getDetailsItemName(0), "File 1.txt", "has target file");

        $cell.trigger("dxclick");
        this.wrapper.getDetailsItemList().trigger("click");
        this.clock.tick(400);

        this.wrapper.getToolbarButton("Copy").trigger("dxclick");
        this.clock.tick(400);
        this.wrapper.getFolderToggle(1, true).trigger("dxclick");
        this.clock.tick(400);
        this.wrapper.getFolderToggle(2, true).trigger("dxclick");
        this.clock.tick(400);
        this.wrapper.getFolderToggle(3, true).trigger("dxclick");
        this.clock.tick(400);
        this.wrapper.getFolderToggle(4, true).trigger("dxclick");
        this.clock.tick(400);
        this.wrapper.getFolderNode(5, true).trigger("dxclick");
        this.clock.tick(400);

        this.wrapper.getDialogButton("Select").trigger("dxclick");
        this.clock.tick(1200);

        assert.equal(this.wrapper.getDetailsItemName(0), "Special deep file.txt", "has specail file");
        assert.equal(this.wrapper.getDetailsItemName(1), "File 1.txt", "file copied to another folder");
        assert.equal(this.wrapper.getFocusedItemText(), "Folder 1.1.1.1.1", "target folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), longPath, "breadcrumbs refrers to the target folder");

        const infos = this.progressPanelWrapper.getInfos();
        assert.equal(infos.length, 1, "one operation is present");

        const common = infos[0].common;
        assert.equal(common.commonText, "Copied an item to Folder 1.1.1.1.1", "common text is correct");
        assert.equal(common.progressBarValue, 100, "task is completed");

        this.wrapper.getFolderNode(0).trigger("dxclick");
        this.clock.tick(400);

        $cells = this.wrapper.getColumnCellsInDetailsView(2);
        assert.equal($cells.length, initialCount, "file count not changed");
        assert.equal(this.wrapper.getDetailsItemName(0), "File 1.txt", "first file is the target file");
        assert.equal(this.wrapper.getDetailsItemName(1), "File 2.jpg", "second file is not target file");
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
    });

});
