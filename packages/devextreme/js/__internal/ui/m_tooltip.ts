import registerComponent from '@js/core/component_registrator';
import Guid from '@js/core/guid';
import $ from '@js/core/renderer';
import { isWindow } from '@js/core/utils/type';
import Popover from '@js/ui/popover/ui.popover';

import type { PopoverProperties } from './popover/m_popover';

// STYLE tooltip

const TOOLTIP_CLASS = 'dx-tooltip';
const TOOLTIP_WRAPPER_CLASS = 'dx-tooltip-wrapper';

export interface TooltipProperties extends PopoverProperties {}
class Tooltip<
  TProperties extends TooltipProperties = TooltipProperties,
> extends Popover<TProperties> {
  _contentId?: string;

  _getDefaultOptions(): TProperties {
    return {
      ...super._getDefaultOptions(),
      toolbarItems: [],
      showCloseButton: false,
      enableBodyScroll: true,
      showTitle: false,
      title: null,
      titleTemplate: null,
      onTitleRendered: null,
      bottomTemplate: null,
      preventScrollEvents: false,
      propagateOutsideClick: true,
    };
  }

  _render(): void {
    this.$element().addClass(TOOLTIP_CLASS);
    this.$wrapper()?.addClass(TOOLTIP_WRAPPER_CLASS);
    super._render();
  }

  _renderContent(): void {
    super._renderContent();

    this._toggleAriaAttributes();
  }

  _toggleAriaDescription(showing: boolean): void {
    const { target } = this.option();
    const $target = $(target);
    const label = showing ? this._contentId : undefined;

    if (!isWindow($target.get(0))) {
      this.setAria('describedby', label, $target);
    }
  }

  _toggleAriaAttributes(): void {
    this._contentId = `dx-${new Guid()}`;
    // @ts-expect-error ts-error
    this.$overlayContent().attr({
      id: this._contentId,
    });

    this._toggleAriaDescription(true);
  }
}

registerComponent('dxTooltip', Tooltip);

export default Tooltip;
