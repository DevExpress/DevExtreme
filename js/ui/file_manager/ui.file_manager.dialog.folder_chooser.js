import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";

import FileManagerDialogBase from "./ui.file_manager.dialog.js";
import FileManagerFilesTreeView from "./ui.file_manager.files_tree_view";

const FILE_MANAGER_DIALOG_FOLDER_CHOOSER = "dx-filemanager-dialog-folder-chooser";

class FileManagerFolderChooserDialog extends FileManagerDialogBase {

    show() {
        if(this._filesTreeView) {
            this._filesTreeView.refreshData();
        }
        super.show();
    }

    _getDialogOptions() {
        return extend(super._getDialogOptions(), {
            width: 400,
            height: "80%",
            title: "Select Destination Folder",
            buttonText: "Select"
        });
    }

    _createContentTemplate(element) {
        super._createContentTemplate(element);

        this._filesTreeView = this._createComponent($("<div>"), FileManagerFilesTreeView, {
            getItems: this.option("getItems")
        });

        this._$contentElement.append(this._filesTreeView.$element());
    }

    _getDialogResult() {
        return { folder: this._filesTreeView.getCurrentFolder() };
    }

    _getCssClass() {
        return FILE_MANAGER_DIALOG_FOLDER_CHOOSER;
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            getItems: null
        });
    }

}

module.exports = FileManagerFolderChooserDialog;
