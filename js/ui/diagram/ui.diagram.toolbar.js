import $ from '../../core/renderer';

import Toolbar from '../toolbar';
import ContextMenu from '../context_menu';
import DiagramBar from './diagram.bar';
import { extend } from '../../core/utils/extend';

import DiagramPanel from './ui.diagram.panel';
import DiagramMenuHelper from './ui.diagram.menu_helper';

import '../select_box';
import '../color_box';
import '../check_box';

const ACTIVE_FORMAT_CLASS = 'dx-format-active';
const DIAGRAM_TOOLBAR_CLASS = 'dx-diagram-toolbar';
const DIAGRAM_TOOLBAR_SEPARATOR_CLASS = 'dx-diagram-toolbar-separator';
const DIAGRAM_TOOLBAR_MENU_SEPARATOR_CLASS = 'dx-diagram-toolbar-menu-separator';

class DiagramToolbar extends DiagramPanel {
    _init() {
        this._commands = [];
        this._itemHelpers = {};
        this._contextMenus = [];
        this.bar = new ToolbarDiagramBar(this);

        this._createOnWidgetCommand();
        this._createOnSubMenuVisibleChangedAction();

        super._init();
    }
    _initMarkup() {
        super._initMarkup();

        this._commands = this._getCommands();
        this._itemHelpers = {};
        this._contextMenus = [];
        this._rightAlignedCommands = this._getRightAlignedCommands();

        const $toolbar = this._createMainElement();
        this._renderToolbar($toolbar);
    }

    _createMainElement() {
        return $('<div>')
            .addClass(DIAGRAM_TOOLBAR_CLASS)
            .appendTo(this._$element);
    }
    _getCommands() {
        return [];
    }
    _getRightAlignedCommands() {
        return [];
    }
    _getWidgetCommands() {
        return this.option('widgetCommandNames') || [];
    }
    _renderToolbar($toolbar) {
        let dataSource = [];
        dataSource = dataSource.concat(this._prepareToolbarItems(this._commands, 'before', this._execDiagramCommand));
        dataSource = dataSource.concat(this._prepareToolbarItems(this._rightAlignedCommands, 'after', this._execDiagramCommand));
        this._toolbarInstance = this._createComponent($toolbar, Toolbar, { dataSource });
    }
    _prepareToolbarItems(items, location, actionHandler) {
        return items.map(item => extend(true,
            { location: location, locateInMenu: 'auto' },
            this._createItem(item, location, actionHandler),
            this._createItemOptions(item),
            this._createItemActionOptions(item, actionHandler)
        ));
    }

