import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import Toolbar from "../toolbar";
import DiagramCommands from "./ui.diagram.commands";
import { getDiagram } from "./diagram_importer";
import { extend } from "../../core/utils/extend";
import "../select_box";
import "../color_box";
import "../check_box";

const ACTIVE_FORMAT_CLASS = "dx-format-active";
const TOOLBAR_CLASS = "dx-diagram-toolbar";

const WIDGET_COMMANDS = [
    {
        name: "options",
        icon: "preferences",
        hint: "Show Page Properties"
    }
];

class DiagramToolbar extends Widget {
    _init() {
        this.bar = new DiagramBar(this);
        this._toolbarWidgets = {};
        this._createOnWidgetCommand();
        super._init();
    }

    _initMarkup() {
        super._initMarkup();
        const $toolbar = $("<div>")
            .addClass(TOOLBAR_CLASS)
            .appendTo(this._$element);
        this._renderToolbar($toolbar);
    }

    _renderToolbar($toolbar) {
        let dataSource = this._prepareToolbarItems(DiagramCommands.getToolbar(), "before", this._execDiagramCommand);
        dataSource = dataSource.concat(this._prepareToolbarItems(WIDGET_COMMANDS, "after", this._execWidgetCommand));
        this._toolbarInstance = this._createComponent($toolbar, Toolbar, {
            dataSource
        });
    }

    _prepareToolbarItems(items, location, actionHandler) {
        return items.map(item => extend(true,
            this._createItem(item, location),
            this._createItemOptions(item),
            this._createItemActionOptions(item, actionHandler)
        ));
    }

    _createItem(item, location) {
        return {
            widget: item.widget || "dxButton",
            location: location,
            locateInMenu: "auto",
            options: {
                text: item.text,
                hint: item.hint,
                icon: item.icon,
                onInitialized: (e) => this._onItemInitialized(e.component, item.name)
            }
        };
    }
    _createItemOptions({ widget, items, valueExpr, displayExpr }) {
        if(widget === "dxSelectBox") {
            return {
                options: {
                    items,
                    valueExpr,
                    displayExpr
                }
            };
        }
    }
    _createItemActionOptions(item, handler) {
        switch(item.widget) {
            case "dxSelectBox":
            case "dxColorBox":
                return {
                    options: {
                        onValueChanged: (e) => handler.call(this, item.name, e.component.option("value"))
                    }
                };
            default:
                return {
                    options: {
                        onClick: (e) => handler.call(this, item.name)
                    }
                };
        }
    }
    _onItemInitialized(widget, name) {
        this._toolbarWidgets[name] = widget;
    }
    _execDiagramCommand(name, value) {
        if(!this._updateLocked) {
            this.bar._raiseBarCommandExecuted(name, value);
        }
    }
    _execWidgetCommand(name) {
        if(!this._updateLocked) {
            this._onWidgetCommandAction({ name });
        }
    }

    _createOnWidgetCommand() {
        this._onWidgetCommandAction = this._createActionByOption("onWidgetCommand");
    }

    _setItemEnabled(name, enabled) {
        if(name in this._toolbarWidgets) {
            this._toolbarWidgets[name].option("disabled", !enabled);
        }
    }
    _setEnabled(enabled) {
        this._toolbarInstance.option("disabled", !enabled);
    }
    _setItemValue(name, value) {
        let widget = this._toolbarWidgets[name];
        if(!widget) {
            return;
        }
        this._updateLocked = true;
        if("value" in widget.option()) {
            widget.option("value", value);
        } else if(value !== undefined) {
            widget.$element().toggleClass(ACTIVE_FORMAT_CLASS, value);
        }
        this._updateLocked = false;
    }
    _optionChanged(args) {
        switch(args.name) {
            case "onWidgetCommand":
                this._createOnWidgetCommand();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

class DiagramBar {
    constructor(widget) {
        const EventDispatcher = getDiagram().EventDispatcher;
        this.onChanged = new EventDispatcher(); /* implementation of IBar */
        this._widget = widget;
    }
    _raiseBarCommandExecuted(key, parameter) {
        this.onChanged.raise("NotifyBarCommandExecuted", parseInt(key), parameter);
    }

    /* implementation of IBar */
    getCommandKeys() {
        return DiagramCommands.getToolbar().map(c => c.name);
    }
    setItemValue(key, value) {
        this._widget._setItemValue(key, value);
    }
    setItemEnabled(key, enabled) {
        this._widget._setItemEnabled(key, enabled);
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

module.exports = DiagramToolbar;
