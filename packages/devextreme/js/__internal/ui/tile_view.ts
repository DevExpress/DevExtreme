import type { DefaultOptionsRule } from '@js/common';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { deferRender } from '@js/core/utils/common';
import { each } from '@js/core/utils/iterator';
import {
  getHeight,
  getOuterHeight,
  getOuterWidth,
  getWidth,
  setHeight,
  setWidth,
} from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { Item, Orientation, Properties } from '@js/ui/tile_view';
import type { OptionChanged } from '@ts/core/widget/types';
import type { CollectionWidgetEditProperties } from '@ts/ui/collection/collection_widget.edit';
import CollectionWidget from '@ts/ui/collection/collection_widget.edit';
import type {
  ScrollView as ScrollViewType,
} from '@ts/ui/scroll_view/scroll_view';
import ScrollView from '@ts/ui/scroll_view/scroll_view';

import supportUtils from '../core/utils/m_support';

const TILEVIEW_CLASS = 'dx-tileview';
const TILEVIEW_CONTAINER_CLASS = 'dx-tileview-wrapper';
const TILEVIEW_ITEM_CLASS = 'dx-tile';
const TILEVIEW_ITEM_SELECTOR = `.${TILEVIEW_ITEM_CLASS}`;

const TILEVIEW_ITEM_DATA_KEY = 'dxTileData';

const CONFIGS = {
  horizontal: {
    itemMainRatio: 'widthRatio',
    itemCrossRatio: 'heightRatio',
    baseItemMainDimension: 'baseItemWidth',
    baseItemCrossDimension: 'baseItemHeight',
    mainDimension: 'width',
    crossDimension: 'height',
    mainPosition: 'left',
    crossPosition: 'top',
  },
  vertical: {
    itemMainRatio: 'heightRatio',
    itemCrossRatio: 'widthRatio',
    baseItemMainDimension: 'baseItemHeight',
    baseItemCrossDimension: 'baseItemWidth',
    mainDimension: 'height',
    crossDimension: 'width',
    mainPosition: 'top',
    crossPosition: 'left',
  },
} as const;

interface ItemPosition {
  top: number;
  left: number;
}
type OrientationConfigMap = typeof CONFIGS;
type OrientationConfig<T extends Orientation> = OrientationConfigMap[T];

export interface TileViewProperties extends Properties, Omit<
  CollectionWidgetEditProperties<TileViewProperties>,
  keyof Properties
> {
  indicateLoading?: boolean;
}

class TileView extends CollectionWidget<TileViewProperties> {
  _$container!: dxElementWrapper;

  _scrollView!: ScrollViewType;

  _cellsPerDimension!: number;

  _itemsPositions!: ItemPosition[];

  _config!: OrientationConfig<Orientation>;

  _cells!: number[][];

