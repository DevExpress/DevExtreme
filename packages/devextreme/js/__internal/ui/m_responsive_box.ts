import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
// @ts-expect-error ts-error
import { grep } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import { getWidth } from '@js/core/utils/size';
import { isDefined, isEmptyObject, isPlainObject } from '@js/core/utils/type';
// @ts-expect-error ts-error
import { defaultScreenFactorFunc, getWindow, hasWindow } from '@js/core/utils/window';
import type { BoxDirection, Properties as BoxProperties } from '@js/ui/box';
import Box from '@js/ui/box';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.edit';
import type { Properties } from '@js/ui/responsive_box';
import errors from '@js/ui/widget/ui.errors';
import type { OptionChanged } from '@ts/core/widget/types';

// STYLE responsiveBox

const RESPONSIVE_BOX_CLASS = 'dx-responsivebox';
const SCREEN_SIZE_CLASS_PREFIX = `${RESPONSIVE_BOX_CLASS}-screen-`;
const BOX_ITEM_CLASS = 'dx-box-item';
const BOX_ITEM_DATA_KEY = 'dxBoxItemData';

const HD_SCREEN_WIDTH = 1920;

interface SizeConfig {
  ratio?: number;
  baseSize?: number;
  shrink?: number;
  minSize?: number;
  maxSize?: number;
}

export interface ResponsiveBoxProperties extends Properties {
  onLayoutChanged?: (() => void) | null;

  currentScreenFactor?: string;
}

class ResponsiveBox extends CollectionWidget<ResponsiveBoxProperties> {
  _assistantRoots?: dxElementWrapper[];

  _layoutChangedAction?: () => void;

  _screenItems?: Record<string, unknown>[];

  _$root?: dxElementWrapper;

  _rows!: {
    baseSize?: number | string;
    ratio?: number;
    screen?: string;
    shrink?: number;
  }[];

  _cols!: {
    baseSize?: number | string;
    ratio?: number;
    screen?: string;
    shrink?: number;
  }[];

  _grid!: Record<string, unknown>[][];

  _getDefaultOptions(): ResponsiveBoxProperties {
    return {
      ...super._getDefaultOptions(),
      rows: [],
      cols: [],
      // @ts-expect-error ts-error
      screenByWidth: null,
      singleColumnScreen: '',
      height: '100%',
      width: '100%',
      activeStateEnabled: false,
      focusStateEnabled: false,
      onLayoutChanged: null,
    };
  }

  _init(): void {
    if (!this.option('screenByWidth')) {
      this._options.silent('screenByWidth', defaultScreenFactorFunc);
    }

    super._init();
    this._initLayoutChangedAction();
  }

