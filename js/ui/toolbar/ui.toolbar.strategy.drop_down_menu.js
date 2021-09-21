import { extend } from '../../core/utils/extend';
import domAdapter from '../../core/dom_adapter';
import ToolbarStrategy from './ui.toolbar.strategy';
import ToolbarMenu from './ui.toolbar.menu';
import DropDownMenu from '../drop_down_menu';
import devices from '../../core/devices';

const MENU_INVISIBLE_CLASS = 'dx-state-invisible';
const POPOVER_BOUNDARY_OFFSET = 10;

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

    _menuWidget: function() {
        return DropDownMenu;
    },

    _widgetOptions: function() {
        const topAndBottomOffset = 2 * POPOVER_BOUNDARY_OFFSET;
        return extend(this.callBase(), {
            deferRendering: true,
            container: this._toolbar.option('menuContainer'),
            popupMaxHeight: (devices.current().platform === 'android') // T1010948
                ? domAdapter.getDocumentElement().clientHeight - topAndBottomOffset
                : undefined,
            menuWidget: ToolbarMenu,
            onOptionChanged: ({ name, value }) => {
                if(name === 'opened') {
                    this._toolbar.option('overflowMenuVisible', value);
                }
                if(name === 'items') {
                    this._updateMenuVisibility(value);
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

    _menuContainer: function() {
        return this._$menuButtonContainer;
    }

});

export default DropDownMenuStrategy;
