import DefaultQuillDeltaToHtmlConverter, { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import Errors from "../widget/ui.errors";

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

DeltaConverter._deltaToHtmlConverter = QuillDeltaToHtmlConverter || DefaultQuillDeltaToHtmlConverter;

export { DeltaConverter as default };
