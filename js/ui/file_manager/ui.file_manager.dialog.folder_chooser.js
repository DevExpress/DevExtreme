import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";

import messageLocalization from "../../localization/message";

import FileManagerDialogBase from "./ui.file_manager.dialog.js";
import FileManagerFilesTreeView from "./ui.file_manager.files_tree_view";

const FILE_MANAGER_DIALOG_FOLDER_CHOOSER = "dx-filemanager-dialog-folder-chooser";
const FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP = "dx-filemanager-dialog-folder-chooser-popup";

class FileManagerFolderChooserDialog extends FileManagerDialogBase {

    show() {
        this._filesTreeView && this._filesTreeView.refresh();
        super.show();
    }

    _getDialogOptions() {
        return extend(super._getDialogOptions(), {
            title: messageLocalization.format("dxFileManager-dialogDirectoryChooserTitle"),
            buttonText: messageLocalization.format("dxFileManager-dialogDirectoryChooserButtonText"),
            contentCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER,
            popupCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP
        });
    }

    _createContentTemplate(element) {
        super._createContentTemplate(element);

        this._filesTreeView = this._createComponent($("<div>"), FileManagerFilesTreeView, {
            getDirectories: this.option("getDirectories"),
            getCurrentDirectory: this._getDialogSelectedDirectory.bind(this),
            onDirectoryClick: this._onFilesTreeViewDirectoryClick.bind(this)
        });

        this._$contentElement.append(this._filesTreeView.$element());
    }

    _getDialogResult() {
        return { folder: this._getDialogSelectedDirectory() };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            getItems: null
        });
    }

    _getDialogSelectedDirectory() {
        // console.log('_getDialogSelectedDirectory')
        // console.log(this._selectedDirectoryInfo && this._selectedDirectoryInfo.fileItem.name)
        // console.log('vs')
        // console.log(this.option("getCurrentDirectory")() && this.option("getCurrentDirectory")().fileItem.name)
        // console.log('_______________________________')
        return this._selectedDirectoryInfo || this.option("getCurrentDirectory")();
    }

    _onFilesTreeViewDirectoryClick({ itemData }) {
        // console.log(`_onFilesTreeViewDirectoryClick()`)
        // console.log(itemData && itemData.fileItem.name);
        if(!itemData) {
            // debugger
            return;
        }
        this._selectedDirectoryInfo = itemData;
        this._filesTreeView.updateCurrentDirectory();
    }

}

module.exports = FileManagerFolderChooserDialog;
