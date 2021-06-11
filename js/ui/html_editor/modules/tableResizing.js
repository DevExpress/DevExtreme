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

const DX_COLUMN_RESIZE_FRAME_CLASS = 'dx-table-resize-frame';
const DX_COLUMN_RESIZER_CLASS = 'dx-htmleditor-column-resizer';
const DX_ROW_RESIZER_CLASS = 'dx-htmleditor-row-resizer';
const DEFAULT_MIN_COLUMN_WIDTH = 40;

const DRAGGABLE_ELEMENT_OFFSET = 1;

const MODULE_NAMESPACE = 'dxHtmlTableResizingModule';

const POINTERDOWN_EVENT = addNamespace('dxpointerdown', MODULE_NAMESPACE);

export default class TableResizingModule extends BaseModule {
    constructor(quill, options) {
        super(quill, options);
        this.enabled = !!options.enabled;
        this._tableResizeFrames = [];
        this._minColumnWidth = options.minColumnWidth ?? DEFAULT_MIN_COLUMN_WIDTH;
        this._minRowHeight = options.minRowHeight ?? DEFAULT_MIN_COLUMN_WIDTH / 2;


        if(this.enabled) {
            this.editorInstance.on('contentReady', () => {
                this._attachResizerTimeout = setTimeout(() => {

                    const $tables = this._findTables();
                    if($tables.length) {
                        this._createResizeFrames($tables);
                        this._updateFramesPositions();
                        this._updateFramesSeparators();

                        quill.on('text-change', (delta) => {
                            if(this._isTableChanges(delta)) {
                                this._removeResizeFrames();

                                clearTimeout(this._attachResizerTimeout);
                                this._attachResizerTimeout = setTimeout(() => {
                                    this._createResizeFrames(this._findTables());
                                    this._updateFramesPositions();
                                    this._updateFramesSeparators();
                                });
                            } else {
                                this._updateFramesPositions();
                            }

                        });
                    }
                });
            });

            _windowResizeCallbacks.add(() => {
                this._windowResizeTimeout = setTimeout(() => {
                    this._updateFramesPositions();
                    this._updateFramesSeparators();
                });
            });
        }
    }

    _findTables() {
        return $(this.editorInstance._getQuillContainer()).find('table');
    }

    _createResizeFrames($tables) {
        $tables.each((index, $item) => {
            this._tableResizeFrames[index] = {
                $frame: this._createTableResizeFrame($item),
                $table: $($item),
                index: index
            };
        });
    }

    _isTableChanges(delta) {
        const $tables = this._findTables();
        return $tables.length !== this._tableResizeFrames.length;
    }

    _removeResizeFrames() {
        // console.log('_removeResizeFrames');
        each(this._tableResizeFrames, (index, $item) => {
            this._detachEvents($item.$frame.find(`.${DX_COLUMN_RESIZER_CLASS}, .${DX_ROW_RESIZER_CLASS}`));
            $item.$frame.remove();
        });
    }

    _detachEvents($lineSeparators) {
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
                positionCoordinate: 'left',
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
            return $table.find('tr').eq(0).find('td');
        }
    }

    _attachColumnSeparatorEvents(options) {
        eventsEngine.on(options.lineSeparator, POINTERDOWN_EVENT, () => {
            this._createDraggableElement(options);
        });
    }

    _dragStartHandler({ $determinantElements, index, frame, direction }) {
        const directionInfo = this._getDirectionInfo(direction);

        this._fixColumnsWidth(frame);
        this._startLineSize = parseInt($($determinantElements[index])[directionInfo.getSizeFunction]());
        this._nextLineSize = 0;
        if($determinantElements[index + 1]) {
            this._nextLineSize = parseInt($($determinantElements[index + 1])[directionInfo.getSizeFunction]());
        }
    }

    _dragMoveHandler(event, { $determinantElements, index, frame, direction }) {
        const directionInfo = this._getDirectionInfo(direction);
        const currentLineNewSize = this._startLineSize + event.offset[directionInfo.positionCoordinateName];

        if(direction === 'horizontal') {
            const nextColumnNewSize = this._nextLineSize && this._nextLineSize - event.offset[directionInfo.positionCoordinateName];
            const isCurrentColumnHasEnoughPlace = currentLineNewSize >= this._minColumnWidth;
            const isNextColumnHasEnoughPlace = !this._nextLineSize || nextColumnNewSize >= this._minColumnWidth;

            if(isCurrentColumnHasEnoughPlace && isNextColumnHasEnoughPlace) {
                $determinantElements.eq(index).attr(directionInfo.positionStyleProperty, currentLineNewSize + 'px');

                if(this._nextLineSize) {
                    $determinantElements.eq(index + 1).attr(directionInfo.positionStyleProperty, nextColumnNewSize + 'px');
                }
            }
        } else {
            const newHeight = Math.max(currentLineNewSize, this._minRowHeight);
            $determinantElements.eq(index).attr(directionInfo.positionStyleProperty, newHeight + 'px');
        }

        this._updateFramePosition(frame.$table, frame.$frame);
    }

    _canChangeTableSizes(options) {
        return options.direction === 'vertical' || this._isLastColumnResizing(options);
    }

    _isLastColumnResizing({ $determinantElements, index }) {
        return !isDefined($determinantElements[index + 1]);
    }

    _createDraggableElement(options) {
        this._currentDraggableElement = this.editorInstance._createComponent(options.lineSeparator, Draggable, {
            contentTemplate: null,
            boundary: this._canChangeTableSizes(options) ? this.editorInstance._getQuillContainer() : options.frame.$table,
            allowMoveByClick: false,
            dragDirection: options.direction,
            onDragMove: ({ component, event }) => {
                this._dragMoveHandler(event, options);
            },
            onDragStart: () => {
                this._dragStartHandler(options);
            },
            onDragEnd: () => {
                this._updateFramesPositions();
                this._updateFramesSeparators();
            }
        });
    }

    _fixColumnsWidth(frame) {
        const determinantElements = this._getTableDeterminantElements(frame.$table);

        each(determinantElements, (index, element) => {
            const columnWidth = $(element).outerWidth();
            $(element).attr('width', columnWidth >= DEFAULT_MIN_COLUMN_WIDTH ? columnWidth : DEFAULT_MIN_COLUMN_WIDTH);
        });

        frame.$table.css('width', 'auto');
    }

    clean() {
        this._removeResizeFrames();
        clearTimeout(this._attachResizerTimeout);
        clearTimeout(this._windowResizeTimeout);
    }
}
