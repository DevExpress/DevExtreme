import '@js/ui/toolbar';

import registerComponent from '@js/core/component_registrator';
import { extend } from '@js/core/utils/extend';
import Popover from '@js/ui/popover/ui.popover';

export default class PopoverFull extends Popover {
  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      preventScrollEvents: false,
    });
  }

  _getToolbarName() {
    return 'dxToolbar';
  }
}
// @ts-expect-error
PopoverFull.defaultOptions = function (rule) {
  Popover.defaultOptions(rule);
};
// @ts-expect-error
registerComponent('dxPopover', PopoverFull);
