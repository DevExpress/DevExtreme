import DiagramToolbar from './ui.diagram.toolbar';
import DiagramCommandsManager from './diagram.commands_manager';

class DiagramViewToolbar extends DiagramToolbar {
    _getCommands() {
        return DiagramCommandsManager.getViewToolbarCommands(this.option('commands'), this.option('excludeCommands'));
    }
}

export default DiagramViewToolbar;
