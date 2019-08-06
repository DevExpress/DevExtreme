import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import ContextMenu from "../context_menu";
import DiagramCommands from "./ui.diagram.commands";
import DiagramBar from "./diagram_bar";

class DiagramContextMenu extends Widget {
    _init() {
        super._init();
        this._createOnVisibleChangedAction();
        this.bar = new ContextMenuBar(this);
        this._tempState = undefined;

        this._commands = [];
        this._commandToIndexMap = {};
    }
    _initMarkup() {
        super._initMarkup();

        this._commands = DiagramCommands.getContextMenuCommands(this.option("commands"));
        this._commands.forEach((item, index) => this._commandToIndexMap[item.command] = index);

        const $contextMenu = $("<div>")
            .appendTo(this.$element());

        this._contextMenuInstance = this._createComponent($contextMenu, ContextMenu, {
            target: this.option("container"),
            items: this._getItems(this._commands),

            onItemClick: ({ itemData }) => this._onItemClick(itemData),
            onShowing: (e) => {
                this._tempState = true;
                if(e.jQEvent) {
                    this.clickPosition = { x: e.jQEvent.clientX, y: e.jQEvent.clientY };
                }
                this._onVisibleChangedAction({ visible: true, component: this });
                this._contextMenuInstance.option("items", this._getItems(this._commands, true));
                delete this._tempState;
            },
            onHiding: (e) => {
                this._tempState = false;
                this._onVisibleChangedAction({ visible: false, component: this });
                delete this._tempState;
            }
        });
    }
    _getItems(commands, onlyVisible) {
        var items = [];
        var beginGroup = false;
        commands.forEach(function(command) {
            if(command.widget === "separator") {
                beginGroup = true;
            } else if(command.visible || !onlyVisible) {
                items.push({
                    command: command.command,
                    text: command.text,
                    getParameter: command.getParameter,
                    beginGroup: beginGroup
                });
                beginGroup = false;
            }
        });
        return items;
    }
    _onItemClick(itemData) {
        const parameter = this._getExecCommandParameter(itemData);
        this.bar.raiseBarCommandExecuted(itemData.command, parameter);
        this._contextMenuInstance.hide();
    }
    _getExecCommandParameter(itemData) {
        if(itemData.getParameter) {
            return itemData.getParameter(this);
        }
    }
    _setItemEnabled(key, enabled) {
        this._setItemVisible(key, enabled);
    }
    _setItemVisible(key, visible) {
        if(key in this._commandToIndexMap) {
            var command = this._commands[this._commandToIndexMap[key]];
            command.visible = visible;
        }
    }
    _setEnabled(enabled) {
        this._contextMenuInstance.option("disabled", !enabled);
    }
    isVisible() {
        if(this._tempState !== undefined) {
            return this._tempState;
        }
        return !!this._contextMenuInstance.option("visible");
    }
    _createOnVisibleChangedAction() {
        this._onVisibleChangedAction = this._createActionByOption("onVisibleChanged");
    }
    _optionChanged(args) {
        switch(args.name) {
            case "onVisibleChanged":
                this._createOnVisibleChangedAction();
                break;
            case "commands":
                this._invalidate();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

class ContextMenuBar extends DiagramBar {
    getCommandKeys() {
        return DiagramCommands.getContextMenuCommands().map(c => c.command);
    }
    setItemEnabled(key, enabled) {
        this._owner._setItemEnabled(key, enabled);
    }
    setItemVisible(key, visible) {
        this._owner._setItemVisible(key, visible);
    }
    setEnabled(enabled) {
        this._owner._setEnabled(enabled);
    }
    isVisible() {
        return this._owner.isVisible();
    }
}

module.exports = DiagramContextMenu;
