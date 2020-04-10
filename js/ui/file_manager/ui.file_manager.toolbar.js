import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { isDefined, isString } from '../../core/utils/type';
import { ensureDefined } from '../../core/utils/common';
import messageLocalization from '../../localization/message';
import { extendAttributes } from './ui.file_manager.common';

import Widget from '../widget/ui.widget';
import Toolbar from '../toolbar';
import '../drop_down_button';

const FILE_MANAGER_TOOLBAR_CLASS = 'dx-filemanager-toolbar';
const FILE_MANAGER_GENERAL_TOOLBAR_CLASS = 'dx-filemanager-general-toolbar';
const FILE_MANAGER_FILE_TOOLBAR_CLASS = 'dx-filemanager-file-toolbar';
const FILE_MANAGER_TOOLBAR_SEPARATOR_ITEM_CLASS = FILE_MANAGER_TOOLBAR_CLASS + '-separator-item';
const FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS = FILE_MANAGER_TOOLBAR_CLASS + '-viewmode-item';
const FILE_MANAGER_TOOLBAR_HAS_LARGE_ICON_CLASS = FILE_MANAGER_TOOLBAR_CLASS + '-has-large-icon';
const FILE_MANAGER_VIEW_SWITCHER_POPUP_CLASS = 'dx-filemanager-view-switcher-popup';

const DEFAULT_ITEM_CONFIGS = {
    showNavPane: {
        location: 'before'
    },
    create: {
        location: 'before',
        compactMode: {
            showText: 'inMenu',
            locateInMenu: 'auto'
        }
    },
    upload: {
        location: 'before',
        compactMode: {
            showText: 'inMenu',
            locateInMenu: 'auto'
        }
    },
    refresh: {
        location: 'after',
        showText: 'inMenu',
        cssClass: FILE_MANAGER_TOOLBAR_HAS_LARGE_ICON_CLASS,
        compactMode: {
            showText: 'inMenu',
            locateInMenu: 'auto'
        }
    },
    switchView: {
        location: 'after'
    },
    download: {
        location: 'before',
        compactMode: {
            showText: 'inMenu',
            locateInMenu: 'auto'
        }
    },
    move: {
        location: 'before',
        compactMode: {
            showText: 'inMenu',
            locateInMenu: 'auto'
        }
    },
    copy: {
        location: 'before',
        compactMode: {
            showText: 'inMenu',
            locateInMenu: 'auto'
        }
    },
    rename: {
        location: 'before',
        compactMode: {
            showText: 'inMenu',
            locateInMenu: 'auto'
        }
    },
    delete: {
        location: 'before',
        compactMode: {
            showText: 'inMenu'
        }
    },
    clearSelection: {
        location: 'after',
        locateInMenu: 'never',
        compactMode: {
            showText: 'inMenu'
        }
    },
    separator: {
        location: 'before'
    }
};

const ALWAYS_VISIBLE_TOOLBAR_ITEMS = [ 'separator', 'switchView' ];

const REFRESH_ICON_MAP = {
    default: 'dx-filemanager-i dx-filemanager-i-refresh',
    progress: 'dx-filemanager-i dx-filemanager-i-progress',
    success: 'dx-filemanager-i dx-filemanager-i-done',
    error: 'dx-filemanager-i dx-filemanager-i-danger'
};

const REFRESH_ITEM_PROGRESS_MESSAGE_DELAY = 500;

class FileManagerToolbar extends Widget {

    _initMarkup() {
        this._commandManager = this.option('commandManager');
        this._createItemClickedAction();

        this._generalToolbarVisible = true;

        this._$viewSwitcherPopup = $('<div>').addClass(FILE_MANAGER_VIEW_SWITCHER_POPUP_CLASS);
        this._generalToolbar = this._createToolbar(this.option('generalItems'));
        this._fileToolbar = this._createToolbar(this.option('fileItems'), true);
        this._$viewSwitcherPopup.appendTo(this.$element());

        this.$element().addClass(FILE_MANAGER_TOOLBAR_CLASS + ' ' + FILE_MANAGER_GENERAL_TOOLBAR_CLASS);
    }

    _render() {
        super._render();
        const toolbar = this._getVisibleToolbar();
        this._checkCompactMode(toolbar);
    }

    _dimensionChanged(dimension) {
        if(!dimension || dimension !== 'height') {
            const toolbar = this._getVisibleToolbar();
            this._checkCompactMode(toolbar);
        }
    }

    _getVisibleToolbar() {
        return this._generalToolbarVisible ? this._generalToolbar : this._fileToolbar;
    }

    _createToolbar(items, hidden) {
        const toolbarItems = this._getPreparedItems(items);
        const $toolbar = $('<div>').appendTo(this.$element());
        const result = this._createComponent($toolbar, Toolbar, {
            items: toolbarItems,
            visible: !hidden,
            onItemClick: (args) => this._raiseItemClicked(args)
        });
        result.compactMode = false;
        return result;
    }

