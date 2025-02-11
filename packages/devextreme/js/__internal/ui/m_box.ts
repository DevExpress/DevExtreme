// eslint-disable-next-line max-classes-per-file
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { dasherize } from '@js/core/utils/inflector';
import { each } from '@js/core/utils/iterator';
import {
  normalizeStyleProp, setStyle, styleProp, stylePropPrefix,
} from '@js/core/utils/style';
import { isDefined } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import CollectionWidget from '@js/ui//collection/ui.collection_widget.edit';
import type { Item, Properties } from '@js/ui/box';
import type { ItemExtraOption } from '@ts/ui/collection/m_item';
import CollectionWidgetItem from '@ts/ui/collection/m_item';

const BOX_CLASS = 'dx-box';
const BOX_FLEX_CLASS = 'dx-box-flex';
const BOX_ITEM_CLASS = 'dx-box-item';
const BOX_ITEM_DATA_KEY = 'dxBoxItemData';

const SHRINK = 1;
const MINSIZE_MAP = {
  row: 'minWidth',
  col: 'minHeight',
};
const MAXSIZE_MAP = {
  row: 'maxWidth',
  col: 'maxHeight',
};
const FLEX_JUSTIFY_CONTENT_MAP = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  'space-between': 'space-between',
  'space-around': 'space-around',
};
const FLEX_ALIGN_ITEMS_MAP = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch',
};
const FLEX_DIRECTION_MAP = {
  row: 'row',
  col: 'column',
};

const setFlexProp = (element, prop, value) => {
  // NOTE: workaround for jQuery version < 1.11.1 (T181692)
  value = normalizeStyleProp(prop, value);
  element.style[styleProp(prop)] = value;

  // NOTE: workaround for Domino issue https://github.com/fgnass/domino/issues/119
  if (!hasWindow()) {
    if (value === '' || !isDefined(value)) {
      return;
    }

    const cssName = dasherize(prop);
    const styleExpr = `${cssName}: ${value};`;

    setStyle(element, styleExpr, false);
  }
};

class BoxItem extends CollectionWidgetItem<Item> {
  _options!: ItemExtraOption<Item> & {
    fireItemStateChangedAction: ((args: {
      name: string;
      state: unknown;
      oldState: unknown;
    }) => void);
  };

  _renderVisible(
    value: boolean | undefined,
    oldValue: boolean | undefined,
  ): void {
    super._renderVisible(value);
    if (isDefined(oldValue)) {
      this._options.fireItemStateChangedAction({
        name: 'visible',
        state: value,
        oldState: oldValue,
      });
    }
  }
}

class LayoutStrategy {
  private readonly _$element: any;

  private readonly _option: any;

  constructor($element, option) {
    this._$element = $element;
    this._option = option;
  }

  renderBox() {
    this._$element.css({
      display: `${stylePropPrefix('flexDirection')}flex`,
    });
    setFlexProp(this._$element.get(0), 'flexDirection', FLEX_DIRECTION_MAP[this._option('direction')]);
  }

  renderAlign() {
    this._$element.css({
      justifyContent: this._normalizedAlign(),
    });
  }

  _normalizedAlign() {
    const align = this._option('align');
    return align in FLEX_JUSTIFY_CONTENT_MAP ? FLEX_JUSTIFY_CONTENT_MAP[align] : align;
  }

  renderCrossAlign() {
    this._$element.css({
      alignItems: this._normalizedCrossAlign(),
    });
  }

  _normalizedCrossAlign() {
    const crossAlign = this._option('crossAlign');
    return crossAlign in FLEX_ALIGN_ITEMS_MAP ? FLEX_ALIGN_ITEMS_MAP[crossAlign] : crossAlign;
  }

  renderItems($items) {
    const flexPropPrefix = stylePropPrefix('flexDirection');
    const direction = this._option('direction');

    each($items, function () {
      const $item = $(this);
      const item = $item.data(BOX_ITEM_DATA_KEY) as any;

      $item.css({ display: `${flexPropPrefix}flex` })
        .css(MAXSIZE_MAP[direction], item.maxSize || 'none')
        .css(MINSIZE_MAP[direction], item.minSize || '0');

      setFlexProp($item.get(0), 'flexBasis', item.baseSize || 0);
      setFlexProp($item.get(0), 'flexGrow', item.ratio);
      setFlexProp($item.get(0), 'flexShrink', isDefined(item.shrink) ? item.shrink : SHRINK);

      // @ts-expect-error
      $item.children().each((_, itemContent) => {
        $(itemContent).css({
          width: 'auto',
          height: 'auto',
          display: `${stylePropPrefix('flexDirection')}flex`,
          flexBasis: 0,
        });

        setFlexProp(itemContent, 'flexGrow', 1);
        setFlexProp(itemContent, 'flexDirection', $(itemContent)[0].style.flexDirection || 'column');
      });
    });
  }
}

