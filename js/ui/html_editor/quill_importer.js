import Quill from "quill";
import Errors from "../widget/ui.errors";

class QuillImporter {
    constructor() {}

    static getQuill() {
        if(!QuillImporter._quill) {
            throw Errors.Error("E1050");
        }

        return QuillImporter._quill;
    }
}

QuillImporter._quill = Quill;

export { QuillImporter as default };
