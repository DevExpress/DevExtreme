import $ from '../../../core/renderer';
import { extend } from '../../../core/utils/extend';

import Popup from '../../popup';
import Form from '../../form';
import { Deferred } from '../../../core/utils/deferred';
import localizationMessage from '../../../localization/message';
import { getCurrentScreenFactor, hasWindow } from '../../../core/utils/window';
import devices from '../../../core/devices';
import { isMaterial } from '../../themes';

const DIALOG_CLASS = 'dx-formdialog';
const FORM_CLASS = 'dx-formdialog-form';

class FormDialog {
    constructor(editorInstance, popupConfig) {
        this._editorInstance = editorInstance;
        this._popupUserConfig = popupConfig;

        this._renderPopup();
        this._attachOptionChangedHandler();
    }

    _renderPopup() {
        const editorInstance = this._editorInstance;
        const $container = $('<div>')
            .addClass(DIALOG_CLASS)
            .appendTo(editorInstance.$element());
        const popupConfig = this._getPopupConfig();

        return editorInstance._createComponent($container, Popup, popupConfig);
    }

    _attachOptionChangedHandler() {
        this._popup
            ?.on(
                'optionChanged',
                ({ name, value }) => {
                    if(name === 'title') {
                        this._updateFormLabel(value);
                    }
                }
            );
    }

    _escKeyHandler() {
        this._popup.hide();
    }

    _addEscapeHandler(e) {
        e.component.registerKeyHandler('escape', this._escKeyHandler.bind(this));
    }

    _isSmallScreen() {
        const screenFactor = hasWindow() ? getCurrentScreenFactor() : null;
        return devices.real().deviceType === 'phone' || screenFactor === 'xs';
    }

    _getPopupConfig() {
        return extend({
            onInitialized: (e) => {
                this._popup = e.component;
                this._popup.on('hiding', () => this.onHiding());
                this._popup.on('shown', () => { this._form.focus(); });
            },
            deferRendering: false,
            focusStateEnabled: false,
            showCloseButton: false,
            fullScreen: this._isSmallScreen(),
            contentTemplate: (contentElem) => {
                const $formContainer = $('<div>').appendTo(contentElem);

                this._renderForm($formContainer, {
                    onEditorEnterKey: (e) => this.callAddButtonAction(e.event),
                    customizeItem: (item) => {
                        if(item.itemType === 'simple') {
                            item.editorOptions = extend(
                                true,
                                {},
                                item.editorOptions,
                                { onInitialized: this._addEscapeHandler.bind(this) }
                            );
                        }
                    }
                });
            },
            toolbarItems: [
                {
                    toolbar: 'bottom',
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        onInitialized: this._addEscapeHandler.bind(this),
                        text: localizationMessage.format('OK'),
                        onClick: (e) => this.callAddButtonAction(e.event)
                    }
                }, {
                    toolbar: 'bottom',
                    location: 'after',
                    widget: 'dxButton',
                    options: {
                        onInitialized: this._addEscapeHandler.bind(this),
                        text: localizationMessage.format('Cancel'),
                        onClick: () => {
                            this._popup.hide();
                        }
                    }
                }
            ],
            _wrapperClassExternal: DIALOG_CLASS,
        }, this._popupUserConfig);
    }

    onHiding() {
        this.beforeAddButtonAction = undefined;
        this.deferred.reject();
    }

    callAddButtonAction(event) {
        if(this.beforeAddButtonAction && !this.beforeAddButtonAction()) {
            return;
        }

        this.hide(this._form.option('formData'), event);
    }

    _renderForm($container, options) {
        $container.addClass(FORM_CLASS);
        this._form = this._editorInstance._createComponent($container, Form, options);
        this._updateFormLabel();
    }

    _updateFormLabel(text) {
        const label = text ?? this.popupOption('title');
        this._form
            ?.$element()
            .attr('aria-label', label);
    }

    _getDefaultFormOptions() {
        return {
            colCount: 1,
            width: 'auto',
            labelLocation: isMaterial() ? 'top' : 'left'
        };
    }

    formOption(optionName, optionValue) {
        return this._form.option.apply(this._form, arguments);
    }

    show(formUserConfig) {
        if(this._popup.option('visible')) {
            return;
        }

        this.deferred = new Deferred();
        const formConfig = extend(this._getDefaultFormOptions(), formUserConfig);

        this._form.option(formConfig);

        this._popup.show();

        return this.deferred.promise();
    }

    hide(formData, event) {
        this.deferred.resolve(formData, event);
        this._popup.hide();
    }

    popupOption(optionName, optionValue) {
        return this._popup.option.apply(this._popup, arguments);
    }
}

export default FormDialog;
