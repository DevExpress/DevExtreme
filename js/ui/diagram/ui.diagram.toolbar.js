import $ from "../../core/renderer";

import DiagramPanel from "./diagram.panel";
import Toolbar from "../toolbar";
import ContextMenu from "../context_menu";
import DiagramCommands from "./ui.diagram.commands";
import DiagramBar from "./diagram_bar";
import { extend } from "../../core/utils/extend";
import messageLocalization from "../../localization/message";

import "../select_box";
import "../color_box";
import "../check_box";

const ACTIVE_FORMAT_CLASS = "dx-format-active";
const TOOLBAR_CLASS = "dx-diagram-toolbar";
const TOOLBAR_SEPARATOR_CLASS = "dx-diagram-toolbar-separator";
const TOOLBAR_MENU_SEPARATOR_CLASS = "dx-diagram-toolbar-menu-separator";

class DiagramToolbar extends DiagramPanel {
    _init() {
        this.bar = new ToolbarDiagramBar(this);
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

    _getWidgetCommands() {
        return this._widgetCommands ||
            (this._widgetCommands = [
                {
                    command: "options",
                    icon: "preferences",
                    hint: messageLocalization.format("dxDiagram-commandProperties"),
                    text: messageLocalization.format("dxDiagram-commandProperties"),
                }
            ]);
    }
    _renderToolbar($toolbar) {
        const commands = DiagramCommands.getToolbarCommands(this.option("commands"));
        var widgetCommandNames = this.option("widgetCommandNames") || [];
        var widgetCommands = this._getWidgetCommands().filter(function(c) { return widgetCommandNames.indexOf(c.command) > -1; });
        let dataSource = this._prepareToolbarItems(commands, "before", this._execDiagramCommand);
        dataSource = dataSource.concat(this._prepareToolbarItems(widgetCommands, "after", this._execWidgetCommand));
        this._toolbarInstance = this._createComponent($toolbar, Toolbar, {
            dataSource
        });
    }

    _prepareToolbarItems(items, location, actionHandler) {
        return items.map(item => extend(true,
            { location: location, locateInMenu: "auto" },
            this._createItem(item, location, actionHandler),
            this._createItemOptions(item),
            this._createItemActionOptions(item, actionHandler)
        ));
    }

    _createItem(item, location, actionHandler) {
        if(item.widget === "separator") {
            return {
                template: (data, index, element) => {
                    $(element).addClass(TOOLBAR_SEPARATOR_CLASS);
                },
                menuItemTemplate: (data, index, element) => {
                    $(element).addClass(TOOLBAR_MENU_SEPARATOR_CLASS);
                }
            };
        }
        return {
            widget: item.widget || "dxButton",
            cssClass: item.cssClass,
            options: {
                stylingMode: "text",
                text: item.text,
                hint: item.hint,
                icon: item.icon,
                onInitialized: (e) => this._onItemInitialized(e.component, item),
                onContentReady: (e) => this._onItemContentReady(e.component, item, actionHandler),
            }
        };
    }
    _createItemOptions({ widget, items, valueExpr, displayExpr, showText, hint, icon }) {
        if(widget === "dxSelectBox") {
            return this._createSelectBoxItemOptions(hint, items, valueExpr, displayExpr);
        } else if(widget === "dxColorBox") {
            return this._createColorBoxItemOptions(hint, icon);
        } else if(!widget || widget === "dxButton") {
            return {
                showText: showText || "inMenu"
            };
        }
    }
    _createSelectBoxItemOptions(hint, items, valueExpr, displayExpr) {
        let options = this._createSelectBoxBaseItemOptions(hint);
        if(items) {
            options = extend(true, options, {
                options: {
                    items,
                    displayExpr,
                    valueExpr
                }
            });
        } else {
            options = extend(true, options, {
                options: {
                    dataSource: items,
                    displayExpr: "title",
                    valueExpr: "value"
                }
            });
        }

        const isSelectButton = items && items.every(i => i.icon !== undefined);
        if(isSelectButton) {
            options = extend(true, options, {
                options: {
                    fieldTemplate: (data, container) => {
                        $("<i>")
                            .addClass(data && data.icon)
                            .appendTo(container);
                        $("<div>").dxTextBox({
                            readOnly: true,
                            stylingMode: "outlined"
                        }).appendTo(container);
                    },
                    itemTemplate: (data) => {
                        return `<i class="${data.icon}"${data.hint && ` title="${data.hint}`}"}></i>`;
                    }
                }
            });
        }
        return options;
    }
    _createColorBoxItemOptions(hint, icon) {
        let options = this._createSelectBoxBaseItemOptions(hint);
        if(icon) {
            options = extend(true, options, {
                options: {
                    openOnFieldClick: true,
                    fieldTemplate: (data, container) => {
                        $("<i>")
                            .addClass(icon)
                            .css("borderBottomColor", data)
                            .appendTo(container);
                        $("<div>").dxTextBox({
                            readOnly: true,
                            stylingMode: "outlined"
                        }).appendTo(container);
                    }
                }
            });
        }
        return options;
    }
    _createSelectBoxBaseItemOptions(hint) {
        return {
            options: {
                stylingMode: "filled",
                hint: hint,
            }
        };
    }
    _createItemActionOptions(item, handler) {
        switch(item.widget) {
            case "dxSelectBox":
            case "dxColorBox":
            case "dxCheckBox":
                return {
                    options: {
                        onValueChanged: (e) => {
                            const parameter = this._getExecCommandParameter(item, e.component.option("value"));
                            handler.call(this, item.command, parameter);
                        }
                    }
                };
            default:
                if(!item.items) {
                    return {
                        options: {
                            onClick: (e) => {
                                const parameter = this._getExecCommandParameter(item);
                                handler.call(this, item.command, parameter);
                            }
                        }
                    };
                }
        }
    }
    _getExecCommandParameter(item, widgetValue) {
        if(item.getParameter) {
            return item.getParameter(this, widgetValue);
        }
        return widgetValue;
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
                onItemClick: ({ itemData }) => {
                    if(itemData.command !== undefined) {
                        const parameter = this._getExecCommandParameter(itemData);
                        actionHandler.call(this, itemData.command, parameter);
                    }
                },
                onInitialized: ({ component }) => this._onContextMenuInitialized(component, item, widget),
                onDisposing: ({ component }) => this._onContextMenuDisposing(component, item)
            });
        }
    }
    _onContextMenuInitialized(widget, item, rootButton) {
        this._contextMenus.push(widget);
        this._addContextMenuHelper(item.items, widget, [], rootButton);
    }
    _addContextMenuHelper(items, widget, indexPath, rootButton) {
        if(items) {
            items.forEach((item, index) => {
                let itemIndexPath = indexPath.concat(index);
                this._itemHelpers[item.command] = new ContextMenuItemHelper(widget, itemIndexPath, rootButton);
                this._addContextMenuHelper(item.items, widget, itemIndexPath, rootButton);
            });
        }
    }
    _onContextMenuDisposing(widget, item) {
        this._contextMenus = this._contextMenus.filter(cm => cm !== widget);
    }
    _execDiagramCommand(command, value) {
        if(!this._updateLocked) {
            this.bar.raiseBarCommandExecuted(command, value);
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
    _setItemSubItems(command, items) {
        this._updateLocked = true;
        if(command in this._itemHelpers) {
            this._itemHelpers[command].setItems(items);
        }
        this._updateLocked = false;
    }
    _optionChanged(args) {
        switch(args.name) {
            case "onWidgetCommand":
                this._createOnWidgetCommand();
                break;
            case "commands":
                this._invalidate();
                break;
            case "export":
                break;
            default:
                super._optionChanged(args);
        }
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            "export": {
                fileName: "Diagram",
                proxyUrl: undefined
            }
        });
    }
}

class ToolbarDiagramBar extends DiagramBar {
    getCommandKeys() {
        return this.getKeys(DiagramCommands.getToolbarCommands());
    }
    getKeys(items) {
        return items.reduce((commands, item) => {
            if(item.command !== undefined) {
                commands.push(item.command);
            }
            if(item.items) {
                commands = commands.concat(this.getKeys(item.items));
            }
            return commands;
        }, []);
    }
    setItemValue(key, value) {
        this._owner._setItemValue(key, value);
    }
    setItemEnabled(key, enabled) {
        this._owner._setItemEnabled(key, enabled);
    }
    setEnabled(enabled) {
        this._owner._setEnabled(enabled);
    }
    setItemSubItems(key, items) {
        this._owner._setItemSubItems(key, items);
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
    setItems(items) {
        if("items" in this._widget.option()) {
            this._widget.option('items', items.map(item => {
                var value = (typeof item.value === "object") ? JSON.stringify(item.value) : item.value;
                return {
                    'value': value,
                    'title': item.text
                };
            }));
        }
    }
}

class ContextMenuItemHelper extends ToolbarItemHelper {
    constructor(widget, indexPath, rootButton) {
        super(widget);
        this._indexPath = indexPath;
        this._rootButton = rootButton;
    }
    setEnabled(enabled) {
        let optionText = this._indexPath.reduce((r, i) => {
            return r + `items[${i}].`;
        }, "") + "disabled";
        this._widget.option(optionText, !enabled);
        let rootEnabled = this._hasEnabledCommandItems(this._widget.option("items"));
        this._rootButton.option("disabled", !rootEnabled);
    }
    _hasEnabledCommandItems(items) {
        if(items) {
            return items.some(item =>
                item.command !== undefined && !item.disabled || this._hasEnabledCommandItems(item.items)
            );
        }
        return false;
    }
    setValue(value) { }
}

module.exports = DiagramToolbar;
