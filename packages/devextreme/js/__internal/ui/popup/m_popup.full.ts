import '@js/ui/toolbar';

import registerComponent from '@js/core/component_registrator';
import Popup from '@js/ui/popup/ui.popup';

import type { PopupProperties } from './m_popup';

const TOOLBAR_WIDGET_NAME = 'dxToolbar';

export default class PopupFull extends Popup {
  protected readonly _toolbarName: string = TOOLBAR_WIDGET_NAME;

  _getDefaultOptions(): PopupProperties {
    return {
      ...super._getDefaultOptions(),
      preventScrollEvents: false,
    };
  }
}

registerComponent('dxPopup', PopupFull);
