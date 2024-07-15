import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import Widget from '../widget';

const CHAT_CLASS = 'dx-chat';

export interface ChatOptions extends WidgetOptions<Chat> {
  items: [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMessageSend: any;
}

class Chat extends Widget<ChatOptions> {
  _getDefaultOptions(): ChatOptions {
    return {
      ...super._getDefaultOptions(),
      ...{
        items: [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onMessageSend: (e: any): any => e,
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
      default:
        super._optionChanged(args);
    }
  }
}

// @ts-expect-error ts-error
registerComponent('dxChat', Chat);

export default Chat;
