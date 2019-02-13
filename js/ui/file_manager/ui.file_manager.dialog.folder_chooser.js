import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";

import FileManagerDialogBase from "./ui.file_manager.dialog.base.js";
import FileManagerFilesTreeView from "./ui.file_manager.files_tree_view";

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
            height: 340,
            title: "Select Destination Folder",
            buttonText: "Select"
        });
    },

    _getContentTemplate: function() {
        this._filesTreeView = this._createComponent($("<div>"), FileManagerFilesTreeView, {
            provider: this.option("provider")
        });

        return this.callBase().append(
            this._filesTreeView.$element()
        );
    },

    _getDialogResult: function() {
        return { folder: this._filesTreeView.getCurrentFolder() };
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            provider: null
        });
    }

});

module.exports = FileManagerFolderChooserDialog;
