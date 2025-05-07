import localizationMessage from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import {
  // @ts-expect-error
  getCurrentScreenFactor,
  hasWindow,
} from '@js/core/utils/window';
import Form from '@js/ui/form';
import Popup from '@js/ui/popup';
import { isFluent, isMaterialBased } from '@js/ui/themes';

const DIALOG_CLASS = 'dx-formdialog';
const FORM_CLASS = 'dx-formdialog-form';
const DROPDOWN_EDITOR_OVERLAY_CLASS = 'dx-dropdowneditor-overlay';

const getApplyButtonConfig = () => {
  // @ts-expect-error
  if (isFluent()) {
    return {
      stylingMode: 'contained',
      type: 'default',
    };
  }

  return {};
};

const getCancelButtonConfig = () => {
  // @ts-expect-error
  if (isFluent()) {
    return {
      stylingMode: 'outlined',
      type: 'normal',
    };
  }

  return {};
};

class FormDialog {
  _editorInstance?: any;

  _popupUserConfig?: any;

  _popup!: Popup;

  beforeAddButtonAction?: any;

  deferred?: DeferredObj<unknown>;

  _form!: Form;

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
          if (name === 'title') {
            this._updateFormLabel(value);
          }
        },
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
            if (item.itemType === 'simple') {
              item.editorOptions = extend(
                true,
                {},
                item.editorOptions,
                { onInitialized: this._addEscapeHandler.bind(this) },
              );
            }
          },
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
            onClick: (e) => this.callAddButtonAction(e.event),
            ...getApplyButtonConfig(),
          },
        }, {
          toolbar: 'bottom',
          location: 'after',
          widget: 'dxButton',
          options: {
            onInitialized: this._addEscapeHandler.bind(this),
            text: localizationMessage.format('Cancel'),
            onClick: () => {
              this._popup.hide();
            },
            ...getCancelButtonConfig(),
          },
        },
      ],
      _wrapperClassExternal: `${DIALOG_CLASS} ${DROPDOWN_EDITOR_OVERLAY_CLASS}`,
    }, this._popupUserConfig);
  }

  onHiding() {
    this.beforeAddButtonAction = undefined;
    // @ts-expect-error
    this.deferred.reject();
  }

  callAddButtonAction(event) {
    if (this.beforeAddButtonAction && !this.beforeAddButtonAction()) {
      return;
    }

    this.hide(this._form.option('formData'), event);
  }

  _renderForm($container, options) {
    $container.addClass(FORM_CLASS);
    this._form = this._editorInstance._createComponent($container, Form, options);
    // @ts-expect-error
    this._updateFormLabel();
  }

  _updateFormLabel(text) {
    // @ts-expect-error
    const label = text ?? this.popupOption('title');
    this._form
      ?.$element()
      .attr('aria-label', label);
  }

  _getDefaultFormOptions() {
    return {
      colCount: 1,
      width: 'auto',
      // @ts-expect-error
      labelLocation: isMaterialBased() ? 'top' : 'left',
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formOption(optionName, optionValue) {
    // @ts-expect-error
    return this._form.option.apply(this._form, arguments);
  }

  show(formUserConfig) {
    if (this._popup.option('visible')) {
      return;
    }

    this.deferred = Deferred();
    const formConfig = extend(this._getDefaultFormOptions(), formUserConfig);

    this._form.option(formConfig);

    this._popup.show();

    return this.deferred.promise();
  }

  hide(formData, event) {
    // @ts-expect-error
    this.deferred.resolve(formData, event);
    this._popup.hide();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  popupOption(optionName, optionValue) {
    // @ts-expect-error
    return this._popup.option.apply(this._popup, arguments);
  }
}

export default FormDialog;
