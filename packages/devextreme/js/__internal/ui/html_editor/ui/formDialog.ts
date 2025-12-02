import localizationMessage from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { ClickEvent } from '@js/ui/button';
import type { EditorEnterKeyEvent, Item, SimpleItem } from '@js/ui/form';
import Form from '@js/ui/form';
import type { InitializedEvent, Properties as PopupProperties } from '@js/ui/popup';
import type Popup from '@js/ui/popup';
import { current, isFluent, isMaterialBased } from '@js/ui/themes';
import type { FormProperties } from '@ts/ui/form/form';

import BaseDialog from './m_baseDialog';

interface ButtonConfig {
  stylingMode?: string;
  type?: string;
}

interface FormOptions {
  colCount: number;
  width: string;
  labelLocation: string;
}

const FORM_CLASS = 'dx-formdialog-form';
const FORM_DIALOG_CLASS = 'dx-formdialog';

const getApplyButtonConfig = (): ButtonConfig => {
  if (isFluent(current())) {
    return {
      stylingMode: 'contained',
      type: 'default',
    };
  }

  return {};
};

const getCancelButtonConfig = (): ButtonConfig => {
  if (isFluent(current())) {
    return {
      stylingMode: 'outlined',
      type: 'normal',
    };
  }

  return {};
};

export default class FormDialog extends BaseDialog {
  private _form!: Form;

  public beforeAddButtonAction?: () => boolean;

  constructor($container: dxElementWrapper, popupConfig: PopupProperties) {
    super($container, popupConfig);

    this._attachOptionChangedHandler();
  }

  private _attachOptionChangedHandler(): void {
    this._popup?.on('optionChanged', ({ name, value }) => {
      if (name === 'title') {
        this._onTitleChanged(value);
      }
    });
  }

  protected _getPopupConfig(): PopupProperties {
    const baseConfig = super._getPopupConfig();

    return extend(true, {}, baseConfig, {
      showCloseButton: false,
      onInitialized: (e: InitializedEvent) => {
        this._popup = e.component as Popup;
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
            onClick: (e: ClickEvent): void => {
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
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              this._popup.hide();
            },
            ...getCancelButtonConfig(),
          },
        },
      ],
      ...this._popupConfig,
    }) as PopupProperties;
  }

  protected _renderContent($contentElem: dxElementWrapper): void {
    const $formContainer = $('<div>').appendTo($contentElem);

    this._renderForm($formContainer, {
      onEditorEnterKey: (e: EditorEnterKeyEvent): void => {
        // @ts-expect-error 'event' does not exist in EditorEnterKeyEvent
        this.callAddButtonAction(e.event);
      },
      customizeItem: (item: Item) => {
        if (item.itemType === 'simple') {
          (item as SimpleItem).editorOptions = extend(
            true,
            {},
            (item as SimpleItem).editorOptions,
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

  private _onTitleChanged(value: string): void {
    this._updateFormLabel(value);
  }

  private _renderForm($container: dxElementWrapper, options: Partial<FormProperties>): void {
    $container.addClass(FORM_CLASS);
    this._form = new Form($container.get(0), options);
    this._updateFormLabel();
  }

  private _updateFormLabel(text?: string): void {
    const label = text ?? this.popupOption('title');

    this._form
      ?.$element()
      .attr('aria-label', label as string);
  }

  private _getDefaultFormOptions(): FormOptions {
    return {
      colCount: 1,
      width: 'auto',
      labelLocation: isMaterialBased(current()) ? 'top' : 'left',
    };
  }

  public callAddButtonAction(event?: Event): void {
    if (this.beforeAddButtonAction && !this.beforeAddButtonAction()) {
      return;
    }

    const formData = this._form.option('formData');

    this.hide(formData, event);
  }

  public show(formUserConfig: FormProperties): Promise<unknown> | undefined {
    const formConfig = extend(this._getDefaultFormOptions(), formUserConfig);

    this._form.option(formConfig);

    return super.show();
  }

  public hide(formData: FormProperties, event?: Event): void {
    this.deferred?.resolve(formData, event);

    super.hide();
  }

  public onHiding(): void {
    this.beforeAddButtonAction = undefined;

    super.onHiding();
  }

  public formOption(...args: unknown[]): unknown {
    // @ts-expect-error args
    // eslint-disable-next-line prefer-spread
    return this._form.option.apply(this._form, args);
  }
}
