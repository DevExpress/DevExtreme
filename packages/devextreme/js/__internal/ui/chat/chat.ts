import registerComponent from '@js/core/component_registrator';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import type {
  Message, MessageSendEvent, Properties, User,
} from '@js/ui/chat';

import Widget from '../widget';
import ChatHeader from './chat_header';
import type {
  MessageBoxProperties,
  MessageSendEvent as MessageBoxMessageSendEvent,
} from './chat_message_box';
import MessageBox from './chat_message_box';
import MessageList from './chat_message_list';

const CHAT_CLASS = 'dx-chat';

class Chat extends Widget<Properties> {
  _chatHeader?: ChatHeader;

  _messageBox?: MessageBox;

  _messageList?: MessageList;

  _messageSendAction?: (e: Partial<MessageSendEvent>) => void;

  _sender?: User;

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

    this._createMessageSendAction();
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
      onMessageSend: (e) => {
        this._messageSendHandler(e);
      },
    };

    this._messageBox = this._createComponent($messageBox, MessageBox, configuration);
  }

  _createMessageSendAction(): void {
    this._messageSendAction = this._createActionByOption(
      'onMessageSend',
      { excludeValidators: ['disabled', 'readOnly'] },
    );
  }

  _messageSendHandler(e: MessageBoxMessageSendEvent): void {
    const { text, event } = e;
    const { user } = this.option();

    const message: Message = {
      timestamp: String(Date.now()),
      author: user,
      text,
    };

    // @ts-expect-error
    this.renderMessage(message, user);
    this._messageSendAction?.({ message, event });
  }

  _compareItems(value: Message[], previousValue: Message[]): boolean {
    const valueLength = value.length;
    const previousValueLength = previousValue.length;

    const lastValueItem = value[value.length - 1];
    const lastPreviousValueItem = value[value.length - 1];

    if (
      lastValueItem !== lastPreviousValueItem
      && previousValueLength - valueLength === 1
    ) {
      return true;
    }

    return false;
  }

  _processItemsUpdating(value: Message[], previousValue: Message[]): void {
    const shouldBeInvalidated = !this._compareItems(value, previousValue);

    if (shouldBeInvalidated) {
      this._messageList?.option('items', value);
    } else {
      // @ts-expect-error
      this._messageList?._renderMessage(value[value.length - 1], value, this._sender);
    }
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value, previousValue } = args;

    switch (name) {
      case 'title':
        // @ts-expect-error
        this._chatHeader?.option('title', value);
        break;
      case 'user':
        // @ts-expect-error
        this._messageList?.option('currentUserId', value.id);
        break;
      case 'items':
        // @ts-expect-error
        this._processItemsUpdating(value, previousValue);
        break;
      case 'onMessageSend':
        this._createMessageSendAction();
        break;
      default:
        super._optionChanged(args);
    }
  }

  renderMessage(message: Message, sender: User): void {
    this._sender = sender;

    const { items } = this.option();

    const newItems = items ? [...items, message] : [message];

    this.option('items', newItems);

    this._sender = undefined;
  }
}

// @ts-expect-error ts-error
registerComponent('dxChat', Chat);

export default Chat;
