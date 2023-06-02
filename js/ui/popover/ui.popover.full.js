import '../toolbar';
import Popover from '../popover/ui.popover';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
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

PopoverFull.defaultOptions = function(rule) {
    Popover.defaultOptions(rule);
};

registerComponent('dxPopover', PopoverFull);
