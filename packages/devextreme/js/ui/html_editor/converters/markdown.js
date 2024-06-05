
import TurnDown from 'turndown';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

import { getWindow } from '../../../core/utils/window';
import Errors from '../../widget/ui.errors';
import converterController from '../converterController';

class MarkdownConverter {
    constructor() {
        const window = getWindow();
        const turndown = window && window.TurndownService || TurnDown;

        if(!turndown) {
            throw Errors.Error('E1041', 'Turndown');
        }

        if(!unified) {
            throw Errors.Error('E1041', 'unified');
        }

        if(!remarkParse) {
            throw Errors.Error('E1041', 'remarkParse');
        }

        if(!remarkHtml) {
            throw Errors.Error('E1041', 'remarkHtml');
        }

        this._html2Markdown = new turndown();

        if(this._html2Markdown?.addRule) {
            this._html2Markdown.addRule('emptyLine', {
                filter: (element) => {
                    return element.nodeName.toLowerCase() === 'p' && element.innerHTML === '<br>';
                },
                replacement: function() {
                    return '<br>';
                }
            });
            this._html2Markdown.keep(['table']);
        }

        this._markdown2Html = unified;
    }

    toMarkdown(htmlMarkup) {
        return this._html2Markdown.turndown(htmlMarkup || '');
    }

    toHtml(markdownMarkup) {
        let markup = String(this._markdown2Html()
            .use(remarkParse)
            .use(remarkHtml, { sanitize: false })
            .processSync(markdownMarkup));

        if(markup) {
            markup = markup.replace(new RegExp('\\r?\\n', 'g'), '');
        }

        return markup;
    }
}

converterController.addConverter('markdown', MarkdownConverter);

export default MarkdownConverter;
