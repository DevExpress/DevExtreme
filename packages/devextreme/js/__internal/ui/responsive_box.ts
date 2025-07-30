import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
// @ts-expect-error ts-error
import { grep } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import { each, map } from '@js/core/utils/iterator';
import { getWidth } from '@js/core/utils/size';
import { isDefined, isEmptyObject, isPlainObject } from '@js/core/utils/type';
import {
  // @ts-expect-error ts-error
  defaultScreenFactorFunc,
  getWindow,
  hasWindow,
} from '@js/core/utils/window';
import type { EventInfo } from '@js/events';
import type { BoxDirection } from '@js/ui/box';
import CollectionWidget from '@js/ui/collection/ui.collection_widget.edit';
import type { Item, Properties } from '@js/ui/responsive_box';
import errors from '@js/ui/widget/ui.errors';
import type { OptionChanged } from '@ts/core/widget/types';
import type { BoxItemData, BoxProperties } from '@ts/ui/box';
import Box from '@ts/ui/box';

// STYLE responsiveBox

const RESPONSIVE_BOX_CLASS = 'dx-responsivebox';
const SCREEN_SIZE_CLASS_PREFIX = `${RESPONSIVE_BOX_CLASS}-screen-`;
const BOX_ITEM_CLASS = 'dx-box-item';
const BOX_ITEM_DATA_KEY = 'dxBoxItemData';

const HD_SCREEN_WIDTH = 1920;

export type ScreenSizeQualifier = 'xs' | 'sm' | 'md' | 'lg';

interface BlockRange { start: number; end: number }
type BoxOptions = BoxProperties<BoxItemData, string | number>;

type LocationObject = Extract<Item['location'], unknown[]>;
export type LocationItem = LocationObject extends (infer U)[] ? U : LocationObject;

export type ResponsiveBoxItem<T = LocationItem | LocationItem[]> = BoxItemData & {
  location?: T;
  item?: ResponsiveBoxItem;
};

interface BlockOptions {
  direction: BoxDirection;
  row: BlockRange;
  col: BlockRange;
  prevBlockOptions?: BlockOptions;
}

export interface GridCell {
  item: ResponsiveBoxItem;
  location: {
    row?: number;
    col?: number;
    rowspan: number;
    colspan: number;
  };
  spanningCell?: GridCell;
}

export interface ResponsiveBoxProperties extends Omit<Properties<Item>, 'onContentReady'> {
  onLayoutChanged?: (() => void) | null;

  currentScreenFactor?: ScreenSizeQualifier;

  onItemStateChanged?: (args: {
    name: string;
    state: unknown;
    oldState: unknown;
  }) => void;

  onContentReady?: (e: EventInfo<ResponsiveBox>) => void;
}

class ResponsiveBox extends CollectionWidget<ResponsiveBoxProperties> {
  _assistantRoots?: dxElementWrapper[];

  _layoutChangedAction?: () => void;

  _screenItems?: ResponsiveBoxItem[];

  _$root?: dxElementWrapper;

  _rows!: ResponsiveBoxItem[];

  _cols!: ResponsiveBoxItem[];

  _grid!: GridCell[][];

  _getDefaultOptions(): ResponsiveBoxProperties {
    return {
      ...super._getDefaultOptions(),
      rows: [],
      cols: [],
      singleColumnScreen: '',
      // @ts-expect-error ts-error
      screenByWidth: null,
      height: '100%',
      width: '100%',
      activeStateEnabled: false,
      focusStateEnabled: false,
      onLayoutChanged: null,
    };
  }

