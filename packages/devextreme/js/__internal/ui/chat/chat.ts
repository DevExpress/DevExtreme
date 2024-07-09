import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import eventsEngine from '@js/events/core/events_engine';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import Widget from '../widget';

export interface ChatOptions extends WidgetOptions<Chat> {
  userId: string | null;
  items: [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMessageSend: any;
}

export interface User {
  id: string;
  name: string;
}

class Chat extends Widget<ChatOptions> {
  _supportedKeys(): Record<string, (e: KeyboardEvent) => void> {
    return {
      ...super._supportedKeys(),
    };
  }

  _getDefaultOptions(): ChatOptions {
    return {
      ...super._getDefaultOptions(),
      ...{
        userId: null,
        items: [],
        // eslint-disable-next-line max-len
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        onMessageSend: (e: any): void => {},
      },
    };
  }

  _init(): void {
    super._init();
  }

  _initMarkup(): void {
    super._initMarkup();

    $(this.element()).addClass('dx-chat');

    this._renderMessageList();
    this._renderMessageBubble();
  }

  _renderMessageList(): void {
    const $messageList = $('<div>').addClass('dx-chat-message-list');

    $(this.element()).append($messageList);
  }

  _renderMessageBubble(): void {
    const $messageBubble = $('<div>').addClass('dx-chat-message-bubble');

    $(this.element()).append($messageBubble);

    this._renderMessageInput();
    this._renderMessageButton();
  }

  _renderMessageInput(): void {
    const $input = $('<textarea>').addClass('dx-chat-message-input');

    $('.dx-chat-message-bubble').append($input);
  }

  _renderMessageButton(): void {
    const $button = $('<button>').addClass('dx-chat-message-button').text('send');

    $('.dx-chat-message-bubble').append($button);

    eventsEngine.on(
      $button,
      'click',
      null,
      this._pressButtonHandler.bind(this),
    );
  }

  _pressButtonHandler(): void {
    const value = this._getInputValue();

    if (!value) return;

    this._cleanInputValue();
    this.sendMessage(value);
  }

  _getInputValue(): string {
    const { value } = (document.querySelector('.dx-chat-message-input') as HTMLInputElement);

    return value;
  }

  _cleanInputValue(): void {
    (document.querySelector('.dx-chat-message-input') as HTMLInputElement).value = '';
  }

  _render(): void {
    super._render();

    this._attachOnMessageSendEvent();
  }

  _clean(): void {
    super._clean();
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name } = args;

    switch (name) {
      default:
        super._optionChanged(args);
    }
  }

  _attachOnMessageSendEvent(): void {
    const { onMessageSend } = this.option();
    const eventName = 'onMessageSend';

    eventsEngine.off(this.element(), eventName);
    eventsEngine.on(this.element(), eventName, null, onMessageSend);
  }

  renderMessage(value: string, userId: string | null): void {
    const { userId: currentUserId } = this.option();
    const msgClass = userId === currentUserId ? 'dx-chat-message--sent' : 'dx-chat-message--recieved';

    const $message = $('<span>')
      .text(value)
      .addClass('dx-chat-message')
      .addClass(msgClass);

    $('.dx-chat-message-list').append($message);
  }

  sendMessage(value: string): void {
    const { userId } = this.option();
    // @ts-expect-error eventsEngine is badly typed
    eventsEngine.trigger(this.element(), 'onMessageSend', { userId, value });
  }
}

// @ts-expect-error ts-error
registerComponent('dxChat', Chat);

export default Chat;
