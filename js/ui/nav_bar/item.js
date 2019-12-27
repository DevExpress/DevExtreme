const TabsItem = require('../tabs/item');

const TABS_ITEM_BADGE_CLASS = 'dx-tabs-item-badge';
const NAVBAR_ITEM_BADGE_CLASS = 'dx-navbar-item-badge';

const NavBarItem = TabsItem.inherit({

    _renderBadge: function(badge) {
        this.callBase(badge);

        this._$element.children('.' + TABS_ITEM_BADGE_CLASS)
            .removeClass(TABS_ITEM_BADGE_CLASS)
            .addClass(NAVBAR_ITEM_BADGE_CLASS);
    }

});

module.exports = NavBarItem;
