import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import { noop, ensureDefined } from '../core/utils/common';
import windowUtils from '../core/utils/window';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import { isDefined } from '../core/utils/type';
import eventUtils from '../events/utils';
import pointerEvents from '../events/pointer';
import scrollEvents from '../ui/scroll_view/ui.events.emitter.gesture.scroll';
import sizeUtils from '../core/utils/size';
import { allowScroll } from './text_box/utils.scroll';
import TextBox from './text_box';

const TEXTAREA_CLASS = 'dx-textarea';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE = 'dx-texteditor-input-auto-resize';

var TextArea = TextBox.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTextAreaOptions.mode
            * @hidden
            */

            /**
            * @name dxTextAreaOptions.showClearButton
            * @hidden
            */

            spellcheck: true,

            minHeight: undefined,

            maxHeight: undefined,

            autoResizeEnabled: false

            /**
            * @name dxTextAreaOptions.mask
            * @hidden
            */

            /**
            * @name dxTextAreaOptions.maskChar
            * @hidden
            */

            /**
            * @name dxTextAreaOptions.maskRules
            * @hidden
            */

            /**
            * @name dxTextAreaOptions.maskInvalidMessage
            * @hidden
            */

            /**
            * @name dxTextAreaOptions.useMaskedValue
            * @hidden
            */

            /**
             * @name dxTextAreaOptions.showMaskMode
             * @hidden
             */

            /**
            * @name dxTextAreaOptions.buttons
            * @hidden
            */
        });
    },

    _initMarkup: function() {
        this.$element().addClass(TEXTAREA_CLASS);
        this.callBase();
        this.setAria('multiline', 'true');
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
        var $input = $('<textarea>');
        this._applyInputAttributes($input, this.option('inputAttr'));
        this._updateInputAutoResizeAppearance($input);

        return $input;
    },

    _applyInputAttributes: function($input, customAttributes) {
        $input.attr(customAttributes)
            .addClass(TEXTEDITOR_INPUT_CLASS);
    },

    _renderScrollHandler: function() {
        this._eventY = 0;
        const $input = this._input();

        const initScrollData = {
            validate: (e) => {
                if(eventUtils.isDxMouseWheelEvent(e) && $(e.target).is(this._input())) {
                    if(allowScroll($input, -e.delta, e.shiftKey)) {
                        e._needSkipEvent = true;
                        return true;
                    }

                    return false;
                }
            }
        };

        eventsEngine.on($input, eventUtils.addNamespace(scrollEvents.init, this.NAME), initScrollData, noop);
        eventsEngine.on($input, eventUtils.addNamespace(pointerEvents.down, this.NAME), this._pointerDownHandler.bind(this));
        eventsEngine.on($input, eventUtils.addNamespace(pointerEvents.move, this.NAME), this._pointerMoveHandler.bind(this));
    },

    _pointerDownHandler: function(e) {
        this._eventY = eventUtils.eventData(e).y;
    },

    _pointerMoveHandler: function(e) {
        const currentEventY = eventUtils.eventData(e).y;
        const delta = this._eventY - currentEventY;

        if(allowScroll(this._input(), delta)) {
            e.isScrollingEvent = true;
            e.stopPropagation();
        }

        this._eventY = currentEventY;
    },


    _renderDimensions: function() {
        var $element = this.$element();
        var element = $element.get(0);
        var width = this._getOptionValue('width', element);
        var height = this._getOptionValue('height', element);
        var minHeight = this.option('minHeight');
        var maxHeight = this.option('maxHeight');

        $element.css({
            minHeight: minHeight !== undefined ? minHeight : '',
            maxHeight: maxHeight !== undefined ? maxHeight : '',
            width: width,
            height: height
        });
    },

    _resetDimensions: function() {
        this.$element().css({
            'height': '',
            'minHeight': '',
            'maxHeight': ''
        });
    },

    _renderEvents: function() {
        if(this.option('autoResizeEnabled')) {
            eventsEngine.on(this._input(), eventUtils.addNamespace('input paste', this.NAME), this._updateInputHeight.bind(this));
        }

        this.callBase();
    },

    _refreshEvents: function() {
        eventsEngine.off(this._input(), eventUtils.addNamespace('input paste', this.NAME));
        this.callBase();
    },

    _getHeightDifference($input) {
        return sizeUtils.getVerticalOffsets(this._$element.get(0), false)
            + sizeUtils.getVerticalOffsets(this._$textEditorContainer.get(0), false)
            + sizeUtils.getVerticalOffsets(this._$textEditorInputContainer.get(0), false)
            + sizeUtils.getElementBoxParams('height', windowUtils.getWindow().getComputedStyle($input.get(0))).margin;
    },

    _updateInputHeight: function() {
        var $input = this._input();
        var autoHeightResizing = this.option('height') === undefined && this.option('autoResizeEnabled');

        if(!autoHeightResizing) {
            $input.css('height', '');
            return;
        } else {
            this._resetDimensions();
            this._$element.css('height', this._$element.outerHeight());
        }

        $input.css('height', 0);

        var heightDifference = this._getHeightDifference($input);

        this._renderDimensions();

        var minHeight = this._getBoundaryHeight('minHeight'),
            maxHeight = this._getBoundaryHeight('maxHeight'),
            inputHeight = $input[0].scrollHeight;

        if(minHeight !== undefined) {
            inputHeight = Math.max(inputHeight, minHeight - heightDifference);
        }

        if(maxHeight !== undefined) {
            var adjustedMaxHeight = maxHeight - heightDifference;
            var needScroll = inputHeight > adjustedMaxHeight;

            inputHeight = Math.min(inputHeight, adjustedMaxHeight);
            this._updateInputAutoResizeAppearance($input, !needScroll);
        }

        $input.css('height', inputHeight);

        if(autoHeightResizing) {
            this._$element.css('height', 'auto');
        }
    },

    _getBoundaryHeight: function(optionName) {
        var boundaryValue = this.option(optionName);

        if(isDefined(boundaryValue)) {
            return typeof boundaryValue === 'number' ? boundaryValue : sizeUtils.parseHeight(boundaryValue, this._$textEditorContainer.get(0));
        }
    },

    _renderInputType: noop,

    _visibilityChanged: function(visible) {
        if(visible) {
            this._updateInputHeight();
        }
    },

    _updateInputAutoResizeAppearance: function($input, isAutoResizeEnabled) {
        if($input) {
            var autoResizeEnabled = ensureDefined(isAutoResizeEnabled, this.option('autoResizeEnabled'));

            $input.toggleClass(TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE, autoResizeEnabled);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case 'autoResizeEnabled':
                this._updateInputAutoResizeAppearance(this._input(), args.value);
                this._refreshEvents();
                this._updateInputHeight();
                break;
            case 'value':
            case 'height':
                this.callBase(args);
                this._updateInputHeight();
                break;
            case 'minHeight':
            case 'maxHeight':
                this._renderDimensions();
                this._updateInputHeight();
                break;
            case 'visible':
                this.callBase(args);
                args.value && this._updateInputHeight();
                break;
            default:
                this.callBase(args);
        }
    }

    /**
    * @name dxTextAreaMethods.getButton
    * @publicName getButton(name)
    * @hidden
    */
});

registerComponent('dxTextArea', TextArea);

module.exports = TextArea;
