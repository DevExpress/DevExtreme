import eventsEngine from '@js/common/core/events/core/events_engine';
import scrollEvents from '@js/common/core/events/gesture/emitter.gesture.scroll';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, eventData, normalizeKeyName } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { ensureDefined, noop } from '@js/core/utils/common';
import {
  getElementBoxParams, getOuterHeight, getVerticalOffsets, parseHeight,
} from '@js/core/utils/size';
import { isDefined } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import type { Properties } from '@js/ui/text_area';
import type { OptionChanged } from '@ts/core/widget/types';
import TextBox from '@ts/ui/text_box/m_text_box';
import { allowScroll, prepareScrollData } from '@ts/ui/text_box/m_utils.scroll';

export const TEXTAREA_CLASS = 'dx-textarea';
export const TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE = 'dx-texteditor-input-auto-resize';

export interface TextAreaProperties extends Omit<Properties,
'onChange' | 'onCopy' | 'onCut' | 'onEnterKey' | 'onFocusIn' | 'onFocusOut' | 'onInput' |
'onKeyDown' | 'onKeyUp' | 'onPaste' | 'onValueChanged' | 'onContentReady' | 'onDisposing' |
'onOptionChanged' | 'onInitialized'
> {
  _shouldAttachKeyboardEvents?: boolean;
}

class TextArea<
  TProperties extends TextAreaProperties = TextAreaProperties,
