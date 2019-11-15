import $ from "jquery";
import renderer from "core/renderer";
const { test } = QUnit;
import "ui/file_manager";
import FileItemsController from "ui/file_manager/file_items_controller";
import FileManagerBreadcrumbs from "ui/file_manager/ui.file_manager.breadcrumbs";
import fx from "animation/fx";
import { FileManagerWrapper, FileManagerBreadcrumbsWrapper, createTestFileSystem } from "../../../helpers/fileManagerHelpers.js";

const moduleConfig = {

    beforeEach: function() {
        const fileSystem = createTestFileSystem();

        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.$element = $("#fileManager").dxFileManager({
            fileProvider: fileSystem,
            itemView: {
                mode: "thumbnails"
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

const createBreadcrumbs = (context, controller) => {
    const $breadcrumbs = $("<div>").appendTo(context.$element);
    context.breadcrumbs = new FileManagerBreadcrumbs($breadcrumbs, {
        onCurrentDirectoryChanging: e => {
            controller.setCurrentDirectory(e.currentDirectory);
        }
    });
    context.clock.tick(400);

    context.breadcrumbsWrapper = new FileManagerBreadcrumbsWrapper($breadcrumbs);
};

const createFileProviderWithIncorrectName = (incorrectName, isOnlyNewItem) => {
    let fileProvider = [];
    const newItem = {
        name: incorrectName,
        isDirectory: true,
        items: [
            {
                name: "About",
                isDirectory: true,
                items: []
            },
            {
                name: " ",
                isDirectory: true,
                items: [
                    {
                        name: "Folder inside",
                        isDirectory: true,
                        items: []
                    },
                    {
                        name: " ",
                        isDirectory: true,
                        items: []
                    }
                ]
            },
            {
                name: "File.txt",
                isDirectory: false,
                size: 3072000
            }
        ]
    };

    if(!isOnlyNewItem) {
        fileProvider = createTestFileSystem();
    }
    fileProvider.push(newItem);
    return fileProvider;
};

QUnit.module("Navigation operations", moduleConfig, () => {

    test("keep selection and expanded state during refresh", function(assert) {
        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files", "breadcrumbs refrers to the root");

        let $folderToggle = this.wrapper.getFolderToggle(1);
        $folderToggle.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files", "breadcrumbs refrers to the root");

        $folderToggle = this.wrapper.getFolderToggle(2);
        $folderToggle.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files", "breadcrumbs refrers to the root");

        let $folderNode = this.wrapper.getFolderNode(2);
        $folderNode.trigger("dxclick");

        assert.equal(this.wrapper.getFocusedItemText(), "Folder 1.1", "descendant folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/Folder 1/Folder 1.1", "breadcrumbs refrers to the descendant folder");

        const $commandButton = this.wrapper.getToolbarButton("Refresh");
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Folder 1.1", "descendant folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/Folder 1/Folder 1.1", "breadcrumbs refrers to the descendant folder");
    });

    test("navigate by folders in item view", function(assert) {
        let $item = this.wrapper.findThumbnailsItem("Folder 1");
        $item.trigger("dxdblclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Folder 1", "descendant folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/Folder 1", "breadcrumbs refrers to the descendant folder");

        $item = this.wrapper.findThumbnailsItem("Folder 1.1");
        $item.trigger("dxdblclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Folder 1.1", "descendant folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/Folder 1/Folder 1.1", "breadcrumbs refrers to the descendant folder");

        $item = this.wrapper.findThumbnailsItem("..");
        $item.trigger("dxdblclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Folder 1", "descendant folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/Folder 1", "breadcrumbs refrers to the descendant folder");


        $item = this.wrapper.findThumbnailsItem("..");
        $item.trigger("dxdblclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files", "breadcrumbs refrers to the root");
    });

    test("navigate by breadcrumbs items", function(assert) {
        const inst = this.wrapper.getInstance();
        inst.option("currentPath", "Folder 1/Folder 1.1");
        this.clock.tick(800);

        this.wrapper.getBreadcrumbsItemByText("Folder 1").trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Folder 1", "parent folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/Folder 1", "breadcrumbs refrers to the parent folder");

        this.wrapper.getBreadcrumbsItemByText("Files").trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files", "breadcrumbs refrers to the root folder");
    });

    test("navigate by breadcrumbs parent directory item", function(assert) {
        const inst = this.wrapper.getInstance();
        inst.option("currentPath", "Folder 1/Folder 1.1");
        this.clock.tick(800);

        this.wrapper.getBreadcrumbsParentDirectoryItem().trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Folder 1", "parent folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/Folder 1", "breadcrumbs refrers to the parent folder");

        this.wrapper.getBreadcrumbsParentDirectoryItem().trigger("dxclick");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files", "breadcrumbs refrers to the root folder");
    });

    test("getSelectedItems method", function(assert) {
        const testCases = [
            { mode: "thumbnails", wrapperMethod: "findThumbnailsItem", eventName: "click" },
            { mode: "details", wrapperMethod: "findDetailsItem", eventName: "dxclick" }
        ];

        testCases.forEach(({ mode, wrapperMethod, eventName }) => {
            const inst = this.wrapper.getInstance();
            inst.option("itemView.mode", mode);
            this.clock.tick(400);

            let items = inst.getSelectedItems();
            assert.strictEqual(items.length, 0, "selected items count is valid");

            this.wrapper[wrapperMethod]("Folder 1").trigger(eventName);
            this.clock.tick(400);

            items = inst.getSelectedItems();
            assert.strictEqual(items.length, 1, "selected items count is valid");
            assert.strictEqual(items[0].relativeName, "Folder 1", "item is in selection");
            assert.ok(items[0].isDirectory, "directory selected");

            const e = $.Event(eventName);
            e.ctrlKey = true;
            this.wrapper[wrapperMethod]("File 2.jpg").trigger(e);
            this.clock.tick(400);

            items = inst.getSelectedItems();
            assert.strictEqual(items.length, 2, "selected items count is valid");
            assert.strictEqual(items[0].relativeName, "Folder 1", "item is in selection");
            assert.ok(items[0].isDirectory, "directory selected");
            assert.strictEqual(items[1].relativeName, "File 2.jpg", "item is in selection");
            assert.notOk(items[1].isDirectory, "file selected");
        });
    });

    test("getCurrentDirectory method", function(assert) {
        const inst = this.wrapper.getInstance();
        let dir = inst.getCurrentDirectory();
        assert.strictEqual(dir.relativeName, "", "directory has empty relative name");
        assert.ok(dir.isDirectory, "directory has directory flag");
        assert.ok(dir.isRoot, "directory has root flag");

        inst.option("currentPath", "Folder 1/Folder 1.1");
        this.clock.tick(800);

        dir = inst.getCurrentDirectory();
        assert.strictEqual(dir.relativeName, "Folder 1/Folder 1.1", "directory has correct relative name");
        assert.ok(dir.isDirectory, "directory has directory flag");
        assert.notOk(dir.isRoot, "directory has not root flag");
    });

    test("change current directory by public API", function(assert) {
        const inst = this.wrapper.getInstance();
        assert.equal("", inst.option("currentPath"));

        const that = this;
        let onCurrentDirectoryChangedCounter = 0;
        inst.option("onCurrentDirectoryChanged", function() {
            onCurrentDirectoryChangedCounter++;
        });

        inst.option("currentPath", "Folder 1/Folder 1.1");
        this.clock.tick(800);

        assert.equal(onCurrentDirectoryChangedCounter, 1);
        assert.equal("Folder 1/Folder 1.1", inst.option("currentPath"), "The option 'currentPath' was changed");

        const $folder1Node = that.wrapper.getFolderNode(1);
        assert.equal($folder1Node.find("span").text(), "Folder 1");

        const $folder11Node = that.wrapper.getFolderNode(2);
        assert.equal($folder11Node.find("span").text(), "Folder 1.1");

        inst.option("currentPath", "");
        this.clock.tick(800);

        assert.equal(this.wrapper.getFocusedItemText(), "Files", "root folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files", "breadcrumbs refrers to the root folder");
    });

    test("during navigation internal current directory updated only once", function(assert) {
        const inst = this.wrapper.getInstance();
        const setCurrentDirSpy = sinon.spy(inst._controller, "setCurrentDirectory");

        this.wrapper.findThumbnailsItem("Folder 1").trigger("dxdblclick");
        this.clock.tick(400);

        assert.strictEqual(setCurrentDirSpy.callCount, 1, "internal method called once");
    });

    test("change root file name by public API", function(assert) {
        let treeViewNode = this.wrapper.getFolderNodes();
        assert.equal(treeViewNode.length, 4, "Everything right on its' place");

        let breadcrumbs = this.wrapper.getBreadcrumbsPath();
        let target = this.wrapper.getFolderNodeText(0);
        assert.equal(breadcrumbs, "Files", "Default breadcrumbs text is correct");
        assert.equal(target, "Files", "Default is correct");

        const fileManagerInstance = $("#fileManager").dxFileManager("instance");
        fileManagerInstance.option("rootFolderName", "TestRFN");
        this.clock.tick(400);

        treeViewNode = this.wrapper.getFolderNodes();
        assert.equal(treeViewNode.length, 4, "Everything right on its' place");

        breadcrumbs = this.wrapper.getBreadcrumbsPath();
        target = this.wrapper.getFolderNodeText(0);
        assert.equal(breadcrumbs, "TestRFN", "Custom breadcrumbs text is correct");
        assert.equal(target, "TestRFN", "Custom is correct");
    });

    test("splitter should change width of dirs tree and file items areas", function(assert) {
        const originalFunc = renderer.fn.width;
        renderer.fn.width = () => 900;

        $("#fileManager").css("width", "900px");
        this.wrapper.getInstance().repaint();
        const fileManagerWidth = $("#fileManager").get(0).clientWidth;

        assert.ok(this.wrapper.getSplitter().length, "Splitter was rendered");
        assert.ok(this.wrapper.isSplitterActive(), "Splitter is active");

        let oldTreeViewWidth = this.wrapper.getDrawerPanelContent().get(0).clientWidth;
        let oldItemViewWidth = this.wrapper.getItemsPanel().get(0).clientWidth;
        this.wrapper.moveSplitter(100);
        assert.equal(this.wrapper.getDrawerPanelContent().get(0).clientWidth, oldTreeViewWidth + 100, "Dirs tree has correct width");
        assert.equal(this.wrapper.getItemsPanel().get(0).clientWidth, oldItemViewWidth - 100, "Item view has correct width");

        oldTreeViewWidth = this.wrapper.getDrawerPanelContent().get(0).clientWidth;
        oldItemViewWidth = this.wrapper.getItemsPanel().get(0).clientWidth;
        this.wrapper.moveSplitter(-200);
        assert.equal(this.wrapper.getDrawerPanelContent().get(0).clientWidth, oldTreeViewWidth - 200, "Dirs tree has correct width");
        assert.equal(this.wrapper.getItemsPanel().get(0).clientWidth, oldItemViewWidth + 200, "Item view has correct width");

        oldTreeViewWidth = this.wrapper.getDrawerPanelContent().get(0).clientWidth;
        oldItemViewWidth = this.wrapper.getItemsPanel().get(0).clientWidth;
        this.wrapper.moveSplitter(-oldTreeViewWidth * 2);
        assert.equal(this.wrapper.getDrawerPanelContent().get(0).clientWidth, 0, "Dirs tree has correct width");
        assert.equal(this.wrapper.getItemsPanel().get(0).clientWidth, fileManagerWidth, "Item view has correct width");

        const splitterWidth = this.wrapper.getSplitter().get(0).clientWidth;
        oldTreeViewWidth = this.wrapper.getDrawerPanelContent().get(0).clientWidth;
        oldItemViewWidth = this.wrapper.getItemsPanel().get(0).clientWidth;
        this.wrapper.moveSplitter(oldItemViewWidth * 2);
        assert.equal(this.wrapper.getDrawerPanelContent().get(0).clientWidth, fileManagerWidth - splitterWidth, "Dirs tree has correct width");
        assert.equal(this.wrapper.getItemsPanel().get(0).clientWidth, splitterWidth, "Item view has correct width");

        renderer.fn.width = originalFunc;
    });

    test("file items with the wrong extension is not shown", function(assert) {
        assert.strictEqual(this.wrapper.getThumbnailsItems().length, 6, "all items are shown");

        this.wrapper.getInstance().option("allowedFileExtensions", [".xml"]);
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getThumbnailsItems().length, 4, "only items with allow extensions are shown");
        assert.strictEqual(this.wrapper.getThumbnailsItemName(3), "File 3.xml", "item name has allowed extension");
    });

    test("slashes in directory name must be processed correctly", function(assert) {
        const incorrectName = "Docu\\/me\\/nts";
        const fileProvider = createFileProviderWithIncorrectName(incorrectName);
        let controller = new FileItemsController({
            fileProvider,
            rootText: "Files",
            currentPath: "",
            onSelectedDirectoryChanged: () => { this.breadcrumbs.setCurrentDirectory(controller.getCurrentDirectory()); }
        });

        createBreadcrumbs(this, controller);

        const rootDirectory = controller.getCurrentDirectory();
        controller
            .getDirectoryContents(rootDirectory)
            .then(items => {
                controller.setCurrentDirectory(items[6]);
                assert.equal(this.breadcrumbsWrapper.getPath(), "Files/" + incorrectName, "breadcrumbs refrers to the target folder");
            });
        this.clock.tick(400);

        controller
            .getDirectoryContents(controller.getCurrentDirectory())
            .then(items => {
                controller.setCurrentDirectory(items[0]);
                assert.equal(this.breadcrumbsWrapper.getPath(), "Files/" + incorrectName + "/About", "breadcrumbs refrers to the target folder");
            });
        this.clock.tick(400);

        this.breadcrumbsWrapper.getItemByText(incorrectName).trigger("dxclick");
        this.clock.tick(400);
        assert.equal(this.breadcrumbsWrapper.getPath(), "Files/" + incorrectName, "breadcrumbs refrers to the target folder");

        this.breadcrumbsWrapper.getItemByText("Files").trigger("dxclick");
        this.clock.tick(400);
        assert.equal(this.breadcrumbsWrapper.getPath(), "Files", "breadcrumbs refrers to the root folder");
    });

    test("whitespace as directory name must be processed correctly", function(assert) {
        const incorrectName = "Docu\\/me\\/nts";
        const fileProvider = createFileProviderWithIncorrectName(incorrectName);
        let controller = new FileItemsController({
            fileProvider,
            rootText: "Files",
            currentPath: "",
            onSelectedDirectoryChanged: () => { this.breadcrumbs.setCurrentDirectory(controller.getCurrentDirectory()); }
        });

        createBreadcrumbs(this, controller);

        const rootDirectory = controller.getCurrentDirectory();
        controller
            .getDirectoryContents(rootDirectory)
            .then(items => controller.getDirectoryContents(items[6]))
            .then(items => controller.getDirectoryContents(items[1]))
            .then(items => {
                controller.setCurrentDirectory(items[0]);
                assert.equal(this.breadcrumbsWrapper.getPath(), "Files/" + incorrectName + "/ /Folder inside", "breadcrumbs refrers to the target folder");
            });
        this.clock.tick(400);

        this.breadcrumbsWrapper.getItemByText(" ").trigger("dxclick");
        this.clock.tick(400);
        assert.equal(this.breadcrumbsWrapper.getPath(), "Files/" + incorrectName + "/ ", "breadcrumbs refrers to the target folder");

        controller
            .getDirectoryContents(rootDirectory)
            .then(items => controller.getDirectoryContents(items[6]))
            .then(items => controller.getDirectoryContents(items[1]))
            .then(items => {
                controller.setCurrentDirectory(items[1]);
                assert.equal(this.breadcrumbsWrapper.getPath(), "Files/" + incorrectName + "/ / ", "breadcrumbs refrers to the target folder");
            });
        this.clock.tick(400);

        this.breadcrumbsWrapper.getParentDirectoryItem().trigger("dxclick");
        this.clock.tick(400);
        assert.equal(this.breadcrumbsWrapper.getPath(), "Files/" + incorrectName + "/ ", "breadcrumbs refrers to the target folder");
    });

    test("special symbols in 'currentPath' option must be processed correctly", function(assert) {
        const inst = this.wrapper.getInstance();
        const incorrectOptionValue = "Docu//me//nts";
        const incorrectName = "Docu/me/nts";
        const fileProvider = createFileProviderWithIncorrectName(incorrectName);
        inst.option("fileProvider", fileProvider);

        let counter = 0;
        inst.option("onOptionChanged", (e) => { e.name === "currentPath" && counter++; });

        inst.option("currentPath", incorrectOptionValue);
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), incorrectName, "target folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/" + incorrectName, "breadcrumbs refrers to the target folder");
        assert.equal(inst.option("currentPath"), incorrectOptionValue, "currentPath option is correct");
        assert.equal(counter, 1, "setCurrentPath() called once");

        inst.option("currentPath", incorrectOptionValue + "/About");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "About", "target folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/" + incorrectName + "/About", "breadcrumbs refrers to the target folder");
        assert.equal(inst.option("currentPath"), incorrectOptionValue + "/About", "currentPath option is correct");
        assert.equal(counter, 2, "setCurrentPath() called once");

        inst.option("currentPath", incorrectOptionValue + "/ ");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), " ", "target folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/" + incorrectName + "/ ", "breadcrumbs refrers to the target folder");
        assert.equal(inst.option("currentPath"), incorrectOptionValue + "/ ", "currentPath option is correct");
        assert.equal(counter, 3, "setCurrentPath() called once");

        inst.option("currentPath", incorrectOptionValue + "/ / ");
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), " ", "target folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/" + incorrectName + "/ / ", "breadcrumbs refrers to the target folder");
        assert.equal(inst.option("currentPath"), incorrectOptionValue + "/ / ", "currentPath option is correct");
        assert.equal(counter, 4, "setCurrentPath() called once");

        inst.option("currentPath", inst.option("currentPath"));
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), " ", "target folder has not changed");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/" + incorrectName + "/ / ", "breadcrumbs has not changed");
        assert.equal(inst.option("currentPath"), incorrectOptionValue + "/ / ", "currentPath option has not changed");
        assert.equal(counter, 4, "setCurrentPath() was not call");

        assert.equal(inst.getCurrentDirectory().relativeName, incorrectName + "/ / ");
    });

    test("triple slash in 'currentPath' option must be processed correctly", function(assert) {
        const inst = this.wrapper.getInstance();
        const incorrectOptionValue = "Docu///About";
        const incorrectName = "Docu/me/nts";
        const incorrectPartialName = "Docu/";
        let fileProvider = createFileProviderWithIncorrectName(incorrectName);
        fileProvider = fileProvider.concat(createFileProviderWithIncorrectName(incorrectPartialName, true));
        inst.option("fileProvider", fileProvider);

        inst.option("currentPath", incorrectOptionValue);
        this.clock.tick(400);

        assert.equal(this.wrapper.getFocusedItemText(), "About", "target folder selected");
        assert.equal(this.wrapper.getBreadcrumbsPath(), "Files/" + incorrectPartialName + "/About", "breadcrumbs refrers to the target folder");
        assert.equal(inst.option("currentPath"), incorrectOptionValue, "currentPath option is correct");
    });

});
