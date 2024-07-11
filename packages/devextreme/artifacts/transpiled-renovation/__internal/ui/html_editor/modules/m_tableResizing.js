"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _translator = require("../../../../animation/translator");
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _position = require("../../../../core/utils/position");
var _resize_callbacks = _interopRequireDefault(require("../../../../core/utils/resize_callbacks"));
var _size = require("../../../../core/utils/size");
var _type = require("../../../../core/utils/type");
var _window = require("../../../../core/utils/window");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _index = require("../../../../events/utils/index");
var _draggable = _interopRequireDefault(require("../../../../ui/draggable"));
var _m_table_helper = require("../utils/m_table_helper");
var _m_base = _interopRequireDefault(require("./m_base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DX_COLUMN_RESIZE_FRAME_CLASS = 'dx-table-resize-frame';
const DX_COLUMN_RESIZER_CLASS = 'dx-htmleditor-column-resizer';
const DX_ROW_RESIZER_CLASS = 'dx-htmleditor-row-resizer';
const DEFAULTS = {
  minColumnWidth: 40,
  minRowHeight: 24
};
const DRAGGABLE_ELEMENT_OFFSET = 2;
const ROUGH_OFFSET = 3;
const MODULE_NAMESPACE = 'dxHtmlTableResizingModule';
const POINTERDOWN_EVENT = (0, _index.addNamespace)('dxpointerdown', MODULE_NAMESPACE);
const SCROLL_EVENT = (0, _index.addNamespace)('scroll', MODULE_NAMESPACE);
class TableResizingModule extends _m_base.default {
  constructor(quill, options) {
    // @ts-expect-error
    super(quill, options);
    this.enabled = !!options.enabled;
    this._tableResizeFrames = [];
    this._minColumnWidth = this._minSizeLimit('minColumnWidth', options.minColumnWidth);
    this._minRowHeight = this._minSizeLimit('minRowHeight', options.minRowHeight);
    this._quillContainer = this.editorInstance._getQuillContainer();
    this._tableData = [];
    if (this.enabled) {
      this._applyResizing();
    }
  }
  _applyResizing(forcedStart) {
    if (forcedStart) {
      this._applyResizingImpl();
    } else {
      this.editorInstance.addContentInitializedCallback(this._applyResizingImpl.bind(this));
    }
    // @ts-expect-error
    this.addCleanCallback(this.clean.bind(this));
    this._resizeHandlerWithContext = _resize_callbacks.default.add(this._resizeHandler.bind(this));
  }
  _minSizeLimit(propertyName, newValue) {
    return (0, _type.isDefined)(newValue) ? Math.max(newValue, 0) : DEFAULTS[propertyName];
  }
  _applyResizingImpl() {
    const $tables = this._findTables();
    if ($tables.length) {
      this._fixTablesWidths($tables);
      this._createResizeFrames($tables);
      this._updateFramesPositions();
      this._updateFramesSeparators();
    }
    this._attachEvents();
  }
  _attachEvents() {
    _events_engine.default.on(this.editorInstance._getContent(), SCROLL_EVENT, this._updateFramesPositions.bind(this));
    this.quill.on('text-change', this._getQuillTextChangeHandler());
  }
  _detachEvents() {
    _events_engine.default.off(this.editorInstance._getContent(), MODULE_NAMESPACE);
    this.quill.off('text-change', this._quillTextChangeHandler);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getQuillTextChangeHandler(delta, oldContent, source) {
    return (delta, oldContent, source) => {
      if (this._isTableChanging()) {
        const $tables = this._findTables();
        this._removeResizeFrames();
        if (source === 'api') {
          this._fixTablesWidths($tables);
        }
        this._updateTablesColumnsWidth($tables);
        this._createResizeFrames($tables);
        this._updateFramesPositions();
        this._updateFramesSeparators();
      } else {
        this._updateFramesPositions();
        if (!this._isDragging) {
          this._updateFramesSeparators();
        }
      }
    };
  }
  _getFrameForTable($table) {
    var _this$_framesForTable;
    return (_this$_framesForTable = this._framesForTables) === null || _this$_framesForTable === void 0 ? void 0 : _this$_framesForTable.get($table.get(0));
  }
  _resizeHandler() {
    this._windowResizeTimeout = setTimeout(() => {
      const $tables = this._findTables();
      (0, _iterator.each)($tables, (index, table) => {
        // @ts-expect-error
        const $table = (0, _renderer.default)(table);
        const frame = this._tableResizeFrames[index];
        const actualTableWidth = (0, _size.getOuterWidth)($table);
        const lastTableWidth = this._tableLastWidth(frame);
        if (Math.abs(actualTableWidth - lastTableWidth) > 1) {
          this._tableLastWidth(frame, actualTableWidth);
          this._updateColumnsWidth($table, index);
        }
      });
      this._updateFramesPositions();
      this._updateFramesSeparators();
    });
  }
  _findTables() {
    return (0, _renderer.default)(this._quillContainer).find('table');
  }
  _getWidthStyleValue($element) {
    const styleValue = $element[0].style.width;
    // eslint-disable-next-line radix
    return styleValue !== '' ? parseInt(styleValue) : undefined;
  }
  _tableLastWidth(frame, newValue) {
    if ((0, _type.isDefined)(newValue)) {
      frame.lastWidth = newValue;
    } else {
      return frame === null || frame === void 0 ? void 0 : frame.lastWidth;
    }
  }
  _fixTablesWidths($tables) {
    (0, _iterator.each)($tables, (index, table) => {
      const $table = (0, _renderer.default)(table);
      const $columnElements = this._getTableDeterminantElements($table, 'horizontal');
      if (!this._tableResizeFrames[index]) {
        this._tableResizeFrames[index] = {
          lastWidth: undefined
        };
      }
      const frame = this._getFrameForTable($table);
      if (!frame) {
        this._tableResizeFrames.push({
          $table
        });
      }
      if ((0, _m_table_helper.getAutoSizedElements)($table).length === 0) {
        const {
          columnsSum
        } = this._getColumnElementsSum($columnElements);
        (0, _m_table_helper.unfixTableWidth)($table, {
          quill: this.quill
        });
        const tableWidth = this._tableLastWidth(frame) ?? (0, _size.getOuterWidth)($table);
        if (frame) {
          this._tableLastWidth(frame, Math.max(columnsSum, tableWidth));
        }
      }
    });
  }
  _createResizeFrames($tables) {
    this._framesForTables = new Map();
    $tables.each((index, table) => {
      var _this$_tableResizeFra;
      const $table = (0, _renderer.default)(table);
      const $lastTable = (_this$_tableResizeFra = this._tableResizeFrames[index]) === null || _this$_tableResizeFra === void 0 ? void 0 : _this$_tableResizeFra.$table;
      const $tableLastWidth = this._tableResizeFrames[index].lastWidth;
      this._tableResizeFrames[index] = {
        $frame: this._createTableResizeFrame(table),
        $table,
        index,
        lastWidth: $lastTable && table === $lastTable.get(0) ? $tableLastWidth : undefined,
        columnsCount: this._getTableDeterminantElements($table, 'horizontal').length,
        rowsCount: this._getTableDeterminantElements($table, 'vertical').length
      };
      this._framesForTables.set(table, this._tableResizeFrames[index]);
    });
    this._tableResizeFrames.length = $tables.length;
  }
  _isTableChanging() {
    const $tables = this._findTables();
    let result = false;
    if ($tables.length !== this._tableResizeFrames.length) {
      result = true;
    } else {
      // @ts-expect-error
      (0, _iterator.each)($tables, (index, table) => {
        // @ts-expect-error
        const $table = (0, _renderer.default)(table);
        const frame = this._tableResizeFrames[index];
        const isColumnsCountChanged = (frame === null || frame === void 0 ? void 0 : frame.columnsCount) !== this._getTableDeterminantElements($table, 'horizontal').length;
        const isRowCountChanged = (frame === null || frame === void 0 ? void 0 : frame.rowsCount) !== this._getTableDeterminantElements($table, 'vertical').length;
        if (isColumnsCountChanged || isRowCountChanged) {
          result = true;
          return false;
        }
      });
    }
    return result;
  }
  _removeResizeFrames(clearArray) {
    var _this$_framesForTable2;
    (0, _iterator.each)(this._tableResizeFrames, (index, resizeFrame) => {
      if (resizeFrame.$frame) {
        var _resizeFrame$$frame;
        const resizerElementsSelector = `.${DX_COLUMN_RESIZER_CLASS}, .${DX_ROW_RESIZER_CLASS}`;
        this._detachSeparatorEvents((_resizeFrame$$frame = resizeFrame.$frame) === null || _resizeFrame$$frame === void 0 ? void 0 : _resizeFrame$$frame.find(resizerElementsSelector));
        resizeFrame.$frame.remove();
      }
    });
    (_this$_framesForTable2 = this._framesForTables) === null || _this$_framesForTable2 === void 0 || _this$_framesForTable2.clear();
    if (clearArray) {
      this._tableResizeFrames = [];
    }
  }
  _detachSeparatorEvents($lineSeparators) {
    $lineSeparators.each((i, $lineSeparator) => {
      _events_engine.default.off($lineSeparator, POINTERDOWN_EVENT);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _createTableResizeFrame(table) {
    return (0, _renderer.default)('<div>').addClass(DX_COLUMN_RESIZE_FRAME_CLASS).appendTo(this._quillContainer);
  }
  _updateFramesPositions() {
    (0, _iterator.each)(this._tableResizeFrames, (index, tableResizeFrame) => {
      this._updateFramePosition(tableResizeFrame.$table, tableResizeFrame.$frame);
    });
  }
  _updateFramePosition($table, $frame) {
    const {
      height,
      width,
      top: targetTop,
      left: targetLeft
    } = (0, _position.getBoundingRect)($table.get(0));
    const {
      top: containerTop,
      left: containerLeft
    } = (0, _position.getBoundingRect)(this.quill.root);
    $frame.css({
      height,
      width,
      top: targetTop - containerTop,
      left: targetLeft - containerLeft
    });
    (0, _translator.move)($frame, {
      left: 0,
      top: 0
    });
  }
  _updateFramesSeparators(direction) {
    (0, _iterator.each)(this._tableResizeFrames, (index, frame) => {
      if (direction) {
        this._updateFrameSeparators(frame, direction);
      } else {
        this._updateFrameSeparators(frame, 'vertical');
        this._updateFrameSeparators(frame, 'horizontal');
      }
    });
  }
  _isDraggable($element) {
    return $element.hasClass('dx-draggable') && $element.is(':visible');
  }
  _removeDraggable($currentLineSeparator, lineResizerClass) {
    if (this._isDraggable($currentLineSeparator)) {
      // @ts-expect-error
      const draggable = (0, _renderer.default)($currentLineSeparator).dxDraggable('instance');
      draggable.dispose();
      (0, _renderer.default)($currentLineSeparator).addClass(lineResizerClass);
    }
  }
  _getDirectionInfo(direction) {
    if (direction === 'vertical') {
      return {
        lineResizerClass: DX_ROW_RESIZER_CLASS,
        sizeFunction: x => (0, _size.getOuterHeight)(x),
        positionCoordinate: 'top',
        positionStyleProperty: 'height',
        positionCoordinateName: 'y'
      };
    }
    return {
      lineResizerClass: DX_COLUMN_RESIZER_CLASS,
      sizeFunction: x => (0, _size.getOuterWidth)(x),
      positionCoordinate: this.editorInstance.option('rtlEnabled') ? 'right' : 'left',
      positionStyleProperty: 'width',
      positionCoordinateName: 'x'
    };
  }
  _getSize($element, directionInfo) {
    return directionInfo.sizeFunction($element);
  }
  _updateFrameSeparators(frame, direction) {
    const $determinantElements = this._getTableDeterminantElements(frame.$table, direction);
    const determinantElementsCount = $determinantElements.length;
    const determinantElementsSeparatorsCount = determinantElementsCount - 1;
    const directionInfo = this._getDirectionInfo(direction);
    const lineSeparators = frame.$frame.find(`.${directionInfo.lineResizerClass}`);
    const styleOptions = {
      transform: 'none'
    };
    let currentPosition = 0;
    for (let i = 0; i <= determinantElementsSeparatorsCount; i++) {
      currentPosition += this._getSize($determinantElements.eq(i), directionInfo);
      if (!(0, _type.isDefined)(lineSeparators[i])) {
        lineSeparators[i] = (0, _renderer.default)('<div>').addClass(directionInfo.lineResizerClass).appendTo(frame.$frame).get(0);
      }
      const $currentLineSeparator = (0, _renderer.default)(lineSeparators[i]);
      this._removeDraggable($currentLineSeparator, directionInfo.lineResizerClass);
      styleOptions[directionInfo.positionCoordinate] = currentPosition - DRAGGABLE_ELEMENT_OFFSET;
      // @ts-expect-error
      (0, _renderer.default)($currentLineSeparator).css(styleOptions);
      const attachSeparatorData = {
        lineSeparator: lineSeparators[i],
        index: i,
        $determinantElements,
        frame,
        direction
      };
      this._attachColumnSeparatorEvents(attachSeparatorData);
    }
  }
  _getTableDeterminantElements($table, direction) {
    if (direction === 'vertical') {
      return $table.find('th:first-child, td:first-child');
    }
    return (0, _m_table_helper.getColumnElements)($table);
  }
  _attachColumnSeparatorEvents(options) {
    _events_engine.default.on(options.lineSeparator, POINTERDOWN_EVENT, () => {
      this._createDraggableElement(options);
    });
  }
  _dragStartHandler(_ref) {
    let {
      $determinantElements,
      index,
      frame,
      direction,
      lineSeparator
    } = _ref;
    const directionInfo = this._getDirectionInfo(direction);
    this._isDragging = true;
    this._fixColumnsWidth(frame.$table);
    // eslint-disable-next-line radix
    this._startLineSize = parseInt(this._getSize((0, _renderer.default)($determinantElements[index]), directionInfo));
    this._startTableWidth = (0, _size.getOuterWidth)(frame.$table);
    // @ts-expect-error
    // eslint-disable-next-line radix
    this._startLineSeparatorPosition = parseInt((0, _renderer.default)(lineSeparator).css(directionInfo.positionCoordinate));
    this._nextLineSize = 0;
    if ($determinantElements[index + 1]) {
      // eslint-disable-next-line radix
      this._nextLineSize = parseInt(this._getSize((0, _renderer.default)($determinantElements[index + 1]), directionInfo));
    } else if (direction === 'horizontal') {
      (0, _m_table_helper.unfixTableWidth)(frame.$table, {
        quill: this.quill
      });
    }
  }
  _shouldRevertOffset(direction) {
    return direction === 'horizontal' && this.editorInstance.option('rtlEnabled');
  }
  _isNextColumnWidthEnough(nextColumnNewSize, $nextColumnElement, eventOffset) {
    if (!this._nextLineSize) {
      return true;
    }
    if (nextColumnNewSize >= this._minColumnWidth) {
      const isWidthIncreased = this._nextColumnOffsetLimit ? eventOffset < this._nextColumnOffsetLimit : eventOffset < 0;
      // @ts-expect-error
      const isWidthLimited = Math.abs(this._getWidthStyleValue($nextColumnElement) - (0, _size.getOuterWidth)($nextColumnElement)) > ROUGH_OFFSET;
      return isWidthIncreased || !isWidthLimited;
    }
    return false;
  }
  _shouldSetNextColumnWidth(nextColumnNewSize) {
    return this._nextLineSize && nextColumnNewSize > 0;
  }
  _horizontalDragHandler(_ref2) {
    let {
      currentLineNewSize,
      directionInfo,
      eventOffset,
      $determinantElements,
      index,
      frame
    } = _ref2;
    let nextColumnNewSize = this._nextLineSize && this._nextLineSize - eventOffset;
    const isCurrentColumnWidthEnough = currentLineNewSize >= this._minColumnWidth;
    const $lineElements = (0, _m_table_helper.getLineElements)(frame.$table, index);
    const $nextLineElements = (0, _m_table_helper.getLineElements)(frame.$table, index + 1);
    const realWidthDiff = (0, _size.getOuterWidth)($lineElements.eq(0)) - currentLineNewSize;
    if (isCurrentColumnWidthEnough) {
      if (this._isNextColumnWidthEnough(nextColumnNewSize, $determinantElements.eq(index + 1), eventOffset)) {
        (0, _m_table_helper.setLineElementsFormat)(this, {
          elements: $lineElements,
          property: directionInfo.positionStyleProperty,
          value: currentLineNewSize
        });
        if (this._shouldSetNextColumnWidth(nextColumnNewSize)) {
          (0, _m_table_helper.setLineElementsFormat)(this, {
            elements: $nextLineElements,
            property: directionInfo.positionStyleProperty,
            value: nextColumnNewSize
          });
        }
        const isTableWidthChanged = Math.abs(this._startTableWidth - (0, _size.getOuterWidth)(frame.$table)) < ROUGH_OFFSET;
        const shouldRevertNewValue = Math.abs(realWidthDiff) > ROUGH_OFFSET || !this._nextLineSize && isTableWidthChanged;
        if (shouldRevertNewValue) {
          (0, _m_table_helper.setLineElementsFormat)(this, {
            elements: $lineElements,
            property: directionInfo.positionStyleProperty,
            value: (0, _size.getOuterWidth)($lineElements.eq(0))
          });
          nextColumnNewSize += currentLineNewSize - (0, _size.getOuterWidth)($lineElements.eq(0));
          if (this._shouldSetNextColumnWidth(nextColumnNewSize)) {
            (0, _m_table_helper.setLineElementsFormat)(this, {
              elements: $nextLineElements,
              property: directionInfo.positionStyleProperty,
              value: nextColumnNewSize
            });
          }
        }
      } else {
        this._nextColumnOffsetLimit = this._nextColumnOffsetLimit || eventOffset;
      }
    }
    this._$highlightedElement.css(directionInfo.positionCoordinate, `${this._startLineSeparatorPosition + eventOffset + realWidthDiff}px`);
  }
  _verticalDragHandler(_ref3) {
    let {
      currentLineNewSize,
      directionInfo,
      eventOffset,
      $determinantElements,
      index,
      frame
    } = _ref3;
    const newHeight = Math.max(currentLineNewSize, this._minRowHeight);
    const $lineElements = (0, _m_table_helper.getLineElements)(frame.$table, index, 'vertical');
    (0, _m_table_helper.setLineElementsFormat)(this, {
      elements: $lineElements,
      property: directionInfo.positionStyleProperty,
      value: newHeight
    });
    const rowHeightDiff = (0, _size.getOuterHeight)($determinantElements.eq(index)) - currentLineNewSize;
    this._$highlightedElement.css(directionInfo.positionCoordinate, `${this._startLineSeparatorPosition + eventOffset + rowHeightDiff}px`);
  }
  _dragMoveHandler(event, _ref4) {
    let {
      $determinantElements,
      index,
      frame,
      direction
    } = _ref4;
    const directionInfo = this._getDirectionInfo(direction);
    let eventOffset = event.offset[directionInfo.positionCoordinateName];
    this.editorInstance._saveValueChangeEvent(event);
    if (this._shouldRevertOffset(direction)) {
      eventOffset = -eventOffset;
    }
    const currentLineNewSize = this._startLineSize + eventOffset;
    if (direction === 'horizontal') {
      this._horizontalDragHandler({
        currentLineNewSize,
        directionInfo,
        eventOffset,
        $determinantElements,
        index,
        frame
      });
    } else {
      this._verticalDragHandler({
        currentLineNewSize,
        directionInfo,
        eventOffset,
        $determinantElements,
        index,
        frame
      });
    }
    this._updateFramePosition(frame.$table, frame.$frame);
  }
  _dragEndHandler(options) {
    var _this$_$highlightedEl;
    (_this$_$highlightedEl = this._$highlightedElement) === null || _this$_$highlightedEl === void 0 || _this$_$highlightedEl.remove();
    this._isDragging = undefined;
    this._nextColumnOffsetLimit = undefined;
    this._tableLastWidth(options.frame, (0, _size.getOuterWidth)(options.frame.$table));
    this._updateFramesPositions();
    this._updateFramesSeparators();
  }
  _isLastColumnResizing(_ref5) {
    let {
      $determinantElements,
      index
    } = _ref5;
    return !(0, _type.isDefined)($determinantElements[index + 1]);
  }
  _getBoundaryConfig(options) {
    const result = {};
    if (options.direction === 'vertical') {
      result.boundary = options.frame.$table;
      // @ts-expect-error
      result.boundOffset = {
        bottom: (0, _window.hasWindow)() ? -(0, _size.getHeight)((0, _window.getWindow)()) : -(0, _size.getOuterHeight)(this._quillContainer),
        top: 0,
        left: 0,
        right: 0
      };
    } else if (!this._isLastColumnResizing(options)) {
      result.boundary = options.frame.$table;
    } else {
      const $content = this.editorInstance._getContent();
      result.boundary = $content;
      // @ts-expect-error
      result.boundOffset = {
        bottom: 0,
        top: 0,
        left: $content.css('paddingLeft'),
        right: $content.css('paddingRight')
      };
    }
    return result;
  }
  _createDraggableElement(options) {
    var _this$_$highlightedEl2;
    const boundaryConfig = this._getBoundaryConfig(options);
    const directionClass = options.direction === 'vertical' ? 'dx-htmleditor-highlighted-row' : 'dx-htmleditor-highlighted-column';
    (_this$_$highlightedEl2 = this._$highlightedElement) === null || _this$_$highlightedEl2 === void 0 || _this$_$highlightedEl2.remove();
    this._$highlightedElement = (0, _renderer.default)('<div>').addClass(`${directionClass}`).insertAfter((0, _renderer.default)(options.lineSeparator));
    const config = {
      contentTemplate: null,
      allowMoveByClick: false,
      dragDirection: options.direction,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onDragMove: _ref6 => {
        let {
          component,
          event
        } = _ref6;
        this._dragMoveHandler(event, options);
      },
      onDragStart: () => {
        this._dragStartHandler(options);
      },
      onDragEnd: () => {
        this._dragEndHandler(options);
      }
    };
    (0, _extend.extend)(config, boundaryConfig);
    this._currentDraggableElement = this.editorInstance._createComponent(options.lineSeparator, _draggable.default, config);
  }
  _fixColumnsWidth($table) {
    const determinantElements = this._getTableDeterminantElements($table);
    (0, _iterator.each)(determinantElements, (index, element) => {
      const columnWidth = (0, _size.getOuterWidth)(element);
      const $lineElements = (0, _m_table_helper.getLineElements)($table, index);
      (0, _m_table_helper.setLineElementsFormat)(this, {
        elements: $lineElements,
        property: 'width',
        value: Math.max(columnWidth, this._minColumnWidth)
      });
    });
  }
  _getColumnElementsSum(columnElements) {
    const columnsWidths = [];
    let columnsSum = 0;
    (0, _iterator.each)(columnElements, (index, element) => {
      const $element = (0, _renderer.default)(element);
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const columnWidth = this._getWidthStyleValue($element) || (0, _size.getOuterWidth)($element);
      columnsWidths[index] = Math.max(columnWidth, this._minColumnWidth);
      columnsSum += columnsWidths[index];
    });
    return {
      columnsWidths,
      columnsSum
    };
  }
  _setColumnsRatioWidth(columnElements, ratio, columnsWidths, $table) {
    (0, _iterator.each)(columnElements, index => {
      const $lineElements = (0, _m_table_helper.getLineElements)($table, index);
      let resultWidth;
      if (ratio > 0) {
        resultWidth = this._minColumnWidth + Math.round((columnsWidths[index] - this._minColumnWidth) * ratio);
      } else {
        resultWidth = this._minColumnWidth;
      }
      (0, _m_table_helper.setLineElementsFormat)(this, {
        elements: $lineElements,
        property: 'width',
        value: resultWidth
      });
    });
  }
  _updateColumnsWidth($table, frameIndex) {
    const determinantElements = this._getTableDeterminantElements($table);
    let frame = this._tableResizeFrames[frameIndex];
    if (!frame) {
      this._tableResizeFrames[frameIndex] = {};
    }
    frame = this._tableResizeFrames[frameIndex];
    const tableWidth = this._tableLastWidth(frame) || (0, _size.getOuterWidth)($table);
    let ratio;
    const {
      columnsWidths,
      columnsSum
    } = this._getColumnElementsSum(determinantElements);
    const minWidthForColumns = determinantElements.length * this._minColumnWidth;
    if (columnsSum > minWidthForColumns) {
      ratio = (tableWidth - minWidthForColumns) / (columnsSum - minWidthForColumns);
    } else {
      ratio = -1;
    }
    this._tableLastWidth(frame, ratio > 0 ? tableWidth : minWidthForColumns);
    this._setColumnsRatioWidth(determinantElements, ratio, columnsWidths, $table);
  }
  _updateTablesColumnsWidth($tables) {
    (0, _iterator.each)($tables, (index, table) => {
      this._updateColumnsWidth((0, _renderer.default)(table), index);
    });
  }
  option(option, value) {
    if (option === 'tableResizing') {
      // @ts-expect-error
      this.handleOptionChangeValue(value);
      return;
    }
    if (option === 'enabled') {
      this.enabled = value;
      value ? this._applyResizing(true) : this.clean();
    } else if (['minColumnWidth', 'minRowHeight'].includes(option)) {
      this[`_${option}`] = this._minSizeLimit(option, value);
    }
  }
  clean() {
    this._removeResizeFrames(true);
    this._detachEvents();
    _resize_callbacks.default.remove(this._resizeHandlerWithContext);
    clearTimeout(this._windowResizeTimeout);
    this._resizeHandlerWithContext = undefined;
    this._isDragging = undefined;
    this._startTableWidth = undefined;
    clearTimeout(this._attachResizerTimeout);
  }
}
exports.default = TableResizingModule;