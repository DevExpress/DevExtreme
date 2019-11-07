import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import ContextMenu from "../context_menu";
import DiagramCommands from "./ui.diagram.commands";
import DiagramBar from "./diagram_bar";

class DiagramContextMenu extends Widget {
    _init() {
        super._init();
        this._createOnVisibleChangedAction();
        this._createOnItemClickAction();
        this.bar = new ContextMenuBar(this);
        this._tempState = undefined;

        this._commands = [];
        this._commandToIndexMap = {};
    }
    _initMarkup() {
        super._initMarkup();

        this._commands = DiagramCommands.getContextMenuCommands(this.option("commands"));
        this._commandToIndexMap = {};
        this._commands.forEach((item, index) => this._commandToIndexMap[item.command] = index);

        const $contextMenu = $("<div>")
            .appendTo(this.$element());

        this._contextMenuInstance = this._createComponent($contextMenu, ContextMenu, {
            items: this._getItems(this._commands),
            focusStateEnabled: false,

            onItemClick: ({ itemData }) => this._onItemClick(itemData),
            onShowing: (e) => {
                if(this._tempState === true) return;

                this._tempState = true;
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
    _show(x, y, isTouch) {
        this.clickPosition = { x, y };
        this._contextMenuInstance.option("visible", false);
        this._contextMenuInstance.option("position", { offset: x + " " + y });
        this._contextMenuInstance.option("visible", true);
    }
    _hide() {
        this._contextMenuInstance.option("visible", false);
    }
    _onItemClick(itemData) {
        var processed = false;
        if(this._onItemClickAction) {
            processed = this._onItemClickAction(itemData);
        }

        if(!processed) {
            const parameter = this._getExecCommandParameter(itemData);
            this.bar.raiseBarCommandExecuted(itemData.command, parameter);
            this._contextMenuInstance.hide();
        }
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
            if(command) command.visible = visible;
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
    _createOnItemClickAction() {
        this._onItemClickAction = this._createActionByOption("onItemClick");
    }
    _optionChanged(args) {
        switch(args.name) {
            case "onVisibleChanged":
                this._createOnVisibleChangedAction();
                break;
            case "onItemClick":
                this._createOnItemClickAction();
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
