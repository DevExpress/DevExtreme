import '@js/ui/toolbar';

import registerComponent from '@js/core/component_registrator';
import Popup from '@js/ui/popup/ui.popup';
import type { PopupProperties } from '@ts/ui/popup/m_popup';

const TOOLBAR_WIDGET_NAME = 'dxToolbar';

export default class PopupFull extends Popup {
  _getDefaultOptions(): PopupProperties {
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
PopupFull.defaultOptions = function (rule): void {
  Popup.defaultOptions(rule);
};

registerComponent('dxPopup', PopupFull);
