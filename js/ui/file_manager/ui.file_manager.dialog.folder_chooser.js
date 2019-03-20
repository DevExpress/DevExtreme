import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";

import FileManagerDialogBase from "./ui.file_manager.dialog.js";
import FileManagerFilesTreeView from "./ui.file_manager.files_tree_view";

const FILE_MANAGER_DIALOG_FOLDER_CHOOSER = "dx-filemanager-dialog-folder-chooser";

var FileManagerFolderChooserDialog = FileManagerDialogBase.inherit({

    show: function() {
        if(this._filesTreeView) {
            this._filesTreeView.refreshData();
        }
        this.callBase();
    },

    _getInternalOptions: function() {
        return extend(this.callBase(), {
            width: 400,
            height: "80%",
            title: "Select Destination Folder",
            buttonText: "Select"
        });
    },

    _getContentTemplate: function() {
        this._filesTreeView = this._createComponent($("<div>"), FileManagerFilesTreeView, {
            getItems: this.option("getItems")
        });

        return this.callBase().append(
            this._filesTreeView.$element()
        );
    },

    _getDialogResult: function() {
        return { folder: this._filesTreeView.getCurrentFolder() };
    },

    _getCssClass: function() {
        return FILE_MANAGER_DIALOG_FOLDER_CHOOSER;
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            getItems: null
        });
    }

});

module.exports = FileManagerFolderChooserDialog;
