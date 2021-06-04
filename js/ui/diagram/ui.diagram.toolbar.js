import $ from '../../core/renderer';
import Toolbar from '../toolbar';
import ContextMenu from '../context_menu';
import DiagramBar from './diagram.bar';
import { extend } from '../../core/utils/extend';
import { hasWindow } from '../../core/utils/window';

import DiagramPanel from './ui.diagram.panel';
import DiagramMenuHelper from './ui.diagram.menu_helper';
import { getDiagram } from './diagram.importer';

import '../select_box';
import '../color_box';
import '../check_box';

const ACTIVE_FORMAT_CLASS = 'dx-format-active';
const DIAGRAM_TOOLBAR_CLASS = 'dx-diagram-toolbar';
const DIAGRAM_TOOLBAR_SEPARATOR_CLASS = 'dx-diagram-toolbar-separator';
const DIAGRAM_TOOLBAR_MENU_SEPARATOR_CLASS = 'dx-diagram-toolbar-menu-separator';
const DIAGRAM_MOBILE_TOOLBAR_COLOR_BOX_OPENED_CLASS = 'dx-diagram-mobile-toolbar-color-box-opened';

class DiagramToolbar extends DiagramPanel {
    _init() {
        this._commands = [];
        this._itemHelpers = {};
        this._commandContextMenus = {};
        this._contextMenuList = [];
        this._valueConverters = {};
        this.bar = new DiagramToolbarBar(this);

        this._createOnInternalCommand();
        this._createOnCustomCommand();
        this._createOnSubMenuVisibilityChangingAction();

        super._init();
    }
    _initMarkup() {
        super._initMarkup();

        const isServerSide = !hasWindow();
        if(!this.option('skipAdjustSize') && !isServerSide) {
            this.$element().width('');
        }

        this._commands = this._getCommands();
        this._itemHelpers = {};
        this._commandContextMenus = {};
        this._contextMenuList = [];

        const $toolbar = this._createMainElement();
        this._renderToolbar($toolbar);

        if(!this.option('skipAdjustSize') && !isServerSide) {
            const $toolbarContent = this.$element().find('.dx-toolbar-before');
            this.$element().width($toolbarContent.width());
        }
    }

    _createMainElement() {
        return $('<div>')
            .addClass(DIAGRAM_TOOLBAR_CLASS)
            .appendTo(this._$element);
    }
    _getCommands() {
        return this.option('commands') || [];
    }
    _renderToolbar($toolbar) {
        const beforeCommands = this._commands.filter(command => ['after', 'center'].indexOf(command.position) === -1);
        const centerCommands = this._commands.filter(command => command.position === 'center');
        const afterCommands = this._commands.filter(command => command.position === 'after');
        const dataSource = []
            .concat(this._prepareToolbarItems(beforeCommands, 'before', this._executeCommand))
            .concat(this._prepareToolbarItems(centerCommands, 'center', this._executeCommand))
            .concat(this._prepareToolbarItems(afterCommands, 'after', this._executeCommand));
        this._toolbarInstance = this._createComponent($toolbar, Toolbar, { dataSource });
    }
    _prepareToolbarItems(items, location, actionHandler) {
        return items.map(item => extend(true,
            { location: location, locateInMenu: this.option('locateInMenu') },
            this._createItem(item, location, actionHandler),
            this._createItemOptions(item),
            this._createItemActionOptions(item, actionHandler)
        ));
    }


