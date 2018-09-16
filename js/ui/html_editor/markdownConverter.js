import TurnDown from "turndown";
import ShowDown from "showdown";
import Errors from "../widget/ui.errors";

class MarkdownConverter {
    constructor() {
        if(!MarkdownConverter._TurnDown) {
            throw Errors.Error("E1050");
        }

        if(!MarkdownConverter._ShowDown) {
            throw Errors.Error("E1051");
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

        return markup.replace(new RegExp("\\r?\\n", "g"), "");
    }
}

MarkdownConverter._TurnDown = TurnDown;
MarkdownConverter._ShowDown = ShowDown;

export { MarkdownConverter as default };
