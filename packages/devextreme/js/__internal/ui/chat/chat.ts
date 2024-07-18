import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import type { Properties } from '@js/ui/chat';

import Widget from '../widget';

const CHAT_CLASS = 'dx-chat';

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
