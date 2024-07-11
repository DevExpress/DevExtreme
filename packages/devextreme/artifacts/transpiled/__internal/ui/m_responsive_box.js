"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _common = require("../../core/utils/common");
var _extend = require("../../core/utils/extend");
var _iterator = require("../../core/utils/iterator");
var _size = require("../../core/utils/size");
var _type = require("../../core/utils/type");
var _window = require("../../core/utils/window");
var _box = _interopRequireDefault(require("../../ui/box"));
var _uiCollection_widget = _interopRequireDefault(require("../../ui/collection/ui.collection_widget.edit"));
var _ui = _interopRequireDefault(require("../../ui/widget/ui.errors"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-expect-error

// @ts-expect-error

const RESPONSIVE_BOX_CLASS = 'dx-responsivebox';
const SCREEN_SIZE_CLASS_PREFIX = `${RESPONSIVE_BOX_CLASS}-screen-`;
const BOX_ITEM_CLASS = 'dx-box-item';
const BOX_ITEM_DATA_KEY = 'dxBoxItemData';
const HD_SCREEN_WIDTH = 1920;
const ResponsiveBox = _uiCollection_widget.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      rows: [],
      cols: [],
      screenByWidth: null,
      singleColumnScreen: '',
      height: '100%',
      width: '100%',
      activeStateEnabled: false,
      focusStateEnabled: false,
      onItemStateChanged: undefined,
      onLayoutChanged: null,
      currentScreenFactor: undefined
    });
  },
  _init() {
    if (!this.option('screenByWidth')) {
      this._options.silent('screenByWidth', _window.defaultScreenFactorFunc);
    }
    this.callBase();
    this._initLayoutChangedAction();
  },
  _initLayoutChangedAction() {
    this._layoutChangedAction = this._createActionByOption('onLayoutChanged', {
      excludeValidators: ['disabled', 'readonly']
    });
  },
  _itemClass() {
    return BOX_ITEM_CLASS;
  },
  _itemDataKey() {
    return BOX_ITEM_DATA_KEY;
  },
  _initMarkup() {
    this.callBase();
    this.$element().addClass(RESPONSIVE_BOX_CLASS);
  },
  _renderItems() {
    this._setScreenSize();
    this._screenItems = this._itemsByScreen();
    this._prepareGrid();
    this._spreadItems();
    this._layoutItems();
    this._linkNodeToItem();
  },
  _itemOptionChanged(item) {
    const $item = this._findItemElementByItem(item);
    if (!$item.length) {
      return;
    }
    this._refreshItem($item, item);
    this._clearItemNodeTemplates();
    this._update(true);
  },
  _setScreenSize() {
    const currentScreen = this._getCurrentScreen();
    this._removeScreenSizeClass();
    this.$element().addClass(SCREEN_SIZE_CLASS_PREFIX + currentScreen);
    this.option('currentScreenFactor', currentScreen);
  },
  _removeScreenSizeClass() {
    const currentScreenFactor = this.option('currentScreenFactor');
    currentScreenFactor && this.$element().removeClass(SCREEN_SIZE_CLASS_PREFIX + currentScreenFactor);
  },
  _prepareGrid() {
    const grid = this._grid = [];
    this._prepareRowsAndCols();
    (0, _iterator.each)(this._rows, () => {
      const row = [];
      // @ts-expect-error
      grid.push(row);
      (0, _iterator.each)(this._cols, () => {
        // @ts-expect-error
        row.push(this._createEmptyCell());
      });
    });
  },
  getSingleColumnRows() {
    const rows = this.option('rows');
    const screenItemsLength = this._screenItems.length;
    if (rows.length) {
      const filteredRows = this._filterByScreen(rows);
      const result = [];
      for (let i = 0; i < screenItemsLength; i++) {
        const sizeConfig = this._defaultSizeConfig();
        if (i < filteredRows.length && (0, _type.isDefined)(filteredRows[i].shrink)) {
          sizeConfig.shrink = filteredRows[i].shrink;
        }
        // @ts-expect-error
        result.push(sizeConfig);
      }
      return result;
    }
    return this._defaultSizeConfig(screenItemsLength);
  },
  _prepareRowsAndCols() {
    if (this._isSingleColumnScreen()) {
      this._prepareSingleColumnScreenItems();
      this._rows = this.getSingleColumnRows();
      this._cols = this._defaultSizeConfig(1);
    } else {
      this._rows = this._sizesByScreen(this.option('rows'));
      this._cols = this._sizesByScreen(this.option('cols'));
    }
  },
  _isSingleColumnScreen() {
    return this._screenRegExp().test(this.option('singleColumnScreen')) || !this.option('rows').length || !this.option('cols').length;
  },
  _prepareSingleColumnScreenItems() {
    this._screenItems.sort((item1, item2) => item1.location.row - item2.location.row || item1.location.col - item2.location.col);
    (0, _iterator.each)(this._screenItems, (index, item) => {
      (0, _extend.extend)(item.location, {
        row: index,
        col: 0,
        rowspan: 1,
        colspan: 1
      });
    });
  },
  _sizesByScreen(sizeConfigs) {
    return (0, _iterator.map)(this._filterByScreen(sizeConfigs), sizeConfig => (0, _extend.extend)(this._defaultSizeConfig(), sizeConfig));
  },
  _createDefaultSizeConfig() {
    return {
      ratio: 1,
      baseSize: 0,
      minSize: 0,
      maxSize: 0
    };
  },
  _defaultSizeConfig(size) {
    const defaultSizeConfig = this._createDefaultSizeConfig();
    if (!arguments.length) {
      return defaultSizeConfig;
    }
    const result = [];
    for (let i = 0; i < size; i++) {
      // @ts-expect-error
      result.push(defaultSizeConfig);
    }
    return result;
  },
  _filterByScreen(items) {
    const screenRegExp = this._screenRegExp();
    return (0, _common.grep)(items, item => !item.screen || screenRegExp.test(item.screen));
  },
  _screenRegExp() {
    const screen = this._getCurrentScreen();
    return new RegExp(`(^|\\s)${screen}($|\\s)`, 'i');
  },
  _getCurrentScreen() {
    const width = this._screenWidth();
    return this.option('screenByWidth')(width);
  },
  _screenWidth() {
    return (0, _window.hasWindow)() ? (0, _size.getWidth)((0, _window.getWindow)()) : HD_SCREEN_WIDTH;
  },
  _createEmptyCell() {
    return {
      item: {},
      location: {
        colspan: 1,
        rowspan: 1
      }
    };
  },
  _spreadItems() {
    (0, _iterator.each)(this._screenItems, (_, itemInfo) => {
      const location = itemInfo.location || {};
      const itemCol = location.col;
      const itemRow = location.row;
      const row = this._grid[itemRow];
      const itemCell = row && row[itemCol];
      this._occupyCells(itemCell, itemInfo);
    });
  },
  _itemsByScreen() {
    return this.option('items').reduce((result, item) => {
      let locations = item.location || {};
      locations = (0, _type.isPlainObject)(locations) ? [locations] : locations;
      this._filterByScreen(locations).forEach(location => {
        result.push({
          item,
          location: (0, _extend.extend)({
            rowspan: 1,
            colspan: 1
          }, location)
        });
      });
      return result;
    }, []);
  },
  _occupyCells(itemCell, itemInfo) {
    if (!itemCell || this._isItemCellOccupied(itemCell, itemInfo)) {
      return;
    }
    (0, _extend.extend)(itemCell, itemInfo);
    this._markSpanningCell(itemCell);
  },
  _isItemCellOccupied(itemCell, itemInfo) {
    if (!(0, _type.isEmptyObject)(itemCell.item)) {
      return true;
    }
    let result = false;
    this._loopOverSpanning(itemInfo.location, cell => {
      result = result || !(0, _type.isEmptyObject)(cell.item);
    });
    return result;
  },
  _loopOverSpanning(location, callback) {
    const rowEnd = location.row + location.rowspan - 1;
    const colEnd = location.col + location.colspan - 1;
    const boundRowEnd = Math.min(rowEnd, this._rows.length - 1);
    const boundColEnd = Math.min(colEnd, this._cols.length - 1);
    location.rowspan -= rowEnd - boundRowEnd;
    location.colspan -= colEnd - boundColEnd;
    for (let rowIndex = location.row; rowIndex <= boundRowEnd; rowIndex++) {
      for (let colIndex = location.col; colIndex <= boundColEnd; colIndex++) {
        if (rowIndex !== location.row || colIndex !== location.col) {
          callback(this._grid[rowIndex][colIndex]);
        }
      }
    }
  },
  _markSpanningCell(itemCell) {
    this._loopOverSpanning(itemCell.location, cell => {
      (0, _extend.extend)(cell, {
        item: itemCell.item,
        spanningCell: itemCell
      });
    });
  },
  _linkNodeToItem() {
    (0, _iterator.each)(this._itemElements(), (_, itemNode) => {
      const $item = (0, _renderer.default)(itemNode);
      const item = $item.data(BOX_ITEM_DATA_KEY);
      // @ts-expect-error
      if (!item.box) {
        // @ts-expect-error
        item.node = $item.children();
      }
    });
  },
  _layoutItems() {
    const rowsCount = this._grid.length;
    const colsCount = rowsCount && this._grid[0].length;
    if (!rowsCount && !colsCount) {
      return;
    }
    const result = this._layoutBlock({
      direction: 'col',
      row: {
        start: 0,
        end: rowsCount - 1
      },
      col: {
        start: 0,
        end: colsCount - 1
      }
    });
    const rootBox = this._prepareBoxConfig(result.box || {
      direction: 'row',
      items: [(0, _extend.extend)(result, {
        ratio: 1
      })]
    });
    (0, _extend.extend)(rootBox, this._rootBoxConfig(rootBox.items));
    this._$root = (0, _renderer.default)('<div>').appendTo(this._itemContainer());
    this._createComponent(this._$root, _box.default, rootBox);
  },
  _rootBoxConfig(items) {
    const rootItems = (0, _iterator.each)(items, (index, item) => {
      this._needApplyAutoBaseSize(item) && (0, _extend.extend)(item, {
        baseSize: 'auto'
      });
    });
    return {
      width: '100%',
      height: '100%',
      items: rootItems,
      itemTemplate: this._getTemplateByOption('itemTemplate'),
      itemHoldTimeout: this.option('itemHoldTimeout'),
      onItemHold: this._createActionByOption('onItemHold'),
      onItemClick: this._createActionByOption('onItemClick'),
      onItemContextMenu: this._createActionByOption('onItemContextMenu'),
      onItemRendered: this._createActionByOption('onItemRendered')
    };
  },
  _needApplyAutoBaseSize(item) {
    return !item.baseSize && (!item.minSize || item.minSize === 'auto') && (!item.maxSize || item.maxSize === 'auto');
  },
  _prepareBoxConfig(config) {
    return (0, _extend.extend)(config || {}, {
      crossAlign: 'stretch',
      onItemStateChanged: this.option('onItemStateChanged')
    });
  },
  _layoutBlock(options) {
    if (this._isSingleItem(options)) {
      return this._itemByCell(options.row.start, options.col.start);
    }
    return this._layoutDirection(options);
  },
  _isSingleItem(options) {
    const firstCellLocation = this._grid[options.row.start][options.col.start].location;
    const isItemRowSpanned = options.row.end - options.row.start === firstCellLocation.rowspan - 1;
    const isItemColSpanned = options.col.end - options.col.start === firstCellLocation.colspan - 1;
    return isItemRowSpanned && isItemColSpanned;
  },
  _itemByCell(rowIndex, colIndex) {
    const itemCell = this._grid[rowIndex][colIndex];
    return itemCell.spanningCell ? null : itemCell.item;
  },
  _layoutDirection(options) {
    const items = [];
    const {
      direction
    } = options;
    const crossDirection = this._crossDirection(direction);
    let block;
    // eslint-disable-next-line no-cond-assign
    while (block = this._nextBlock(options)) {
      if (this._isBlockIndivisible(options.prevBlockOptions, block)) {
        throw _ui.default.Error('E1025');
      }
      const item = this._layoutBlock({
        direction: crossDirection,
        row: block.row,
        col: block.col,
        prevBlockOptions: options
      });
      if (item) {
        (0, _extend.extend)(item, this._blockSize(block, crossDirection));
        // @ts-expect-error
        items.push(item);
      }
      options[crossDirection].start = block[crossDirection].end + 1;
    }
    return {
      box: this._prepareBoxConfig({
        direction,
        items
      })
    };
  },
  _isBlockIndivisible(options, block) {
    return options && options.col.start === block.col.start && options.col.end === block.col.end && options.row.start === block.row.start && options.row.end === block.row.end;
  },
  _crossDirection(direction) {
    return direction === 'col' ? 'row' : 'col';
  },
  _nextBlock(options) {
    const {
      direction
    } = options;
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
        lineCrossSpan = Math.max(lineCrossSpan, cell.location[`${crossDirection}span`]);
      }
      const lineCrossEndIndex = crossIndex + lineCrossSpan;
      const crossEndIndex = crossStartIndex + crossSpan;
      if (lineCrossEndIndex > crossEndIndex) {
        crossSpan += lineCrossEndIndex - crossEndIndex;
      }
    }
    const result = {};
    result[direction] = {
      start: startIndex,
      end: endIndex
    };
    result[crossDirection] = {
      start: crossStartIndex,
      end: crossStartIndex + crossSpan - 1
    };
    return result;
  },
  _cellByDirection(direction, index, crossIndex) {
    return direction === 'col' ? this._grid[crossIndex][index] : this._grid[index][crossIndex];
  },
  _blockSize(block, direction) {
    const defaultMinSize = direction === 'row' ? 'auto' : 0;
    const sizeConfigs = direction === 'row' ? this._rows : this._cols;
    const result = (0, _extend.extend)(this._createDefaultSizeConfig(), {
      ratio: 0
    });
    for (let index = block[direction].start; index <= block[direction].end; index++) {
      const sizeConfig = sizeConfigs[index];
      result.ratio += sizeConfig.ratio;
      result.baseSize += sizeConfig.baseSize;
      result.minSize += sizeConfig.minSize;
      result.maxSize += sizeConfig.maxSize;
      if ((0, _type.isDefined)(sizeConfig.shrink)) {
        result.shrink = sizeConfig.shrink;
      }
    }
    result.minSize = result.minSize ? result.minSize : defaultMinSize;
    result.maxSize = result.maxSize ? result.maxSize : 'auto';
    this._isSingleColumnScreen() && (result.baseSize = 'auto');
    return result;
  },
  _update(forceRemoveRoot) {
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
    this._layoutChangedAction();
  },
  _saveAssistantRoot($root) {
    this._assistantRoots = this._assistantRoots || [];
    this._assistantRoots.push($root);
  },
  _dispose() {
    this._clearItemNodeTemplates();
    this._cleanUnusedRoots();
    this.callBase.apply(this, arguments);
  },
  _cleanUnusedRoots() {
    if (!this._assistantRoots) {
      return;
    }
    (0, _iterator.each)(this._assistantRoots, (_, item) => {
      (0, _renderer.default)(item).remove();
    });
  },
  _clearItemNodeTemplates() {
    (0, _iterator.each)(this.option('items'), function () {
      delete this.node;
    });
  },
  _attachClickEvent: _common.noop,
  _optionChanged(args) {
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
        this.callBase(args);
        this._update();
        break;
      case 'onLayoutChanged':
        this._initLayoutChangedAction();
        break;
      case 'itemTemplate':
        this._clearItemNodeTemplates();
        this.callBase(args);
        break;
      case 'currentScreenFactor':
        break;
      default:
        this.callBase(args);
    }
  },
  _dimensionChanged() {
    if (this._getCurrentScreen() !== this.option('currentScreenFactor')) {
      this._update();
    }
  },
  repaint() {
    this._update();
  }
});
(0, _component_registrator.default)('dxResponsiveBox', ResponsiveBox);
var _default = exports.default = ResponsiveBox;