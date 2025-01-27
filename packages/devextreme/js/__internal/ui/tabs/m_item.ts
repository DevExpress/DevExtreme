import $ from '@js/core/renderer';
import CollectionWidgetItem from '@ts/ui/collection/m_item';

const TABS_ITEM_BADGE_CLASS = 'dx-tabs-item-badge';
const BADGE_CLASS = 'dx-badge';
// @ts-expect-error
const TabsItem = CollectionWidgetItem.inherit({

  _renderWatchers() {
    this.callBase();

    this._startWatcher('badge', this._renderBadge.bind(this));
  },

  _renderBadge(badge) {
    this._$element.children(`.${BADGE_CLASS}`).remove();

    if (!badge) {
      return;
    }

    const $badge = $('<div>')
      .addClass(TABS_ITEM_BADGE_CLASS)
      .addClass(BADGE_CLASS)
      .text(badge);

    this._$element.append($badge);
  },

});

export default TabsItem;
