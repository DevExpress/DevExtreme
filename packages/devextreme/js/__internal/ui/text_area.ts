import eventsEngine from '@js/common/core/events/core/events_engine';
import scrollEvents from '@js/common/core/events/gesture/emitter.gesture.scroll';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace, eventData } from '@js/common/core/events/utils/index';
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
import TextBox from '@ts/ui/text_box/text_box';
import { allowScroll, prepareScrollData } from '@ts/ui/text_box/utils.scroll';

type ScrollAwareEvent = (MouseEvent | PointerEvent) & {
  isScrollingEvent?: boolean;
};

export interface TextAreaProperties extends Omit<Properties,
'onChange' | 'onCopy' | 'onCut' | 'onEnterKey' | 'onFocusIn' | 'onFocusOut' | 'onInput'
| 'onKeyDown' | 'onKeyUp' | 'onPaste' | 'onValueChanged' | 'onContentReady' | 'onDisposing'
| 'onOptionChanged' | 'onInitialized'
> {
  _shouldAttachKeyboardEvents?: boolean;
}

export const TEXTAREA_CLASS = 'dx-textarea';
export const TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE = 'dx-texteditor-input-auto-resize';

class TextArea<
  TProperties extends TextAreaProperties = TextAreaProperties,
> extends TextBox<TProperties> {
  _eventY!: number;

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      spellcheck: true,
      autoResizeEnabled: false,
      _shouldAttachKeyboardEvents: false,
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
  }

  _renderContentImpl(): void {
    this._updateInputHeight();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    super._renderContentImpl();
  }

  _renderInput(): void {
    super._renderInput();
    this._renderScrollHandler();
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

    // @ts-expect-error addNamespace
    eventsEngine.on($input, addNamespace(scrollEvents.init, this.NAME), initScrollData, noop);
    eventsEngine.on(
      $input,
      // @ts-expect-error addNamespace
      addNamespace(pointerEvents.down, this.NAME),
      this._pointerDownHandler.bind(this),
    );
    eventsEngine.on(
      $input,
      // @ts-expect-error addNamespace
      addNamespace(pointerEvents.move, this.NAME),
      this._pointerMoveHandler.bind(this),
    );
  }

  _pointerDownHandler(e: MouseEvent | PointerEvent): void {
    this._eventY = eventData(e).y;
  }

  _pointerMoveHandler(e: MouseEvent | PointerEvent): void {
    const currentEventY = eventData(e).y;
    const delta = this._eventY - currentEventY;

    if (allowScroll(this._input(), delta)) {
      (e as ScrollAwareEvent).isScrollingEvent = true;
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
      // @ts-expect-error addNamespace
      eventsEngine.on(this._input(), addNamespace('input paste', this.NAME), this._updateInputHeight.bind(this));
    }

    super._renderEvents();
  }

  _refreshEvents(): void {
    // @ts-expect-error addNamespace
    eventsEngine.off(this._input(), addNamespace('input paste', this.NAME));
    super._refreshEvents();
  }

  _getHeightDifference($input: dxElementWrapper): number {
    const verticalElementOffset = getVerticalOffsets(this.$element().get(0), false);
    const verticalEditorContainerOffset = getVerticalOffsets(
      this._$textEditorContainer?.get(0),
      false,
    );
    const verticalInputContainerOffsets = getVerticalOffsets(
      this._$textEditorInputContainer?.get(0),
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

    const {
      autoResizeEnabled,
      height,
      minHeight: minHeightOptionValue,
    } = this.option();

    const $input = this._input();

    const shouldCalculateInputHeight = autoResizeEnabled
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      || (height === undefined && minHeightOptionValue);

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

    if (autoResizeEnabled) {
      this.$element().css('height', 'auto');
    }
  }

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

  _updateInputAutoResizeAppearance($input: dxElementWrapper, isAutoResizeEnabled?: boolean): void {
    if ($input) {
      const autoResizeEnabled = ensureDefined(isAutoResizeEnabled, Boolean(this.option('autoResizeEnabled')));

      $input.toggleClass(TEXTEDITOR_INPUT_CLASS_AUTO_RESIZE, autoResizeEnabled);
    }
  }

  _dimensionChanged(): void {
    if (this.option('visible')) {
      this._updateInputHeight();
    }
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    const { name, value } = args;

    switch (name) {
      case '_shouldAttachKeyboardEvents':
      case 'autoResizeEnabled':
        this._updateInputAutoResizeAppearance(this._input(), Boolean(value));
        this._refreshEvents();
        this._renderDimensions();
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
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxTextArea', TextArea);

export default TextArea;
