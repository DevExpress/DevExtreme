import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Message, Properties as ChatProperties } from '@js/ui/chat';
import Chat from '@js/ui/chat';
import type { Properties as PopupProperties, ToolbarItem } from '@js/ui/popup';
import { AI_ASSISTANT_AUTHOR_ID, MessageStatus } from '@ts/grids/grid_core/ai_assistant/const';
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
  ERROR_ITEM_EMOJI,
  SUCCESS_ITEM_EMOJI,
} from './const';
import type {
  AIChatOptions, CommandResult, CommandResults,
} from './types';

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

  private isAIChatMessage(message: Message): boolean {
    return message.author?.id === AI_ASSISTANT_AUTHOR_ID;
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

        if (!message) {
          return;
        }

        if (this.isAIChatMessage(message)) {
          this.renderAIMessage(message, container);
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

  private getMessageStateClass(status: MessageStatus): string {
    switch (status) {
      case 'success':
        return CLASSES.messageSuccess;
      case 'error':
        return CLASSES.messageError;
      case 'pending':
      default:
        return CLASSES.messagePending;
    }
  }

  private getMessageIconName(message: Message): string {
    const hasErrors = message.commands?.some(({ status }) => status === MessageStatus.Error);

    if (message.status === MessageStatus.Error || hasErrors) {
      return 'errorcircle';
    }

    if (message.status === MessageStatus.Success) {
      return 'checkmarkcirclefilled';
    }

    return 'sparkle';
  }

  private renderMessageIcon($parent: dxElementWrapper, message: Message): void {
    $('<i>')
      .addClass(`dx-icon dx-icon-${this.getMessageIconName(message)} ${CLASSES.messageIcon}`)
      .appendTo($parent);
  }

  private renderMessageHeader($parent: dxElementWrapper, text: string): void {
    $('<b>')
      .addClass(CLASSES.messageHeader)
      .text(text)
      .appendTo($parent);
  }

  private renderMessageStateContent($parent: dxElementWrapper, message: Message): void {
    switch (message.status) {
      case 'success':
        this.renderSuccessState($parent, message.commands);
        break;
      case 'error':
        this.renderErrorState($parent, message);
        break;
      case 'pending':
      default:
        this.renderPendingState($parent);
    }
  }

  private renderPendingState($parent: dxElementWrapper): void {
    $('<div>')
      .addClass(CLASSES.messageStatus)
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

  private renderCommandListItem(
    $parent: dxElementWrapper,
    command: CommandResult,
  ): void {
    const commandStateClass = command.status === 'error'
      ? CLASSES.messageListItemError
      : CLASSES.messageListItemSuccess;

    const $item = $('<li>')
      .addClass(`${CLASSES.messageListItem} ${commandStateClass}`)
      .appendTo($parent);

    const emoji = command.status === 'error' ? ERROR_ITEM_EMOJI : SUCCESS_ITEM_EMOJI;

    $('<span>')
      .addClass(CLASSES.messageListItemIcon)
      .text(emoji)
      .appendTo($item);

    $('<span>')
      .addClass(CLASSES.messageListItemText)
      .text(command.message)
      .appendTo($item);
  }

  private renderCommandList(
    $container: dxElementWrapper,
    commands?: CommandResults,
  ): void {
    if (!commands?.length) {
      return;
    }

    const $list = $('<ul>')
      .addClass(CLASSES.messageList)
      .appendTo($container);

    commands.forEach((command) => {
      this.renderCommandListItem($list, command);
    });
  }

  private renderSuccessState(
    $container: dxElementWrapper,
    commands?: CommandResults,
  ): void {
    this.renderCommandList($container, commands);
  }

  private renderErrorState(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    $container: dxElementWrapper,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    message: Message,
  ): void {
  }

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

  public renderAIMessage(message: Message, container: HTMLElement): void {
    const $message = $('<div>')
      .addClass(`${CLASSES.message} ${this.getMessageStateClass(message.status)}`)
      .appendTo(container);

    this.renderMessageIcon($message, message);

    const $content = $('<div>')
      .addClass(CLASSES.messageContent)
      .appendTo($message);

    this.renderMessageHeader($content, message.text ?? '');
    this.renderMessageStateContent($content, message);
  }
}
