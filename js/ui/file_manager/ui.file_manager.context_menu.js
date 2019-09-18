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

    createContextMenuItems(fileItems) {
        this._targetFileItems = fileItems;

        const result = [];

        this.option("items").map(srcItem => {
            const commandName = isString(srcItem) ? srcItem : srcItem.commandName;
            let item = this._configureItemByCommandName(commandName, srcItem);
            // if(this._isCommandAvailable(item, fileItems)) {
            //     if(isObject(srcItem)) {
            //         item = extend(true, item, srcItem);
            //     }
            // }
            result.push(item);
        });

        return result;
    }

    _isCommandAvailable(command, fileItems) {
        if(!this._isDefaultItem(command.commandName)) {
            return command.visible;
        }
        if(command.visibilityMode === "manual") {
            return command.visible;
        }
        return this._commandManager.isCommandAvailable(command.commandName, fileItems);
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

    _configureItemByCommandName(commandName, item) {
        let result = {};

        if(this._isDefaultItem(commandName)) {
            result = this._createMenuItemByCommandName(commandName);
        }

        if(this._isDefaultItem(commandName)) {
            const defaultConfig = DEFAULT_CONTEXT_MENU_ITEMS[commandName];
            extend(result, defaultConfig);
            this._extendAttributes(result, item, ["visibilityMode", "location", "locateInMenu", "text", "icon"]);
            if(result.visibilityMode === "manual") {
                this._extendAttributes(result, item, ["visible", "disabled"]);
            }
            this._extendAttributes(result.options, item, ["text", "icon"]);
        } else {
            extend(result, item);
            if(!result.widget) {
                result.widget = "dxButton";
            }
        }

        if(!result.commandName) {
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
