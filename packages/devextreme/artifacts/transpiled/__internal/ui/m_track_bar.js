"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fx = _interopRequireDefault(require("../../animation/fx"));
var _component_registrator = _interopRequireDefault(require("../../core/component_registrator"));
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _extend = require("../../core/utils/extend");
var _window = require("../../core/utils/window");
var _editor = _interopRequireDefault(require("../../ui/editor/editor"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TRACKBAR_CLASS = 'dx-trackbar';
const TRACKBAR_CONTAINER_CLASS = 'dx-trackbar-container';
const TRACKBAR_RANGE_CLASS = 'dx-trackbar-range';
const TRACKBAR_WRAPPER_CLASS = 'dx-trackbar-wrapper';
// @ts-expect-error
const TrackBar = _editor.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      min: 0,
      max: 100,
      value: 0
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
    this._$wrapper = (0, _renderer.default)('<div>').addClass(TRACKBAR_WRAPPER_CLASS).appendTo(this.$element());
  },
  _renderContainer() {
    this._$bar = (0, _renderer.default)('<div>').addClass(TRACKBAR_CONTAINER_CLASS).appendTo(this._$wrapper);
  },
  _renderRange() {
    this._$range = (0, _renderer.default)('<div>').addClass(TRACKBAR_RANGE_CLASS).appendTo(this._$bar);
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
    !this._needPreventAnimation && this._setRangeStyles({
      width: `${ratio * 100}%`
    });
    this.setAria({
      // eslint-disable-next-line spellcheck/spell-checker
      valuemin: this.option('min'),
      // eslint-disable-next-line spellcheck/spell-checker
      valuemax: max,
      // eslint-disable-next-line spellcheck/spell-checker
      valuenow: val
    });
    this._currentRatio = ratio;
  },
  _rangeStylesConfig() {
    return {
      width: `${this._currentRatio * 100}%`
    };
  },
  _setRangeStyles(options) {
    // @ts-expect-error
    _fx.default.stop(this._$range);
    if (!options) {
      this._$range.css({
        width: 0
      });
      return;
    }
    if (this._needPreventAnimation || !(0, _window.hasWindow)()) {
      return;
    }
    _fx.default.animate(this._$range, {
      // @ts-expect-error
      type: 'custom',
      duration: 100,
      to: options
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
    _fx.default.stop(this._$range);
    this.callBase();
  }
});
(0, _component_registrator.default)('dxTrackBar', TrackBar);
var _default = exports.default = TrackBar;