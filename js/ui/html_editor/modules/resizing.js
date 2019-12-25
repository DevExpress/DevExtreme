import $ from '../../../core/renderer';
import eventsEngine from '../../../events/core/events_engine';
import { name as ClickEvent } from '../../../events/click';
import { addNamespace } from '../../../events/utils';
import { move } from '../../../animation/translator';
import devices from '../../../core/devices';
import Resizable from '../../resizable';

const DX_RESIZE_FRAME_CLASS = 'dx-resize-frame';
const DX_TOUCH_DEVICE_CLASS = 'dx-touch-device';
const MODULE_NAMESPACE = 'dxHtmlResizingModule';

const KEYDOWN_EVENT = addNamespace('keydown', MODULE_NAMESPACE);
const SCROLL_EVENT = addNamespace('scroll', MODULE_NAMESPACE);

const FRAME_PADDING = 1;

class ResizingModule {
    constructor(quill, options) {
        this.quill = quill;
        this.editorInstance = options.editorInstance;
        this.allowedTargets = options.allowedTargets || ['image'];
        this.enabled = !!options.enabled;

        if(this.enabled) {
            this._attachEvents();
            this._createResizeFrame();
        }
    }

    _attachEvents() {
        eventsEngine.on(this.quill.root, addNamespace(ClickEvent, MODULE_NAMESPACE), this._clickHandler.bind(this));
        eventsEngine.on(this.quill.root, SCROLL_EVENT, this._scrollHandler.bind(this));
    }

    _detachEvents() {
        eventsEngine.off(this.quill.root, MODULE_NAMESPACE);
    }

    _clickHandler(e) {
        if(this._isAllowedTarget(e.target)) {
            if(this._$target === e.target) {
                return;
            }

            this._$target = e.target;

            this.updateFramePosition();
            this.showFrame();
        } else if(this._$target) {
            this.hideFrame();
        }
    }

    _scrollHandler(e) {
        if(this._$target) {
            this.updateFramePosition();
        }
    }

    _isAllowedTarget(targetElement) {
        return this._isImage(targetElement);
    }

    _isImage(targetElement) {
        return this.allowedTargets.indexOf('image') !== -1 && targetElement.tagName.toUpperCase() === 'IMG';
    }

    showFrame() {
        this._$resizeFrame.show();
        eventsEngine.on(this.quill.root, KEYDOWN_EVENT, this.hideFrame.bind(this));
    }

    hideFrame() {
        this._$target = null;
        this._$resizeFrame.hide();
        eventsEngine.off(this.quill.root, KEYDOWN_EVENT);
    }

    updateFramePosition() {
        const { height, width, offsetTop, offsetLeft } = this._$target;
        const { scrollTop, scrollLeft } = this.quill.root;
        const borderWidth = this._getBorderWidth();

        this._$resizeFrame
            .css({
                height: height,
                width: width,
                padding: FRAME_PADDING,
                top: offsetTop - borderWidth - scrollTop - FRAME_PADDING,
                left: offsetLeft - borderWidth - scrollLeft - FRAME_PADDING
            });
        move(this._$resizeFrame, { left: 0, top: 0 });
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

        this.editorInstance._createComponent(this._$resizeFrame, Resizable, {
            onResize: (e) => {
                if(!this._$target) {
                    return;
                }

                const correction = 2 * (FRAME_PADDING + this._getBorderWidth());

                $(this._$target).attr({
                    height: e.height - correction,
                    width: e.width - correction
                });
                this.updateFramePosition();
            }
        });
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

export default ResizingModule;
