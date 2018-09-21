import Quill from "quill";
import Errors from "../widget/ui.errors";

function getQuill() {
    if(!Quill) {
        throw Errors.Error("E1041", "Quill");
    }

    return Quill;
}

export { getQuill };
