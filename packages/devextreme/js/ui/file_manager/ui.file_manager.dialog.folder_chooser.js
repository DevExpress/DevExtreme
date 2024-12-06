import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';

import messageLocalization from '../../common/core/localization/message';
import { getMapFromObject } from './ui.file_manager.common';

import FileManagerDialogBase from './ui.file_manager.dialog';
import FileManagerFilesTreeView from './ui.file_manager.files_tree_view';

const FILE_MANAGER_DIALOG_FOLDER_CHOOSER = 'dx-filemanager-dialog-folder-chooser';
const FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP = 'dx-filemanager-dialog-folder-chooser-popup';

class FileManagerFolderChooserDialog extends FileManagerDialogBase {

    show() {
        this._setSelectedDirInfo(null);
        this._filesTreeView?.refresh();
        super.show();
    }

    switchToCopyDialog(targetItemInfos) {
        this._targetItemInfos = targetItemInfos;
        this._setTitle(messageLocalization.format('dxFileManager-dialogDirectoryChooserCopyTitle'));
        this._setApplyButtonOptions({
            text: messageLocalization.format('dxFileManager-dialogDirectoryChooserCopyButtonText'),
            disabled: true
        });
    }

    switchToMoveDialog(targetItemInfos) {
        this._targetItemInfos = targetItemInfos;
        this._setTitle(messageLocalization.format('dxFileManager-dialogDirectoryChooserMoveTitle'));
        this._setApplyButtonOptions({
            text: messageLocalization.format('dxFileManager-dialogDirectoryChooserMoveButtonText'),
            disabled: true
        });
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
            getCurrentDirectory: () => this._getDialogSelectedDirectory(),
            onDirectoryClick: (e) => this._onFilesTreeViewDirectoryClick(e),
            onFilesTreeViewContentReady: () => this._toggleUnavailableLocationsDisabled(true)
        });

        this._$contentElement.append(this._filesTreeView.$element());
    }

    _getDialogResult() {
        const result = this._getDialogSelectedDirectory();
        return result ? { folder: result } : result;
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            getItems: null
        });
    }

    _getDialogSelectedDirectory() {
        return this._selectedDirectoryInfo;
    }

    _onFilesTreeViewDirectoryClick({ itemData }) {
        this._setSelectedDirInfo(itemData);
        this._filesTreeView.updateCurrentDirectory();
    }

    _setSelectedDirInfo(dirInfo) {
        this._selectedDirectoryInfo = dirInfo;
        this._setApplyButtonOptions({ disabled: !dirInfo });
    }

    _onPopupShown() {
        this._toggleUnavailableLocationsDisabled(true);
        super._onPopupShown();
    }

    _onPopupHiding() {
        this._toggleUnavailableLocationsDisabled(false);
        super._onPopupHiding();
    }

    _toggleUnavailableLocationsDisabled(isDisabled) {
        if(!this._filesTreeView) {
            return;
        }
        const locations = this._getLocationsToProcess(isDisabled);
        this._filesTreeView.toggleDirectoryExpandedStateRecursive(locations.locationsToExpand[0], isDisabled)
            .then(() => this._filesTreeView.toggleDirectoryLineExpandedState(locations.locationsToCollapse, !isDisabled)
                .then(() => locations.locationKeysToDisable.forEach(key => this._filesTreeView.toggleNodeDisabledState(key, isDisabled))));
    }

    _getLocationsToProcess(isDisabled) {
        const expandLocations = {};
        const collapseLocations = {};
        this._targetItemInfos.forEach(itemInfo => {
            if(itemInfo.parentDirectory) {
                expandLocations[itemInfo.parentDirectory.getInternalKey()] = itemInfo.parentDirectory;
            }
            if(itemInfo.fileItem.isDirectory) {
                collapseLocations[itemInfo.getInternalKey()] = itemInfo;
            }
        });

        const expandMap = getMapFromObject(expandLocations);
        const collapseMap = getMapFromObject(collapseLocations);

        return {
            locationsToExpand: isDisabled ? expandMap.values : [],
            locationsToCollapse: isDisabled ? collapseMap.values : [],
            locationKeysToDisable: expandMap.keys.concat(...collapseMap.keys)
        };
    }

}

export default FileManagerFolderChooserDialog;
