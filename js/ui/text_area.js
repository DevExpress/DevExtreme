import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import { noop, ensureDefined } from '../core/utils/common';
import { getWindow, hasWindow } from '../core/utils/window';
import registerComponent from '../core/component_registrator';
import { extend } from '../core/utils/extend';
import { isDefined } from '../core/utils/type';
import { addNamespace, eventData } from '../events/utils/index';
import pointerEvents from '../events/pointer';
import scrollEvents from '../events/gesture/emitter.gesture.scroll';
import { getVerticalOffsets, getElementBoxParams, parseHeight, getOuterHeight } from '../core/utils/size';
import { allowScroll, prepareScrollData } from './text_box/utils.scroll';
import TextBox from './text_box';

// STYLE textArea

const TEXTAREA_CLASS = 'dx-textarea';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE = 'dx-texteditor-input-auto-resize';

const TextArea = TextBox.inherit({
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
        const $input = $('<textarea>');
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
        const initScrollData = prepareScrollData($input, true);

        eventsEngine.on($input, addNamespace(scrollEvents.init, this.NAME), initScrollData, noop);
        eventsEngine.on($input, addNamespace(pointerEvents.down, this.NAME), this._pointerDownHandler.bind(this));
        eventsEngine.on($input, addNamespace(pointerEvents.move, this.NAME), this._pointerMoveHandler.bind(this));
    },

    _pointerDownHandler: function(e) {
        this._eventY = eventData(e).y;
    },

    _pointerMoveHandler: function(e) {
        const currentEventY = eventData(e).y;
        const delta = this._eventY - currentEventY;

        if(allowScroll(this._input(), delta)) {
            e.isScrollingEvent = true;
            e.stopPropagation();
        }

        this._eventY = currentEventY;
    },


    _renderDimensions: function() {
        const $element = this.$element();
        const element = $element.get(0);
        const width = this._getOptionValue('width', element);
        const height = this._getOptionValue('height', element);
        const minHeight = this.option('minHeight');
        const maxHeight = this.option('maxHeight');

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
            eventsEngine.on(this._input(), addNamespace('input paste', this.NAME), this._updateInputHeight.bind(this));
        }

        this.callBase();
    },

    _refreshEvents: function() {
        eventsEngine.off(this._input(), addNamespace('input paste', this.NAME));
        this.callBase();
    },

    _getHeightDifference($input) {
        return getVerticalOffsets(this._$element.get(0), false)
            + getVerticalOffsets(this._$textEditorContainer.get(0), false)
            + getVerticalOffsets(this._$textEditorInputContainer.get(0), false)
            + getElementBoxParams('height', getWindow().getComputedStyle($input.get(0))).margin;
    },

    _updateInputHeight: function() {
        if(!hasWindow()) {
            return;
        }

        const $input = this._input();
        const height = this.option('height');
        const autoHeightResizing = height === undefined && this.option('autoResizeEnabled');
        const shouldCalculateInputHeight = autoHeightResizing || (height === undefined && this.option('minHeight'));

        if(!shouldCalculateInputHeight) {
            $input.css('height', '');
            return;
        }

        this._resetDimensions();
        this._$element.css('height', getOuterHeight(this._$element));
        $input.css('height', 0);

        const heightDifference = this._getHeightDifference($input);

        this._renderDimensions();

        const minHeight = this._getBoundaryHeight('minHeight');
        const maxHeight = this._getBoundaryHeight('maxHeight');
        let inputHeight = $input[0].scrollHeight;

        if(minHeight !== undefined) {
            inputHeight = Math.max(inputHeight, minHeight - heightDifference);
        }

        if(maxHeight !== undefined) {
            const adjustedMaxHeight = maxHeight - heightDifference;
            const needScroll = inputHeight > adjustedMaxHeight;

            inputHeight = Math.min(inputHeight, adjustedMaxHeight);
            this._updateInputAutoResizeAppearance($input, !needScroll);
        }

        $input.css('height', inputHeight);

        if(autoHeightResizing) {
            this._$element.css('height', 'auto');
        }
    },

    _getBoundaryHeight: function(optionName) {
        const boundaryValue = this.option(optionName);

        if(isDefined(boundaryValue)) {
            return typeof boundaryValue === 'number' ? boundaryValue : parseHeight(boundaryValue, this.$element().get(0).parentElement, this._$element.get(0));
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
            const autoResizeEnabled = ensureDefined(isAutoResizeEnabled, this.option('autoResizeEnabled'));

            $input.toggleClass(TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE, autoResizeEnabled);
        }
    },

    _dimensionChanged: function() {
        if(this.option('visible')) {
            this._updateInputHeight();
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
    * @name dxTextArea.getButton
    * @publicName getButton(name)
    * @hidden
    */
});

registerComponent('dxTextArea', TextArea);

export default TextArea;
