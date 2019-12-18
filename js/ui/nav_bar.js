var registerComponent = require('../core/component_registrator'),
    extend = require('../core/utils/extend').extend,
    NavBarItem = require('./nav_bar/item'),
    Tabs = require('./tabs');

var NAVBAR_CLASS = 'dx-navbar',
    ITEM_CLASS = 'dx-item-content',
    NAVBAR_ITEM_CLASS = 'dx-nav-item',
    NAVBAR_ITEM_CONTENT_CLASS = 'dx-nav-item-content';

/**
* @name dxNavBar
* @inherits dxTabs
* @module ui/nav_bar
* @export default
*/
var NavBar = Tabs.inherit({
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

            /**
            * @name dxNavBarOptions.scrollByContent
            */
        });
    },

    _render: function() {
        this.callBase();

        this.$element().addClass(NAVBAR_CLASS);
    },

    _postprocessRenderItem: function(args) {
        this.callBase(args);

        var $itemElement = args.itemElement,
            itemData = args.itemData;

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
/**
* @name dxNavBarItem.badge
* @type String
*/
NavBar.ItemClass = NavBarItem;

registerComponent('dxNavBar', NavBar);

module.exports = NavBar;
