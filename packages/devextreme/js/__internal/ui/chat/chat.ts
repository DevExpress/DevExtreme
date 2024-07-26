import registerComponent from '@js/core/component_registrator';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import type { Message, Properties, User } from '@js/ui/chat';

import Widget from '../widget';
import ChatHeader from './chat_header';
import type { MessageBoxProperties } from './chat_message_box';
import MessageBox from './chat_message_box';
import MessageList from './chat_message_list';

const CHAT_CLASS = 'dx-chat';

class Chat extends Widget<Properties> {
  _chatHeader?: ChatHeader;

  _messageBox?: MessageBox;

  _messageList?: MessageList;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _messageSendAction?: any;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      title: '',
      items: [],
      user: { id: new Guid().toString() },
      onMessageSend: undefined,
    };
  }

  _init(): void {
    super._init();

    this._initMessageSendAction();
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

    const configuration: MessageBoxProperties = {
      onSendButtonClick: (text) => {
        this._sendButtonClickHandler(text);
      },
    };

    this._messageBox = this._createComponent($messageBox, MessageBox, configuration);
  }

  _initMessageSendAction(): void {
    this._messageSendAction = this._createActionByOption('onMessageSend');
  }

  // eslint-disable-next-line max-len
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  _sendButtonClickHandler(action: any): void {
    const { text, event } = action;
    // @ts-expect-error
    const { user } = this.option();

    const message: Message = {
      timestamp: String(Date.now()),
      author: user,
      text,
    };

    this.renderMessage(message, user);
    this._messageSendAction({ message, event });
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;

    switch (name) {
      case 'title':
        // @ts-expect-error
        this._chatHeader?.option(name, value);
        break;
      case 'user':
        // @ts-expect-error
        this._messageList?.option('currentUserId', value.id);
        break;
      case 'items':
        // @ts-expect-error
        this._messageList?.option(name, value);
        break;
      case 'onMessageSend':
        this._initMessageSendAction();
        break;
      default:
        super._optionChanged(args);
    }
  }

  renderMessage(message: Message, sender: User): void {
    const { items } = this.option();

    const newItems = items ? [...items, message] : [message];

    this._setOptionWithoutOptionChange('items', newItems);

    this._messageList?._renderMessage(message, newItems, sender);
  }
}

// @ts-expect-error ts-error
registerComponent('dxChat', Chat);

export default Chat;
