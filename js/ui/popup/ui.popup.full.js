import '../toolbar';
import Popup from '../popup/ui.popup';
import registerComponent from '../../core/component_registrator';
export default class PopupFull extends Popup {
    _getToolbarName() {
        return 'dxToolbar';
    }
}

registerComponent('dxPopup', PopupFull);
