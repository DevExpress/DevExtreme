import $ from '../../../core/renderer';
import eventsEngine from '../../../events/core/events_engine';
import { isDefined } from '../../../core/utils/type';
import { addNamespace } from '../../../events/utils/index';
import _windowResizeCallbacks from '../../../core/utils/resize_callbacks';
import { move } from '../../../animation/translator';
import { getBoundingRect } from '../../../core/utils/position';
import BaseModule from './base';
import Draggable from '../../draggable';
import { each } from '../../../core/utils/iterator';
import { getWindow, hasWindow } from '../../../core/utils/window';
import { extend } from '../../../core/utils/extend';

const DX_COLUMN_RESIZE_FRAME_CLASS = 'dx-table-resize-frame';
const DX_COLUMN_RESIZER_CLASS = 'dx-htmleditor-column-resizer';
const DX_ROW_RESIZER_CLASS = 'dx-htmleditor-row-resizer';
const DEFAULT_MIN_COLUMN_WIDTH = 40;
const DEFAULT_MIN_ROW_HEIGHT = DEFAULT_MIN_COLUMN_WIDTH / 2;

const DRAGGABLE_ELEMENT_OFFSET = 2;

const MODULE_NAMESPACE = 'dxHtmlTableResizingModule';

const POINTERDOWN_EVENT = addNamespace('dxpointerdown', MODULE_NAMESPACE);
const SCROLL_EVENT = addNamespace('scroll', MODULE_NAMESPACE);

export default class TableResizingModule extends BaseModule {
    constructor(quill, options) {
        super(quill, options);
        this.enabled = !!options.enabled;
        this._tableResizeFrames = [];
        this._minColumnWidth = options.minColumnWidth ?? DEFAULT_MIN_COLUMN_WIDTH;
        this._minRowHeight = options.minRowHeight ?? DEFAULT_MIN_ROW_HEIGHT;
        this._quillContainer = this.editorInstance._getQuillContainer();
        this._tableData = [];

        if(this.enabled) {
            this.editorInstance.addContentInitializedCallback(() => {
                const $tables = this._findTables();
                if($tables.length) {
                    this._fixTablesWidths($tables);
                    this._createResizeFrames($tables);
                    this._updateFramesPositions();
                    this._updateFramesSeparators();
                }

                this._attachEvents();
            });

            this.addCleanCallback(this.clean.bind(this));
            this._resizeHandler = _windowResizeCallbacks.add(this._resizeHandler.bind(this));
        }
    }

    _attachEvents() {
        eventsEngine.on(this.editorInstance._getContent(), SCROLL_EVENT, this._updateFramesPositions.bind(this));

        this.quill.on('text-change', this._getQuillTextChangeHandler());
    }

    _detachEvents() {
        eventsEngine.off(this.editorInstance._getContent(), MODULE_NAMESPACE);
        this.quill.off('text-change', this._quillTextChangeHandler);
    }

