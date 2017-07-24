"use strict";

var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    noop = require("../core/utils/common").noop,
    registerComponent = require("../core/component_registrator"),
    extend = require("../core/utils/extend").extend,
    eventUtils = require("../events/utils"),
    pointerEvents = require("../events/pointer"),
    TextBox = require("./text_box");

var TEXTAREA_CLASS = "dx-textarea",
    TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input";

/**
* @name dxTextArea
* @isEditor
* @publicName dxTextArea
* @inherits dxTextBox
* @groupName Editors
* @module ui/text_area
* @export default
*/
var TextArea = TextBox.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTextAreaOptions_mode
            * @publicName mode
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTextAreaOptions_showClearButton
            * @publicName showClearButton
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTextAreaOptions_spellcheck
            * @publicName spellcheck
            * @type boolean
            * @default true
            */
            spellcheck: true,

            /**
            * @name dxTextAreaOptions_minHeight
            * @publicName minHeight
            * @type numeric|string
            * @default undefined
            */
            minHeight: undefined,

            /**
            * @name dxTextAreaOptions_maxHeight
            * @publicName maxHeight
            * @type numeric|string
            * @default undefined
            */
            maxHeight: undefined,

            /**
            * @name dxTextAreaOptions_autoResizeEnabled
            * @publicName autoResizeEnabled
            * @type boolean
            * @default false
            */
            autoResizeEnabled: false

            /**
            * @name dxTextAreaOptions_mask
            * @publicName mask
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTextAreaOptions_maskChar
            * @publicName maskChar
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTextAreaOptions_maskRules
            * @publicName maskRules
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTextAreaOptions_maskInvalidMessage
            * @publicName maskInvalidMessage
            * @hidden
            * @extend_doc
            */

            /**
            * @name dxTextAreaOptions_useMaskedValue
            * @publicName useMaskedValue
            * @hidden
            * @extend_doc
            */
        });
    },

    _render: function() {
        this.callBase();
        this.element().addClass(TEXTAREA_CLASS);
        this.setAria("multiline", "true");
        this._updateInputHeight();
    },

    _renderInput: function() {
        this.callBase();
        this._renderScrollHandler();
    },

    _createInput: function() {
        var $input = $("<textarea>");
        this._applyInputAttributes($input, this.option("inputAttr"));
        return $input;
    },

    _applyInputAttributes: function($input, customAttributes) {
        $input.attr(customAttributes)
            .addClass(TEXTEDITOR_INPUT_CLASS);
    },

    _renderScrollHandler: function() {
        var $input = this._input(),
            eventY = 0;

        eventsEngine.on($input, eventUtils.addNamespace(pointerEvents.down, this.NAME), function(e) {
            eventY = eventUtils.eventData(e).y;
        });

        eventsEngine.on($input, eventUtils.addNamespace(pointerEvents.move, this.NAME), function(e) {
            var scrollTopPos = $input.scrollTop(),
                scrollBottomPos = $input.prop("scrollHeight") - $input.prop("clientHeight") - scrollTopPos;

            if(scrollTopPos === 0 && scrollBottomPos === 0) {
                return;
            }

            var currentEventY = eventUtils.eventData(e).y;

            var isScrollFromTop = scrollTopPos === 0 && eventY >= currentEventY,
                isScrollFromBottom = scrollBottomPos === 0 && eventY <= currentEventY,
                isScrollFromMiddle = scrollTopPos > 0 && scrollBottomPos > 0;

            if(isScrollFromTop || isScrollFromBottom || isScrollFromMiddle) {
                e.isScrollingEvent = true;
                e.stopPropagation();
            }

            eventY = currentEventY;
        });
    },

    _renderDimensions: function() {
        var width = this.option("width"),
            height = this.option("height"),
            minHeight = this.option("minHeight"),
            maxHeight = this.option("maxHeight"),
            $element = this.element();

        $element.css({
            "min-height": minHeight !== undefined ? minHeight : "",
            "max-height": maxHeight !== undefined ? maxHeight : ""
        });

        $element.outerWidth(width);
        $element.outerHeight(height);
    },

    _resetDimensions: function() {
        this.element().css({
            "height": "",
            "min-height": "",
            "max-height": ""
        });
    },

    _renderEvents: function() {
        if(this.option("autoResizeEnabled")) {
            eventsEngine.on(this._input(), eventUtils.addNamespace("input paste", this.NAME), this._updateInputHeight.bind(this));
        }

        this.callBase();
    },

    _refreshEvents: function() {
        eventsEngine.off(this._input(), eventUtils.addNamespace("input paste", this.NAME));
        this.callBase();
    },

    _updateInputHeight: function() {
        var $input = this._input();

        if(!this.option("autoResizeEnabled") || this.option("height") !== undefined) {
            $input.css("height", "");
            return;
        }

        this._resetDimensions();
        $input.css("height", 0);
        var heightDifference = this._$element.outerHeight() - $input.outerHeight();
        this._renderDimensions();

        var minHeight = this.option("minHeight"),
            maxHeight = this.option("maxHeight"),
            inputHeight = $input[0].scrollHeight;

        if(minHeight !== undefined) {
            inputHeight = Math.max(inputHeight, minHeight - heightDifference);
        }

        if(maxHeight !== undefined) {
            inputHeight = Math.min(inputHeight, maxHeight - heightDifference);
        }

        $input.css("height", inputHeight);
    },

    _renderInputType: noop,

    _visibilityChanged: function(visible) {
        if(visible) {
            this._updateInputHeight();
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "autoResizeEnabled":
                this._refreshEvents();
                this._updateInputHeight();
                break;
            case "value":
            case "height":
                this.callBase(args);
                this._updateInputHeight();
                break;
            case "minHeight":
            case "maxHeight":
                this._renderDimensions();
                this._updateInputHeight();
                break;
            case "visible":
                this.callBase(args);
                args.value && this._updateInputHeight();
                break;
            default:
                this.callBase(args);
        }
    }

});

registerComponent("dxTextArea", TextArea);

module.exports = TextArea;
