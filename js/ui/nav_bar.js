import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import NavBarItem from './nav_bar/item';
import Tabs from './tabs';

// STYLE navBar

const NAVBAR_CLASS = 'dx-navbar';
const ITEM_CLASS = 'dx-item-content';
const NAVBAR_ITEM_CLASS = 'dx-nav-item';
const NAVBAR_ITEM_CONTENT_CLASS = 'dx-nav-item-content';

const NavBar = Tabs.inherit({
    ctor: function(element, options) {
        this.callBase(element, options);
        this._logDeprecatedComponentWarning('20.1', 'dxTabs');
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxNavBarOptions.scrollingEnabled
            * @type boolean
            * @default false
            * @hidden
            */
            scrollingEnabled: false

            /**
            * @name dxNavBarOptions.showNavButtons
            * @hidden
            */

        });
    },

    _render: function() {
        this.callBase();

        this.$element().addClass(NAVBAR_CLASS);
    },

    _postprocessRenderItem: function(args) {
        this.callBase(args);

        const $itemElement = args.itemElement;
        const itemData = args.itemData;

        $itemElement.addClass(NAVBAR_ITEM_CLASS);
        $itemElement.find('.' + ITEM_CLASS)
            .addClass(NAVBAR_ITEM_CONTENT_CLASS);

        if(!itemData.icon) {
            $itemElement.addClass('dx-navbar-text-item');
        }
    }
});
NavBar.ItemClass = NavBarItem;

registerComponent('dxNavBar', NavBar);

export default NavBar;
