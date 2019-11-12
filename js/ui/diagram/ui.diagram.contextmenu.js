import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import ContextMenu from "../context_menu";
import DiagramCommands from "./ui.diagram.commands";
import DiagramBar from "./diagram_bar";
import { getDiagram } from "./diagram_importer";

const DIAGRAM_TOUCHBAR_CLASS = "dx-diagram-touchbar";
const DIAGRAM_TOUCHBAR_TARGET_CLASS = "dx-diagram-touchbar-target";
const DIAGRAM_TOUCHBAR_MINWIDTH = 240;
const DIAGRAM_TOUCHBAR_OFFSET = 32;

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

        this._$contextMenuTargetElement = $("<div>")
            .addClass(DIAGRAM_TOUCHBAR_TARGET_CLASS)
            .appendTo(this.$element());

        const $contextMenu = $("<div>")
            .appendTo(this.$element());

        const { Browser } = getDiagram();
        this._contextMenuInstance = this._createComponent($contextMenu, ContextMenu, {
            cssClass: Browser.TouchUI ? DIAGRAM_TOUCHBAR_CLASS : "",
            items: this._getItems(this._commands),
            focusStateEnabled: false,
            position: (Browser.TouchUI ? {
                my: { x: "center", y: "bottom" },
                at: { x: "center", y: "top" },
                of: this._$contextMenuTargetElement
            } : {}),


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
                    icon: command.icon,
                    getParameter: command.getParameter,
                    beginGroup: beginGroup
                });
                beginGroup = false;
            }
        });
        return items;
    }
    _show(x, y, selection) {
        this.clickPosition = { x, y };
        const { Browser } = getDiagram();
        if(Browser.TouchUI) {
            this._contextMenuInstance.hide();
            this._$contextMenuTargetElement.show();
            if(!selection) {
                selection = { x, y, width: 0, height: 0 };
            }
            var widthCorrection = selection.width > DIAGRAM_TOUCHBAR_MINWIDTH ? 0 : (DIAGRAM_TOUCHBAR_MINWIDTH - selection.width) / 2;
            this._$contextMenuTargetElement.css({
                left: selection.x - widthCorrection,
                top: selection.y - DIAGRAM_TOUCHBAR_OFFSET,
                width: selection.width + 2 * widthCorrection,
                height: selection.height + 2 * DIAGRAM_TOUCHBAR_OFFSET,
            });
            this._contextMenuInstance.show();
        } else {
            this._contextMenuInstance.hide();
            this._contextMenuInstance.option("position", { offset: x + " " + y });
            this._contextMenuInstance.show();
        }
    }
    _hide() {
        this._$contextMenuTargetElement.hide();
        this._contextMenuInstance.hide();
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
