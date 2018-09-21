import * as QuillDeltaConverter from "quill-delta-to-html";

import Errors from "../../widget/ui.errors";
import ConverterController from "../converterController";


class DeltaConverter {
    constructor() {
        const converter = QuillDeltaConverter && (QuillDeltaConverter.QuillDeltaToHtmlConverter || QuillDeltaConverter.default);

        if(!converter) {
            throw Errors.Error("E1051");
        }

        this._delta2Html = new converter();
    }

    toHtml(deltaOps) {
        this._delta2Html.rawDeltaOps = deltaOps;
        return this._delta2Html.convert();
    }
}

ConverterController.addConverter("delta", DeltaConverter);

export { DeltaConverter as default };
