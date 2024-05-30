import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import Widget from '@js/ui/widget/ui.widget';

import SliderTooltip from './m_slider_tooltip';

const SLIDER_HANDLE_CLASS = 'dx-slider-handle';

// @ts-expect-error
const SliderHandle = Widget.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
      hoverStateEnabled: false,
      value: 0,
      tooltip: {
        enabled: false,
        format: (value) => value,
        position: 'top',
        showMode: 'onHover',
      },
    });
  },

  _initMarkup() {
    this.callBase();
    this.$element().addClass(SLIDER_HANDLE_CLASS);

    this.setAria({
      role: 'slider',
      // eslint-disable-next-line spellcheck/spell-checker
      valuenow: this.option('value'),
      label: 'Slider',
    });
  },

  _render() {
    this.callBase();
    this._renderTooltip();
  },

  _renderTooltip() {
    const { tooltip, value } = this.option();
    const {
      position, format, enabled, showMode,
    } = tooltip;

    const $sliderTooltip = $('<div>');
    this._sliderTooltip = this._createComponent($sliderTooltip, SliderTooltip, {
      target: this.$element(),
      container: $sliderTooltip,
      position,
      visible: enabled,

      showMode,
      format,
      value,
    });
  },

  _clean() {
    this.callBase();
    this._sliderTooltip = null;
  },

  _updateTooltipOptions(args) {
    // @ts-expect-error
    const tooltipOptions = Widget.getOptionsFromContainer(args);

    this._setWidgetOption('_sliderTooltip', [tooltipOptions]);
    this._sliderTooltip?.option('visible', tooltipOptions.enabled);
  },

  _optionChanged(args) {
    const { name, value } = args;
    switch (name) {
      case 'value': {
        this._sliderTooltip?.option('value', value);
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
    this._sliderTooltip?.updatePosition();
  },

  repaint() {
    this._sliderTooltip?.repaint();
  },
});

export default SliderHandle;
