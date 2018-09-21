
import Errors from "../../widget/ui.errors";
import converterController from "../converterController";
import { isEmptyObject, isObject } from "../../../core/utils/type";

let TurnDown;
let ShowDown;

try {
    TurnDown = require("turndown");
} catch(e) {}
try {
    ShowDown = require("showdown");
} catch(e) {}

class MarkdownConverter {
    constructor() {
        if(!TurnDown || (isObject(TurnDown) && isEmptyObject(TurnDown))) {
            throw Errors.Error("E1052");
        }

        if(!ShowDown || (isObject(ShowDown) && isEmptyObject(ShowDown))) {
            throw Errors.Error("E1053");
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
