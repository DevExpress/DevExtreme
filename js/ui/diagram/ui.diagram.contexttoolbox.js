import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import Popover from "../popover";

const DIAGRAM_CONTEXT_TOOLBOX_TARGET_CLASS = "dx-diagram-context-toolbox-target";
const DIAGRAM_CONTEXT_TOOLBOX_CLASS = "dx-diagram-context-toolbox";
const DIAGRAM_CONTEXT_TOOLBOX_CONTENT_CLASS = "dx-diagram-context-toolbox-content";

class DiagramContextToolbox extends Widget {
    _init() {
        super._init();

        this._onShownAction = this._createActionByOption("onShown");
        this._popoverPositionData = [
            {
                my: { x: "center", y: "top" },
                at: { x: "center", y: "bottom" },
                offset: { x: 0, y: 5 }
            },
            {
                my: { x: "right", y: "center" },
                at: { x: "left", y: "center" },
                offset: { x: -5, y: 0 }
            },
            {
                my: { x: "center", y: "bottom" },
                at: { x: "center", y: "top" },
                offset: { x: 0, y: -5 }
            },
            {
                my: { x: "left", y: "center" },
                at: { x: "right", y: "center" },
                offset: { x: 5, y: 0 }
            }
        ];
    }
    _initMarkup() {
        super._initMarkup();

        this._$popoverTargetElement = $("<div>")
            .addClass(DIAGRAM_CONTEXT_TOOLBOX_TARGET_CLASS)
            .appendTo(this.$element());

        const $popoverElement = $("<div>")
            .appendTo(this.$element());

        this._popoverInstance = this._createComponent($popoverElement, Popover, {
            closeOnOutsideClick: false,
            container: this.$element(),
            elementAttr: { class: DIAGRAM_CONTEXT_TOOLBOX_CLASS }
        });
    }
    _show(x, y, side, category, callback) {
        this._popoverInstance.hide();

        var $content = $("<div>")
            .addClass(DIAGRAM_CONTEXT_TOOLBOX_CONTENT_CLASS);
        this._$popoverTargetElement
            .css({
                left: x + this._popoverPositionData[side].offset.x,
                top: y + this._popoverPositionData[side].offset.y
            })
            .show();
        this._popoverInstance.option({
            position: {
                my: this._popoverPositionData[side].my,
                at: this._popoverPositionData[side].at,
                of: this._$popoverTargetElement
            },
            contentTemplate: $content,
            onContentReady: function() {
                var $element = this.$element().find("." + DIAGRAM_CONTEXT_TOOLBOX_CONTENT_CLASS);
                this._onShownAction({ category, callback, $element });
            }.bind(this)
        });
        this._popoverInstance.show();
    }
    _hide() {
        this._$popoverTargetElement.hide();
        this._popoverInstance.hide();
    }
}

module.exports = DiagramContextToolbox;
