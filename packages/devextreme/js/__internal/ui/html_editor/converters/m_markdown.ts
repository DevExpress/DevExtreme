import { getWindow } from '@js/core/utils/window';
import Errors from '@js/ui/widget/ui.errors';
import ShowDown from 'showdown';
import TurnDown from 'turndown';

import converterController from '../m_converterController';

class MarkdownConverter {
  _markdown2Html: any;

  _html2Markdown: any;

  constructor() {
    const window = getWindow();
    // @ts-expect-error
    const turndown = window && window.TurndownService || TurnDown;
    // @ts-expect-error
    const showdown = window && window.showdown || ShowDown;

    if (!turndown) {
      throw Errors.Error('E1041', 'Turndown');
    }

    if (!showdown) {
      throw Errors.Error('E1041', 'Showdown');
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

    this._markdown2Html = new showdown.Converter({
      simpleLineBreaks: true,
      strikethrough: true,
      tables: true,
    });
  }

  toMarkdown(htmlMarkup) {
    return this._html2Markdown.turndown(htmlMarkup || '');
  }

  toHtml(markdownMarkup) {
    let markup = this._markdown2Html.makeHtml(markdownMarkup);

    if (markup) {
      markup = markup.replace(new RegExp('\\r?\\n', 'g'), '');
    }

    return markup;
  }
}

converterController.addConverter('markdown', MarkdownConverter);

export default MarkdownConverter;
