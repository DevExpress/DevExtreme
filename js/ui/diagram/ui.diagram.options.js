import Widget from "../widget/ui.widget";

const DIAGRAM_OPTIONS_CLASS = "dx-diagram-options";

class DiagramOptions extends Widget {
    _initMarkup() {
        this.$element().addClass(DIAGRAM_OPTIONS_CLASS);
    }
}

module.exports = DiagramOptions;
