import $ from '../../../core/renderer';
import eventsEngine from '../../../events/core/events_engine';
import { isDefined } from '../../../core/utils/type';
// import { addNamespace } from '../../../events/utils/index';
import { move } from '../../../animation/translator';
import { getBoundingRect } from '../../../core/utils/position';
import BaseModule from './base';
import Draggable from '../../draggable';
import { each } from '../../../core/utils/iterator';

const DX_COLUMN_RESIZE_FRAME_CLASS = 'dx-table-resize-frame';
const DX_COLUMN_RESIZER_CLASS = 'dx-htmleditor-column-resizer';
const DX_ROW_RESIZER_CLASS = 'dx-htmleditor-row-resizer';

const DRAGGABLE_ELEMENT_OFFSET = 2;

// const MODULE_NAMESPACE = 'dxHtmlTableResizingModule';

// const KEYDOWN_EVENT = addNamespace('keydown', MODULE_NAMESPACE);
// const SCROLL_EVENT = addNamespace('scroll', MODULE_NAMESPACE);
// const MOUSEDOWN_EVENT = addNamespace('mousedown', MODULE_NAMESPACE);

export default class TableResizingModule extends BaseModule {
    constructor(quill, options) {
        super(quill, options);
        this.enabled = !!options.enabled;
        this._tableResizeFrames = [];

        if(this.enabled) {
            this.editorInstance.on('contentReady', () => {
                this._attachResizerTimeout = setTimeout(() => {

                    const $tables = this._findTables();
                    // _createResizeFrames
                    if($tables.length) {
                        // this._createTableResizeFrame();
                        this._createResizeFrames($tables);


                        this._updateFramesPositions();
                        this._updateFramesSeparators();

                        quill.on('text-change', () => {
                            this._updateFramesPositions(this._$columnResizeFrame);
                        });
                    }
                });
            });
        }
    }

    // _isAllowedTarget(targetElement) {
    //     return this._isTableElement(targetElement);
    // }

    // _isTableElement(targetElement) {
    //     let result = false;
    //     ['TABLE', 'TBODY', 'THEAD', 'TFOOT', 'TD', 'TR', 'TH'].forEach((tagName) => {
    //         if(targetElement.tagName.toUpperCase() === tagName) {
    //             result = true;
    //             return false;
    //         }
    //     });

    //     return result;
    // }

    // _findTableRoot(targetElement) {
    //     return $(targetElement).parents('table').get(0);
    // }
    _findTables() {
        return $(this.editorInstance._getQuillContainer()).find('table');
    }

    _updateFramesPositions() {
        each(this._tableResizeFrames, (index, tableResizeFrame) => {
            this._updateFramePosition(tableResizeFrame.$table, tableResizeFrame.$frame);
        });

    }

