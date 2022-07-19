import registerComponent from '../../core/component_registrator';

import Popup from '../popup/ui.popup';
import '../toolbar';

export default class PopupFull extends Popup {
    _getToolbarName() {
        return 'dxToolbar';
    }
}

registerComponent('dxPopup', PopupFull);
