import $ from '@js/core/renderer';
import type { User } from '@js/ui/chat';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';

export interface Properties extends WidgetOptions<MessageBubble> {
  text?: string;
  // eslint-disable-next-line
  template?: null | any;
  isLast?: boolean;
  author?: User;
}

class MessageBubble extends Widget<Properties> {
  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      text: '',
      template: null,
      isLast: false,
      author: undefined,
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
      text = '', template = null, isLast, author,
    } = this.option();

    if (template) {
      $(this.element()).empty();

      const messageTemplate = this._getTemplateByOption('template');

      const templateData = {
        component: this,
        text,
        isLast,
        author,
      };

      messageTemplate.render({
        container: this.element(),
        model: templateData,
      });

      return;
    }

    $(this.element()).text(text);
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name } = args;

    switch (name) {
      case 'text':
      case 'isLast':
      case 'template':
      case 'author':
        this._updateContent();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default MessageBubble;
