import '@js/ui/toolbar';

import registerComponent from '@js/core/component_registrator';
import Popover from '@js/ui/popover/ui.popover';
import type { PopoverProperties } from '@ts/ui/popover/m_popover';

const TOOLBAR_WIDGET_NAME = 'dxToolbar';

export default class PopoverFull extends Popover {
  _getDefaultOptions(): PopoverProperties {
    return {
      ...super._getDefaultOptions(),
      preventScrollEvents: false,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _getToolbarName(): string {
    return TOOLBAR_WIDGET_NAME;
  }
}

// eslint-disable-next-line func-names
PopoverFull.defaultOptions = function (rule): void {
  Popover.defaultOptions(rule);
};

registerComponent('dxPopover', PopoverFull);
