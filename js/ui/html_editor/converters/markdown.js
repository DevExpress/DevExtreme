
import TurnDown from "turndown";
import ShowDown from "showdown";

import Errors from "../../widget/ui.errors";
import converterController from "../converterController";

class MarkdownConverter {
    constructor() {
        if(!TurnDown) {
            throw Errors.Error("E1041", "Turndown");
        }

        if(!ShowDown) {
            throw Errors.Error("E1041", "Showdown");
        }

        this._html2Markdown = new TurnDown();
        this._markdown2Html = new ShowDown.Converter({
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
            markup = markup.replace(new RegExp("\\r?\\n", "g"), "");
        }

        return markup;
    }
}

converterController.addConverter("markdown", MarkdownConverter);

export { MarkdownConverter as default };