  _getDefaultOptions(): TileViewProperties {
    return {
      ...super._getDefaultOptions(),
      direction: 'horizontal',
      hoverStateEnabled: true,
      showScrollbar: 'never',
      height: 500,
      baseItemWidth: 100,
      baseItemHeight: 100,
      itemMargin: 20,
      activeStateEnabled: true,
      indicateLoading: true,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<TileViewProperties>[] {
    return super._defaultOptionsRules().concat([
      {
        device(): boolean {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
      {
        device(): boolean {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return supportUtils.nativeScrolling;
        },
        options: {
          showScrollbar: 'onScroll',
        },
      },
    ]);
  }

  _itemClass(): string {
    return TILEVIEW_ITEM_CLASS;
  }

  _itemDataKey(): string {
    return TILEVIEW_ITEM_DATA_KEY;
  }

  _itemContainer(): dxElementWrapper {
    return this._$container;
  }

  _init(): void {
    super._init();

    this._activeStateUnit = TILEVIEW_ITEM_SELECTOR;

    this.$element().addClass(TILEVIEW_CLASS);
    this._initScrollView();
  }

  _dataSourceLoadingChangedHandler(isLoading: boolean): void {
    const scrollView = this._scrollView;

    if (!scrollView?.startLoading) {
      return;
    }

    const { indicateLoading } = this.option();

    if (isLoading && indicateLoading) {
      scrollView.startLoading();
    } else {
      scrollView.finishLoading();
    }
  }

  _hideLoadingIfLoadIndicationOff(): void {
    const { indicateLoading } = this.option();
    if (!indicateLoading) {
      this._dataSourceLoadingChangedHandler(false);
    }
  }

  _initScrollView(): void {
    const {
      width, height, direction, showScrollbar,
    } = this.option();

    this._scrollView = this._createComponent(this.$element(), ScrollView, {
      direction,
      width,
      height,
      scrollByContent: true,
      useKeyboard: false,
      showScrollbar,
    });

    this._$container = $(this._scrollView.content());
    this._$container.addClass(TILEVIEW_CONTAINER_CLASS);

    this._scrollView.option('onUpdated', this._renderGeometry.bind(this));
  }

  _initMarkup(): void {
    super._initMarkup();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    deferRender(() => {
      this._cellsPerDimension = 1;

      this._renderGeometry();
      this._updateScrollView();
      this._fireContentReadyAction();
    });
  }

  _updateScrollView(): void {
    this._scrollView.option('direction', this.option('direction'));
    this._scrollView.update();
    this._indicateLoadingIfAlreadyStarted();
  }

  _indicateLoadingIfAlreadyStarted(): void {
    // @ts-expect-error ts-error
    if (this._isDataSourceLoading()) {
      this._dataSourceLoadingChangedHandler(true);
    }
  }

  _renderGeometry(): void {
    const { direction = 'horizontal' } = this.option();

    this._config = CONFIGS[direction];

    const { items = [], itemMargin = 0 } = this.option();
    const config: OrientationConfig<Orientation> = this._config;

    const maxItemCrossRatio = items.reduce(
      (max, item) => {
        const ratio = Math.round(item[config.itemCrossRatio] ?? 1);
        return Math.max(max, ratio);
      },
      1,
    );

    // eslint-disable-next-line @typescript-eslint/init-declarations
    let crossDimensionValue;
    // @ts-expect-error ts-error
    if (hasWindow) {
      crossDimensionValue = (config.crossDimension === 'width' ? getWidth : getHeight)(this.$element());
    } else {
      crossDimensionValue = parseInt(this.$element()[0].style[config.crossDimension], 10);
    }

    const options = this.option();
    const baseItemCrossDimension = options[config.baseItemCrossDimension] ?? 0;

    this._cellsPerDimension = Math.floor(
      crossDimensionValue / (baseItemCrossDimension + itemMargin),
    );
    this._cellsPerDimension = Math.max(this._cellsPerDimension, maxItemCrossRatio);
    this._cells = [];

    this._cells.push(new Array(this._cellsPerDimension));

    this._arrangeItems(items);
    this._renderContentSize(config, itemMargin);
  }

  _renderContentSize(
    config: OrientationConfig<Orientation>,
    itemMargin = 0,
  ): void {
    const { mainDimension, baseItemMainDimension } = config;

    if (hasWindow()) {
      const actualContentSize = this._cells.length * (this.option()[baseItemMainDimension] ?? 0)
        + (this._cells.length + 1) * itemMargin;
      const elementSize = (mainDimension === 'width' ? getWidth : getHeight)(this.$element());

      (mainDimension === 'width' ? setWidth : setHeight)(this._$container, Math.max(actualContentSize, elementSize));
    }
  }

  _arrangeItems(items: Item[]): void {
    const config = this._config;
    const { itemMainRatio } = config;
    const { itemCrossRatio } = config;
    const { mainPosition } = config;

    this._itemsPositions = [];

    each(items, (index: number, item: Item) => {
      const currentItem: Item & {
        index: number;
      } = {
        index,
      };
      currentItem[itemMainRatio] = item[itemMainRatio] ?? 1;
      currentItem[itemCrossRatio] = item[itemCrossRatio] ?? 1;
      // @ts-expect-error ts-error
      currentItem[itemMainRatio] = currentItem[itemMainRatio] <= 0
        ? 0
        // @ts-expect-error ts-error
        : Math.round(currentItem[config.itemMainRatio]);
      // @ts-expect-error ts-error
      currentItem[itemCrossRatio] = currentItem[itemCrossRatio] <= 0
        ? 0
        // @ts-expect-error ts-error
        : Math.round(currentItem[config.itemCrossRatio]);

      const itemPosition = this._getItemPosition(currentItem);

      if (itemPosition[mainPosition] === -1) {
        itemPosition[mainPosition] = this._cells.push(new Array(this._cellsPerDimension)) - 1;
      }

      this._occupyCells(currentItem, itemPosition);

      this._arrangeItem(currentItem, itemPosition);

      this._itemsPositions.push(itemPosition);
    });
  }

  _refreshActiveDescendant(): void {}

  _getItemPosition(item: Item): ItemPosition {
    const { mainPosition, crossPosition } = this._config;

    // @ts-expect-error ts-error
    const position: ItemPosition = {
      [mainPosition]: -1,
      [crossPosition]: 0,
    };

    for (let main = 0; main < this._cells.length; main += 1) {
      for (let cross = 0; cross < this._cellsPerDimension; cross += 1) {
        if (this._itemFit(main, cross, item)) {
          position[mainPosition] = main;
          position[crossPosition] = cross;
          break;
        }
      }

      if (position[mainPosition] > -1) {
        break;
      }
    }

    return position;
  }

  _itemFit(
    mainPosition: number,
    crossPosition: number,
    item: Item,
  ): boolean {
    let result = true;

    const config = this._config;
    const itemRatioMain = item[config.itemMainRatio] ?? 0;
    const itemRatioCross = item[config.itemCrossRatio] ?? 0;

    if (crossPosition + itemRatioCross > this._cellsPerDimension) {
      return false;
    }

    for (let main = mainPosition; main < mainPosition + itemRatioMain; main += 1) {
      for (let cross = crossPosition; cross < crossPosition + itemRatioCross; cross += 1) {
        if (this._cells.length - 1 < main) {
          this._cells.push(new Array(this._cellsPerDimension));
        } else if (this._cells[main][cross] !== undefined) {
          result = false;
          break;
        }
      }
    }

    return result;
  }

  _occupyCells(item: Item & { index: number }, itemPosition: ItemPosition): void {
    const config = this._config;
    const itemPositionMain = itemPosition[config.mainPosition];
    const itemPositionCross = itemPosition[config.crossPosition];
    const itemRatioMain = item[config.itemMainRatio] ?? 0;
    const itemRatioCross = item[config.itemCrossRatio] ?? 0;

    for (let main = itemPositionMain; main < itemPositionMain + itemRatioMain; main += 1) {
      for (let cross = itemPositionCross; cross < itemPositionCross + itemRatioCross; cross += 1) {
        this._cells[main][cross] = item.index;
      }
    }
  }

  _arrangeItem(item: Item, itemPosition: ItemPosition): void {
    const config = this._config;
    const itemPositionMain = itemPosition[config.mainPosition];
    const itemPositionCross = itemPosition[config.crossPosition];
    const itemRatioMain = item[config.itemMainRatio] ?? 0;
    const itemRatioCross = item[config.itemCrossRatio] ?? 0;
    const baseItemCross = this.option()[config.baseItemCrossDimension] ?? 0;
    const baseItemMain = this.option()[config.baseItemMainDimension] ?? 0;
    const { itemMargin = 0, rtlEnabled } = this.option();
    const cssProps = { display: itemRatioMain <= 0 || itemRatioCross <= 0 ? 'none' : '' };

    const mainDimension = itemRatioMain * baseItemMain + (itemRatioMain - 1) * itemMargin;
    const crossDimension = itemRatioCross * baseItemCross + (itemRatioCross - 1) * itemMargin;
    cssProps[config.mainDimension] = mainDimension < 0 ? 0 : mainDimension;
    cssProps[config.crossDimension] = crossDimension < 0 ? 0 : crossDimension;
    cssProps[config.mainPosition] = itemPositionMain * baseItemMain
      + (itemPositionMain + 1) * itemMargin;
    cssProps[config.crossPosition] = itemPositionCross * baseItemCross
      + (itemPositionCross + 1) * itemMargin;

    if (rtlEnabled) {
      const offsetCorrection = getWidth(this._$container);
      const { baseItemWidth = 0 } = this.option();
      const itemPositionX = itemPosition.left;
      const offsetPosition = itemPositionX * baseItemWidth;
      const itemBaseOffset = baseItemWidth + itemMargin;
      // @ts-expect-error ts-error
      const itemWidth = itemBaseOffset * item.widthRatio;
      const subItemMargins = itemPositionX * itemMargin;
      // @ts-expect-error ts-error
      cssProps.left = offsetCorrection - (offsetPosition + itemWidth + subItemMargins);
    }
    // @ts-expect-error ts-error
    this._itemElements().eq(item.index).css(cssProps);
  }

  _moveFocus(location: string): void {
    const FOCUS_UP = 'up';
    const FOCUS_DOWN = 'down';
    const FOCUS_LEFT = this.option('rtlEnabled') ? 'right' : 'left';
    const FOCUS_RIGHT = this.option('rtlEnabled') ? 'left' : 'right';
    const FOCUS_PAGE_UP = 'pageup';
    const FOCUS_PAGE_DOWN = 'pagedown';

    const { direction, focusedElement } = this.option();

    const horizontalDirection = direction === 'horizontal';
    const cells = this._cells;
    const index = $(focusedElement).index();
    let targetCol = this._itemsPositions[index].left;
    let targetRow = this._itemsPositions[index].top;

    const colCount = (horizontalDirection ? cells : cells[0]).length;
    const rowCount = (horizontalDirection ? cells[0] : cells).length;
    const getCell = (col: number, row: number): number => {
      if (horizontalDirection) {
        return cells[col][row];
      }
      return cells[row][col];
    };

    switch (location) {
      case FOCUS_PAGE_UP:
      case FOCUS_UP:
        while (targetRow > 0 && index === getCell(targetCol, targetRow)) {
          targetRow -= 1;
        }
        if (targetRow < 0) {
          targetRow = 0;
        }
        break;
      case FOCUS_PAGE_DOWN:
      case FOCUS_DOWN:
        while (targetRow < rowCount && index === getCell(targetCol, targetRow)) {
          targetRow += 1;
        }

        if (targetRow === rowCount) {
          targetRow = rowCount - 1;
        }
        break;
      case FOCUS_RIGHT:
        while (targetCol < colCount && index === getCell(targetCol, targetRow)) {
          targetCol += 1;
        }

        if (targetCol === colCount) {
          targetCol = colCount - 1;
        }
        break;
      case FOCUS_LEFT:
        while (targetCol >= 0 && index === getCell(targetCol, targetRow)) {
          targetCol -= 1;
        }
        if (targetCol < 0) {
          targetCol = 0;
        }
        break;
      default:
        super._moveFocus(location);
        return;
    }

    const newTargetIndex = getCell(targetCol, targetRow);
    if (!isDefined(newTargetIndex)) {
      return;
    }

    const $newTarget = this._itemElements().eq(newTargetIndex);
    this.option('focusedElement', getPublicElement($newTarget));
    this._scrollToItem($newTarget);
  }

  _scrollToItem($itemElement: dxElementWrapper): void {
    if (!$itemElement.length) {
      return;
    }

    const config = this._config;
    const outerMainGetter = config.mainDimension === 'width' ? getOuterWidth : getOuterHeight;
    const { itemMargin = 0 } = this.option();
    // @ts-expect-error ts-error
    const itemPosition = $itemElement.position()[config.mainPosition];
    const itemDimension = outerMainGetter($itemElement);
    const itemTail = itemPosition + itemDimension;
    const scrollPosition = this.scrollPosition();
    const clientWidth = outerMainGetter(this.$element());

    if (scrollPosition <= itemPosition && itemTail <= scrollPosition + clientWidth) {
      return;
    }

    if (scrollPosition > itemPosition) {
      this._scrollView.scrollTo(itemPosition - itemMargin);
    } else {
      this._scrollView.scrollTo(itemPosition + itemDimension - clientWidth + itemMargin);
    }
  }

  _optionChanged(args: OptionChanged<TileViewProperties>): void {
    const { name, value } = args;

    switch (name) {
      case 'items':
        super._optionChanged(args);
        this._renderGeometry();
        this._updateScrollView();
        break;
      case 'showScrollbar':
        this._initScrollView();
        break;
      case 'disabled':
        this._scrollView.option('disabled', value);
        super._optionChanged(args);
        break;
      case 'baseItemWidth':
      case 'baseItemHeight':
      case 'itemMargin':
        this._renderGeometry();
        break;
      case 'width':
      case 'height':
        super._optionChanged(args);
        this._renderGeometry();
        this._scrollView.option(name, value);
        this._updateScrollView();
        break;
      case 'direction':
        this._renderGeometry();
        this._updateScrollView();
        break;
      case 'indicateLoading':
        this._hideLoadingIfLoadIndicationOff();
        break;
      default:
        super._optionChanged(args);
    }
  }

  scrollPosition(): number {
    return this._scrollView.scrollOffset()[this._config.mainPosition];
  }
}

registerComponent('dxTileView', TileView);

export default TileView;
