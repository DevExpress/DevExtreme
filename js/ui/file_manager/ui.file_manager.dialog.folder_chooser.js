import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';

import messageLocalization from '../../localization/message';

import FileManagerDialogBase from './ui.file_manager.dialog.js';
import FileManagerFilesTreeView from './ui.file_manager.files_tree_view';

const FILE_MANAGER_DIALOG_FOLDER_CHOOSER = 'dx-filemanager-dialog-folder-chooser';
const FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP = 'dx-filemanager-dialog-folder-chooser-popup';

class FileManagerFolderChooserDialog extends FileManagerDialogBase {

    show() {
        this._filesTreeView && this._filesTreeView.refresh();
        super.show();
    }

    switchToCopyDialog(targetItemInfos) {
        this._targetItemInfos = targetItemInfos;
        this._setTitle(messageLocalization.format('dxFileManager-dialogDirectoryChooserCopyTitle'));
        this._setButtonText(messageLocalization.format('dxFileManager-dialogDirectoryChooserCopyButtonText'));
    }

    switchToMoveDialog(targetItemInfos) {
        this._targetItemInfos = targetItemInfos;
        this._setTitle(messageLocalization.format('dxFileManager-dialogDirectoryChooserMoveTitle'));
        this._setButtonText(messageLocalization.format('dxFileManager-dialogDirectoryChooserMoveButtonText'));
    }

    _getDialogOptions() {
        return extend(super._getDialogOptions(), {
            contentCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER,
            popupCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP
        });
    }

    _createContentTemplate(element) {
        super._createContentTemplate(element);

        this._filesTreeView = this._createComponent($('<div>'), FileManagerFilesTreeView, {
            getDirectories: this.option('getDirectories'),
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
        return this._selectedDirectoryInfo || this.option('getCurrentDirectory')();
    }

    _onFilesTreeViewDirectoryClick({ itemData }) {
        this._selectedDirectoryInfo = itemData;
        this._filesTreeView.updateCurrentDirectory();
    }

    _onPopupShown() {
        this._toggleUnavailableLocationsDisabled(true);
        super._onPopupShown();
    }

    _onPopupHidden() {
        this._toggleUnavailableLocationsDisabled(false);
        super._onPopupHidden();
    }

    _toggleUnavailableLocationsDisabled(isDisabled) {
        const unavailableLocations = this._getUnavailableLocations(isDisabled);
        this._filesTreeView.toggleDirectoryLineExpandedState(unavailableLocations.locationsToExpand, isDisabled)
            .then(() => this._filesTreeView.toggleDirectoryLineExpandedState(unavailableLocations.locationsToCollapse, !isDisabled)
                .then(() => unavailableLocations.unavailableLocationKeys.forEach(key => this._filesTreeView.toggleNodeDisabledState(key, isDisabled))));
    }

    _getUnavailableLocations(isDisabled) {
        const expandLocations = new Map();
        const collapseLocations = new Map();
        this._targetItemInfos.forEach(itemInfo => {
            if(itemInfo.parentDirectory) {
                expandLocations.set(itemInfo.parentDirectory.getInternalKey(), itemInfo.parentDirectory);
            }
            if(itemInfo.fileItem.isDirectory) {
                collapseLocations.set(itemInfo.getInternalKey(), itemInfo);
            }
        });
        return {
            locationsToExpand: isDisabled ? Array.from(expandLocations.values()) : [],
            locationsToCollapse: isDisabled ? Array.from(collapseLocations.values()) : [],
            unavailableLocationKeys: Array.from(expandLocations.keys()).concat(...Array.from(collapseLocations.keys())) };
    }

}

export default FileManagerFolderChooserDialog;
