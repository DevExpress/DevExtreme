import '@js/ui/toolbar';

import registerComponent from '@js/core/component_registrator';
import Popover from '@js/ui/popover/ui.popover';

import type { PopoverProperties } from './m_popover';

export default class PopoverFull extends Popover {
  _getDefaultOptions(): PopoverProperties {
    return {
      ...super._getDefaultOptions(),
      preventScrollEvents: false,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _getToolbarName(): string {
    return 'dxToolbar';
  }
}

PopoverFull.defaultOptions = function (rule) {
  Popover.defaultOptions(rule);
};

registerComponent('dxPopover', PopoverFull);
