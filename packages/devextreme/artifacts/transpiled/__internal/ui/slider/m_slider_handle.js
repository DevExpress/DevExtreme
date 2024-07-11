"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _extend = require("../../../core/utils/extend");
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.widget"));
var _m_slider_tooltip = _interopRequireDefault(require("./m_slider_tooltip"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const SLIDER_HANDLE_CLASS = 'dx-slider-handle';
// @ts-expect-error
const SliderHandle = _ui.default.inherit({
  _getDefaultOptions() {
    return (0, _extend.extend)(this.callBase(), {
      hoverStateEnabled: false,
      value: 0,
      tooltip: {
        enabled: false,
        format: value => value,
        position: 'top',
        showMode: 'onHover'
      }
    });
  },
  _initMarkup() {
    this.callBase();
    this.$element().addClass(SLIDER_HANDLE_CLASS);
    this.setAria({
      role: 'slider',
      // eslint-disable-next-line spellcheck/spell-checker
      valuenow: this.option('value'),
      label: 'Slider'
    });
  },
  _render() {
    this.callBase();
    this._renderTooltip();
  },
  _renderTooltip() {
    const {
      tooltip,
      value
    } = this.option();
    const {
      position,
      format,
      enabled,
      showMode
    } = tooltip;
    const $sliderTooltip = (0, _renderer.default)('<div>');
    this._sliderTooltip = this._createComponent($sliderTooltip, _m_slider_tooltip.default, {
      target: this.$element(),
      container: $sliderTooltip,
      position,
      visible: enabled,
      showMode,
      format,
      value
    });
  },
  _clean() {
    this.callBase();
    this._sliderTooltip = null;
  },
  _updateTooltipOptions(args) {
    var _this$_sliderTooltip;
    // @ts-expect-error
    const tooltipOptions = _ui.default.getOptionsFromContainer(args);
    this._setWidgetOption('_sliderTooltip', [tooltipOptions]);
    (_this$_sliderTooltip = this._sliderTooltip) === null || _this$_sliderTooltip === void 0 || _this$_sliderTooltip.option('visible', tooltipOptions.enabled);
  },
  _optionChanged(args) {
    const {
      name,
      value
    } = args;
    switch (name) {
      case 'value':
        {
          var _this$_sliderTooltip2;
          (_this$_sliderTooltip2 = this._sliderTooltip) === null || _this$_sliderTooltip2 === void 0 || _this$_sliderTooltip2.option('value', value);
          this.setAria('valuenow', value);
          break;
        }
      case 'tooltip':
        this._updateTooltipOptions(args);
        break;
      default:
        this.callBase(args);
    }
  },
  updateTooltipPosition() {
    var _this$_sliderTooltip3;
    (_this$_sliderTooltip3 = this._sliderTooltip) === null || _this$_sliderTooltip3 === void 0 || _this$_sliderTooltip3.updatePosition();
  },
  repaint() {
    var _this$_sliderTooltip4;
    (_this$_sliderTooltip4 = this._sliderTooltip) === null || _this$_sliderTooltip4 === void 0 || _this$_sliderTooltip4.repaint();
  }
});
var _default = exports.default = SliderHandle;