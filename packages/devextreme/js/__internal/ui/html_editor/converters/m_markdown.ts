/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable spellcheck/spell-checker */
import { getWindow } from '@js/core/utils/window';
import Errors from '@js/ui/widget/ui.errors';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
// import ShowDown from 'showdown';
import TurnDown from 'turndown';
import { unified } from 'unified';

import converterController from '../m_converterController';

class MarkdownConverter {
  _markdown2Html: any;

  _html2Markdown: any;

  constructor() {
    const window = getWindow();
    // @ts-expect-error
    const turndown = window && window.TurndownService || TurnDown;

    // const showdown = window && window.showdown || ShowDown;

    if (!turndown) {
      throw Errors.Error('E1041', 'Turndown');
    }

    // if (!showdown) {
    //   throw Errors.Error('E1041', 'Unified');
    // }

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

    // this._markdown2Html = new showdown.Converter({
    //   simpleLineBreaks: true,
    //   strikethrough: true,
    //   tables: true,
    // });

    this._markdown2Html = unified;
  }

  toMarkdown(htmlMarkup) {
    return this._html2Markdown.turndown(htmlMarkup || '');
  }

  toHtml(markdownMarkup) {
    let markup = this._markdown2Html
      .use(remarkParse)
      // eslint-disable-next-line spellcheck/spell-checker
      .use(remarkRehype)
      // eslint-disable-next-line spellcheck/spell-checker
      .use(rehypeStringify)
      .processSync(markdownMarkup);

    if (markup) {
      markup = markup.replace(new RegExp('\\r?\\n', 'g'), '');
    }

    return markup;
  }
}

converterController.addConverter('markdown', MarkdownConverter);

export default MarkdownConverter;
