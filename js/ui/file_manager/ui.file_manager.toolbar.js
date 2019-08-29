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
const FILE_MANAGER_TOOLBAR_HAS_LARGE_ICON_CLASS = FILE_MANAGER_TOOLBAR_CLASS + "-has-large-icon";

const DEFAULT_TOOLBAR_FILE_ITEMS = [
    {
        commandName: "download",
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    {
        commandName: "separator",
        location: "before"
    },
    {
        commandName: "move",
        location: "before",
        compactMode: {
            locateInMenu: "auto"
        }
    },
    {
        commandName: "copy",
        location: "before",
        compactMode: {
            locateInMenu: "auto"
        }
    },
    {
        commandName: "rename",
        location: "before",
        compactMode: {
            locateInMenu: "auto"
        }
    },
    {
        commandName: "separator",
        location: "before"
    },
    {
        commandName: "delete",
        location: "before",
        compactMode: {
            showText: "inMenu"
        }
    },
    {
        commandName: "refresh",
        visible: false,
        location: "after",
        showText: "inMenu",
        cssClass: FILE_MANAGER_TOOLBAR_HAS_LARGE_ICON_CLASS,
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    {
        commandName: "clear",
        location: "after",
        locateInMenu: "never",
        compactMode: {
            showText: "inMenu"
        }
    }
];

const DEFAULT_TOOLBAR_GENERAL_ITEMS = [
    {
        commandName: "showDirsPanel",
        location: "before"
    },
    {
        commandName: "create",
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    {
        commandName: "upload",
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    {
        commandName: "refresh",
        location: "after",
        showText: "inMenu",
        cssClass: FILE_MANAGER_TOOLBAR_HAS_LARGE_ICON_CLASS,
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
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

const REFRESH_ICON_MAP = {
    default: "dx-filemanager-i dx-filemanager-i-refresh",
    progress: "dx-filemanager-i dx-filemanager-i-progress",
    success: "dx-filemanager-i dx-filemanager-i-done",
    error: "dx-filemanager-i dx-filemanager-i-danger"
};

class FileManagerToolbar extends Widget {

    _initMarkup() {
        this._commandManager = this.option("commandManager");

        this._generalToolbarVisible = true;

        this._generalToolbar = this._createToolbar(DEFAULT_TOOLBAR_GENERAL_ITEMS);
        this._fileToolbar = this._createToolbar(DEFAULT_TOOLBAR_FILE_ITEMS, true);

        this.$element().addClass(FILE_MANAGER_TOOLBAR_CLASS + " " + FILE_MANAGER_GENERAL_TOOLBAR_CLASS);
    }

    _render() {
        super._render();
        const toolbar = this._getVisibleToolbar();
        this._checkCompactMode(toolbar);
    }

    _dimensionChanged(dimension) {
        if(!dimension || dimension !== "height") {
            const toolbar = this._getVisibleToolbar();
            this._checkCompactMode(toolbar);
        }
    }

    _getVisibleToolbar() {
        return this._generalToolbarVisible ? this._generalToolbar : this._fileToolbar;
    }

    _createToolbar(items, hidden) {
        const toolbarItems = this._getToolbarItems(items);
        const $toolbar = $("<div>").appendTo(this.$element());
        const result = this._createComponent($toolbar, Toolbar, {
            items: toolbarItems,
            visible: !hidden
        });
        result.compactMode = false;
        return result;
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
                preparedItem.available = this._isCommandAvailable(commandName);
                const itemVisible = preparedItem.available && ensureDefined(preparedItem.visible, true);
                preparedItem.visible = itemVisible;
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
                commandText: command.text,
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

    _checkCompactMode(toolbar) {
        if(toolbar.compactMode) {
            this._toggleCompactMode(toolbar, false);
        }

        const toolbarWidth = toolbar.$element().width();
        const itemsWidth = toolbar._getItemsWidth();
        const useCompactMode = toolbarWidth < itemsWidth;

        if(toolbar.compactMode !== useCompactMode) {
            if(!toolbar.compactMode) {
                this._toggleCompactMode(toolbar, useCompactMode);
            }
            toolbar.compactMode = useCompactMode;
        } else if(toolbar.compactMode) {
            this._toggleCompactMode(toolbar, true);
        }
    }

    _toggleCompactMode(toolbar, useCompactMode) {
        toolbar.beginUpdate();

        const items = toolbar.option("items");
        items.forEach((item, index) => {
            if(item.compactMode) {
                let optionsSource = null;

                if(useCompactMode) {
                    item.saved = this._getCompactModeOptions(item, item.available);
                    optionsSource = item.compactMode;
                } else {
                    optionsSource = item.saved;
                }

                const options = this._getCompactModeOptions(optionsSource, item.available);
                toolbar.option(`items[${index}]`, options);
            }
        });

        toolbar.endUpdate();
    }

    _getCompactModeOptions({ visible, showText, locateInMenu }, available) {
        return {
            visible: available && ensureDefined(visible, true),
            showText: ensureDefined(showText, "always"),
            locateInMenu: ensureDefined(locateInMenu, "never")
        };
    }

    _ensureAvailableCommandsVisible(toolbar, fileItems) {
        toolbar.beginUpdate();

        let groupHasItems = false;
        const items = toolbar.option("items");

        items.forEach((item, index) => {
            const itemVisible = item.available;

            let showItem = false;
            if(item.commandName === "separator") {
                showItem = groupHasItems;
                groupHasItems = false;
            } else {
                item.available = this._isCommandAvailable(item.commandName, fileItems);
                showItem = item.available;
                groupHasItems = groupHasItems || showItem;
            }

            if(showItem !== itemVisible) {
                const optionName = `items[${index}].visible`;
                toolbar.option(optionName, showItem);
            }
        });

        toolbar.endUpdate();
    }

    _fileToolbarHasEffectiveItems(fileItems) {
        const items = this._fileToolbar.option("items");
        return items.some(({ commandName }) => commandName !== "clear" && commandName !== "refresh" && this._commandManager.isCommandAvailable(commandName, fileItems));
    }

    _executeCommand(command) {
        this._commandManager.executeCommand(command);
    }

    _isCommandAvailable(commandName, fileItems) {
        return ALWAYS_VISIBLE_TOOLBAR_ITEMS.indexOf(commandName) > -1 || this._commandManager.isCommandAvailable(commandName, fileItems);
    }

    _updateItemInToolbar(toolbar, commandName, options) {
        toolbar.beginUpdate();

        const items = toolbar.option("items");
        for(let i = 0; i < items.length; i++) {
            const item = items[i];
            if(item.commandName === commandName) {
                toolbar.option(`items[${i}]`, options);
                break;
            }
        }

        toolbar.endUpdate();
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

    updateRefreshItem(message, status) {
        let generalToolbarOptions = null;
        let visibleInFileToolbar = false;

        if(status === "default") {
            generalToolbarOptions = {
                showText: "inMenu",
                options: {
                    text: "refresh",
                    icon: REFRESH_ICON_MAP.default
                }
            };
        } else {
            generalToolbarOptions = {
                showText: "always",
                options: {
                    text: message,
                    icon: REFRESH_ICON_MAP[status]
                }
            };
            visibleInFileToolbar = true;
        }

        const fileToolbarOptions = extend({ }, generalToolbarOptions, { visible: visibleInFileToolbar });

        this._updateItemInToolbar(this._generalToolbar, "refresh", generalToolbarOptions);
        this._updateItemInToolbar(this._fileToolbar, "refresh", fileToolbarOptions);
    }

    update(fileItems) {
        fileItems = ensureDefined(fileItems, []);

        const showGeneralToolbar = fileItems.length === 0 || !this._fileToolbarHasEffectiveItems(fileItems);
        if(this._generalToolbarVisible !== showGeneralToolbar) {
            this._generalToolbar.option("visible", showGeneralToolbar);
            this._fileToolbar.option("visible", !showGeneralToolbar);
            this._generalToolbarVisible = showGeneralToolbar;

            this.$element().toggleClass(FILE_MANAGER_GENERAL_TOOLBAR_CLASS, showGeneralToolbar);
            this.$element().toggleClass(FILE_MANAGER_FILE_TOOLBAR_CLASS, !showGeneralToolbar);
        }

        const toolbar = this._getVisibleToolbar();
        this._ensureAvailableCommandsVisible(toolbar, fileItems);
        this._checkCompactMode(toolbar);
    }

}

module.exports = FileManagerToolbar;
