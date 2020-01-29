const registerComponent = require('../core/component_registrator');
const extend = require('../core/utils/extend').extend;
const NavBarItem = require('./nav_bar/item');
const Tabs = require('./tabs');

const NAVBAR_CLASS = 'dx-navbar';
const ITEM_CLASS = 'dx-item-content';
const NAVBAR_ITEM_CLASS = 'dx-nav-item';
const NAVBAR_ITEM_CONTENT_CLASS = 'dx-nav-item-content';

const NavBar = Tabs.inherit({
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
/**
* @name dxNavBarItem
* @inherits dxTabsItem
* @type object
*/
NavBar.ItemClass = NavBarItem;

registerComponent('dxNavBar', NavBar);

module.exports = NavBar;
