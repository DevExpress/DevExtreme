import $ from '@js/core/renderer';
import type { Item } from '@js/ui/tabs';
import CollectionItem from '@ts/ui/collection/item';

export const TABS_ITEM_BADGE_CLASS = 'dx-tabs-item-badge';
const BADGE_CLASS = 'dx-badge';

class TabsItem extends CollectionItem<Item> {
  _renderWatchers(): void {
    super._renderWatchers();

    this._startWatcher<string>('badge', this._renderBadge.bind(this));
  }

  _renderBadge(badge: string | undefined): void {
    this._$element.children(`.${BADGE_CLASS}`).remove();

    if (!badge) {
      return;
    }

    const $badge = $('<div>')
      .addClass(TABS_ITEM_BADGE_CLASS)
      .addClass(BADGE_CLASS)
      .text(badge);

    this._$element.append($badge);
  }
}

export default TabsItem;
