const DefaultQuillDeltaToHtmlConverter = require("quill-delta-to-html");
import Errors from "../../widget/ui.errors";

class DeltaConverter {
    constructor() {
        if(!DeltaConverter._deltaToHtmlConverter) {
            throw Errors.Error("E1051");
        }

        this._delta2Html = new DeltaConverter._deltaToHtmlConverter();
    }

    toHtml(deltaOps) {
        this._delta2Html.rawDeltaOps = deltaOps;
        return this._delta2Html.convert();
    }
}

if(DefaultQuillDeltaToHtmlConverter) {
    DeltaConverter._deltaToHtmlConverter = DefaultQuillDeltaToHtmlConverter.QuillDeltaToHtmlConverter || DefaultQuillDeltaToHtmlConverter;
}

export { DeltaConverter as default };