    _createItem(item, location, actionHandler) {
        if(item.getCommandValue || item.getEditorValue || item.getEditorDisplayValue) {
            this._valueConverters[item.command] = {
                getCommandValue: item.getCommandValue,
                getEditorValue: item.getEditorValue,
                getEditorDisplayValue: item.getEditorDisplayValue
            };
        }
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
                stylingMode: this.option('buttonStylingMode'),
                type: this.option('buttonType'),
                text: item.text,
                hint: item.hint,
                icon: item.icon || item.iconUnchecked || item.iconChecked,
                iconChecked: item.iconChecked,
                iconUnchecked: item.iconUnchecked,
                onInitialized: (e) => this._onItemInitialized(e.component, item),
                onContentReady: (e) => this._onItemContentReady(e.component, item, actionHandler),
            }
        };
    }
    _createItemOptions({ widget, command, items, valueExpr, displayExpr, showText, hint, icon }) {
        if(widget === 'dxSelectBox') {
            return this._createSelectBoxItemOptions(command, hint, items, valueExpr, displayExpr);
        } else if(widget === 'dxTextBox') {
            return this._createTextBoxItemOptions(command, hint);
        } else if(widget === 'dxColorBox') {
            return this._createColorBoxItemOptions(command, hint, icon);
        } else if(!widget || widget === 'dxButton') {
            return {
                showText: showText || 'inMenu'
            };
        }
    }
    _createSelectBoxItemOptions(command, hint, items, valueExpr, displayExpr) {
        let options = this._createTextEditorItemOptions(hint);
        options = extend(true, options, {
            options: {
                dataSource: items,
                displayExpr: displayExpr || 'text',
                valueExpr: valueExpr || 'value',
                dropDownOptions: {
                    container: this.option('container')
                }
            }
        });

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
                    itemTemplate: (data, index, container) => {
                        $(container).attr('title', data.hint);
                        return `<i class="${data.icon}"></i>`;
                    }
                }
            });
        }
        return options;
    }
    _createTextBoxItemOptions(command, hint) {
        let options = this._createTextEditorItemOptions(hint);
        options = extend(true, options, {
            options: {
                readOnly: true,
                focusStateEnabled: false,
                hoverStateEnabled: false,
                buttons: [{
                    name: 'dropDown',
                    location: 'after',
                    options: {
                        icon: 'spindown',
                        disabled: false,
                        stylingMode: 'text',
                        onClick: (e) => {
                            const contextMenu = this._commandContextMenus[command];
                            if(contextMenu) {
                                this._toggleContextMenu(contextMenu);
                            }
                        }
                    }
                }]
            }
        });
        return options;
    }
    _createColorBoxItemOptions(command, hint, icon) {
        let options = this._createTextEditorItemOptions(hint);
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
        options = extend(true, options, {
            options: {
                dropDownOptions: {
                    container: this.option('container')
                },
                onOpened: () => {
                    if(this.option('isMobileView')) {
                        $('body').addClass(DIAGRAM_MOBILE_TOOLBAR_COLOR_BOX_OPENED_CLASS);
                    }
                },
                onClosed: () => {
                    $('body').removeClass(DIAGRAM_MOBILE_TOOLBAR_COLOR_BOX_OPENED_CLASS);
                },
            }
        });
        return options;
    }
    _createTextEditorItemOptions(hint) {
        return {
            options: {
                stylingMode: this.option('editorStylingMode'),
                hint: hint
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
                            const parameter = DiagramMenuHelper.getItemCommandParameter(this, item, e.component.option('value'));
                            handler.call(this, item.command, item.name, parameter);
                        }
                    }
                };
            case 'dxTextBox':
                return {};
            default:
                return {
                    options: {
                        onClick: (e) => {
                            if(!item.items) {
                                const parameter = DiagramMenuHelper.getItemCommandParameter(this, item);
                                handler.call(this, item.command, item.name, parameter);
                            } else {
                                const contextMenu = e.component._contextMenu;
                                if(contextMenu) {
                                    this._toggleContextMenu(contextMenu);
                                }
                            }
                        }
                    }
                };
        }
    }
    _toggleContextMenu(contextMenu) {
        this._contextMenuList.forEach(cm => {
            if(contextMenu !== cm) {
                cm.hide();
            }
        });
        contextMenu.toggle();
    }
    _onItemInitialized(widget, item) {
        this._addItemHelper(item.command, new DiagramToolbarItemHelper(widget));
    }
    _onItemContentReady(widget, item, actionHandler) {
        const { Browser } = getDiagram();
        if((widget.NAME === 'dxButton' || widget.NAME === 'dxTextBox') && item.items) {
            const $menuContainer = $('<div>')
                .appendTo(this.$element());
            widget._contextMenu = this._createComponent($menuContainer, ContextMenu, {
                items: item.items,
                target: widget.$element(),
                cssClass: DiagramMenuHelper.getContextMenuCssClass(),
                showEvent: '',
                closeOnOutsideClick: (e) => {
                    return !Browser.TouchUI && ($(e.target).closest(widget._contextMenu._dropDownButtonElement).length === 0);
                },
                focusStateEnabled: false,
                position: { at: 'left bottom' },
                itemTemplate: function(itemData, itemIndex, itemElement) {
                    DiagramMenuHelper.getContextMenuItemTemplate(this, itemData, itemIndex, itemElement);
                },
                onItemClick: ({ component, itemData }) => {
                    DiagramMenuHelper.onContextMenuItemClick(this, itemData, actionHandler.bind(this));
                    if(!itemData.items || !itemData.items.length) {
                        component.hide();
                    }
                },
                onShowing: (e) => {
                    if(this._showingSubMenu) return;

                    this._showingSubMenu = e.component;
                    this._onSubMenuVisibilityChangingAction({ visible: true, component: this });
                    e.component.option('items', e.component.option('items'));
                    delete this._showingSubMenu;
                },
                onInitialized: ({ component }) => this._onContextMenuInitialized(component, item, widget),
                onDisposing: ({ component }) => this._onContextMenuDisposing(component, item)
            });

            // prevent showing context menu by toggle "close" click
            if(!Browser.TouchUI) {
                widget._contextMenu._dropDownButtonElement = widget.$element(); // i.e. widget.NAME === 'dxButton'
                if(widget.NAME === 'dxTextBox') {
                    widget._contextMenu._dropDownButtonElement = widget.getButton('dropDown').element();
                }
            }
        }
    }
    _onContextMenuInitialized(widget, item, rootWidget) {
        this._contextMenuList.push(widget);
        if(item.command) {
            this._commandContextMenus[item.command] = widget;
        }
        this._addContextMenuHelper(item, widget, [], rootWidget);
    }
    _addItemHelper(command, helper) {
        if(command !== undefined) {
            if(this._itemHelpers[command]) {
                throw new Error('Toolbar cannot contain duplicated commands.');
            }
            this._itemHelpers[command] = helper;
        }
    }
    _addContextMenuHelper(item, widget, indexPath, rootWidget) {
        if(item.items) {
            item.items.forEach((subItem, index) => {
                const itemIndexPath = indexPath.concat(index);
                this._addItemHelper(subItem.command, new DiagramToolbarSubItemHelper(widget, itemIndexPath, subItem.command, rootWidget));
                this._addContextMenuHelper(subItem, widget, itemIndexPath, rootWidget);
            });
        }
    }
    _onContextMenuDisposing(widget, item) {
        this._contextMenuList.splice(this._contextMenuList.indexOf(widget), 1);
        delete this._commandContextMenus[item.command];
    }
    _executeCommand(command, name, value) {
        if(this._updateLocked) return;

        if(typeof command === 'number') {
            const valueConverter = this._valueConverters[command];
            if(valueConverter && valueConverter.getCommandValue) {
                value = valueConverter.getCommandValue(value);
            }
            this.bar.raiseBarCommandExecuted(command, value);
        } else if(typeof command === 'string') {
            this._onInternalCommandAction({ command });
        }
        if(name !== undefined) {
            this._onCustomCommandAction({ name });
        }
    }
    _createOnInternalCommand() {
        this._onInternalCommandAction = this._createActionByOption('onInternalCommand');
    }
    _createOnCustomCommand() {
        this._onCustomCommandAction = this._createActionByOption('onCustomCommand');
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
        this._contextMenuList.forEach(contextMenu => {
            contextMenu.option('disabled', !enabled);
        });
    }
    _setItemValue(command, value) {
        try {
            this._updateLocked = true;
            if(command in this._itemHelpers) {
                const helper = this._itemHelpers[command];
                if(helper.canUpdate(this._showingSubMenu)) {
                    const valueConverter = this._valueConverters[command];
                    if(valueConverter && valueConverter.getEditorValue) {
                        value = valueConverter.getEditorValue(value);
                    }
                    let displayValue;
                    if(valueConverter && valueConverter.getEditorDisplayValue) {
                        displayValue = valueConverter.getEditorDisplayValue(value);
                    }
                    const contextMenu = this._commandContextMenus[command];
                    helper.setValue(value, displayValue, contextMenu, contextMenu && command);
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
                const contextMenu = this._commandContextMenus[command];
                helper.setItems(items, contextMenu, contextMenu && command);
            }
        }
        this._updateLocked = false;
    }
    _createOnSubMenuVisibilityChangingAction() {
        this._onSubMenuVisibilityChangingAction = this._createActionByOption('onSubMenuVisibilityChanging');
    }

    _optionChanged(args) {
        switch(args.name) {
            case 'isMobileView':
                $('body').removeClass(DIAGRAM_MOBILE_TOOLBAR_COLOR_BOX_OPENED_CLASS);
                this._invalidate();
                break;
            case 'onSubMenuVisibilityChanging':
                this._createOnSubMenuVisibilityChangingAction();
                break;
            case 'onInternalCommand':
                this._createOnInternalCommand();
                break;
            case 'onCustomCommand':
                this._createOnCustomCommand();
                break;
            case 'container':
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
            isMobileView: false,
            export: {
                fileName: 'Diagram',
                proxyUrl: undefined
            },
            locateInMenu: 'auto',
            buttonStylingMode: 'text',
            buttonType: 'normal',
            editorStylingMode: 'filled',
            skipAdjustSize: false
        });
    }

    setCommandChecked(command, checked) {
        this._setItemValue(command, checked);
    }
    setCommandEnabled(command, enabled) {
        this._setItemEnabled(command, enabled);
    }
}