    _createItem(item, location, actionHandler) {
        if(item.widget === 'separator') {
            return {
                template: (data, index, element) => {
                    $(element).addClass(DIAGRAM_TOOLBAR_SEPARATOR_CLASS);
                },
                menuItemTemplate: (data, index, element) => {
                    $(element).addClass(DIAGRAM_TOOLBAR_MENU_SEPARATOR_CLASS);
                }
            };
        }
        return {
            widget: item.widget || 'dxButton',
            cssClass: item.cssClass,
            options: {
                stylingMode: 'text',
                text: item.text,
                hint: item.hint,
                icon: item.icon,
                onInitialized: (e) => this._onItemInitialized(e.component, item),
                onContentReady: (e) => this._onItemContentReady(e.component, item, actionHandler),
            }
        };
    }
    _createItemOptions({ widget, items, valueExpr, displayExpr, showText, hint, icon }) {
        if(widget === 'dxSelectBox') {
            return this._createSelectBoxItemOptions(hint, items, valueExpr, displayExpr);
        } else if(widget === 'dxColorBox') {
            return this._createColorBoxItemOptions(hint, icon);
        } else if(!widget || widget === 'dxButton') {
            return {
                showText: showText || 'inMenu'
            };
        }
    }
    _createSelectBoxItemOptions(hint, items, valueExpr, displayExpr) {
        let options = this._createSelectBoxBaseItemOptions(hint);
        if(items) {
            options = extend(true, options, {
                options: {
                    items,
                    displayExpr,
                    valueExpr
                }
            });
        } else {
            options = extend(true, options, {
                options: {
                    dataSource: items,
                    displayExpr: 'title',
                    valueExpr: 'value'
                }
            });
        }

        const isSelectButton = items && items.every(i => i.icon !== undefined);
        if(isSelectButton) {
            options = extend(true, options, {
                options: {
                    fieldTemplate: (data, container) => {
                        $('<i>')
                            .addClass(data && data.icon)
                            .appendTo(container);
                        $('<div>').dxTextBox({
                            readOnly: true,
                            stylingMode: 'outlined'
                        }).appendTo(container);
                    },
                    itemTemplate: (data) => {
                        return `<i class="${data.icon}"${data.hint && ` title="${data.hint}`}"}></i>`;
                    }
                }
            });
        }
        return options;
    }
    _createColorBoxItemOptions(hint, icon) {
        let options = this._createSelectBoxBaseItemOptions(hint);
        if(icon) {
            options = extend(true, options, {
                options: {
                    openOnFieldClick: true,
                    fieldTemplate: (data, container) => {
                        $('<i>')
                            .addClass(icon)
                            .css('borderBottomColor', data)
                            .appendTo(container);
                        $('<div>').dxTextBox({
                            readOnly: true,
                            stylingMode: 'outlined'
                        }).appendTo(container);
                    }
                }
            });
        }
        return options;
    }
    _createSelectBoxBaseItemOptions(hint) {
        return {
            options: {
                stylingMode: 'filled',
                hint: hint,
            }
        };
    }
    _createItemActionOptions(item, handler) {
        switch(item.widget) {
            case 'dxSelectBox':
            case 'dxColorBox':
            case 'dxCheckBox':
                return {
                    options: {
                        onValueChanged: (e) => {
                            const parameter = DiagramMenuHelper.getItemCommandParameter(item, e.component.option('value'));
                            handler.call(this, item.command, parameter, item.onExecuted);
                        }
                    }
                };
            default:
                if(!item.items) {
                    return {
                        options: {
                            onClick: (e) => {
                                const parameter = DiagramMenuHelper.getItemCommandParameter(item);
                                handler.call(this, item.command, parameter, item.onExecuted);
                            }
                        }
                    };
                }
        }
    }
    _onItemInitialized(widget, item) {
        this._addItemHelper(item.command, new ToolbarItemHelper(widget));
    }
    _onItemContentReady(widget, item, actionHandler) {
        if(widget.NAME === 'dxButton' && item.items) {
            const $menuContainer = $('<div>')
                .appendTo(this.$element());
            this._createComponent($menuContainer, ContextMenu, {
                items: item.items,
                target: widget.$element(),
                cssClass: DiagramMenuHelper.getContextMenuCssClass(),
                showEvent: 'dxclick',
                position: { at: 'left bottom' },
                itemTemplate: function(itemData, itemIndex, itemElement) {
                    DiagramMenuHelper.getContextMenuItemTemplate(itemData, itemIndex, itemElement, this._menuHasCheckedItems);
                },
                onItemClick: ({ itemData }) => DiagramMenuHelper.onContextMenuItemClick(itemData, actionHandler.bind(this)),
                onShowing: (e) => {
                    if(this._showingSubMenu) return;

                    this._showingSubMenu = e.component;
                    this._onSubMenuVisibleChangedAction({ visible: true, component: this });
                    e.component.option('items', item.items);
                    delete this._showingSubMenu;
                },
                onInitialized: ({ component }) => this._onContextMenuInitialized(component, item, widget),
                onDisposing: ({ component }) => this._onContextMenuDisposing(component, item)
            });
        }
    }
    _onContextMenuInitialized(widget, item, rootButton) {
        this._contextMenus.push(widget);
        this._addContextMenuHelper(item, widget, [], rootButton);
    }
    _addItemHelper(command, helper) {
        if(command !== undefined) {
            if(this._itemHelpers[command]) {
                throw new Error('Toolbar cannot contain duplicated commands.');
            }
            this._itemHelpers[command] = helper;
        }
    }
    _addContextMenuHelper(item, widget, indexPath, rootButton) {
        if(item.items) {
            item.items.forEach((subItem, index) => {
                const itemIndexPath = indexPath.concat(index);
                this._addItemHelper(subItem.command, new ToolbarSubItemHelper(widget, itemIndexPath, subItem.command, rootButton));
                this._addContextMenuHelper(subItem, widget, itemIndexPath, rootButton);
            });
        }
    }
    _onContextMenuDisposing(widget, item) {
        this._contextMenus = this._contextMenus.filter(cm => cm !== widget);
    }
    _execDiagramCommand(command, value, onExecuted) {
        if(!this._updateLocked && command !== undefined) {
            const widgetCommands = this._getWidgetCommands();
            if(widgetCommands.indexOf(command) > -1) {
                this._onWidgetCommandAction({ name: command });
            } else {
                this.bar.raiseBarCommandExecuted(command, value);
            }
        }
        if(typeof onExecuted === 'function') {
            onExecuted.call(this);
        }
    }
    _createOnWidgetCommand() {
        this._onWidgetCommandAction = this._createActionByOption('onWidgetCommand');
    }

    _setItemEnabled(command, enabled) {
        if(command in this._itemHelpers) {
            const helper = this._itemHelpers[command];
            if(helper.canUpdate(this._showingSubMenu)) {
                helper.setEnabled(enabled);
            }
        }
    }
    _setEnabled(enabled) {
        this._toolbarInstance.option('disabled', !enabled);
        this._contextMenus.forEach(cm => cm.option('disabled', !enabled));
    }
    _setItemValue(command, value) {
        try {
            this._updateLocked = true;
            if(command in this._itemHelpers) {
                const helper = this._itemHelpers[command];
                if(helper.canUpdate(this._showingSubMenu)) {
                    helper.setValue(value);
                }
            }
        } finally {
            this._updateLocked = false;
        }
    }
    _setItemSubItems(command, items) {
        this._updateLocked = true;
        if(command in this._itemHelpers) {
            const helper = this._itemHelpers[command];
            if(helper.canUpdate(this._showingSubMenu)) {
                helper.setItems(items);
            }
        }
        this._updateLocked = false;
    }
    _createOnSubMenuVisibleChangedAction() {
        this._hasCheckedItems = false;
        this._onSubMenuVisibleChangedAction = this._createActionByOption('onSubMenuVisibleChanged');
    }

    _optionChanged(args) {
        switch(args.name) {
            case 'onSubMenuVisibleChanged':
                this._createOnSubMenuVisibleChangedAction();
                break;
            case 'onWidgetCommand':
                this._createOnWidgetCommand();
                break;
            case 'commands':
                this._invalidate();
                break;
            case 'export':
                break;
            default:
                super._optionChanged(args);
        }
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            'export': {
                fileName: 'Diagram',
                proxyUrl: undefined
            }
        });
    }
}

class ToolbarDiagramBar extends DiagramBar {
    getCommandKeys() {
        return this._getKeys(this._owner._commands);
    }
    setItemValue(key, value) {
        this._owner._setItemValue(key, value);
    }
    setItemEnabled(key, enabled) {
        this._owner._setItemEnabled(key, enabled);
    }
    setEnabled(enabled) {
        this._owner._setEnabled(enabled);
    }
    setItemSubItems(key, items) {
        this._owner._setItemSubItems(key, items);
    }
}

class ToolbarItemHelper {
    constructor(widget) {
        this._widget = widget;
    }
    canUpdate(showingSubMenu) {
        return showingSubMenu === undefined;
    }
    setEnabled(enabled) {
        this._widget.option('disabled', !enabled);
    }
    setValue(value) {
        if('value' in this._widget.option()) {
            this._widget.option('value', value);
        } else if(value !== undefined) {
            this._widget.$element().toggleClass(ACTIVE_FORMAT_CLASS, value);
        }
    }
    setItems(items) {
        if('items' in this._widget.option()) {
            this._widget.option('items', items.map(item => {
                return {
                    'value': DiagramMenuHelper.getItemValue(item),
                    'title': item.text
                };
            }));
        }
    }
}

class ToolbarSubItemHelper extends ToolbarItemHelper {
    constructor(widget, indexPath, rootCommandKey, rootButton) {
        super(widget);
        this._indexPath = indexPath;
        this._rootCommandKey = rootCommandKey;
        this._rootButton = rootButton;
    }
    canUpdate(showingSubMenu) {
        return super.canUpdate(showingSubMenu) || showingSubMenu === this._widget;
    }
    setEnabled(enabled) {
        this._widget.option(this._getItemOptionText() + 'disabled', !enabled);
        const rootEnabled = this._hasEnabledCommandItems(this._widget.option('items'));
        this._rootButton.option('disabled', !rootEnabled);
    }
    _hasEnabledCommandItems(items) {
        if(items) {
            return items.some(item =>
                item.command !== undefined && !item.disabled || this._hasEnabledCommandItems(item.items)
            );
        }
        return false;
    }
    setValue(value) {
        const optionText = this._getItemOptionText();
        if(value === true || value === false) {
            this._setHasCheckedItems(-1);
            this._widget.option(optionText + 'checked', value);
        } else if(value !== undefined) {
            this._setHasCheckedItems(this._rootCommandKey);
            this._subItems.forEach((item, index) => {
                item.checked = item.value === value;
            });
            this._updateItems();
        }
    }
    setItems(items) {
        this._subItems = items.slice();
        this._updateItems();
    }
    _setHasCheckedItems(key) {
        if(!this._widget._menuHasCheckedItems) {
            this._widget._menuHasCheckedItems = {};
        }
        this._widget._menuHasCheckedItems[key] = true;
    }
    _updateItems(items) {
        this._widget.option(this._getItemOptionText() + 'items', this._subItems.map(item => {
            return {
                'value': DiagramMenuHelper.getItemValue(item),
                'text': item.text,
                'checked': item.checked,
                'widget': this._widget,
                'rootCommand': this._rootCommandKey
            };
        }));
    }
    _getItemOptionText() {
        return DiagramMenuHelper.getItemOptionText(this._indexPath);
    }
}

module.exports = DiagramToolbar;
