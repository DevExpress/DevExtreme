
import { getQuill } from "../quill_importer";

const quill = getQuill();
const Embed = quill.import("blots/embed");
import $ from "../../../core/renderer";

const MENTION_CLASS = "dx-mention";

class Mention extends Embed {
    static create(data) {
        const node = super.create();
        const $marker = $("<span>");
        const $node = $(node);

        $marker.text(data.marker);
        $node
            .attr("spellcheck", false)
            .append($marker)
            .append(data.value);

        node.dataset.marker = data.marker;
        node.dataset.mentionValue = data.value;

        return node;
    }

    static value(node) {
        return {
            marker: node.dataset.marker,
            value: node.dataset.mentionValue
        };
    }
}

Mention.blotName = "mention";
Mention.tagName = "span";
Mention.className = MENTION_CLASS;

export default Mention;
