import $ from "jquery";
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
        var treeViewNode = $(document).find(".dx-treeview-node");
        assert.equal(treeViewNode.length, 4, "Everything right on its' place");

        var target = treeViewNode[0].children[0];
        assert.ok(target.innerText.indexOf("Files") === 0, "Default is correct");

        const fileManagerInstance = $("#fileManager").dxFileManager("instance");
        fileManagerInstance.option("rootFolderText", "TestRFN");
        this.clock.tick(400);

        treeViewNode = $(document).find(".dx-treeview-node");
        assert.equal(treeViewNode.length, 4, "Everything right on its' place");

        target = treeViewNode[0].children[0];
        assert.ok(target.innerText.indexOf("TestRFN") === 0, "Custom is correct");
    });

});
