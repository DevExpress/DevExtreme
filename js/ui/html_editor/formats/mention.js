
import { getQuill } from '../quill_importer';

const quill = getQuill();
const Embed = quill.import('blots/embed');
import $ from '../../../core/renderer';

const MENTION_CLASS = 'dx-mention';

class Mention extends Embed {
    static create(data) {
        const node = super.create();

        node.setAttribute('spellcheck', false);
        node.dataset.marker = data.marker;
        node.dataset.mentionValue = data.value;
        node.dataset.id = data.id;

        this.renderContent(node, data);

        return node;
    }

    static value(node) {
        return {
            marker: node.dataset.marker,
            id: node.dataset.id,
            value: node.dataset.mentionValue
        };
    }

    static renderContent(node, data) {
        const template = this._templates.get(data.marker);

        if(template) {
            template.render({
                model: data,
                container: node
            });
        } else {
            this.baseContentRender(node, data);
        }

    }

    static baseContentRender(node, data) {
        const $marker = $('<span>').text(data.marker);

        $(node)
            .append($marker)
            .append(data.value);
    }

    static addTemplate(marker, template) {
        this._templates.set(marker, template);
    }

    static removeTemplate(marker) {
        this._templates.delete(marker);
    }
}

Mention.blotName = 'mention';
Mention.tagName = 'span';
Mention.className = MENTION_CLASS;
Mention._templates = new Map();

export default Mention;
