import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";
import DiagramToolbar from "./ui.diagram.toolbar";
import DiagramToolbox from "./ui.diagram.toolbox";
import DiagramOptions from "./ui.diagram.options";
import { getDiagram } from "./diagram_importer";

const DIAGRAM_CLASS = "dx-diagram";
const DIAGRAM_TOOLBAR_WRAPPER_CLASS = DIAGRAM_CLASS + "-toolbar-wrapper";
const DIAGRAM_CONTENT_WRAPPER_CLASS = DIAGRAM_CLASS + "-content-wrapper";
const DIAGRAM_CONTENT_CLASS = DIAGRAM_CLASS + "-content";

class Diagram extends Widget {
    _init() {
        super._init();
        this._initDiagram();
    }
    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(DIAGRAM_CLASS);

        const $toolbarWrapper = $("<div>")
            .addClass(DIAGRAM_TOOLBAR_WRAPPER_CLASS)
            .appendTo(this.$element());

        const $contentWrapper = $("<div>")
            .addClass(DIAGRAM_CONTENT_WRAPPER_CLASS)
            .appendTo(this.$element());

        const $toolbox = $("<div>")
            .appendTo($contentWrapper);

        const $content = $("<div>")
            .addClass(DIAGRAM_CONTENT_CLASS)
            .appendTo($contentWrapper);

        const $options = $("<div>")
            .appendTo($contentWrapper);

        this._createComponent($toolbarWrapper, DiagramToolbar, {
            onContentReady: (e) => this._diagramInstance.barManager.registerBar(e.component.bar)
        });
        this._createComponent($toolbox, DiagramToolbox, {
            onShapeCategoryRendered: (e) => this._diagramInstance.createToolbox(e.$element[0], 40, 8, {}, e.category)
        });
        this._createComponent($options, DiagramOptions, {
            onContentReady: (e) => this._diagramInstance.barManager.registerBar(e.component.bar)
        });

        this._diagramInstance.createDocument($content[0]);
    }
    _initDiagram() {
        const { DiagramControl } = getDiagram();
        this._diagramInstance = new DiagramControl();
    }
}

registerComponent("dxDiagram", Diagram);
module.exports = Diagram;
