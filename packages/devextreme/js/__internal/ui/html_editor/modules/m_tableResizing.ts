import { move } from '@js/common/core/animation/translator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import { getBoundingRect } from '@js/core/utils/position';
import _windowResizeCallbacks from '@js/core/utils/resize_callbacks';
import { getHeight, getOuterHeight, getOuterWidth } from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import type { Properties } from '@js/ui/draggable';
import Draggable from '@js/ui/draggable';

import {
  getAutoSizedElements,
  getColumnElements,
  getLineElements,
  setLineElementsFormat,
  unfixTableWidth,
} from '../utils/m_table_helper';
import BaseModule from './m_base';

const DX_COLUMN_RESIZE_FRAME_CLASS = 'dx-table-resize-frame';
const DX_COLUMN_RESIZER_CLASS = 'dx-htmleditor-column-resizer';
const DX_ROW_RESIZER_CLASS = 'dx-htmleditor-row-resizer';
const DEFAULTS = {
  minColumnWidth: 40,
  minRowHeight: 24,
};

const DRAGGABLE_ELEMENT_OFFSET = 2;
const ROUGH_OFFSET = 3;

const MODULE_NAMESPACE = 'dxHtmlTableResizingModule';

const POINTERDOWN_EVENT = addNamespace('dxpointerdown', MODULE_NAMESPACE);
const SCROLL_EVENT = addNamespace('scroll', MODULE_NAMESPACE);

export default class TableResizingModule extends BaseModule {
  quill: any;

  _quillContainer: any;

  _tableData: any[];

  enabled: boolean;

  _tableResizeFrames: any[];

  _minColumnWidth: number;

  _minRowHeight: number;

  editorInstance: any;

  _isDragging?: boolean;

  _windowResizeTimeout: any;

  _framesForTables: any;

  _quillTextChangeHandler: any;

  _resizeHandlerWithContext: any;

  _startLineSize: any;

  _nextLineSize: any;

  _$highlightedElement!: dxElementWrapper;

  _currentDraggableElement!: Draggable;

  _nextColumnOffsetLimit: any;

  _attachResizerTimeout: any;

  _startTableWidth?: any;

  _startLineSeparatorPosition?: number;

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

  _applyResizing(forcedStart?: boolean) {
    if (forcedStart) {
      this._applyResizingImpl();
    } else {
      this.editorInstance.addContentInitializedCallback(this._applyResizingImpl.bind(this));
    }
    // @ts-expect-error
    this.addCleanCallback(this.clean.bind(this));
    this._resizeHandlerWithContext = _windowResizeCallbacks.add(this._resizeHandler.bind(this));
  }

  _minSizeLimit(propertyName, newValue): number {
    return isDefined(newValue) ? Math.max(newValue, 0) : DEFAULTS[propertyName];
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
    eventsEngine.on(this.editorInstance._getContent(), SCROLL_EVENT, this._updateFramesPositions.bind(this));

    this.quill.on('text-change', this._getQuillTextChangeHandler());
  }

