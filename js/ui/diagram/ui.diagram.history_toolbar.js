import { extend } from '../../core/utils/extend';

import DiagramToolbar from './ui.diagram.toolbar';
import DiagramCommandsManager from './diagram.commands_manager';

class DiagramHistoryToolbar extends DiagramToolbar {
    _getCommands() {
        const commands = DiagramCommandsManager.getHistoryToolbarCommands(this.option('commands'), this._getExcludeCommands());
        commands.forEach(command => {
            if(command.command === DiagramCommandsManager.SHOW_TOOLBOX_COMMAND_NAME) {
                command.icon = this.option('isToolboxVisible') ? 'dx-diagram-i dx-diagram-i-button-toolbox-close' : 'dx-diagram-i dx-diagram-i-button-toolbox-open';
            }
        });
        return commands;
    }
    _getExcludeCommands() {
        const commands = [].concat(this.option('excludeCommands'));
        if(!this.option('isMobileView')) {
            commands.push(DiagramCommandsManager.SHOW_TOOLBOX_COMMAND_NAME);
        }
        return commands;
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'isMobileView':
                this._invalidate();
                break;
            case 'isToolboxVisible':
                this._invalidate();
                break;
            default:
                super._optionChanged(args);
        }
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            isMobileView: false,
            isToolboxVisible: false
        });
    }
}

module.exports = DiagramHistoryToolbar;