    _updateFramePosition($table, $frame) {
        // const $currentTable = $table || $(this.editorInstance._getQuillContainer()).find('table').get(0);
        const { height, width, top: targetTop, left: targetLeft } = getBoundingRect($table.get(0));
        const { top: containerTop, left: containerLeft } = getBoundingRect(this.quill.root);
        // const borderWidth = this._getBorderWidth();

        $frame
            .css({
                height: height,
                width: width,
                top: targetTop - containerTop,
                left: targetLeft - containerLeft
            });
        move($frame, { left: 0, top: 0 });
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

    _createTableResizeFrame() {
        // console.log('_createTableResizeFrame');
        return $('<div>')
            .addClass(DX_COLUMN_RESIZE_FRAME_CLASS)
            .appendTo(this.editorInstance._getQuillContainer());

    }

    _updateFramesSeparators() {
        each(this._tableResizeFrames, (index, frame) => {
            this._updateFrameSeparators(frame, 'horizontal');
            this._updateFrameSeparators(frame, 'vertical');
        });
    }

    _updateFrameSeparators(frame, direction) {
        const $determinantElements = this._getTableDeterminantElements(frame.$table, direction);
        const determinantElementsCount = $determinantElements.length;
        const determinantElementsSeparatorsCount = determinantElementsCount - 1;
        const lineResizerClass = direction === 'vertical' ? DX_ROW_RESIZER_CLASS : DX_COLUMN_RESIZER_CLASS;
        const getSizeFunction = direction === 'vertical' ? 'outerHeight' : 'outerWidth';
        const positionCoordinate = direction === 'vertical' ? 'top' : 'left';
        // const controlledElements = this._getControlledElements(); // th or td
        const $lineSeparators = frame.$frame.find(`.${lineResizerClass}`);
        const styleOptions = {
            transform: 'none'
        };

        // this._updateFramePosition(this._$columnResizeFrame);

        let currentPosition = 0;
        for(let i = 0; i <= determinantElementsSeparatorsCount; i++) { //  headers
            currentPosition += $determinantElements.eq(i)[getSizeFunction]();
            // $lineSeparators[i] = $lineSeparators[i]

            if(!isDefined($lineSeparators[i])) {
                $lineSeparators[i] = $('<div>')
                    .addClass(lineResizerClass)
                    .appendTo(frame.$frame)
                    .get(0);
            }


            styleOptions[positionCoordinate] = currentPosition - DRAGGABLE_ELEMENT_OFFSET;

            $($lineSeparators[i]).css(styleOptions);
            // console.log(direction);
            // console.log(styleOptions);

            this._attachColumnSeparatorEvents($lineSeparators[i], $determinantElements, i, frame, direction);
        }

        // for(let i = 0; i <= columnsResizingElementsCount; i++) { //  headers
        //     $lineSeparators[i] = $('<div>')
        //         .addClass('dx-table-column-resizer')
        //         .appendTo(this._$columnResizeFrame);
        // }

        // eventsEngine.on(this.quill.root, SCROLL_EVENT, this._framePositionChangedHandler);
    }

    _getTableDeterminantElements($table, direction) {
        if(direction === 'vertical') {
            return $table.find('td:first-child');
        } else {
            return $table.find('tr').eq(0).find('td');
        }
    }

    _attachColumnSeparatorEvents(lineSeparator, $determinantElements, index, frame, direction) {

        eventsEngine.on(lineSeparator, 'dxpointerdown', () => {
            // if(this._currentDraggableElement) {
            // const isTheSameSeparator = this._currentDraggableElement._$element.get(0) === $($columnSeparator).get(0);
            // if(!isTheSameSeparator) {
            // const element = this._currentDraggableElement._$element;
            // const leftStyle = $(element).css('left');
            // this._currentDraggableElement.dispose();
            // $(element).css('left', leftStyle).addClass(DX_COLUMN_RESIZER_CLASS);
            // } else {
            //     return;
            // }
            // }

            this._createDraggableElement(lineSeparator, $determinantElements, index, frame, direction);
        });
    }

    _createDraggableElement(lineSeparator, $determinantElements, index, frame, direction) {
        let nextLineSize;
        let startDragPosition;
        let startLineSize;

        // console.log(direction);

        if(direction === 'horizontal' && !$determinantElements[index + 1]) {
            this._fixColumnsWidth(frame.$table);
            frame.$table.css('width', 'auto');
        }

        const getSizeFunction = direction === 'vertical' ? 'outerHeight' : 'outerWidth';
        const positionStyleProperty = direction === 'vertical' ? 'height' : 'width';
        const positionCoordinate = direction === 'vertical' ? 'top' : 'left';
        const positionCoordinateName = direction === 'vertical' ? 'y' : 'x';
        const currentDirection = direction;

        this._currentDraggableElement = this.editorInstance._createComponent(lineSeparator, Draggable, {
            contentTemplate: null,
            // boundary: frame.$frame,
            allowMoveByClick: false,
            dragDirection: direction,
            onDragMove: ({ event }) => {
                // debugger;
                const newPosition = startDragPosition + event.offset[positionCoordinateName];
                // console.log('move ' + newPosition);
                // console.log(newPosition);


                $determinantElements.eq(index).css(positionStyleProperty, startLineSize + event.offset[positionCoordinateName]);
                $(lineSeparator).css(positionCoordinate, newPosition /* + $lineSeparators[0].css('left').replace('px', '')*/);

                if(currentDirection === 'horizontal' && nextLineSize) {
                    // console.log('currentDirection === horizontal');
                    $determinantElements.eq(index + 1).css(positionStyleProperty, nextLineSize - event.offset[positionCoordinateName]);
                }

                // console.log(event.offset[positionCoordinateName]);
                // this._updateByDrag = true;
                // const $alphaChannelHandle = this._$alphaChannelHandle;
                // const alphaChannelHandlePosition = locate($alphaChannelHandle).left + this._alphaChannelHandleWidth / 2;
                // this._saveValueChangeEvent(event);
                // this._calculateColorTransparencyByScaleWidth(alphaChannelHandlePosition);
            },
            onDragStart: () => {
                startDragPosition = parseInt($(lineSeparator).css(positionCoordinate).replace('px', ''));
                startLineSize = parseInt($($determinantElements[index])[getSizeFunction]());
                nextLineSize = 0;
                if($determinantElements[index + 1]) {
                    nextLineSize = parseInt($($determinantElements[index + 1])[getSizeFunction]());
                }

                // if($columns[index - 1]) {
                //     this._previousColumnWidth = parseInt($($columns[index - 1]).outerWidth());
                // }

                // console.log('start ' + this._startDragPosition);
            },
            onDragEnd: () => {
                // this._updateFrameSeparators(frame, 'horizontal'); // set positions only
                // this._updateFrameSeparators(frame, 'vertical');

                this._updateFramesPositions();
                this._updateFramesSeparators();
            }
        });
    }

    _fixColumnsWidth($table) {
        const determinantElements = this._getTableDeterminantElements($table);

        each(determinantElements, (index, element) => {
            $(element).width($(element).width());
        });
    }

    clean() {
        // this._detachEvents();
        clearTimeout(this._attachResizerTimeout);
        // this._$resizeFrame.remove();
        // this._$resizeFrame = undefined;
    }
}
