import type { TooltipShowMode, VerticalEdge } from '@js/common';
import numberLocalization from '@js/common/core/localization/number';
import $ from '@js/core/renderer';
import type { Format } from '@js/localization';
import type { OptionChanged } from '@ts/core/widget/types';
import type { TooltipProperties } from '@ts/ui/m_tooltip';
import Tooltip from '@ts/ui/m_tooltip';
import { SliderTooltipPositionController } from '@ts/ui/slider/slider_tooltip_position_controller';

// NOTE: Visibility is contolled by the 'visible' option
// and 'dx-slider-tooltip-visible-on-hover' class
const SLIDER_TOOLTIP_VISIBILITY_CLASS = 'dx-slider-tooltip-visible-on-hover';

export interface SliderTooltipProperties extends TooltipProperties {
  format?: Format;
  position?: VerticalEdge;
  showMode?: TooltipShowMode;
  value?: number;
}

class SliderTooltip extends Tooltip<SliderTooltipProperties> {
  // @ts-expect-error ts-error
  _positionController!: SliderTooltipPositionController;

  _getDefaultOptions(): SliderTooltipProperties {
    return {
      ...super._getDefaultOptions(),
      visible: false,
      position: 'top',
      hideOnOutsideClick: false,
      hideTopOverlayHandler: null,
      hideOnParentScroll: false,
      // @ts-expect-error ts-error
      animation: null,
      // @ts-expect-error ts-error
      arrowPosition: null,
      templatesRenderAsynchronously: false,
      _fixWrapperPosition: false,
      useResizeObserver: false,

      showMode: 'onHover',
      format: (value) => value,
      value: 0,
    };
  }

  _initMarkup(): void {
    super._initMarkup();

    const { visible } = this.option();

    this._attachToMarkup(visible);
    this._toggleShowModeClass();
  }

  _renderContent(): void {
    super._renderContent();
    this._renderContentText();
  }

  // eslint-disable-next-line class-methods-use-this
  _toggleAriaAttributes(): void {}

  _renderContentText(): void {
    const { value, format } = this.option();

    const formattedText = numberLocalization.format(value ?? 0, format);
    this.$content()?.text(formattedText);

    this._renderPosition();
  }

  _toggleShowModeClass(): void {
    const { showMode, target } = this.option();

    const isHoverMode = showMode === 'onHover';
    const $sliderHandle = $(target);

    $sliderHandle.toggleClass(SLIDER_TOOLTIP_VISIBILITY_CLASS, isHoverMode);
  }

  _initPositionController(): void {
    this._positionController = new SliderTooltipPositionController(
      this._getPositionControllerConfig(),
    );
  }

  _attachToMarkup(enabled?: boolean): void {
    const { target } = this.option();
    const $sliderHandle = $(target);

    if (enabled) {
      this.$element().appendTo($sliderHandle);
    } else {
      this.$element().detach();
    }
  }

  _optionChanged(args: OptionChanged<SliderTooltipProperties>): void {
    const { name, value } = args;
    switch (name) {
      case 'visible':
        this._attachToMarkup(value);
        super._optionChanged(args);
        break;
      case 'showMode':
        this._toggleShowModeClass();
        break;
      case 'format':
      case 'value':
        this._renderContentText();
        break;
      default:
        super._optionChanged(args);
        break;
    }
  }

  updatePosition(): void {
    this._renderPosition();
  }
}

export default SliderTooltip;
