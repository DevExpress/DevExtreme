import DiagramToolbar from './ui.diagram.toolbar';
import DiagramCommandsManager from './diagram.commands_manager';

class DiagramHistoryToolbar extends DiagramToolbar {
    _getCommands() {
        return DiagramCommandsManager.getHistoryToolbarCommands(this.option('commands'), this.option('excludeCommands'));
    }
}

module.exports = DiagramHistoryToolbar;
