import { getQuill } from "../quill_importer";
import { ensureDefined } from "../../../core/utils/common";

const quill = getQuill();
const Embed = quill.import("blots/embed");

const PLACEHOLDER_CLASS = "dx-data-placeholder";

class Placeholder extends Embed {
    static create(data) {
        let node = super.create(),
            startEscapedChar = ensureDefined(data.startEscapedChar, data.escapedChar),
            endEscapedChar = ensureDefined(data.endEscapedChar, data.escapedChar),
            text = data.value;

        node.innerText = startEscapedChar + text + endEscapedChar;
        if(data.startEscapedChar) {
            node.dataset.placeholderStartChar = data.startEscapedChar;
        }
        if(data.endEscapedChar) {
            node.dataset.placeholderEndChar = data.endEscapedChar;
        }
        node.dataset.placeholderEscChar = data.escapedChar;
        node.dataset.placeholderValue = data.value;

        return node;
    }

    static value(node) {
        return {
            value: node.dataset.placeholderValue,
            escapedChar: node.dataset.placeholderEscChar,
            startEscapedChar: node.dataset.placeholderStartChar,
            endEscapedChar: node.dataset.placeholderEndChar
        };
    }
}

Placeholder.blotName = "placeholder";
Placeholder.tagName = "span";
Placeholder.className = PLACEHOLDER_CLASS;

module.exports = Placeholder;
