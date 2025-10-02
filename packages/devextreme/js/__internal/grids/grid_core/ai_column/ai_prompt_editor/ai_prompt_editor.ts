import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as ButtonProperties } from '@js/ui/button';
import Popup from '@js/ui/popup';
import TextArea from '@js/ui/text_area';

import type { AiPromptEditorOptions } from './types';

export class AiPromptEditor {
  private readonly popupInstance: Popup;

  private editorInstance!: TextArea;

  constructor(
    private readonly options: AiPromptEditorOptions,
  ) {
    const { createComponent } = options;

    this.popupInstance = createComponent(options.container, Popup, {
      visible: false,
      contentTemplate: (): dxElementWrapper => {
        const $editorContainer = $('<div>');

        this.editorInstance = createComponent(
          $editorContainer,
          TextArea,
          {
            ...options.editorOptions,
          },
        );

        return $editorContainer;
      },
      toolbarItems: [
        {
          toolbar: 'bottom', location: 'before', widget: 'dxButton', options: this.getRegenerateDataButtonConfig(),
        },
        {
          toolbar: 'bottom', location: 'after', widget: 'dxButton', options: this.getApplyButtonConfig(),
        },
      ],
      ...options.popupOptions,
    });
  }

  private getApplyButtonConfig(): ButtonProperties {
    const { onRefresh } = this.options;

    return {
      text: messageLocalization.format('dxDataGrid-applyButton'),
      onClick: (): void => {
        onRefresh?.();
      },
    };
  }

  private getRegenerateDataButtonConfig(): ButtonProperties {
    const { onSubmit } = this.options;

    return {
      text: messageLocalization.format('dxDataGrid-regenerateDataButton'),
      onClick: (): void => {
        onSubmit?.();
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
