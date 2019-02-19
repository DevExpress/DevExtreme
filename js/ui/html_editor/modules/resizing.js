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

        this.options = extend({}, this._getDefaultOptions(), options);
        eventsEngine.on(this.quill.root, "dxclick", this.clickHandler.bind(this));
        this._createResizeFrame();
    }

    clickHandler(e) {
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
        let imageRect = this._target.getBoundingClientRect();

        this._resizeFrame
            .css({
                height: imageRect.height,
                width: imageRect.width,
                top: imageRect.top - parseInt(this._resizeFrame.css("borderTopWidth")),
                left: imageRect.left - parseInt(this._resizeFrame.css("borderLeftWidth"))
            });
        move(this._resizeFrame, { left: 0, top: 0 });
    }

    _createResizeFrame() {
        let editorInstance = this.options.editorInstance,
            $container = editorInstance.element();

        this._resizeFrame = $("<div>")
            .addClass(DX_RESIZE_FRAME)
            .appendTo($container)
            .hide();

        editorInstance._createComponent(this._resizeFrame, Resizable, {
            onResize: function(e) {
                if(!this._target) {
                    return;
                }

                $(this._target).attr({ height: e.height, width: e.width });
                this.updateFramePosition();
            }.bind(this)
        });
    }
}

export default ResizingModule;
