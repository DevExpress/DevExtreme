import '../toolbar';
import Popover from '../popover/ui.popover';
import registerComponent from '../../core/component_registrator';
export default class PopoverFull extends Popover {
    _getToolbarName() {
        return 'dxToolbar';
    }
}

PopoverFull.defaultOptions = function(rule) {
    Popover.defaultOptions(rule);
};

registerComponent('dxPopover', PopoverFull);
