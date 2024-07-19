import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/chat';

import Widget from '../widget';
import ChatHeader from './chat_header';
import MessageBox from './chat_message_box';
// import { renderMessageBox } from './chat_message_box';
import { renderMessageListInit, setCurrentUserId, setItems } from './chat_message_list';

const CHAT_CLASS = 'dx-chat';

const MOCK_CURRENT_USER_ID = 'CURRENT_USER_ID';

class Chat extends Widget<Properties> {
  _chatHeader?: ChatHeader;

  _messageBox?: MessageBox;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      ...{
        title: '',
        items: [],
        onMessageSend: undefined,
      },
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

    this._chatHeader = this._createComponent($('<div>'), ChatHeader, { title });

    $(this._chatHeader.element()).appendTo(this.element());
  }

  _renderMessageList(): void {
    const { items } = this.option();

    setItems(items);
    setCurrentUserId(MOCK_CURRENT_USER_ID);
    renderMessageListInit(this.element());
  }

  _renderMessageBox(): void {
    this._messageBox = this._createComponent($('<div>'), MessageBox, {});

    $(this._messageBox.element()).appendTo(this.element());
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;

    switch (name) {
      case 'title':
        this._chatHeader?.option(name, (value as string));
        break;
      case 'items':
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
