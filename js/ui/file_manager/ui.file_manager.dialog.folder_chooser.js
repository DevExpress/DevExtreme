import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';

import FileManagerDialogBase from './ui.file_manager.dialog.js';
import FileManagerFilesTreeView from './ui.file_manager.files_tree_view';

const FILE_MANAGER_DIALOG_FOLDER_CHOOSER = 'dx-filemanager-dialog-folder-chooser';
const FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP = 'dx-filemanager-dialog-folder-chooser-popup';

class FileManagerFolderChooserDialog extends FileManagerDialogBase {

    show() {
        if(this._filesTreeView) {
            this._filesTreeView.refreshData();
        }
        super.show();
    }

    _getDialogOptions() {
        return extend(super._getDialogOptions(), {
            title: 'Select Destination Folder',
            buttonText: 'Select',
            contentCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER,
            popupCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP
        });
    }

    _createContentTemplate(element) {
        super._createContentTemplate(element);

        this._filesTreeView = this._createComponent($('<div>'), FileManagerFilesTreeView, {
            getItems: this.option('getItems')
        });

        this._$contentElement.append(this._filesTreeView.$element());
    }

    _getDialogResult() {
        return { folder: this._filesTreeView.getCurrentFolder() };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            getItems: null
        });
    }

}

module.exports = FileManagerFolderChooserDialog;
