import { getWindow } from '@js/core/utils/window';
import Errors from '@js/ui/widget/ui.errors';
import TurnDown from 'turndown';

import converterController from '../m_converterController';

class MarkdownConverter {
  _html2Markdown: any;

  constructor() {
    const window = getWindow();
    // @ts-expect-error
    const turndown = window && window.TurndownService || TurnDown;

    if (!turndown) {
      throw Errors.Error('E1041', 'Turndown');
    }

    // eslint-disable-next-line new-cap
    this._html2Markdown = new turndown();

    if (this._html2Markdown?.addRule) {
      this._html2Markdown.addRule('emptyLine', {
        filter: (element) => element.nodeName.toLowerCase() === 'p' && element.innerHTML === '<br>',
        replacement() {
          return '<br>';
        },
      });
      this._html2Markdown.keep(['table']);
    }
  }

  toMarkdown(htmlMarkup) {
    return this._html2Markdown.turndown(htmlMarkup || '');
  }

  toHtml(markdownMarkup) {
    return markdownMarkup;
  }
}

converterController.addConverter('markdown', MarkdownConverter);

export default MarkdownConverter;
