import $ from '../../../core/renderer';
import eventsEngine from '../../../events/core/events_engine';
import { name as ClickEvent } from '../../../events/click';
import { addNamespace, normalizeKeyName } from '../../../events/utils/index';
import { move } from '../../../animation/translator';
import devices from '../../../core/devices';
import Resizable from '../../resizable';
import { getBoundingRect } from '../../../core/utils/position';
import Quill from 'devextreme-quill';
import BaseModule from './base';
import Draggable from '../../draggable';

const DX_RESIZE_FRAME_CLASS = 'dx-resize-frame';
const DX_TOUCH_DEVICE_CLASS = 'dx-touch-device';
const DX_COLUMN_RESIZE_FRAME_CLASS = 'dx-column-resize-frame';
const MODULE_NAMESPACE = 'dxHtmlResizingModule';

const KEYDOWN_EVENT = addNamespace('keydown', MODULE_NAMESPACE);
const SCROLL_EVENT = addNamespace('scroll', MODULE_NAMESPACE);
const MOUSEDOWN_EVENT = addNamespace('mousedown', MODULE_NAMESPACE);

const FRAME_PADDING = 1;

export default class ResizingModule extends BaseModule {
    constructor(quill, options) {
        super(quill, options);
        this.allowedTargets = options.allowedTargets || ['image'];
        this.enabled = !!options.enabled;
        this._hideFrameWithContext = this.hideFrame.bind(this);
        this._framePositionChangedHandler = this._prepareFramePositionChangedHandler();

        if(this.enabled) {
            this._attachEvents();
            this._createResizeFrame();
            this._createColumnResizeFrame();
        }
    }

    _attachEvents() {
        eventsEngine.on(this.quill.root, addNamespace(ClickEvent, MODULE_NAMESPACE), this._clickHandler.bind(this));
        eventsEngine.on(this.quill.root, SCROLL_EVENT, this._framePositionChangedHandler);
        this.editorInstance.on('focusOut', this._hideFrameWithContext);
        this.quill.on('text-change', this._framePositionChangedHandler);
    }

    _detachEvents() {
        eventsEngine.off(this.quill.root, MODULE_NAMESPACE);
        this.editorInstance.off('focusOut', this._hideFrameWithContext);
        this.quill.off('text-change', this._framePositionChangedHandler);
    }

    _clickHandler(e) {
        if(this._isAllowedTarget(e.target)) {
            if(this._$target === e.target) {
                return;
            }

            const isTableElement = this._isTableElement(e.target);
            if(isTableElement) {
                this._$target = this._findTableRoot(e.target);
            } else {
                this._$target = e.target;
            }

            this.updateFramePosition(this._$resizeFrame);

            if(isTableElement) {
                this._updateColumnResizeFrame();
            }

            this.showFrame();

            this._$columnResizeFrame.show();
            this._adjustSelection();
        } else if(this._$target) {
            this.hideFrame();
            this._$columnResizeFrame.hide();
        }
    }

    _prepareFramePositionChangedHandler(e) {
        return () => {
            if(this._$target) {
                this.updateFramePosition(this._$resizeFrame);
            }
        };
    }

    _adjustSelection() {
        if(!this.quill.getSelection()) {
            this.quill.setSelection(0, 0);
        }
    }

    _isAllowedTarget(targetElement) {
        return this._isImage(targetElement) || this._isTableElement(targetElement);
    }

    _isImage(targetElement) {
        return this.allowedTargets.indexOf('image') !== -1 && targetElement.tagName.toUpperCase() === 'IMG';
    }

    _isTableElement(targetElement) {
        let result = false;
        ['TABLE', 'TBODY', 'THEAD', 'TFOOT', 'TD', 'TR', 'TH'].forEach((tagName) => {
            if(targetElement.tagName.toUpperCase() === tagName) {
                result = true;
                return false;
            }
        });

        return result;
    }

    _findTableRoot(targetElement) {
        return $(targetElement).parents('table').get(0);
    }

    showFrame() {
        this._$resizeFrame.show();
        eventsEngine.on(this.quill.root, KEYDOWN_EVENT, this._handleFrameKeyDown.bind(this));
    }

    _handleFrameKeyDown(e) {
        const keyName = normalizeKeyName(e);
        if(keyName === 'del' || keyName === 'backspace') {
            this._deleteImage();
        }
        this.hideFrame();
    }

    hideFrame() {
        this._$target = null;
        this._$resizeFrame.hide();
        eventsEngine.off(this.quill.root, KEYDOWN_EVENT);
    }

