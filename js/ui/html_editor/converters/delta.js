import * as QuillDeltaConverter from "quill-delta-to-html";

import Errors from "../../widget/ui.errors";
import ConverterController from "../converterController";
import { ensureDefined } from "../../../core/utils/common";


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
        let startEscapeChar, endEscapeChar;

        if(Array.isArray(data.escapeChar)) {
            startEscapeChar = ensureDefined(data.escapeChar[0], "");
            endEscapeChar = ensureDefined(data.escapeChar[1], "");
        } else {
            startEscapeChar = endEscapeChar = data.escapeChar;
        }

        const dataString = [
            this._addDataParam("start-esc-char", startEscapeChar),
            this._addDataParam("end-esc-char", endEscapeChar),
            this._addDataParam("value", data.value)
        ].join("");

        return `<span class='dx-data-placeholder'${dataString}><span>${startEscapeChar + data.value + endEscapeChar}</span></span>`;
    }

    _addDataParam(paramName, value) {
        return value ? ` data-placeholder-${paramName}=${value}` : "";
    }

    toHtml(deltaOps) {
        this._delta2Html.rawDeltaOps = deltaOps;
        return this._delta2Html.convert();
    }
}

ConverterController.addConverter("delta", DeltaConverter);

export { DeltaConverter as default };
