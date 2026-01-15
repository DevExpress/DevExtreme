import { fx } from '@js/common/core/animation';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { hasWindow } from '@js/core/utils/window';
import type { dxTrackBarOptions } from '@js/ui/track_bar';
import type { OptionChanged } from '@ts/core/widget/types';
import Editor from '@ts/ui/editor/editor';

const TRACKBAR_CLASS = 'dx-trackbar';
const TRACKBAR_CONTAINER_CLASS = 'dx-trackbar-container';
const TRACKBAR_RANGE_CLASS = 'dx-trackbar-range';
const TRACKBAR_WRAPPER_CLASS = 'dx-trackbar-wrapper';

export interface TrackBarProperties extends dxTrackBarOptions<TrackBar> {}

class TrackBar<
  TProperties extends TrackBarProperties = TrackBarProperties,
> extends Editor<TProperties> {
  _$wrapper!: dxElementWrapper;

  _$range!: dxElementWrapper;

  _$bar!: dxElementWrapper;

  _currentRatio!: number;

  _needPreventAnimation?: boolean;

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      min: 0,
      max: 100,
      value: 0,
    };
  }

  _initMarkup(): void {
    this.$element().addClass(TRACKBAR_CLASS);
    this._renderWrapper();
    this._renderContainer();
    this._renderRange();

    this._renderValue();

    this._setRangeStyles();
    super._initMarkup();
  }

  _render(): void {
    super._render();

    this._setRangeStyles(this._rangeStylesConfig());
  }

  _renderWrapper(): void {
    this._$wrapper = $('<div>')
      .addClass(TRACKBAR_WRAPPER_CLASS)
      .appendTo(this.$element());
  }

  _renderContainer(): void {
    this._$bar = $('<div>')
      .addClass(TRACKBAR_CONTAINER_CLASS)
      .appendTo(this._$wrapper);
  }

  _renderRange(): void {
    this._$range = $('<div>')
      .addClass(TRACKBAR_RANGE_CLASS)
      .appendTo(this._$bar);
  }

  _renderValue(): void {
    const { value: val, min, max } = this.option();
    // @ts-expect-error ts-error
    if (min > max) {
      return;
    }
    // @ts-expect-error ts-error
    if (val < min) {
      this.option('value', min);
      this._currentRatio = 0;
      return;
    }
    // @ts-expect-error ts-error
    if (val > max) {
      this.option('value', max);
      this._currentRatio = 1;
      return;
    }
    // @ts-expect-error ts-error
    const ratio = min === max ? 0 : (val - min) / (max - min);
    if (!this._needPreventAnimation) {
      this._setRangeStyles({ width: `${ratio * 100}%` });
    }

    this.setAria({
      // eslint-disable-next-line spellcheck/spell-checker
      valuemin: this.option('min'),
      // eslint-disable-next-line spellcheck/spell-checker
      valuemax: max,
      // eslint-disable-next-line spellcheck/spell-checker
      valuenow: val,
    });

    this._currentRatio = ratio;
  }

  _rangeStylesConfig(): Record<string, unknown> {
    return { width: `${this._currentRatio * 100}%` };
  }

  _setRangeStyles(options?): void {
    // @ts-expect-error ts-error
    fx.stop(this._$range);

    if (!options) {
      this._$range.css({ width: 0 });
      return;
    }

    if (this._needPreventAnimation || !hasWindow()) {
      return;
    }
    // @ts-expect-error ts-error
    fx.animate(this._$range, {
      type: 'custom',
      duration: 100,
      to: options,
    });
  }

  _optionChanged(args: OptionChanged<TProperties>): void {
    switch (args.name) {
      case 'value':
        this._renderValue();
        super._optionChanged(args);
        break;
      case 'max':
      case 'min':
        this._renderValue();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _dispose(): void {
    // @ts-expect-error ts-error
    fx.stop(this._$range);
    super._dispose();
  }
}

registerComponent('dxTrackBar', TrackBar);

export default TrackBar;
