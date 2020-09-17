import DiagramToolbar from './ui.diagram.toolbar';
import DiagramCommandsManager from './diagram.commands_manager';

class DiagramHistoryToolbar extends DiagramToolbar {
    _getCommands() {
        return DiagramCommandsManager.getHistoryToolbarCommands(this.option('commands'), this._getExcludeCommands());
    }
    _getExcludeCommands() {
        const commands = [].concat(this.option('excludeCommands'));
        if(!this.option('isMobileView')) {
            commands.push(DiagramCommandsManager.SHOW_TOOLBOX_COMMAND_NAME);
        }
        return commands;
    }
}

export default DiagramHistoryToolbar;
