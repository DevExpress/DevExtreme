import CollectionWidgetItem from '../collection/item';
import { noop } from '../../core/utils/common';

export default class TabPanelItem extends CollectionWidgetItem {
    _renderWatchers() {
        this._startWatcher('badge', noop);

        return super._renderWatchers();
    }
}
