import { fx } from '@js/common/core/animation';
import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { hasWindow } from '@js/core/utils/window';
import Editor from '@js/ui/editor/editor';

const TRACKBAR_CLASS = 'dx-trackbar';
const TRACKBAR_CONTAINER_CLASS = 'dx-trackbar-container';
const TRACKBAR_RANGE_CLASS = 'dx-trackbar-range';
const TRACKBAR_WRAPPER_CLASS = 'dx-trackbar-wrapper';

// @ts-expect-error
const TrackBar = Editor.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
      min: 0,
      max: 100,
      value: 0,
    });
  },

  _initMarkup() {
    this.$element().addClass(TRACKBAR_CLASS);
    this._renderWrapper();
    this._renderContainer();
    this._renderRange();

    this._renderValue();

    this._setRangeStyles();
    this.callBase();
  },

  _render() {
    this.callBase();

    this._setRangeStyles(this._rangeStylesConfig());
  },

  _renderWrapper() {
    this._$wrapper = $('<div>')
      .addClass(TRACKBAR_WRAPPER_CLASS)
      .appendTo(this.$element());
  },

  _renderContainer() {
    this._$bar = $('<div>')
      .addClass(TRACKBAR_CONTAINER_CLASS)
      .appendTo(this._$wrapper);
  },

  _renderRange() {
    this._$range = $('<div>')
      .addClass(TRACKBAR_RANGE_CLASS)
      .appendTo(this._$bar);
  },

  _renderValue() {
    const val = this.option('value');
    const min = this.option('min');
    const max = this.option('max');

    if (min > max) {
      return;
    }

    if (val < min) {
      this.option('value', min);
      this._currentRatio = 0;
      return;
    }

    if (val > max) {
      this.option('value', max);
      this._currentRatio = 1;
      return;
    }

    const ratio = min === max ? 0 : (val - min) / (max - min);
    !this._needPreventAnimation && this._setRangeStyles({ width: `${ratio * 100}%` });

    this.setAria({
      // eslint-disable-next-line spellcheck/spell-checker
      valuemin: this.option('min'),
      // eslint-disable-next-line spellcheck/spell-checker
      valuemax: max,
      // eslint-disable-next-line spellcheck/spell-checker
      valuenow: val,
    });

    this._currentRatio = ratio;
  },

  _rangeStylesConfig() {
    return { width: `${this._currentRatio * 100}%` };
  },

  _setRangeStyles(options) {
    // @ts-expect-error
    fx.stop(this._$range);

    if (!options) {
      this._$range.css({ width: 0 });
      return;
    }

    if (this._needPreventAnimation || !hasWindow()) {
      return;
    }

    fx.animate(this._$range, {
      // @ts-expect-error
      type: 'custom',
      duration: 100,
      to: options,
    });
  },

  _optionChanged(args) {
    switch (args.name) {
      case 'value':
        this._renderValue();
        this.callBase(args);
        break;
      case 'max':
      case 'min':
        this._renderValue();
        break;
      default:
        this.callBase(args);
    }
  },

  _dispose() {
    // @ts-expect-error
    fx.stop(this._$range);
    this.callBase();
  },
});

registerComponent('dxTrackBar', TrackBar);

export default TrackBar;
