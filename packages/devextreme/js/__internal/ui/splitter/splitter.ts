// eslint-disable-next-line max-classes-per-file
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import {
  getOuterHeight,
  getOuterWidth,
} from '@js/core/utils/size';
import CollectionWidgetItem from '@js/ui/collection/item';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.live_update';
import type { Item } from '@js/ui/splitter';

import Guid from '../../../core/guid';
import resizeObserverSingleton from '../../../core/resize_observer';
import { hasWindow } from '../../../core/utils/window';
import ResizeHandle, { RESIZE_HANDLE_CLASS } from './resize_handle';
import { getComponentInstance } from './utils/component';
import {
  getActionNameByEventName,
  ITEM_COLLAPSED_EVENT,
  ITEM_EXPANDED_EVENT,
  RESIZE_EVENT,
} from './utils/event';
import {
  calculateDelta,
  findLastIndexOfVisibleItem,
  getCurrentLayout,
  getDimensionByOrientation,
  getElementSize,
  getInitialLayout,
  getNewLayout,
  getVisibleItemsCount,
  isElementVisible,
  setFlexProp,
  updateItemsSize,
} from './utils/layout';

const SPLITTER_CLASS = 'dx-splitter';
const SPLITTER_ITEM_CLASS = 'dx-splitter-item';
const SPLITTER_ITEM_DATA_KEY = 'dxSplitterItemData';
const HORIZONTAL_ORIENTATION_CLASS = 'dx-splitter-horizontal';
const VERTICAL_ORIENTATION_CLASS = 'dx-splitter-vertical';

const FLEX_PROPERTY = {
  flexGrow: 'flexGrow',
  flexShrink: 'flexShrink',
  flexBasis: 'flexBasis',
};

const DEFAULT_FLEX_SHRINK_PROP = 0;
const DEFAULT_FLEX_BASIS_PROP = 0;

const ORIENTATION = {
  horizontal: 'horizontal',
  vertical: 'vertical',
};

