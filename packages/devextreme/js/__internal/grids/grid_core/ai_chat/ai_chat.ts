import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import messageLocalization from '@js/common/core/localization/message';
import type { ArrayStore } from '@js/common/data';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { InitializedEvent } from '@js/ui/button';
import type dxButton from '@js/ui/button';
import type { Message, Properties as ChatProperties } from '@js/ui/chat';
import Chat from '@js/ui/chat';
import type { Properties as PopupProperties, ToolbarItem } from '@js/ui/popup';
import { MessageStatus } from '@ts/grids/grid_core/ai_assistant/const';
import {
  CHAT_MESSAGELIST_EMPTY_IMAGE_CLASS,
  CHAT_MESSAGELIST_EMPTY_MESSAGE_CLASS,
  CHAT_MESSAGELIST_EMPTY_PROMPT_CLASS,
} from '@ts/ui/chat/messagelist';
import ProgressBar from '@ts/ui/m_progress_bar';
import Popup from '@ts/ui/popup/m_popup';

import type { AIMessage } from '../ai_assistant/types';
import { isAIMessage } from '../ai_assistant/utils';
import gridCoreUtils from '../m_utils';
import {
  CLASSES, CLEAR_CHAT_ICON,
  DEFAULT_CHAT_OPTIONS,
  DEFAULT_POPUP_OPTIONS,
  REGENERATE_ICON,
} from './const';
import type { AIChatOptions, CommandResult } from './types';
import {
  findMessageById,
  getCommandItemStyle,
  getMessageIconName,
  getMessageStateClass,
  needToRenderCommandList,
  needToShowRegenerateButton,
} from './utils';

export class AIChat {
  private readonly popupInstance: Popup;

  private chatInstance?: Chat;

  private clearChatButtonInstance?: dxButton;

  private disabled = false;

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
      messageTemplate: ({
        message,
        component,
      }: {
        message: Message,
        component: Chat,
      }, container): void => {
        if (!message) {
          return;
        }

        const items = component.option('items');
        const actualMessage = findMessageById(items, message.id) ?? message;

        if (isAIMessage(actualMessage)) {
          this.renderAIMessage(actualMessage, container);
        } else {
          $(container).text(actualMessage?.text ?? '');
        }
      },
      showUserName: false,
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
    return {
      widget: 'dxButton',
      toolbar: 'top',
      location: 'after',
      cssClass: `${CLASSES.clearChatButton}`,
      options: {
        icon: CLEAR_CHAT_ICON,
        hint: messageLocalization.format('dxDataGrid-aiAssistantClearButtonText'),
        onClick: (): void => {
          this.clear();
        },
        onInitialized: (e: InitializedEvent): void => {
          this.clearChatButtonInstance = e.component;
        },
      },
    };
  }

  private renderMessageIcon($parent: dxElementWrapper, message: AIMessage): void {
    $('<i>')
      .addClass(`dx-icon dx-icon-${getMessageIconName(message)} ${CLASSES.messageIcon}`)
      .appendTo($parent);
  }

  private renderMessageHeader(
    $parent: dxElementWrapper,
    message: AIMessage,
  ): void {
    const $row = $('<div>')
      .addClass(CLASSES.messageHeaderRow)
      .appendTo($parent);
    const headerText = message.headerText ?? '';

    $('<div>')
      .addClass(CLASSES.messageHeader)
      .text(headerText)
      .appendTo($row);

    if (needToShowRegenerateButton(message) && this.options.onRegenerate) {
      const $button = $('<i>')
        .addClass(`dx-icon dx-icon-${REGENERATE_ICON} ${CLASSES.messageRegenerateButton}`)
        .appendTo($row);

      eventsEngine.on($button, clickEventName, () => {
        if (!this.disabled) {
          this.options.onRegenerate?.(message);
        }
      });
    }
  }

  private renderMessageStateContent($parent: dxElementWrapper, message: AIMessage): void {
    switch (true) {
      case (needToRenderCommandList(message)):
        this.renderCommandList($parent, message.commands);
        break;
      case message.status === MessageStatus.Failure:
        this.renderErrorState($parent, message);
        break;
      case message.status === MessageStatus.Pending:
      default:
        this.renderPendingState($parent);
    }
  }

  private renderPendingState($parent: dxElementWrapper): void {
    $('<div>')
      .addClass(CLASSES.messageStatus)
      .text(messageLocalization.format('dxDataGrid-aiAssistantProcessingMessage'))
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
    const { stateClass, emoji } = getCommandItemStyle(command.status);

    const $item = $('<li>')
      .addClass(`${CLASSES.actionListItem} ${stateClass}`)
      .appendTo($parent);

    $('<span>')
      .addClass(CLASSES.actionListItemIcon)
      .text(emoji)
      .appendTo($item);

    $('<span>')
      .addClass(CLASSES.actionListItemText)
      .text(command.message)
      .attr('title', command.message)
      .appendTo($item);
  }

  private renderCommandList(
    $container: dxElementWrapper,
    commands?: CommandResult[],
  ): void {
    if (!commands?.length) {
      return;
    }

    const $list = $('<ul>')
      .addClass(CLASSES.actionList)
      .appendTo($container);

    commands.forEach((command) => {
      this.renderCommandListItem($list, command);
    });
  }

  private renderErrorState(
    $container: dxElementWrapper,
    message: AIMessage,
  ): void {
    $('<div>')
      .addClass(CLASSES.messageErrorText)
      .text(message.errorText ?? '')
      .appendTo($container);
  }

  private setTextAreaDisabled(disabled: boolean): void {
    const $textArea = this.chatInstance?.$element().find(`.${CLASSES.textArea}`);

    if ($textArea?.length) {
      gridCoreUtils.getWidgetInstance($textArea)?.option('disabled', disabled);
    }
  }

  private setSpeechToTextDisabled(disabled: boolean): void {
    const $speechToText = this.chatInstance?.$element().find(`.${CLASSES.speechToTextButton}`);

    if ($speechToText?.length) {
      gridCoreUtils.getWidgetInstance($speechToText)?.option('disabled', disabled);
    }
  }

  private setClearChatButtonDisabled(disabled: boolean): void {
    this.clearChatButtonInstance?.option('disabled', disabled);
  }

  private setChatSuggestionsDisabled(disabled: boolean): void {
    this.chatInstance?.option({ suggestions: { disabled } });
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

  public setDisabled(disabled: boolean): void {
    if (this.disabled === disabled) {
      return;
    }

    this.disabled = disabled;
    this.chatInstance?.$element().toggleClass(CLASSES.disabled, disabled);

    this.setTextAreaDisabled(disabled);
    this.setSpeechToTextDisabled(disabled);
    this.setClearChatButtonDisabled(disabled);
    this.setChatSuggestionsDisabled(disabled);
  }

  public renderAIMessage(message: AIMessage, container: HTMLElement): void {
    const $message = $('<div>')
      .addClass(`${CLASSES.message} ${getMessageStateClass(message.status)}`)
      .appendTo(container);

    this.renderMessageIcon($message, message);

    const $content = $('<div>')
      .addClass(CLASSES.messageContent)
      .appendTo($message);

    this.renderMessageHeader($content, message);
    this.renderMessageStateContent($content, message);
  }

  public clear(): void {
    const dataSource = this.chatInstance?.getDataSource();
    const store = dataSource?.store() as ArrayStore<Message, string>;

    store?.clear();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    dataSource?.reload();
  }

  public getUserId(): string {
    return this.chatInstance?.option('user.id') as string ?? '';
  }
}
