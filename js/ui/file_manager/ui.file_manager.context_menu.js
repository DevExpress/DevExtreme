import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { isObject, isString } from "../../core/utils/type";

import Widget from "../widget/ui.widget";
import ContextMenu from "../context_menu/ui.context_menu";

const FILEMANAGER_CONTEXT_MEMU_CLASS = "dx-filemanager-context-menu";

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
        this._createContextMenuHiddenAction();

        this._isVisible = false;

        const $menu = $("<div>").appendTo(this.$element());
        this._contextMenu = this._createComponent($menu, ContextMenu, {
            cssClass: FILEMANAGER_CONTEXT_MEMU_CLASS,
            showEvent: "",
            onItemClick: ({ itemData: { commandName } }) => this._onContextMenuItemClick(commandName),
            onHidden: () => this._onContextMenuHidden()
        });

        super._initMarkup();
    }

    showAt(fileItems, element, offset) {
        if(this._isVisible) {
            this._raiseContextMenuHidden();
        }
        this._isVisible = true;

        const items = this.createContextMenuItems(fileItems);

        const position = {
            of: element,
            at: "top left",
            my: "top left",
            offset: ""
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
        const { text, icon } = this._commandManager.getCommandByName(commandName);
        return {
            commandName,
            text,
            icon,
            onItemClick: () => this._onContextMenuItemClick(commandName)
        };
    }

    _onContextMenuItemClick(commandName) {
        this._commandManager.executeCommand(commandName, this._targetFileItems);
    }

    _createContextMenuHiddenAction() {
        this._contextMenuHiddenAction = this._createActionByOption("onContextMenuHidden");
    }

    _onContextMenuHidden() {
        this._isVisible = false;
        this._raiseContextMenuHidden();
    }

    _raiseContextMenuHidden() {
        this._contextMenuHiddenAction();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            commandManager: null,
            onContextMenuHidden: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "commandManager":
                this.repaint();
                break;
            case "onContextMenuHidden":
                this._createContextMenuHiddenAction();
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