  _init(): void {
    const { screenByWidth } = this.option();
    if (!screenByWidth) {
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

  _itemClass(): string {
    return BOX_ITEM_CLASS;
  }

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

  _itemOptionChanged(item: Item): void {
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
    this._grid = [];

    this._prepareRowsAndCols();

    each(this._rows, () => {
      const row: GridCell[] = [];
      this._grid.push(row);

      each(this._cols, () => {
        row.push(this._createEmptyCell());
      });
    });
  }

  getSingleColumnRows(): BoxItemData[] {
    const { rows } = this.option();
    // @ts-expect-error ts-error
    const screenItemsLength = this._screenItems.length;

    if (rows?.length) {
      const filteredRows = this._filterByScreen(rows);
      const result: BoxItemData[] = [];

      for (let i = 0; i < screenItemsLength; i += 1) {
        const sizeConfig = this._defaultSizeConfig();
        if (i < filteredRows.length && isDefined(filteredRows[i].shrink)) {
          sizeConfig.shrink = filteredRows[i].shrink;
        }
        result.push(sizeConfig);
      }
      return result;
    }
    return this._defaultSizeConfig(screenItemsLength);
  }

  _prepareRowsAndCols(): void {
    if (this._isSingleColumnScreen()) {
      this._prepareSingleColumnScreenItems();

      this._rows = this.getSingleColumnRows();
      this._cols = this._defaultSizeConfig(1);
    } else {
      const { rows, cols } = this.option();

      this._rows = this._sizesByScreen(rows);
      this._cols = this._sizesByScreen(cols);
    }
  }

  _isSingleColumnScreen(): boolean {
    const { singleColumnScreen, rows, cols } = this.option();
    // @ts-expect-error ts-error
    return this._screenRegExp().test(singleColumnScreen)
      || !rows?.length || !cols?.length;
  }

  _prepareSingleColumnScreenItems(): void {
    // @ts-expect-error ts-error
    this._screenItems.sort((
      item1,
      item2,
      // @ts-expect-error ts-error
    ) => (item1.location.row - item2.location.row) || (item1.location.col - item2.location.col));

    each(this._screenItems, (index, item) => {
      Object.assign(item.location, {
        row: index,
        col: 0,
        rowspan: 1,
        colspan: 1,
      });
    });
  }

  _sizesByScreen(sizeConfigs: ResponsiveBoxItem[] | undefined): ResponsiveBoxItem[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return map(
      this._filterByScreen(sizeConfigs),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (sizeConfig) => extend(this._defaultSizeConfig(), sizeConfig),
    );
  }

  _createDefaultSizeConfig(): ResponsiveBoxItem {
    return {
      ratio: 1, baseSize: 0, minSize: 0, maxSize: 0,
    };
  }

  _defaultSizeConfig(): ResponsiveBoxItem;
  _defaultSizeConfig(size: number): ResponsiveBoxItem[];
  _defaultSizeConfig(size?: number): ResponsiveBoxItem | ResponsiveBoxItem[] {
    const defaultSizeConfig = this._createDefaultSizeConfig();
    if (!arguments.length) {
      return defaultSizeConfig;
    }

    const result: ResponsiveBoxItem[] = [];
    // @ts-expect-error ts-error
    for (let i = 0; i < size; i += 1) {
      result.push(defaultSizeConfig);
    }
    return result;
  }

  _filterByScreen(items: ResponsiveBoxItem[] | undefined): ResponsiveBoxItem[] {
    const screenRegExp = this._screenRegExp();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return grep(items, (item) => !item.screen || screenRegExp.test(item.screen));
  }

  _screenRegExp(): RegExp {
    const screen = this._getCurrentScreen();
    return new RegExp(`(^|\\s)${screen}($|\\s)`, 'i');
  }

  _getCurrentScreen(): ScreenSizeQualifier {
    const width = this._screenWidth();
    const { screenByWidth } = this.option();

    return screenByWidth?.(width) as ScreenSizeQualifier;
  }

  _screenWidth(): number {
    if (hasWindow()) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return getWidth(getWindow());
    }

    return HD_SCREEN_WIDTH;
  }

  _createEmptyCell(): GridCell {
    return {
      item: {},
      location: { colspan: 1, rowspan: 1 },
    };
  }

  _spreadItems(): void {
    each(this._screenItems, (_, itemInfo) => {
      const location = itemInfo.location || {};
      const itemCol = location.col;
      const itemRow = location.row;
      const row = this._grid[itemRow];
      const itemCell = row?.[itemCol];

      this._occupyCells(itemCell, itemInfo);
    });
  }

  _itemsByScreen(): Item[] {
    const { items = [] } = this.option();

    return items.reduce<Item[]>((result: Item[], item: ResponsiveBoxItem) => {
      let locations = (item.location ?? {}) as ResponsiveBoxItem[];

      locations = isPlainObject(locations)
        ? [locations] as ResponsiveBoxItem[]
        : locations;

      this._filterByScreen(locations).forEach((location) => {
        result.push({
          // @ts-expect-error ts-error
          item,
          location: {
            rowspan: 1,
            colspan: 1,
            ...location,
          },
        });
      });

      return result;
    }, []);
  }

  _occupyCells(itemCell: GridCell, itemInfo: ResponsiveBoxItem): void {
    if (!itemCell || this._isItemCellOccupied(itemCell, itemInfo)) {
      return;
    }

    extend(itemCell, itemInfo);
    this._markSpanningCell(itemCell);
  }

  _isItemCellOccupied(itemCell: GridCell, itemInfo: ResponsiveBoxItem): boolean {
    if (!isEmptyObject(itemCell.item)) {
      return true;
    }

    let result = false;
    this._loopOverSpanning(itemInfo.location, (cell) => {
      result = result || !isEmptyObject(cell.item);
    });
    return result;
  }

  _loopOverSpanning(
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    location,
    callback: (cell: GridCell) => void,
  ): void {
    const rowEnd = location.row + location.rowspan - 1;
    const colEnd = location.col + location.colspan - 1;
    const boundRowEnd = Math.min(rowEnd, this._rows.length - 1);
    const boundColEnd = Math.min(colEnd, this._cols.length - 1);
    location.rowspan -= rowEnd - boundRowEnd;
    location.colspan -= colEnd - boundColEnd;

    for (let rowIndex = location.row; rowIndex <= boundRowEnd; rowIndex += 1) {
      for (let colIndex = location.col; colIndex <= boundColEnd; colIndex += 1) {
        if ((rowIndex !== location.row) || (colIndex !== location.col)) {
          callback(this._grid[rowIndex][colIndex]);
        }
      }
    }
  }

  _markSpanningCell(itemCell: GridCell): void {
    this._loopOverSpanning(itemCell.location, (cell) => {
      cell.item = itemCell.item;
      cell.spanningCell = itemCell;
    });
  }

  _linkNodeToItem(): void {
    each(this._itemElements(), (_, itemNode) => {
      const $item = $(itemNode);
      // @ts-expect-error ts-error
      const item: BoxItemData = $item.data(BOX_ITEM_DATA_KEY);
      if (!item.box) {
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

    const rootBox = this._prepareBoxConfig(result?.box ?? { direction: 'row', items: [extend(result, { ratio: 1 })] });
    extend(rootBox, this._rootBoxConfig(rootBox.items));

    this._$root = $('<div>').appendTo(this._itemContainer());

    this._createComponent(this._$root, Box, rootBox);
  }

  _rootBoxConfig(items: BoxItemData[] | undefined): BoxOptions {
    const rootItems = each(items, (index, item) => {
      if (this._needApplyAutoBaseSize(item)) {
        item.baseSize = 'auto';
      }
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

  _needApplyAutoBaseSize(item: BoxItemData): boolean {
    return !item.baseSize && (!item.minSize || item.minSize === 'auto') && (!item.maxSize || item.maxSize === 'auto');
  }

  _prepareBoxConfig(config: BoxOptions): BoxOptions {
    const { onItemStateChanged } = this.option();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(config || {}, {
      crossAlign: 'stretch',
      onItemStateChanged,
    });
  }

  _layoutBlock(options: BlockOptions): ResponsiveBoxItem | null {
    if (this._isSingleItem(options)) {
      return this._itemByCell(options.row.start, options.col.start);
    }

    return this._layoutDirection(options);
  }

  _isSingleItem(options: BlockOptions): boolean {
    const { row, col } = options;
    const firstCellLocation = this._grid[row.start][col.start].location;
    const isItemRowSpanned = (row.end - row.start) === (firstCellLocation.rowspan - 1);
    const isItemColSpanned = (col.end - col.start) === (firstCellLocation.colspan - 1);

    return isItemRowSpanned && isItemColSpanned;
  }

  _itemByCell(rowIndex: number, colIndex: number): ResponsiveBoxItem | null {
    const itemCell = this._grid[rowIndex][colIndex];
    return itemCell.spanningCell ? null : itemCell.item;
  }

  _layoutDirection(options: BlockOptions): BoxItemData {
    const items: BoxItemData[] = [];
    const { direction } = options;
    const crossDirection = this._crossDirection(direction);

    let block: BlockOptions | null = null;
    // eslint-disable-next-line no-cond-assign
    while (block = this._nextBlock(options)) {
      if (this._isBlockIndivisible(options.prevBlockOptions, block)) {
        throw errors.Error('E1025');
      }

      const item: ResponsiveBoxItem | null = this._layoutBlock({
        direction: crossDirection,
        row: block.row,
        col: block.col,
        prevBlockOptions: options,
      });

      if (item) {
        extend(item, this._blockSize(block, crossDirection));
        items.push(item);
      }

      options[crossDirection].start = block[crossDirection].end + 1;
    }

    return {
      box: this._prepareBoxConfig({ direction, items }),
    };
  }

  _isBlockIndivisible(options: BlockOptions | undefined, block: BlockOptions): boolean {
    return !!options
        && options.col.start === block.col.start
        && options.col.end === block.col.end
        && options.row.start === block.row.start
        && options.row.end === block.row.end;
  }

  _crossDirection(direction: BoxDirection): BoxDirection {
    return direction === 'col' ? 'row' : 'col';
  }

  _nextBlock(options: BlockOptions): BlockOptions | null {
    const { direction } = options;
    const crossDirection = this._crossDirection(direction);
    const startIndex = options[direction].start;
    const endIndex = options[direction].end;
    const crossStartIndex = options[crossDirection].start;

    if (crossStartIndex > options[crossDirection].end) {
      return null;
    }

    let crossSpan = 1;
    for (
      let crossIndex = crossStartIndex;
      crossIndex < crossStartIndex + crossSpan;
      crossIndex += 1
    ) {
      let lineCrossSpan = 1;
      for (let index = startIndex; index <= endIndex; index += 1) {
        const cell = this._cellByDirection(direction, index, crossIndex);

        lineCrossSpan = Math.max(lineCrossSpan, cell.location[`${crossDirection}span`]);
      }

      const lineCrossEndIndex = crossIndex + lineCrossSpan;
      const crossEndIndex = crossStartIndex + crossSpan;
      if (lineCrossEndIndex > crossEndIndex) {
        crossSpan += lineCrossEndIndex - crossEndIndex;
      }
    }
    // @ts-expect-error ts-error
    const result: BlockOptions = {};
    result[direction] = { start: startIndex, end: endIndex };
    result[crossDirection] = { start: crossStartIndex, end: crossStartIndex + crossSpan - 1 };
    return result;
  }

  _cellByDirection(
    direction: BoxDirection,
    index: number,
    crossIndex: number,
  ): GridCell {
    return direction === 'col'
      ? this._grid[crossIndex][index]
      : this._grid[index][crossIndex];
  }

  _blockSize(block: BlockOptions, direction: BoxDirection): BoxItemData {
    const defaultMinSize = direction === 'row' ? 'auto' : 0;
    const sizeConfigs = direction === 'row' ? this._rows : this._cols;
    const result: BoxItemData = {
      ...this._createDefaultSizeConfig(),
      ratio: 0,
    };

    for (let index = block[direction].start; index <= block[direction].end; index += 1) {
      const sizeConfig = sizeConfigs[index];
      // @ts-expect-error ts-error
      result.ratio += sizeConfig.ratio;
      // @ts-expect-error ts-error
      result.baseSize += sizeConfig.baseSize;
      // @ts-expect-error ts-error
      result.minSize += sizeConfig.minSize;
      // @ts-expect-error ts-error
      result.maxSize += sizeConfig.maxSize;

      if (isDefined(sizeConfig.shrink)) {
        result.shrink = sizeConfig.shrink;
      }
    }

    if (!result.minSize) {
      result.minSize = defaultMinSize;
    }

    if (!result.maxSize) {
      result.maxSize = 'auto';
    }

    if (this._isSingleColumnScreen()) {
      result.baseSize = 'auto';
    }

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
    this._assistantRoots = this._assistantRoots ?? [];
    this._assistantRoots.push($root);
  }

  _dispose(): void {
    this._clearItemNodeTemplates();
    this._cleanUnusedRoots();

    super._dispose();
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
    const { items } = this.option();
    each(items, function clearTemplates() {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      delete this.node;
    });
  }

  _attachClickEvent(): void {}

  _optionChanged(args: OptionChanged<ResponsiveBoxProperties>): void {
    const { name } = args;
    switch (name) {
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
    const { currentScreenFactor } = this.option();
    if (this._getCurrentScreen() !== currentScreenFactor) {
      this._update();
    }
  }

  repaint(): void {
    this._update();
  }
}

registerComponent('dxResponsiveBox', ResponsiveBox);

export default ResponsiveBox;
