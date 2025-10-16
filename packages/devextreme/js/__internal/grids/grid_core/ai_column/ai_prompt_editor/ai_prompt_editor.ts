import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import type { Properties as ButtonProperties } from '@js/ui/button';
import type { Properties as PopupProperties } from '@js/ui/popup';
import Popup from '@js/ui/popup';
import ProgressBar from '@js/ui/progress_bar';
import type { Properties as TextAreaProperties } from '@js/ui/text_area';
import TextArea from '@js/ui/text_area';

import {
  APPLY_BUTTON_INDEX,
  CLASSES, DEFAULT_POPUP_OPTIONS,
  REGENERATE_DATA_BUTTON_INDEX, STOP_BUTTON_INDEX,
} from './const';
import type { AiPromptEditorAction, AiPromptEditorOptions } from './types';
import { getPrompt, isPromptChanged } from './utils';

export class AiPromptEditor {
  private readonly popupInstance: Popup;

  private editorInstance!: TextArea;

  private progressBar!: ProgressBar;

  private prompt: string;

  constructor(
    private options: AiPromptEditorOptions,
  ) {
    const { container, createComponent } = options;

    container.addClass(CLASSES.aiPromptEditor);
    this.prompt = getPrompt(options.prompt);
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
      value: this.prompt,
      height: 140,
      onValueChanged: (e): void => {
        this.updateButtonOption(APPLY_BUTTON_INDEX, 'disabled', !isPromptChanged(this.prompt, e.value)); // Update the disable state of the Apply button
      },
      placeholder: messageLocalization.format('dxDataGrid-aiPromptEditorPlaceholder'),
      valueChangeEvent: 'input change keyup',
      ...this.options.editorOptions,
    };
  }

  private getPopupConfig(): PopupProperties {
    return {
      ...DEFAULT_POPUP_OPTIONS,
      shading: false,
      shadingColor: 'transparent',
      dragEnabled: true,
      hideOnOutsideClick: true,
      title: messageLocalization.format('dxDataGrid-aiPromptEditorTitle'),
      wrapperAttr: { class: `${CLASSES.aiPromptEditor} ${CLASSES.aiDialog}` },
      contentTemplate: ($container): void => {
        const $editorContainer = $('<div>')
          .addClass(CLASSES.aiPromptEditorTextArea)
          .appendTo($container);
        const $progressContainer = $('<div>')
          .addClass(CLASSES.aiPromptEditorProgressBar)
          .appendTo($container);

        this.editorInstance = this.options.createComponent(
          $editorContainer,
          TextArea,
          this.getTextAreaConfig(),
        );
        this.progressBar = this.options.createComponent(
          $progressContainer,
          ProgressBar,
          {
            value: false,
            visible: false,
            showStatus: false,
            width: '100%',
          },
        );
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
      type: 'default',
      icon: 'arrowright',
      stylingMode: 'contained',
      text: messageLocalization.format('dxDataGrid-aiPromptEditorApplyButton'),
      disabled: !this.editorInstance || !isPromptChanged(this.prompt, this.editorInstance.option('value')),
      elementAttr: {
        class: CLASSES.aiPromptEditorApplyButton,
      },
      onClick: this.options.onSubmit,
    };
  }

  private getRegenerateDataButtonConfig(): ButtonProperties {
    return {
      icon: 'refresh',
      stylingMode: 'outlined',
      text: messageLocalization.format('dxDataGrid-aiPromptEditorRegenerateButton'),
      disabled: !this.prompt,
      elementAttr: {
        class: CLASSES.aiPromptEditorRefreshButton,
      },
      onClick: this.options.onRefresh,
    };
  }

  private getStopButtonConfig(): ButtonProperties {
    return {
      type: 'default',
      icon: 'square',
      stylingMode: 'contained',
      text: messageLocalization.format('dxDataGrid-aiPromptEditorStopButton'),
      elementAttr: {
        class: CLASSES.aiPromptEditorStopButton,
      },
      onClick: this.options.onStop,
    };
  }

  private setPrompt(prompt: string): void {
    this.prompt = getPrompt(prompt);
  }

  private toggleDisableState(disabled: boolean): void {
    const editorValue = this.getEditorValue();

    this.updateButtonOption(REGENERATE_DATA_BUTTON_INDEX, 'disabled', disabled ? true : !this.prompt); // Update the disable state of the Regenerate data button
    this.updateButtonOption(
      APPLY_BUTTON_INDEX,
      'disabled',
      disabled ? true : !isPromptChanged(this.prompt, editorValue),
    ); // Update the disable state of the Apply button
    this.editorInstance.option('disabled', disabled); // Update TextArea disable state
    this.popupInstance.option('shading', disabled);
    this.popupInstance.option('hideOnOutsideClick', !disabled);
  }

  public getEditorValue(): string {
    return this.editorInstance.option('value') as string;
  }

  public show(): Promise<boolean> {
    return this.popupInstance.show();
  }

  public hide(): Promise<boolean> {
    return this.popupInstance.hide();
  }

  public isVisible(): boolean {
    return this.popupInstance.option('visible') === true;
  }

  public toggleApplyButtonVisibility(visible: boolean): void {
    this.updateToolbarItemVisibility(APPLY_BUTTON_INDEX, visible); // Update Apply button visibility
    this.updateToolbarItemVisibility(STOP_BUTTON_INDEX, !visible); // Update Stop button visibility
  }

  public setLoading(isLoading: boolean): void {
    this.progressBar.option('visible', isLoading);
  }

  public updatePrompt(prompt: string): void {
    this.setPrompt(prompt);
    this.editorInstance.option('value', prompt);
  }

  /**
   * Updates the component state based on the current action
   * @param action - The current action being performed
   */
  public updateStateOnAction(
    action: AiPromptEditorAction,
  ): void {
    // eslint-disable-next-line default-case
    switch (action) {
      case 'apply':
      case 'regenerate':
        this.setLoading(true);
        this.toggleDisableState(true);
        this.toggleApplyButtonVisibility(false);
        break;
      case 'stop':
        this.setLoading(false);
        this.toggleDisableState(false);
        this.toggleApplyButtonVisibility(true);
        break;
    }
  }

  public updateOptions(options: AiPromptEditorOptions): void {
    this.options = options;
    this.updatePrompt(getPrompt(options.prompt));
    this.popupInstance.option(this.getPopupConfig());
  }
}
