import $ from "jquery";

import "common.css!";

window.internals = {
    WIDGET_CLASS: "dx-filemanager",
    TOOLBAR_CLASS: "dx-filemanager-toolbar",
    DIALOG_CLASS: "dx-filemanager-dialog",
    GRID_DATA_ROW_CLASS: "dx-data-row",
    FOLDERS_TREE_VIEW_ITEM_CLASS: "dx-treeview-item",
    POPUP_BOTTOM_CLASS: "dx-popup-bottom",
    BUTTON_CLASS: "dx-button",
    TEXT_EDITOR_INPUT_CLASS: "dx-texteditor-input",
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
    var markup = '<div id="fileManager"></div>';
    $("#qunit-fixture").html(markup);

    this.$element = $("#fileManager");
});

import "./fileManagerParts/editing.tests.js";
