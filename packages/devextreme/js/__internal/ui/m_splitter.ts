// eslint-disable-next-line max-classes-per-file
import registerComponent from '@js/core/component_registrator';
import { extend } from '@js/core/utils/extend';
import CollectionWidgetItem from '@js/ui/collection/item';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.live_update';

const SPLITTER_CLASS = 'dx-splitter';

const SPLITTER_ITEM_CLASS = `${SPLITTER_CLASS}-item`;
const SPLITTER_ITEM_DATA_KEY = 'dxSplitterItemData';
const HORIZONTAL_DIRECTION_CLASS = `${SPLITTER_CLASS}-horizontal`;
const VERTICAL_DIRECTION_CLASS = `${SPLITTER_CLASS}-vertical`;

// NOTE: The following class may be temporary
const PANE_SPLITTER_CLASS = 'dx-pane-splitter';
// export type SplitDirection = 'horizontal' | 'vertical';

class SplitterItem extends CollectionWidgetItem {
}

class Splitter extends CollectionWidget {
  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      direction: 'horizontal',
    });
  }

  _itemClass() {
    return SPLITTER_ITEM_CLASS;
  }

  _itemDataKey() {
    return SPLITTER_ITEM_DATA_KEY;
  }

  _initMarkup() {
    // @ts-expect-error
    this.$element().addClass(`${SPLITTER_CLASS} ${PANE_SPLITTER_CLASS}`);

    this._toggleDirection();
    super._initMarkup();
  }

  _renderItems(items) {
    super._renderItems(items);
  }

  _renderItemContent(args) {
    return super._renderItemContent(args);
  }

  _itemOptionChanged(item, property, value) {
    super._itemOptionChanged(item, property, value);
  }

  _isHorizontalDirection() {
    // @ts-expect-error
    return this.option('direction') === 'horizontal';
  }

  _toggleDirection() {
    // @ts-expect-error
    this.$element().toggleClass(HORIZONTAL_DIRECTION_CLASS, this._isHorizontalDirection());
    // @ts-expect-error
    this.$element().toggleClass(VERTICAL_DIRECTION_CLASS, !this._isHorizontalDirection());
  }

  _optionChanged(args) {
    switch (args.name) {
      case 'direction':
        this._toggleDirection();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

// @ts-expect-error
Splitter.ItemClass = SplitterItem;

// @ts-expect-error
registerComponent('dxSplitter', Splitter);

export default Splitter;
