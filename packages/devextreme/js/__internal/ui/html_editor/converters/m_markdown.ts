/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable spellcheck/spell-checker */
import { getWindow } from '@js/core/utils/window';
import Errors from '@js/ui/widget/ui.errors';
// import rehypeParse from 'rehype-parse';
import rehypeRaw from 'rehype-raw';
// import rehypeRemark from 'rehype-remark';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
// import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
// import remarkStringify from 'remark-stringify';
import ShowDown from 'showdown';
import TurnDown from 'turndown';
import { unified } from 'unified';

import converterController from '../m_converterController';

const withUnified = true;

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
      throw Errors.Error('E1041', 'Unified');
    }

    // eslint-disable-next-line new-cap
    this._html2Markdown = new turndown();
    // this._html2Markdown = unified;

    if (this._html2Markdown?.addRule) {
      this._html2Markdown.addRule('emptyLine', {
        filter: (element) => element.nodeName.toLowerCase() === 'p' && element.innerHTML === '<br>',
        replacement() {
          return '<br>';
        },
      });
      this._html2Markdown.keep(['table']);
    }

    if (withUnified) {
      this._markdown2Html = unified;
    } else {
      this._markdown2Html = new showdown.Converter({
        simpleLineBreaks: true,
        strikethrough: true,
        tables: true,
      });
    }
  }

  toMarkdown(htmlMarkup) {
    const value = this._html2Markdown.turndown(htmlMarkup || '');

    return value;
  }

  // toMarkdown(htmlMarkup) {
  //   const markup = this._html2Markdown()
  //     .use(rehypeParse, { fragment: true })
  //     .use(rehypeRemark)
  //     .use(remarkGfm)
  //     .use(remarkStringify)
  //     .processSync(htmlMarkup);

  //   debugger;

  //   return markup.value;
  // }

  toHtml(markdownMarkup) {
    if (withUnified) {
      return this.withUnified(markdownMarkup);
    }

    return this.withShowdown(markdownMarkup);
  }

  withUnified(markdownMarkup) {
    const obj = this._markdown2Html()
      .use(remarkParse)
      .use(remarkGfm)
      // .use(remarkRehype, { allowDangerousHtml: true })
      .use(remarkRehype)
      // .use(rehypeRaw)
      // .use(rehypeSanitize)
      .use(rehypeStringify)
      .processSync(markdownMarkup);

    debugger;

    let markup = String(obj);

    if (markup) {
      markup = markup.replace(new RegExp('\\r?\\n', 'g'), '');
    }

    return markup;
  }

  withShowdown(markdownMarkup) {
    let markup = this._markdown2Html.makeHtml(markdownMarkup);

    if (markup) {
      markup = markup.replace(new RegExp('\\r?\\n', 'g'), '');
    }

    return markup;
  }
}

converterController.addConverter('markdown', MarkdownConverter);

export default MarkdownConverter;
