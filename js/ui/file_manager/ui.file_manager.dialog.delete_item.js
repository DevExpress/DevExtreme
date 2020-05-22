import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';

import messageLocalization from '../../localization/message';

import FileManagerDialogBase from './ui.file_manager.dialog.js';

const FILE_MANAGER_DIALOG_DELETE_ITEM = 'dx-filemanager-dialog-delete-item';
const FILE_MANAGER_DIALOG_DELETE_ITEM_POPUP = 'dx-filemanager-dialog-delete-item-popup'; // TODO ensure needed

class FileManagerDeleteItemDialog extends FileManagerDialogBase {

    show({ itemName, itemCount }) {
        const text = itemCount === 1
            ? messageLocalization.format('dxFileManager-dialogDeleteItemSingleItemConfirmation', itemName)
            : messageLocalization.format('dxFileManager-dialogDeleteItemMultipleItemsConfirmation', itemCount);

        if(this._$text) {
            this._$text.text(text);
        } else {
            this._initialText = text;
        }

        super.show();
    }

    _getDialogOptions() {
        return extend(super._getDialogOptions(), {
            title: messageLocalization.format('dxFileManager-dialogDeleteItemTitle'),
            buttonText: messageLocalization.format('dxFileManager-dialogDeleteItemButtonText'),
            contentCssClass: FILE_MANAGER_DIALOG_DELETE_ITEM,
            popupCssClass: FILE_MANAGER_DIALOG_DELETE_ITEM_POPUP
        });
    }

    _createContentTemplate(element) {
        super._createContentTemplate(element);

        this._$text = $('<div>')
            .text(this._initialText)
            .appendTo(this._$contentElement);
    }

    _getDialogResult() {
        return {};
    }
}

module.exports = FileManagerDeleteItemDialog;