class SplitterItem extends CollectionWidgetItem {
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Splitter extends (CollectionWidget as any) {
  _getDefaultOptions(): Record<string, unknown> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      orientation: ORIENTATION.horizontal,
      onItemCollapsed: null,
      onItemExpanded: null,
      onResize: null,
      onResizeEnd: null,
      onResizeStart: null,
      allowKeyboardNavigation: true,
    });
  }

  // eslint-disable-next-line class-methods-use-this
  _itemClass(): string {
    return SPLITTER_ITEM_CLASS;
  }

  // eslint-disable-next-line class-methods-use-this
  _itemDataKey(): string {
    return SPLITTER_ITEM_DATA_KEY;
  }

  _initMarkup(): void {
    this.$element().addClass(SPLITTER_CLASS);

    this._toggleOrientationClass();

    if (isElementVisible(this.$element().get(0))) {
      this._layout = this._getInitialLayoutBasedOnSize();
      this._updatePaneSizesWithOuterWidth();
    } else {
      this._shouldRecalculateLayout = true;
    }

    super._initMarkup();

    this._attachResizeObserverSubscription();
  }

  _shouldUpdateLayout(): boolean {
    const size: number = this.option('orientation') === ORIENTATION.horizontal
      ? getOuterWidth(this.$element()) : getOuterHeight(this.$element());

    return size === 0;
  }

  _render(): void {
    super._render();
  }

  _attachResizeObserverSubscription(): void {
    if (hasWindow()) {
      const formRootElement = this.$element().get(0);

      resizeObserverSingleton.unobserve(formRootElement);
      resizeObserverSingleton.observe(formRootElement, () => { this._resizeHandler(); });
    }
  }

  _resizeHandler(): void {
    if (!this._shouldRecalculateLayout) {
      return;
    }

    this._layout = this._getInitialLayoutBasedOnSize();

    this._applyFlexGrowFromLayout(this._layout);
    this._updatePaneSizesWithOuterWidth();

    this._shouldRecalculateLayout = false;
  }

  _renderItems(items: Item[]): void {
    super._renderItems(items);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _itemElements(): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._itemContainer().children(this._itemSelector());
  }

  _isLastVisibleItem(index: number): boolean {
    return index === findLastIndexOfVisibleItem(this.option('items'));
  }

  _renderItem(
    index: number,
    itemData: Item,
    $container: dxElementWrapper,
    $itemToReplace: dxElementWrapper,
  ): unknown {
    const $itemFrame = super._renderItem(index, itemData, $container, $itemToReplace);

    const itemElement = $itemFrame.get(0);
    setFlexProp(itemElement, FLEX_PROPERTY.flexGrow, this._layout ? this._layout[index] : 100 / getVisibleItemsCount(this.option('items')));
    setFlexProp(itemElement, FLEX_PROPERTY.flexShrink, DEFAULT_FLEX_SHRINK_PROP);
    setFlexProp(itemElement, FLEX_PROPERTY.flexBasis, DEFAULT_FLEX_BASIS_PROP);

    const groupAriaAttributes: { role: string; id?: string } = {
      role: 'group',
    };

    if (itemData.visible !== false && !this._isLastVisibleItem(index)) {
      const itemId = `dx_${new Guid()}`;

      groupAriaAttributes.id = itemId;

      this._renderResizeHandle(itemId);
    }

    this.setAria(groupAriaAttributes, $itemFrame);

    return $itemFrame;
  }

  _renderResizeHandle(paneId: string): void {
    const $resizeHandle = $('<div>')
      .appendTo(this.$element());

    this._createComponent($resizeHandle, ResizeHandle, this._getResizeHandleConfig(paneId));
  }

  _getAction(eventName: string): (e) => void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this[getActionNameByEventName(eventName)] ?? this._createActionByOption(eventName);
  }

  _getResizeHandleConfig(paneId: string): object {
    const {
      orientation,
      rtlEnabled,
      allowKeyboardNavigation,
    } = this.option();

    return {
      direction: orientation,
      focusStateEnabled: allowKeyboardNavigation,
      elementAttr: {
        'aria-controls': paneId,
      },
      collapsePrevClick: (e): void => {
        const $resizeHandle = $(e.target).parent();
        const $item = this._getResizeHandleLeftItem($resizeHandle);
        const itemData = this._getItemData($item);

        this._getAction(ITEM_COLLAPSED_EVENT)({
          event: e,
          itemData,
          itemElement: $item,
        });
      },
      collapseNextClick: (e): void => {
        const $resizeHandle = $(e.target).parent();
        const $item = this._getResizeHandleLeftItem($resizeHandle);
        const itemData = this._getItemData($item);

        this._getAction(ITEM_EXPANDED_EVENT)({
          event: e,
          itemData,
          itemElement: $item,
        });
      },
      onResizeStart: ({ element, event }): void => {
        this._$visibleItems = this._getVisibleItems();
        this._currentLayout = getCurrentLayout(this._$visibleItems);
        this._activeResizeHandleIndex = this._getResizeHandleItems().index(element);

        this._splitterItemsSize = this._getSummaryItemsSize(
          getDimensionByOrientation(orientation),
          this._$visibleItems,
          true,
        );

        this._getAction(RESIZE_EVENT.onResizeStart)({
          event,
          handleElement: event.target,
        });
      },
      onResize: ({ event }): void => {
        const newLayout = getNewLayout(
          this._currentLayout,
          calculateDelta(event.offset, orientation, rtlEnabled, this._splitterItemsSize),
          this._activeResizeHandleIndex,
        );

        updateItemsSize(this._$visibleItems, newLayout);

        this._getAction(RESIZE_EVENT.onResize)({
          event,
          handleElement: event.target,
        });
      },
      onResizeEnd: ({ event }): void => {
        each(this._itemElements(), (index: number, itemElement) => {
          this._options.silent(`items[${index}].size`, getOuterWidth(itemElement));
        });

        this._getAction(RESIZE_EVENT.onResizeEnd)({
          event,
          handleElement: event.target,
        });
      },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _getResizeHandleLeftItem($resizeHandle: dxElementWrapper): dxElementWrapper {
    return $resizeHandle.prev();
  }

  _renderItemContent(args: object): object {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return super._renderItemContent(args);
  }

  _createItemByTemplate(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    itemTemplate,
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    args,
  ): unknown {
    const { itemData } = args;

    if (itemData.splitter) {
      return itemTemplate.source
        ? itemTemplate.source()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : ($ as any)();
    }

    return super._createItemByTemplate(itemTemplate, args);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _postprocessRenderItem(args): void {
    const splitterConfig = args.itemData.splitter;
    if (!splitterConfig) {
      return;
    }

    this._createComponent($(args.itemContent), Splitter, extend({
      itemTemplate: this.option('itemTemplate'),
      onResize: this.option('onResize'),
      onResizeStart: this.option('onResizeStart'),
      onResizeEnd: this.option('onResizeEnd'),
      onItemClick: this.option('onItemClick'),
      onItemContextMenu: this.option('onItemContextMenu'),
      onItemRendered: this.option('onItemRendered'),
      onItemExpanded: this.option('onItemExpanded'),
      onItemCollapsed: this.option('onItemCollapsed'),
    }, splitterConfig));
  }

  _isHorizontalOrientation(): boolean {
    return this.option('orientation') === ORIENTATION.horizontal;
  }

  _toggleOrientationClass(): void {
    this.$element().toggleClass(HORIZONTAL_ORIENTATION_CLASS, this._isHorizontalOrientation());
    this.$element().toggleClass(VERTICAL_ORIENTATION_CLASS, !this._isHorizontalOrientation());
  }

  _itemOptionChanged(item: unknown, property: unknown, value: unknown): void {
    switch (property) {
      case 'size':
        this._layout = this._getInitialLayoutBasedOnSize();

        this._applyFlexGrowFromLayout(this._layout);
        this._updatePaneSizesWithOuterWidth();
        break;
      default:
        super._itemOptionChanged(item, property, value);
    }
  }

  _getInitialLayoutBasedOnSize(): number[] {
    const {
      items, orientation, width, height,
    } = this.option();

    const elementSize = getElementSize(this.$element(), items, orientation, width, height);

    return getInitialLayout(items, elementSize);
  }

  _applyFlexGrowFromLayout(layout: number[]): void {
    this._iterateItems((index, itemElement) => {
      setFlexProp(itemElement, FLEX_PROPERTY.flexGrow, layout[index]);
    });
  }

  _updatePaneSizesWithOuterWidth(): void {
    this._iterateItems((index, itemElement) => {
      this._options.silent(`items[${index}].size`, getOuterWidth(itemElement));
    });
  }

  _iterateItems(callback: (index: number, itemElement: Element) => void): void {
    each(this._itemElements(), (index: number, itemElement: Element) => {
      callback(index, itemElement);
    });
  }

  _getResizeHandleItems(): dxElementWrapper {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.$element().find(`.${RESIZE_HANDLE_CLASS}`);
  }

  _iterateResizeHandles(callback: (instance: ResizeHandle) => void): void {
    this._getResizeHandleItems().each((index, element) => {
      callback(getComponentInstance($(element)));

      return true;
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _optionChanged(args): void {
    const { name, value } = args;

    switch (name) {
      case 'allowKeyboardNavigation':
        this._iterateResizeHandles((instance) => {
          instance.option('focusStateEnabled', value);
        });
        break;
      case 'orientation':
        this._toggleOrientationClass();
        break;
      case 'onResizeStart':
      case 'onResizeEnd':
      case 'onResize':
      case 'onItemCollapsed':
      case 'onItemExpanded':
        this[getActionNameByEventName(name)] = this._createActionByOption(name);
        break;
      default:
        super._optionChanged(args);
    }
  }

  registerKeyHandler(key: string, handler: () => void): void {
    this._iterateResizeHandles((instance) => {
      instance.registerKeyHandler(key, handler);
    });
  }
}

Splitter.ItemClass = SplitterItem;

// @ts-expect-error // temp fix
registerComponent('dxSplitter', Splitter);

export default Splitter;