  _initLayoutChangedAction(): void {
    this._layoutChangedAction = this._createActionByOption('onLayoutChanged', {
      excludeValidators: ['disabled', 'readOnly'],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  _itemClass(): string {
    return BOX_ITEM_CLASS;
  }

  // eslint-disable-next-line class-methods-use-this
  _itemDataKey(): string {
    return BOX_ITEM_DATA_KEY;
  }

  _initMarkup(): void {
    super._initMarkup();
    this.$element().addClass(RESPONSIVE_BOX_CLASS);
  }

  _renderItems(): void {
    this._setScreenSize();

    this._screenItems = this._itemsByScreen();

    this._prepareGrid();
    this._spreadItems();
    this._layoutItems();
    this._linkNodeToItem();
  }

  _itemOptionChanged(item): void {
    const $item = this._findItemElementByItem(item);
    if (!$item.length) {
      return;
    }

    this._refreshItem($item, item);
    this._clearItemNodeTemplates();
    this._update(true);
  }

  _setScreenSize(): void {
    const currentScreen = this._getCurrentScreen();

    this._removeScreenSizeClass();

    this.$element().addClass(SCREEN_SIZE_CLASS_PREFIX + currentScreen);
    this.option('currentScreenFactor', currentScreen);
  }

  _removeScreenSizeClass(): void {
    const { currentScreenFactor } = this.option();

    if (currentScreenFactor) {
      this.$element().removeClass(SCREEN_SIZE_CLASS_PREFIX + currentScreenFactor);
    }
  }

  _prepareGrid(): void {
    const grid = this._grid = [];

    this._prepareRowsAndCols();

    each(this._rows, () => {
      const row = [];
      // @ts-expect-error
      grid.push(row);

      each(this._cols, () => {
        // @ts-expect-error
        row.push(this._createEmptyCell());
      });
    });
  }

  getSingleColumnRows() {
    const { rows } = this.option();
    // @ts-expect-error ts-error
    const screenItemsLength = this._screenItems.length;

    if (rows?.length) {
      const filteredRows = this._filterByScreen(rows);
      const result = [];

      for (let i = 0; i < screenItemsLength; i++) {
        const sizeConfig = this._defaultSizeConfig();
        if (i < filteredRows.length && isDefined(filteredRows[i].shrink)) {
          // @ts-expect-error ts-error
          sizeConfig.shrink = filteredRows[i].shrink;
        }
        // @ts-expect-error ts-error
        result.push(sizeConfig);
      }
      return result;
    }
    return this._defaultSizeConfig(screenItemsLength);
  }

  _prepareRowsAndCols(): void {
    if (this._isSingleColumnScreen()) {
      this._prepareSingleColumnScreenItems();
      // @ts-expect-error ts-error
      this._rows = this.getSingleColumnRows();
      // @ts-expect-error ts-error
      this._cols = this._defaultSizeConfig(1);
    } else {
      this._rows = this._sizesByScreen(this.option('rows'));
      this._cols = this._sizesByScreen(this.option('cols'));
    }
  }

  _isSingleColumnScreen(): boolean {
    const { singleColumnScreen, rows, cols } = this.option();
    // @ts-expect-error ts-error
    return this._screenRegExp().test(singleColumnScreen)
      || !rows?.length || !cols?.length;
  }

  _prepareSingleColumnScreenItems() {
    // @ts-expect-error ts-error
    this._screenItems.sort((item1, item2) => (item1.location.row - item2.location.row) || (item1.location.col - item2.location.col));

    each(this._screenItems, (index, item) => {
      extend(item.location, {
        row: index, col: 0, rowspan: 1, colspan: 1,
      });
    });
  }

  _sizesByScreen(sizeConfigs) {
    return map(this._filterByScreen(sizeConfigs), (sizeConfig) => extend(this._defaultSizeConfig(), sizeConfig));
  }

  // eslint-disable-next-line class-methods-use-this
  _createDefaultSizeConfig(): SizeConfig {
    return {
      ratio: 1, baseSize: 0, minSize: 0, maxSize: 0,
    };
  }

  _defaultSizeConfig(size?: number): SizeConfig | SizeConfig[] {
    const defaultSizeConfig = this._createDefaultSizeConfig();
    if (!arguments.length) {
      return defaultSizeConfig;
    }

    const result: SizeConfig[] = [];
    // @ts-expect-error ts-error
    for (let i = 0; i < size; i++) {
      result.push(defaultSizeConfig);
    }
    return result;
  }

  _filterByScreen(items) {
    const screenRegExp = this._screenRegExp();

    return grep(items, (item) => !item.screen || screenRegExp.test(item.screen));
  }

  _screenRegExp(): RegExp {
    const screen = this._getCurrentScreen();
    return new RegExp(`(^|\\s)${screen}($|\\s)`, 'i');
  }

  _getCurrentScreen() {
    const width = this._screenWidth();
    const { screenByWidth } = this.option();

    return screenByWidth?.(width);
  }

  _screenWidth() {
    return hasWindow() ? getWidth(getWindow()) : HD_SCREEN_WIDTH;
  }

  _createEmptyCell() {
    return {
      item: {},
      location: { colspan: 1, rowspan: 1 },
    };
  }

  _spreadItems() {
    each(this._screenItems, (_, itemInfo) => {
      const location = itemInfo.location || {};
      const itemCol = location.col;
      const itemRow = location.row;
      const row = this._grid[itemRow];
      const itemCell = row?.[itemCol];

      this._occupyCells(itemCell, itemInfo);
    });
  }

  _itemsByScreen(): Record<string, unknown>[] {
    const { items } = this.option();

    return items?.reduce((result, item) => {
      let locations = item.location || {};
      locations = isPlainObject(locations) ? [locations] : locations;

      this._filterByScreen(locations).forEach((location) => {
        result.push({
          item,
          location: extend({ rowspan: 1, colspan: 1 }, location),
        });
      });

      return result;
    }, []);
  }

  _occupyCells(itemCell, itemInfo) {
    if (!itemCell || this._isItemCellOccupied(itemCell, itemInfo)) {
      return;
    }

    extend(itemCell, itemInfo);
    this._markSpanningCell(itemCell);
  }

  _isItemCellOccupied(itemCell, itemInfo) {
    if (!isEmptyObject(itemCell.item)) {
      return true;
    }

    let result = false;
    this._loopOverSpanning(itemInfo.location, (cell) => {
      result = result || !isEmptyObject(cell.item);
    });
    return result;
  }

  _loopOverSpanning(location, callback) {
    const rowEnd = location.row + location.rowspan - 1;
    const colEnd = location.col + location.colspan - 1;
    const boundRowEnd = Math.min(rowEnd, this._rows.length - 1);
    const boundColEnd = Math.min(colEnd, this._cols.length - 1);
    location.rowspan -= rowEnd - boundRowEnd;
    location.colspan -= colEnd - boundColEnd;

    for (let rowIndex = location.row; rowIndex <= boundRowEnd; rowIndex++) {
      for (let colIndex = location.col; colIndex <= boundColEnd; colIndex++) {
        if ((rowIndex !== location.row) || (colIndex !== location.col)) {
          callback(this._grid[rowIndex][colIndex]);
        }
      }
    }
  }

  _markSpanningCell(itemCell) {
    this._loopOverSpanning(itemCell.location, (cell) => {
      extend(cell, {
        item: itemCell.item,
        spanningCell: itemCell,
      });
    });
  }

  _linkNodeToItem() {
    each(this._itemElements(), (_, itemNode) => {
      const $item = $(itemNode);
      const item = $item.data(BOX_ITEM_DATA_KEY);
      // @ts-expect-error
      if (!item.box) {
        // @ts-expect-error
        item.node = $item.children();
      }
    });
  }

  _layoutItems(): void {
    const rowsCount = this._grid.length;
    const colsCount = rowsCount && this._grid[0].length;

    if (!rowsCount && !colsCount) {
      return;
    }

    const result = this._layoutBlock({
      direction: 'col',
      row: { start: 0, end: rowsCount - 1 },
      col: { start: 0, end: colsCount - 1 },
    });
    // @ts-expect-error ts-error
    const rootBox = this._prepareBoxConfig(result.box || { direction: 'row', items: [extend(result, { ratio: 1 })] });
    extend(rootBox, this._rootBoxConfig(rootBox.items));

    this._$root = $('<div>').appendTo(this._itemContainer());
    this._createComponent(this._$root, Box, rootBox);
  }

  _rootBoxConfig(items): BoxProperties {
    const rootItems = each(items, (index, item) => {
      this._needApplyAutoBaseSize(item) && extend(item, { baseSize: 'auto' });
    });

    const { itemHoldTimeout } = this.option();

    return {
      width: '100%',
      height: '100%',
      items: rootItems,
      itemTemplate: this._getTemplateByOption('itemTemplate'),
      itemHoldTimeout,
      onItemHold: this._createActionByOption('onItemHold'),
      onItemClick: this._createActionByOption('onItemClick'),
      onItemContextMenu: this._createActionByOption('onItemContextMenu'),
      onItemRendered: this._createActionByOption('onItemRendered'),
    };
  }

  _needApplyAutoBaseSize(item) {
    return !item.baseSize && (!item.minSize || item.minSize === 'auto') && (!item.maxSize || item.maxSize === 'auto');
  }

  _prepareBoxConfig(config) {
    return extend(config || {}, {
      crossAlign: 'stretch',
      onItemStateChanged: this.option('onItemStateChanged'),
    });
  }

  _layoutBlock(options) {
    if (this._isSingleItem(options)) {
      return this._itemByCell(options.row.start, options.col.start);
    }

    return this._layoutDirection(options);
  }

  _isSingleItem(options): boolean {
    const firstCellLocation = this._grid[options.row.start][options.col.start].location;
    // @ts-expect-error ts-error
    const isItemRowSpanned = (options.row.end - options.row.start) === (firstCellLocation.rowspan - 1);
    // @ts-expect-error ts-error
    const isItemColSpanned = (options.col.end - options.col.start) === (firstCellLocation.colspan - 1);

    return isItemRowSpanned && isItemColSpanned;
  }

  _itemByCell(rowIndex, colIndex) {
    const itemCell = this._grid[rowIndex][colIndex];
    return itemCell.spanningCell ? null : itemCell.item;
  }

  _layoutDirection(options) {
    const items = [];
    const { direction } = options;
    const crossDirection = this._crossDirection(direction);

    let block;
    // eslint-disable-next-line no-cond-assign
    while (block = this._nextBlock(options)) {
      if (this._isBlockIndivisible(options.prevBlockOptions, block)) {
        throw errors.Error('E1025');
      }

      const item = this._layoutBlock({
        direction: crossDirection,
        row: block.row,
        col: block.col,
        prevBlockOptions: options,
      });

      if (item) {
        extend(item, this._blockSize(block, crossDirection));
        // @ts-expect-error
        items.push(item);
      }

      options[crossDirection].start = block[crossDirection].end + 1;
    }

    return {
      box: this._prepareBoxConfig({ direction, items }),
    };
  }

  _isBlockIndivisible(options, block): boolean {
    return options
        && options.col.start === block.col.start
        && options.col.end === block.col.end
        && options.row.start === block.row.start
        && options.row.end === block.row.end;
  }

  // eslint-disable-next-line class-methods-use-this
  _crossDirection(direction: BoxDirection): BoxDirection {
    return direction === 'col' ? 'row' : 'col';
  }

  _nextBlock(options) {
    const { direction } = options;
    const crossDirection = this._crossDirection(direction);
    const startIndex = options[direction].start;
    const endIndex = options[direction].end;
    const crossStartIndex = options[crossDirection].start;

    if (crossStartIndex > options[crossDirection].end) {
      return null;
    }

    let crossSpan = 1;
    for (let crossIndex = crossStartIndex; crossIndex < crossStartIndex + crossSpan; crossIndex++) {
      let lineCrossSpan = 1;
      for (let index = startIndex; index <= endIndex; index++) {
        const cell = this._cellByDirection(direction, index, crossIndex);
        // @ts-expect-error ts-error
        lineCrossSpan = Math.max(lineCrossSpan, cell.location[`${crossDirection}span`]);
      }

      const lineCrossEndIndex = crossIndex + lineCrossSpan;
      const crossEndIndex = crossStartIndex + crossSpan;
      if (lineCrossEndIndex > crossEndIndex) {
        crossSpan += lineCrossEndIndex - crossEndIndex;
      }
    }

    const result = {};
    result[direction] = { start: startIndex, end: endIndex };
    result[crossDirection] = { start: crossStartIndex, end: crossStartIndex + crossSpan - 1 };
    return result;
  }

  _cellByDirection(direction, index, crossIndex) {
    return direction === 'col'
      ? this._grid[crossIndex][index]
      : this._grid[index][crossIndex];
  }

  _blockSize(block, direction) {
    const defaultMinSize = direction === 'row' ? 'auto' : 0;
    const sizeConfigs = direction === 'row' ? this._rows : this._cols;
    const result = extend(this._createDefaultSizeConfig(), { ratio: 0 });

    for (let index = block[direction].start; index <= block[direction].end; index++) {
      const sizeConfig = sizeConfigs[index];
      result.ratio += sizeConfig.ratio;
      result.baseSize += sizeConfig.baseSize;
      // @ts-expect-error ts-error
      result.minSize += sizeConfig.minSize;
      // @ts-expect-error ts-error
      result.maxSize += sizeConfig.maxSize;

      if (isDefined(sizeConfig.shrink)) {
        result.shrink = sizeConfig.shrink;
      }
    }

    result.minSize = result.minSize ? result.minSize : defaultMinSize;
    result.maxSize = result.maxSize ? result.maxSize : 'auto';

    this._isSingleColumnScreen() && (result.baseSize = 'auto');

    return result;
  }

  _update(forceRemoveRoot?: boolean): void {
    const $existingRoot = this._$root;
    this._renderItems();

    if ($existingRoot) {
      if (forceRemoveRoot) {
        $existingRoot.remove();
      } else {
        $existingRoot.detach();
        this._saveAssistantRoot($existingRoot);
      }
    }

    this._layoutChangedAction?.();
  }

  _saveAssistantRoot($root: dxElementWrapper): void {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    this._assistantRoots = this._assistantRoots || [];
    this._assistantRoots.push($root);
  }

  _dispose(): void {
    this._clearItemNodeTemplates();
    this._cleanUnusedRoots();
    // @ts-expect-error ts-error
    super._dispose.apply(this, arguments);
  }

  _cleanUnusedRoots(): void {
    if (!this._assistantRoots) {
      return;
    }

    each(this._assistantRoots, (_, item) => {
      $(item).remove();
    });
  }

  _clearItemNodeTemplates(): void {
    each(this.option('items'), function () {
      delete this.node;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  _attachClickEvent(): void {}

  _optionChanged(args: OptionChanged<ResponsiveBoxProperties>): void {
    switch (args.name) {
      case 'rows':
      case 'cols':
      case 'screenByWidth':
      case 'singleColumnScreen':
        this._clearItemNodeTemplates();
        this._invalidate();
        break;
      case 'width':
      case 'height':
        super._optionChanged(args);
        this._update();
        break;
      case 'onLayoutChanged':
        this._initLayoutChangedAction();
        break;
      case 'itemTemplate':
        this._clearItemNodeTemplates();
        super._optionChanged(args);
        break;
      case 'currentScreenFactor':
        break;
      default:
        super._optionChanged(args);
    }
  }

  _dimensionChanged(): void {
    if (this._getCurrentScreen() !== this.option('currentScreenFactor')) {
      this._update();
    }
  }

  repaint(): void {
    this._update();
  }
}

registerComponent('dxResponsiveBox', ResponsiveBox);

export default ResponsiveBox;
