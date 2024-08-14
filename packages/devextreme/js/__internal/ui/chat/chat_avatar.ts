import $ from '@js/core/renderer';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import Widget from '../widget';

const CHAT_MESSAGE_AVATAR_CLASS = 'dx-chat-message-avatar';
const CHAT_MESSAGE_AVATAR_INITIALS_CLASS = 'dx-chat-message-avatar-initials';

export interface AvatarOptions extends WidgetOptions<Avatar> {
  name?: string;
}

class Avatar extends Widget<AvatarOptions> {
  _getDefaultOptions(): AvatarOptions {
    return {
      ...super._getDefaultOptions(),
      name: '',
    };
  }

  _getAvatarInitials(name: string): string {
    const initials = name.charAt(0).toUpperCase();

    return initials;
  }

  _initMarkup(): void {
    $(this.element()).addClass(CHAT_MESSAGE_AVATAR_CLASS);

    super._initMarkup();

    const $initials = $('<div>').addClass(CHAT_MESSAGE_AVATAR_INITIALS_CLASS);

    const { name } = this.option();

    if (name) {
      const text = this._getAvatarInitials(name);

      $initials.text(text);
    }

    $initials.appendTo(this.element());
  }

  _optionChanged(args: Record<string, unknown>): void {
    const { name } = args;

    switch (name) {
      case 'name':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default Avatar;
