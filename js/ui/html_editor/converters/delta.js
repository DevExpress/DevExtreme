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
        switch(operations.insert.type) {
            case "variable":
                return this._parseVariable(operations.insert.value);
                break;
            case "extendedImage":
                return this._parseImage(operations.insert.value);
                break;
        }
    }

    _parseVariable(data) {
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

        return `<span class='dx-variable'${dataString}><span>${startEscapeChar + data.value + endEscapeChar}</span></span>`;
    }

    _parseImage(data) {
        const attributes = [
            this._prepareAttribute("src", data.src),
            data.width ? `width='${data.width}px'` : "",
            data.height ? `height='${data.height}px'` : "",
            this._prepareAttribute("alt", data.alt)
        ].join(" ");

        return `<img ${attributes}>`;
    }

    _prepareAttribute(attr, value) {
        return value ? `${attr}='${value}'` : "";
    }

    _addDataParam(paramName, value) {
        return value ? ` data-var-${paramName}=${value}` : "";
    }

    toHtml(deltaOps) {
        this._delta2Html.rawDeltaOps = deltaOps;
        return this._delta2Html.convert();
    }
}

ConverterController.addConverter("delta", DeltaConverter);

export { DeltaConverter as default };
