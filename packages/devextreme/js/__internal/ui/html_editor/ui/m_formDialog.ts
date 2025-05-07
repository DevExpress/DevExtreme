import localizationMessage from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import Form from '@js/ui/form';
import type { Properties as PopupProperties } from '@js/ui/popup';
import { isFluent, isMaterialBased } from '@js/ui/themes';

import BaseDialog from './m_baseDialog';

const FORM_CLASS = 'dx-formdialog-form';
const FORM_DIALOG_CLASS = 'dx-formdialog';

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

export default class FormDialog extends BaseDialog {
  _form!: Form;

  beforeAddButtonAction?: () => boolean;

  constructor($container: dxElementWrapper, popupConfig: PopupProperties) {
    super($container, popupConfig);

    this._attachOptionChangedHandler();
  }

  protected _attachOptionChangedHandler(): void {
    this._popup?.on('optionChanged', ({ name, value }) => {
      if (name === 'title') {
        this._onTitleChanged(value);
      }
    });
  }

  protected _escKeyHandler(): void {
    this._popup?.hide();
  }

  protected _addEscapeHandler(e): void {
    e.component.registerKeyHandler('escape', this._escKeyHandler.bind(this));
  }

  protected _getPopupConfig(): PopupProperties {
    const baseConfig = super._getPopupConfig();

    return extend(true, {}, baseConfig, {
      showCloseButton: false,
      onInitialized: (e) => {
        this._popup = e.component;
        this._popup.on('hiding', () => this.onHiding());
        this._popup.on('shown', () => { this._form.focus(); });
        this._addEscapeHandler.bind(this);
      },
      toolbarItems: [
        {
          toolbar: 'bottom',
          location: 'after',
          widget: 'dxButton',
          options: {
            onInitialized: this._addEscapeHandler.bind(this),
            text: localizationMessage.format('OK'),
            onClick: (e): void => {
              this.callAddButtonAction(e.event);
            },
            ...getApplyButtonConfig(),
          },
        },
        {
          toolbar: 'bottom',
          location: 'after',
          widget: 'dxButton',
          options: {
            onInitialized: this._addEscapeHandler.bind(this),
            text: localizationMessage.format('Cancel'),
            onClick: (): void => {
              this._popup.hide();
            },
            ...getCancelButtonConfig(),
          },
        },
      ],
      ...this._popupUserConfig,
    }) as PopupProperties;
  }

  protected _renderContent($contentElem: dxElementWrapper): void {
    const $formContainer = $('<div>').appendTo($contentElem);

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

    this._updateFormLabel();
  }

  protected _getPopupClass(): string {
    return FORM_DIALOG_CLASS;
  }

  protected _onTitleChanged(value: string) {
    this._updateFormLabel(value);
  }

  _renderForm($container: dxElementWrapper, options): void {
    $container.addClass(FORM_CLASS);
    this._form = new Form($container.get(0), options);
    this._updateFormLabel();
  }

  _updateFormLabel(text?: string): void {
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

  callAddButtonAction(event): void {
    if (this.beforeAddButtonAction && !this.beforeAddButtonAction()) {
      return;
    }

    const formData = this._form.option('formData');

    this.hide(formData, event);
  }

  show(formUserConfig): Promise<unknown> | undefined {
    const formConfig = extend(this._getDefaultFormOptions(), formUserConfig);

    this._form.option(formConfig);

    return super.show();
  }

  hide(formData, event): void {
    this.deferred?.resolve(formData, event);

    super.hide();
  }

  onHiding(): void {
    this.beforeAddButtonAction = undefined;

    super.onHiding();
  }

  formOption(...args) {
    // @ts-expect-error
    return this._form.option.apply(this._form, args);
  }
}
