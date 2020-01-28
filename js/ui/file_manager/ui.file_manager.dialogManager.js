import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';

import messageLocalization from '../../localization/message';

import FileManagerNameEditorDialog from './ui.file_manager.dialog.name_editor';
import FileManagerFolderChooserDialog from './ui.file_manager.dialog.folder_chooser';

class FileManagerDialogManager {
    constructor($element) {
        this._$element = $element;
    }

    createDirectoryChooserDialog(options) {
        const $chooseFolderDialog = $('<div>').appendTo(this._$element);
        this._chooseFolderDialog = new FileManagerFolderChooserDialog($chooseFolderDialog, options);
    }

    createRenameItemDialog(options) {
        const $dialog = $('<div>').appendTo(this._$element);
        this._renameItemDialog = new FileManagerNameEditorDialog($dialog, extend(options, {
            title: messageLocalization.format('dxFileManager-dialogRenameItemTitle'),
            buttonText: messageLocalization.format('dxFileManager-dialogRenameItemButtonText')
        }));
    }

    createCreateItemDialog(options) {
        const $dialog = $('<div>').appendTo(this._$element);
        this._createItemDialog = new FileManagerNameEditorDialog($dialog, extend(options, {
            title: messageLocalization.format('dxFileManager-dialogCreateDirectoryTitle'),
            buttonText: messageLocalization.format('dxFileManager-dialogCreateDirectoryButtonText')
        }));
    }

    getCopyDialog() {
        return this._chooseFolderDialog.getCopyDialog();
    }

    getMoveDialog() {
        return this._chooseFolderDialog.getMoveDialog();
    }

    getRenameItemDialog() {
        return this._renameItemDialog;
    }

    getCreateItemDialog() {
        return this._createItemDialog;
    }
}

module.exports = FileManagerDialogManager;
