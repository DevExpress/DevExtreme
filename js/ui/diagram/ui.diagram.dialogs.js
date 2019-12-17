import $ from '../../core/renderer';
import Widget from '../widget/ui.widget';
import messageLocalization from '../../localization/message';

var Popup = require('../popup'),
    extend = require('../../core/utils/extend').extend;

class DiagramDialog extends Widget {
    _init() {
        super._init();
        this._command = undefined;
        this._isShown = false;
        this._createOnGetContentOption();
        this._createOnHiddenOption();
    }
    _initMarkup() {
        super._initMarkup();

        this._command = this.option('command');

        this._$popupElement = $('<div>')
            .appendTo(this.$element());
        this._popupInstance = this._createComponent(this._$popupElement, Popup, {
            title: this.option('title'),
            maxWidth: this.option('maxWidth'),
            height: this.option('height'),
            toolbarItems: this.option('toolbarItems'),
            onHidden: this._onHiddenAction
        });
    }
    _clean() {
        delete this._popupInstance;
        this._$popupElement && this._$popupElement.remove();
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            title: '',
            maxWidth: 500,
            height: 'auto',
            toolbarItems: this._getToolbarItems()
        });
    }
    _getToolbarItems() {
        return [ this._getOkToolbarItem(), this._getCancelToolbarItem()];
    }
    _getOkToolbarItem() {
        return {
            widget: 'dxButton',
            location: 'after',
            toolbar: 'bottom',
            options: {
                text: messageLocalization.format('dxDiagram-dialogButtonOK'),
                onClick: function() {
                    this._command.execute(this._commandParameter);
                    this._hide();
                }.bind(this)
            }
        };
    }
    _getCancelToolbarItem() {
        return {
            widget: 'dxButton',
            location: 'after',
            toolbar: 'bottom',
            options: {
                text: messageLocalization.format('dxDiagram-dialogButtonCancel'),
                onClick: this._hide.bind(this)
            }
        };
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'title':
            case 'maxWidth':
            case 'height':
            case 'toolbarItems':
                this._popupInstance.option(args.name, args.value);
                break;
            case 'command':
                this._command = args.value;
                break;
            case 'onGetContent':
                this._createOnGetContentOption();
                break;
            case 'onHidden':
                this._createOnHiddenOption();
                break;
            default:
                super._optionChanged(args);
        }
    }
    _createOnGetContentOption() {
        this._onGetContentAction = this._createActionByOption('onGetContent');
    }
    _createOnHiddenOption() {
        this._onHiddenAction = this._createActionByOption('onHidden');
    }
    _hide() {
        this._popupInstance.hide();
        this._isShown = false;
    }
    _show() {
        this._popupInstance
            .content()
            .empty()
            .append(this._onGetContentAction());
        this._popupInstance.show();
        this._isShown = true;
    }
    isVisible() {
        return this._isShown;
    }
}

module.exports = DiagramDialog;
