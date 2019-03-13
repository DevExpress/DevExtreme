
import { getQuill } from "../quill_importer";

const quill = getQuill();
const Embed = quill.import("blots/embed");
import $ from "../../../core/renderer";

const MENTION_DATA_KEY = "MENTION_DATA";

const MENTION_CLASS = "dx-mention";

class Mention extends Embed {
    static create(data) {
        let node = super.create(),
            $mentionChar = $("<span>"),
            $node = $(node);

        $mentionChar.text(data.mentionChar);
        $node
            .attr("spellcheck", false)
            .append($mentionChar)
            .append(data.value)
            .data(MENTION_DATA_KEY, data);

        return node;
    }

    static value(node) {
        return $(node).data(MENTION_DATA_KEY);
    }
}

Mention.blotName = "mention";
Mention.tagName = "span";
Mention.className = MENTION_CLASS;

export default Mention;
