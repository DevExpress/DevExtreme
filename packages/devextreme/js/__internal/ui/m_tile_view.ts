import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import { deferRender, noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
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
import CollectionWidget from '@js/ui/collection/ui.collection_widget.edit';
import ScrollView from '@js/ui/scroll_view';

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
};

const TileView = CollectionWidget.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
      items: null,
      direction: 'horizontal',
      hoverStateEnabled: true,
      showScrollbar: 'never',
      height: 500,
      baseItemWidth: 100,
      baseItemHeight: 100,
      itemMargin: 20,
      activeStateEnabled: true,
      indicateLoading: true,
    });
  },

  _defaultOptionsRules() {
    return this.callBase().concat([
      {
        device() {
          return devices.real().deviceType === 'desktop' && !devices.isSimulator();
        },
        options: {
          focusStateEnabled: true,
        },
      },
      {
        device() {
          return supportUtils.nativeScrolling;
        },
        options: {
          showScrollbar: 'onScroll',
        },
      },
    ]);
  },

  _itemClass() {
    return TILEVIEW_ITEM_CLASS;
  },

  _itemDataKey() {
    return TILEVIEW_ITEM_DATA_KEY;
  },

  _itemContainer() {
    return this._$container;
  },

  _init() {
    this.callBase();

    this._activeStateUnit = TILEVIEW_ITEM_SELECTOR;

    this.$element().addClass(TILEVIEW_CLASS);
    this._initScrollView();
  },

  _dataSourceLoadingChangedHandler(isLoading) {
    const scrollView = this._scrollView;

    if (!scrollView || !scrollView.startLoading) {
      return;
    }

    if (isLoading && this.option('indicateLoading')) {
      scrollView.startLoading();
    } else {
      scrollView.finishLoading();
    }
  },

  _hideLoadingIfLoadIndicationOff() {
    if (!this.option('indicateLoading')) {
      this._dataSourceLoadingChangedHandler(false);
    }
  },

  _initScrollView() {
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
  },

  _initMarkup() {
    this.callBase();

    deferRender(() => {
      this._cellsPerDimension = 1;

      this._renderGeometry();
      this._updateScrollView();
      this._fireContentReadyAction();
    });
  },

  _updateScrollView() {
    this._scrollView.option('direction', this.option('direction'));
    this._scrollView.update();
    this._indicateLoadingIfAlreadyStarted();
  },

  _indicateLoadingIfAlreadyStarted() {
    if (this._isDataSourceLoading()) {
      this._dataSourceLoadingChangedHandler(true);
    }
  },

  _renderGeometry() {
    this._config = CONFIGS[this.option('direction')];

    const items = this.option('items') || [];
    const config = this._config;
    const itemMargin = this.option('itemMargin');
    const maxItemCrossRatio = Math.max.apply(Math, map(items || [], (item) => Math.round(item[config.itemCrossRatio] || 1)));

    let crossDimensionValue;
    // @ts-expect-error
    if (hasWindow) {
      crossDimensionValue = (config.crossDimension === 'width' ? getWidth : getHeight)(this.$element());
    } else {
      // eslint-disable-next-line radix
      crossDimensionValue = parseInt(this.$element().get(0).style[config.crossDimension]);
    }

    this._cellsPerDimension = Math.floor(crossDimensionValue / (this.option(config.baseItemCrossDimension) + itemMargin));
    this._cellsPerDimension = Math.max(this._cellsPerDimension, maxItemCrossRatio);
    this._cells = [];
    this._cells.push(new Array(this._cellsPerDimension));

    this._arrangeItems(items);
    this._renderContentSize(config, itemMargin);
  },

  _renderContentSize({ mainDimension, baseItemMainDimension }, itemMargin) {
    if (hasWindow()) {
      const actualContentSize = this._cells.length * this.option(baseItemMainDimension) + (this._cells.length + 1) * itemMargin;
      const elementSize = (mainDimension === 'width' ? getWidth : getHeight)(this.$element());

      (mainDimension === 'width' ? setWidth : setHeight)(this._$container, Math.max(actualContentSize, elementSize));
    }
  },

  _arrangeItems(items) {
    const config = this._config;
    const { itemMainRatio } = config;
    const { itemCrossRatio } = config;
    const { mainPosition } = config;

    this._itemsPositions = [];

    each(items, (index, item) => {
      const currentItem = {};
      currentItem[itemMainRatio] = item[itemMainRatio] || 1;
      currentItem[itemCrossRatio] = item[itemCrossRatio] || 1;
      // @ts-expect-error
      currentItem.index = index;

      currentItem[itemMainRatio] = currentItem[itemMainRatio] <= 0 ? 0 : Math.round(currentItem[config.itemMainRatio]);
      currentItem[itemCrossRatio] = currentItem[itemCrossRatio] <= 0 ? 0 : Math.round(currentItem[config.itemCrossRatio]);

      const itemPosition = this._getItemPosition(currentItem);

      if (itemPosition[mainPosition] === -1) {
        itemPosition[mainPosition] = this._cells.push(new Array(this._cellsPerDimension)) - 1;
      }

      this._occupyCells(currentItem, itemPosition);

      this._arrangeItem(currentItem, itemPosition);

      this._itemsPositions.push(itemPosition);
    });
  },

  _refreshActiveDescendant: noop,

  _getItemPosition(item) {
    const config = this._config;
    const { mainPosition } = config;
    const { crossPosition } = config;

    const position = {};
    position[mainPosition] = -1;
    position[crossPosition] = 0;

    for (let main = 0; main < this._cells.length; main++) {
      for (let cross = 0; cross < this._cellsPerDimension; cross++) {
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
  },

  _itemFit(mainPosition, crossPosition, item) {
    let result = true;

    const config = this._config;
    const itemRatioMain = item[config.itemMainRatio];
    const itemRatioCross = item[config.itemCrossRatio];

    if (crossPosition + itemRatioCross > this._cellsPerDimension) {
      return false;
    }

    for (let main = mainPosition; main < mainPosition + itemRatioMain; main++) {
      for (let cross = crossPosition; cross < crossPosition + itemRatioCross; cross++) {
        if (this._cells.length - 1 < main) {
          this._cells.push(new Array(this._cellsPerDimension));
        } else if (this._cells[main][cross] !== undefined) {
          result = false;
          break;
        }
      }
    }

    return result;
  },

  _occupyCells(item, itemPosition) {
    const config = this._config;
    const itemPositionMain = itemPosition[config.mainPosition];
    const itemPositionCross = itemPosition[config.crossPosition];
    const itemRatioMain = item[config.itemMainRatio];
    const itemRatioCross = item[config.itemCrossRatio];

    for (let main = itemPositionMain; main < itemPositionMain + itemRatioMain; main++) {
      for (let cross = itemPositionCross; cross < itemPositionCross + itemRatioCross; cross++) {
        this._cells[main][cross] = item.index;
      }
    }
  },

  _arrangeItem(item, itemPosition) {
    const config = this._config;
    const itemPositionMain = itemPosition[config.mainPosition];
    const itemPositionCross = itemPosition[config.crossPosition];
    const itemRatioMain = item[config.itemMainRatio];
    const itemRatioCross = item[config.itemCrossRatio];
    const baseItemCross = this.option(config.baseItemCrossDimension);
    const baseItemMain = this.option(config.baseItemMainDimension);
    const itemMargin = this.option('itemMargin');

    const cssProps = { display: itemRatioMain <= 0 || itemRatioCross <= 0 ? 'none' : '' };
    const mainDimension = itemRatioMain * baseItemMain + (itemRatioMain - 1) * itemMargin;
    const crossDimension = itemRatioCross * baseItemCross + (itemRatioCross - 1) * itemMargin;
    cssProps[config.mainDimension] = mainDimension < 0 ? 0 : mainDimension;
    cssProps[config.crossDimension] = crossDimension < 0 ? 0 : crossDimension;
    cssProps[config.mainPosition] = itemPositionMain * baseItemMain + (itemPositionMain + 1) * itemMargin;
    cssProps[config.crossPosition] = itemPositionCross * baseItemCross + (itemPositionCross + 1) * itemMargin;

    if (this.option('rtlEnabled')) {
      const offsetCorrection = getWidth(this._$container);
      const baseItemWidth = this.option('baseItemWidth');
      const itemPositionX = itemPosition.left;
      const offsetPosition = itemPositionX * baseItemWidth;
      const itemBaseOffset = baseItemWidth + itemMargin;
      const itemWidth = itemBaseOffset * item.widthRatio;
      const subItemMargins = itemPositionX * itemMargin;
      // @ts-expect-error
      cssProps.left = offsetCorrection - (offsetPosition + itemWidth + subItemMargins);
    }

    this._itemElements().eq(item.index).css(cssProps);
  },

  _moveFocus(location) {
    const FOCUS_UP = 'up';
    const FOCUS_DOWN = 'down';
    const FOCUS_LEFT = this.option('rtlEnabled') ? 'right' : 'left';
    const FOCUS_RIGHT = this.option('rtlEnabled') ? 'left' : 'right';
    const FOCUS_PAGE_UP = 'pageup';
    const FOCUS_PAGE_DOWN = 'pagedown';

    const horizontalDirection = this.option('direction') === 'horizontal';
    const cells = this._cells;
    const index = $(this.option('focusedElement')).index();
    let targetCol = this._itemsPositions[index].left;
    let targetRow = this._itemsPositions[index].top;

    const colCount = (horizontalDirection ? cells : cells[0]).length;
    const rowCount = (horizontalDirection ? cells[0] : cells).length;
    const getCell = function (col, row) {
      if (horizontalDirection) {
        return cells[col][row];
      }
      return cells[row][col];
    };

    switch (location) {
      case FOCUS_PAGE_UP:
      case FOCUS_UP:
        while (targetRow > 0 && index === getCell(targetCol, targetRow)) {
          targetRow--;
        }

        if (targetRow < 0) {
          targetRow = 0;
        }
        break;
      case FOCUS_PAGE_DOWN:
      case FOCUS_DOWN:
        while (targetRow < rowCount && index === getCell(targetCol, targetRow)) {
          targetRow++;
        }

        if (targetRow === rowCount) {
          targetRow = rowCount - 1;
        }
        break;
      case FOCUS_RIGHT:
        while (targetCol < colCount && index === getCell(targetCol, targetRow)) {
          targetCol++;
        }

        if (targetCol === colCount) {
          targetCol = colCount - 1;
        }
        break;
      case FOCUS_LEFT:
        while (targetCol >= 0 && index === getCell(targetCol, targetRow)) {
          targetCol--;
        }

        if (targetCol < 0) {
          targetCol = 0;
        }
        break;
      default:
        this.callBase.apply(this, arguments);
        return;
    }

    const newTargetIndex = getCell(targetCol, targetRow);
    if (!isDefined(newTargetIndex)) {
      return;
    }

    const $newTarget = this._itemElements().eq(newTargetIndex);
    this.option('focusedElement', getPublicElement($newTarget));
    this._scrollToItem($newTarget);
  },

  _scrollToItem($itemElement) {
    if (!$itemElement.length) {
      return;
    }

    const config = this._config;
    const outerMainGetter = config.mainDimension === 'width' ? getOuterWidth : getOuterHeight;
    const itemMargin = this.option('itemMargin');
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
  },

  _optionChanged(args) {
    switch (args.name) {
      case 'items':
        this.callBase(args);
        this._renderGeometry();
        this._updateScrollView();
        break;
      case 'showScrollbar':
        this._initScrollView();
        break;
      case 'disabled':
        this._scrollView.option('disabled', args.value);
        this.callBase(args);
        break;
      case 'baseItemWidth':
      case 'baseItemHeight':
      case 'itemMargin':
        this._renderGeometry();
        break;
      case 'width':
      case 'height':
        this.callBase(args);
        this._renderGeometry();
        this._scrollView.option(args.name, args.value);
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
        this.callBase(args);
    }
  },

  scrollPosition() {
    return this._scrollView.scrollOffset()[this._config.mainPosition];
  },

});

registerComponent('dxTileView', TileView);

export default TileView;
