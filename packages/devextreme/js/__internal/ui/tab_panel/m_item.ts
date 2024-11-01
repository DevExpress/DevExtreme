import { noop } from '@js/core/utils/common';
import CollectionWidgetItem from '@ts/ui/collection/m_item';

export default class TabPanelItem extends CollectionWidgetItem {
  _renderWatchers() {
    // @ts-expect-error
    this._startWatcher('badge', noop);

    // @ts-expect-error
    return super._renderWatchers();
  }
}
