import Quill from "quill";
import Errors from "../widget/ui.errors";

function getQuill() {
    if(!Quill) {
        throw Errors.Error("E1050");
    }

    return Quill;
}

export { getQuill as default };
