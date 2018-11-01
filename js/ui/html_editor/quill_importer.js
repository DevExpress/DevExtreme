import Quill from "quill";
import Errors from "../widget/ui.errors";
import windowUtils from "../../core/utils/window";

function getQuill() {
    const quill = windowUtils.hasWindow() && window.Quill || Quill;
    if(!quill) {
        throw Errors.Error("E1041", "Quill");
    }

    return quill;
}

export { getQuill };
