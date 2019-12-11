import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { isDefined, isString } from "../../core/utils/type";
import { ensureDefined } from "../../core/utils/common";
import messageLocalization from "../../localization/message";

import Widget from "../widget/ui.widget";
import Toolbar from "../toolbar";
import "../drop_down_button";

const FILE_MANAGER_TOOLBAR_CLASS = "dx-filemanager-toolbar";
const FILE_MANAGER_GENERAL_TOOLBAR_CLASS = "dx-filemanager-general-toolbar";
const FILE_MANAGER_FILE_TOOLBAR_CLASS = "dx-filemanager-file-toolbar";
const FILE_MANAGER_TOOLBAR_SEPARATOR_ITEM_CLASS = FILE_MANAGER_TOOLBAR_CLASS + "-separator-item";
const FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS = FILE_MANAGER_TOOLBAR_CLASS + "-viewmode-item";
const FILE_MANAGER_TOOLBAR_HAS_LARGE_ICON_CLASS = FILE_MANAGER_TOOLBAR_CLASS + "-has-large-icon";
const FILE_MANAGER_VIEW_SWITCHER_POPUP_CLASS = "dx-filemanager-view-switcher-popup";

const DEFAULT_ITEM_CONFIGS = {
    showNavPane: {
        location: "before"
    },
    create: {
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    upload: {
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    refresh: {
        location: "after",
        showText: "inMenu",
        cssClass: FILE_MANAGER_TOOLBAR_HAS_LARGE_ICON_CLASS,
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    viewSwitcher: {
        location: "after"
    },
    download: {
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    move: {
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    copy: {
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    rename: {
        location: "before",
        compactMode: {
            showText: "inMenu",
            locateInMenu: "auto"
        }
    },
    delete: {
        location: "before",
        compactMode: {
            showText: "inMenu"
        }
    },
    clear: {
        location: "after",
        locateInMenu: "never",
        compactMode: {
            showText: "inMenu"
        }
    },
    separator: {
        location: "before"
    }
};

const ALWAYS_VISIBLE_TOOLBAR_ITEMS = [ "separator", "viewSwitcher" ];

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

        this._$viewSwitcherPopup = $("<div>").addClass(FILE_MANAGER_VIEW_SWITCHER_POPUP_CLASS);
        this._generalToolbar = this._createToolbar(this.option("generalItems"));
        this._fileToolbar = this._createToolbar(this.option("fileItems"), true);
        this._$viewSwitcherPopup.appendTo(this.$element());

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
        const toolbarItems = this._getPreparedItems(items);
        const $toolbar = $("<div>").appendTo(this.$element());
        const result = this._createComponent($toolbar, Toolbar, {
            items: toolbarItems,
            visible: !hidden
        });
        result.compactMode = false;
        return result;
    }

    _getPreparedItems(items) {
        let groupHasItems = false;

        return items.map(item => {
            const commandName = isString(item) ? item : item.name;
            const preparedItem = this._configureItemByCommandName(commandName, item);

            if(commandName === "separator") {
                preparedItem.visible = groupHasItems;
                groupHasItems = false;
            } else {
                preparedItem.available = this._isToolbarItemAvailable(preparedItem);
                const itemVisible = preparedItem.available;
                preparedItem.visible = itemVisible;
                groupHasItems = groupHasItems || itemVisible;
            }

            return preparedItem;
        });
    }

    _configureItemByCommandName(commandName, item) {
        let result = {};

        const command = this._commandManager.getCommandByName(commandName);
        if(command) {
            result = this._createCommandItem(command);
        }

        switch(commandName) {
            case "separator":
                result = this._createSeparatorItem();
                break;
            case "viewSwitcher":
                result = this._createViewModeItem();
                break;
        }

        if(this._isDefaultItem(commandName)) {
            const defaultConfig = DEFAULT_ITEM_CONFIGS[commandName];
            extend(result, defaultConfig);
            this._extendAttributes(result, item, ["visible", "location", "locateInMenu"]);

            if(!isDefined(item.visible)) {
                result._autoHide = true;
            } else {
                this._extendAttributes(result, item, ["disabled"]);
            }

            this._extendAttributes(result.options, item, ["text", "icon"]);
        } else {
            extend(result, item);
            if(!result.widget) {
                result.widget = "dxButton";
            }
        }

        if(commandName && !result.name) {
            extend(result, { name: commandName });
        }

        if(result.widget === "dxButton") {
            extend(true, result, { options: { stylingMode: "text" } });
        }

        if(result.widget === "dxSelectBox") {
            extend(true, result, { options: { stylingMode: "filled" } });
        }

        return result;
    }

    _extendAttributes(targetObject, sourceObject, objectKeysArray) {
        objectKeysArray.forEach(objectKey => {
            extend(targetObject, sourceObject[objectKey]
                ? { [objectKey]: sourceObject[objectKey] }
                : {});
        });
    }

    _isDefaultItem(commandName) {
        return !!DEFAULT_ITEM_CONFIGS[commandName];
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
        const commandItems = ["details", "thumbnails"].map(name => {
            const { text, icon } = this._commandManager.getCommandByName(name);
            return { name, text, icon };
        });

        const selectedIndex = this.option("itemViewMode") === "thumbnails" ? 1 : 0;

        return {
            cssClass: FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS,
            widget: "dxDropDownButton",
            options: {
                items: commandItems,
                keyExpr: "name",
                selectedItemKey: this.option("itemViewMode"),
                displayExpr: " ",
                hint: commandItems[selectedIndex].text,
                stylingMode: "text",
                showArrowIcon: false,
                useSelectMode: true,
                dropDownOptions: {
                    container: this._$viewSwitcherPopup
                },
                onItemClick: e => this._executeCommand(e.itemData.name)
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
                    item.saved = this._getCompactModeOptions(item, item.available); // TODO use private name
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

    _getCompactModeOptions({ showText, locateInMenu }, available) {
        return {
            visible: available,
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
            if(item.name === "separator") {
                showItem = groupHasItems;
                groupHasItems = false;
            } else {
                item.available = this._isToolbarItemAvailable(item, fileItems);
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
        return items.some(({ name }) => name !== "clear" && name !== "refresh" && this._commandManager.isCommandAvailable(name, fileItems));
    }

    _executeCommand(command) {
        this._commandManager.executeCommand(command);
    }

    _isToolbarItemAvailable(toolbarItem, fileItems) {
        if(!this._isDefaultItem(toolbarItem.name) || !toolbarItem._autoHide) {
            return ensureDefined(toolbarItem.visible, true);
        }
        if(toolbarItem.name === "refresh") {
            return this._generalToolbarVisible || !!this._isRefreshVisibleInFileToolbar;
        }

        if(ALWAYS_VISIBLE_TOOLBAR_ITEMS.indexOf(toolbarItem.name) > -1) {
            return true;
        }

        return this._commandManager.isCommandAvailable(toolbarItem.name, fileItems);
    }

    _updateItemInToolbar(toolbar, commandName, options) {
        toolbar.beginUpdate();

        const items = toolbar.option("items");
        for(let i = 0; i < items.length; i++) {
            const item = items[i];
            if(item.name === commandName) {
                toolbar.option(`items[${i}]`, options);
                break;
            }
        }

        toolbar.endUpdate();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            commandManager: null,
            generalItems: [],
            fileItems: [],
            itemViewMode: "details"
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "commandManager":
            case "itemViewMode":
            case "generalItems":
            case "fileItems":
                this.repaint();
                break;
            default:
                super._optionChanged(args);
        }
    }

    updateRefreshItem(message, status) {
        let generalToolbarOptions = null;
        this._isRefreshVisibleInFileToolbar = false;

        if(status === "default") {
            generalToolbarOptions = {
                showText: "inMenu",
                options: {
                    text: messageLocalization.format("dxFileManager-commandRefresh"),
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
            this._isRefreshVisibleInFileToolbar = true;
        }

        const fileToolbarOptions = extend({ }, generalToolbarOptions, { visible: this._isRefreshVisibleInFileToolbar });

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
