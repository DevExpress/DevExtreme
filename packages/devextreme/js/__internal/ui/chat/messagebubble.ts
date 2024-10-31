import $ from '@js/core/renderer';
import type { User } from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

import type Chat from './chat';

const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';

export interface Properties extends WidgetOptions<MessageBubble> {
  text?: string;
  // eslint-disable-next-line
  template?: null | any;
  templateData?: { component?: Chat; isLast?: boolean; author?: User };
}

class MessageBubble extends Widget<Properties> {
  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      text: '',
      template: null,
      templateData: {},
    };
  }

  _initMarkup(): void {
    $(this.element())
      .addClass(CHAT_MESSAGEBUBBLE_CLASS);

    super._initMarkup();

    this._updateContent();
  }

  _updateContent(): void {
    const {
      text = '', template = null, templateData,
    } = this.option();

    if (template) {
      $(this.element()).empty();

      const messageTemplate = this._getTemplateByOption('template');
      const data = {
        text,
        ...templateData,
      };

      messageTemplate.render({
        container: this.element(),
        model: data,
      });

      return;
    }

    $(this.element()).text(text);
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name } = args;

    switch (name) {
      case 'text':
      case 'template':
      case 'templateData':
        this._updateContent();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageBubble;
