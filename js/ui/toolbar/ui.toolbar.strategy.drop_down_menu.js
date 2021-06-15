import { extend } from '../../core/utils/extend';
import ToolbarStrategy from './ui.toolbar.strategy';
import ToolbarMenu from './ui.toolbar.menu';
import DropDownMenu from '../drop_down_menu';

const MENU_INVISIBLE_CLASS = 'dx-state-invisible';

const DropDownMenuStrategy = ToolbarStrategy.inherit({

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
        const that = this;
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
        const items = menuItems || this._getMenuItems();
        const isMenuVisible = items.length && this._hasVisibleMenuItems(items);
        this._toggleMenuVisibility(isMenuVisible);
    },

    _toggleMenuVisibility: function(value) {
        if(!this._menuContainer()) {
            return;
        }

        this._menuContainer().toggleClass(MENU_INVISIBLE_CLASS, !value);
    },

    _toggleMenu: function() {
        this.callBase.apply(this, arguments);

        if(this._menuShown) {
            this._menu.open();
        } else {
            this._menu.close();
        }
    },

    _menuContainer: function() {
        return this._$menuButtonContainer;
    }

});

export default DropDownMenuStrategy;
