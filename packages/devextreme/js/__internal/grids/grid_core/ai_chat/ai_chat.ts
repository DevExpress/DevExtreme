import $ from '@js/core/renderer';
import type { Properties as ChatProperties } from '@js/ui/chat';
import Chat from '@js/ui/chat';
import type { Properties as PopupProperties } from '@js/ui/popup';
import Popup from '@js/ui/popup';

import { CLASSES, DEFAULT_POPUP_OPTIONS } from './const';
import type { AIChatOptions } from './types';

export class AIChat {
  private readonly popupInstance: Popup;

  private chatInstance!: Chat;

  constructor(
    private readonly options: AIChatOptions,
  ) {
    const { container, createComponent } = options;

    container.addClass(CLASSES.aiChat);
    this.popupInstance = createComponent(container, Popup, this.getPopupConfig());
  }

  private getChatConfig(): ChatProperties {
    return {};
  }

  private getPopupConfig(): PopupProperties {
    return {
      ...DEFAULT_POPUP_OPTIONS,
      wrapperAttr: { class: `${CLASSES.aiChat} ${CLASSES.aiDialog}` },
      contentTemplate: ($container): void => {
        const $editorContainer = $('<div>')
          .addClass(CLASSES.aiChatContent)
          .appendTo($container);

        this.chatInstance = this.options.createComponent(
          $editorContainer,
          Chat,
          this.getChatConfig(),
        );
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
