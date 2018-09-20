import TurnDown from "turndown";
import ShowDown from "showdown";
import Errors from "../../widget/ui.errors";
import converterController from "../converterController";

class MarkdownConverter {
    constructor() {
        if(!MarkdownConverter._TurnDown) {
            throw Errors.Error("E1052");
        }

        if(!MarkdownConverter._ShowDown) {
            throw Errors.Error("E1053");
        }

        this._html2Markdown = new MarkdownConverter._TurnDown();
        this._markdown2Html = new MarkdownConverter._ShowDown.Converter({
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

MarkdownConverter._TurnDown = TurnDown;
MarkdownConverter._ShowDown = ShowDown;

converterController.addConverter("markdown", MarkdownConverter);

export { MarkdownConverter as default };
