import { getQuill } from "../quill_importer";

const quill = getQuill();
const Embed = quill.import("blots/embed");

import $ from "../../../core/renderer";

const PLACEHOLDER_DATA_KEY = "PLACEHOLDER_DATA";
const PLACEHOLDER_CLASS = "dx-data-placeholder";

class Placeholder extends Embed {
    static create(data) {
        let node = super.create(),
            $node = $(node),
            startEscapedChar = data.startEscapedChar || data.escapedChar,
            endEscapedChar = data.endEscapedChar || data.escapedChar,
            text = data.value;

        $node
            .text(startEscapedChar + text + endEscapedChar)
            .data(PLACEHOLDER_DATA_KEY, data);

        return node;
    }

    static value(node) {
        return $(node).data(PLACEHOLDER_DATA_KEY);
    }
}

Placeholder.blotName = "placeholder";
Placeholder.tagName = "span";
Placeholder.className = PLACEHOLDER_CLASS;

module.exports = Placeholder;
