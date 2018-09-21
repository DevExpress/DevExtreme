let QuillDeltaToHtmlConverter = require("quill-delta-to-html");

import Errors from "../../widget/ui.errors";
import ConverterController from "../converterController";


class DeltaConverter {
    constructor() {
        if(!QuillDeltaToHtmlConverter) {
            throw Errors.Error("E1051");
        }

        this._delta2Html = new QuillDeltaToHtmlConverter();
    }

    toHtml(deltaOps) {
        this._delta2Html.rawDeltaOps = deltaOps;
        return this._delta2Html.convert();
    }
}

if(QuillDeltaToHtmlConverter) {
    QuillDeltaToHtmlConverter = QuillDeltaToHtmlConverter.QuillDeltaToHtmlConverter || QuillDeltaToHtmlConverter;
}

ConverterController.addConverter("delta", DeltaConverter);

export { DeltaConverter as default };
