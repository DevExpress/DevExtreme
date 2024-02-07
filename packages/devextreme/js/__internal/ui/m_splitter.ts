// eslint-disable-next-line max-classes-per-file
import registerComponent from '@js/core/component_registrator';
import { extend } from '@js/core/utils/extend';
import CollectionWidgetItem from '@js/ui/collection/item';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.live_update';

const SPLITTER_CLASS = 'dx-splitter';
const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const SPLITTER_ITEM_DATA_KEY = 'dxSplitterItemData';

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
    this.$element().addClass(SPLITTER_CLASS);
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

  _optionChanged(args) {
    switch (args.name) {
      case 'direction':
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
