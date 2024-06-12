import '../toolbar';
import Popup from '../popup/ui.popup';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
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

PopupFull.defaultOptions = function(rule) {
    Popup.defaultOptions(rule);
};

registerComponent('dxPopup', PopupFull);
