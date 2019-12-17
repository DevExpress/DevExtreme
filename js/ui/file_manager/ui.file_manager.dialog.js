import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';

import Widget from '../widget/ui.widget';
import Popup from '../popup';

const FILE_MANAGER_DIALOG_CONTENT = 'dx-filemanager-dialog';
const FILE_MANAGER_DIALOG_POPUP = 'dx-filemanager-dialog-popup';

class FileManagerDialogBase extends Widget {

    _initMarkup() {
        super._initMarkup();

        this._createOnClosedAction();

        const options = this._getDialogOptions();

        const $popup = $('<div>')
            .addClass(FILE_MANAGER_DIALOG_POPUP)
            .appendTo(this.$element());

        if(options.popupCssClass) {
            $popup.addClass(options.popupCssClass);
        }

        this._popup = this._createComponent($popup, Popup, {
            showTitle: true,
            title: options.title,
            visible: false,
            closeOnOutsideClick: true,
            contentTemplate: this._createContentTemplate.bind(this),
            toolbarItems: [
                {
                    widget: 'dxButton',
                    toolbar: 'bottom',
                    location: 'after',
                    options: {
                        text: options.buttonText,
                        onClick: this._applyDialogChanges.bind(this)
                    }
                }
            ],
            onHidden: this._onPopupHidden.bind(this),
            onShown: this._onPopupShown.bind(this)
        });
    }

    show() {
        this._dialogResult = null;
        this._popup.show();
    }

    _getDialogOptions() {
        return {
            title: 'Title',
            buttonText: 'ButtonText',
            contentCssClass: '',
            popupCssClass: ''
        };
    }

    _createContentTemplate(element) {
        this._$contentElement = $('<div>')
            .appendTo(element)
            .addClass(FILE_MANAGER_DIALOG_CONTENT);

        const cssClass = this._getDialogOptions().contentCssClass;
        if(cssClass) {
            this._$contentElement.addClass(cssClass);
        }
    }

    _getDialogResult() {
        return null;
    }

    _applyDialogChanges() {
        const result = this._getDialogResult();
        if(result) {
            this._dialogResult = result;
            this._popup.hide();
        }
    }

    _onPopupHidden() {
        this._onClosedAction({ dialogResult: this._dialogResult });
    }

    _onPopupShown() {
    }

    _createOnClosedAction() {
        this._onClosedAction = this._createActionByOption('onClosed');
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            onClosed: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'onClosed':
                this._createOnPathChangedAction();
                break;
            default:
                super._optionChanged(args);
        }
    }

}

module.exports = FileManagerDialogBase;
