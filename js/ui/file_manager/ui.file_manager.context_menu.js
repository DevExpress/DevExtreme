import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { isObject, isString } from "../../core/utils/type";

import Widget from "../widget/ui.widget";
import Button from "../button";
import ContextMenu from "../context_menu/ui.context_menu";

const FILE_MANAGER_FILE_ACTIONS_BUTTON = "dx-filemanager-file-actions-button";
const FILE_MANAGER_FILE_ACTIONS_BUTTON_ACTIVATED = "dx-filemanager-file-actions-button-activated";
const ACTIVE_STATE_CLASS = "dx-state-active";

const DEFAULT_CONTEXT_MENU_ITEMS = [
    "create",
    "upload",
    "rename",
    "move",
    "copy",
    "delete",
    {
        commandName: "refresh",
        beginGroup: true
    }
];

class FileManagerContextMenu extends Widget {

    _initMarkup() {
        const $menu = $("<div>").appendTo(this.$element());
        this._contextMenu = this._createComponent($menu, ContextMenu, {
            onItemClick: ({ itemData: { commandName } }) => this._onContextMenuItemClick(commandName),
            onHidden: () => this._onContextMenuHidden()
        });

        super._initMarkup();
    }

    showFor(fileItems, element, offset) {
        const items = this.createContextMenuItems(fileItems);

        const position = {
            of: element
        };

        if(offset) {
            position.offset = offset.offsetX + " " + offset.offsetY;
        } else {
            position.my = "left top";
            position.at = "left bottom";
        }

        this._contextMenu.option({
            dataSource: items,
            target: element,
            position
        });

        this._contextMenu.show();
    }

    createContextMenuItems(fileItems) {
        this._targetFileItems = fileItems;

        const result = [];

        DEFAULT_CONTEXT_MENU_ITEMS.forEach(srcItem => {
            const commandName = isString(srcItem) ? srcItem : srcItem.commandName;
            if(this._commandManager.isCommandAvailable(commandName, fileItems)) {
                let item = this._createMenuItemByCommandName(commandName);
                if(isObject(srcItem)) {
                    item = extend(true, item, srcItem);
                }
                result.push(item);
            }
        });

        return result;
    }

    _createMenuItemByCommandName(commandName) {
        const command = this._commandManager.getCommandByName(commandName);
        return {
            commandName,
            text: command.text,
            icon: command.icon,
            onItemClick: () => this._onContextMenuItemClick(commandName)
        };
    }

    createFileActionsButton($container, options) {
        let buttonCssClass = options.cssClass ? options.cssClass + " " : "";
        buttonCssClass += FILE_MANAGER_FILE_ACTIONS_BUTTON;

        const $button = $("<div>")
            .addClass(buttonCssClass)
            .appendTo($container);

        return this._createComponent($button, Button, {
            text: "&vellip;",
            onClick: e => this._onFileActionsButtonClick(e, options),
            template: () => {
                return $("<i>").html("&vellip;");
            }
        });
    }

    _onContextMenuItemClick(commandName) {
        this._commandManager.executeCommand(commandName, this._targetFileItems);
    }

    _onContextMenuHidden() {
        this._setActiveFileActionsButtonElement(null);
    }

    _onFileActionsButtonClick(e, options) {
        this._setActiveFileActionsButtonElement($(e.element));
        options.onFileActionsButtonClick(e);
    }

    _setActiveFileActionsButtonElement($element) {
        if(this._$activeFileActionsButton) {
            this._$activeFileActionsButton.removeClass(FILE_MANAGER_FILE_ACTIONS_BUTTON_ACTIVATED + " " + ACTIVE_STATE_CLASS);
        }
        this._$activeFileActionsButton = $element;
        if(this._$activeFileActionsButton) {
            this._$activeFileActionsButton.addClass(FILE_MANAGER_FILE_ACTIONS_BUTTON_ACTIVATED);
            setTimeout(() => this._$activeFileActionsButton.addClass(ACTIVE_STATE_CLASS));
        }
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            commandManager: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "commandManager":
                this.repaint();
                break;
            default:
                super._optionChanged(args);
        }
    }

    get _commandManager() {
        return this.option("commandManager");
    }

}

module.exports = FileManagerContextMenu;
