import { noop } from '@js/core/utils/common';
import type { Item } from '@js/ui/tab_panel';
import CollectionWidgetItem from '@ts/ui/collection/m_item';

export default class TabPanelItem extends CollectionWidgetItem<Item> {
  _renderWatchers(): void {
    this._startWatcher('badge', noop);

    super._renderWatchers();
  }
}
