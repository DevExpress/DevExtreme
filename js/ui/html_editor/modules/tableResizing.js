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

const TIMEOUT = 100;

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
        this._minRowHeight = options.minRowHeight ?? DEFAULT_MIN_COLUMN_WIDTH / 2;
        this._quillContainer = this.editorInstance._getQuillContainer();
        this._quillInstance = quill;

        if(this.enabled) {
            this._attachResizerTimeout = setTimeout(() => {

                const $tables = this._findTables();
                if($tables.length) {
                    this._createResizeFrames($tables);
                    this._updateFramesPositions();
                    this._updateFramesSeparators();

                    this._attachEvents();
                }
            }, TIMEOUT);

            this._resizeHandler = _windowResizeCallbacks.add(this._resizeHandler.bind(this));
        }
    }

    _attachEvents() {
        eventsEngine.on(this.editorInstance._getContent(), SCROLL_EVENT, this._updateFramesPositions.bind(this));

        this._quillTextChangeHandler = this._getQuillTextChangeHandler.bind(this);
        this._quillInstance.on('text-change', this._quillTextChangeHandler);
    }

    _detachEvents() {
        eventsEngine.off(this.editorInstance._getContent(), MODULE_NAMESPACE);
        this._quillInstance.off('text-change', this._quillTextChangeHandler);
    }

    _getQuillTextChangeHandler(delta) {
        // console.log('_getQuillTextChangeHandler');
        if(this._isTableChanges()) {
            // console.log('_isTableChanges');
            this._removeResizeFrames();
            const $tables = this._findTables();
            this._updateColumnsWidth($tables);

            clearTimeout(this._attachResizerTimeout);
            // this._attachResizerTimeout = setTimeout(() => {

            this._createResizeFrames($tables);
            this._updateFramesPositions();
            this._updateFramesSeparators();
            // }, TIMEOUT);
        } else {
            this._updateFramesPositions();
        }
    }

    _resizeHandler() {
        this._windowResizeTimeout = setTimeout(() => {
            this._updateFramesPositions();
            this._updateFramesSeparators();
        });
    }

    _findTables() {
        return $(this.editorInstance._getQuillContainer()).find('table');
    }

    _createResizeFrames($tables) {
        // console.log('_createResizeFrames');
        $tables.each((index, $item) => {
            const $table = $($item);
            this._tableResizeFrames[index] = {
                $frame: this._createTableResizeFrame($item),
                $table: $table,
                index: index,
                columnsCount: this._getTableDeterminantElements($table, 'horizontal').length,
                rowsCount: this._getTableDeterminantElements($table, 'vertical').length
            };
        });
    }

    _isTableChanges() {
        const $tables = this._findTables();

        let result = false;
        if($tables.length !== this._tableResizeFrames.length) {
            result = true;
        } else {
            each($tables, (_, table) => {
                const $table = $(table);
                const frame = this._getFrameForTable($table);

                if(!frame || frame.columnsCount !== this._getTableDeterminantElements($table, 'horizontal').length || frame.rowsCount !== this._getTableDeterminantElements($table, 'vertical').length) {
                    result = true;
                    return false;
                }
            });
        }
        return result;
    }

    _getFrameForTable($table) {
        let result;

        each(this._tableResizeFrames, (_, frame) => {
            if(frame.$table.get(0) === $table.get(0)) {
                result = frame;
                return false;
            }
        });

        return result;
    }

    _removeResizeFrames() {
        each(this._tableResizeFrames, (index, $item) => {
            this._detachSeparatorEvents($item.$frame.find(`.${DX_COLUMN_RESIZER_CLASS}, .${DX_ROW_RESIZER_CLASS}`));
            $item.$frame.remove();
        });

        this._tableResizeFrames = [];
    }

    _detachSeparatorEvents($lineSeparators) {
        $lineSeparators.each((i, $lineSeparator) => {
            eventsEngine.off($lineSeparator, POINTERDOWN_EVENT);
        });
    }

    _createTableResizeFrame() {
        return $('<div>')
            .addClass(DX_COLUMN_RESIZE_FRAME_CLASS)
            .appendTo(this.editorInstance._getQuillContainer());
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

    _updateFramesSeparators() {
        each(this._tableResizeFrames, (index, frame) => {
            this._updateFrameSeparators(frame, 'vertical');
            this._updateFrameSeparators(frame, 'horizontal');
        });
    }

    _isDraggable($element) {
        return $element.hasClass('dx-draggable') && $element.is(':visible');
    }

    _removeOldDraggable($currentLineSeparator, lineResizerClass) {
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
                getSizeFunction: 'outerHeight',
                positionCoordinate: 'top',
                positionStyleProperty: 'height',
                positionCoordinateName: 'y'
            };
        } else {
            return {
                lineResizerClass: DX_COLUMN_RESIZER_CLASS,
                getSizeFunction: 'outerWidth',
                positionCoordinate: this.editorInstance.option('rtlEnabled') ? 'right' : 'left',
                positionStyleProperty: 'width',
                positionCoordinateName: 'x'
            };
        }
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
            currentPosition += $determinantElements.eq(i)[directionInfo.getSizeFunction]();

            if(!isDefined(lineSeparators[i])) {
                lineSeparators[i] = $('<div>')
                    .addClass(directionInfo.lineResizerClass)
                    .appendTo(frame.$frame)
                    .get(0);
            }

            const $currentLineSeparator = $(lineSeparators[i]);

            this._removeOldDraggable($currentLineSeparator, directionInfo.lineResizerClass);

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

    _dragStartHandler({ $determinantElements, index, frame, direction }) {
        const directionInfo = this._getDirectionInfo(direction);

        this._fixColumnsWidth(frame.$table);
        this._startLineSize = parseInt($($determinantElements[index])[directionInfo.getSizeFunction]());
        this._nextLineSize = 0;
        if($determinantElements[index + 1]) {
            this._nextLineSize = parseInt($($determinantElements[index + 1])[directionInfo.getSizeFunction]());
        } else if(direction === 'horizontal') {
            frame.$table.css('width', 'initial');
        }
    }

    _shouldRevertOffset(direction) {
        return direction === 'horizontal' && this.editorInstance.option('rtlEnabled');
    }

    _dragMoveHandler(event, { $determinantElements, index, frame, direction }) {
        const directionInfo = this._getDirectionInfo(direction);
        let eventOffset = event.offset[directionInfo.positionCoordinateName];

        if(this._shouldRevertOffset(direction)) {
            eventOffset = -eventOffset;
        }
        const currentLineNewSize = this._startLineSize + eventOffset;

        if(direction === 'horizontal') {
            const nextColumnNewSize = this._nextLineSize && this._nextLineSize - eventOffset;
            const isCurrentColumnHasEnoughPlace = currentLineNewSize >= this._minColumnWidth;
            const isNextColumnHasEnoughPlace = !this._nextLineSize || nextColumnNewSize >= this._minColumnWidth;
            const $lineElements = frame.$table.find('td:nth-child(' + (1 + index) + ')');
            const $nextLineElements = frame.$table.find('td:nth-child(' + (2 + index) + ')');

            if(isCurrentColumnHasEnoughPlace && isNextColumnHasEnoughPlace) {
                $lineElements.each((i, element) => {
                    $(element).attr(directionInfo.positionStyleProperty, currentLineNewSize + 'px');
                });

                if(this._nextLineSize) {
                    $nextLineElements.each((i, element) => {
                        $(element).attr(directionInfo.positionStyleProperty, nextColumnNewSize + 'px');
                    });
                }
            }
        } else {
            const newHeight = Math.max(currentLineNewSize, this._minRowHeight);
            $determinantElements.eq(index).attr(directionInfo.positionStyleProperty, newHeight + 'px');
        }

        this._updateFramePosition(frame.$table, frame.$frame);
    }

    _isLastColumnResizing({ $determinantElements, index }) {
        return !isDefined($determinantElements[index + 1]);
    }

    _getBoundaryConfig(options) {
        const result = {};

        if(options.direction === 'vertical') {
            result.boundary = options.frame.$table;
            result.boundOffset = {
                bottom: hasWindow() ? -$(getWindow()).height() : -$(this._quillContainer).outerHeight,
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
                // if(!options.$determinantElements[options.index + 1] && options.direction !== 'vertical') {
                options.frame.$table.attr('width', options.frame.$table.outerWidth());
                // options.frame.$table.css('minWidth', options.frame.$table.outerWidth());
                // }
                this._updateFramesPositions();
                this._updateFramesSeparators();
            }
        };

        extend(config, boundaryConfig);

        this._currentDraggableElement = this.editorInstance._createComponent(options.lineSeparator, Draggable, config);
    }

    _fixColumnsWidth($table) {
        const determinantElements = this._getTableDeterminantElements($table);

        each(determinantElements, (index, element) => {
            const columnWidth = $(element).outerWidth();
            $(element).attr('width', columnWidth >= DEFAULT_MIN_COLUMN_WIDTH ? columnWidth : DEFAULT_MIN_COLUMN_WIDTH);
        });
    }

    _recalculateColumnsWidth($table) {
        // console.log('_recalculateColumnsWidth');
        const determinantElements = this._getTableDeterminantElements($table);

        const tableWidth = $table.attr('width');

        const columnsWidths = [];

        let columnSum;

        let ratio = 1;

        each(determinantElements, (index, element) => {
            const columnWidth = $(element).outerWidth();
            columnSum += columnWidth;
            columnsWidths[index] = columnWidth >= DEFAULT_MIN_COLUMN_WIDTH ? columnWidth : DEFAULT_MIN_COLUMN_WIDTH;
        });

        if(columnSum > tableWidth - 1) {
            ratio = tableWidth / columnSum;
        }

        // console.log('_recalculateColumnsWidth:');
        // console.log('columnSum: ' + columnSum);
        // console.log('tableWidth: ' + tableWidth);
        // console.log('ratio: ' + ratio);
        each(determinantElements, (index, element) => {
            // console.log(Math.round(columnsWidths[index] * ratio));
            $(element).attr('width', Math.round(columnsWidths[index] * ratio));
        });
    }

    _updateColumnsWidth($tables) {
        each($tables, (_, table) => {
            this._recalculateColumnsWidth($(table));
        });
    }

    clean() {
        this._removeResizeFrames();
        this._detachEvents();

        _windowResizeCallbacks.remove(this._resizeHandler);
        clearTimeout(this._windowResizeTimeout);
        this._resizeHandler = null;

        clearTimeout(this._attachResizerTimeout);
    }
}
