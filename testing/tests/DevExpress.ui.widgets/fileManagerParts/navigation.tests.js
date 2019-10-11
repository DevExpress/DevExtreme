import $ from "jquery";
import renderer from "core/renderer";
const { test } = QUnit;
import "ui/file_manager";
import fx from "animation/fx";
import { FileManagerWrapper, createTestFileSystem } from "../../../helpers/fileManagerHelpers.js";

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

    test("change current directory by public API", function(assert) {
        const inst = this.wrapper.getInstance();
        assert.equal("", inst.option("currentPath"));

        const that = this;
        let onCurrentDirectoryChangedCounter = 0;
        inst.option("onCurrentDirectoryChanged", function() {
            onCurrentDirectoryChangedCounter++;
            assert.equal("Folder 1/Folder 1.1", inst.option("currentPath"), "The option 'currentPath' was changed");
        });

        inst.option("currentPath", "Folder 1/Folder 1.1");
        this.clock.tick(800);

        assert.equal(onCurrentDirectoryChangedCounter, 1);

        const $folder1Node = that.wrapper.getFolderNode(1);
        assert.equal($folder1Node.find("span").text(), "Folder 1");

        const $folder11Node = that.wrapper.getFolderNode(2);
        assert.equal($folder11Node.find("span").text(), "Folder 1.1");
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
        let oldItemViewWidth = this.wrapper.getItemsView().get(0).clientWidth;
        this.wrapper.moveSplitter(100);
        assert.equal(this.wrapper.getDrawerPanelContent().get(0).clientWidth, oldTreeViewWidth + 100, "Dirs tree has correct width");
        assert.equal(this.wrapper.getItemsView().get(0).clientWidth, oldItemViewWidth - 100, "Item view has correct width");

        oldTreeViewWidth = this.wrapper.getDrawerPanelContent().get(0).clientWidth;
        oldItemViewWidth = this.wrapper.getItemsView().get(0).clientWidth;
        this.wrapper.moveSplitter(-200);
        assert.equal(this.wrapper.getDrawerPanelContent().get(0).clientWidth, oldTreeViewWidth - 200, "Dirs tree has correct width");
        assert.equal(this.wrapper.getItemsView().get(0).clientWidth, oldItemViewWidth + 200, "Item view has correct width");

        oldTreeViewWidth = this.wrapper.getDrawerPanelContent().get(0).clientWidth;
        oldItemViewWidth = this.wrapper.getItemsView().get(0).clientWidth;
        this.wrapper.moveSplitter(-oldTreeViewWidth * 2);
        assert.equal(this.wrapper.getDrawerPanelContent().get(0).clientWidth, 0, "Dirs tree has correct width");
        assert.equal(this.wrapper.getItemsView().get(0).clientWidth, fileManagerWidth, "Item view has correct width");

        const splitterWidth = this.wrapper.getSplitter().get(0).clientWidth;
        oldTreeViewWidth = this.wrapper.getDrawerPanelContent().get(0).clientWidth;
        oldItemViewWidth = this.wrapper.getItemsView().get(0).clientWidth;
        this.wrapper.moveSplitter(oldItemViewWidth * 2);
        assert.equal(this.wrapper.getDrawerPanelContent().get(0).clientWidth, fileManagerWidth - splitterWidth, "Dirs tree has correct width");
        assert.equal(this.wrapper.getItemsView().get(0).clientWidth, splitterWidth, "Item view has correct width");

        renderer.fn.width = originalFunc;
    });

    test("file items with the wrong extension is not shown", function(assert) {
        assert.strictEqual(this.wrapper.getThumbnailsItems().length, 6, "all items are shown");

        this.wrapper.getInstance().option("allowedFileExtensions", [".xml"]);
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getThumbnailsItems().length, 4, "only items with allow extensions are shown");
        assert.strictEqual(this.wrapper.getThumbnailsItemName(3), "File 3.xml", "item name has allowed extension");
    });

});
