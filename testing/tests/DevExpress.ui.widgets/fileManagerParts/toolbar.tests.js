import $ from "jquery";
import "ui/file_manager";
import fx from "animation/fx";
import { Consts, FileManagerWrapper, createTestFileSystem } from "../../../helpers/fileManagerHelpers.js";

const { test } = QUnit;

const moduleConfig = {

    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#fileManager");
        this.wrapper = new FileManagerWrapper(this.$element);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }

};

const createFileManager = useThumbnailViewMode => {
    const fileSystem = createTestFileSystem();
    const viewMode = useThumbnailViewMode ? "thumbnails" : "details";

    $("#fileManager").dxFileManager({
        fileProvider: fileSystem,
        itemView: {
            mode: viewMode,
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
};

QUnit.module("Toolbar", moduleConfig, () => {

    test("toolbar updated after selection changing in thumbnails view mode", function(assert) {
        createFileManager(true);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");

        let $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 3, "has buttons");

        assert.ok($elements.eq(0).text().indexOf("New folder") !== -1, "create folder button displayed");
        assert.ok($elements.eq(1).text().indexOf("Upload files") !== -1, "upload files button displayed");
        assert.ok($elements.eq(2).val().indexOf("Thumbnails") !== -1, "view switcher displayed");

        const $item = this.wrapper.findThumbnailsItem("File 1.txt");
        $item.trigger("click");
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), "file toolbar displayed");

        $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 5, "has buttons");

        assert.ok($elements.eq(0).text().indexOf("Move") !== -1, "move displayed");
        assert.ok($elements.eq(1).text().indexOf("Copy") !== -1, "copy displayed");
        assert.ok($elements.eq(2).text().indexOf("Rename") !== -1, "rename displayed");
        assert.ok($elements.eq(3).text().indexOf("Delete") !== -1, "delete button displayed");
        assert.ok($elements.eq(4).text().indexOf("Clear selection") !== -1, "clear selection button displayed");
    });

    test("toolbar updated after folder changing in thumbnails view mode", function(assert) {
        createFileManager(true);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");

        const $item = this.wrapper.findThumbnailsItem("File 1.txt");
        $item.trigger("click");
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), "file toolbar displayed");

        let $folderNode = this.wrapper.getFolderNode(0);
        $folderNode.trigger("dxclick");
        $folderNode.trigger("click");
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");
    });

    test("toolbar updated after selection changing in details view mode", function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");

        let $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 3, "has buttons");

        assert.ok($elements.eq(0).text().indexOf("New folder") !== -1, "create folder button displayed");
        assert.ok($elements.eq(1).text().indexOf("Upload files") !== -1, "upload files button displayed");
        assert.ok($elements.eq(2).val().indexOf("Details") !== -1, "view switcher displayed");

        const $item = this.wrapper.findDetailsItem("File 1.txt");
        $item.trigger("dxclick");
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), "file toolbar displayed");

        $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 5, "has buttons");

        assert.ok($elements.eq(0).text().indexOf("Move") !== -1, "move displayed");
        assert.ok($elements.eq(1).text().indexOf("Copy") !== -1, "copy displayed");
        assert.ok($elements.eq(2).text().indexOf("Rename") !== -1, "rename displayed");
        assert.ok($elements.eq(3).text().indexOf("Delete") !== -1, "delete button displayed");
        assert.ok($elements.eq(4).text().indexOf("Clear selection") !== -1, "clear selection button displayed");
    });

    test("toolbar updated after folder changing in details view mode", function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");

        const $item = this.wrapper.findDetailsItem("File 1.txt");
        $item.trigger("dxclick");
        $item.trigger("click");
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), "file toolbar displayed");

        let $folderNode = this.wrapper.getFolderNode(0);
        $folderNode.trigger("dxclick");
        $folderNode.trigger("click");
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");
    });

    test("Display only general toolbar if file toolbar doesn't have items", function(assert) {
        createFileManager(false);

        const fileManagerInstance = $("#fileManager").dxFileManager("instance");
        fileManagerInstance.option("permissions", {
            create: false,
            copy: false,
            move: false,
            remove: false,
            rename: false,
            upload: false
        });
        this.clock.tick(400);

        const $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");
        assert.ok(!$toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), "file toolbar hidden");

        const $item = this.wrapper.findDetailsItem("File 1.txt");
        $item.trigger("dxclick");
        this.clock.tick(400);

        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");
        assert.ok(!$toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), "file toolbar hidden");
    });

    test("separator for hidden group is not visible", function(assert) {
        createFileManager(true);
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.GENERAL_TOOLBAR_CLASS), "general toolbar displayed");
        assert.equal(this.wrapper.getToolbarSeparators().length, 1, "specified separator visible");

        const $item = this.wrapper.findThumbnailsItem("File 1.txt");
        $item.trigger("click");
        this.clock.tick(400);

        $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), "file toolbar displayed");
        assert.equal(this.wrapper.getToolbarSeparators().length, 1, "specified separator visible");
    });

    test("default items rearrangement and modification", function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManagerInstance = $("#fileManager").dxFileManager("instance");
        fileManagerInstance.option("toolbar", {
            generalItems: [
                {
                    commandName: "showDirsPanel",
                    icon: "upload"
                },
                "upload",
                {
                    commandName: "create",
                    locateInMenu: "always"
                },
                {
                    commandName: "refresh",
                    text: "Reinvigorate"
                },
                {
                    commandName: "separator",
                    location: "after"
                },
                {
                    commandName: "viewMode",
                    location: "before"
                }]
        });
        this.clock.tick(400);

        let $elements = this.wrapper.getGeneralToolbarElements();
        assert.equal($elements.length, 5, "general toolbar has elements");

        assert.ok($elements.eq(0).find(".dx-icon").hasClass(Consts.UPLOAD_ICON_CLASS), "show tree view button is rendered with new icon");
        assert.ok($elements.eq(1).text().indexOf("Upload files") !== -1, "upload files button is rendered in new position");

        const $dropDownMenuButton = this.wrapper.getDropDownMenuButton();
        $dropDownMenuButton.trigger("dxclick");
        this.clock.tick(400);
        const $dropDownMenuItem = this.wrapper.getDropDownMenuItem(0);
        assert.ok($($dropDownMenuItem).find(".dx-button-text").text().indexOf("New folder") !== -1, "create folder button is rendered in the dropDown menu");

        assert.ok($elements.eq(2).val().indexOf("Details") !== -1, "view switcher is rendered in new location");
        assert.ok($elements.eq(3).text().indexOf("Reinvigorate") !== -1, "refresh button is rendered with new text");


        const $item = this.wrapper.findDetailsItem("File 1.txt");
        $item.trigger("dxclick");
        $item.trigger("click");
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), "file toolbar displayed");
    });

    test("custom items render and modification", function(assert) {
        let actionLog = [];
        const log = function(logString) {
            actionLog.push(logString);
        };
        const readLog = function(logStringIndex) {
            if(!logStringIndex) {
                logStringIndex = actionLog.length - 1;
            }
            return actionLog[logStringIndex];
        };
        const clearLog = function() {
            actionLog = [];
        };
        function SayMeow() {
            log("Meow!");
        }
        createFileManager(false);
        this.clock.tick(400);

        const fileManagerInstance = $("#fileManager").dxFileManager("instance");
        fileManagerInstance.option("toolbar", {
            generalItems: [
                "showDirsPanel", "create", "upload", "refresh",
                {
                    commandName: "separator",
                    location: "after"
                },
                "viewMode",
                {
                    commandName: "meow",
                    location: "after",
                    locateInMenu: "never",
                    visible: true,
                    onClick: SayMeow,
                    options:
                        {
                            text: "Cat"
                        }
                }
            ]
        });
        this.clock.tick(400);

        let $elements = this.wrapper.getGeneralToolbarElements();
        assert.equal($elements.length, 6, "general toolbar has elements");

        let $catButton = $elements.eq(5);
        assert.ok($catButton.text().indexOf("Cat") !== -1, "cat button is rendered at correct place");

        $catButton.trigger("dxclick");
        assert.equal(readLog(), "Meow!", "cat button has correct action");

        clearLog();
        fileManagerInstance.option("toolbar", {
            generalItems: [
                "showDirsPanel", "create", "upload", "refresh",
                {
                    commandName: "separator",
                    location: "after"
                },
                "viewMode",
                {
                    commandName: "meow",
                    locateInMenu: "always",
                    visible: true,
                    disabled: true,
                    onClick: SayMeow,
                    options:
                        {
                            text: "Cat"
                        }
                },
                {
                    commandName: "newCommand",
                    location: "after",
                    locateInMenu: "never",
                    visible: false,
                    options:
                        {
                            text: "Some new command",
                            icon: "upload"
                        }
                }
            ]
        });
        this.clock.tick(400);

        $elements = this.wrapper.getGeneralToolbarElements();
        assert.equal($elements.length, 7, "general toolbar has elements");
        const $visibleElements = this.wrapper.getToolbarElements();
        assert.equal($visibleElements.length, 3, "general toolbar has visible elements");

        const $dropDownMenuButton = this.wrapper.getDropDownMenuButton();
        $dropDownMenuButton.trigger("dxclick");
        this.clock.tick(400);

        const dropDownMenuItem = this.wrapper.getDropDownMenuItem(0);
        $catButton = $(dropDownMenuItem).find(".dx-button");
        assert.ok($catButton.find(".dx-button-text").text().indexOf("Cat") !== -1, "cat button is rendered in the dropDown menu");

        $catButton.trigger("dxclick");
        assert.equal(readLog(), undefined, "cat button has no action due to its disabled state");

        const $newCommandButton = $elements.eq(5);
        assert.ok($newCommandButton.text().indexOf("Some new command") !== -1, "new command button is placed correctly");
        assert.ok($newCommandButton.find(".dx-icon").hasClass(Consts.UPLOAD_ICON_CLASS), "new command button has new icon");

        assert.ok($visibleElements.eq(0).text().indexOf("Some new command") === -1);
        assert.ok($visibleElements.eq(1).text().indexOf("Some new command") === -1);
        assert.ok($visibleElements.eq(2).val().indexOf("Some new command") === -1, "new command button is hidden");
    });

    test("default items manual visibility management", function(assert) {
        createFileManager(false);
        this.clock.tick(400);

        const fileManagerInstance = $("#fileManager").dxFileManager("instance");
        fileManagerInstance.option("toolbar", {
            generalItems: [
                "showDirsPanel", "create", "upload", "separator",
                {
                    commandName: "move",
                    visibilityMode: "manual",
                    visible: true,
                    disabled: true
                }, "refresh",
                {
                    commandName: "separator",
                    location: "after"
                },
                "viewMode"
            ]
        });
        this.clock.tick(400);

        let $elements = this.wrapper.getToolbarElements();
        assert.equal($elements.length, 4, "general toolbar has elements");

        assert.ok($elements.eq(2).text().indexOf("Move") !== -1, "move is rendered in new position");

        const $item = this.wrapper.findDetailsItem("File 1.txt");
        $item.trigger("dxclick");
        $item.trigger("click");
        this.clock.tick(400);

        let $toolbar = this.wrapper.getToolbar();
        assert.ok($toolbar.hasClass(Consts.FILE_TOOLBAR_CLASS), "file toolbar displayed");
    });

});
