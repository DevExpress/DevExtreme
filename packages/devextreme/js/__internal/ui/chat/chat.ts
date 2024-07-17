import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/chat';

import Widget from '../widget';
import { renderHeader } from './chat_header';
import { renderMessageBox } from './chat_message_box';
import { renderMessageList, setItems } from './chat_message_list';

const CHAT_CLASS = 'dx-chat';

const MOCK_CHAT_HEADER_TEXT = new Date();

class Chat extends Widget<Properties> {
  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      ...{
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
    renderHeader(this.element(), MOCK_CHAT_HEADER_TEXT);
  }

  _renderMessageList(): void {
    const { items } = this.option();

    setItems(items);
    renderMessageList(this.element());
  }

  _renderMessageBox(): void {
    renderMessageBox(this.element());
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name } = args;

    switch (name) {
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
