import '@js/ui/toolbar';

import registerComponent from '@js/core/component_registrator';
import Popup from '@js/ui/popup/ui.popup';

import type { PopupProperties } from './m_popup';

export default class PopupFull extends Popup {
  _getDefaultOptions(): PopupProperties {
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

PopupFull.defaultOptions = function (rule) {
  Popup.defaultOptions(rule);
};

registerComponent('dxPopup', PopupFull);
