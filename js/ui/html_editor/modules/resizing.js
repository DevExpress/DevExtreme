import $ from "../../../core/renderer";
import eventsEngine from "../../../events/core/events_engine";
import { name as ClickEvent } from "../../../events/click";
import { addNamespace } from "../../../events/utils";
import { move } from "../../../animation/translator";

import Resizable from "../../resizable";

const DX_RESIZE_FRAME = "dx-resize-frame";
const NAMESPACE = "dxHtmlResizingModule";
const KEYDOWN_EVENT = addNamespace("keydown", NAMESPACE);
const SCROLL_EVENT = addNamespace("scroll", NAMESPACE);

class ResizingModule {
    constructor(quill, options) {
        this.quill = quill;
        this.editorInstance = options.editorInstance;

        eventsEngine.on(this.quill.root, addNamespace(ClickEvent, NAMESPACE), this._clickHandler.bind(this));
        eventsEngine.on(this.quill.root, SCROLL_EVENT, this._scrollHandler.bind(this));

        this._createResizeFrame();
    }

    _clickHandler(e) {
        if(e.target.tagName.toUpperCase() === 'IMG') {
            if(this._$target === e.target) {
                return;
            }

            this._$target = e.target;

            this.updateFramePosition();
            this.showFrame();
        } else {
            this.hideFrame();
        }
    }

    _scrollHandler(e) {
        if(this._$target) {
            this.updateFramePosition();
        }
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

        this._$resizeFrame
            .css({
                height: height,
                width: width,
                top: offsetTop - parseInt(this._$resizeFrame.css("borderTopWidth")) - scrollTop,
                left: offsetLeft - parseInt(this._$resizeFrame.css("borderLeftWidth")) - scrollLeft
            });
        move(this._$resizeFrame, { left: 0, top: 0 });
    }

    _createResizeFrame() {
        this._$resizeFrame = $("<div>")
            .addClass(DX_RESIZE_FRAME)
            .appendTo(this.editorInstance._getQuillContainer())
            .hide();

        this.editorInstance._createComponent(this._$resizeFrame, Resizable, {
            onResize: (e) => {
                if(!this._$target) {
                    return;
                }

                $(this._$target).attr({ height: e.height, width: e.width });
                this.updateFramePosition();
            }
        });
    }

    clean() {
        eventsEngine.off(this.quill.root, NAMESPACE);
    }
}

export default ResizingModule;
