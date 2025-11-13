import { getWidth } from '../../core/utils/size';
import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { isDefined, isString } from '../../core/utils/type';
import { ensureDefined } from '../../core/utils/common';
import messageLocalization from '../../common/core/localization/message';
import { extendAttributes } from './ui.file_manager.common';
import { isCompact, isFluent, isMaterial } from '../themes';

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

const DEFAULT_ITEM_ALLOWED_PROPERTIES = [
    'visible',
    'location',
    'locateInMenu',
    'disabled',
    'showText'
];

const DEFAULT_ITEM_ALLOWED_OPTION_PROPERTIES = [
    'accessKey',
    'elementAttr',
    'height',
    'hint',
    'icon',
    'stylingMode',
    'tabIndex',
    'text',
    'width'
];

const ALWAYS_VISIBLE_TOOLBAR_ITEMS = [ 'separator', 'switchView' ];

const REFRESH_ICON_MAP = {
    default: 'dx-filemanager-i dx-filemanager-i-refresh',
    progress: 'dx-filemanager-i dx-filemanager-i-progress',
    success: 'dx-filemanager-i dx-filemanager-i-done',
    error: 'dx-filemanager-i dx-filemanager-i-danger'
};

const REFRESH_ITEM_PROGRESS_MESSAGE_DELAY = 500;

class FileManagerToolbar extends Widget {

    _init() {
        super._init();
        this._generalToolbarVisible = true;
        this._refreshItemState = {
            message: '',
            status: 'default'
        };
    }

    _initMarkup() {
        this._createItemClickedAction();

        this._$viewSwitcherPopup = $('<div>').addClass(FILE_MANAGER_VIEW_SWITCHER_POPUP_CLASS);
        this._generalToolbar = this._createToolbar(this.option('generalItems'), !this._generalToolbarVisible);
        this._fileToolbar = this._createToolbar(this.option('fileItems'), this._generalToolbarVisible);
        this._$viewSwitcherPopup.appendTo(this.$element());

        this.$element().addClass(FILE_MANAGER_TOOLBAR_CLASS + ' ' + FILE_MANAGER_GENERAL_TOOLBAR_CLASS);
    }

    _render() {
        super._render();
        const toolbar = this._getVisibleToolbar();
        this._checkCompactMode(toolbar);
    }

    _clean() {
        delete this._commandManager;
        delete this._itemClickedAction;
        delete this._$viewSwitcherPopup;
        delete this._generalToolbar;
        delete this._fileToolbar;
        super._clean();
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
                this._setItemVisibleAvailable(preparedItem);
            }

