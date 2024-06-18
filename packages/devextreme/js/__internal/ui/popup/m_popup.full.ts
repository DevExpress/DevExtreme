import '@js/ui/toolbar';

import registerComponent from '@js/core/component_registrator';
import { extend } from '@js/core/utils/extend';
import Popup from '@js/ui/popup/ui.popup';

export default class PopupFull extends Popup {
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
PopupFull.defaultOptions = function (rule) {
  Popup.defaultOptions(rule);
};
// @ts-expect-error
registerComponent('dxPopup', PopupFull);
