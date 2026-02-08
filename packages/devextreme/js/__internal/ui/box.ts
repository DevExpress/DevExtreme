// eslint-disable-next-line max-classes-per-file
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import { dasherize } from '@js/core/utils/inflector';
import { each } from '@js/core/utils/iterator';
import {
  normalizeStyleProp, setStyle, styleProp, stylePropPrefix,
} from '@js/core/utils/style';
import { isDefined } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { Item, Properties } from '@js/ui/box';
import type { OptionChanged } from '@ts/core/widget/types';
import type { ItemRenderInfo, PostprocessRenderItemInfo } from '@ts/ui/collection/collection_widget.base';
import CollectionWidget from '@ts/ui/collection/collection_widget.edit';
import type { ItemExtraOption } from '@ts/ui/collection/item';
import CollectionWidgetItem from '@ts/ui/collection/item';

// STYLE box

type BoxOptionKey = keyof BoxProperties;

export interface BoxItemData extends Item {
  maxSize?: string | number;
  minSize?: string | number;
  node?: dxElementWrapper;
}

interface QueueItem {
  $item: dxElementWrapper | Element;
  config: BoxProperties<BoxItemData>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ItemLike<TKey> = string | Item<TKey> | any;

export interface BoxProperties<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TItem extends ItemLike<TKey> = any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TKey = any,
> extends Properties<TItem, TKey> {
  onItemStateChanged?: (args: {
    name: string;
    state: unknown;
    oldState: unknown;
  }) => void;

  _queue?: QueueItem[];
}

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

const setFlexProp = (element: Element, prop: string, value: string | number): void => {
  // NOTE: workaround for jQuery version < 1.11.1 (T181692)
  const normalizedValue = normalizeStyleProp(prop, value);
  (element as HTMLElement).style[styleProp(prop)] = normalizedValue;

  // NOTE: workaround for Domino issue https://github.com/fgnass/domino/issues/119
  if (!hasWindow()) {
    if (normalizedValue === '' || !isDefined(normalizedValue)) {
      return;
    }

    const cssName = dasherize(prop);
    const styleExpr = `${cssName}: ${normalizedValue};`;

    setStyle(element, styleExpr, false);
  }
};

class BoxItem extends CollectionWidgetItem<BoxItemData> {
  _options!: ItemExtraOption<BoxItemData> & {
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
  private readonly _$element: dxElementWrapper;

  private readonly _option: <K extends keyof BoxProperties>(name: K) => BoxProperties[K];

  constructor(
    $element: dxElementWrapper,
    option: <K extends keyof BoxProperties>(name: K) => BoxProperties[K],
  ) {
    this._$element = $element;
    this._option = option;
  }

  renderBox(): void {
    this._$element.css({
      display: `${stylePropPrefix('flexDirection')}flex`,
    });
    const direction = this._option('direction') ?? 'row';
    setFlexProp(this._$element.get(0), 'flexDirection', FLEX_DIRECTION_MAP[direction]);
  }

  renderAlign(): void {
    this._$element.css({
      justifyContent: this._normalizedAlign(),
    });
  }

  _normalizedAlign(): string {
    const align = this._option('align') ?? 'start';
    return align in FLEX_JUSTIFY_CONTENT_MAP ? FLEX_JUSTIFY_CONTENT_MAP[align] : align;
  }

  renderCrossAlign(): void {
    this._$element.css({
      alignItems: this._normalizedCrossAlign(),
    });
  }

  _normalizedCrossAlign(): string {
    const crossAlign = this._option('crossAlign') ?? 'start';
    return crossAlign in FLEX_ALIGN_ITEMS_MAP ? FLEX_ALIGN_ITEMS_MAP[crossAlign] : crossAlign;
  }

  renderItems($items: dxElementWrapper): void {
    const flexPropPrefix = stylePropPrefix('flexDirection');
    const direction = this._option('direction') ?? 'row';

    each($items, function renderEachItem(this: Element): void {
      const $item = $(this);
      const item = $item.data(BOX_ITEM_DATA_KEY) as unknown as BoxItemData;

      $item.css({ display: `${flexPropPrefix}flex` })
        .css(MAXSIZE_MAP[direction], item.maxSize ?? 'none')
        .css(MINSIZE_MAP[direction], item.minSize ?? '0');

      setFlexProp($item.get(0), 'flexBasis', item.baseSize ?? 0);
      setFlexProp($item.get(0), 'flexGrow', item.ratio ?? 0);
      setFlexProp($item.get(0), 'flexShrink', isDefined(item.shrink) ? item.shrink : SHRINK);

      $item.children().each((index: number, element: Element): boolean => {
        $(element).css({
          width: 'auto',
          height: 'auto',
          display: `${stylePropPrefix('flexDirection')}flex`,
          flexBasis: 0,
        });

        setFlexProp(element, 'flexGrow', 1);
        setFlexProp(element, 'flexDirection', $(element)[0].style.flexDirection ?? 'column');

        return true;
      });
    });
  }
}

class Box extends CollectionWidget<BoxProperties> {
  static ItemClass = BoxItem;

