const $ = require('../../core/renderer');
const CollectionWidgetItem = require('../collection/item');

const LIST_ITEM_BADGE_CONTAINER_CLASS = 'dx-list-item-badge-container';
const LIST_ITEM_BADGE_CLASS = 'dx-list-item-badge';
const BADGE_CLASS = 'dx-badge';

const LIST_ITEM_CHEVRON_CONTAINER_CLASS = 'dx-list-item-chevron-container';
const LIST_ITEM_CHEVRON_CLASS = 'dx-list-item-chevron';

const ListItem = CollectionWidgetItem.inherit({

    _renderWatchers: function() {
        this.callBase();

        this._startWatcher('badge', this._renderBadge.bind(this));
        this._startWatcher('showChevron', this._renderShowChevron.bind(this));
    },

    _renderBadge: function(badge) {
        this._$element.children('.' + LIST_ITEM_BADGE_CONTAINER_CLASS).remove();

        if(!badge) {
            return;
        }

        const $badge = $('<div>')
            .addClass(LIST_ITEM_BADGE_CONTAINER_CLASS)
            .append($('<div>')
                .addClass(LIST_ITEM_BADGE_CLASS)
                .addClass(BADGE_CLASS)
                .text(badge)
            );

        const $chevron = this._$element.children('.' + LIST_ITEM_CHEVRON_CONTAINER_CLASS).first();
        $chevron.length > 0 ? $badge.insertBefore($chevron) : $badge.appendTo(this._$element);
    },

    _renderShowChevron: function(showChevron) {
        this._$element.children('.' + LIST_ITEM_CHEVRON_CONTAINER_CLASS).remove();

        if(!showChevron) {
            return;
        }

        const $chevronContainer = $('<div>').addClass(LIST_ITEM_CHEVRON_CONTAINER_CLASS);
        const $chevron = $('<div>').addClass(LIST_ITEM_CHEVRON_CLASS);

        $chevronContainer.append($chevron).appendTo(this._$element);
    }

});

module.exports = ListItem;
