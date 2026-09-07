import eventsEngine from '@js/common/core/events/core/events_engine';
import { eventData } from '@js/common/core/events/utils/index';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWidth } from '@js/core/utils/size';
import type { DxEvent } from '@js/events';
import type { Properties } from '@js/ui/range_slider';
import { applyServerDecimalSeparator } from '@ts/core/utils/m_common';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import type { SwipeUpdateEvent } from '@ts/events/swipe';
import type { SliderPointerEvent } from '@ts/ui/slider/slider';
import Slider from '@ts/ui/slider/slider';

import SliderHandle from './slider/slider_handle';

const RANGE_SLIDER_CLASS = 'dx-rangeslider';
const RANGE_SLIDER_START_HANDLE_CLASS = `${RANGE_SLIDER_CLASS}-start-handle`;
const RANGE_SLIDER_END_HANDLE_CLASS = `${RANGE_SLIDER_CLASS}-end-handle`;

export interface RangeSliderProperties extends Properties {
  min: number;

  max: number;

  step: number;

  keyStep: number;

  useInkRipple: boolean;

  start: number;

  end: number;

  startName: string;

  endName: string;

  value: number[];
}

class RangeSlider extends Slider<RangeSliderProperties> {
  _$handleStart!: dxElementWrapper;

  _$handleEnd!: dxElementWrapper;

  _capturedHandle!: dxElementWrapper;

  _$submitStartElement!: dxElementWrapper;

  _$submitEndElement!: dxElementWrapper;

  _supportedKeys(): SupportedKeys {
    const { rtlEnabled } = this.option();

    const changeHandle = (e: DxEvent<KeyboardEvent>, capturedHandle: dxElementWrapper): void => {
      const { start, end } = this.option();

      if (start === end) {
        this._capturedHandle = capturedHandle;
        e.target = capturedHandle.get(0);
        // @ts-expect-error trigger is not declared in the public events engine type
        eventsEngine.trigger(capturedHandle, 'focus');
      }
    };

    const setHandleValue = (e: DxEvent<KeyboardEvent>, step: number, sign: number): void => {
      const isStart = $(e.target).hasClass(RANGE_SLIDER_START_HANDLE_CLASS);

      const valueOption = isStart ? 'start' : 'end';
      const { start, end } = this.option();
      const normalizedStep = this._valueStep(step);

      const newValue = (isStart ? start : end)
        + sign * (rtlEnabled ? -normalizedStep : normalizedStep);

      this.option(valueOption, newValue);
    };

    const moveHandleRight = (e: DxEvent<KeyboardEvent>, step: number): void => {
      changeHandle(e, rtlEnabled ? this._$handleStart : this._$handleEnd);
      setHandleValue(e, step, 1);
    };

    const moveHandleLeft = (e: DxEvent<KeyboardEvent>, step: number): void => {
      changeHandle(e, rtlEnabled ? this._$handleEnd : this._$handleStart);
      setHandleValue(e, step, -1);
    };

    return {
      ...super._supportedKeys(),
      leftArrow(e): void {
        this._processKeyboardEvent(e);

        moveHandleLeft(e, this.option('step'));
      },
      rightArrow(e): void {
        this._processKeyboardEvent(e);

        moveHandleRight(e, this.option('step'));
      },
      pageUp(e): void {
        this._processKeyboardEvent(e);

        moveHandleRight(e, this.option('step') * this.option('keyStep'));
      },
      pageDown(e): void {
        this._processKeyboardEvent(e);

        moveHandleLeft(e, this.option('step') * this.option('keyStep'));
      },
      home(e): void {
        this._processKeyboardEvent(e);

        const isStart = $(e.target).hasClass(RANGE_SLIDER_START_HANDLE_CLASS);
        const valueOption = isStart ? 'start' : 'end';
        const startOption = isStart ? 'min' : 'start';
        const val = this.option(startOption);

        this.option(valueOption, val);
      },
      end(e): void {
        this._processKeyboardEvent(e);

        const isStart = $(e.target).hasClass(RANGE_SLIDER_START_HANDLE_CLASS);
        const valueOption = isStart ? 'start' : 'end';
        const endOption = isStart ? 'end' : 'max';
        const val = this.option(endOption);

        this.option(valueOption, val);
      },
    };
  }

  _getDefaultOptions(): RangeSliderProperties {
    return {
      ...super._getDefaultOptions(),
      start: 40,
      end: 60,
      value: [40, 60],
      startName: '',
      endName: '',
    };
  }