  private _layout!: LayoutStrategy;

  private _queue!: QueueItem[];

  private _onItemStateChanged!: (args: {
    name: string;
    state: boolean | undefined;
    oldState: boolean | undefined;
  }) => void;

  _getDefaultOptions(): BoxProperties {
    return {
      ...super._getDefaultOptions(),
      direction: 'row',
      align: 'start',
      crossAlign: 'stretch',
      activeStateEnabled: false,
      focusStateEnabled: false,
    };
  }

  _itemClass(): string {
    return BOX_ITEM_CLASS;
  }

  _itemDataKey(): string {
    return BOX_ITEM_DATA_KEY;
  }

  _itemElements(): dxElementWrapper {
    return this._itemContainer().children(this._itemSelector());
  }

  _init(): void {
    super._init();

    this.$element().addClass(BOX_FLEX_CLASS);
    this._initLayout();
    this._initializeRenderQueue();
  }

  _initLayout(): void {
    this._layout = new LayoutStrategy(
      this.$element(),
      <K extends BoxOptionKey>(name: K) => this.option(name),
    );
  }

  _initializeRenderQueue(): void {
    const { _queue: queue } = this.option();
    this._queue = queue ?? [];
  }

  _queueIsNotEmpty(): boolean {
    return this.option('_queue') ? false : !!this._queue.length;
  }

  _pushItemToQueue(
    $item: dxElementWrapper | Element,
    config: BoxProperties<BoxItemData>,
  ): void {
    this._queue.push({ $item, config });
  }

  _shiftItemFromQueue(): QueueItem | undefined {
    return this._queue.shift();
  }

  _initMarkup(): void {
    this.$element().addClass(BOX_CLASS);
    this._layout.renderBox();
    super._initMarkup();
    this._renderAlign();
    this._renderActions();
  }

  _renderActions(): void {
    this._onItemStateChanged = this._createActionByOption('onItemStateChanged');
  }

  _renderAlign(): void {
    this._layout.renderAlign();
    this._layout.renderCrossAlign();
  }

  _renderItems(items: BoxItemData[]): void {
    super._renderItems(items);

    this._processRenderQueue();

    this._layout.renderItems(this._itemElements());
  }

  _processRenderQueue(): void {
    if (this._queueIsNotEmpty()) {
      const item = this._shiftItemFromQueue();

      const {
        itemTemplate,
        itemHoldTimeout,
        onItemHold,
        onItemClick,
        onItemContextMenu,
        onItemRendered,
      } = this.option();

      if (item) {
        this._createComponent(item.$item, Box, {
          itemTemplate,
          itemHoldTimeout,
          onItemHold,
          onItemClick,
          onItemContextMenu,
          onItemRendered,
          _queue: this._queue,
          ...item.config,
        });
      }

      this._processRenderQueue();
    }
  }

  _renderItemContent(
    args: ItemRenderInfo<BoxItemData>,
  ): dxElementWrapper | Element | DeferredObj<dxElementWrapper> {
    const $itemNode = args.itemData?.node;
    if ($itemNode) {
      return this._renderItemContentByNode(args, $itemNode);
    }

    return super._renderItemContent(args);
  }

  _postprocessRenderItem(
    args: PostprocessRenderItemInfo<BoxItemData>,
  ): void {
    const boxConfig = args.itemData?.box;
    if (!boxConfig) {
      return;
    }

    this._pushItemToQueue(args.itemContent, boxConfig);
  }

  _createItemByTemplate(
    itemTemplate: { source: () => unknown },
    args: ItemRenderInfo<BoxItemData>,
  ): dxElementWrapper {
    const { itemData } = args;

    if (itemData.box) {
      // @ts-expect-error
      return itemTemplate.source ? itemTemplate.source() : $();
    }
    return super._createItemByTemplate(itemTemplate, args);
  }

  _itemOptionChanged(
    item: BoxItemData,
    property: keyof BoxItemData,
    value: unknown,
    prevValue: unknown,
  ): void {
    if (property === 'visible') {
      type PropertyType = Item[typeof property];
      this._onItemStateChanged({
        name: property,
        state: value as PropertyType,
        oldState: prevValue !== false,
      });
    }
    super._itemOptionChanged(item, property, value, prevValue);
  }

  _optionChanged(args: OptionChanged<BoxProperties>): void {
    const { name } = args;

    switch (name) {
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

  _itemOptions(): Record<string, unknown> {
    const options = super._itemOptions();

    options.fireItemStateChangedAction = (e): void => {
      this._onItemStateChanged(e);
    };

    return options;
  }
}

registerComponent('dxBox', Box);

export default Box;