    _getQuillTextChangeHandler(delta, oldContent, source) {
        return (delta, oldContent, source) => {
            if(this._isTableChanging()) {
                const $tables = this._findTables();
                this._removeResizeFrames();
                if(source === 'api') {
                    this._fixTablesWidths($tables);
                }

                this._updateTablesColumnsWidth($tables);
                this._createResizeFrames($tables);
                this._updateFramesPositions();
                this._updateFramesSeparators();
            } else {
                this._updateFramesPositions();
                if(!this._verticalDragging) {
                    this._updateFramesSeparators('vertical');
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
                const actualTableWidth = $table.outerWidth();
                const lastTableWidth = this._tableLastWidth(frame);
                if(Math.abs(actualTableWidth - lastTableWidth) > 1) {
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

    _getWidthAttrValue($element) {
        const attrValue = $element.attr('width');
        return attrValue ? parseInt(attrValue) : undefined;
    }

    _tableLastWidth(frame, newValue) {
        if(isDefined(newValue)) {
            frame.lastWidth = newValue;
        } else {
            return frame?.lastWidth;
        }
    }

    _fixTablesWidths($tables) {
        each($tables, (index, table) => {
            const $table = $(table);
            const $columnElements = this._getTableDeterminantElements($table, 'horizontal');

            if(!this._tableResizeFrames[index]) {
                this._tableResizeFrames[index] = { lastWidth: undefined };
            }
            const frame = this._getFrameForTable($table);

            if(!frame) {
                this._tableResizeFrames.push({ $table: $table });
            }

            if($columnElements.eq(0).attr('width')) {
                const { columnsSum } = this._getColumnElementsSum($columnElements);

                $table.css('width', 'initial');

                const tableWidth = this._tableLastWidth(frame) ?? $table.outerWidth();

                if(frame) {
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
                $table: $table,
                index: index,
                lastWidth: ($lastTable && table === $lastTable.get(0)) ? $tableLastWidth : undefined,
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
        if($tables.length !== this._tableResizeFrames.length) {
            result = true;
        } else {
            each($tables, (index, table) => {
                const $table = $(table);
                const frame = this._tableResizeFrames[index];
                const isColumnsCountChanged = frame?.columnsCount !== this._getTableDeterminantElements($table, 'horizontal').length;
                const isRowCountChanged = frame?.rowsCount !== this._getTableDeterminantElements($table, 'vertical').length;

                if(isColumnsCountChanged || isRowCountChanged) {
                    result = true;
                    return false;
                }
            });
        }
        return result;
    }

    _removeResizeFrames(clearArray) {
        each(this._tableResizeFrames, (index, resizeFrame) => {
            if(resizeFrame.$frame) {
                const resizerElementsSelector = `.${DX_COLUMN_RESIZER_CLASS}, .${DX_ROW_RESIZER_CLASS}`;
                this._detachSeparatorEvents(resizeFrame.$frame?.find(resizerElementsSelector));
                resizeFrame.$frame.remove();
            }
        });

        this._framesForTables?.clear();

        if(clearArray) {
            this._tableResizeFrames = [];
        }
    }

    _detachSeparatorEvents($lineSeparators) {
        $lineSeparators.each((i, $lineSeparator) => {
            eventsEngine.off($lineSeparator, POINTERDOWN_EVENT);
        });
    }

    _createTableResizeFrame() {
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
        const { height, width, top: targetTop, left: targetLeft } = getBoundingRect($table.get(0));
        const { top: containerTop, left: containerLeft } = getBoundingRect(this.quill.root);

        $frame
            .css({
                height: height,
                width: width,
                top: targetTop - containerTop,
                left: targetLeft - containerLeft
            });
        move($frame, { left: 0, top: 0 });
    }

    _updateFramesSeparators(direction) {
        each(this._tableResizeFrames, (index, frame) => {
            if(direction) {
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
        if(this._isDraggable($currentLineSeparator)) {
            const draggable = $($currentLineSeparator).dxDraggable('instance');
            draggable.dispose();
            $($currentLineSeparator).addClass(lineResizerClass);
        }
    }

    _getDirectionInfo(direction) {
        if(direction === 'vertical') {
            return {
                lineResizerClass: DX_ROW_RESIZER_CLASS,
                sizeFunction: 'outerHeight',
                positionCoordinate: 'top',
                positionStyleProperty: 'height',
                positionCoordinateName: 'y'
            };
        } else {
            return {
                lineResizerClass: DX_COLUMN_RESIZER_CLASS,
                sizeFunction: 'outerWidth',
                positionCoordinate: this.editorInstance.option('rtlEnabled') ? 'right' : 'left',
                positionStyleProperty: 'width',
                positionCoordinateName: 'x'
            };
        }
    }

    _getSize($element, directionInfo) {
        return $element[directionInfo.sizeFunction]();
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
        for(let i = 0; i <= determinantElementsSeparatorsCount; i++) {
            currentPosition += this._getSize($determinantElements.eq(i), directionInfo);

            if(!isDefined(lineSeparators[i])) {
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
                direction
            };
            this._attachColumnSeparatorEvents(attachSeparatorData);
        }
    }

    _getTableDeterminantElements($table, direction) {
        if(direction === 'vertical') {
            return $table.find('td:first-child');
        } else {
            const $theadElements = $table.find('th');
            if($theadElements.length) {
                return $theadElements;
            } else {
                return $table.find('tr').eq(0).find('td');
            }
        }
    }

    _attachColumnSeparatorEvents(options) {
        eventsEngine.on(options.lineSeparator, POINTERDOWN_EVENT, () => {
            this._createDraggableElement(options);
        });
    }

    _dragStartHandler({ $determinantElements, index, frame, direction, lineSeparator }) {
        const directionInfo = this._getDirectionInfo(direction);

        if(direction === 'vertical') {
            this._verticalDragging = true;
        }

        this._fixColumnsWidth(frame.$table);
        this._startLineSize = parseInt(this._getSize($($determinantElements[index]), directionInfo));
        this._startLineSeparatorPosition = parseInt($(lineSeparator).css(directionInfo.positionCoordinate));
        this._nextLineSize = 0;
        if($determinantElements[index + 1]) {
            this._nextLineSize = parseInt(this._getSize($($determinantElements[index + 1]), directionInfo));
        } else if(direction === 'horizontal') {
            frame.$table.css('width', 'initial');
        }
    }

    _shouldRevertOffset(direction) {
        return direction === 'horizontal' && this.editorInstance.option('rtlEnabled');
    }

    _getLineElements($table, index, direction) {
        let result;
        if(direction !== 'vertical') {
            result = $table.find(`td:nth-child(${(1 + index)})`);
        } else {
            result = $table.find('tr').eq(index).find('td');
        }
        return result;
    }

    _setLineElementsAttrValue($lineElements, property, value) {
        each($lineElements, (i, element) => {
            $(element).attr(property, value + 'px');
        });
    }

    _horizontalDragHandler(currentLineNewSize, directionInfo, eventOffset, { index, frame }) {
        let nextColumnNewSize = this._nextLineSize && this._nextLineSize - eventOffset;
        const isCurrentColumnHasEnoughPlace = currentLineNewSize >= this._minColumnWidth;
        const isNextColumnHasEnoughPlace = !this._nextLineSize || nextColumnNewSize >= this._minColumnWidth;
        const $lineElements = this._getLineElements(frame.$table, index);
        const $nextLineElements = this._getLineElements(frame.$table, index + 1);

        if(isCurrentColumnHasEnoughPlace && isNextColumnHasEnoughPlace) {
            this._setLineElementsAttrValue($lineElements, directionInfo.positionStyleProperty, currentLineNewSize);

            this._$highlightedElement.css(directionInfo.positionCoordinate, (this._startLineSeparatorPosition + eventOffset) + 'px');

            const realWidthDiff = $($lineElements.eq(0)).outerWidth() - currentLineNewSize;
            const shouldApplyNewValue = this._shouldRevertOffset() ? realWidthDiff < 5 : realWidthDiff > -5;

            if(!shouldApplyNewValue) {
                this._setLineElementsAttrValue($lineElements, directionInfo.positionStyleProperty, $($lineElements.eq(0)).outerWidth());

                nextColumnNewSize = currentLineNewSize - $($lineElements.eq(0)).outerWidth();
            }

            if(this._nextLineSize && nextColumnNewSize > 0) {
                this._setLineElementsAttrValue($nextLineElements, directionInfo.positionStyleProperty, nextColumnNewSize);
            }
        }
    }

    _verticalDragHandler(currentLineNewSize, directionInfo, eventOffset, { $determinantElements, index, frame }) {
        const newHeight = Math.max(currentLineNewSize, this._minRowHeight);
        const $lineElements = this._getLineElements(frame.$table, index, 'vertical');

        this._setLineElementsAttrValue($lineElements, directionInfo.positionStyleProperty, newHeight);

        if(Math.abs($determinantElements.eq(index).outerHeight() - currentLineNewSize) < 1) {
            this._$highlightedElement.css(directionInfo.positionCoordinate, (this._startLineSeparatorPosition + eventOffset) + 'px');
        } else {
            this._$highlightedElement.css(directionInfo.positionCoordinate, this._startLineSeparatorPosition + 'px');
        }
    }

    _dragMoveHandler(event, { $determinantElements, index, frame, direction }) {
        const directionInfo = this._getDirectionInfo(direction);
        let eventOffset = event.offset[directionInfo.positionCoordinateName];

        if(this._shouldRevertOffset(direction)) {
            eventOffset = -eventOffset;
        }
        const currentLineNewSize = this._startLineSize + eventOffset;

        if(direction === 'horizontal') {
            this._horizontalDragHandler(currentLineNewSize, directionInfo, eventOffset, { index, frame });
        } else {
            this._verticalDragHandler(currentLineNewSize, directionInfo, eventOffset, { $determinantElements, index, frame });
        }

        this._updateFramePosition(frame.$table, frame.$frame);
    }

    _dragEndHandler(options) {
        this._$highlightedElement?.remove();
        this._verticalDragging = false;
        this._tableLastWidth(options.frame, options.frame.$table.outerWidth());
        this._updateFramesPositions();
        this._updateFramesSeparators();
    }

    _isLastColumnResizing({ $determinantElements, index }) {
        return !isDefined($determinantElements[index + 1]);
    }

    _getBoundaryConfig(options) {
        const result = {};

        if(options.direction === 'vertical') {
            result.boundary = options.frame.$table;
            result.boundOffset = {
                bottom: hasWindow() ? -$(getWindow()).height() : -$(this._quillContainer).outerHeight(),
                top: 0,
                left: 0,
                right: 0
            };
        } else {
            if(!this._isLastColumnResizing(options)) {
                result.boundary = options.frame.$table;
            } else {
                result.boundary = $(this._quillContainer);
            }
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
            onDragMove: ({ component, event }) => {
                this._dragMoveHandler(event, options);
            },
            onDragStart: () => {
                this._dragStartHandler(options);
            },
            onDragEnd: () => {
                this._dragEndHandler(options);
            }
        };

        extend(config, boundaryConfig);

        this._currentDraggableElement = this.editorInstance._createComponent(options.lineSeparator, Draggable, config);
    }

    _fixColumnsWidth($table) {
        const determinantElements = this._getTableDeterminantElements($table);

        each(determinantElements, (index, element) => {
            const columnWidth = $(element).outerWidth();
            const $lineElements = this._getLineElements($table, index);
            this._setLineElementsAttrValue($lineElements, 'width', Math.max(columnWidth, DEFAULT_MIN_COLUMN_WIDTH));
        });
    }

    _getColumnElementsSum(columnElements) {
        const columnsWidths = [];
        let columnsSum = 0;

        each(columnElements, (index, element) => {
            const $element = $(element);
            const columnWidth = this._getWidthAttrValue($element) || $element.outerWidth();

            columnsWidths[index] = Math.max(columnWidth, this._minColumnWidth);
            columnsSum += columnsWidths[index];
        });

        return {
            columnsWidths,
            columnsSum
        };
    }

    _setColumnsRatioWidth(columnElements, ratio, columnsWidths, $table) {
        each(columnElements, (index) => {
            const $lineElements = this._getLineElements($table, index);
            let resultWidth;
            if(ratio > 0) {
                resultWidth = (this._minColumnWidth + Math.round((columnsWidths[index] - this._minColumnWidth) * ratio));
            } else {
                resultWidth = this._minColumnWidth;
            }

            this._setLineElementsAttrValue($lineElements, 'width', resultWidth);
        });
    }

    _updateColumnsWidth($table, frameIndex) {
        const determinantElements = this._getTableDeterminantElements($table);
        let frame = this._tableResizeFrames[frameIndex];

        if(!frame) {
            this._tableResizeFrames[frameIndex] = {};
        }

        frame = this._tableResizeFrames[frameIndex];
        const tableWidth = this._tableLastWidth(frame) || $table.outerWidth();
        let ratio;

        const { columnsWidths, columnsSum } = this._getColumnElementsSum(determinantElements);

        const minWidthForColumns = determinantElements.length * this._minColumnWidth;

        if(columnsSum > minWidthForColumns) {
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

    clean() {
        this._removeResizeFrames(true);
        this._detachEvents();

        _windowResizeCallbacks.remove(this._resizeHandler);
        clearTimeout(this._windowResizeTimeout);
        this._resizeHandler = undefined;
        this._verticalDragging = undefined;

        clearTimeout(this._attachResizerTimeout);
    }
}
