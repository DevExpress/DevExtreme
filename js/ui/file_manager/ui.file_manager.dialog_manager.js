import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';

import messageLocalization from '../../localization/message';

import FileManagerNameEditorDialog from './ui.file_manager.dialog.name_editor';
import FileManagerFolderChooserDialog from './ui.file_manager.dialog.folder_chooser';
import FileManagerDeleteItemDialog from './ui.file_manager.dialog.delete_item';

class FileManagerDialogManager {
    constructor($element, options) {
        this._$element = $element;
        this._options = options;

        const $chooseFolderDialog = $('<div>').appendTo(this._$element);
        this._chooseDirectoryDialog = new FileManagerFolderChooserDialog($chooseFolderDialog,
            extend(this._options['chooseDirectoryDialog'], { onClosed: this._options['onDialogClosed'] }));

        const $renameDialog = $('<div>').appendTo(this._$element);
        this._renameItemDialog = new FileManagerNameEditorDialog($renameDialog, {
            title: messageLocalization.format('dxFileManager-dialogRenameItemTitle'),
            buttonText: messageLocalization.format('dxFileManager-dialogRenameItemButtonText'),
            onClosed: this._options['onDialogClosed']
        });

        const $createDialog = $('<div>').appendTo(this._$element);
        this._createItemDialog = new FileManagerNameEditorDialog($createDialog, {
            title: messageLocalization.format('dxFileManager-dialogCreateDirectoryTitle'),
            buttonText: messageLocalization.format('dxFileManager-dialogCreateDirectoryButtonText'),
            onClosed: this._options['onDialogClosed']
        });

        const $deleteItemDialog = $('<div>').appendTo(this._$element);
        this._deleteItemDialog = new FileManagerDeleteItemDialog($deleteItemDialog, {
            onClosed: this._options['onDialogClosed']
        });
    }

    getCopyDialog(targetItemInfos) {
        this._chooseDirectoryDialog.switchToCopyDialog(targetItemInfos);
        return this._chooseDirectoryDialog;
    }

    getMoveDialog(targetItemInfos) {
        this._chooseDirectoryDialog.switchToMoveDialog(targetItemInfos);
        return this._chooseDirectoryDialog;
    }

    getRenameItemDialog() {
        return this._renameItemDialog;
    }

    getCreateItemDialog() {
        return this._createItemDialog;
    }

    getDeleteItemDialog() {
        return this._deleteItemDialog;
    }
}

export default FileManagerDialogManager;
