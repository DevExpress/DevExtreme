/* global internals, createTestFileSystem */

import $ from "jquery";
const { test } = QUnit;
import "ui/file_manager";
import fx from "animation/fx";

const moduleConfig = {
    beforeEach: () => {
        const fileSystem = createTestFileSystem();

        this.clock = sinon.useFakeTimers();
        fx.off = true;

        $("#fileManager").dxFileManager({
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

        this.clock.tick(400);
    },

    afterEach: () => {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;
    }
};

const getFolderNode = ($element, index) => {
    return $element.find(`.${internals.FOLDERS_TREE_VIEW_ITEM_CLASS}`).eq(index);
};

const getFolderToggle = ($element, index) => {
    return $element.find(`.${internals.FOLDERS_TREE_VIEW_ITEM_TOGGLE_CLASS}`).eq(index);
};

const getFocusedItemText = $element => {
    return $element.find(`.${internals.CONTAINER_CLASS} .${internals.FOCUSED_ITEM_CLASS}`).text();
};

const getToolbarButton = ($element, text) => {
    return $element.find(`.${internals.TOOLBAR_CLASS} .${internals.BUTTON_CLASS}[aria-label=${text}]`);
};

const getBreadcrumbsPath = $element => {
    let result = "";
    const $elements = $element.find(`.${internals.BREADCRUMBS_CLASS} .${internals.MENU_ITEM_WITH_TEXT_CLASS}`);
    $elements.each((_, element) => {
        const name = $(element).text();
        result = result ? `${result}/${name}` : name;
    });
    return result;
};

const findThumbnailsItem = ($element, itemName) => {
    return $element.find(`.${internals.THUMBNAILS_ITEM_CLASS}:contains('${itemName}')`);
};

QUnit.module("Navigation operations", moduleConfig, () => {

    test("keep selection and expanded state during refresh", assert => {
        assert.equal(getFocusedItemText(this.$element), "Files", "root folder selected");
        assert.equal(getBreadcrumbsPath(this.$element), "Files", "breadcrumbs refrers to the root");

        let $folderToggle = getFolderToggle(this.$element, 1);
        $folderToggle.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(getFocusedItemText(this.$element), "Files", "root folder selected");
        assert.equal(getBreadcrumbsPath(this.$element), "Files", "breadcrumbs refrers to the root");

        $folderToggle = getFolderToggle(this.$element, 2);
        $folderToggle.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(getFocusedItemText(this.$element), "Files", "root folder selected");
        assert.equal(getBreadcrumbsPath(this.$element), "Files", "breadcrumbs refrers to the root");

        let $folderNode = getFolderNode(this.$element, 2);
        $folderNode.trigger("dxclick");

        assert.equal(getFocusedItemText(this.$element), "Folder 1.1", "descendant folder selected");
        assert.equal(getBreadcrumbsPath(this.$element), "Files/Folder 1/Folder 1.1", "breadcrumbs refrers to the descendant folder");

        const $commandButton = getToolbarButton(this.$element, "Refresh");
        $commandButton.trigger("dxclick");
        this.clock.tick(400);

        assert.equal(getFocusedItemText(this.$element), "Folder 1.1", "descendant folder selected");
        assert.equal(getBreadcrumbsPath(this.$element), "Files/Folder 1/Folder 1.1", "breadcrumbs refrers to the descendant folder");
    });

    test("navigate by folders in item view", assert => {
        let $item = findThumbnailsItem(this.$element, "Folder 1");
        $item.trigger("dxdblclick");
        this.clock.tick(400);

        assert.equal(getFocusedItemText(this.$element), "Folder 1", "descendant folder selected");
        assert.equal(getBreadcrumbsPath(this.$element), "Files/Folder 1", "breadcrumbs refrers to the descendant folder");

        $item = findThumbnailsItem(this.$element, "Folder 1.1");
        $item.trigger("dxdblclick");
        this.clock.tick(400);

        assert.equal(getFocusedItemText(this.$element), "Folder 1.1", "descendant folder selected");
        assert.equal(getBreadcrumbsPath(this.$element), "Files/Folder 1/Folder 1.1", "breadcrumbs refrers to the descendant folder");


        $item = findThumbnailsItem(this.$element, "..");
        $item.trigger("dxdblclick");
        this.clock.tick(400);

        assert.equal(getFocusedItemText(this.$element), "Folder 1", "descendant folder selected");
        assert.equal(getBreadcrumbsPath(this.$element), "Files/Folder 1", "breadcrumbs refrers to the descendant folder");


        $item = findThumbnailsItem(this.$element, "..");
        $item.trigger("dxdblclick");
        this.clock.tick(400);

        assert.equal(getFocusedItemText(this.$element), "Files", "root selected");
        assert.equal(getBreadcrumbsPath(this.$element), "Files", "breadcrumbs refrers to the root");
    });

});
