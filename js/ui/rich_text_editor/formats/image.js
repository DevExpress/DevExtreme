import { getQuill } from "../quill_importer";

const quill = getQuill();
const Image = quill.import("formats/image");

class ExtImage extends Image {
    static formats(domNode) {
        let formats = super.formats(domNode);

        if(domNode.style["float"]) {
            formats["float"] = domNode.style["float"];
        }

        return formats;
    }

    format(name, value) {
        if(name === "float") {
            this.domNode.style[name] = value;
        } else {
            super.format(name, value);
        }
    }
}


module.exports = ExtImage;
