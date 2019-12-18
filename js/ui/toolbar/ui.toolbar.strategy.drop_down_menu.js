var extend = require('../../core/utils/extend').extend,
    ToolbarStrategy = require('./ui.toolbar.strategy'),
    ToolbarMenu = require('./ui.toolbar.menu'),
    DropDownMenu = require('../drop_down_menu');

var MENU_INVISIBLE_CLASS = 'dx-state-invisible';

var DropDownMenuStrategy = ToolbarStrategy.inherit({

    NAME: 'dropDownMenu',

    render: function() {
        if(!this._hasVisibleMenuItems()) {
            return;
        }

        this._renderMenuButtonContainer();
        this._renderWidget();
    },

    renderMenuItems: function() {
        if(!this._menu) {
            this.render();
        }

        this.callBase();
        if(this._menu && !this._menu.option('items').length) {
            this._menu.close();
        }
    },

    _menuWidgetClass: function() {
        return DropDownMenu;
    },

    _widgetOptions: function() {
        var that = this;
        return extend(this.callBase(), {
            deferRendering: true,
            container: that._toolbar.option('menuContainer'),
            menuWidget: ToolbarMenu,
            onOptionChanged: function(e) {
                if(e.name === 'items') {
                    that._updateMenuVisibility(e.value);
                }
            },
            popupPosition: {
                at: 'bottom right',
                my: 'top right'
            }
        });
    },

    _updateMenuVisibility: function(menuItems) {
        var items = menuItems || this._getMenuItems(),
            isMenuVisible = items.length && this._hasVisibleMenuItems(items);
        this._toggleMenuVisibility(isMenuVisible);
    },

    _toggleMenuVisibility: function(value) {
        if(!this._menuContainer()) {
            return;
        }

        this._menuContainer().toggleClass(MENU_INVISIBLE_CLASS, !value);
    },

    _menuContainer: function() {
        return this._$menuButtonContainer;
    }

});

module.exports = DropDownMenuStrategy;
