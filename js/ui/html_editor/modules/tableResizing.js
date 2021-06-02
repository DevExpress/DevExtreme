import $ from '../../../core/renderer';
import eventsEngine from '../../../events/core/events_engine';
import { isDefined } from '../../../core/utils/type';
// import { addNamespace } from '../../../events/utils/index';
import { move } from '../../../animation/translator';
import { getBoundingRect } from '../../../core/utils/position';
import BaseModule from './base';
import Draggable from '../../draggable';

const DX_COLUMN_RESIZE_FRAME_CLASS = 'dx-table-resize-frame';
const DX_COLUMN_RESIZER_CLASS = 'dx-htmleditor-column-resizer';

const DRAGGABLE_ELEMENT_OFFSET = 2;

// const MODULE_NAMESPACE = 'dxHtmlTableResizingModule';

// const KEYDOWN_EVENT = addNamespace('keydown', MODULE_NAMESPACE);
// const SCROLL_EVENT = addNamespace('scroll', MODULE_NAMESPACE);
// const MOUSEDOWN_EVENT = addNamespace('mousedown', MODULE_NAMESPACE);

export default class TableResizingModule extends BaseModule {
    constructor(quill, options) {
        super(quill, options);
        this.enabled = !!options.enabled;

        if(this.enabled) {
            this.editorInstance.on('contentReady', () => {
                this._attachResizerTimeout = setTimeout(() => {
                    if(this._findTables().length) {
                        this._createTableResizeFrame();
                        this._updateFramePosition(this._$columnResizeFrame);
                        this._updateColumnResizeFrame();

                        quill.on('text-change', () => {
                            this._updateFramePosition(this._$columnResizeFrame);
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

    _updateFramePosition($frame) {
        this._$target = $(this.editorInstance._getQuillContainer()).find('table').get(0);
        const { height, width, top: targetTop, left: targetLeft } = getBoundingRect(this._$target);
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

    _createTableResizeFrame(targetTable) {
        // console.log('_createTableResizeFrame');
        this._$columnResizeFrame = $('<div>')
            .addClass(DX_COLUMN_RESIZE_FRAME_CLASS)
            .appendTo(this.editorInstance._getQuillContainer());

    }

    _updateColumnResizeFrame() {
        const $columns = $(this._$target).find('tr').eq(0).find('td');
        const columnsCount = $columns.length;
        const columnsResizingElementsCount = columnsCount - 1;
        // const controlledElements = this._getControlledElements(); // th or td
        this._$columnSeparators = this._$columnSeparators || [];

        // this._updateFramePosition(this._$columnResizeFrame);

        let leftPosition = 0;
        for(let i = 0; i <= columnsResizingElementsCount; i++) { //  headers
            leftPosition += $columns.eq(i).outerWidth();

            if(!isDefined(this._$columnSeparators[i])) {
                this._$columnSeparators[i] = $('<div>')
                    .addClass(DX_COLUMN_RESIZER_CLASS)
                    .appendTo(this._$columnResizeFrame);
            }

            this._$columnSeparators[i].css({
                left: leftPosition - DRAGGABLE_ELEMENT_OFFSET,
                transform: 'none'
            });

            this._attachColumnSeparatorEvents(this._$columnSeparators[i], $columns, i);
        }

        // for(let i = 0; i <= columnsResizingElementsCount; i++) { //  headers
        //     $columnSeparators[i] = $('<div>')
        //         .addClass('dx-table-column-resizer')
        //         .appendTo(this._$columnResizeFrame);
        // }

        // eventsEngine.on(this.quill.root, SCROLL_EVENT, this._framePositionChangedHandler);


    }

    _attachColumnSeparatorEvents($columnSeparator, $columns, index) {

        eventsEngine.on($columnSeparator, 'dxpointerdown', () => {
            if(this._columnResizer) {
                const isTheSameSeparator = this._columnResizer._$element.get(0) === $columnSeparator.get(0);
                if(!isTheSameSeparator) {
                    this._columnResizer.dispose();
                } else {
                    return;
                }
            }

            this._createDraggableElement($columnSeparator, $columns, index);
        });
    }

    _createDraggableElement($columnSeparator, $columns, index) {
        this._columnResizer = this.editorInstance._createComponent($columnSeparator.get(0), Draggable, {
            contentTemplate: null,
            boundary: this._$columnResizeFrame,
            allowMoveByClick: false,
            dragDirection: 'horizontal',
            onDragMove: ({ event }) => {
                // debugger;
                const newPosition = this._startDragPosition + event.offset.x;
                // console.log('move ' + newPosition);

                $columns.eq(index).css('width', this._startColumnWidth + event.offset.x);
                $columnSeparator.css('left', newPosition /* + $columnSeparators[0].css('left').replace('px', '')*/);

                if(this._nextColumnWidth) {
                    $columns.eq(index + 1).css('width', this._nextColumnWidth - event.offset.x);
                }
                // this._updateByDrag = true;
                // const $alphaChannelHandle = this._$alphaChannelHandle;
                // const alphaChannelHandlePosition = locate($alphaChannelHandle).left + this._alphaChannelHandleWidth / 2;
                // this._saveValueChangeEvent(event);
                // this._calculateColorTransparencyByScaleWidth(alphaChannelHandlePosition);
            },
            onDragStart: () => {
                this._startDragPosition = parseInt($columnSeparator.css('left').replace('px', ''));
                this._startColumnWidth = parseInt($($columns[index]).outerWidth());
                this._nextColumnWidth = 0;
                this._previousColumnWidth = 0;
                if($columns[index + 1]) {
                    this._nextColumnWidth = parseInt($($columns[index + 1]).outerWidth());
                }

                // if($columns[index - 1]) {
                //     this._previousColumnWidth = parseInt($($columns[index - 1]).outerWidth());
                // }

                // console.log('start ' + this._startDragPosition);
            },
            onDragEnd: () => {
                this._updateColumnResizeFrame(); // set positions only
            }
        });
    }

    // option(option, value) {
    //     if(option === 'tableResizing') {
    //         Object.keys(value).forEach((optionName) => this.option(optionName, value[optionName]));
    //         return;
    //     }

    //     if(option === 'enabled') {
    //         this.enabled = value;
    //         value ? this._attachEvents() : this._detachEvents();
    //     }
    // }

    clean() {
        // this._detachEvents();
        clearTimeout(this._attachResizerTimeout);
        // this._$resizeFrame.remove();
        // this._$resizeFrame = undefined;
    }
}
