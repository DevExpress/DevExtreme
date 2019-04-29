import $ from "../../core/renderer";
import Widget from "../widget/ui.widget";
import Accordion from "../accordion";
import Form from "../form";
import DiagramCommands from "./ui.diagram.commands";
import { extend } from "../../core/utils/extend";
import DiagramBar from "./diagram_bar";

const DIAGRAM_RIGHT_PANEL_CLASS = "dx-diagram-right-panel";

class DiagramRightPanel extends Widget {
    _init() {
        super._init();
        this.bar = new OptionsDiagramBar(this);
        this._valueConverters = {};
        this._onDataToolboxRenderedAction = this._createActionByOption("onDataToolboxRendered");
    }
    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(DIAGRAM_RIGHT_PANEL_CLASS);
        const $accordion = $("<div>")
            .appendTo(this.$element());

        this._renderAccordion($accordion);
    }
    _getDataSources() {
        return this.option("dataSources") || {};
    }
    _getAccordionDataSource() {
        var result = [{
            title: "Page Properties",
            onTemplate: (widget, $element) => widget._renderOptions($element)
        }];
        var dataSources = this._getDataSources();
        var hasDataSources = false;
        for(var key in dataSources) {
            if(dataSources.hasOwnProperty(key)) {
                hasDataSources = true;
                break;
            }
        }
        if(hasDataSources) {
            result.push({
                title: "Data Source",
                onTemplate: (widget, $element) => {
                    widget._renderDataSources($element);
                    this._onDataToolboxRenderedAction({ $element });
                }
            });
        }
        return result;
    }
    _renderAccordion($container) {
        this._accordionInstance = this._createComponent($container, Accordion, {
            multiple: true,
            collapsible: true,
            displayExpr: "title",
            dataSource: this._getAccordionDataSource(),
            itemTemplate: (data, index, $element) => data.onTemplate(this, $element)
        });
    }
    _renderOptions($container) {
        this._formInstance = this._createComponent($container, Form, {
            items: DiagramCommands.getOptions().map(item => {
                return extend(true, {
                    editorType: item.widget,
                    dataField: item.command.toString(),
                    label: {
                        text: item.text
                    },
                    options: {
                        text: item.text,
                        hint: item.hint,
                        icon: item.icon,
                        onInitialized: (e) => this._onToolbarItemInitialized(e.component, item.command)
                    }
                }, this._createWidgetOptions(item));
            }),
            onFieldDataChanged: (e) => this._onDiagramOptionChanged(e.dataField, e.value)
        });
    }
    _createWidgetOptions(item) {
        if(item.getValue && item.setValue) {
            this._valueConverters[item.command] = { getValue: item.getValue, setValue: item.setValue };
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
        if(!this._updateLocked && value !== undefined) {
            const valueConverter = this._valueConverters[key];
            if(valueConverter) {
                value = valueConverter.getValue(value);
            }
            this.bar.raiseBarCommandExecuted(parseInt(key), value);
        }
    }
    _setItemValue(key, value) {
        const valueConverter = this._valueConverters[key];
        if(valueConverter) {
            value = valueConverter.setValue(value);
        }
        this._updateLocked = true;
        this._formInstance.updateData(key.toString(), value);
        this._updateLocked = false;
    }
    _setEnabled(enabled) {
        this._formInstance.option("disabled", !enabled);
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            container: null
        });
    }

    _renderDataSources($container) {
        var dataSources = this._getDataSources();
        for(var key in dataSources) {
            if(dataSources.hasOwnProperty(key)) {
                $("<div>")
                    .appendTo($container)
                    .attr("data-key", key);
            }
        }
    }
}

class OptionsDiagramBar extends DiagramBar {
    getCommandKeys() {
        return DiagramCommands.getOptions().map(c => c.command);
    }
    setItemValue(key, value) {
        this._owner._setItemValue(key, value);
    }
    setEnabled(enabled) {
        this._owner._setEnabled(enabled);
    }
}

module.exports = DiagramRightPanel;
