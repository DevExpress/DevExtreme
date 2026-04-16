import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Message, Properties as ChatProperties } from '@js/ui/chat';
import Chat from '@js/ui/chat';
import type { Properties as PopupProperties, ToolbarItem } from '@js/ui/popup';
import { AI_ASSISTANT_AUTHOR_ID } from '@ts/grids/grid_core/ai_assistant/const';
import {
  CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS,
  CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS,
  CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS,
} from '@ts/ui/chat/messagelist';
import ProgressBar from '@ts/ui/m_progress_bar';
import Popup from '@ts/ui/popup/m_popup';

import {
  CLASSES, CLEAR_CHAT_ICON,
  DEFAULT_CHAT_OPTIONS,
  DEFAULT_POPUP_OPTIONS,
} from './const';
import type { AIChatOptions, MessageStatus } from './types';

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
          .addClass(CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS)
          .addClass(CLASSES.aiChatEmptyImage);
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
      messageTemplate: (data, container): void => {
        const { message } = data;

        if (message?.author?.id === AI_ASSISTANT_AUTHOR_ID) {
          this.renderMessage(message, container);
        } else {
          $(container).text(message?.text);
        }
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

  private renderMessageIcon($parent: dxElementWrapper): void {
    $('<i>')
      .addClass(`dx-icon dx-icon-sparkle ${CLASSES.messageIcon}`)
      .appendTo($parent);
  }

  private renderMessageHeader($parent: dxElementWrapper, text: string): void {
    $('<b>')
      .addClass(CLASSES.messageHeader)
      .text(text)
      .appendTo($parent);
  }

  private renderMessageGroupOperations($parent: dxElementWrapper, status: MessageStatus): void {
    switch (status) {
      case 'pending':
        this.renderPendingOperation($parent);
        break;
      case 'success':
        this.renderSuccessOperations($parent);
        break;
      case 'error':
        this.renderErrorOperations($parent);
        break;
      default:
        break;
    }
  }

  private renderPendingOperation($parent: dxElementWrapper): void {
    $('<div>')
      .addClass(CLASSES.messageGroupOperations)
      .text('Processing...')
      .appendTo($parent);

    const $progressBar = $('<div>')
      .addClass(CLASSES.messageProgressBar)
      .appendTo($parent);

    this.options.createComponent($progressBar, ProgressBar, {
      value: false,
      visible: true,
      showStatus: false,
      width: '100%',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private renderSuccessOperations($parent: dxElementWrapper): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private renderErrorOperations($parent: dxElementWrapper): void {}

  public updateOptions(options: AIChatOptions, updatePopup: boolean, updateChat: boolean): void {
    this.options = options;

    if (updatePopup) {
      this.popupInstance.option(this.options.popupOptions);
    }

    if (updateChat && this.options.chatOptions) {
      this.chatInstance?.option(this.options.chatOptions);
    }
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

  public renderMessage(message: Message, container: HTMLElement): void {
    const $message = $('<div>')
      .addClass(`${CLASSES.message} ${CLASSES.messagePending}`)
      .appendTo(container);

    this.renderMessageIcon($message);

    const $content = $('<div>')
      .addClass(CLASSES.messageContent)
      .appendTo($message);

    this.renderMessageHeader($content, message.text);
    this.renderMessageGroupOperations($content, message.status);
  }
}
