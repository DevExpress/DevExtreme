import $ from "jquery";

import "common.css!";

window.internals = {
    WIDGET_CLASS: "dx-filemanager",
    TOOLBAR_CLASS: "dx-filemanager-toolbar",
    GENERAL_TOOLBAR_CLASS: "dx-filemanager-general-toolbar",
    FILE_TOOLBAR_CLASS: "dx-filemanager-file-toolbar",
    CONTAINER_CLASS: "dx-filemanager-container",
    DIALOG_CLASS: "dx-filemanager-dialog",
    THUMBNAILS_ITEM_CLASS: "dx-filemanager-thumbnails-item",
    GRID_DATA_ROW_CLASS: "dx-data-row",
    FOLDERS_TREE_VIEW_ITEM_CLASS: "dx-treeview-item",
    FOLDERS_TREE_VIEW_ITEM_TOGGLE_CLASS: "dx-treeview-toggle-item-visibility",
    BREADCRUMBS_CLASS: "dx-filemanager-breadcrumbs",
    ITEMS_GRID_VIEW_CLASS: "dx-filemanager-files-view",
    FOCUSED_ITEM_CLASS: "dx-filemanager-focused-item",
    POPUP_BOTTOM_CLASS: "dx-popup-bottom",
    BUTTON_CLASS: "dx-button",
    BUTTON_TEXT_CLASS: "dx-button-text",
    SELECT_BOX_CLASS: "dx-selectbox",
    TEXT_EDITOR_INPUT_CLASS: "dx-texteditor-input",
    MENU_ITEM_WITH_TEXT_CLASS: "dx-menu-item-has-text",
    SELECTION_CLASS: "dx-selection"
};

window.createTestFileSystem = () => {
    return [
        {
            name: "Folder 1",
            isFolder: true,
            children: [
                {
                    name: "Folder 1.1",
                    isFolder: true,
                    children: [
                        {
                            name: "File 1-1.txt",
                            isFolder: false
                        },
                        {
                            name: "File 1-2.txt",
                            isFolder: false
                        },
                        {
                            name: "File 1-3.png",
                            isFolder: false
                        },
                        {
                            name: "File 1-4.jpg",
                            isFolder: false
                        }]
                },
                {
                    name: "Folder 1.2",
                    isFolder: true
                },
                {
                    name: "File 1-1.txt",
                    isFolder: false
                },
                {
                    name: "File 1-2.jpg",
                    isFolder: false
                }]
        },
        {
            name: "Folder 2",
            isFolder: true,
            children: [
                {
                    name: "File 2-1.jpg",
                    isFolder: false
                }]
        },
        {
            name: "Folder 3",
            isFolder: true
        },
        {
            name: "File 1.txt",
            isFolder: false
        },
        {
            name: "File 2.jpg",
            isFolder: false
        },
        {
            name: "File 3.xml",
            isFolder: false
        }
    ];
};

QUnit.testStart(() => {
    const markup = '<div id="fileManager"></div>';
    $("#qunit-fixture").html(markup);

    this.$element = $("#fileManager");
});

import "./fileManagerParts/contextMenu.tests.js";
import "./fileManagerParts/toolbar.tests.js";
import "./fileManagerParts/navigation.tests.js";
import "./fileManagerParts/editing.tests.js";
import "./fileManagerParts/webAPIProvider.tests.js";