> extends TextBox<TProperties> {
  _eventY!: number;

  _$suggestionInput?: dxElementWrapper;

  _currentSuggestion?: string;

  _isSuggestionVisible = false;

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      spellcheck: true,
      autoResizeEnabled: false,
      _shouldAttachKeyboardEvents: false,
      smartSuggestionEnabled: false,
      userRole: '',
      suggestionLength: 100,
      onSuggestionRequest: undefined,
    };
  }

  _shouldAttachKeyboardEvents(): boolean {
    const {
      _shouldAttachKeyboardEvents: shouldAttachKeyboardEvents,
      readOnly,
    } = this.option();

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return shouldAttachKeyboardEvents || !readOnly;
  }

  _initMarkup(): void {
    this.$element().addClass(TEXTAREA_CLASS);
    super._initMarkup();
    this.setAria('multiline', 'true');

    if (this.option('smartSuggestionEnabled')) {
      this.$element().addClass('dx-textarea-smart');
    }
  }

  _renderContentImpl(): void {
    this._updateInputHeight();
    super._renderContentImpl();
  }

  _renderInput(): void {
    super._renderInput();
    this._renderScrollHandler();

    if (this.option('smartSuggestionEnabled')) {
      this._renderSuggestionTextArea();
    }
  }

  _createInput(): dxElementWrapper {
    const $input = $('<textarea>');
    this._applyInputAttributes($input, this.option('inputAttr'));
    this._updateInputAutoResizeAppearance($input);

    return $input;
  }

  _setInputMinHeight(): void {}

  _renderScrollHandler(): void {
    this._eventY = 0;
    const $input = this._input();
    const initScrollData = prepareScrollData($input, true);

    // @ts-expect-error ts-error
    eventsEngine.on($input, addNamespace(scrollEvents.init, this.NAME), initScrollData, noop);
    // @ts-expect-error ts-error
    eventsEngine.on($input, addNamespace(pointerEvents.down, this.NAME), this._pointerDownHandler.bind(this));
    // @ts-expect-error ts-error
    eventsEngine.on($input, addNamespace(pointerEvents.move, this.NAME), this._pointerMoveHandler.bind(this));
  }

  _renderAdditionalKeyDownHandler(): void {
    const $input = this._input();

    if (this.option('smartSuggestionEnabled')) {
      // @ts-expect-error ts-error
      eventsEngine.on($input, addNamespace('scroll', this.NAME), this._syncScroll.bind(this));
      // @ts-expect-error ts-error
      eventsEngine.on($input, addNamespace('keydown', this.NAME), this._keyDownHandler.bind(this));
    }
  }

  _keyDownHandler(e): void {
    super._keyDownHandler(e);

    if (!this.option('smartSuggestionEnabled')) {
      return;
    }

    const keyName = normalizeKeyName(e);

    if (keyName === 'tab' && this._currentSuggestion && this._isSuggestionVisible) {
      e.preventDefault();
      this._acceptSuggestion();
    } else if (keyName === 'escape' && this._currentSuggestion && this._isSuggestionVisible) {
      this._rejectSuggestion();
    }
  }

  _pointerDownHandler(e): void {
    this._eventY = eventData(e).y;
  }

  _pointerMoveHandler(e): void {
    const currentEventY = eventData(e).y;
    const delta = this._eventY - currentEventY;

    if (allowScroll(this._input(), delta)) {
      e.isScrollingEvent = true;
      e.stopPropagation();
    }

    this._eventY = currentEventY;
  }

  _renderDimensions(): void {
    const $element = this.$element();
    const element = $element.get(0);
    const width = this._getOptionValue('width', element);
    const height = this._getOptionValue('height', element);
    const minHeight = this.option('minHeight');
    const maxHeight = this.option('maxHeight');

    $element.css({
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      minHeight: minHeight !== undefined ? minHeight : '',
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      maxHeight: maxHeight !== undefined ? maxHeight : '',
      width,
      height,
    });
  }

  _resetDimensions(): void {
    this.$element().css({
      height: '',
      minHeight: '',
      maxHeight: '',
    });
  }

  _renderEvents(): void {
    if (this.option('autoResizeEnabled')) {
      // @ts-expect-error ts-error
      eventsEngine.on(this._input(), addNamespace('input paste', this.NAME), this._updateInputHeight.bind(this));
    }

    if (this.option('smartSuggestionEnabled')) {
      // @ts-expect-error ts-error
      eventsEngine.on(this._input(), addNamespace('input paste', this.NAME), this._inputHandler.bind(this));
    }

    super._renderEvents();
  }

  _inputHandler(): void {
    if (this.option('smartSuggestionEnabled')) {
      const { text = '' } = this.option();

      this._requestSuggestion(text);
    }
  }

  _refreshEvents(): void {
    // @ts-expect-error ts-error
    eventsEngine.off(this._input(), addNamespace('input paste', this.NAME));
    super._refreshEvents();
  }

  _getHeightDifference($input: dxElementWrapper): number {
    const verticalElementOffset = getVerticalOffsets(this.$element().get(0), false);
    const verticalEditorContainerOffset = getVerticalOffsets(
      this._$textEditorContainer.get(0),
      false,
    );
    const verticalInputContainerOffsets = getVerticalOffsets(
      this._$textEditorInputContainer.get(0),
      true,
    );
    const inputMargin = getElementBoxParams('height', getWindow().getComputedStyle($input.get(0))).margin;

    const sum = verticalElementOffset
      + verticalEditorContainerOffset
      + verticalInputContainerOffsets
      + inputMargin;

    return sum;
  }

  _updateInputHeight(): void {
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
    this.$element().css('height', getOuterHeight(this.$element()));
    $input.css('height', 0);

    const heightDifference = this._getHeightDifference($input);

    this._renderDimensions();

    const minHeight = this._getBoundaryHeight('minHeight');
    const maxHeight = this._getMaxHeight();

    let inputHeight = $input[0].scrollHeight;

    if (minHeight !== undefined) {
      inputHeight = Math.max(inputHeight, minHeight - heightDifference);
    }

    if (maxHeight !== undefined) {
      const adjustedMaxHeight = this._getAdjustedMaxHeight(maxHeight, heightDifference);
      const needScroll = inputHeight > adjustedMaxHeight;

      inputHeight = Math.min(inputHeight, adjustedMaxHeight);

      this._updateInputAutoResizeAppearance($input, !needScroll);
    }

    $input.css('height', inputHeight);

    if (autoHeightResizing) {
      this.$element().css('height', 'auto');
    }

    if (this.option('smartSuggestionEnabled')) {
      this._syncDimensions();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _getAdjustedMaxHeight(maxHeight: number, heightDifference: number): number {
    const adjustedMaxHeight = maxHeight - heightDifference;

    return adjustedMaxHeight;
  }

  _getMaxHeight(): number | undefined {
    return this._getBoundaryHeight('maxHeight');
  }

  _getBoundaryHeight(optionName: string): number | undefined {
    const boundaryValue = this.option(optionName);

    if (isDefined(boundaryValue)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return typeof boundaryValue === 'number'
        ? boundaryValue : parseHeight(
          boundaryValue,
          this.$element().get(0).parentElement,
          this.$element().get(0),
        );
    }

    return undefined;
  }

  _renderInputType(): void {}

  _visibilityChanged(visible: boolean): void {
    if (visible) {
      this._updateInputHeight();
    }
  }

  _updateInputAutoResizeAppearance($input: dxElementWrapper, isAutoResizeEnabled?): void {
    if ($input) {
      const autoResizeEnabled = ensureDefined(isAutoResizeEnabled, this.option('autoResizeEnabled'));

      $input.toggleClass(TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE, autoResizeEnabled);
    }
  }

  _dimensionChanged(): void {
    if (this.option('visible')) {
      this._updateInputHeight();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _createSuggestionInput(): dxElementWrapper {
    const $suggestionInput = $('<textarea>');

    // @ts-expect-error ts-error
    $suggestionInput.attr({
      readonly: 'readonly',
      tabindex: '-1',
      'aria-hidden': 'true',
      autocomplete: 'off',
      spellcheck: 'false',
      'aria-label': 'suggestion textarea',
    });

    return $suggestionInput;
  }

  _renderSuggestionTextArea(): void {
    this._$suggestionInput = this._createSuggestionInput();
    this._$suggestionInput
      .addClass('dx-textarea-suggestion')
      .addClass('dx-texteditor-input')
      .appendTo(this._$textEditorInputContainer);

    this._syncDimensions();
    this._renderAdditionalKeyDownHandler();
  }

  _disposeSuggestionTextArea(): void {
    if (this._$suggestionInput) {
      eventsEngine.off(this._$suggestionInput);
      this._$suggestionInput.remove();
      this._$suggestionInput = undefined;
      this._currentSuggestion = undefined;
      this._isSuggestionVisible = false;
    }
  }

  _syncScroll(): void {
    // sync scroll on big suggestion or input resize
  }

  _syncDimensions(): void {
    // sync dimentions on big suggestion or input resize
  }

  _updateSuggestionDisplay(userText: string, suggestion: string): void {
    if (!this._$suggestionInput) {
      return;
    }

    this._currentSuggestion = suggestion;

    const fullText = userText + suggestion;
    this._$suggestionInput.val(fullText);

    this._syncScroll();

    this._isSuggestionVisible = !!suggestion;
  }

  _acceptSuggestion(): void {
    if (!this._currentSuggestion) {
      return;
    }
    const { text: currentValue = '' } = this.option();
    // const currentValue = this.option('value') as unknown as string || '';
    const newValue = currentValue + this._currentSuggestion;

    this.option('value', newValue);

    this._rejectSuggestion();
  }

  _rejectSuggestion(): void {
    if (!this._$suggestionInput) {
      return;
    }

    this._currentSuggestion = undefined;
    this._isSuggestionVisible = false;

    this._$suggestionInput.val('');
  }

  _requestSuggestion(text: string): void {
    const { userRole, onSuggestionRequest } = this.option();

    if (!onSuggestionRequest || typeof onSuggestionRequest !== 'function') {
      return;
    }

    onSuggestionRequest(text, userRole)
      .then((suggestion: string) => { this._updateSuggestionDisplay(text, suggestion); })
      // @ts-expect-error ts-error
      .catch(() => { this._rejectSuggestion(); });
  }

  // _valueChangeEventHandler(e): void {
  //   super._valueChangeEventHandler(e);

  //   if (this.option('smartSuggestionEnabled')) {
  //     const text = this.option('value') as unknown as string || '';
  //     this._requestSuggestion(text);
  //   }
  // }

  _clean(): void {
    this._disposeSuggestionTextArea();
    super._clean();
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { name, value } = args;

    switch (name) {
      case '_shouldAttachKeyboardEvents':
      case 'autoResizeEnabled':
        this._updateInputAutoResizeAppearance(this._input(), value);
        this._refreshEvents();
        this._updateInputHeight();
        break;
      case 'value':
      case 'height':
        super._optionChanged(args);
        this._updateInputHeight();
        break;
      case 'minHeight':
      case 'maxHeight':
        this._renderDimensions();
        this._updateInputHeight();
        break;
      case 'visible':
        super._optionChanged(args);
        if (value) {
          this._updateInputHeight();
        }
        break;
      case 'smartSuggestionEnabled':
        if (value) {
          this.$element().addClass('dx-textarea-smart');
          this._renderSuggestionTextArea();
        } else {
          this.$element().removeClass('dx-textarea-smart');
          this._disposeSuggestionTextArea();
        }
        this._refreshEvents();
        break;
      case 'userRole':
      case 'suggestionLength':
      case 'onSuggestionRequest':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxTextArea', TextArea);

export default TextArea;