class DiagramToolbarBar extends DiagramBar {
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

class DiagramToolbarItemHelper {
    constructor(widget) {
        this._widget = widget;
    }

    canUpdate(showingSubMenu) {
        return showingSubMenu === undefined;
    }
    setEnabled(enabled) {
        this._widget.option('disabled', !enabled);
    }
    setValue(value, displayValue, contextMenu, rootCommandKey) {
        if('value' in this._widget.option()) {
            this._updateEditorValue(value, displayValue);
        } else if(value !== undefined) {
            this._updateButtonValue(value);
        }
        if(contextMenu) {
            this._updateContextMenuItemValue(contextMenu, '', rootCommandKey, value);
        }
    }
    setItems(items, contextMenu, rootCommandKey) {
        if(contextMenu) {
            this._updateContextMenuItems(contextMenu, '', rootCommandKey, items);
        } else {
            this._updateEditorItems(items);
        }
    }

    _updateContextMenuItems(contextMenu, itemOptionText, rootCommandKey, items) {
        DiagramMenuHelper.updateContextMenuItems(contextMenu, itemOptionText, rootCommandKey, items);
    }
    _updateEditorItems(items) {
        if('items' in this._widget.option()) {
            this._widget.option('items', items.map(item => {
                return {
                    'value': DiagramMenuHelper.getItemValue(item),
                    'text': item.text
                };
            }));
        }
    }
    _updateEditorValue(value, displayValue) {
        this._widget.option('value', value);
        if(!this._widget.option('selectedItem') && displayValue) {
            this._widget.option('value', displayValue);
        }
    }
    _updateButtonValue(value) {
        if(this._widget.option('iconChecked') && this._widget.option('iconUnchecked')) {
            this._widget.option('icon', value ? this._widget.option('iconChecked') : this._widget.option('iconUnchecked'));
        } else {
            this._widget.$element().toggleClass(ACTIVE_FORMAT_CLASS, value);
        }
    }
    _updateContextMenuItemValue(contextMenu, itemOptionText, rootCommandKey, value) {
        DiagramMenuHelper.updateContextMenuItemValue(contextMenu, itemOptionText, rootCommandKey, value);
    }
}

class DiagramToolbarSubItemHelper extends DiagramToolbarItemHelper {
    constructor(widget, indexPath, rootCommandKey, rootWidget) {
        super(widget);
        this._indexPath = indexPath;
        this._rootCommandKey = rootCommandKey;
        this._rootWidget = rootWidget;
    }

    canUpdate(showingSubMenu) {
        return super.canUpdate(showingSubMenu) || showingSubMenu === this._widget;
    }
    setEnabled(enabled) {
        this._widget.option(this._getItemOptionText() + 'disabled', !enabled);
        const rootEnabled = this._hasEnabledCommandItems(this._widget.option('items'));
        this._rootWidget.option('disabled', !rootEnabled);
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
        this._updateContextMenuItemValue(this._widget, this._getItemOptionText(), this._rootCommandKey, value);
    }
    setItems(items) {
        this._updateContextMenuItems(this._widget, this._getItemOptionText(), this._rootCommandKey, items);
    }
    _getItemOptionText() {
        return DiagramMenuHelper.getItemOptionText(this._widget, this._indexPath);
    }
}

export default DiagramToolbar;
