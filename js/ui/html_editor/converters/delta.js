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

        this._delta2Html.renderCustomWith(this._renderCustomFormat.bind(this));
    }

    _renderCustomFormat(operations, contextOperations) {
        if(operations.insert.type === 'placeholder') {
            return this._parsePlaceholder(operations.insert.value);
        }
    }

    _parsePlaceholder(data) {
        const startEscapedChar = data.startEscapedChar || data.escapedChar;
        const endEscapedChar = data.endEscapedChar || data.escapedChar;
        const dataString = this._addDataParam("start-char", data.startEscapedChar) + this._addDataParam("end-char", data.endEscapedChar) +
        this._addDataParam("esc-char", data.escapedChar) + this._addDataParam("value", data.value);

        return "<span class='dx-data-placeholder'" + dataString + "><span>" + startEscapedChar + data.value + endEscapedChar + "</span></span>";
    }

    _addDataParam(paramName, value) {
        return value ? " data-placeholder-" + paramName + "=" + value : "";
    }

    toHtml(deltaOps) {
        this._delta2Html.rawDeltaOps = deltaOps;
        return this._delta2Html.convert();
    }
}

ConverterController.addConverter("delta", DeltaConverter);

export { DeltaConverter as default };
