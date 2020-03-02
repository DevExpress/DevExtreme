import { extend } from '../../core/utils/extend';

import DiagramToolbar from './ui.diagram.toolbar';
import DiagramCommandsManager from './diagram.commands_manager';

class DiagramPropertiesPanelToolbar extends DiagramToolbar {
    _getCommands() {
        const commands = DiagramCommandsManager.getPropertiesPanelToolbarCommands();
        commands.forEach(command => {
            if(command.command === DiagramCommandsManager.SHOW_PROPERTIES_PANEL_COMMAND_NAME) {
                command.icon = this.option('isPropertiesPanelVisible') ? 'close' : 'dx-diagram-i dx-diagram-i-button-properties-panel-open';
            }
        });
        return commands;
    }
    _optionChanged(args) {
        switch(args.name) {
            case 'isPropertiesPanelVisible':
                this._invalidate();
                break;
            default:
                super._optionChanged(args);
        }
    }
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            isPropertiesPanelVisible: false,
        });
    }
}

module.exports = DiagramPropertiesPanelToolbar;
