
import Quill from 'devextreme-quill';
import $ from '../../../core/renderer';
import TemplatesStorage from '../utils/templates_storage';

let Mention = {};

if(Quill) {
    const Embed = Quill.import('blots/embed');
    const MENTION_CLASS = 'dx-mention';

    Mention = class Mention extends Embed {
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
            const template = this._templatesStorage.get({ editorKey: data.keyInTemplateStorage, marker: data.marker });

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

        static addTemplate(data, template) {
            this._templatesStorage.set(data, template);
        }

        static removeTemplate(data) {
            this._templatesStorage.delete(data);
        }
    };

    Mention.blotName = 'mention';
    Mention.tagName = 'span';
    Mention.className = MENTION_CLASS;
    Mention._templatesStorage = new TemplatesStorage();
}


export default Mention;
