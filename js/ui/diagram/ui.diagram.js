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
        this._diagramInstance.onChanged = this._raiseValueChangeAction.bind(this);
    }
    _initDiagram() {
        const { DiagramControl } = getDiagram();
        this._diagramInstance = new DiagramControl();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            /**
            * @name dxDiagramOptions.onValueChanged
            * @extends Action
            * @type function(e)
            * @type_function_param1 e:object
            * @type_function_param1_field4 value:object
            * @type_function_param1_field5 previousValue:object
            * @action
            */
            onValueChanged: null,
        });
    }

    /**
    * @name dxDiagramMethods.getValue
    * @publicName getValue()
    * @return string
    */
    getValue() {
        var value;
        const { DiagramCommand } = getDiagram();
        this._diagramInstance.commandManager.getCommand(DiagramCommand.Export).execute(function(data) { value = data; });
        return value;
    }
    /**
    * @name dxDiagramMethods.setValue
    * @publicName setValue(value)
    * @param1 value:string
    */
    setValue(value) {
        const { DiagramCommand } = getDiagram();
        this._diagramInstance.commandManager.getCommand(DiagramCommand.Import).execute(value);
        this._raiseValueChangeAction();
    }

    _createValueChangeAction() {
        this._valueChangeAction = this._createActionByOption("onValueChanged");
    }
    _raiseValueChangeAction() {
        if(!this.option("onValueChanged")) return;

        if(!this._valueChangeAction) {
            this._createValueChangeAction();
        }
        let value = this.getValue();
        this._valueChangeAction(this._valueChangeArgs(value, this.previousValue));
        this.previousValue = value;
    }
    _valueChangeArgs(value, previousValue) {
        return {
            value: value,
            previousValue: previousValue
        };
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "onValueChanged":
                this._createValueChangeAction();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

registerComponent("dxDiagram", Diagram);
module.exports = Diagram;
