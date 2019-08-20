import $ from "../../core/renderer";
import DiagramPanel from "./diagram.panel";
import Accordion from "../accordion";
import Form from "../form";
import DiagramCommands from "./ui.diagram.commands";
import { extend } from "../../core/utils/extend";
import DiagramBar from "./diagram_bar";

const DIAGRAM_RIGHT_PANEL_CLASS = "dx-diagram-right-panel";
const DIAGRAM_RIGHT_PANEL_BEGIN_GROUP_CLASS = "dx-diagram-right-panel-begin-group";

class DiagramRightPanel extends DiagramPanel {
    _init() {
        super._init();
        this.bar = new OptionsDiagramBar(this);
        this._valueConverters = {};
    }
    _initMarkup() {
        super._initMarkup();
        this.$element().addClass(DIAGRAM_RIGHT_PANEL_CLASS);
        const $accordion = $("<div>")
            .appendTo(this.$element());

        this._renderAccordion($accordion);
    }
    _getAccordionDataSource() {
        return [{
            title: "Page Properties",
            onTemplate: (widget, $element) => widget._renderOptions($element)
        }];
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
                    cssClass: item.beginGroup && DIAGRAM_RIGHT_PANEL_BEGIN_GROUP_CLASS,
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
    _setItemSubItems(key, items) {
        this._updateLocked = true;
        var editorInstance = this._formInstance.getEditor(key.toString());
        editorInstance.option('items', items.map(item => {
            var value = (typeof item.value === "object") ? JSON.stringify(item.value) : item.value;
            return {
                'value': value,
                'title': item.text
            };
        }));
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
    setItemSubItems(key, items) {
        this._owner._setItemSubItems(key, items);
    }
}

module.exports = DiagramRightPanel;
