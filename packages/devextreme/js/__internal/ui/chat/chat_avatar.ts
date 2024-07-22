/* eslint-disable @typescript-eslint/no-explicit-any */
import $ from '@js/core/renderer';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import Widget from '../widget';

const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_AVATAR_LETTERS_CLASS = 'dx-chat-message-avatar-letters';

export interface AvatarOptions extends WidgetOptions<Avatar> {
  text?: string;
}

class Avatar extends Widget<AvatarOptions> {
  _getDefaultOptions(): AvatarOptions {
    return {
      ...super._getDefaultOptions(),
      ...{
        text: '',
      },
    };
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_MESSAGE_AVATAR_CLASS);

    super._initMarkup();

    const { text } = this.option();

    $('<div>')
      .addClass(CHAT_MESSAGE_AVATAR_LETTERS_CLASS)
      .text((text as any))
      .appendTo(this.element());
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name } = args;

    switch (name) {
      case 'text':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default Avatar;
