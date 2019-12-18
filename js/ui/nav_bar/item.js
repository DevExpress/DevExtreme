var TabsItem = require('../tabs/item');

var TABS_ITEM_BADGE_CLASS = 'dx-tabs-item-badge',
    NAVBAR_ITEM_BADGE_CLASS = 'dx-navbar-item-badge';

var NavBarItem = TabsItem.inherit({

    _renderBadge: function(badge) {
        this.callBase(badge);

        this._$element.children('.' + TABS_ITEM_BADGE_CLASS)
            .removeClass(TABS_ITEM_BADGE_CLASS)
            .addClass(NAVBAR_ITEM_BADGE_CLASS);
    }

});

module.exports = NavBarItem;
