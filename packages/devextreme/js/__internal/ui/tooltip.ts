import registerComponent from '@js/core/component_registrator';
import Popover from '@js/ui/popover/ui.popover';
import type { PopoverProperties } from '@ts/ui/popover/popover';

// STYLE tooltip

export interface TooltipProperties extends PopoverProperties {}

const TOOLTIP_CLASS = 'dx-tooltip';
const TOOLTIP_WRAPPER_CLASS = 'dx-tooltip-wrapper';

class Tooltip<
  TProperties extends TooltipProperties = TooltipProperties,
> extends Popover<TProperties> {
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

  // NOTE: dxTooltip keeps its legacy role behavior: only toolbarItems make it
  // a dialog; the Popover showTitle/showCloseButton predicate does not apply.
  _getAriaRole(): string {
    const { toolbarItems } = this.option();

    return toolbarItems?.length ? 'dialog' : 'tooltip';
  }
}

registerComponent('dxTooltip', Tooltip);

export default Tooltip;
