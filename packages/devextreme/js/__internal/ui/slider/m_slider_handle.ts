import type { TooltipShowMode, VerticalEdge } from '@js/common';
import $ from '@js/core/renderer';
import type { Format } from '@js/localization';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';
import SliderTooltip from '@ts/ui/slider/m_slider_tooltip';

const SLIDER_HANDLE_CLASS = 'dx-slider-handle';

export interface SliderHandlerProperties extends WidgetProperties {
  value?: number;

  tooltip?: {
    enabled?: boolean;
    format?: Format;
    position?: VerticalEdge;
    showMode?: TooltipShowMode;
  };
}

class SliderHandle extends Widget<SliderHandlerProperties> {
  _sliderTooltip?: SliderTooltip | null;

  _getDefaultOptions(): SliderHandlerProperties {
    return {
      ...super._getDefaultOptions(),
      hoverStateEnabled: false,
      value: 0,
      tooltip: {
        enabled: false,
        format: (value) => value,
        position: 'top',
        showMode: 'onHover',
      },
    };
  }

  _initMarkup(): void {
    super._initMarkup();
    this.$element().addClass(SLIDER_HANDLE_CLASS);

    this.setAria({
      role: 'slider',
      // eslint-disable-next-line spellcheck/spell-checker
      valuenow: this.option('value'),
      label: 'Slider',
    });
  }

  _render(): void {
    super._render();
    this._renderTooltip();
  }

  _renderTooltip(): void {
    const { tooltip, value } = this.option();
    const {
      position, format, enabled, showMode,
    } = tooltip ?? {};

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
  }

  _clean(): void {
    super._clean();
    this._sliderTooltip?.dispose();
    this._sliderTooltip = null;
  }

  _updateTooltipOptions(args): void {
    const tooltipOptions = Widget.getOptionsFromContainer(args);
    // @ts-expect-error ts-error
    this._setWidgetOption('_sliderTooltip', [tooltipOptions]);
    this._sliderTooltip?.option('visible', tooltipOptions.enabled);
  }

  _optionChanged(args: OptionChanged<SliderHandlerProperties>): void {
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
        super._optionChanged(args);
    }
  }

  updateTooltipPosition(): void {
    this._sliderTooltip?.updatePosition();
  }

  repaint(): void {
    this._sliderTooltip?.repaint();
  }
}

export default SliderHandle;
