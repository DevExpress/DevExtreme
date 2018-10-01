import * as QuillDeltaConverter from "quill-delta-to-html";

import Errors from "../../widget/ui.errors";
import ConverterController from "../converterController";


class DeltaConverter {
    constructor() {
        const converter = QuillDeltaConverter && (QuillDeltaConverter.QuillDeltaToHtmlConverter || QuillDeltaConverter.default);

        if(!converter) {
            throw Errors.Error("E1041", "QuillDeltaToHtmlConverter");
        }

        this._delta2Html = new converter();

        this._delta2Html.renderCustomWith(this._renderCustomFormat);
    }

    _renderCustomFormat(operations, contextOperations) {
        if(operations.insert.type === 'placeholder') {
            const addDataParam = (paramName, value) => {
                return value ? " data-placeholder-" + paramName + "=" + value : "";
            };

            const data = operations.insert.value;
            const startEscapedChar = data.startEscapedChar || data.escapedChar;
            const endEscapedChar = data.endEscapedChar || data.escapedChar;
            const dataString = addDataParam("start-char", data.startEscapedChar) + addDataParam("end-char", data.endEscapedChar) +
                addDataParam("esc-char", data.escapedChar) + addDataParam("value", data.value);

            return "<span class='dx-data-placeholder'" + dataString + "><span>" + startEscapedChar + data.value + endEscapedChar + "</span></span>";
        }
    }

    toHtml(deltaOps) {
        this._delta2Html.rawDeltaOps = deltaOps;
        return this._delta2Html.convert();
    }
}

ConverterController.addConverter("delta", DeltaConverter);

export { DeltaConverter as default };
