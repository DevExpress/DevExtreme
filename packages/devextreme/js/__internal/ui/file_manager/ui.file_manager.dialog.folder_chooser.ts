/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import messageLocalization from '@js/common/core/localization/message';
import $, { type dxElementWrapper } from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getMapFromObject } from '@ts/ui/file_manager/ui.file_manager.common';
import type { DialogOptions } from '@ts/ui/file_manager/ui.file_manager.dialog';
import FileManagerDialogBase from '@ts/ui/file_manager/ui.file_manager.dialog';
import FileManagerFilesTreeView from '@ts/ui/file_manager/ui.file_manager.files_tree_view';

const FILE_MANAGER_DIALOG_FOLDER_CHOOSER = 'dx-filemanager-dialog-folder-chooser';
const FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP = 'dx-filemanager-dialog-folder-chooser-popup';

class FileManagerFolderChooserDialog extends FileManagerDialogBase {
  _filesTreeView?: FileManagerFilesTreeView;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _targetItemInfos?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _selectedDirectoryInfo?: any;

  show(): void {
    this._setSelectedDirInfo(null);
    this._filesTreeView?.refresh();
    super.show();
  }

  switchToCopyDialog(targetItemInfos): void {
    this._targetItemInfos = targetItemInfos;
    this._setTitle(
      messageLocalization.format(
        'dxFileManager-dialogDirectoryChooserCopyTitle',
      ),
    );
    this._setApplyButtonOptions({
      text: messageLocalization.format(
        'dxFileManager-dialogDirectoryChooserCopyButtonText',
      ),
      disabled: true,
    });
  }

  switchToMoveDialog(targetItemInfos): void {
    this._targetItemInfos = targetItemInfos;
    this._setTitle(
      messageLocalization.format(
        'dxFileManager-dialogDirectoryChooserMoveTitle',
      ),
    );
    this._setApplyButtonOptions({
      text: messageLocalization.format(
        'dxFileManager-dialogDirectoryChooserMoveButtonText',
      ),
      disabled: true,
    });
  }

  _getDialogOptions(): DialogOptions {
    return {
      ...super._getDialogOptions(),
      contentCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER,
      popupCssClass: FILE_MANAGER_DIALOG_FOLDER_CHOOSER_POPUP,
    };
  }

  _createContentTemplate(element: dxElementWrapper): void {
    super._createContentTemplate(element);

    // @ts-expect-error ts-error
    const { getDirectories } = this.option();

    this._filesTreeView = this._createComponent(
      $('<div>'),
      FileManagerFilesTreeView,
      {
        getDirectories,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        getCurrentDirectory: () => this._getDialogSelectedDirectory(),
        onDirectoryClick: (e): void => this._onFilesTreeViewDirectoryClick(e),
        onFilesTreeViewContentReady: (): void => this._toggleUnavailableLocationsDisabled(true),
      },
    );

    this._$contentElement?.append($(this._filesTreeView?.$element()));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDialogResult() {
    const result = this._getDialogSelectedDirectory();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result ? { folder: result } : result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDefaultOptions() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      getItems: null,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDialogSelectedDirectory() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._selectedDirectoryInfo;
  }

  _onFilesTreeViewDirectoryClick({ itemData }): void {
    this._setSelectedDirInfo(itemData);
    this._filesTreeView?.updateCurrentDirectory();
  }

  _setSelectedDirInfo(dirInfo): void {
    this._selectedDirectoryInfo = dirInfo;
    this._setApplyButtonOptions({ disabled: !dirInfo });
  }

  _onPopupShown(): void {
    this._toggleUnavailableLocationsDisabled(true);
    super._onPopupShown();
  }

  _onPopupHiding(): void {
    this._toggleUnavailableLocationsDisabled(false);
    super._onPopupHiding();
  }

  _toggleUnavailableLocationsDisabled(isDisabled: boolean): void {
    if (!this._filesTreeView) {
      return;
    }
    const locations = this._getLocationsToProcess(isDisabled);
    this._filesTreeView
      .toggleDirectoryExpandedStateRecursive(
        locations.locationsToExpand[0],
        isDisabled,
      )
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .then(() => this._filesTreeView?.toggleDirectoryLineExpandedState(
        locations.locationsToCollapse,
        !isDisabled,
      )
        .then((): void => locations.locationKeysToDisable
          .forEach((key): void => this._filesTreeView?.toggleNodeDisabledState(key, isDisabled))));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getLocationsToProcess(isDisabled: boolean) {
    const expandLocations = {};
    const collapseLocations = {};
    this._targetItemInfos.forEach((itemInfo): void => {
      if (itemInfo.parentDirectory) {
        expandLocations[itemInfo.parentDirectory.getInternalKey()] = itemInfo.parentDirectory;
      }
      if (itemInfo.fileItem.isDirectory) {
        collapseLocations[itemInfo.getInternalKey()] = itemInfo;
      }
    });

    const expandMap = getMapFromObject(expandLocations);
    const collapseMap = getMapFromObject(collapseLocations);

    return {
      locationsToExpand: isDisabled ? expandMap.values : [],
      locationsToCollapse: isDisabled ? collapseMap.values : [],
      locationKeysToDisable: expandMap.keys.concat(...collapseMap.keys),
    };
  }
}

export default FileManagerFolderChooserDialog;
