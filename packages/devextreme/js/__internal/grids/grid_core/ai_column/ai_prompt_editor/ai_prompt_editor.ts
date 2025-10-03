import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { when } from '@js/core/utils/deferred';
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

  private promptValue: string;

  constructor(
    private readonly options: AiPromptEditorOptions,
  ) {
    const { container, createComponent } = options;

    container.addClass(CLASSES.aiPromptEditor);
    this.promptValue = getValue(options.value);
    this.popupInstance = createComponent(container, Popup, this.getPopupConfig());
  }

  private updateButtonOption(buttonIndex: number, optionName: string, optionValue: unknown): void {
    this.popupInstance.option(`toolbarItems[${buttonIndex}].options.${optionName}`, optionValue);
  }

  private getTextAreaConfig(): TextAreaProperties {
    return {
      value: this.promptValue,
      onValueChanged: (e): void => {
        this.updateButtonOption(1, 'disabled', !isValueChanged(this.promptValue, e.value));
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
      ],
      ...this.options.popupOptions,
    };
  }

  private getApplyButtonConfig(): ButtonProperties {
    const { onSubmit } = this.options;

    return {
      text: messageLocalization.format('dxDataGrid-applyButton'),
      disabled: !this.editorInstance || !isValueChanged(this.promptValue, this.editorInstance.option('value')),
      elementAttr: {
        class: CLASSES.aiPromptEditorApplyButton,
      },
      onClick: (): void => {
        this.promptValue = getValue(this.editorInstance.option('value'));
        this.updateButtonOption(1, 'disabled', true);

        when(onSubmit?.()).done(() => {
          this.updateButtonOption(0, 'disabled', !this.promptValue);
        });
      },
    };
  }

  private getRegenerateDataButtonConfig(): ButtonProperties {
    const { onRefresh } = this.options;

    return {
      text: messageLocalization.format('dxDataGrid-regenerateDataButton'),
      disabled: !this.promptValue,
      elementAttr: {
        class: CLASSES.aiPromptEditorRefreshButton,
      },
      onClick: (): void => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        onRefresh?.();
      },
    };
  }

  public show(): Promise<boolean> {
    return this.popupInstance.show();
  }

  public hide(): Promise<boolean> {
    return this.popupInstance.hide();
  }
}
