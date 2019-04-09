import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import Accordion from "../accordion";
import Form from "../form";
import DiagramCommands from "./ui.diagram.commands";
import { extend } from "../../core/utils/extend";
import { getDiagram } from "./diagram_importer";

const DIAGRAM_OPTIONS_CLASS = "dx-diagram-options";
const OPTIONS = [
    {
        title: "Page Properties",
        onTemplate: (widget, $element) => widget._renderOptions($element)
    }
];

class DiagramOptions extends Widget {
    _init() {
        super._init();
        this.bar = new DiagramBar(this);
        this._valueConverters = {};
    }
    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(DIAGRAM_OPTIONS_CLASS);
        const $accordion = $("<div>")
            .appendTo(this.$element());

        this._renderAccordion($accordion);
    }
    _renderAccordion($container) {
        this._accordionInstance = this._createComponent($container, Accordion, {
            multiple: true,
            collapsible: true,
            displayExpr: "title",
            dataSource: OPTIONS,
            itemTemplate: (data, index, $element) => data.onTemplate(this, $element)
        });
    }
    _renderOptions($container) {
        this._formInstance = this._createComponent($container, Form, {
            items: DiagramCommands.getOptions().map(item => {
                return extend(true, {
                    editorType: item.widget,
                    dataField: item.name.toString(),
                    label: {
                        text: item.text
                    },
                    options: {
                        text: item.text,
                        hint: item.hint,
                        icon: item.icon,
                        onInitialized: (e) => this._onToolbarItemInitialized(e.component, item.name)
                    }
                }, this._createWidgetOptions(item));
            }),
            onFieldDataChanged: (e) => this._onDiagramOptionChanged(e.dataField, e.value)
        });
    }
    _createWidgetOptions(item) {
        if(item.getValue && item.setValue) {
            this._valueConverters[item.name] = { getValue: item.getValue, setValue: item.setValue };
        }
        if(item.widget === "dxSelectBox") {
            return {
                editorOptions: {
                    dataSource: item.items,
                    displayExpr: "title",
                    valueExpr: "value"
                }
            };
        }
    }
    _onDiagramOptionChanged(key, value) {
        if(value !== undefined) {
            const valueConverter = this._valueConverters[key];
            if(valueConverter) {
                value = valueConverter.getValue(value);
            }
            this.bar._raiseBarCommandExecuted(parseInt(key), value);
        }
    }
    _setItemValue(key, value) {
        const valueConverter = this._valueConverters[key];
        if(valueConverter) {
            value = valueConverter.setValue(value);
        }
        this._formInstance.updateData(key.toString(), value);
    }
    _setEnabled(enabled) {
        this._formInstance.option("disabled", !enabled);
    }
}

class DiagramBar {
    constructor(widget) {
        const { EventDispatcher } = getDiagram();
        this.onChanged = new EventDispatcher(); /* implementation of IBar */
        this._widget = widget;
    }
    _raiseBarCommandExecuted(key, parameter) {
        this.onChanged.raise("NotifyBarCommandExecuted", parseInt(key), parameter);
    }

    /* implementation of IBar */
    getCommandKeys() {
        return DiagramCommands.getOptions().map(c => c.name);
    }
    setItemValue(key, value) {
        this._widget._setItemValue(key, value);
    }
    setItemEnabled(key, enabled) {
    }
    setItemVisible(key, enabled) {
    }
    setEnabled(enabled) {
        this._widget._setEnabled(enabled);
    }
    isVisible() {
        return true;
    }
}

module.exports = DiagramOptions;
