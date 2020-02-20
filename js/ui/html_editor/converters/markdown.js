
import TurnDown from 'turndown';
import ShowDown from 'showdown';

import { getLibrary, addLibrary } from '../../../core/registry';
import converterController from '../converterController';

TurnDown && addLibrary('turndown', TurnDown);
ShowDown && addLibrary('showdown', ShowDown);

class MarkdownConverter {
    constructor() {
        const turndown = getLibrary('turndown');
        const showdown = getLibrary('showdown');

        this._html2Markdown = new turndown();
        this._markdown2Html = new showdown.Converter({
            simpleLineBreaks: true,
            strikethrough: true
        });
    }

    toMarkdown(htmlMarkup) {
        return this._html2Markdown.turndown(htmlMarkup);
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
