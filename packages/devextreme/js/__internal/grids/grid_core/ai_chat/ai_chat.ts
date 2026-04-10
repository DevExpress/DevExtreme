import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import type { Properties as ChatProperties } from '@js/ui/chat';
import Chat from '@js/ui/chat';
import type { Properties as PopupProperties, ToolbarItem } from '@js/ui/popup';
import {
  CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS,
  CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS,
  CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS,
} from '@ts/ui/chat/messagelist';
import Popup from '@ts/ui/popup/m_popup';

import {
  CLASSES, CLEAR_CHAT_ICON,
  DEFAULT_CHAT_OPTIONS,
  DEFAULT_POPUP_OPTIONS,
} from './const';
import type { AIChatOptions } from './types';

export class AIChat {
  private readonly popupInstance: Popup;

  private chatInstance?: Chat;

  constructor(
    private options: AIChatOptions,
  ) {
    const { container, createComponent } = options;

    container.addClass(CLASSES.aiChat);
    this.popupInstance = createComponent(container, Popup, this.getPopupConfig());
  }

  private getChatConfig(): ChatProperties {
    return {
      ...DEFAULT_CHAT_OPTIONS,
      emptyViewTemplate: (_data, container): void => {
        const $image = $('<div>')
          .addClass(CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS);
        const $message = $('<div>')
          .addClass(CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS)
          .text(messageLocalization.format('dxDataGrid-aiAChatEmptyViewMessage'));
        const $prompt = $('<div>')
          .addClass(CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS)
          .text(messageLocalization.format('dxDataGrid-aiChatEmptyViewPrompt'));

        $(container)
          .append($image)
          .append($message)
          .append($prompt);
      },
      ...this.options.chatOptions,
    };
  }

  private getPopupConfig(): PopupProperties {
    const clearChatButton = this.getClearChatButton();

    return {
      ...DEFAULT_POPUP_OPTIONS,
      wrapperAttr: { class: `${CLASSES.aiChat} ${CLASSES.aiDialog}` },
      toolbarItems: clearChatButton ? [clearChatButton] : undefined,
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
      ...this.options.popupOptions,
    };
  }

  private getClearChatButton(): ToolbarItem | undefined {
    const { onChatCleared } = this.options;

    if (!onChatCleared) {
      return undefined;
    }

    return {
      widget: 'dxButton',
      toolbar: 'top',
      location: 'after',
      options: {
        icon: CLEAR_CHAT_ICON,
        hint: messageLocalization.format('dxDataGrid-aiAssistantClearButtonText'),
        onClick: onChatCleared,
      },
    };
  }

  public updateOptions(options: AIChatOptions): void {
    this.options = options;

    this.popupInstance.option(this.options.popupOptions);
    this.chatInstance?.option(this.options.chatOptions ?? {});
  }

  public toggle(): Promise<boolean> {
    return this.popupInstance.toggle();
  }

  public hide(): Promise<boolean> {
    return this.popupInstance.hide();
  }

  public isShown(): boolean {
    return !!this.popupInstance?.option('visible');
  }
}
