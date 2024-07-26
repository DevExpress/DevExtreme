import registerComponent from '@js/core/component_registrator';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/chat';

import Widget from '../widget';
import ChatHeader from './chat_header';
import MessageBox from './chat_message_box';
import MessageList from './chat_message_list';

const CHAT_CLASS = 'dx-chat';

class Chat extends Widget<Properties> {
  _chatHeader?: ChatHeader;

  _messageBox?: MessageBox;

  _messageList?: MessageList;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      title: '',
      items: [],
      user: undefined,
      onMessageSend: undefined,
    };
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_CLASS);

    super._initMarkup();

    this._renderHeader();
    this._renderMessageList();
    this._renderMessageBox();
  }

  _renderHeader(): void {
    const { title } = this.option();

    const $header = $('<div>').appendTo(this.element());

    // @ts-expect-error
    this._chatHeader = this._createComponent($header, ChatHeader, { title });
  }

  _renderMessageList(): void {
    const { items, user } = this.option();

    const currentUserId = user?.id;
    const $messageList = $('<div>').appendTo(this.element());

    this._messageList = this._createComponent($messageList, MessageList, {
      items,
      currentUserId,
    });
  }

  _renderMessageBox(): void {
    const $messageBox = $('<div>').appendTo(this.element());

    this._messageBox = this._createComponent($messageBox, MessageBox, {});
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;

    switch (name) {
      case 'title':
        // @ts-expect-error
        this._chatHeader?.option(name, value);
        break;
      case 'user':
      case 'items':
        // @ts-expect-error
        this._messageList?.option(name, value);
        break;
      case 'onMessageSend':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

// @ts-expect-error ts-error
registerComponent('dxChat', Chat);

export default Chat;
