import getQuill from "../quill_importer";

const Image = getQuill().import("formats/image");

class extImage extends Image {
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

export { extImage as default };