    _getPreparedItems(items) {
        items = items.map(item => {
            let extendedItem = item;
            if(isString(item)) {
                extendedItem = { name: item };
            }
            const commandName = extendedItem.name;
            const preparedItem = this._configureItemByCommandName(commandName, extendedItem);
            preparedItem.originalItemData = item;

            if(commandName !== 'separator') {
                preparedItem.available = this._isToolbarItemAvailable(preparedItem);
                const itemVisible = preparedItem.available;
                preparedItem.visible = itemVisible;
            }

            return preparedItem;
        });
        return this._updateSeparatorsVisibility(items);
    }

    _updateSeparatorsVisibility(items, toolbar) {
        const hasItems = {
            before: false,
            center: false,
            after: false
        };
        const itemGroups = {
            before: items.filter(item => this._getItemLocation(item) === 'before'),
            center: items.filter(item => this._getItemLocation(item) === 'center'),
            after: items.filter(item => this._getItemLocation(item) === 'after')
        };
        for(let i = 0; i < items.length; i++) {
            const itemLocation = this._getItemLocation(items[i]);
            if(items[i].name === 'separator') {
                const isSeparatorVisible = hasItems[itemLocation] && this._groupHasItems(itemGroups[itemLocation]);
                if(toolbar) {
                    const optionName = `items[${i}].visible`;
                    toolbar.option(optionName, isSeparatorVisible);
                } else {
                    items[i].visible = isSeparatorVisible;
                }
                hasItems[itemLocation] = false;
            } else {
                hasItems[itemLocation] = hasItems[itemLocation] || items[i].visible;
            }
            itemGroups[itemLocation].shift();
        }
        return items;
    }

    _groupHasItems(items) {
        let i = 1;
        while(items[i]) {
            if(items[i].name !== 'separator' && items[i].visible) {
                return true;
            }
            i++;
        }
        return false;
    }

    _getItemLocation(toolbarItem) {
        return ensureDefined(toolbarItem.location, 'before');
    }

    _configureItemByCommandName(commandName, item) {
        let result = {};

        const command = this._commandManager.getCommandByName(commandName);
        if(command) {
            result = this._createCommandItem(command);
        }

        switch(commandName) {
            case 'separator':
                result = this._createSeparatorItem();
                break;
            case 'switchView':
                result = this._createViewModeItem();
                break;
        }

        if(this._isDefaultItem(commandName)) {
            const defaultConfig = DEFAULT_ITEM_CONFIGS[commandName];
            extend(true, result, defaultConfig);
            extendAttributes(result, item, ['visible', 'location', 'locateInMenu']);

            if(!isDefined(item.visible)) {
                result._autoHide = true;
            } else {
                extendAttributes(result, item, ['disabled']);
            }

            extendAttributes(result.options, item, ['text', 'icon']);
        } else {
            extend(true, result, item);
            if(!result.widget) {
                result.widget = 'dxButton';
            }
        }

        if(commandName && !result.name) {
            extend(result, { name: commandName });
        }

        if(result.widget === 'dxButton') {
            extend(true, result, { options: { stylingMode: 'text' } });
        }

        if(result.widget === 'dxSelectBox') {
            extend(true, result, { options: { stylingMode: 'filled' } });
        }

        return result;
    }

    _isDefaultItem(commandName) {
        return !!DEFAULT_ITEM_CONFIGS[commandName];
    }

