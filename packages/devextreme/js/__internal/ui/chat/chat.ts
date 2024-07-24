import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/chat';

import Widget from '../widget';
import ChatHeader from './chat_header';
import MessageBox from './chat_message_box';
import MessageList from './chat_message_list';

const CHAT_CLASS = 'dx-chat';

const MOCK_CURRENT_USER_ID = 'CURRENT_USER_ID';

class Chat extends Widget<Properties> {
  _chatHeader?: ChatHeader;

  _messageBox?: MessageBox;

  _messageList?: MessageList;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      title: '',
      items: [],
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

    this._chatHeader = this._createComponent($header, ChatHeader, { title: title ?? '' });
  }

  _renderMessageList(): void {
    const { items } = this.option();

    const $messageList = $('<div>').appendTo(this.element());

    this._messageList = this._createComponent($messageList, MessageList, {
      items,
      currentUserId: MOCK_CURRENT_USER_ID,
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
      case 'items':
        this._invalidate();
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
