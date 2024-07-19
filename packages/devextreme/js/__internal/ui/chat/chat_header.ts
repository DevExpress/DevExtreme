/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import $ from '@js/core/renderer';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import Widget from '../widget';

const CHAT_HEADER_CLASS = 'dx-chat-header';
const CHAT_HEADER_TEXT_CLASS = 'dx-chat-header-text';

export interface ChatHeaderOptions extends WidgetOptions<ChatHeader> {
  title?: string;
}

class ChatHeader extends Widget<ChatHeaderOptions> {
  _getDefaultOptions(): ChatHeaderOptions {
    return {
      ...super._getDefaultOptions(),
      ...{
        title: '',
      },
    };
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_HEADER_CLASS);

    super._initMarkup();

    const { title } = this.option();

    $('<p>')
      .addClass(CHAT_HEADER_TEXT_CLASS)
      // TODO check ts
      .text(title ?? '')
      .appendTo(this.element());
  }

  _updateTitle(value: any): void {
    $(`.${CHAT_HEADER_TEXT_CLASS}`).text(value);
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name, value } = args;

    switch (name) {
      case 'title':
        this._updateTitle(value);
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default ChatHeader;