    updateFramePosition($frame) {
        const { height, width, top: targetTop, left: targetLeft } = getBoundingRect(this._$target);
        const { top: containerTop, left: containerLeft } = getBoundingRect(this.quill.root);
        const borderWidth = this._getBorderWidth();

        $frame
            .css({
                height: height,
                width: width,
                padding: FRAME_PADDING,
                top: targetTop - containerTop - borderWidth - FRAME_PADDING,
                left: targetLeft - containerLeft - borderWidth - FRAME_PADDING
            });
        move($frame, { left: 0, top: 0 });
    }

    _getBorderWidth() {
        return parseInt(this._$resizeFrame.css('borderTopWidth'));
    }

    _createResizeFrame() {
        if(this._$resizeFrame) {
            return;
        }

        const { deviceType } = devices.current();

        this._$resizeFrame = $('<div>')
            .addClass(DX_RESIZE_FRAME_CLASS)
            .toggleClass(DX_TOUCH_DEVICE_CLASS, deviceType !== 'desktop')
            .appendTo(this.editorInstance._getQuillContainer())
            .hide();


        eventsEngine.on(this._$resizeFrame, MOUSEDOWN_EVENT, (e) => {
            e.preventDefault();
        });

        this.editorInstance._createComponent(this._$resizeFrame, Resizable, {
            onResize: (e) => {
                if(!this._$target) {
                    return;
                }

                const correction = 2 * (FRAME_PADDING + this._getBorderWidth());

                $(this._$target).css({
                    height: e.height - correction,
                    width: e.width - correction
                });
                this.updateFramePosition(this._$resizeFrame);
            }
        });
    }

    _createColumnResizeFrame(target) {
        this._$columnResizeFrame = $('<div>')
            .addClass(DX_COLUMN_RESIZE_FRAME_CLASS)
            .appendTo(this.editorInstance._getQuillContainer())
            .hide();

    }

    _updateColumnResizeFrame() {
        const $columns = $(this._$target).find('tr').eq(0).find('td');
        const columnsCount = $columns.length;
        const columnsResizingElementsCount = columnsCount - 2;
        // const controlledElements = this._getControlledElements(); // th or td
        const $columnSeparators = [];

        this.updateFramePosition(this._$columnResizeFrame);

        let leftPosition = 0;
        for(let i = 0; i <= columnsResizingElementsCount; i++) { //  headers
            leftPosition += $columns.eq(0).outerWidth();
            $columnSeparators[i] = $('<div>')
                .addClass('dx-table-column-resizer')
                .css('left', leftPosition)
                .appendTo(this._$columnResizeFrame);
        }

        // for(let i = 0; i <= columnsResizingElementsCount; i++) { //  headers
        //     $columnSeparators[i] = $('<div>')
        //         .addClass('dx-table-column-resizer')
        //         .appendTo(this._$columnResizeFrame);
        // }

        // eventsEngine.on(this.quill.root, SCROLL_EVENT, this._framePositionChangedHandler);
        if(this._columnResizer) {
            this._columnResizer.dispose();
        }

        this._createDraggableElement($columnSeparators[0], $columns, 0);

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

                $columns.eq(0).css('width', /* $columns.eq(0).outerWidth() + */newPosition);
                $columnSeparator.css('left', newPosition /* + $columnSeparators[0].css('left').replace('px', '')*/);
                // this._updateByDrag = true;
                // const $alphaChannelHandle = this._$alphaChannelHandle;
                // const alphaChannelHandlePosition = locate($alphaChannelHandle).left + this._alphaChannelHandleWidth / 2;
                // this._saveValueChangeEvent(event);
                // this._calculateColorTransparencyByScaleWidth(alphaChannelHandlePosition);
            },
            onDragStart: ({ event }) => {
                this._startDragPosition = parseInt($columnSeparator.css('left').replace('px', ''));
                // console.log('start ' + this._startDragPosition);
            }
        });
    }

    _deleteImage() {
        if(this._isAllowedTarget(this._$target)) {
            Quill.find(this._$target).deleteAt(0);
        }
    }

    option(option, value) {
        if(option === 'mediaResizing') {
            Object.keys(value).forEach((optionName) => this.option(optionName, value[optionName]));
            return;
        }

        if(option === 'enabled') {
            this.enabled = value;
            value ? this._attachEvents() : this._detachEvents();
        } else if(option === 'allowedTargets' && Array.isArray(value)) {
            this.allowedTargets = value;
        }
    }

    clean() {
        this._detachEvents();
        this._$resizeFrame.remove();
        this._$resizeFrame = undefined;
    }
}
