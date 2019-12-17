import { getQuill } from '../quill_importer';
import { isObject } from '../../../core/utils/type';

const quill = getQuill();
const Link = quill.import('formats/link');

class ExtLink extends Link {
    static create(data) {
        const HREF = data && data.href || data;
        let node = super.create(HREF);

        if(isObject(data)) {
            if(data.text) {
                node.innerText = data.text;
            }
            if(!data.target) {
                node.removeAttribute('target');
            }
        }

        return node;
    }

    static formats(domNode) {
        return {
            href: domNode.getAttribute('href'),
            target: domNode.getAttribute('target')
        };
    }

    formats() {
        const formats = super.formats();
        const { href, target } = ExtLink.formats(this.domNode);

        formats.link = href;
        formats.target = target;

        return formats;
    }

    format(name, value) {
        if(name === 'link' && isObject(value)) {
            if(value.text) {
                this.domNode.innerText = value.text;
            }
            if(value.target) {
                this.domNode.setAttribute('target', '_blank');
            } else {
                this.domNode.removeAttribute('target');
            }
            this.domNode.setAttribute('href', value.href);
        } else {
            super.format(name, value);
        }
    }

    static value(domNode) {
        return {
            href: domNode.getAttribute('href'),
            text: domNode.innerText,
            target: !!domNode.getAttribute('target')
        };
    }
}

export default ExtLink;