            return preparedItem;
        });
        this._updateSeparatorsVisibility(items);
        return items;
    }

    _updateSeparatorsVisibility(items, toolbar) {
        let hasModifications = false;
        const menuItems = this._getMenuItems(toolbar);
        const hasItemsBefore = {
            before: false,
            center: false,
            after: false
        };
        const itemGroups = {
            before: this._getItemsInGroup(items, menuItems, 'before'),
            center: this._getItemsInGroup(items, menuItems, 'center'),
            after: this._getItemsInGroup(items, menuItems, 'after')
        };
        items.forEach((item, i) => {
            const itemLocation = item.location;
            if(item.name === 'separator') {
                const isSeparatorVisible = hasItemsBefore[itemLocation] && this._groupHasItemsAfter(itemGroups[itemLocation]);
                if(item.visible !== isSeparatorVisible) {
                    hasModifications = true;
                    item.visible = isSeparatorVisible;
                }
                hasItemsBefore[itemLocation] = false;
            } else {
                if(!this._isItemInMenu(menuItems, item)) {
                    hasItemsBefore[itemLocation] = hasItemsBefore[itemLocation] || item.visible;
                }
                itemGroups[itemLocation].shift();
            }
        });

        if(toolbar && hasModifications) {
            toolbar.repaint();
        }
        return hasModifications;
    }

    _getMenuItems(toolbar) {
        const result = toolbar ? toolbar._getMenuItems() : [];
        return result.map(menuItem => menuItem.originalItemData);
    }

    _isItemInMenu(menuItems, item) {
        return !!menuItems.length
            && ensureDefined(item.locateInMenu, 'never') !== 'never'
            && menuItems.indexOf(item.originalItemData) !== -1;
    }

    _getItemsInGroup(items, menuItems, groupName) {
        return items.filter(item => item.location === groupName && !this._isItemInMenu(menuItems, item));
    }

    _groupHasItemsAfter(items) {
        for(let i = 0; i < items.length; i++) {
            if(items[i].name !== 'separator' && items[i].visible) {
                return true;
            }
        }
        return false;
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
            let resultCssClass = result.cssClass || '';
            extendAttributes(result, item, DEFAULT_ITEM_ALLOWED_PROPERTIES);
            if(isDefined(item.options)) {
                extendAttributes(result.options, item.options, DEFAULT_ITEM_ALLOWED_OPTION_PROPERTIES);
            }
            extendAttributes(result.options, item, ['text', 'icon']);

            if(item.cssClass) {
                resultCssClass = `${resultCssClass} ${item.cssClass}`;
            }

            if(resultCssClass) {
                result.cssClass = resultCssClass;
            }

            if(!isDefined(item.visible)) {
                result._autoHide = true;
            }

            if(result.widget === 'dxButton') {
                if(result.showText === 'inMenu' && !isDefined(result.options.hint)) {
                    result.options.hint = result.options.text;
                }

                if(result.compactMode && !isDefined(result.options.hint)) {
                    this._configureHintForCompactMode(result);
                }
            }
        } else {
            extend(true, result, item);
            if(!result.widget) {
                result.widget = 'dxButton';
            }
            if(result.widget === 'dxButton' && !result.compactMode && !result.showText && result.options && result.options.icon && result.options.text) {
                result.compactMode = {
                    showText: 'inMenu'
                };
            }
        }

        if(commandName && !result.name) {
            extend(result, { name: commandName });
        }

        result.location = ensureDefined(result.location, 'before');

        if(!isDefined(result.options?.stylingMode)) {
            if(result.widget === 'dxButton') {
                extend(true, result, { options: { stylingMode: 'text' } });
            }
            if(result.widget === 'dxSelectBox') {
                extend(true, result, { options: { stylingMode: 'filled' } });
            }
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
                hint: command.hint,
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
        const dropDownOptions = {
            container: this._$viewSwitcherPopup
        };

        if(isMaterial()) {
            dropDownOptions.width = isCompact() ? 28 : 36;
        } else if(isFluent()) {
            dropDownOptions.width = isCompact() ? 34 : 40;
        }

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
                dropDownOptions,
                onItemClick: e => this._executeCommand(e.itemData.name)
            }
        };
    }

    _configureHintForCompactMode(item) {
        item.options.hint = '';
        item.compactMode.options = item.compactMode.options || {};
        item.compactMode.options.hint = item.options.text;
    }

    _checkCompactMode(toolbar) {
        if(toolbar.compactMode) {
            this._toggleCompactMode(toolbar, false);
        }

        const useCompactMode = this._toolbarHasItemsOverflow(toolbar);

        if(toolbar.compactMode !== useCompactMode) {
            if(!toolbar.compactMode) {
                this._toggleCompactMode(toolbar, useCompactMode);
            }
            toolbar.compactMode = useCompactMode;
        } else if(toolbar.compactMode) {
            this._toggleCompactMode(toolbar, true);
        }
    }

    _toolbarHasItemsOverflow(toolbar) {
        const toolbarWidth = getWidth(toolbar.$element());
        const itemsWidth = toolbar._getItemsWidth();
        return toolbarWidth < itemsWidth;
    }

    _toggleCompactMode(toolbar, useCompactMode) {
        let hasModifications = false;
        const items = toolbar.option('items');

        items.forEach(item => {
            if(item.compactMode) {
                let optionsSource = null;

                if(useCompactMode) {
                    item.saved = this._getCompactModeOptions(item, item._available);
                    optionsSource = item.compactMode;
                } else {
                    optionsSource = item.saved;
                }

                const options = this._getCompactModeOptions(optionsSource, item._available);
                extend(true, item, options);
                hasModifications = true;
            }
        });

        hasModifications = this._updateSeparatorsVisibility(items) || hasModifications;
        if(hasModifications) {
            toolbar.repaint();
        }

        this._updateSeparatorsVisibility(items, toolbar);
    }

    _getCompactModeOptions({ showText, locateInMenu, options }, available) {
        return {
            visible: available,
            showText: ensureDefined(showText, 'always'),
            locateInMenu: ensureDefined(locateInMenu, 'never'),
            options: {
                hint: options?.hint
            }
        };
    }

    _ensureAvailableCommandsVisible(toolbar) {
        let hasModifications = false;
        const items = toolbar.option('items');

        items.forEach(item => {
            if(item.name !== 'separator') {
                const itemVisible = item._available;
                this._setItemVisibleAvailable(item);
                if(item._available !== itemVisible) {
                    hasModifications = true;
                }
            }
        });

        hasModifications = this._updateSeparatorsVisibility(items) || hasModifications;
        if(hasModifications) {
            toolbar.repaint();
        }

        this._updateSeparatorsVisibility(items, toolbar);
    }

    _setItemVisibleAvailable(item) {
        const originalVisible = item.originalItemData?.visible;
        item._available = this._isToolbarItemAvailable(item);
        item.visible = isDefined(originalVisible) ? originalVisible : item._available;
    }

    _fileToolbarHasEffectiveItems() {
        const items = this._fileToolbar.option('items');
        return items.some(item => this._isFileToolbarItemAvailable(item));
    }

    _executeCommand(command) {
        this._commandManager.executeCommand(command);
    }

    _isToolbarItemAvailable(toolbarItem) {
        if(!this._isDefaultItem(toolbarItem.name) || !toolbarItem._autoHide) {
            return ensureDefined(toolbarItem.visible, true);
        }
        if(toolbarItem.name === 'refresh') {
            return this._generalToolbarVisible || !!this._isRefreshVisibleInFileToolbar;
        }

        if(ALWAYS_VISIBLE_TOOLBAR_ITEMS.indexOf(toolbarItem.name) > -1) {
            return true;
        }

        return this._isCommandAvailable(toolbarItem.name);
    }

    _isFileToolbarItemAvailable({ name, visible }) {
        return !this._isDefaultItem(name) && ensureDefined(visible, true) ||
            name !== 'clearSelection' && name !== 'refresh' && this._isCommandAvailable(name);
    }

    _isCommandAvailable(name) {
        return this._commandManager.isCommandAvailable(name, this.option('contextItems'));
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
            contextItems: [],
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
            case 'contextItems':
                this._update();
                break;
            case 'onItemClick':
                this._itemClickedAction = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

    updateItemPermissions() {
        this.repaint();
        this._restoreRefreshItemState();
    }

    _restoreRefreshItemState() {
        this.updateRefreshItem(this._refreshItemState.message, this._refreshItemState.status);
    }

    updateRefreshItem(message, status) {
        let generalToolbarOptions = null;
        let text = messageLocalization.format('dxFileManager-commandRefresh');
        let showText = 'inMenu';

        this._isRefreshVisibleInFileToolbar = false;
        this._refreshItemState = { message, status };

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

    _update() {
        const showGeneralToolbar = this.option('contextItems').length === 0 || !this._fileToolbarHasEffectiveItems();
        if(this._generalToolbarVisible !== showGeneralToolbar) {
            this._generalToolbar.option('visible', showGeneralToolbar);
            this._fileToolbar.option('visible', !showGeneralToolbar);
            this._generalToolbarVisible = showGeneralToolbar;

            this.$element().toggleClass(FILE_MANAGER_GENERAL_TOOLBAR_CLASS, showGeneralToolbar);
            this.$element().toggleClass(FILE_MANAGER_FILE_TOOLBAR_CLASS, !showGeneralToolbar);
        }

        const toolbar = this._getVisibleToolbar();
        this._ensureAvailableCommandsVisible(toolbar);
        this._checkCompactMode(toolbar);
    }

    get _commandManager() {
        return this.option('commandManager');
    }

}

export default FileManagerToolbar;
