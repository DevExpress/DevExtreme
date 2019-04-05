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
        const $generalToolbar = $("<div>").appendTo(this.$element());
        return this._createComponent($generalToolbar, Toolbar, {
            items: toolbarItems,
            visible: !hidden
        });
    }

    _getToolbarItems(items) {
        return items.map(item => {
            const commandName = isString(item) ? item : item.commandName;
            const config = this._getItemConfigByCommandName(commandName);

            if(!isObject(item)) {
                item = { commandName };
            }

            return extend(true, config, item);
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

        const selectedIndex = this.option("itemListViewMode") === "thumbnails" ? 0 : 1;

        return {
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
        return [
            {
                commandName: "download",
                location: "before"
            },
            {
                commandName: "delete",
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
            }
        ];
    }

    _getGeneralToolbarDefaultItems() {
        return [
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
    }

    _updateFileToolbar(fileItems) {
        const items = this._fileToolbar.option("items");
        items.forEach(({ visible, commandName }, index) => {
            const itemVisible = ensureDefined(visible, true);
            const showItem = this._commandManager.isCommandAvailable(commandName, fileItems);
            if(showItem !== itemVisible) {
                const optionName = `items[${index}].visible`;
                this._fileToolbar.option(optionName, showItem);
            }
        });
    }

    _executeCommand(command) {
        this._commandManager.executeCommand(command);
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            commandManager: null,
            itemListViewMode: "details"
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "commandManager":
            case "itemListViewMode":
                this.repaint();
                break;
            default:
                super._optionChanged(args);
        }
    }

    update(fileItems) {
        fileItems = ensureDefined(fileItems, []);
        const showGeneralToolbar = fileItems.length === 0;

        if(this._generalToolbarVisible !== showGeneralToolbar) {
            this._generalToolbar.option("visible", showGeneralToolbar);
            this._fileToolbar.option("visible", !showGeneralToolbar);
            this._generalToolbarVisible = showGeneralToolbar;

            this.$element().toggleClass(FILE_MANAGER_GENERAL_TOOLBAR_CLASS, showGeneralToolbar);
            this.$element().toggleClass(FILE_MANAGER_FILE_TOOLBAR_CLASS, !showGeneralToolbar);
        }

        if(!showGeneralToolbar) {
            this._updateFileToolbar(fileItems);
        }
    }

}

module.exports = FileManagerToolbar;
