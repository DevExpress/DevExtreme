import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
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
      ...options.popupOptions,
    });
  }

  public show(): Promise<boolean> {
    return this.popupInstance.show();
  }

  public hide(): Promise<boolean> {
    return this.popupInstance.hide();
  }
}
