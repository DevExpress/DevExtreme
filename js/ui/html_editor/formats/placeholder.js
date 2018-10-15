import { getQuill } from "../quill_importer";
import { ensureDefined } from "../../../core/utils/common";
import { extend } from "../../../core/utils/extend";

const quill = getQuill();
const Embed = quill.import("blots/embed");

const PLACEHOLDER_CLASS = "dx-data-placeholder";

class Placeholder extends Embed {
    static create(data) {
        let node = super.create(),
            startEscapeChar,
            endEscapeChar,
            text = data.value;

        if(Array.isArray(data.escapeChar)) {
            startEscapeChar = ensureDefined(data.escapeChar[0], "");
            endEscapeChar = ensureDefined(data.escapeChar[1], "");
        } else {
            startEscapeChar = endEscapeChar = data.escapeChar;
        }

        node.innerText = startEscapeChar + text + endEscapeChar;
        node.dataset.placeholderStartEscChar = startEscapeChar;
        node.dataset.placeholderEndEscChar = endEscapeChar;
        node.dataset.placeholderValue = data.value;

        return node;
    }

    static value(node) {
        return extend({}, {
            value: node.dataset.placeholderValue,
            escapeChar: [
                node.dataset.placeholderStartEscChar || "",
                node.dataset.placeholderEndEscChar || ""
            ]
        });
    }
}

Placeholder.blotName = "placeholder";
Placeholder.tagName = "span";
Placeholder.className = PLACEHOLDER_CLASS;

module.exports = Placeholder;