  _renderSubmitElement(): void {
    const { startName, endName } = this.option();
    const $element = this.$element();

    this._$submitStartElement = $('<input>')
      .attr('type', 'hidden')
      .attr('name', startName)
      .appendTo($element);

    this._$submitEndElement = $('<input>')
      .attr('type', 'hidden')
      .attr('name', endName)
      .appendTo($element);
  }

  _initOptions(options: RangeSliderProperties): void {
    super._initOptions(options);

    const initialValue = this.initialOption('value');
    const { value = [] } = this.option();

    if (value[0] === initialValue[0] && value[1] === initialValue[1]) {
      this.option('value', [this.option('start'), this.option('end')]);
    } else {
      this.option({ start: value[0], end: value[1] });
    }
  }

  _initMarkup(): void {
    this.$element().addClass(RANGE_SLIDER_CLASS);
    super._initMarkup();
  }

  _renderContentImpl(): Promise<void> | void {
    this._callHandlerMethod('repaint');

    return super._renderContentImpl();
  }

  _renderHandle(): void {
    const { start, end } = this.option();

    this._$handleStart = this._renderHandleImpl(start, this._$handleStart);
    this._$handleStart.addClass(RANGE_SLIDER_START_HANDLE_CLASS);

    this._$handleEnd = this._renderHandleImpl(end, this._$handleEnd);
    this._$handleEnd.addClass(RANGE_SLIDER_END_HANDLE_CLASS);

    this._updateHandleAriaLabels();
  }

  _startHandler(args: { event: SliderPointerEvent }): void {
    const e = args.event;
    const $range = this._$range;
    const rangeWidth = getWidth($range);
    const eventOffsetX = eventData(e).x - (this._$bar.offset()?.left ?? 0);
    const startHandleX = $range.position()?.left ?? 0;
    const endHandleX = ($range.position()?.left ?? 0) + rangeWidth;
    const { rtlEnabled } = this.option();
    const startHandleIsClosest = (rtlEnabled ? -1 : 1)
      * ((startHandleX + endHandleX) / 2 - eventOffsetX) > 0;

    this._capturedHandle = startHandleIsClosest ? this._$handleStart : this._$handleEnd;

    super._startHandler(args);
  }

  _updateHandleAriaLabels(): void {
    const ariaFromFormatter: (value?: unknown) => string = messageLocalization.getFormatter('dxRangeSlider-ariaFrom');
    const ariaTillFormatter: (value?: unknown) => string = messageLocalization.getFormatter('dxRangeSlider-ariaTill');

    this.setAria('label', ariaFromFormatter(this.option('dxRangeSlider-ariaFrom')), this._$handleStart);
    this.setAria('label', ariaTillFormatter(this.option('dxRangeSlider-ariaTill')), this._$handleEnd);
  }

  _activeHandle(): dxElementWrapper {
    return this._capturedHandle;
  }

  _updateHandlePosition(e: { event: SwipeUpdateEvent }): void {
    const { rtlEnabled, max, min } = this.option();
    const offsetDirection = rtlEnabled ? -1 : 1;

    // NOTE: android 2.3 has problems with mathematics
    const newRatio = Number(
      ((this._startOffset ?? 0) + (offsetDirection * e.event.offset) / this._swipePixelRatio())
        .toPrecision(12),
    );
    const newValue = newRatio * (max - min) + min;

    this._updateSelectedRangePosition(newRatio, newRatio);
    this._changeValueOnSwipe(newRatio);

    const [startValue, endValue] = this._getActualValue();

    if (startValue === endValue) {
      let $nextHandle: dxElementWrapper = $();
      if (newValue < startValue) {
        $nextHandle = this._$handleStart;
      } else {
        $nextHandle = this._$handleEnd;
      }
      // @ts-expect-error trigger is not declared in the public events engine type
      eventsEngine.trigger($nextHandle, 'focus');

      if ($nextHandle && $nextHandle !== this._capturedHandle) {
        const leftRatio = (startValue - min) / (max - min);
        const rightRatio = (endValue - min) / (max - min);

        this._updateSelectedRangePosition(leftRatio, rightRatio);
        this._toggleActiveState(this._activeHandle(), false);
        this._toggleActiveState($nextHandle, true);
        this._capturedHandle = $nextHandle;
      }

      this._updateSelectedRangePosition(newRatio, newRatio);
      this._changeValueOnSwipe(newRatio);
    }
  }

