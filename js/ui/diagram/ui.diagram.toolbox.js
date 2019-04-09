import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import Accordion from "../accordion";
import ShapeCategories from "./ui.diagram.shape.categories";

const DIAGRAM_TOOLBOX_CLASS = "dx-diagram-toolbox";

class DiagramToolbox extends Widget {
    _init() {
        super._init();
        this._onShapeCategoryRenderedAction = this._createActionByOption("onShapeCategoryRendered");
    }
    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(DIAGRAM_TOOLBOX_CLASS);
        const $accordion = $("<div>")
            .appendTo(this.$element());

        this._renderAccordion($accordion);
    }
    _renderAccordion($container) {
        this._accordionInstance = this._createComponent($container, Accordion, {
            multiple: true,
            collapsible: true,
            displayExpr: "title",
            dataSource: ShapeCategories.load(),
            itemTemplate: (data, index, $element) => this._onShapeCategoryRenderedAction({ category: data.category, $element })
        });
    }
}

module.exports = DiagramToolbox;
