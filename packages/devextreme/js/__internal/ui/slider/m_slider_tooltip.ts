import numberLocalization from '@js/common/core/localization/number';
import { extend } from '@js/core/utils/extend';
import Tooltip from '@js/ui/tooltip';

import { SliderTooltipPositionController } from './m_slider_tooltip_position_controller';

// NOTE: Visibility is contolled by the 'visible' option and 'dx-slider-tooltip-visible-on-hover' class.
const SLIDER_TOOLTIP_VISIBILITY_CLASS = 'dx-slider-tooltip-visible-on-hover';

// @ts-expect-error
const SliderTooltip = Tooltip.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
      visible: false,
      position: 'top',
      hideOnOutsideClick: false,
      hideTopOverlayHandler: null,
      hideOnParentScroll: false,
      animation: null,
      arrowPosition: null,
      templatesRenderAsynchronously: false,
      _fixWrapperPosition: false,
      useResizeObserver: false,

      showMode: 'onHover',
      format: (value) => value,
      value: 0,
    });
  },

  _initMarkup() {
    this.callBase();

    this._attachToMarkup(this.option('visible'));
    this._toggleShowModeClass();
  },

  _renderContent() {
    this.callBase();
    this._renderContentText();
  },

  _toggleAriaAttributes() {},

  _renderContentText() {
    const { value, format } = this.option();

    const formattedText = numberLocalization.format(value ?? 0, format);
    this.$content().text(formattedText);

    this._renderPosition();
  },

  _toggleShowModeClass() {
    const isHoverMode = this.option('showMode') === 'onHover';
    const $sliderHandle = this.option('target');

    $sliderHandle.toggleClass(SLIDER_TOOLTIP_VISIBILITY_CLASS, isHoverMode);
  },

  _initPositionController() {
    this._positionController = new SliderTooltipPositionController(
      this._getPositionControllerConfig(),
    );
  },

  _attachToMarkup(enabled) {
    const $sliderHandle = this.option('target');

    enabled
      ? this.$element().appendTo($sliderHandle)
      : this.$element().detach();
  },

  _optionChanged(args) {
    const { name, value } = args;
    switch (name) {
      case 'visible':
        this._attachToMarkup(value);
        this.callBase(args);
        break;
      case 'showMode':
        this._toggleShowModeClass();
        break;
      case 'format':
      case 'value':
        this._renderContentText();
        break;
      default:
        this.callBase(args);
        break;
    }
  },

  updatePosition() {
    this._renderPosition();
  },
});

export default SliderTooltip;
