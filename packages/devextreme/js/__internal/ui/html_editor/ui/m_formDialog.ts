import localizationMessage from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import Form from '@js/ui/form';
import { isFluent, isMaterialBased } from '@js/ui/themes';

import DialogBase from './m_baseDialog';

const FORM_CLASS = 'dx-formdialog-form';

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

export default class FormDialog extends DialogBase {
  _form!: Form;

  beforeAddButtonAction?: () => boolean;

  protected _getPopupConfig() {
    const baseConfig = super._getPopupConfig();

    return extend(true, {}, baseConfig, {
      contentTemplate: (contentElem) => {
        const $formContainer = $('<div>').appendTo(contentElem);
        this._renderForm($formContainer, {
          onEditorEnterKey: (e) => this.callAddButtonAction(e.event),
          customizeItem: (item) => {
            if (item.itemType === 'simple') {
              item.editorOptions = extend(true, {}, item.editorOptions, {
                onInitialized: this._addEscapeHandler.bind(this),
              });
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
            text: localizationMessage.format('OK'),
            onClick: (e) => this.callAddButtonAction(e.event),
            ...getApplyButtonConfig(),
          },
        },
        {
          toolbar: 'bottom',
          location: 'after',
          widget: 'dxButton',
          options: {
            text: localizationMessage.format('Cancel'),
            onClick: () => this._popup.hide(),
            ...getCancelButtonConfig(),
          },
        },
      ],
    });
  }

  protected _renderContent($container) {
    $container.addClass(FORM_CLASS);

    this._form = this._editorInstance._createComponent($container, Form, {
      ...this._getDefaultFormOptions(),
      onEditorEnterKey: (e) => this.callAddButtonAction(e.event),
      customizeItem: (item) => {
        if (item.itemType === 'simple') {
          item.editorOptions = extend(true, {}, item.editorOptions, {
            onInitialized: this._addEscapeHandler.bind(this),
          });
        }
      },
    });

    this._updateFormLabel();
  }

  protected _onTitleChanged(value: string) {
    this._updateFormLabel(value);
  }

  _renderForm($container, options) {
    $container.addClass(FORM_CLASS);
    this._form = this._editorInstance._createComponent($container, Form, options);
    this._updateFormLabel();
  }

  _updateFormLabel(text?: string) {
    // @ts-expect-error
    const label = text ?? this.popupOption('title') as string;
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

  _attachOptionChangedHandler() {
    this._popup?.on(
      'optionChanged',
      ({ name, value }) => {
        if (name === 'title') {
          this._updateFormLabel(value);
        }
      },
    );
  }

  callAddButtonAction(event) {
    if (this.beforeAddButtonAction && !this.beforeAddButtonAction()) {
      return;
    }

    const formData = this._form.option('formData');
    this.hide(event, { formData });
  }

  show(formUserConfig) {
    const formConfig = extend(this._getDefaultFormOptions(), formUserConfig);

    this._form.option(formConfig);

    return super.show();
  }

  hide(event, options) {
    const { formData } = options;

    this.deferred?.resolve(formData, event);
    this._popup.hide();
  }

  formOption(...args) {
    // @ts-expect-error
    return this._form.option.apply(this._form, args);
  }
}