class Box extends CollectionWidget<Properties> {
  private _layout: any;

  private _queue: any;

  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      direction: 'row',

      align: 'start',

      crossAlign: 'stretch',

      activeStateEnabled: false,

      focusStateEnabled: false,

      onItemStateChanged: undefined,

      _queue: undefined,

    });
  }

  _itemClass() {
    return BOX_ITEM_CLASS;
  }

  _itemDataKey() {
    return BOX_ITEM_DATA_KEY;
  }

  _itemElements(): dxElementWrapper {
    return this._itemContainer().children(this._itemSelector());
  }

  _init(): void {
    super._init();

    this.$element().addClass(BOX_FLEX_CLASS);
    this._initLayout();
    this._initBoxQueue();
  }

  _initLayout(): void {
    this._layout = new LayoutStrategy(this.$element(), this.option.bind(this));
  }

  _initBoxQueue(): void {
    this._queue = this.option('_queue') || [];
  }

  _queueIsNotEmpty(): boolean {
    return this.option('_queue') ? false : !!this._queue.length;
  }

  _pushItemToQueue($item, config) {
    this._queue.push({ $item, config });
  }

  _shiftItemFromQueue() {
    return this._queue.shift();
  }

  _initMarkup(): void {
    this.$element().addClass(BOX_CLASS);
    this._layout.renderBox();
    super._initMarkup();
    this._renderAlign();
    this._renderActions();
  }

  _renderActions() {
    // @ts-expect-error
    this._onItemStateChanged = this._createActionByOption('onItemStateChanged');
  }

  _renderAlign() {
    this._layout.renderAlign();
    this._layout.renderCrossAlign();
  }

  _renderItems(items) {
    super._renderItems(items);

    while (this._queueIsNotEmpty()) {
      const item = this._shiftItemFromQueue();

      this._createComponent(item.$item, Box, extend({
        itemTemplate: this.option('itemTemplate'),
        itemHoldTimeout: this.option('itemHoldTimeout'),
        onItemHold: this.option('onItemHold'),
        onItemClick: this.option('onItemClick'),
        onItemContextMenu: this.option('onItemContextMenu'),
        onItemRendered: this.option('onItemRendered'),
        _queue: this._queue,
      }, item.config));
    }

    this._layout.renderItems(this._itemElements());
  }

  _renderItemContent(args) {
    const $itemNode = args.itemData && args.itemData.node;
    if ($itemNode) {
      return this._renderItemContentByNode(args, $itemNode);
    }

    return super._renderItemContent(args);
  }

  _postprocessRenderItem(args) {
    const boxConfig = args.itemData.box;
    if (!boxConfig) {
      return;
    }

    this._pushItemToQueue(args.itemContent, boxConfig);
  }

  _createItemByTemplate(itemTemplate, args) {
    if (args.itemData.box) {
      return itemTemplate.source ? itemTemplate.source() : $();
    }
    return super._createItemByTemplate(itemTemplate, args);
  }

  _itemOptionChanged(
    item: Item,
    property: string,
    value: unknown,
    prevValue,
  ): void {
    if (property === 'visible') {
      // @ts-expect-error
      this._onItemStateChanged({
        name: property,
        state: value,
        oldState: prevValue !== false,
      });
    }
    super._itemOptionChanged(item, property, value);
  }

  _optionChanged(args) {
    switch (args.name) {
      case '_queue':
      case 'direction':
        this._invalidate();
        break;
      case 'align':
        this._layout.renderAlign();
        break;
      case 'crossAlign':
        this._layout.renderCrossAlign();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _itemOptions() {
    const options = super._itemOptions();

    options.fireItemStateChangedAction = (e) => {
      // @ts-expect-error
      this._onItemStateChanged(e);
    };

    return options;
  }
}

// @ts-expect-error
Box.ItemClass = BoxItem;

registerComponent('dxBox', Box);

export default Box;
