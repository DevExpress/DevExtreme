import QuillImporter from "../quill_importer";

const Theme = QuillImporter.getQuill().import("core/theme");

class BaseTheme extends Theme {
    constructor(quill, options) {

        super(quill, options);
        this.quill.root.classList.add("dx-htmleditor-content");

        // add keyboard bindings
        // this.options.modules.keyboard.bindings = {
        // };
    }
}

module.exports = BaseTheme;
