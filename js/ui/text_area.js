var $ = require("../core/renderer"),
    eventsEngine = require("../events/core/events_engine"),
    noop = require("../core/utils/common").noop,
    registerComponent = require("../core/component_registrator"),
    extend = require("../core/utils/extend").extend,
    eventUtils = require("../events/utils"),
    pointerEvents = require("../events/pointer"),
    TextBox = require("./text_box");

var TEXTAREA_CLASS = "dx-textarea",
    TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input",
    TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE = "dx-texteditor-input-auto-resize";

/**
* @name dxTextArea
* @isEditor
* @inherits dxTextBox
* @module ui/text_area
* @export default
*/
var TextArea = TextBox.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTextAreaOptions.mode
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTextAreaOptions.showClearButton
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTextAreaOptions.spellcheck
            * @type boolean
            * @default true
            */
            spellcheck: true,

            /**
            * @name dxTextAreaOptions.minHeight
            * @type numeric|string
            * @default undefined
            */
            minHeight: undefined,

            /**
            * @name dxTextAreaOptions.maxHeight
            * @type numeric|string
            * @default undefined
            */
            maxHeight: undefined,

            /**
            * @name dxTextAreaOptions.autoResizeEnabled
            * @type boolean
            * @default false
            */
            autoResizeEnabled: false

            /**
            * @name dxTextAreaOptions.mask
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTextAreaOptions.maskChar
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTextAreaOptions.maskRules
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTextAreaOptions.maskInvalidMessage
            * @hidden
            * @inheritdoc
            */

            /**
            * @name dxTextAreaOptions.useMaskedValue
            * @hidden
            * @inheritdoc
            */

            /**
             * @name dxTextAreaOptions.showMaskMode
             * @hidden
             * @inheritdoc
             */
        });
    },

    _initMarkup: function() {
        this.$element().addClass(TEXTAREA_CLASS);
        this.callBase();
        this.setAria("multiline", "true");
    },

    _renderContentImpl: function() {
        this._updateInputHeight();
        this.callBase();
    },

    _renderInput: function() {
        this.callBase();
        this._renderScrollHandler();
    },

    _createInput: function() {
        var $input = $("<textarea>");
        this._applyInputAttributes($input, this.option("inputAttr"));
        this._updateInputAutoResizeAppearance($input);

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
        var $element = this.$element();
        var element = $element.get(0);
        var width = this._getOptionValue("width", element);
        var height = this._getOptionValue("height", element);
        var minHeight = this.option("minHeight");
        var maxHeight = this.option("maxHeight");

        $element.css({
            minHeight: minHeight !== undefined ? minHeight : "",
            maxHeight: maxHeight !== undefined ? maxHeight : "",
            width: width,
            height: height
        });
    },

    _resetDimensions: function() {
        this.$element().css({
            "height": "",
            "minHeight": "",
            "maxHeight": ""
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

    _updateInputAutoResizeAppearance: function($input) {
        if($input) {
            $input.toggleClass(TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE, this.option("autoResizeEnabled"));
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "autoResizeEnabled":
                this._updateInputAutoResizeAppearance(this._input());
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
