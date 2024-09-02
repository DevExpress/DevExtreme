import registerComponent from '@js/core/component_registrator';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Message, MessageSendEvent, Properties } from '@js/ui/chat';

import Widget from '../widget';
import ChatHeader from './chat_header';
import type {
  MessageBoxProperties,
  MessageSendEvent as MessageBoxMessageSendEvent,
} from './chat_message_box';
import MessageBox from './chat_message_box';
import MessageList from './chat_message_list';

const CHAT_CLASS = 'dx-chat';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

type Title = string;

class Chat extends Widget<Properties & { title: Title }> {
  _chatHeader?: ChatHeader;

  _messageBox!: MessageBox;

  _messageList!: MessageList;

  _messageSendAction?: (e: Partial<MessageSendEvent>) => void;

  _getDefaultOptions(): Properties & { title: Title } {
    return {
      ...super._getDefaultOptions(),
      activeStateEnabled: true,
      focusStateEnabled: true,
      hoverStateEnabled: true,
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

    const { title } = this.option();

    if (title) {
      this._renderHeader(title);
    }

    this._renderMessageList();
    this._renderMessageBox();
  }

  _renderHeader(title: string): void {
    const $header = $('<div>');

    this.element().prepend($header.get(0));

    this._chatHeader = this._createComponent($header, ChatHeader, {
      title,
    });
  }

  _renderMessageList(): void {
    const { items = [], user } = this.option();

    const currentUserId = user?.id;
    const $messageList = $('<div>').appendTo(this.element());

    this._messageList = this._createComponent($messageList, MessageList, {
      items,
      currentUserId,
    });
  }

  _renderMessageBox(): void {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const $messageBox = $('<div>').appendTo(this.element());

    const configuration: MessageBoxProperties = {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
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

    this.renderMessage(message);
    this._messageSendAction?.({ message, event });
  }

  _focusTarget(): dxElementWrapper {
    const $input = $(this.element()).find(`.${TEXTEDITOR_INPUT_CLASS}`);

    return $input;
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;

    switch (name) {
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        this._messageBox.option({ [name]: value });
        break;
      case 'title': {
        if (value) {
          if (this._chatHeader) {
            this._chatHeader.option('title', (value as Title));
          } else {
            this._renderHeader((value as Title));
          }
        } else if (this._chatHeader) {
          this._chatHeader.dispose();
          this._chatHeader.$element().remove();
        }
        break;
      }
      case 'user':
        this._messageList.option('currentUserId', (value as Properties['user'])?.id);
        break;
      case 'items':
        this._messageList.option('items', (value as Properties['items']) ?? []);
        break;
      case 'onMessageSend':
        this._createMessageSendAction();
        break;
      default:
        super._optionChanged(args);
    }
  }

  renderMessage(message: Message = {}): void {
    const { items } = this.option();

    const newItems = [...items ?? [], message];

    this.option('items', newItems);
  }
}

// @ts-expect-error ts-error
registerComponent('dxChat', Chat);

export default Chat;
