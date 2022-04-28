import $ from '../../core/renderer';
import { noop } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import { compileGetter } from '../../core/utils/data';
import Class from '../../core/class';
import Button from '../button';
const abstract = Class.abstract;

const TOOLBAR_MENU_CONTAINER_CLASS = 'dx-toolbar-menu-container';
const TOOLBAR_MENU_BUTTON_CLASS = 'dx-toolbar-menu-button';

const ToolbarStrategy = Class.inherit({

    ctor: function(toolbar) {
        this._toolbar = toolbar;
    },

    render: function() {
        this._renderMenuButton();
        this._renderWidget();
    },

    _widgetOptions: function() {
        const itemClickAction = this._toolbar._createActionByOption('onItemClick');

        return {
            itemTemplate: this._getMenuItemTemplate.bind(this),
            onItemClick: (function(e) {
                this._toggleMenu(false, true);
                itemClickAction(e);
            }).bind(this)
        };
    },

    _getMenuItemTemplate: function() {
        return this._toolbar._getTemplateByOption('menuItemTemplate');
    },

    _renderWidget: function() {
        const $menu = $('<div>').appendTo(this._menuContainer());

        this._menu = this._toolbar._createComponent($menu, this._menuWidgetClass(), this._widgetOptions());
        this.renderMenuItems();
    },

    _menuContainer: abstract,

    _menuWidgetClass: abstract,

    _hasVisibleMenuItems: function(items) {
        const menuItems = items || this._toolbar.option('items');
        let result = false;

        const optionGetter = compileGetter('visible');
        const overflowGetter = compileGetter('locateInMenu');

        each(menuItems, function(index, item) {
            const itemVisible = optionGetter(item, { functionsAsIs: true });
            const itemOverflow = overflowGetter(item, { functionsAsIs: true });

            if(itemVisible !== false && (itemOverflow === 'auto' || itemOverflow === 'always') || item.location === 'menu') {
                result = true;
            }
        });

        return result;
    },

    _getMenuItems: function() {
        return this._toolbar._getMenuItems();
    },

    _updateMenuVisibility: noop,

    _renderMenuButton: function() {
        const buttonOptions = this._menuButtonOptions();

        this._renderMenuButtonContainer();
        this._$button = $('<div>').appendTo(this._$menuButtonContainer)
            .addClass(TOOLBAR_MENU_BUTTON_CLASS);
        this._toolbar._createComponent(this._$button, Button, buttonOptions);
    },

    _menuButtonOptions: function() {
        return {
            onClick: this._menuButtonClickHandler.bind(this)
        };
    },

    _menuButtonClickHandler: function() {
        this._toggleMenu(!this._menuShown, true);
    },

    _renderMenuButtonContainer: function() {
        const $afterSection = this._toolbar._$afterSection;

        this._$menuButtonContainer = $('<div>').appendTo($afterSection)
            .addClass(this._toolbar._buttonClass())
            .addClass(TOOLBAR_MENU_CONTAINER_CLASS);
    },

    renderMenuItems: function() {
        this._menu && this._menu.option('items', this._getMenuItems());
    },

    toggleMenuVisibility: function(visible, animate) {
        this._menu && this._toggleMenu(visible, animate);
    },

    _toggleMenu: function(visible) {
        this._menuShown = visible;
    },

    getMenuWidget: function() {
        return this._menu;
    },

    widgetOption: function(name, value) {
        this._menu && this._menu.option(name, value);
    },
});

export default ToolbarStrategy;
