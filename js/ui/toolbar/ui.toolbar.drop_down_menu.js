import $ from '../../core/renderer';
import domAdapter from '../../core/dom_adapter';
import ToolbarMenu from './ui.toolbar.menu';
import DropDownMenu from '../drop_down_menu';
import devices from '../../core/devices';
import { each } from '../../core/utils/iterator';
import { compileGetter } from '../../core/utils/data';

const MENU_INVISIBLE_CLASS = 'dx-state-invisible';
const TOOLBAR_DROP_DOWN_MENU_CONTAINER_CLASS = 'dx-toolbar-menu-container';
const POPOVER_BOUNDARY_OFFSET = 10;

class ToolbarDropDownMenu {
    constructor(toolbar) {
        this._toolbar = toolbar;
    }

    render() {
        if(!this._hasVisibleMenuItems()) {
            return;
        }

        this._renderMenuButtonContainer();

        const $menu = $('<div>').appendTo(this._dropDownMenuContainer());

        this._dropDownMenu = this._toolbar._createComponent($menu, DropDownMenu, this._dropDownMenuOptions());
        this.renderMenuItems();
    }

    renderMenuItems() {
        if(!this._dropDownMenu) {
            this.render();
        }

        this._dropDownMenu && this._dropDownMenu.option('items', this._getMenuItems());

        if(this._dropDownMenu && !this._dropDownMenu.option('items').length) {
            this._dropDownMenu.close();
        }
    }

    _renderMenuButtonContainer() {
        const $afterSection = this._toolbar._$afterSection;

        this._$menuButtonContainer = $('<div>').appendTo($afterSection)
            .addClass(this._toolbar._buttonClass())
            .addClass(TOOLBAR_DROP_DOWN_MENU_CONTAINER_CLASS);
    }


    _getMenuItemTemplate() {
        return this._toolbar._getTemplateByOption('menuItemTemplate');
    }

    _dropDownMenuOptions() {
        const itemClickAction = this._toolbar._createActionByOption('onItemClick');

        const topAndBottomOffset = 2 * POPOVER_BOUNDARY_OFFSET;
        return {
            disabled: this._toolbar.option('disabled'),
            itemTemplate: this._getMenuItemTemplate.bind(this),
            onItemClick: (function(e) {
                itemClickAction(e);
            }).bind(this),
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
        };
    }

    _updateMenuVisibility(menuItems) {
        const items = menuItems || this._getMenuItems();
        const isMenuVisible = items.length && this._hasVisibleMenuItems(items);
        this._toggleMenuVisibility(isMenuVisible);
    }

    _getMenuItems() {
        return this._toolbar._getMenuItems();
    }

    _hasVisibleMenuItems(items) {
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
    }

    _toggleMenuVisibility(value) {
        if(!this._dropDownMenuContainer()) {
            return;
        }

        this._dropDownMenuContainer().toggleClass(MENU_INVISIBLE_CLASS, !value);
    }

    _dropDownMenuContainer() {
        return this._$menuButtonContainer;
    }

    widgetOption(name, value) {
        this._dropDownMenu && this._dropDownMenu.option(name, value);
    }
}

export default ToolbarDropDownMenu;
