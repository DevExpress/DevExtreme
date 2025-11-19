import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type FileSystemProviderBase from '@ts/file_management/provider_base';
import FileManagerDeleteItemDialog from '@ts/ui/file_manager/ui.file_manager.dialog.delete_item';
import FileManagerFolderChooserDialog from '@ts/ui/file_manager/ui.file_manager.dialog.folder_chooser';
import FileManagerNameEditorDialog from '@ts/ui/file_manager/ui.file_manager.dialog.name_editor';

interface FileManagerDialogManagerOptions {
  rtlEnabled?: boolean;
  chooseDirectoryDialog?: {
    provider?: FileSystemProviderBase;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getDirectories?: (args?: any) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCurrentDirectory?: (args?: any) => any;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDialogClosed?: ((args?: any) => void);
}

class FileManagerDialogManager {
  _$element: dxElementWrapper;

  _options: FileManagerDialogManagerOptions;

  _chooseDirectoryDialog: FileManagerFolderChooserDialog;

  _renameItemDialog: FileManagerNameEditorDialog;

  _createItemDialog: FileManagerNameEditorDialog;

  _deleteItemDialog: FileManagerDeleteItemDialog;

  constructor($element: dxElementWrapper, options: FileManagerDialogManagerOptions) {
    this._$element = $element;
    this._options = options;
    const baseDialogOptions = {
      onClosed: this._options.onDialogClosed,
      rtlEnabled: this._options.rtlEnabled,
    };

    const $chooseFolderDialog = $('<div>').appendTo(this._$element);
    this._chooseDirectoryDialog = new FileManagerFolderChooserDialog(
      // @ts-expect-error ts-error
      $chooseFolderDialog,
      extend(baseDialogOptions, this._options.chooseDirectoryDialog),
    );

    const $renameDialog = $('<div>').appendTo(this._$element);
    this._renameItemDialog = new FileManagerNameEditorDialog(
      // @ts-expect-error ts-error
      $renameDialog,
      extend(baseDialogOptions, {
        title: messageLocalization.format(
          'dxFileManager-dialogRenameItemTitle',
        ),
        buttonText: messageLocalization.format(
          'dxFileManager-dialogRenameItemButtonText',
        ),
      }),
    );

    const $createDialog = $('<div>').appendTo(this._$element);
    this._createItemDialog = new FileManagerNameEditorDialog(
      // @ts-expect-error ts-error
      $createDialog,
      extend(baseDialogOptions, {
        title: messageLocalization.format(
          'dxFileManager-dialogCreateDirectoryTitle',
        ),
        buttonText: messageLocalization.format(
          'dxFileManager-dialogCreateDirectoryButtonText',
        ),
      }),
    );

    const $deleteItemDialog = $('<div>').appendTo(this._$element);
    this._deleteItemDialog = new FileManagerDeleteItemDialog(
      // @ts-expect-error ts-error
      $deleteItemDialog,
      baseDialogOptions,
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getCopyDialog(targetItemInfos): FileManagerFolderChooserDialog {
    this._chooseDirectoryDialog.switchToCopyDialog(targetItemInfos);
    return this._chooseDirectoryDialog;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getMoveDialog(targetItemInfos): FileManagerFolderChooserDialog {
    this._chooseDirectoryDialog.switchToMoveDialog(targetItemInfos);
    return this._chooseDirectoryDialog;
  }

  getRenameItemDialog(): FileManagerNameEditorDialog {
    return this._renameItemDialog;
  }

  getCreateItemDialog(): FileManagerNameEditorDialog {
    return this._createItemDialog;
  }

  getDeleteItemDialog(): FileManagerDeleteItemDialog {
    return this._deleteItemDialog;
  }

  updateDialogRtl(value: boolean): void {
    [
      this._chooseDirectoryDialog,
      this._renameItemDialog,
      this._createItemDialog,
      this._deleteItemDialog,
    ].forEach((dialog): void => {
      dialog.option('rtlEnabled', value);
    });
  }
}

export default FileManagerDialogManager;
