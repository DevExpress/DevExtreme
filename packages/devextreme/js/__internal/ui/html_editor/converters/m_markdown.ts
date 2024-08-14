/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable spellcheck/spell-checker */
import { getWindow } from '@js/core/utils/window';
import Errors from '@js/ui/widget/ui.errors';
// import rehypeParse from 'rehype-parse';
// import rehypeRaw from 'rehype-raw';
// import rehypeRemark from 'rehype-remark';
// import rehypeStringify from 'rehype-stringify';
// import remarkGfm from 'remark-gfm';
// import remarkParse from 'remark-parse';
// import remarkRehype from 'remark-rehype';
// import remarkStringify from 'remark-stringify';
// import { unified } from 'unified';
import ShowDown from 'showdown';
import TurnDown from 'turndown';

import converterController from '../m_converterController';

const withUnified = true;

class MarkdownConverter {
  _markdown2Html: any;

  _html2Markdown: any;

  _unified: any;

  _remarkParse: any;

  _remarkGfm: any;

  _remarkRehype: any;

  _rehypeStringify: any;

  constructor() {
    const window = getWindow();
    // @ts-expect-error
    const turndown = window && window.TurndownService || TurnDown;

    // @ts-expect-error
    const showdown = window && window.showdown || ShowDown;

    // @ts-expect-error
    this._unified = window && window.unified;

    // @ts-expect-error
    this._remarkParse = window && window.remarkParse;

    // @ts-expect-error
    this._remarkGfm = window && window.remarkGfm;

    // @ts-expect-error
    this._remarkRehype = window && window.remarkRehype;

    // @ts-expect-error
    this._rehypeStringify = window && window.rehypeStringify;

    if (!turndown) {
      throw Errors.Error('E1041', 'Turndown');
    }

    if (!showdown) {
      throw Errors.Error('E1041', 'Showdown');
    }

    if (withUnified && !this._unified) {
      throw Errors.Error('E1041', 'Unified');
    }

    if (withUnified && !this._remarkParse) {
      throw Errors.Error('E1041', 'RemarkParse');
    }

    if (withUnified && !this._remarkGfm) {
      throw Errors.Error('E1041', 'RemarkGfm');
    }

    if (withUnified && !this._remarkRehype) {
      throw Errors.Error('E1041', 'RemarkRehype');
    }

    if (withUnified && !this._rehypeStringify) {
      throw Errors.Error('E1041', 'RehypeStringify');
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
      this._markdown2Html = this._unified;
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
      return this._processWithUnified(markdownMarkup);
    }

    return this._processWithShowdown(markdownMarkup);
  }

  toHtmlWithCustomConverter(markdownMarkup) {
    const markup = markdownMarkup?.replace?.(new RegExp('\\r?\\n', 'g'), '');

    return markup;
  }

  _processWithUnified(markdownMarkup) {
    const result = this._markdown2Html()
      .use(this._remarkParse)
      .use(this._remarkGfm)
      // .use(remarkRehype, { allowDangerousHtml: true })
      .use(this._remarkRehype)
      // .use(rehypeRaw)
      .use(this._rehypeStringify)
      .processSync(markdownMarkup);

    const stringResult = String(result);

    const markup = stringResult ? stringResult.replace(new RegExp('\\r?\\n', 'g'), '') : '';

    return markup;
  }

  _processWithShowdown(markdownMarkup) {
    let markup = this._markdown2Html.makeHtml(markdownMarkup);

    if (markup) {
      markup = markup.replace(new RegExp('\\r?\\n', 'g'), '');
    }

    return markup;
  }
}

converterController.addConverter('markdown', MarkdownConverter);

export default MarkdownConverter;
