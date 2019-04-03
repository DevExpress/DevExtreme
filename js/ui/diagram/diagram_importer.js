import Errors from "../widget/ui.errors";
import { getWindow } from "../../core/utils/window";

let diagram;

function getDiagram() {
    if(!diagram) {
        diagram = requestDiagram();
    }

    return diagram;
}

function requestDiagram() {
    const window = getWindow();
    const diagram = window && window.DevExpress && window.DevExpress.diagram;

    if(!diagram) {
        throw Errors.Error("E1041", "Diagram");
    }

    return diagram;
}

export { getDiagram };