    _createCommandItem(command) {
        return {
            widget: 'dxButton',
            options: {
                text: command.text,
                commandText: command.text,
                icon: command.icon,
                stylingMode: 'text',
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
        const commandItems = ['details', 'thumbnails'].map(name => {
            const { text, icon } = this._commandManager.getCommandByName(name);
            return { name, text, icon };
        });

        const selectedIndex = this.option('itemViewMode') === 'thumbnails' ? 1 : 0;

        return {
            cssClass: FILE_MANAGER_TOOLBAR_VIEWMODE_ITEM_CLASS,
            widget: 'dxDropDownButton',
            options: {
                items: commandItems,
                keyExpr: 'name',
                selectedItemKey: this.option('itemViewMode'),
                displayExpr: ' ',
                hint: commandItems[selectedIndex].text,
                stylingMode: 'text',
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

        const items = toolbar.option('items');
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
            showText: ensureDefined(showText, 'always'),
            locateInMenu: ensureDefined(locateInMenu, 'never')
        };
    }

    _ensureAvailableCommandsVisible(toolbar, fileItems) {
        toolbar.beginUpdate();

        const items = toolbar.option('items');

        items.forEach((item, index) => {
            if(item.name !== 'separator') {
                const itemVisible = item.available;
                item.available = this._isToolbarItemAvailable(item, fileItems);
                if(item.available !== itemVisible) {
                    const optionName = `items[${index}].visible`;
                    toolbar.option(optionName, item.available);
                }
            }
        });

        this._updateSeparatorsVisibility(toolbar.option('items'), toolbar);
        toolbar.endUpdate();
    }

    _fileToolbarHasEffectiveItems(fileItems) {
        const items = this._fileToolbar.option('items');
        return items.some(item => this._isFileToolbarItemAvailable(item, fileItems));
    }

    _executeCommand(command) {
        this._commandManager.executeCommand(command);
    }

    _isToolbarItemAvailable(toolbarItem, fileItems) {
        if(!this._isDefaultItem(toolbarItem.name) || !toolbarItem._autoHide) {
            return ensureDefined(toolbarItem.visible, true);
        }
        if(toolbarItem.name === 'refresh') {
            return this._generalToolbarVisible || !!this._isRefreshVisibleInFileToolbar;
        }

        if(ALWAYS_VISIBLE_TOOLBAR_ITEMS.indexOf(toolbarItem.name) > -1) {
            return true;
        }

        return this._commandManager.isCommandAvailable(toolbarItem.name, fileItems);
    }

    _isFileToolbarItemAvailable({ name, visible }, fileItems) {
        return !this._isDefaultItem(name) && ensureDefined(visible, true) ||
            name !== 'clearSelection' && name !== 'refresh' && this._commandManager.isCommandAvailable(name, fileItems);
    }

    _updateItemInToolbar(toolbar, commandName, options) {
        toolbar.beginUpdate();

        const items = toolbar.option('items');
        for(let i = 0; i < items.length; i++) {
            const item = items[i];
            if(item.name === commandName) {
                toolbar.option(`items[${i}]`, options);
                break;
            }
        }

        toolbar.endUpdate();
    }

    _raiseItemClicked(args) {
        const changedArgs = extend(true, {}, args);
        changedArgs.itemData = args.itemData.originalItemData;
        this._itemClickedAction(changedArgs);
    }

    _createItemClickedAction() {
        this._itemClickedAction = this._createActionByOption('onItemClick');
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            commandManager: null,
            generalItems: [],
            fileItems: [],
            itemViewMode: 'details',
            onItemClick: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'commandManager':
            case 'itemViewMode':
            case 'generalItems':
            case 'fileItems':
                this.repaint();
                break;
            case 'onItemClick':
                this._itemClickedAction = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

    updateRefreshItem(message, status) {
        let generalToolbarOptions = null;
        let text = messageLocalization.format('dxFileManager-commandRefresh');
        let showText = 'inMenu';

        this._isRefreshVisibleInFileToolbar = false;

        if(status === 'default') {
            generalToolbarOptions = {
                options: {
                    icon: REFRESH_ICON_MAP.default
                }
            };
        } else {
            generalToolbarOptions = {
                options: {
                    icon: REFRESH_ICON_MAP[status]
                }
            };
            this._isRefreshVisibleInFileToolbar = true;
            text = message;
            showText = 'always';
        }

        const fileToolbarOptions = extend({ }, generalToolbarOptions, { visible: this._isRefreshVisibleInFileToolbar });
        this._applyRefreshItemOptions(generalToolbarOptions, fileToolbarOptions);
        this._refreshItemTextTimeout = this._updateRefreshItemText(status === 'progress', text, showText);
    }

    _updateRefreshItemText(isDeferredUpdate, text, showText) {
        const options = {
            showText,
            options: {
                text
            }
        };
        if(isDeferredUpdate) {
            return setTimeout(() => {
                this._applyRefreshItemOptions(options);
                this._refreshItemTextTimeout = undefined;
            }, REFRESH_ITEM_PROGRESS_MESSAGE_DELAY);
        } else {
            if(this._refreshItemTextTimeout) {
                clearTimeout(this._refreshItemTextTimeout);
            }
            this._applyRefreshItemOptions(options);
            return undefined;
        }
    }

    _applyRefreshItemOptions(generalToolbarOptions, fileToolbarOptions) {
        if(!fileToolbarOptions) {
            fileToolbarOptions = extend({}, generalToolbarOptions);
        }
        this._updateItemInToolbar(this._generalToolbar, 'refresh', generalToolbarOptions);
        this._updateItemInToolbar(this._fileToolbar, 'refresh', fileToolbarOptions);
    }

    update(fileItems) {
        fileItems = ensureDefined(fileItems, []);

        const showGeneralToolbar = fileItems.length === 0 || !this._fileToolbarHasEffectiveItems(fileItems);
        if(this._generalToolbarVisible !== showGeneralToolbar) {
            this._generalToolbar.option('visible', showGeneralToolbar);
            this._fileToolbar.option('visible', !showGeneralToolbar);
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
