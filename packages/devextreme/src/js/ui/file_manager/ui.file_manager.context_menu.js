import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { isDefined, isString } from '../../core/utils/type';
import { ensureDefined } from '../../core/utils/common';

import Widget from '../widget/ui.widget';
import ContextMenu from '../context_menu/ui.context_menu';
import { extendAttributes } from './ui.file_manager.common';

const FILEMANAGER_CONTEXT_MEMU_CLASS = 'dx-filemanager-context-menu';

const DEFAULT_CONTEXT_MENU_ITEMS = {
    create: {},
    upload: {},
    download: {},
    rename: {},
    move: {},
    copy: {},
    delete: {},
    refresh: {
        beginGroup: true
    }
};

const DEFAULT_ITEM_ALLOWED_PROPERTIES = [
    'beginGroup',
    'closeMenuOnClick',
    'disabled',
    'icon',
    'selectable',
    'selected',
    'text',
    'visible'
];

class FileManagerContextMenu extends Widget {

    _initMarkup() {
        this._initActions();

        this._isVisible = false;

        const $menu = $('<div>').appendTo(this.$element());
        this._contextMenu = this._createComponent($menu, ContextMenu, {
            cssClass: FILEMANAGER_CONTEXT_MEMU_CLASS,
            showEvent: '',
            onItemClick: (args) => this._onContextMenuItemClick(args.itemData.name, args),
            onShowing: e => this._onContextMenuShowing(e),
            onShown: () => this._onContextMenuShown(),
            onHidden: () => this._onContextMenuHidden()
        });

        super._initMarkup();
    }

    showAt(fileItems, element, event, target) {
        const { itemData, itemElement, isActionButton = false } = target;
        if(this._isVisible) {
            this._onContextMenuHidden();
        }
        this._menuShowingContext = {
            targetElement: itemElement,
            itemData,
            fileItems,
            event,
            isActionButton
        };

        const position = {
            of: element,
            at: 'top left',
            my: 'top left',
            offset: ''
        };

        if(event) {
            position.offset = event.offsetX + ' ' + event.offsetY;
        } else {
            position.my = 'left top';
            position.at = 'left bottom';
            position.boundaryOffset = '1';
        }

        this._contextMenu.option({
            target: element,
            position
        });

        this._contextMenu.show();
    }

    createContextMenuItems(fileItems, contextMenuItems, targetFileItem) {
        this._targetFileItems = fileItems;
        this._targetFileItem = isDefined(targetFileItem) ? targetFileItem : fileItems?.[0];

        const result = [];

        const itemArray = contextMenuItems || this.option('items');
        itemArray.forEach(srcItem => {
            const commandName = isString(srcItem) ? srcItem : srcItem.name;
            const item = this._configureItemByCommandName(commandName, srcItem, fileItems, this._targetFileItem);
            if(this._isContextMenuItemAvailable(item, fileItems)) {
                result.push(item);
            }
        });

        return result;
    }

    _isContextMenuItemAvailable(menuItem, fileItems) {
        if(!this._isDefaultItem(menuItem.name) || !menuItem._autoHide) {
            return ensureDefined(menuItem.visible, true);
        }

        if(this._isIsolatedCreationItemCommand(menuItem.name) && fileItems && fileItems.length) {
            return false;
        }

        return this._commandManager.isCommandAvailable(menuItem.name, fileItems);
    }

    _isIsolatedCreationItemCommand(commandName) {
        return (commandName === 'create' || commandName === 'upload') && this.option('isolateCreationItemCommands');
    }

    _isDefaultItem(commandName) {
        return !!DEFAULT_CONTEXT_MENU_ITEMS[commandName];
    }

    _configureItemByCommandName(commandName, item, fileItems, targetFileItem) {
        if(!this._isDefaultItem(commandName)) {
            const res = extend(true, {}, item);
            res.originalItemData = item;
            this._addItemClickHandler(commandName, res);
            if(Array.isArray(item.items)) {
                res.items = this.createContextMenuItems(fileItems, item.items, targetFileItem);
            }
            return res;
        }

        const result = this._createMenuItemByCommandName(commandName);
        const defaultConfig = DEFAULT_CONTEXT_MENU_ITEMS[commandName];
        extend(result, defaultConfig);
        result.originalItemData = item;
        extendAttributes(result, item, DEFAULT_ITEM_ALLOWED_PROPERTIES);

        if(!isDefined(result.visible)) {
            result._autoHide = true;
        }

        if(commandName && !result.name) {
            extend(result, { name: commandName });
        }

        return result;
    }

    _createMenuItemByCommandName(commandName) {
        const { text, icon } = this._commandManager.getCommandByName(commandName);
        const menuItem = {
            name: commandName,
            text,
            icon
        };
        this._addItemClickHandler(commandName, menuItem);
        return menuItem;
    }

    _addItemClickHandler(commandName, contextMenuItem) {
        contextMenuItem.onItemClick = (args) => this._onContextMenuItemClick(commandName, args);
    }

    _onContextMenuItemClick(commandName, args) {
        const changedArgs = extend(true, {}, args);
        changedArgs.itemData = args.itemData.originalItemData;
        changedArgs.fileSystemItem = this._targetFileItem?.fileItem;
        changedArgs.viewArea = this.option('viewArea');
        this._actions.onItemClick(changedArgs);
        if(this._isDefaultItem(commandName)) {
            const targetFileItems = this._isIsolatedCreationItemCommand(commandName) ? null : this._targetFileItems;
            this._commandManager.executeCommand(commandName, targetFileItems);
        }
    }

    _initActions() {
        this._actions = {
            onContextMenuHidden: this._createActionByOption('onContextMenuHidden'),
            onContextMenuShowing: this._createActionByOption('onContextMenuShowing'),
            onItemClick: this._createActionByOption('onItemClick')
        };
    }

    _onContextMenuShowing(e) {
        if(this._isVisible) {
            this._onContextMenuHidden(true);
        }
        e = extend(e, this._menuShowingContext, { options: this.option(), cancel: false });
        this._actions.onContextMenuShowing(e);
        if(!e.cancel) {
            const items = this.createContextMenuItems(this._menuShowingContext.fileItems, null, this._menuShowingContext.fileSystemItem);
            this._contextMenu.option('dataSource', items);
        }
    }

    tryUpdateVisibleContextMenu() {
        if(this._isVisible) {
            const items = this.createContextMenuItems(this._targetFileItems);
            this._contextMenu.option('dataSource', items);
        }
    }

    _onContextMenuShown() {
        this._isVisible = true;
    }

    _onContextMenuHidden(preserveContext) {
        this._isVisible = false;
        if(!preserveContext) {
            this._menuShowingContext = {};
        }
        this._contextMenu.option('visible', false);
        this._raiseContextMenuHidden();
    }

    _raiseContextMenuHidden() {
        this._actions.onContextMenuHidden();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            commandManager: null,
            onContextMenuHidden: null,
            onItemClick: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case 'commandManager':
                this.repaint();
                break;
            case 'items':
                this.tryUpdateVisibleContextMenu();
                break;
            case 'onItemClick':
            case 'onContextMenuShowing':
            case 'onContextMenuHidden':
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

    get _commandManager() {
        return this.option('commandManager');
    }

}

export default FileManagerContextMenu;
