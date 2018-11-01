import Quill from "quill";
import Errors from "../widget/ui.errors";
import { getWindow } from "../../core/utils/window";

function getQuill() {
    const window = getWindow();
    const quill = window && window.Quill || Quill;
    if(!quill) {
        throw Errors.Error("E1041", "Quill");
    }

    return quill;
}

export { getQuill };