  _detachEvents() {
    eventsEngine.off(this.editorInstance._getContent(), MODULE_NAMESPACE);
    this.quill.off('text-change', this._quillTextChangeHandler);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getQuillTextChangeHandler(delta?: any, oldContent?: any, source?: any) {
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
    return this._framesForTables?.get($table.get(0));
  }

  _resizeHandler() {
    this._windowResizeTimeout = setTimeout(() => {
      const $tables = this._findTables();
      each($tables, (index, table) => {
        const $table = $(table);
        const frame = this._tableResizeFrames[index];
        const actualTableWidth = getOuterWidth($table);
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
    return $(this._quillContainer).find('table');
  }

  _getWidthStyleValue($element) {
    const styleValue = $element[0].style.width;
    // eslint-disable-next-line radix
    return styleValue !== '' ? parseInt(styleValue) : undefined;
  }

  _tableLastWidth(frame, newValue?: any) {
    if (isDefined(newValue)) {
      frame.lastWidth = newValue;
    } else {
      return frame?.lastWidth;
    }
  }

  _fixTablesWidths($tables) {
    each($tables, (index, table) => {
      const $table = $(table);
      const $columnElements = this._getTableDeterminantElements($table, 'horizontal');

      if (!this._tableResizeFrames[index]) {
        this._tableResizeFrames[index] = { lastWidth: undefined };
      }
      const frame = this._getFrameForTable($table);

      if (!frame) {
        this._tableResizeFrames.push({ $table });
      }

      if (getAutoSizedElements($table).length === 0) {
        const { columnsSum } = this._getColumnElementsSum($columnElements);

        unfixTableWidth($table, { quill: this.quill });

        const tableWidth = this._tableLastWidth(frame) ?? getOuterWidth($table);

        if (frame) {
          this._tableLastWidth(frame, Math.max(columnsSum, tableWidth));
        }
      }
    });
  }

  _createResizeFrames($tables) {
    this._framesForTables = new Map();

    $tables.each((index, table) => {
      const $table = $(table);
      const $lastTable = this._tableResizeFrames[index]?.$table;
      const $tableLastWidth = this._tableResizeFrames[index].lastWidth;
      this._tableResizeFrames[index] = {
        $frame: this._createTableResizeFrame(table),
        $table,
        index,
        lastWidth: $lastTable && table === $lastTable.get(0) ? $tableLastWidth : undefined,
        columnsCount: this._getTableDeterminantElements($table, 'horizontal').length,
        rowsCount: this._getTableDeterminantElements($table, 'vertical').length,
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
      each($tables, (index, table) => {
        const $table = $(table);
        const frame = this._tableResizeFrames[index];
        const isColumnsCountChanged = frame?.columnsCount !== this._getTableDeterminantElements($table, 'horizontal').length;
        const isRowCountChanged = frame?.rowsCount !== this._getTableDeterminantElements($table, 'vertical').length;

        if (isColumnsCountChanged || isRowCountChanged) {
          result = true;
          return false;
        }
      });
    }
    return result;
  }

  _removeResizeFrames(clearArray?: boolean) {
    each(this._tableResizeFrames, (index, resizeFrame) => {
      if (resizeFrame.$frame) {
        const resizerElementsSelector = `.${DX_COLUMN_RESIZER_CLASS}, .${DX_ROW_RESIZER_CLASS}`;
        this._detachSeparatorEvents(resizeFrame.$frame?.find(resizerElementsSelector));
        resizeFrame.$frame.remove();
      }
    });

    this._framesForTables?.clear();

    if (clearArray) {
      this._tableResizeFrames = [];
    }
  }

  _detachSeparatorEvents($lineSeparators) {
    $lineSeparators.each((i, $lineSeparator) => {
      eventsEngine.off($lineSeparator, POINTERDOWN_EVENT);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _createTableResizeFrame(table?: any) {
    return $('<div>')
      .addClass(DX_COLUMN_RESIZE_FRAME_CLASS)
      .appendTo(this._quillContainer);
  }

  _updateFramesPositions() {
    each(this._tableResizeFrames, (index, tableResizeFrame) => {
      this._updateFramePosition(tableResizeFrame.$table, tableResizeFrame.$frame);
    });
  }

  _updateFramePosition($table, $frame) {
    const {
      height, width, top: targetTop, left: targetLeft,
    } = getBoundingRect($table.get(0));
    const { top: containerTop, left: containerLeft } = getBoundingRect(this.quill.root);

    $frame
      .css({
        height,
        width,
        top: targetTop - containerTop,
        left: targetLeft - containerLeft,
      });
    move($frame, { left: 0, top: 0 });
  }

  _updateFramesSeparators(direction?: any) {
    each(this._tableResizeFrames, (index, frame) => {
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
      const draggable = $($currentLineSeparator).dxDraggable('instance');
      draggable.dispose();
      $($currentLineSeparator).addClass(lineResizerClass);
    }
  }

  _getDirectionInfo(direction) {
    if (direction === 'vertical') {
      return {
        lineResizerClass: DX_ROW_RESIZER_CLASS,
        sizeFunction: (x) => getOuterHeight(x),
        positionCoordinate: 'top',
        positionStyleProperty: 'height',
        positionCoordinateName: 'y',
      };
    }
    return {
      lineResizerClass: DX_COLUMN_RESIZER_CLASS,
      sizeFunction: (x) => getOuterWidth(x),
      positionCoordinate: this.editorInstance.option('rtlEnabled') ? 'right' : 'left',
      positionStyleProperty: 'width',
      positionCoordinateName: 'x',
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
      transform: 'none',
    };

    let currentPosition = 0;
    for (let i = 0; i <= determinantElementsSeparatorsCount; i++) {
      currentPosition += this._getSize($determinantElements.eq(i), directionInfo);

      if (!isDefined(lineSeparators[i])) {
        lineSeparators[i] = $('<div>')
          .addClass(directionInfo.lineResizerClass)
          .appendTo(frame.$frame)
          .get(0);
      }

      const $currentLineSeparator = $(lineSeparators[i]);

      this._removeDraggable($currentLineSeparator, directionInfo.lineResizerClass);

      styleOptions[directionInfo.positionCoordinate] = currentPosition - DRAGGABLE_ELEMENT_OFFSET;
      $($currentLineSeparator).css(styleOptions);

      const attachSeparatorData = {
        lineSeparator: lineSeparators[i],
        index: i,
        $determinantElements,
        frame,
        direction,
      };
      this._attachColumnSeparatorEvents(attachSeparatorData);
    }
  }

  _getTableDeterminantElements($table, direction?: any) {
    if (direction === 'vertical') {
      return $table.find('th:first-child, td:first-child');
    }
    return getColumnElements($table);
  }

  _attachColumnSeparatorEvents(options) {
    eventsEngine.on(options.lineSeparator, POINTERDOWN_EVENT, () => {
      this._createDraggableElement(options);
    });
  }

  _dragStartHandler({
    $determinantElements, index, frame, direction, lineSeparator,
  }) {
    const directionInfo = this._getDirectionInfo(direction);

    this._isDragging = true;

    this._fixColumnsWidth(frame.$table);
    // eslint-disable-next-line radix
    this._startLineSize = parseInt(this._getSize($($determinantElements[index]), directionInfo));
    this._startTableWidth = getOuterWidth(frame.$table);
    // @ts-expect-error
    // eslint-disable-next-line radix
    this._startLineSeparatorPosition = parseInt($(lineSeparator).css(directionInfo.positionCoordinate));
    this._nextLineSize = 0;
    if ($determinantElements[index + 1]) {
      // eslint-disable-next-line radix
      this._nextLineSize = parseInt(this._getSize($($determinantElements[index + 1]), directionInfo));
    } else if (direction === 'horizontal') {
      unfixTableWidth(frame.$table, { quill: this.quill });
    }
  }

  _shouldRevertOffset(direction) {
    return direction === 'horizontal' && this.editorInstance.option('rtlEnabled');
  }

  _isNextColumnWidthEnough(nextColumnNewSize, $nextColumnElement, eventOffset) {
    if (!this._nextLineSize) {
      return true;
    } if (nextColumnNewSize >= this._minColumnWidth) {
      const isWidthIncreased = this._nextColumnOffsetLimit ? eventOffset < this._nextColumnOffsetLimit : eventOffset < 0;
      // @ts-expect-error
      const isWidthLimited = Math.abs(this._getWidthStyleValue($nextColumnElement) - getOuterWidth($nextColumnElement)) > ROUGH_OFFSET;

      return isWidthIncreased || !isWidthLimited;
    }

    return false;
  }

  _shouldSetNextColumnWidth(nextColumnNewSize) {
    return this._nextLineSize && nextColumnNewSize > 0;
  }

  _horizontalDragHandler({
    currentLineNewSize, directionInfo, eventOffset, $determinantElements, index, frame,
  }) {
    let nextColumnNewSize = this._nextLineSize && this._nextLineSize - eventOffset;
    const isCurrentColumnWidthEnough = currentLineNewSize >= this._minColumnWidth;
    const $lineElements = getLineElements(frame.$table, index);
    const $nextLineElements = getLineElements(frame.$table, index + 1);
    const realWidthDiff = getOuterWidth($lineElements.eq(0)) - currentLineNewSize;

    if (isCurrentColumnWidthEnough) {
      if (this._isNextColumnWidthEnough(nextColumnNewSize, $determinantElements.eq(index + 1), eventOffset)) {
        setLineElementsFormat(this, {
          elements: $lineElements,
          property: directionInfo.positionStyleProperty,
          value: currentLineNewSize,
        });

        if (this._shouldSetNextColumnWidth(nextColumnNewSize)) {
          setLineElementsFormat(this, {
            elements: $nextLineElements,
            property: directionInfo.positionStyleProperty,
            value: nextColumnNewSize,
          });
        }

        const isTableWidthChanged = Math.abs(this._startTableWidth - getOuterWidth(frame.$table)) < ROUGH_OFFSET;
        const shouldRevertNewValue = Math.abs(realWidthDiff) > ROUGH_OFFSET || (!this._nextLineSize && isTableWidthChanged);

        if (shouldRevertNewValue) {
          setLineElementsFormat(this, {
            elements: $lineElements,
            property: directionInfo.positionStyleProperty,
            value: getOuterWidth($lineElements.eq(0)),
          });

          nextColumnNewSize += currentLineNewSize - getOuterWidth($lineElements.eq(0));

          if (this._shouldSetNextColumnWidth(nextColumnNewSize)) {
            setLineElementsFormat(this, {
              elements: $nextLineElements,
              property: directionInfo.positionStyleProperty,
              value: nextColumnNewSize,
            });
          }
        }
      } else {
        this._nextColumnOffsetLimit = this._nextColumnOffsetLimit || eventOffset;
      }
    }

    this._$highlightedElement.css(directionInfo.positionCoordinate, `${this._startLineSeparatorPosition + eventOffset + realWidthDiff}px`);
  }

  _verticalDragHandler({
    currentLineNewSize, directionInfo, eventOffset, $determinantElements, index, frame,
  }) {
    const newHeight = Math.max(currentLineNewSize, this._minRowHeight);
    const $lineElements = getLineElements(frame.$table, index, 'vertical');

    setLineElementsFormat(this, {
      elements: $lineElements,
      property: directionInfo.positionStyleProperty,
      value: newHeight,
    });

    const rowHeightDiff = getOuterHeight($determinantElements.eq(index)) - currentLineNewSize;

    this._$highlightedElement.css(directionInfo.positionCoordinate, `${this._startLineSeparatorPosition + eventOffset + rowHeightDiff}px`);
  }

  _dragMoveHandler(event, {
    $determinantElements, index, frame, direction,
  }) {
    const directionInfo = this._getDirectionInfo(direction);
    let eventOffset = event.offset[directionInfo.positionCoordinateName];

    this.editorInstance._saveValueChangeEvent(event);

    if (this._shouldRevertOffset(direction)) {
      eventOffset = -eventOffset;
    }
    const currentLineNewSize = this._startLineSize + eventOffset;

    if (direction === 'horizontal') {
      this._horizontalDragHandler({
        currentLineNewSize, directionInfo, eventOffset, $determinantElements, index, frame,
      });
    } else {
      this._verticalDragHandler({
        currentLineNewSize, directionInfo, eventOffset, $determinantElements, index, frame,
      });
    }

    this._updateFramePosition(frame.$table, frame.$frame);
  }

  _dragEndHandler(options) {
    this._$highlightedElement?.remove();
    this._isDragging = undefined;
    this._nextColumnOffsetLimit = undefined;
    this._tableLastWidth(options.frame, getOuterWidth(options.frame.$table));
    this._updateFramesPositions();
    this._updateFramesSeparators();
  }

  _isLastColumnResizing({ $determinantElements, index }) {
    return !isDefined($determinantElements[index + 1]);
  }

  _getBoundaryConfig(options) {
    const result: Properties = {};

    if (options.direction === 'vertical') {
      result.boundary = options.frame.$table;
      // @ts-expect-error
      result.boundOffset = {
        bottom: hasWindow() ? -getHeight(getWindow()) : -getOuterHeight(this._quillContainer),
        top: 0,
        left: 0,
        right: 0,
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
        right: $content.css('paddingRight'),
      };
    }

    return result;
  }

  _createDraggableElement(options) {
    const boundaryConfig = this._getBoundaryConfig(options);

    const directionClass = options.direction === 'vertical' ? 'dx-htmleditor-highlighted-row' : 'dx-htmleditor-highlighted-column';

    this._$highlightedElement?.remove();
    this._$highlightedElement = $('<div>').addClass(`${directionClass}`).insertAfter($(options.lineSeparator));

    const config = {
      contentTemplate: null,
      allowMoveByClick: false,
      dragDirection: options.direction,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onDragMove: ({ component, event }) => {
        this._dragMoveHandler(event, options);
      },
      onDragStart: () => {
        this._dragStartHandler(options);
      },
      onDragEnd: () => {
        this._dragEndHandler(options);
      },
    };

    extend(config, boundaryConfig);

    this._currentDraggableElement = this.editorInstance._createComponent(options.lineSeparator, Draggable, config);
  }

  _fixColumnsWidth($table) {
    const determinantElements = this._getTableDeterminantElements($table);

    each(determinantElements, (index, element) => {
      const columnWidth = getOuterWidth(element);
      const $lineElements = getLineElements($table, index);
      setLineElementsFormat(this, {
        elements: $lineElements,
        property: 'width',
        value: Math.max(columnWidth, this._minColumnWidth),
      });
    });
  }

  _getColumnElementsSum(columnElements) {
    const columnsWidths: any[] = [];
    let columnsSum = 0;

    each(columnElements, (index, element) => {
      const $element = $(element);
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const columnWidth = this._getWidthStyleValue($element) || getOuterWidth($element);

      columnsWidths[index] = Math.max(columnWidth, this._minColumnWidth);
      columnsSum += columnsWidths[index];
    });

    return {
      columnsWidths,
      columnsSum,
    };
  }

  _setColumnsRatioWidth(columnElements, ratio, columnsWidths, $table) {
    each(columnElements, (index) => {
      const $lineElements = getLineElements($table, index);
      let resultWidth;
      if (ratio > 0) {
        resultWidth = this._minColumnWidth + Math.round((columnsWidths[index] - this._minColumnWidth) * ratio);
      } else {
        resultWidth = this._minColumnWidth;
      }

      setLineElementsFormat(this, {
        elements: $lineElements,
        property: 'width',
        value: resultWidth,
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
    const tableWidth = this._tableLastWidth(frame) || getOuterWidth($table);
    let ratio;

    const { columnsWidths, columnsSum } = this._getColumnElementsSum(determinantElements);

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
    each($tables, (index, table) => {
      this._updateColumnsWidth($(table), index);
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

    _windowResizeCallbacks.remove(this._resizeHandlerWithContext);
    clearTimeout(this._windowResizeTimeout);
    this._resizeHandlerWithContext = undefined;
    this._isDragging = undefined;
    this._startTableWidth = undefined;

    clearTimeout(this._attachResizerTimeout);
  }
}
