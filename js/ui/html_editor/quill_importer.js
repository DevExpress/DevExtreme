import Errors from "../widget/ui.errors";

let Quill;
try {
    Quill = require("quill");
} catch(e) {}

function getQuill() {
    if(!Quill) {
        throw Errors.Error("E1050");
    }

    return Quill;
}

export { getQuill };
