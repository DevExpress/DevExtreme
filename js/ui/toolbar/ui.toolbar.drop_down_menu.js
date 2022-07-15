import $ from '../../core/renderer';
import DropDownMenu from './drop_down_menu';
import { each } from '../../core/utils/iterator';
import { compileGetter } from '../../core/utils/data';

const MENU_INVISIBLE_CLASS = 'dx-state-invisible';
const TOOLBAR_DROP_DOWN_MENU_CONTAINER_CLASS = 'dx-toolbar-menu-container';

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

        return {
            disabled: this._toolbar.option('disabled'),
            itemTemplate: () => this._getMenuItemTemplate(),
            onItemClick: (e) => { itemClickAction(e); },
            container: this._toolbar.option('menuContainer'),
            onOptionChanged: ({ name, value }) => {
                if(name === 'opened') {
                    this._toolbar.option('overflowMenuVisible', value);
                }
                if(name === 'items') {
                    this._updateMenuVisibility(value);
                }
            },
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

    itemOption(item, property, value) {
        if(property === 'disabled' || property === 'options.disabled') {
            this._dropDownMenu?._itemOptionChanged(item, property, value);
        } else {
            this.renderMenuItems();
        }
    }
}

export default ToolbarDropDownMenu;
