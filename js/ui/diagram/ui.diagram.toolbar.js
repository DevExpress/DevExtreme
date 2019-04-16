import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import Toolbar from "../toolbar";
import ContextMenu from "../context_menu";
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
        command: "options",
        icon: "preferences",
        hint: "Show Page Properties"
    }
];

class DiagramToolbar extends Widget {
    _init() {
        this.bar = new DiagramBar(this);
        this._itemHelpers = {};
        this._contextMenus = [];
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
            this._createItem(item, location, actionHandler),
            this._createItemOptions(item),
            this._createItemActionOptions(item, actionHandler)
        ));
    }

    _createItem(item, location, actionHandler) {
        return {
            widget: item.widget || "dxButton",
            location: location,
            locateInMenu: "auto",
            options: {
                text: item.text,
                hint: item.hint,
                icon: item.icon,
                onInitialized: (e) => this._onItemInitialized(e.component, item),
                onContentReady: (e) => this._onItemContentReady(e.component, item, actionHandler),
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
                        onValueChanged: (e) => handler.call(this, item.command, e.component.option("value"))
                    }
                };
            default:
                if(!item.items) {
                    return {
                        options: {
                            onClick: (e) => handler.call(this, item.command)
                        }
                    };
                }
        }
    }
    _onItemInitialized(widget, item) {
        if(item.command !== undefined) {
            this._itemHelpers[item.command] = new ToolbarItemHelper(widget);
        }
    }
    _onItemContentReady(widget, item, actionHandler) {
        if(widget.NAME === "dxButton" && item.items) {
            const $menuContainer = $("<div>")
                .appendTo(this.$element());
            this._createComponent($menuContainer, ContextMenu, {
                dataSource: item.items,
                displayExpr: "text",
                valueExpr: "command",
                target: widget.$element(),
                showEvent: "dxclick",
                position: { at: "left bottom" },
                onItemClick: (e) => actionHandler.call(this, e.itemData.command),
                onInitialized: ({ component }) => this._onContextMenuInitialized(component, item)
            });
        }
    }
    _onContextMenuInitialized(widget, item) {
        this._contextMenus.push(widget);
        item.items.forEach((item, index) => {
            this._itemHelpers[item.command] = new ContextMenuItemHelper(widget, index);
        });
    }
    _execDiagramCommand(command, value) {
        if(!this._updateLocked) {
            this.bar._raiseBarCommandExecuted(command, value);
        }
    }
    _execWidgetCommand(command) {
        if(!this._updateLocked) {
            this._onWidgetCommandAction({ name: command });
        }
    }

    _createOnWidgetCommand() {
        this._onWidgetCommandAction = this._createActionByOption("onWidgetCommand");
    }

    _setItemEnabled(command, enabled) {
        if(command in this._itemHelpers) {
            this._itemHelpers[command].setEnabled(enabled);
        }
    }
    _setEnabled(enabled) {
        this._toolbarInstance.option("disabled", !enabled);
        this._contextMenus.forEach(cm => cm.option("disabled", !enabled));
    }
    _setItemValue(command, value) {
        try {
            this._updateLocked = true;
            if(command in this._itemHelpers) {
                this._itemHelpers[command].setValue(value);
            }
        } finally {
            this._updateLocked = false;
        }
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
        return DiagramCommands.getToolbar().reduce((commands, i) => {
            if(i.command !== undefined) {
                commands.push(i.command);
            }
            return i.items ? commands.concat(i.items.filter(ci => ci.command !== undefined).map(ci => ci.command)) : commands;
        }, []);
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

class ToolbarItemHelper {
    constructor(widget) {
        this._widget = widget;
    }
    setEnabled(enabled) {
        this._widget.option("disabled", !enabled);
    }
    setValue(value) {
        if("value" in this._widget.option()) {
            this._widget.option("value", value);
        } else if(value !== undefined) {
            this._widget.$element().toggleClass(ACTIVE_FORMAT_CLASS, value);
        }
    }
}

class ContextMenuItemHelper extends ToolbarItemHelper {
    constructor(widget, index) {
        super(widget);
        this._index = index;
    }
    setEnabled(enabled) {
        this._widget.option(`items[${this._index}].disabled`, !enabled);
    }
    setValue(value) { }
}

module.exports = DiagramToolbar;
