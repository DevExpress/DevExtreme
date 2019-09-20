import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { isString } from "../../core/utils/type";

import Widget from "../widget/ui.widget";
import ContextMenu from "../context_menu/ui.context_menu";

const FILEMANAGER_CONTEXT_MEMU_CLASS = "dx-filemanager-context-menu";

const DEFAULT_CONTEXT_MENU_ITEMS = {
    create: {},
    upload: {},
    rename: {},
    move: {},
    copy: {},
    delete: {},
    refresh: {
        beginGroup: true
    }
};

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

    createContextMenuItems(fileItems, contextMenuItems) {
        this._targetFileItems = fileItems;

        const result = [];

        const itemArray = contextMenuItems || this.option("items");
        itemArray.forEach(srcItem => {
            const commandName = isString(srcItem) ? srcItem : srcItem.commandName;
            const item = this._configureItemByCommandName(commandName, srcItem, fileItems);
            if(this._isContextMenuItemAvailable(item, fileItems)) {
                result.push(item);
            }
        });

        return result;
    }

    _isContextMenuItemAvailable(item, fileItems) {
        if(!this._isDefaultItem(item.commandName)) {
            return item.visible;
        }
        if(item.visibilityMode === "manual") {
            return item.visible;
        }
        return this._commandManager.isCommandAvailable(item.commandName, fileItems);
    }

    _isDefaultItem(commandName) {
        return !!DEFAULT_CONTEXT_MENU_ITEMS[commandName];
    }

    _extendAttributes(targetObject, sourceObject, objectKeysArray) {
        objectKeysArray.forEach(objectKey => {
            extend(targetObject, sourceObject[objectKey]
                ? { [objectKey]: sourceObject[objectKey] }
                : {});
        });
    }

    _configureItemByCommandName(commandName, item, fileItems) {
        if(!this._isDefaultItem(commandName)) {
            const res = extend(true, {}, item);
            if(Array.isArray(item.items)) {
                res.items = this.createContextMenuItems(fileItems, item.items);
            }
            return res;
        }

        let result = this._createMenuItemByCommandName(commandName);
        const defaultConfig = DEFAULT_CONTEXT_MENU_ITEMS[commandName];
        extend(result, defaultConfig);
        this._extendAttributes(result, item, ["visibilityMode", "beginGroup", "text", "icon"]);
        if(result.visibilityMode === "manual") {
            this._extendAttributes(result, item, ["visible", "disabled"]);
        }

        if(commandName && !result.commandName) {
            extend(result, { commandName });
        }

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
