var $ = require('../../core/renderer'),
    CollectionWidgetItem = require('../collection/item');

var TABS_ITEM_BADGE_CLASS = 'dx-tabs-item-badge',
    BADGE_CLASS = 'dx-badge';

var TabsItem = CollectionWidgetItem.inherit({

    _renderWatchers: function() {
        this.callBase();

        this._startWatcher('badge', this._renderBadge.bind(this));
    },

    _renderBadge: function(badge) {
        this._$element.children('.' + BADGE_CLASS).remove();

        if(!badge) {
            return;
        }

        var $badge = $('<div>')
            .addClass(TABS_ITEM_BADGE_CLASS)
            .addClass(BADGE_CLASS)
            .text(badge);

        this._$element.append($badge);
    }

});

module.exports = TabsItem;
