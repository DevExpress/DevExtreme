import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import registerComponent from "../../core/component_registrator";
import { extend } from "../../core/utils/extend";
import DiagramToolbar from "./ui.diagram.toolbar";
import DiagramToolbox from "./ui.diagram.toolbox";
import DiagramOptions from "./ui.diagram.options";
import { getDiagram } from "./diagram_importer";
import { hasWindow } from "../../core/utils/window";

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
        const isServerSide = !hasWindow();
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
            onShapeCategoryRendered: (e) => !isServerSide && this._diagramInstance.createToolbox(e.$element[0], 40, 8, {}, e.category)
        });
        this._createComponent($options, DiagramOptions);

        !isServerSide && this._diagramInstance.createDocument($content[0]);
        this._diagramInstance.onChanged = this._raiseDataChangeAction.bind(this);
    }
    _initDiagram() {
        const { DiagramControl } = getDiagram();
        this._diagramInstance = new DiagramControl();
    }

    /**
    * @name dxDiagramMethods.getData
    * @publicName getData()
    * @return string
    */
    getData() {
        let value;
        const { DiagramCommand } = getDiagram();
        this._diagramInstance.commandManager.getCommand(DiagramCommand.Export).execute(function(data) { value = data; });
        return value;
    }
    /**
    * @name dxDiagramMethods.setData
    * @publicName setData(value)
    * @param1 data:string
    */
    setData(data) {
        const { DiagramCommand } = getDiagram();
        this._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(data);
        this._raiseDataChangeAction();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            /**
            * @name dxDiagramOptions.onDataChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 data:string
            * @action
            */
            onDataChanged: null
        });
    }

    _createDataChangeAction() {
        this._dataChangeAction = this._createActionByOption("onDataChanged");
    }
    _raiseDataChangeAction() {
        if(!this.option("onDataChanged")) return;

        if(!this._dataChangeAction) {
            this._createDataChangeAction();
        }
        this._dataChangeAction({
            data: this.getData()
        });
    }

    _optionChanged(args) {
        switch(args.name) {
            case "onDataChanged":
                this._createDataChangeAction();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

registerComponent("dxDiagram", Diagram);
module.exports = Diagram;
