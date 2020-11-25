
import TurnDown from 'turndown';
import ShowDown from 'showdown';

import { getWindow } from '../../../core/utils/window';
import Errors from '../../widget/ui.errors';
import converterController from '../converterController';

class MarkdownConverter {
    constructor() {
        const window = getWindow();
        const turndown = window && window.TurndownService || TurnDown;
        const showdown = window && window.showdown || ShowDown;

        if(!turndown) {
            throw Errors.Error('E1041', 'Turndown');
        }

        if(!showdown) {
            throw Errors.Error('E1041', 'Showdown');
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
        }

        this._markdown2Html = new showdown.Converter({
            simpleLineBreaks: true,
            strikethrough: true
        });
    }

    toMarkdown(htmlMarkup) {
        return this._html2Markdown.turndown(htmlMarkup || '');
    }

    toHtml(markdownMarkup) {
        let markup = this._markdown2Html.makeHtml(markdownMarkup);

        if(markup) {
            markup = markup.replace(new RegExp('\\r?\\n', 'g'), '');
        }

        return markup;
    }
}

converterController.addConverter('markdown', MarkdownConverter);

export default MarkdownConverter;
