import { getQuill } from "../quill_importer";
import { isObject } from "../../../core/utils/type";

const quill = getQuill();
const Link = quill.import("formats/link");

class ExtLink extends Link {
    static create(data) {
        const HREF = data && data.href || data;
        let node = super.create(HREF);

        if(isObject(data)) {
            node.innerText = data.text || data.href;

            if(data.title) {
                node.setAttribute("title", data.title);
            }

            if(!data.target) {
                node.removeAttribute("target");
            }
        }

        return node;
    }

    static formats(domNode) {
        const href = super.formats(domNode);

        return {
            href: href,
            text: domNode.innerText,
            title: domNode.getAttribute("title"),
            target: !!domNode.getAttribute("target")
        };
    }

    format(name, value) {
        if(name === "link") {
            if(value.title) {
                this.domNode.setAttribute("title", value.title);
            }
            if(value.text) {
                this.domNode.innerText = value.text;
            }
            if(value.target) {
                this.domNode.removeAttribute("target");
            } else {
                this.domNode.setAttribute("target", "_blank");
            }
            this.domNode.setAttribute("href", value.href);
        } else {
            super.format(name, value);
        }
    }

    static value(domNode) {
        return {
            href: domNode.getAttribute("href"),
            text: domNode.innerText,
            title: domNode.getAttribute("title"),
            target: !!domNode.getAttribute("target")
        };
    }
}


module.exports = ExtLink;
