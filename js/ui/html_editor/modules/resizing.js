import $ from "../../../core/renderer";
import eventsEngine from "../../../events/core/events_engine";
import { extend } from "../../../core/utils/extend";
import { move } from "../../../animation/translator";

import Resizable from "../../resizable";

const DX_RESIZE_FRAME = "dx-resize-frame";

class ResizingModule {

    _getDefaultOptions() {
        return { };
    }

    constructor(quill, options) {
        this.quill = quill;
        this.editorInstance = options.editorInstance;

        this.options = extend({}, this._getDefaultOptions(), options);
        eventsEngine.on(this.quill.root, "dxclick", this._clickHandler.bind(this));
        eventsEngine.on(this.quill.root, "scroll", this._scrollHandler.bind(this));
        this._createResizeFrame();
    }

    _clickHandler(e) {
        if(e.target.tagName.toUpperCase() === 'IMG') {
            if(this._target === e.target) {
                return;
            }

            this._target = e.target;

            this.updateFramePosition();
            this.showFrame();
        } else {
            this.hideFrame();
        }
    }

    _scrollHandler(e) {
        if(this._target) {
            this.updateFramePosition();
        }
    }

    showFrame() {
        this._resizeFrame.show();
        eventsEngine.on(this.quill.root, "keydown", this.hideFrame.bind(this));
    }

    hideFrame() {
        this._target = null;
        this._resizeFrame.hide();
        eventsEngine.off(this.quill.root, "keydown", this.hideFrame.bind(this));
    }

    updateFramePosition() {
        const { height, width, offsetTop, offsetLeft } = this._target;
        const { scrollTop, scrollLeft } = this.quill.root;

        this._resizeFrame
            .css({
                height: height,
                width: width,
                top: offsetTop - parseInt(this._resizeFrame.css("borderTopWidth")) - scrollTop,
                left: offsetLeft - parseInt(this._resizeFrame.css("borderLeftWidth")) - scrollLeft
            });
        move(this._resizeFrame, { left: 0, top: 0 });
    }

    _createResizeFrame() {
        this._resizeFrame = $("<div>")
            .addClass(DX_RESIZE_FRAME)
            .appendTo(this.editorInstance._getQuillContainer())
            .hide();

        this.editorInstance._createComponent(this._resizeFrame, Resizable, {
            onResize: (e) => {
                if(!this._target) {
                    return;
                }

                $(this._target).attr({ height: e.height, width: e.width });
                this.updateFramePosition();
            }
        });
    }
}

export default ResizingModule;