  _updateSelectedRangePosition(leftRatio: number, rightRatio: number): void {
    const { rtlEnabled = false } = this.option();
    const moveRight = (this._capturedHandle === this._$handleStart && rtlEnabled)
      || (this._capturedHandle === this._$handleEnd && !rtlEnabled);

    const prop = moveRight ? 'right' : 'left';

    if (rtlEnabled !== moveRight) {
      this._$range.css(prop, `${100 - rightRatio * 100}%`);
    } else {
      this._$range.css(prop, `${leftRatio * 100}%`);
    }
  }

  _setValueOnSwipe(value: number): void {
    const option = this._capturedHandle === this._$handleStart ? 'start' : 'end';
    let [start, end] = this._getActualValue();
    const { max, min } = this.option();

    start = Math.min(Math.max(start, min), max);
    end = Math.min(Math.max(end, min), max);

    if (option === 'start') {
      start = value > end ? end : value;
    } else {
      end = value < start ? start : value;
    }

    const { valueChangeMode } = this.option();

    if (valueChangeMode === 'onHandleMove') {
      this.option('value', [start, end]);
    } else {
      this._actualValue = [start, end];
      this._renderValue();
    }
  }

  _renderValue(): void {
    let [valStart, valEnd] = this._getActualValue();
    const { min, max, rtlEnabled } = this.option();

    valStart = Math.max(min, Math.min(valStart, max));
    valEnd = Math.max(valStart, Math.min(valEnd, max));

    const { valueChangeMode } = this.option();

    if (valueChangeMode === 'onHandleMove') {
      this._setOptionWithoutOptionChange('start', valStart);
      this._setOptionWithoutOptionChange('end', valEnd);
      this._setOptionWithoutOptionChange('value', [valStart, valEnd]);
    }

    this._$submitStartElement.val(applyServerDecimalSeparator(valStart));
    this._$submitEndElement.val(applyServerDecimalSeparator(valEnd));

    const ratio1 = max === min ? 0 : (valStart - min) / (max - min);
    const ratio2 = max === min ? 0 : (valEnd - min) / (max - min);

    const startOffset = `${parseFloat((ratio1 * 100).toPrecision(12))}%`;
    const endOffset = `${parseFloat(((1 - ratio2) * 100).toPrecision(12))}%`;

    if (!this._needPreventAnimation) {
      this._setRangeStyles({
        right: rtlEnabled ? startOffset : endOffset,
        left: rtlEnabled ? endOffset : startOffset,
      });
    }

    SliderHandle.getInstance<SliderHandle>(this._$handleStart).option('value', valStart);
    SliderHandle.getInstance<SliderHandle>(this._$handleEnd).option('value', valEnd);
  }

  _callHandlerMethod(name: 'repaint' | 'updateTooltipPosition'): void {
    SliderHandle.getInstance<SliderHandle>(this._$handleStart)[name]();
    SliderHandle.getInstance<SliderHandle>(this._$handleEnd)[name]();
  }

  _setValueOption(): void {
    const { start, end } = this.option();

    this.option('value', [start, end]);
  }

  _rangesAreEqual(firstRange: number[], secondRange: number[]): boolean {
    return firstRange[0] === secondRange[0] && firstRange[1] === secondRange[1];
  }

  _optionChanged(args: OptionChanged<RangeSliderProperties>): void {
    switch (args.name) {
      case 'value': {
        const value = args.value as number[];
        const previousValue = args.previousValue as number[];

        if (this._rangesAreEqual(value, previousValue)) {
          break;
        }

        this._setOptionWithoutOptionChange('start', value[0]);
        this._setOptionWithoutOptionChange('end', value[1]);

        this._renderValue();

        const { start, end } = this.option();

        const isDirty = !this._rangesAreEqual(this._initialValue as number[], value);
        this.option('isDirty', isDirty);

        this._createActionByOption('onValueChanged', {
          excludeValidators: ['disabled', 'readOnly'],
        })({
          start,
          end,
          value: [start, end],
          event: this._valueChangeEventInstance,
          previousValue,
        });

        this.validationRequest.fire({
          value: [start, end],
          editor: this,
        });

        this._saveValueChangeEvent(undefined);
        break;
      }
      case 'start':
      case 'end':
        this._setValueOption();
        break;
      case 'startName':
        this._$submitStartElement.attr('name', args.value as string);
        break;
      case 'endName':
        this._$submitEndElement.attr('name', args.value as string);
        break;
      case 'name':
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxRangeSlider', RangeSlider);

export default RangeSlider;
