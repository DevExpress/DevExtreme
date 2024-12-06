import eventsEngine from '@js/common/core/events/core/events_engine';
import scrollEvents from '@js/common/core/events/gesture/emitter.gesture.scroll';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, eventData } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { ensureDefined, noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
import {
  getElementBoxParams, getOuterHeight, getVerticalOffsets, parseHeight,
} from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import TextBox from '@js/ui/text_box';
import { allowScroll, prepareScrollData } from '@ts/ui/text_box/m_utils.scroll';

const TEXTAREA_CLASS = 'dx-textarea';
const TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE = 'dx-texteditor-input-auto-resize';

// @ts-expect-error
const TextArea = TextBox.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
      spellcheck: true,
      minHeight: undefined,
      maxHeight: undefined,
      autoResizeEnabled: false,
    });
  },

  _initMarkup() {
    this.$element().addClass(TEXTAREA_CLASS);
    this.callBase();
    this.setAria('multiline', 'true');
  },

  _renderContentImpl() {
    this._updateInputHeight();
    this.callBase();
  },

  _renderInput() {
    this.callBase();
    this._renderScrollHandler();
  },

  _createInput() {
    const $input = $('<textarea>');
    this._applyInputAttributes($input, this.option('inputAttr'));
    this._updateInputAutoResizeAppearance($input);

    return $input;
  },

  _setInputMinHeight: noop,

  _renderScrollHandler() {
    this._eventY = 0;
    const $input = this._input();
    const initScrollData = prepareScrollData($input, true);

    eventsEngine.on($input, addNamespace(scrollEvents.init, this.NAME), initScrollData, noop);
    eventsEngine.on($input, addNamespace(pointerEvents.down, this.NAME), this._pointerDownHandler.bind(this));
    eventsEngine.on($input, addNamespace(pointerEvents.move, this.NAME), this._pointerMoveHandler.bind(this));
  },

  _pointerDownHandler(e) {
    this._eventY = eventData(e).y;
  },

  _pointerMoveHandler(e) {
    const currentEventY = eventData(e).y;
    const delta = this._eventY - currentEventY;

    if (allowScroll(this._input(), delta)) {
      e.isScrollingEvent = true;
      e.stopPropagation();
    }

    this._eventY = currentEventY;
  },

  _renderDimensions() {
    const $element = this.$element();
    const element = $element.get(0);
    const width = this._getOptionValue('width', element);
    const height = this._getOptionValue('height', element);
    const minHeight = this.option('minHeight');
    const maxHeight = this.option('maxHeight');

    $element.css({
      minHeight: minHeight !== undefined ? minHeight : '',
      maxHeight: maxHeight !== undefined ? maxHeight : '',
      width,
      height,
    });
  },

  _resetDimensions() {
    this.$element().css({
      height: '',
      minHeight: '',
      maxHeight: '',
    });
  },

  _renderEvents() {
    if (this.option('autoResizeEnabled')) {
      eventsEngine.on(this._input(), addNamespace('input paste', this.NAME), this._updateInputHeight.bind(this));
    }

    this.callBase();
  },

  _refreshEvents() {
    eventsEngine.off(this._input(), addNamespace('input paste', this.NAME));
    this.callBase();
  },

  _getHeightDifference($input) {
    return getVerticalOffsets(this._$element.get(0), false)
            + getVerticalOffsets(this._$textEditorContainer.get(0), false)
            + getVerticalOffsets(this._$textEditorInputContainer.get(0), true)
            + getElementBoxParams('height', getWindow().getComputedStyle($input.get(0))).margin;
  },

  _updateInputHeight() {
    if (!hasWindow()) {
      return;
    }

    const $input = this._input();
    const height = this.option('height');
    const autoHeightResizing = height === undefined && this.option('autoResizeEnabled');
    const shouldCalculateInputHeight = autoHeightResizing || (height === undefined && this.option('minHeight'));

    if (!shouldCalculateInputHeight) {
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

    if (minHeight !== undefined) {
      inputHeight = Math.max(inputHeight, minHeight - heightDifference);
    }

    if (maxHeight !== undefined) {
      const adjustedMaxHeight = maxHeight - heightDifference;
      const needScroll = inputHeight > adjustedMaxHeight;

      inputHeight = Math.min(inputHeight, adjustedMaxHeight);
      this._updateInputAutoResizeAppearance($input, !needScroll);
    }

    $input.css('height', inputHeight);

    if (autoHeightResizing) {
      this._$element.css('height', 'auto');
    }
  },

  _getBoundaryHeight(optionName) {
    const boundaryValue = this.option(optionName);

    if (isDefined(boundaryValue)) {
      return typeof boundaryValue === 'number' ? boundaryValue : parseHeight(boundaryValue, this.$element().get(0).parentElement, this._$element.get(0));
    }
  },

  _renderInputType: noop,

  _visibilityChanged(visible) {
    if (visible) {
      this._updateInputHeight();
    }
  },

  _updateInputAutoResizeAppearance($input, isAutoResizeEnabled) {
    if ($input) {
      const autoResizeEnabled = ensureDefined(isAutoResizeEnabled, this.option('autoResizeEnabled'));

      $input.toggleClass(TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE, autoResizeEnabled);
    }
  },

  _dimensionChanged() {
    if (this.option('visible')) {
      this._updateInputHeight();
    }
  },

  _optionChanged(args) {
    switch (args.name) {
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
  },
});

registerComponent('dxTextArea', TextArea);

export default TextArea;
