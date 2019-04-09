
/* global internals, createTestFileSystem */

import $ from "jquery";
import "ui/file_manager";
import fx from "animation/fx";

const { test } = QUnit;

const moduleConfig = {
    beforeEach: () => {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#fileManager");
    },

    afterEach: () => {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }
};

const createFileManager = useThumbnailViewMode => {
    const fileSystem = createTestFileSystem();
    const viewMode = useThumbnailViewMode ? "thumbnails" : "details";

    $("#fileManager").dxFileManager({
        fileSystemStore: fileSystem,
        itemList: {
            mode: viewMode,
            showFolders: false,
            showParentFolder: false
        },
        editing: {
            allowCreate: true,
            allowCopy: true,
            allowMove: true,
            allowRemove: true,
            allowRename: true,
            allowUpload: true
        }
    });
};

const getToolbarElements = $element => {
    return $element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_TEXT_CLASS}:visible, .${internals.TOOLBAR_CLASS} .${internals.SELECT_BOX_CLASS}:visible input[type='hidden']`);
};

const findThumbnailsItem = ($element, itemName) => {
    return $element.find(`.${internals.THUMBNAILS_ITEM_CLASS}:contains('${itemName}')`);
};

const findDetailsItem = ($element, itemName) => {
    return $element.find(`.${internals.GRID_DATA_ROW_CLASS} > td:contains('${itemName}')`);
};

const getToolbar = $element => {
    return $element.find(`.${internals.TOOLBAR_CLASS}`);
};

const getFolderNode = ($element, index) => {
    return $element.find(`.${internals.FOLDERS_TREE_VIEW_ITEM_CLASS}`).eq(index);
};

QUnit.module("Toolbar", moduleConfig, () => {

    test("toolbar updated after selection changing in thumbnails view mode", (assert) => {
        createFileManager(true);
        this.clock.tick(400);

        let $toolbar = getToolbar(this.$element);
        assert.ok($toolbar.hasClass(internals.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");

        let $elements = getToolbarElements(this.$element);
        assert.equal($elements.length, 3, "has buttons");

        assert.ok($elements.eq(0).text().indexOf("New folder") !== -1, "create folder button displayed");
        assert.ok($elements.eq(1).text().indexOf("Upload files") !== -1, "upload files button displayed");
        assert.ok($elements.eq(2).val().indexOf("Thumbnails") !== -1, "view switcher displayed");

        const $item = findThumbnailsItem(this.$element, "File 1.txt");
        $item.trigger("click");
        this.clock.tick(400);

        $toolbar = getToolbar(this.$element);
        assert.ok($toolbar.hasClass(internals.FILE_TOOLBAR_CLASS), "file toolbar displayed");

        $elements = getToolbarElements(this.$element);
        assert.equal($elements.length, 4, "has buttons");

        assert.ok($elements.eq(0).text().indexOf("Delete") !== -1, "delete button displayed");
        assert.ok($elements.eq(1).text().indexOf("Move") !== -1, "move displayed");
        assert.ok($elements.eq(2).text().indexOf("Copy") !== -1, "copy displayed");
        assert.ok($elements.eq(3).text().indexOf("Rename") !== -1, "rename displayed");
    });

    test("toolbar updated after folder changing in thumbnails view mode", (assert) => {
        createFileManager(true);
        this.clock.tick(400);

        let $toolbar = getToolbar(this.$element);
        assert.ok($toolbar.hasClass(internals.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");

        const $item = findThumbnailsItem(this.$element, "File 1.txt");
        $item.trigger("click");
        this.clock.tick(400);

        $toolbar = getToolbar(this.$element);
        assert.ok($toolbar.hasClass(internals.FILE_TOOLBAR_CLASS), "file toolbar displayed");

        let $folderNode = getFolderNode(this.$element, 0);
        $folderNode.trigger("dxclick");
        this.clock.tick(400);

        $toolbar = getToolbar(this.$element);
        assert.ok($toolbar.hasClass(internals.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");
    });

    test("toolbar updated after selection changing in details view mode", (assert) => {
        createFileManager(false);
        this.clock.tick(400);

        let $toolbar = getToolbar(this.$element);
        assert.ok($toolbar.hasClass(internals.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");

        let $elements = getToolbarElements(this.$element);
        assert.equal($elements.length, 3, "has buttons");

        assert.ok($elements.eq(0).text().indexOf("New folder") !== -1, "create folder button displayed");
        assert.ok($elements.eq(1).text().indexOf("Upload files") !== -1, "upload files button displayed");
        assert.ok($elements.eq(2).val().indexOf("Details") !== -1, "view switcher displayed");

        const $item = findDetailsItem(this.$element, "File 1.txt");
        $item.trigger("dxclick");
        this.clock.tick(400);

        $toolbar = getToolbar(this.$element);
        assert.ok($toolbar.hasClass(internals.FILE_TOOLBAR_CLASS), "file toolbar displayed");

        $elements = getToolbarElements(this.$element);
        assert.equal($elements.length, 4, "has buttons");

        assert.ok($elements.eq(0).text().indexOf("Delete") !== -1, "delete button displayed");
        assert.ok($elements.eq(1).text().indexOf("Move") !== -1, "move displayed");
        assert.ok($elements.eq(2).text().indexOf("Copy") !== -1, "copy displayed");
        assert.ok($elements.eq(3).text().indexOf("Rename") !== -1, "rename displayed");
    });

    test("toolbar updated after folder changing in details view mode", (assert) => {
        createFileManager(false);
        this.clock.tick(400);

        let $toolbar = getToolbar(this.$element);
        assert.ok($toolbar.hasClass(internals.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");

        const $item = findDetailsItem(this.$element, "File 1.txt");
        $item.trigger("dxclick");
        this.clock.tick(400);

        $toolbar = getToolbar(this.$element);
        assert.ok($toolbar.hasClass(internals.FILE_TOOLBAR_CLASS), "file toolbar displayed");

        let $folderNode = getFolderNode(this.$element, 0);
        $folderNode.trigger("dxclick");
        this.clock.tick(400);

        $toolbar = getToolbar(this.$element);
        assert.ok($toolbar.hasClass(internals.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");
    });

    test("Display only general toolbar if file toolbar doesn't have items", (assert) => {
        createFileManager(false);

        var fileManagerInstance = $("#fileManager").dxFileManager("instance");
        fileManagerInstance.option("editing", {
            allowCreate: false,
            allowCopy: false,
            allowMove: false,
            allowRemove: false,
            allowRename: false,
            allowUpload: false
        });
        this.clock.tick(400);

        const $toolbar = getToolbar(this.$element);
        assert.ok($toolbar.hasClass(internals.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");
        assert.ok(!$toolbar.hasClass(internals.FILE_TOOLBAR_CLASS), "file toolbar hidden");

        const $item = findDetailsItem(this.$element, "File 1.txt");
        $item.trigger("dxclick");
        this.clock.tick(400);

        assert.ok($toolbar.hasClass(internals.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");
        assert.ok(!$toolbar.hasClass(internals.FILE_TOOLBAR_CLASS), "file toolbar hidden");
    });

});
