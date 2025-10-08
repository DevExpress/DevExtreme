import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as ButtonProperties } from '@js/ui/button';
import type { Properties as PopupProperties } from '@js/ui/popup';
import Popup from '@js/ui/popup';
import type { Properties as TextAreaProperties } from '@js/ui/text_area';
import TextArea from '@js/ui/text_area';

import { CLASSES, DEFAULT_POPUP_OPTIONS } from './const';
import type { AiPromptEditorOptions } from './types';
import { getValue, isValueChanged } from './utils';

export class AiPromptEditor {
  private readonly popupInstance: Popup;

  private editorInstance!: TextArea;

  private value: string;

  constructor(
    private options: AiPromptEditorOptions,
  ) {
    const { container, createComponent } = options;

    container.addClass(CLASSES.aiPromptEditor);
    this.value = getValue(options.value);
    this.popupInstance = createComponent(container, Popup, this.getPopupConfig());
  }

  private updateButtonOption(buttonIndex: number, optionName: string, optionValue: unknown): void {
    this.popupInstance.option(`toolbarItems[${buttonIndex}].options.${optionName}`, optionValue);
  }

  private updateToolbarItemVisibility(itemIndex: number, visible: boolean): void {
    this.popupInstance.option(`toolbarItems[${itemIndex}].visible`, visible);
  }

  private getTextAreaConfig(): TextAreaProperties {
    return {
      value: this.value,
      onValueChanged: (e): void => {
        this.updateButtonOption(1, 'disabled', !isValueChanged(this.value, e.value)); // Update the disable state of the Apply button
      },
      valueChangeEvent: 'input change keyup',
      ...this.options.editorOptions,
    };
  }

  private getPopupConfig(): PopupProperties {
    return {
      ...DEFAULT_POPUP_OPTIONS,
      title: messageLocalization.format('dxDataGrid-aiPromptEditorTitle'),
      wrapperAttr: { class: CLASSES.aiPromptEditor },
      contentTemplate: (): dxElementWrapper => {
        const $editorContainer = $('<div>').addClass(CLASSES.aiPromptEditorTextArea);

        this.editorInstance = this.options.createComponent(
          $editorContainer,
          TextArea,
          this.getTextAreaConfig(),
        );

        return $editorContainer;
      },
      toolbarItems: [
        {
          toolbar: 'bottom',
          location: 'before',
          widget: 'dxButton',
          options: this.getRegenerateDataButtonConfig(),
        },
        {
          toolbar: 'bottom',
          location: 'after',
          widget: 'dxButton',
          options: this.getApplyButtonConfig(),
        },
        {
          toolbar: 'bottom',
          location: 'after',
          widget: 'dxButton',
          visible: false,
          options: this.getStopButtonConfig(),
        },
      ],
      ...this.options.popupOptions,
    };
  }

  private getApplyButtonConfig(): ButtonProperties {
    return {
      text: messageLocalization.format('dxDataGrid-applyButton'),
      disabled: !this.editorInstance || !isValueChanged(this.value, this.editorInstance.option('value')),
      elementAttr: {
        class: CLASSES.aiPromptEditorApplyButton,
      },
      onClick: (): void => {
        this.applyButtonHandler();
      },
    };
  }

  private getRegenerateDataButtonConfig(): ButtonProperties {
    const { onRefresh } = this.options;

    return {
      text: messageLocalization.format('dxDataGrid-regenerateDataButton'),
      disabled: !this.value,
      elementAttr: {
        class: CLASSES.aiPromptEditorRefreshButton,
      },
      onClick: (): void => {
        onRefresh?.();
      },
    };
  }

  private getStopButtonConfig(): ButtonProperties {
    return {
      text: messageLocalization.format('dxDataGrid-stopButton'),
      elementAttr: {
        class: CLASSES.aiPromptEditorStopButton,
      },
      onClick: (): void => {
        this.stopButtonHandler();
      },
    };
  }

  private setValue(value: string): void {
    this.value = getValue(value);
  }

  private applyButtonHandler(): void {
    const { onSubmit } = this.options;

    onSubmit?.();
  }

  private stopButtonHandler(): void {
    this.options.onStop?.();
  }

  public show(): Promise<boolean> {
    return this.popupInstance.show();
  }

  public hide(): Promise<boolean> {
    return this.popupInstance.hide();
  }

  public toggleDisableState(disabled: boolean): void {
    this.updateButtonOption(0, 'disabled', disabled ? true : !this.value); // Update the disable state of the Regenerate data button
    this.updateButtonOption(
      1,
      'disabled',
      disabled ? true : !isValueChanged(this.value, this.editorInstance.option('value')),
    ); // Update the disable state of the Apply button
    this.editorInstance.option('disabled', disabled); // Update TextArea disable state
  }

  public toggleApplyButtonVisibility(visible: boolean): void {
    this.updateToolbarItemVisibility(1, visible); // Update Apply button visibility
    this.updateToolbarItemVisibility(2, !visible); // Update Stop button visibility
  }

  public updateValue(value: string): void {
    this.setValue(value);
    this.editorInstance.option('value', value);
  }

  public updateOptions(options: AiPromptEditorOptions): void {
    this.options = options;
    this.updateValue(getValue(options.value));
    this.popupInstance.option(this.getPopupConfig());
  }
}
