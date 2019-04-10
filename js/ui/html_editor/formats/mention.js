
import { getQuill } from "../quill_importer";

const quill = getQuill();
const Embed = quill.import("blots/embed");
import $ from "../../../core/renderer";

const MENTION_CLASS = "dx-mention";

class Mention extends Embed {
    static create(data) {
        const node = super.create();

        node.setAttribute("spellcheck", false);
        node.dataset.marker = data.marker;
        node.dataset.mentionValue = data.value;
        this.renderContent(node, data);

        return node;
    }

    static value(node) {
        return {
            marker: node.dataset.marker,
            value: node.dataset.mentionValue
        };
    }

    static renderContent(node, data) {
        this._renderContentImpl(node, data);
    }

    static baseContentRender(node, data) {
        const $marker = $("<span>").text(data.marker);

        $(node)
            .append($marker)
            .append(data.value);
    }

    static restoreContentRender() {
        this._renderContentImpl = this.baseContentRender;
    }

    static setContentRender(renderer) {
        this._renderContentImpl = renderer;
    }
}

Mention._renderContentImpl = Mention.baseContentRender;
Mention.blotName = "mention";
Mention.tagName = "span";
Mention.className = MENTION_CLASS;

export default Mention;
