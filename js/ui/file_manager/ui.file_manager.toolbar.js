import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { isObject, isString } from "../../core/utils/type";
import { ensureDefined } from "../../core/utils/common";

import Widget from "../widget/ui.widget";
import Toolbar from "../toolbar";

const FILE_MANAGER_TOOLBAR_CLASS = "dx-filemanager-toolbar";
const FILE_MANAGER_GENERAL_TOOLBAR_CLASS = "dx-filemanager-general-toolbar";
const FILE_MANAGER_FILE_TOOLBAR_CLASS = "dx-filemanager-file-toolbar";
const FILE_MANAGER_TOOLBAR_SEPARATOR_ITEM_CLASS = FILE_MANAGER_TOOLBAR_CLASS + "-separator-item";
const FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS = FILE_MANAGER_TOOLBAR_CLASS + "-viewmode-item";

const DEFAULT_TOOLBAR_FILE_ITEMS = [
    {
        commandName: "download",
        location: "before"
    },
    {
        commandName: "separator",
        location: "before"
    },
    {
        commandName: "move",
        location: "before"
    },
    {
        commandName: "copy",
        location: "before"
    },
    {
        commandName: "rename",
        location: "before"
    },
    {
        commandName: "separator",
        location: "before"
    },
    {
        commandName: "delete",
        location: "before"
    },
    {
        commandName: "clear",
        location: "after"
    }
];

const DEFAULT_TOOLBAR_GENERAL_ITEMS = [
    {
        commandName: "create",
        location: "before"
    },
    {
        commandName: "upload",
        location: "before"
    },
    {
        commandName: "refresh",
        location: "after",
        showText: "inMenu"
    },
    {
        commandName: "separator",
        location: "after"
    },
    {
        commandName: "viewMode",
        location: "after"
    }
];

const ALWAYS_VISIBLE_TOOLBAR_ITEMS = [ "separator", "viewMode" ];

class FileManagerToolbar extends Widget {

    _initMarkup() {
        this._commandManager = this.option("commandManager");

        this._generalToolbarVisible = true;

        const generalToolbarItems = this._getGeneralToolbarDefaultItems();
        this._generalToolbar = this._createToolbar(generalToolbarItems);

        const fileToolbarItems = this._getFileToolbarDefaultItems();
        this._fileToolbar = this._createToolbar(fileToolbarItems, true);

        this.$element().addClass(FILE_MANAGER_TOOLBAR_CLASS + " " + FILE_MANAGER_GENERAL_TOOLBAR_CLASS);
    }

    _createToolbar(items, hidden) {
        const toolbarItems = this._getToolbarItems(items);
        const $toolbar = $("<div>").appendTo(this.$element());
        return this._createComponent($toolbar, Toolbar, {
            items: toolbarItems,
            visible: !hidden
        });
    }

    _getToolbarItems(items) {
        let groupHasItems = false;

        return items.map(item => {
            const commandName = isString(item) ? item : item.commandName;
            const config = this._getItemConfigByCommandName(commandName);

            if(!isObject(item)) {
                item = { commandName };
            }

            const preparedItem = extend(true, config, item);

            if(commandName === "separator") {
                preparedItem.visible = groupHasItems;
                groupHasItems = false;
            } else {
                const itemVisible = ensureDefined(preparedItem.visible, true);
                groupHasItems = groupHasItems || itemVisible;
            }

            return preparedItem;
        });
    }

    _getItemConfigByCommandName(commandName) {
        const command = this._commandManager.getCommandByName(commandName);
        if(command) {
            return this._createCommandItem(command);
        }

        switch(commandName) {
            case "separator":
                return this._createSeparatorItem();
            case "viewMode":
                return this._createViewModeItem();
        }

        return {};
    }

    _createCommandItem(command) {
        return {
            widget: "dxButton",
            options: {
                text: command.text,
                icon: command.icon,
                stylingMode: "text",
                onClick: e => this._executeCommand(command)
            }
        };
    }

    _createSeparatorItem() {
        return {
            template: (data, index, element) => {
                $(element).addClass(FILE_MANAGER_TOOLBAR_SEPARATOR_ITEM_CLASS);
            }
        };
    }

    _createViewModeItem() {
        const commandItems = ["thumbnails", "details"].map(name => {
            const { text } = this._commandManager.getCommandByName(name);
            return { name, text };
        });

        const selectedIndex = this.option("itemViewMode") === "thumbnails" ? 0 : 1;

        return {
            cssClass: FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS,
            widget: "dxSelectBox",
            options: {
                items: commandItems,
                value: commandItems[selectedIndex],
                displayExpr: "text",
                stylingMode: "filled",
                onValueChanged: e => this._executeCommand(e.value.name)
            }
        };
    }

    _getFileToolbarDefaultItems() {
        return DEFAULT_TOOLBAR_FILE_ITEMS;
    }

    _getGeneralToolbarDefaultItems() {
        return DEFAULT_TOOLBAR_GENERAL_ITEMS.filter(item => this._isCommandAvailable(item.commandName));
    }

    _updateFileToolbar(fileItems) {
        let groupHasItems = false;
        const items = this._fileToolbar.option("items");

        items.forEach(({ visible, commandName }, index) => {
            const itemVisible = ensureDefined(visible, true);

            let showItem = false;
            if(commandName === "separator") {
                showItem = groupHasItems;
                groupHasItems = false;
            } else {
                showItem = this._isCommandAvailable(commandName, fileItems);
                groupHasItems = groupHasItems || showItem;
            }

            if(showItem !== itemVisible) {
                const optionName = `items[${index}].visible`;
                this._fileToolbar.option(optionName, showItem);
            }
        });
    }

    _fileToolbarHasEffectiveItems() {
        const items = this._fileToolbar.option("items");
        return items.some(item => item.commandName !== "clear" && ensureDefined(item.visible, true));
    }

    _executeCommand(command) {
        this._commandManager.executeCommand(command);
    }

    _isCommandAvailable(commandName, fileItems) {
        return ALWAYS_VISIBLE_TOOLBAR_ITEMS.indexOf(commandName) > -1 || this._commandManager.isCommandAvailable(commandName, fileItems);
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            commandManager: null,
            itemViewMode: "details"
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "commandManager":
            case "itemViewMode":
                this.repaint();
                break;
            default:
                super._optionChanged(args);
        }
    }

    update(fileItems) {
        fileItems = ensureDefined(fileItems, []);

        this._updateFileToolbar(fileItems);

        const showGeneralToolbar = fileItems.length === 0 || !this._fileToolbarHasEffectiveItems();
        if(this._generalToolbarVisible !== showGeneralToolbar) {
            this._generalToolbar.option("visible", showGeneralToolbar);
            this._fileToolbar.option("visible", !showGeneralToolbar);
            this._generalToolbarVisible = showGeneralToolbar;

            this.$element().toggleClass(FILE_MANAGER_GENERAL_TOOLBAR_CLASS, showGeneralToolbar);
            this.$element().toggleClass(FILE_MANAGER_FILE_TOOLBAR_CLASS, !showGeneralToolbar);
        }
    }

}

module.exports = FileManagerToolbar;
